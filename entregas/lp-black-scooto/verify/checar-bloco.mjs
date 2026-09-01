#!/usr/bin/env node
// Gate estrutural dos blocos da LP Black Scooto (card 018). Node puro.
//
//   node entregas/lp-black-scooto/verify/checar-bloco.mjs <arquivo.html> [--css <arquivo.css>]
//
// Sai 0 só se TUDO passar; senão sai 1 listando cada falha com o número da linha.
// As regras estão escritas no § 9 do ../contrato.md — este arquivo é a versão
// executável delas, e a lista de links permitidos é LIDA de lá (§ 7), para não existir
// uma segunda fonte da verdade que envelhece sozinha.

import {readFile} from "node:fs/promises";
import {basename, dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const RAW_PREFIX =
  "https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CONTRATO = resolve(AQUI, "..", "contrato.md");
const MARCA_INICIO = "<!-- LINKS-PERMITIDOS:INICIO -->";
const MARCA_FIM = "<!-- LINKS-PERMITIDOS:FIM -->";

/**
 * Único seletor global tolerado, só no arquivo abaixo e só com ESTA declaração
 * (§ 9.4 do contrato). O corpo importa tanto quanto o seletor: `html { font-size: 20px }`
 * escapa do bloco e reescala o tema inteiro do WordPress.
 */
const ARQUIVO_COM_EXCECAO = "bloco-a-topo.html";
const SELETOR_EXCECAO = "html";
const DECLARACAO_EXCECAO = "scroll-behavior:smooth";

/** At-rules cujo conteúdo tem seletores de verdade e precisa ser inspecionado. */
const AT_RULES_COM_SELETOR = /^@(media|supports|layer|container)\b/i;

/**
 * @param {string[]} argv
 * @return {{arquivo: string, css: string|null}}
 */
function lerArgumentos(argv) {
  const posicionais = [];
  let css = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--css") {
      css = argv[i + 1] ?? null;
      i += 1;
      if (css === null) {
        throw new Error("--css exige um caminho de arquivo");
      }
    } else {
      posicionais.push(argv[i]);
    }
  }
  if (posicionais.length !== 1) {
    throw new Error("uso: node checar-bloco.mjs <arquivo.html> [--css <arquivo.css>]");
  }
  return {arquivo: posicionais[0], css};
}

/**
 * @param {string} texto
 * @param {number} indice
 * @return {number}
 */
function linhaDe(texto, indice) {
  let linha = 1;
  for (let i = 0; i < indice && i < texto.length; i += 1) {
    if (texto[i] === "\n") {
      linha += 1;
    }
  }
  return linha;
}

/**
 * Lê a lista fechada de links do contrato.md.
 * @return {Promise<Set<string>>}
 */
async function linksPermitidos() {
  const contrato = await readFile(CONTRATO, "utf8");
  const inicio = contrato.indexOf(MARCA_INICIO);
  const fim = contrato.indexOf(MARCA_FIM);
  if (inicio === -1 || fim === -1 || fim < inicio) {
    throw new Error(`contrato.md sem o bloco ${MARCA_INICIO} … ${MARCA_FIM}`);
  }
  const miolo = contrato.slice(inicio + MARCA_INICIO.length, fim);
  const links = miolo
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha !== "" && !linha.startsWith("```"));
  if (links.length === 0) {
    throw new Error("lista de links permitidos vazia no contrato.md");
  }
  return new Set(links);
}

/**
 * Regra 1 e 2: nada de script, handler inline, javascript: ou <form>.
 * @param {string} texto
 * @param {string} arquivo
 * @return {string[]}
 */
function checarProibidos(texto, arquivo) {
  const falhas = [];
  const padroes = [
    [/<script\b/gi, "tag <script> proibida (bloco e zero JS)"],
    [/<form\b/gi, "tag <form> proibida (formulario e widget nativo do Elementor)"],
    [/\son[a-z]{2,}\s*=/gi, "atributo de evento inline proibido"],
    [/javascript\s*:/gi, "URL javascript: proibida"],
  ];
  for (const [regex, mensagem] of padroes) {
    for (const achado of texto.matchAll(regex)) {
      falhas.push(`${arquivo}:${linhaDe(texto, achado.index)}: ${mensagem}`);
    }
  }
  return falhas;
}

/**
 * Regra 3: <img>/<source> só apontam para o repositório de assets.
 * @param {string} texto
 * @param {string} arquivo
 * @return {string[]}
 */
function checarImagens(texto, arquivo) {
  const falhas = [];
  for (const tag of texto.matchAll(/<(img|source)\b[^>]*>/gi)) {
    const src = /\ssrc\s*=\s*["']([^"']*)["']/i.exec(tag[0]);
    const linha = linhaDe(texto, tag.index);
    if (src === null) {
      falhas.push(`${arquivo}:${linha}: <${tag[1].toLowerCase()}> sem src`);
    } else if (!src[1].startsWith(RAW_PREFIX)) {
      falhas.push(`${arquivo}:${linha}: src fora do RAW_PREFIX -> ${src[1]}`);
    }
  }
  return falhas;
}

/**
 * Regra 5: um @import do Google Fonts cobrindo Sora E Roboto.
 * @param {string} texto
 * @param {string} arquivo
 * @return {string[]}
 */
function checarFontes(texto, arquivo) {
  // Cuidado: a URL do css2 tem ';' DENTRO dela (wght@0,400;0,600), entao cortar o
  // @import no primeiro ';' perde a segunda familia. Extraimos a URL, nao a sentenca.
  const comAspas = [...texto.matchAll(/@import\s+(?:url\(\s*)?(['"])([^'"]*)\1/gi)];
  const semAspas = [...texto.matchAll(/@import\s+url\(\s*([^'")\s]+)\s*\)/gi)];
  const imports = [
    ...comAspas.map((achado) => achado[2]),
    ...semAspas.map((achado) => achado[1]),
  ];
  const css2 = imports.filter((url) => /fonts\.googleapis\.com\/css2/i.test(url));
  if (css2.length === 0) {
    return [`${arquivo}:1: sem @import de fonts.googleapis.com/css2`];
  }
  const juntos = css2.join(" ");
  const falhas = [];
  for (const familia of ["Sora", "Roboto"]) {
    if (!juntos.includes(`family=${familia}`)) {
      falhas.push(`${arquivo}:1: @import de fontes sem family=${familia}`);
    }
  }
  return falhas;
}

/**
 * Regra 6: todo href de <a> está na lista fechada do contrato.
 * @param {string} texto
 * @param {Set<string>} permitidos
 * @param {string} arquivo
 * @return {string[]}
 */
function checarLinks(texto, permitidos, arquivo) {
  const falhas = [];
  for (const tag of texto.matchAll(/<a\b[^>]*>/gi)) {
    const href = /\shref\s*=\s*["']([^"']*)["']/i.exec(tag[0]);
    const linha = linhaDe(texto, tag.index);
    if (href === null) {
      falhas.push(`${arquivo}:${linha}: <a> sem href`);
    } else if (!permitidos.has(href[1].trim())) {
      falhas.push(`${arquivo}:${linha}: href fora da lista do contrato -> ${href[1]}`);
    }
  }
  return falhas;
}

/**
 * Regra 7: nenhum resquício de credencial no arquivo.
 * @param {string} texto
 * @param {string} arquivo
 * @return {string[]}
 */
function checarSegredo(texto, arquivo) {
  const falhas = [];
  for (const achado of texto.matchAll(/bearer|authorization/gi)) {
    const linha = linhaDe(texto, achado.index);
    falhas.push(`${arquivo}:${linha}: palavra de credencial no arquivo ("${achado[0]}")`);
  }
  return falhas;
}

/**
 * Varre o CSS e devolve cada seletor com a linha onde a regra abre e o corpo da regra.
 * Ignora o conteúdo de @font-face e de @keyframes (lá "from"/"50%" não são seletores).
 * @param {string} css
 * @param {number} deslocamento linha da primeira linha do css no arquivo original
 * @return {Array<{seletor: string, linha: number, corpo: string}>}
 */
function seletoresDeCss(css, deslocamento) {
  // Comentário vira a MESMA quantidade de "\n": apagar para string vazia encurta o
  // arquivo e faz o gate apontar uma linha que não é a do problema.
  const limpo = css.replace(/\/\*[\s\S]*?\*\//g, (comentario) => {
    return "\n".repeat((comentario.match(/\n/g) ?? []).length);
  });
  const encontrados = [];
  const pendentes = [];
  let prelude = "";
  let corpo = "";
  let linha = deslocamento;
  let ignorando = 0;
  for (const caractere of limpo) {
    if (caractere === "\n") {
      linha += 1;
    }
    if (ignorando > 0) {
      ignorando = acumularCorpo(caractere, ignorando);
      if (ignorando === 0) {
        for (const indice of pendentes.splice(0)) {
          encontrados[indice].corpo = corpo.trim();
        }
        corpo = "";
      } else if (caractere !== "{" || ignorando > 1) {
        corpo += caractere;
      }
      continue;
    }
    if (caractere === "{") {
      const texto = prelude.trim();
      prelude = "";
      corpo = "";
      pendentes.length = 0;
      if (texto.startsWith("@")) {
        ignorando = AT_RULES_COM_SELETOR.test(texto) ? 0 : 1;
      } else {
        for (const parte of texto.split(",")) {
          if (parte.trim() !== "") {
            pendentes.push(encontrados.length);
            encontrados.push({seletor: parte.trim(), linha, corpo: ""});
          }
        }
        ignorando = 1;
      }
    } else if (caractere === "}" || caractere === ";") {
      // "}" fecha um @media; ";" fecha uma at-rule de sentença (@import, @charset).
      // Sem este reset, o @import gruda no primeiro seletor do arquivo e ele passa
      // sem ser checado.
      prelude = "";
    } else {
      prelude += caractere;
    }
  }
  return encontrados;
}

/**
 * Conta as chaves do corpo de uma regra. Devolve a profundidade nova (0 = regra fechou).
 * @param {string} caractere
 * @param {number} profundidade
 * @return {number}
 */
function acumularCorpo(caractere, profundidade) {
  switch (caractere) {
    case "{":
      return profundidade + 1;
    case "}":
      return profundidade - 1;
    default:
      return profundidade;
  }
}

/**
 * Normaliza as declarações de uma regra para comparação: sem espaço, sem ";" final,
 * em minúsculas.
 * @param {string} corpo
 * @return {string}
 */
function normalizarDeclaracoes(corpo) {
  return corpo.replace(/\s+/g, "").replace(/;+$/, "").toLowerCase();
}

/**
 * Regra 4 aplicada a um pedaço de CSS.
 * @param {string} css
 * @param {number} deslocamento
 * @param {string} arquivo
 * @param {boolean} aceitaExcecao
 * @return {string[]}
 */
function checarSeletores(css, deslocamento, arquivo, aceitaExcecao) {
  const falhas = [];
  for (const {seletor, linha, corpo} of seletoresDeCss(css, deslocamento)) {
    if (seletor.startsWith(".lpb-")) {
      continue;
    }
    if (seletor !== SELETOR_EXCECAO) {
      falhas.push(`${arquivo}:${linha}: seletor fora do namespace .lpb- -> ${seletor}`);
      continue;
    }
    const declaracoes = normalizarDeclaracoes(corpo);
    if (declaracoes !== DECLARACAO_EXCECAO) {
      falhas.push(
        `${arquivo}:${linha}: ${SELETOR_EXCECAO}{} so aceita "${DECLARACAO_EXCECAO}" ` +
          `-> encontrado "${declaracoes}"`,
      );
    }
    if (!aceitaExcecao) {
      falhas.push(
        `${arquivo}:${linha}: ${SELETOR_EXCECAO}{} so e permitido em ${ARQUIVO_COM_EXCECAO}`,
      );
    }
  }
  return falhas;
}

/**
 * Regra 4 no HTML: exige <style> e checa os seletores de cada um.
 * @param {string} texto
 * @param {string} arquivo
 * @return {string[]}
 */
function checarCssDoHtml(texto, arquivo) {
  const blocos = [...texto.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
  if (blocos.length === 0) {
    return [`${arquivo}:1: bloco sem <style> (cada bloco carrega o proprio CSS)`];
  }
  const aceitaExcecao = basename(arquivo) === ARQUIVO_COM_EXCECAO;
  const falhas = [];
  for (const bloco of blocos) {
    const inicioCss = bloco.index + bloco[0].indexOf(bloco[1]);
    falhas.push(
      ...checarSeletores(bloco[1], linhaDe(texto, inicioCss), arquivo, aceitaExcecao),
    );
  }
  return falhas;
}

async function principal() {
  const {arquivo, css} = lerArgumentos(process.argv.slice(2));
  const texto = await readFile(arquivo, "utf8");
  const permitidos = await linksPermitidos();
  const falhas = [
    ...checarProibidos(texto, arquivo),
    ...checarImagens(texto, arquivo),
    ...checarCssDoHtml(texto, arquivo),
    ...checarFontes(texto, arquivo),
    ...checarLinks(texto, permitidos, arquivo),
    ...checarSegredo(texto, arquivo),
  ];
  if (css !== null) {
    const textoCss = await readFile(css, "utf8");
    falhas.push(...checarSeletores(textoCss, 1, css, false));
    falhas.push(...checarSegredo(textoCss, css));
  }
  if (falhas.length > 0) {
    console.error(`FALHOU: ${arquivo} — ${falhas.length} problema(s)`);
    for (const falha of falhas) {
      console.error(`  ${falha}`);
    }
    process.exit(1);
  }
  console.log(`OK: ${arquivo}${css === null ? "" : ` + ${css}`}`);
}

principal().catch((erro) => {
  console.error(`ERRO: ${erro instanceof Error ? erro.message : String(erro)}`);
  process.exit(1);
});
