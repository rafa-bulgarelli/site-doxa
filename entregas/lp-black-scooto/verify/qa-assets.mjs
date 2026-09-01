#!/usr/bin/env node
// Auditoria das imagens da LP Black Scooto (card 018, track E). Node puro, zero dep.
//
//   node entregas/lp-black-scooto/verify/qa-assets.mjs           # local + HEAD remoto
//   node entregas/lp-black-scooto/verify/qa-assets.mjs --local   # só o disco
//
// A LISTA NÃO É ESCRITA AQUI: sai do `contrato.md` (`RAW_PREFIX` do bloco cercado do
// § 4 e a tabela *Imagens* logo abaixo). Duplicar a lista num script é como o arquivo e
// o banco divergirem sem ninguém ver — o gate passaria auditando o que ele mesmo
// inventou.
//
// O que reprova (exit 1):
//   1. asset da tabela que não existe em `assets/`;
//   2. asset acima de 400 KB — `raw.githubusercontent` não tem CDN na frente, cada KB
//      é latência na cara do visitante;
//   3. extensão que não bate com o conteúdo (assinatura do arquivo), o clássico
//      ".png" que por dentro é JPEG e algum navegador recusa;
//   4. URL `RAW_PREFIX` usada num bloco/CSS que não está na tabela do contrato — inclui
//      `url()` de CSS, que o `checar-bloco.mjs` não cobre (ele só olha `<img>`);
//   5. sem `--local`: `HEAD` que não devolva 200 com `content-type` de imagem.

import {readdir, readFile, stat} from "node:fs/promises";
import {dirname, extname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const LIMITE_BYTES = 400 * 1024;
const TEMPO_LIMITE_MS = 20000;

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const DIR_ASSETS = join(RAIZ, "assets");
const CONTRATO = join(RAIZ, "contrato.md");

/** Assinatura de arquivo por extensão: o que os primeiros bytes TÊM que ser. */
const ASSINATURAS = new Map([
  [".png", (b) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))],
  [".jpg", (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  [".jpeg", (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  [".gif", (b) => b.subarray(0, 6).toString("latin1").startsWith("GIF8")],
  [
    ".webp",
    (b) =>
      b.subarray(0, 4).toString("latin1") === "RIFF" &&
      b.subarray(8, 12).toString("latin1") === "WEBP",
  ],
  [
    ".svg",
    (b) => {
      const cabeca = b.subarray(0, 512).toString("utf8").trimStart();
      return cabeca.startsWith("<?xml") || cabeca.startsWith("<svg") || cabeca.startsWith("<!--");
    },
  ],
]);

/**
 * @param {string} texto
 * @return {string}
 */
function lerPrefixoRaw(texto) {
  const bloco = texto.match(/```\s*\n(https:\/\/raw\.githubusercontent\.com\/\S+)\s*\n```/);
  if (bloco === null) {
    throw new Error("RAW_PREFIX nao encontrado no bloco cercado do contrato.md");
  }
  return bloco[1];
}

/**
 * Nomes de asset da tabela *Imagens* do § 4, na ordem em que aparecem.
 *
 * A tabela tem 3 colunas e a primeira é o nome do arquivo entre crases. Linhas de
 * cabeçalho e separador (`|---|`) caem fora porque não têm crase.
 * @param {string} texto
 * @return {Array<{asset: string, nota: string}>}
 */
function lerTabelaImagens(texto) {
  const secao = texto.split(/^## /m).find((s) => s.startsWith("4. Imagens"));
  if (secao === undefined) {
    throw new Error('secao "## 4. Imagens" nao encontrada no contrato.md');
  }
  const linhas = [];
  for (const linha of secao.split("\n")) {
    const colunas = linha.split("|");
    if (colunas.length < 4) {
      continue;
    }
    const nome = colunas[1].trim().match(/^`([^`]+)`$/);
    if (nome === null) {
      continue;
    }
    linhas.push({asset: nome[1], nota: colunas[3].trim()});
  }
  if (linhas.length === 0) {
    throw new Error("tabela *Imagens* do contrato.md veio vazia");
  }
  return linhas;
}

/**
 * Toda URL `RAW_PREFIX` usada nos blocos e no CSS dos forms → arquivos onde aparece.
 * Pega `<img src>`, `<source srcset>` e `url()` de CSS de uma vez, porque o que
 * interessa é o nome do arquivo, não a sintaxe que o cita.
 * @param {string} prefixo
 * @return {Promise<Map<string, string[]>>}
 */
async function coletarUsos(prefixo) {
  const usos = new Map();
  const dirs = [join(RAIZ, "blocos"), join(RAIZ, "form")];
  for (const dir of dirs) {
    for (const arquivo of await readdir(dir)) {
      if (!/\.(html|css)$/.test(arquivo) || arquivo.startsWith("form-mock")) {
        continue;
      }
      const texto = await readFile(join(dir, arquivo), "utf8");
      for (const trecho of texto.split(prefixo).slice(1)) {
        const nome = trecho.match(/^[A-Za-z0-9._-]+/);
        if (nome === null) {
          continue;
        }
        const lista = usos.get(nome[0]) ?? [];
        lista.push(arquivo);
        usos.set(nome[0], lista);
      }
    }
  }
  return usos;
}

/**
 * @param {string} asset
 * @return {Promise<{bytes: number, assinaturaOk: boolean|null, erro?: string}>}
 */
async function auditarLocal(asset) {
  const caminho = join(DIR_ASSETS, asset);
  try {
    const info = await stat(caminho);
    const conferir = ASSINATURAS.get(extname(asset).toLowerCase());
    if (conferir === undefined) {
      return {bytes: info.size, assinaturaOk: null};
    }
    const cabeca = (await readFile(caminho)).subarray(0, 512);
    return {bytes: info.size, assinaturaOk: conferir(cabeca)};
  } catch (erro) {
    return {
      bytes: -1,
      assinaturaOk: null,
      erro: erro instanceof Error ? erro.message : String(erro),
    };
  }
}

/**
 * @param {string} url
 * @return {Promise<{status: number, tipo: string, erro?: string}>}
 */
async function auditarRemoto(url) {
  const abortar = AbortSignal.timeout(TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(url, {method: "HEAD", signal: abortar});
    return {
      status: resposta.status,
      tipo: (resposta.headers.get("content-type") ?? "").split(";")[0].trim(),
    };
  } catch (erro) {
    return {status: 0, tipo: "", erro: erro instanceof Error ? erro.message : String(erro)};
  }
}

/**
 * @param {string[]} cabecalho
 * @param {string[][]} linhas
 * @return {string}
 */
function montarTabela(cabecalho, linhas) {
  const todas = [cabecalho, ...linhas];
  const larguras = cabecalho.map((_, c) => Math.max(...todas.map((l) => l[c].length)));
  const formata = (linha) => linha.map((v, c) => v.padEnd(larguras[c])).join("  ");
  return [
    formata(cabecalho),
    larguras.map((n) => "-".repeat(n)).join("  "),
    ...linhas.map(formata),
  ].join("\n");
}

/**
 * @param {number} bytes
 * @return {string}
 */
function emKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}`;
}

/**
 * Auditoria de um asset: devolve a linha da tabela e os problemas encontrados.
 * @param {{asset: string, nota: string}} item
 * @param {string[]} ondeUsado
 * @param {{status: number, tipo: string, erro?: string}|null} remoto
 * @param {{bytes: number, assinaturaOk: boolean|null, erro?: string}} disco
 * @return {{linha: string[], problemas: string[]}}
 */
function julgar(item, ondeUsado, remoto, disco) {
  const {asset, nota} = item;
  const problemas = [];
  if (disco.bytes < 0) {
    problemas.push(`${asset}: nao existe em assets/ (${disco.erro})`);
  } else if (disco.bytes > LIMITE_BYTES) {
    problemas.push(`${asset}: ${emKb(disco.bytes)} KB acima do limite de 400 KB`);
  }
  if (disco.assinaturaOk === false) {
    problemas.push(`${asset}: conteudo nao bate com a extensao ${extname(asset)}`);
  }
  if (remoto !== null && remoto.status !== 200) {
    problemas.push(`${asset}: HEAD devolveu ${remoto.status} ${remoto.erro ?? ""}`.trim());
  }
  if (remoto !== null && remoto.status === 200 && !remoto.tipo.startsWith("image/")) {
    problemas.push(`${asset}: content-type "${remoto.tipo}" nao e de imagem`);
  }
  const linha = [
    asset,
    disco.bytes < 0 ? "AUSENTE" : "ok",
    disco.bytes < 0 ? "-" : emKb(disco.bytes),
    disco.assinaturaOk === null ? "n/a" : disco.assinaturaOk ? "ok" : "NAO BATE",
    ondeUsado.length === 0 ? `- (${nota.slice(0, 24)})` : [...new Set(ondeUsado)].join(","),
    remoto === null ? "SKIP" : String(remoto.status),
    remoto === null ? "SKIP" : remoto.tipo || (remoto.erro ?? "-"),
  ];
  return {linha, problemas};
}

async function principal() {
  const local = process.argv.includes("--local");
  const texto = await readFile(CONTRATO, "utf8");
  const prefixo = lerPrefixoRaw(texto);
  const tabela = lerTabelaImagens(texto);
  const usos = await coletarUsos(prefixo);
  console.log(`RAW_PREFIX (lido do contrato.md): ${prefixo}`);
  console.log(`tabela *Imagens* do contrato: ${tabela.length} assets`);
  console.log(local ? "modo: --local (SKIP remoto)" : "modo: local + HEAD remoto");

  const problemas = [];
  const linhas = [];
  for (const item of tabela) {
    const disco = await auditarLocal(item.asset);
    const remoto = local ? null : await auditarRemoto(prefixo + item.asset);
    const veredito = julgar(item, usos.get(item.asset) ?? [], remoto, disco);
    linhas.push(veredito.linha);
    problemas.push(...veredito.problemas);
  }

  // Um asset citado num bloco e ausente da tabela do contrato é uma imagem que o gate
  // nunca vai auditar — e no dia em que sumir do repositório público, quebra calada.
  for (const [asset, arquivos] of usos) {
    if (!tabela.some((t) => t.asset === asset)) {
      problemas.push(`${asset}: usado em ${[...new Set(arquivos)].join(", ")} e FORA da tabela`);
    }
  }

  console.log("");
  console.log(
    montarTabela(
      ["asset", "disco", "KB", "assinatura", "usado em", "HTTP", "content-type"],
      linhas,
    ),
  );
  console.log("\nlimite de peso: 400 KB por arquivo");

  if (problemas.length > 0) {
    console.error("");
    for (const p of problemas) {
      console.error(`FALHA ${p}`);
    }
    return 1;
  }
  console.log("OK: nenhuma violacao.");
  return 0;
}

principal()
  .then((codigo) => process.exit(codigo))
  .catch((erro) => {
    console.error(`ERRO: ${erro instanceof Error ? erro.message : String(erro)}`);
    process.exit(1);
  });
