#!/usr/bin/env node
// Preview local da LP Black Scooto (card 018). Node puro, sem dependência.
//
// Monta os blocos das tracks A/B/C/D na ORDEM canônica do contrato.md e serve os
// binários de ../assets no lugar do RAW_PREFIX, para que o MESMO HTML que vai para o
// Elementor rode aqui sem edição.
//
//   node entregas/lp-black-scooto/verify/servir.mjs --porta 5310
//     /                    página inteira
//     /?bloco=hero         só o scaffold do hero
//     /?bloco=<nome>       só um fragmento
//     /assets/<arquivo>    binário de ../assets
//
// Porta ocupada FALHA (exit 1). Cair em outra porta em silêncio já fez um executor
// medir o dist da worktree errada — aqui isso não acontece.

import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {dirname, extname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const RAW_PREFIX =
  "https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const DIR_ASSETS = join(RAIZ, "assets");

/** Fragmentos que o preview conhece: nome público → caminho no disco. */
const FRAGMENTOS = new Map([
  ["bloco-a-topo", join(RAIZ, "blocos", "bloco-a-topo.html")],
  ["bloco-a-hero-form-topo", join(RAIZ, "blocos", "bloco-a-hero-form-topo.html")],
  ["bloco-b-meio", join(RAIZ, "blocos", "bloco-b-meio.html")],
  ["bloco-c-final", join(RAIZ, "blocos", "bloco-c-final.html")],
  ["bloco-c-pos-form", join(RAIZ, "blocos", "bloco-c-pos-form.html")],
  ["form-mock", join(RAIZ, "form", "form-mock.html")],
  ["form-mock-hero", join(RAIZ, "form", "form-mock-hero.html")],
]);

/** Espelha o § 1 do contrato.md. "hero" é composto (ver montarHero). */
const ORDEM = ["hero", "bloco-b-meio", "bloco-c-final", "form-mock", "bloco-c-pos-form"];

/** CSS do scaffold: imita as colunas do § 2 do contrato. Prefixo .lpbprev- é só daqui. */
const CSS_PREVIEW = `
  body { margin: 0; background: #fff; }
  .lpbprev-hero { background: #f2f2e8; padding: 80px 80px 0; }
  .lpbprev-hero-linha { display: flex; align-items: center; gap: 64px;
    max-width: 1280px; margin: 0 auto; padding: 80px 24px; }
  .lpbprev-hero-esq { display: flex; flex-direction: column; width: 584px; }
  .lpbprev-hero-dir { width: 584px; display: flex; justify-content: center; }
  .lpbprev-hero-dir img { width: 612px; max-width: 100%; height: auto; }
  .lpbprev-falta { border: 1px dashed #f12d64; color: #f12d64; padding: 12px 16px;
    font: 14px/1.4 monospace; }
  @media (max-width: 900px) {
    .lpbprev-hero { padding: 24px 16px 0; }
    .lpbprev-hero-linha { flex-direction: column; gap: 32px; padding: 24px 0; }
    .lpbprev-hero-esq, .lpbprev-hero-dir { width: 100%; }
  }
`;

/**
 * Lê --porta da linha de comando.
 * @param {string[]} argv
 * @return {number}
 */
function lerPorta(argv) {
  const i = argv.indexOf("--porta");
  if (i === -1 || argv[i + 1] === undefined) {
    throw new Error("uso: node servir.mjs --porta <numero>");
  }
  const porta = Number(argv[i + 1]);
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error(`porta invalida: ${argv[i + 1]}`);
  }
  return porta;
}

/**
 * Devolve o fragmento com o RAW_PREFIX trocado pelo preview.
 *
 * Nome desconhecido devolve `null`. Arquivo que ainda não existe NÃO é erro (as tracks
 * rodam em paralelo): avisa no console e devolve um marcador `.lpbprev-falta`, para a
 * página continuar montando e o buraco ficar visível.
 * @param {string} nome
 * @return {Promise<string|null>}
 */
async function lerFragmento(nome) {
  const caminho = FRAGMENTOS.get(nome);
  if (caminho === undefined) {
    return null;
  }
  try {
    const bruto = await readFile(caminho, "utf8");
    return bruto.split(RAW_PREFIX).join("/assets/");
  } catch (erro) {
    const causa = erro instanceof Error ? erro.message : String(erro);
    console.warn(`[preview] pulando "${nome}": ${causa}`);
    return `<div class="lpbprev-falta">fragmento ausente: ${nome}</div>`;
  }
}

/**
 * Scaffold do hero: coluna esquerda (bloco-a-topo + card com o topo e o form mock) e
 * coluna direita (a foto). Só existe no preview — no Elementor isso são containers.
 * @return {Promise<string>}
 */
async function montarHero() {
  const topo = await lerFragmento("bloco-a-topo");
  const cardTopo = await lerFragmento("bloco-a-hero-form-topo");
  const formHero = await lerFragmento("form-mock-hero");
  return [
    '<section class="lpbprev-hero"><div class="lpbprev-hero-linha">',
    '<div class="lpbprev-hero-esq">',
    topo,
    '<div class="lpb-hero-card">',
    cardTopo,
    formHero,
    "</div></div>",
    '<div class="lpbprev-hero-dir">',
    '<img src="/assets/hero-foto-scooteira.png" alt="Scooteira da Scooto">',
    "</div></div></section>",
  ].join("\n");
}

/**
 * @param {string} nome
 * @return {Promise<string>}
 */
async function montarPedaco(nome) {
  if (nome === "hero") {
    return montarHero();
  }
  const fragmento = await lerFragmento(nome);
  if (fragmento === null) {
    throw new Error(`bloco desconhecido: ${nome}`);
  }
  return fragmento;
}

/**
 * @param {string} corpo
 * @param {string} titulo
 * @return {string}
 */
function paginaHtml(corpo, titulo) {
  return [
    "<!doctype html>",
    '<html lang="pt-BR">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${titulo}</title>`,
    `<style>${CSS_PREVIEW}</style>`,
    "</head>",
    "<body>",
    corpo,
    "</body>",
    "</html>",
  ].join("\n");
}

/**
 * @param {string} arquivo
 * @return {string}
 */
function tipoConteudo(arquivo) {
  switch (extname(arquivo).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

/**
 * Serve ../assets/<arquivo>. Recusa qualquer nome com separador ou "..": o preview não
 * é um servidor de arquivos, é uma janela para um diretório só.
 * @param {import("node:http").ServerResponse} res
 * @param {string} nome
 */
async function servirAsset(res, nome) {
  if (nome === "" || nome.includes("/") || nome.includes("\\") || nome.includes("..")) {
    responder(res, 400, "text/plain; charset=utf-8", "nome de asset invalido");
    return;
  }
  try {
    const dados = await readFile(join(DIR_ASSETS, nome));
    responder(res, 200, tipoConteudo(nome), dados);
  } catch {
    responder(res, 404, "text/plain; charset=utf-8", `asset nao encontrado: ${nome}`);
  }
}

/**
 * @param {import("node:http").ServerResponse} res
 * @param {number} status
 * @param {string} tipo
 * @param {string|Buffer} corpo
 */
function responder(res, status, tipo, corpo) {
  res.writeHead(status, {"content-type": tipo, "cache-control": "no-store"});
  res.end(corpo);
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
async function tratar(req, res) {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname.startsWith("/assets/")) {
    await servirAsset(res, decodeURIComponent(url.pathname.slice("/assets/".length)));
    return;
  }
  if (url.pathname !== "/") {
    responder(res, 404, "text/plain; charset=utf-8", "rota inexistente");
    return;
  }
  const bloco = url.searchParams.get("bloco");
  if (bloco !== null && bloco !== "hero" && !FRAGMENTOS.has(bloco)) {
    responder(res, 400, "text/plain; charset=utf-8", `bloco desconhecido: ${bloco}`);
    return;
  }
  const nomes = bloco === null ? ORDEM : [bloco];
  const pedacos = [];
  for (const nome of nomes) {
    pedacos.push(await montarPedaco(nome));
  }
  const titulo = bloco === null ? "LP Black Scooto — preview" : `LP Black — ${bloco}`;
  responder(res, 200, "text/html; charset=utf-8", paginaHtml(pedacos.join("\n"), titulo));
}

/**
 * Falha se a porta já estiver ocupada em QUALQUER uma das duas pilhas.
 *
 * Não basta esperar o EADDRINUSE do listen: um processo que prendeu só `[::1]:N`
 * (bind específico) convive com um listen em `*:N` (curinga) sem erro nenhum, e aí
 * `curl localhost:N` — que resolve ::1 primeiro — cai no servidor do vizinho. Já
 * aconteceu aqui: os curls do VERIFY estavam medindo o preview de OUTRA worktree.
 * @param {number} porta
 * @return {Promise<void>}
 */
async function exigirPortaLivre(porta) {
  for (const host of ["127.0.0.1", "::1"]) {
    await new Promise((cumprir, rejeitar) => {
      const sonda = createServer();
      sonda.once("error", (erro) => {
        const codigo = /** @type {NodeJS.ErrnoException} */ (erro).code;
        if (codigo === "EADDRINUSE") {
          rejeitar(new Error(`porta ${porta} ja ocupada em ${host}`));
          return;
        }
        cumprir(undefined); // sem IPv6 na maquina, por exemplo: nada a checar
      });
      sonda.listen(porta, host, () => {
        sonda.close(() => cumprir(undefined));
      });
    });
  }
}

async function principal() {
  const porta = lerPorta(process.argv.slice(2));
  await exigirPortaLivre(porta);
  const servidor = createServer((req, res) => {
    tratar(req, res).catch((erro) => {
      const causa = erro instanceof Error ? erro.message : String(erro);
      responder(res, 500, "text/plain; charset=utf-8", causa);
    });
  });
  servidor.on("error", (erro) => {
    const codigo = /** @type {NodeJS.ErrnoException} */ (erro).code;
    if (codigo === "EADDRINUSE") {
      console.error(`ERRO: porta ${porta} ocupada. Escolha outra com --porta.`);
    } else {
      console.error(`ERRO ao subir o preview: ${erro.message}`);
    }
    process.exit(1);
  });
  servidor.listen(porta, () => {
    console.log(`[preview] LP Black em http://localhost:${porta}/`);
    console.log(`[preview] fragmentos: ${[...FRAGMENTOS.keys()].join(", ")}, hero`);
  });
}

principal().catch((erro) => {
  console.error(`ERRO: ${erro instanceof Error ? erro.message : String(erro)}`);
  process.exit(1);
});
