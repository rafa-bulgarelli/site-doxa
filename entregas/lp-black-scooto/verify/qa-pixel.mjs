#!/usr/bin/env node
// QA de pixel da LP Black Scooto (card 018, track E). Node puro, zero dependência.
//
// Compara o render dos blocos com os PNGs do Figma. NÃO sobe servidor: o preview
// (`servir.mjs --porta 5315`) tem que estar no ar antes.
//
//   node entregas/lp-black-scooto/verify/qa-pixel.mjs --porta 5315
//     [--limiar 20]   % de pixels divergentes que reprova um alvo
//     [--saida qa]    diretório dos artefatos, relativo a entregas/lp-black-scooto
//
// POR QUE SEM pixelmatch/sharp: `package.json` é intocável nesta track. O diff é
// computado DENTRO do Chrome — os dois PNGs viram data URL, entram num <canvas>,
// `getImageData` conta os pixels divergentes e `toDataURL` devolve o PNG de diff.
//
// POR QUE POR SEÇÃO, E NÃO SÓ A PÁGINA INTEIRA: o render é ~400px mais alto que o
// frame do Figma (o Figma trunca copy com reticências e o bloco mostra o texto
// inteiro — decisão registrada no card). Num diff de página única esse desalinho
// vertical se acumula e contamina tudo que vem depois. Recortando CADA seção pela
// própria caixa no DOM, o desalinho não vaza de uma seção para a seguinte, e o
// delta de altura vira NÚMERO REPORTADO em vez de ruído. A página inteira continua
// sendo comparada (é o alvo `pagina`), porque é ela que pega bloco na ordem errada
// ou seção faltando.

import {spawn} from "node:child_process";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LARGURA = 1440;
const TOLERANCIA_CANAL = 8;
const LIMIAR_PADRAO = 20;

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const DIR_FIGMA = join(RAIZ, "figma");

/**
 * Um alvo de comparação. `inicio`/`fim` são seletores CSS na PÁGINA INTEIRA: o recorte
 * vai do topo do primeiro até a base do segundo (as seções do Figma são full-bleed,
 * então a faixa horizontal é sempre 0..1440). `inicio: null` = documento inteiro.
 *
 * O mapa foi conferido pela soma: as 11 alturas dos PNGs de seção dão 9327 contra
 * 9326 do `frame-completo.png` — as seções ladrilham o frame sem sobra.
 * @typedef {{alvo: string, inicio: string|null, fim: string|null, figma: string}} Alvo
 */

/** @type {Alvo[]} */
const ALVOS = [
  {alvo: "pagina", inicio: null, fim: null, figma: "frame-completo.png"},
  // `.lpbprev-hero` é o scaffold do preview; no Elementor é o container do hero. A
  // faixa de 4 selos (`.lpb-selos`) abre o bloco B mas pertence à seção 01 do Figma.
  {
    alvo: "secao-01-hero",
    inicio: ".lpbprev-hero",
    fim: ".lpb-selos",
    figma: "secao-01-hero.png",
  },
  {
    alvo: "secao-02-identificacao",
    inicio: ".lpb-ident",
    fim: ".lpb-ident",
    figma: "secao-02-identificacao.png",
  },
  {alvo: "secao-03-oferta", inicio: ".lpb-oferta", fim: ".lpb-oferta", figma: "secao-03-oferta.png"},
  {
    alvo: "secao-04-urgencia",
    inicio: ".lpb-urgencia",
    fim: ".lpb-urgencia",
    figma: "secao-04-urgencia.png",
  },
  {
    alvo: "secao-05-contratacao",
    inicio: ".lpb-frentes",
    fim: ".lpb-frentes",
    figma: "secao-05-contratacao.png",
  },
  {
    alvo: "secao-06-autoridade",
    inicio: ".lpb-autoridade",
    fim: ".lpb-autoridade",
    figma: "secao-06-autoridade.png",
  },
  {
    alvo: "secao-07-prova-social",
    inicio: ".lpb-prova",
    fim: ".lpb-prova",
    figma: "secao-07-prova-social.png",
  },
  {
    alvo: "secao-08-como-funciona",
    inicio: ".lpb-passos",
    fim: ".lpb-passos",
    figma: "secao-08-como-funciona.png",
  },
  {alvo: "secao-09-faq", inicio: ".lpb-faq", fim: ".lpb-faq", figma: "secao-09-faq.png"},
  // Seção 10 = moldura do form (bloco C) + widget Form + "Prefere falar direto?".
  {
    alvo: "secao-10-formulario-completo",
    inicio: ".lpb-orcamento",
    fim: ".lpb-fecho",
    figma: "secao-10-formulario-completo.png",
  },
  {alvo: "secao-11-footer", inicio: ".lpb-rodape", fim: ".lpb-rodape", figma: "secao-11-footer.png"},
];

/** Blocos capturados só como artefato do gate visual do assento (sem par no Figma). */
const BLOCOS = [
  "hero",
  "bloco-a-topo",
  "bloco-a-hero-form-topo",
  "bloco-b-meio",
  "bloco-c-final",
  "form-mock",
  "form-mock-hero",
  "bloco-c-pos-form",
];

/**
 * @param {number} ms
 * @return {Promise<void>}
 */
function esperar(ms) {
  return new Promise((cumprir) => setTimeout(cumprir, ms));
}

/**
 * @param {string[]} argv
 * @return {{porta: number, limiar: number, dirSaida: string}}
 */
function lerArgumentos(argv) {
  const porta = Number(lerOpcao(argv, "--porta", ""));
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error("uso: node qa-pixel.mjs --porta <numero> [--limiar 20] [--saida qa]");
  }
  const limiar = Number(lerOpcao(argv, "--limiar", String(LIMIAR_PADRAO)));
  if (Number.isNaN(limiar) || limiar <= 0 || limiar > 100) {
    throw new Error(`limiar invalido: ${lerOpcao(argv, "--limiar", "")}`);
  }
  return {porta, limiar, dirSaida: resolve(RAIZ, lerOpcao(argv, "--saida", "qa"))};
}

/**
 * @param {string[]} argv
 * @param {string} nome
 * @param {string} padrao
 * @return {string}
 */
function lerOpcao(argv, nome, padrao) {
  const i = argv.indexOf(nome);
  if (i === -1 || argv[i + 1] === undefined) {
    return padrao;
  }
  return argv[i + 1];
}

/**
 * Espera o Chrome subir e devolve a primeira aba (`type === "page"`).
 * @param {number} portaCdp
 * @return {Promise<{webSocketDebuggerUrl: string}|undefined>}
 */
async function esperarAba(portaCdp) {
  for (let i = 0; i < 80; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${portaCdp}/json`)).json();
      const aba = lista.find((t) => t.type === "page");
      if (aba !== undefined) {
        return aba;
      }
    } catch {
      // Chrome ainda subindo: tentar de novo.
    }
    await esperar(250);
  }
  return undefined;
}

/**
 * Sessão de DevTools Protocol: sobe um Chrome headless próprio e devolve o `chamar`.
 * @return {Promise<{chamar: (m: string, p?: object) => Promise<object>, fechar: () => void}>}
 */
async function abrirChrome() {
  const portaCdp = 9222 + Math.floor(Math.random() * 500);
  const processo = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      `--remote-debugging-port=${portaCdp}`,
      `--user-data-dir=/tmp/claude-501/chrome-qa-pixel-${portaCdp}`,
      "about:blank",
    ],
    {stdio: "ignore"},
  );
  const aba = await esperarAba(portaCdp);
  if (aba === undefined) {
    processo.kill();
    throw new Error(`Chrome nao respondeu em 127.0.0.1:${portaCdp}`);
  }
  const ws = new WebSocket(aba.webSocketDebuggerUrl);
  await new Promise((cumprir) => ws.addEventListener("open", cumprir));
  let id = 0;
  const pendentes = new Map();
  ws.addEventListener("message", (evento) => {
    const msg = JSON.parse(evento.data);
    const resolver = pendentes.get(msg.id);
    if (resolver !== undefined) {
      pendentes.delete(msg.id);
      resolver(msg);
    }
  });
  const chamar = (metodo, params = {}) =>
    new Promise((cumprir) => {
      const i = ++id;
      pendentes.set(i, cumprir);
      ws.send(JSON.stringify({id: i, method: metodo, params}));
    });
  return {
    chamar,
    fechar: () => {
      ws.close();
      processo.kill();
    },
  };
}

/**
 * `Runtime.evaluate` que explode em vez de devolver `undefined` silencioso.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {string} expressao
 * @param {boolean} aguardarPromessa
 * @return {Promise<unknown>}
 */
async function avaliar(chamar, expressao, aguardarPromessa = false) {
  const resposta = await chamar("Runtime.evaluate", {
    expression: expressao,
    returnByValue: true,
    awaitPromise: aguardarPromessa,
  });
  const resultado = resposta.result;
  if (resultado === undefined) {
    throw new Error(`Runtime.evaluate sem resultado: ${JSON.stringify(resposta).slice(0, 400)}`);
  }
  if (resultado.exceptionDetails !== undefined) {
    const texto =
      resultado.exceptionDetails.exception?.description ?? resultado.exceptionDetails.text;
    throw new Error(`erro no navegador: ${texto}`);
  }
  return resultado.result.value;
}

/**
 * Abre a URL a 1440px e espera fontes + imagens. Devolve a altura do documento.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {string} url
 * @return {Promise<{altura: number, largura: number, fontes: {sora: boolean, roboto: boolean}}>}
 */
async function abrirEmDesktop(chamar, url) {
  await chamar("Emulation.setDeviceMetricsOverride", {
    width: LARGURA,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await chamar("Page.enable");
  await chamar("Page.navigate", {url});
  await esperar(1500);
  // Fonte do Google Fonts vem da rede; imagem vem do preview. As duas atrasam o layout,
  // e capturar antes disso mede o fallback, não o desenho.
  const bruto = await avaliar(
    chamar,
    `(async () => {
      await document.fonts.ready;
      for (let i = 0; i < 40; i++) {
        if ([...document.images].every((im) => im.complete)) { break; }
        await new Promise((r) => setTimeout(r, 250));
      }
      return JSON.stringify({
        altura: document.documentElement.scrollHeight,
        largura: document.documentElement.scrollWidth,
        fontes: {
          sora: document.fonts.check("700 60px Sora"),
          roboto: document.fonts.check("400 16px Roboto")
        }
      });
    })()`,
    true,
  );
  await esperar(400);
  return JSON.parse(String(bruto));
}

/**
 * Print full-page em base64.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {number} altura
 * @return {Promise<string>}
 */
async function capturar(chamar, altura) {
  const resposta = await chamar("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {x: 0, y: 0, width: LARGURA, height: altura, scale: 1},
  });
  const dados = resposta.result?.data;
  if (typeof dados !== "string" || dados.length === 0) {
    throw new Error(`captura falhou (altura ${altura}): ${JSON.stringify(resposta).slice(0, 300)}`);
  }
  return dados;
}

/**
 * Tira da página o que é ANDAIME DO PREVIEW, antes de medir e capturar.
 *
 * A regra: o diff tem que medir o que vai para o WordPress, não o harness. Os dois
 * `form-mock*.html` se declaram "MOCK DE QA. NÃO VAI PARA O WORDPRESS" e trazem
 * cenografia própria que no Elementor é configuração de CONTAINER, não markup nosso:
 *
 * - `.lpb-mock-qa` — cartão "Amostra de estados (erro e sucesso)" com as mensagens que
 *   o Elementor injeta por AJAX depois do envio. Útil para conferir o CSS de erro e
 *   sucesso, inexistente no Figma e na página real. Deixado no lugar, empurra o fim da
 *   seção 10 em ~300px e o diff acusa 33% num bloco que está certo.
 * - `.lpb-mock-palco` — o "palco" que dá ao mock o fundo `#f12d64` e 48px de respiro em
 *   cima e embaixo. O fundo é real (é o container da seção 10); os 48px NÃO: eles são
 *   do palco. Zerados, o topo do card cai em y=240 contra os 241 medidos no PNG do
 *   Figma — ou seja, o bloco está certo e quem estava fora do lugar era o andaime. Por
 *   isso o MONTAGEM.md manda o container da seção 10 com padding vertical 0.
 *
 * Nada disto é afrouxar o gate: é medir o artefato certo, e cada normalização é
 * IMPRESSA — QA que normaliza em silêncio é QA que mente. Os prints por bloco
 * (`/?bloco=form-mock`) continuam CRUS, com a amostra, porque lá ela é o artefato.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @return {Promise<void>}
 */
async function normalizarPagina(chamar) {
  const relato = await avaliar(
    chamar,
    `(() => {
      const removidos = [...document.querySelectorAll(".lpb-mock-qa")];
      const alturas = removidos.map((n) => Math.round(n.getBoundingClientRect().height));
      for (const n of removidos) { n.remove(); }
      const palcos = document.querySelectorAll(".lpb-mock-palco").length;
      const estilo = document.createElement("style");
      estilo.textContent =
        ".lpb-mock-palco { padding-top: 0 !important; padding-bottom: 0 !important; }";
      document.head.appendChild(estilo);
      return JSON.stringify({alturas, palcos});
    })()`,
  );
  const {alturas, palcos} = JSON.parse(String(relato));
  console.log(
    `normalizacao do andaime: ${alturas.length}x ".lpb-mock-qa" removido` +
      `${alturas.length > 0 ? ` (altura ${alturas.join(", ")}px)` : ""}` +
      ` · ${palcos}x ".lpb-mock-palco" com padding vertical zerado`,
  );
}

/**
 * Caixa vertical de cada alvo na página inteira, em coordenadas do documento.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {number} alturaDoc
 * @return {Promise<Map<string, {topo: number, altura: number}>>}
 */
async function medirAlvos(chamar, alturaDoc) {
  const pedido = ALVOS.filter((a) => a.inicio !== null).map((a) => [a.alvo, a.inicio, a.fim]);
  const bruto = await avaliar(
    chamar,
    `(() => {
      const y = window.scrollY;
      const caixa = (sel) => {
        const el = document.querySelector(sel);
        if (el === null) { return null; }
        const r = el.getBoundingClientRect();
        return {topo: r.top + y, base: r.bottom + y};
      };
      return JSON.stringify(${JSON.stringify(pedido)}.map(([alvo, ini, fim]) => {
        const a = caixa(ini);
        const b = caixa(fim);
        if (a === null || b === null) { return {alvo, erro: ini + " / " + fim}; }
        return {alvo, topo: Math.round(a.topo), altura: Math.round(b.base - a.topo)};
      }));
    })()`,
  );
  const medidas = new Map();
  medidas.set("pagina", {topo: 0, altura: alturaDoc});
  for (const item of JSON.parse(String(bruto))) {
    if (item.erro !== undefined) {
      throw new Error(`seletor nao encontrado para "${item.alvo}": ${item.erro}`);
    }
    if (item.altura <= 0) {
      throw new Error(`alvo "${item.alvo}" mediu altura ${item.altura}`);
    }
    medidas.set(item.alvo, {topo: item.topo, altura: item.altura});
  }
  return medidas;
}

/** Helpers que vivem na página de comparação (about:blank). */
const AJUDANTES_NAVEGADOR = `
  window.__carregar = (url) => new Promise((ok, falha) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => falha(new Error("imagem nao carregou"));
    im.src = url;
  });
  window.__comparar = (imgA, imgB, recorte, tol) => {
    const w = Math.min(imgA.naturalWidth, imgB.naturalWidth);
    const h = Math.min(recorte.altura, imgB.naturalHeight);
    const pinta = (img, sy) => {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d", {willReadFrequently: true});
      x.fillStyle = "#ffffff";
      x.fillRect(0, 0, w, h);
      x.drawImage(img, 0, sy, w, h, 0, 0, w, h);
      return x.getImageData(0, 0, w, h);
    };
    const a = pinta(imgA, recorte.topo).data;
    const b = pinta(imgB, 0).data;
    const saida = document.createElement("canvas");
    saida.width = w; saida.height = h;
    const ctx = saida.getContext("2d");
    const img = ctx.createImageData(w, h);
    let n = 0;
    for (let i = 0; i < a.length; i += 4) {
      const dif = Math.abs(a[i] - b[i]) > tol ||
        Math.abs(a[i + 1] - b[i + 1]) > tol ||
        Math.abs(a[i + 2] - b[i + 2]) > tol;
      if (dif) {
        img.data[i] = 255; img.data[i + 1] = 0; img.data[i + 2] = 255;
        n++;
      } else {
        const luz = b[i] * 0.3 + b[i + 1] * 0.59 + b[i + 2] * 0.11;
        const claro = Math.round(255 - (255 - luz) * 0.25);
        img.data[i] = claro; img.data[i + 1] = claro; img.data[i + 2] = claro;
      }
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    window.__ultimoDiff = saida.toDataURL("image/png");
    return JSON.stringify({largura: w, altura: h, divergentes: n, total: w * h});
  };
  "pronto"
`;

/**
 * Compara um alvo e grava o PNG de diff.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {Alvo} alvo
 * @param {{topo: number, altura: number}} caixa
 * @param {string} dirSaida
 * @return {Promise<{alvo: string, divergentePct: number, alturaFigma: number,
 *   alturaRender: number, alturaComparada: number, diff: string}>}
 */
async function compararAlvo(chamar, alvo, caixa, dirSaida) {
  const figmaBase64 = (await readFile(join(DIR_FIGMA, alvo.figma))).toString("base64");
  const bruto = await avaliar(
    chamar,
    `(async () => {
      const fig = await window.__carregar("data:image/png;base64,${figmaBase64}");
      const r = window.__comparar(window.__render, fig, ${JSON.stringify(caixa)}, ${TOLERANCIA_CANAL});
      return JSON.stringify({medida: JSON.parse(r), alturaFigma: fig.naturalHeight});
    })()`,
    true,
  );
  const {medida, alturaFigma} = JSON.parse(String(bruto));
  const diffUrl = String(await avaliar(chamar, "window.__ultimoDiff"));
  const nomeDiff = alvo.alvo === "pagina" ? "diff-pagina.png" : `diff-${alvo.alvo}.png`;
  const caminho = join(dirSaida, nomeDiff);
  await writeFile(caminho, Buffer.from(diffUrl.split(",")[1], "base64"));
  return {
    alvo: alvo.alvo,
    divergentePct: (medida.divergentes / medida.total) * 100,
    alturaFigma,
    alturaRender: caixa.altura,
    alturaComparada: medida.altura,
    diff: caminho,
  };
}

/**
 * Tabela de largura fixa, sem dependência de formatação.
 * @param {string[]} cabecalho
 * @param {string[][]} linhas
 * @return {string}
 */
function montarTabela(cabecalho, linhas) {
  const todas = [cabecalho, ...linhas];
  const larguras = cabecalho.map((_, c) => Math.max(...todas.map((l) => l[c].length)));
  const formata = (linha) => linha.map((v, c) => v.padEnd(larguras[c])).join("  ");
  const regua = larguras.map((n) => "-".repeat(n)).join("  ");
  return [formata(cabecalho), regua, ...linhas.map(formata)].join("\n");
}

/**
 * Captura cada fragmento isolado (`/?bloco=…`) como artefato do gate visual.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {number} porta
 * @param {string} dirSaida
 * @return {Promise<string[][]>}
 */
async function capturarBlocos(chamar, porta, dirSaida) {
  const linhas = [];
  for (const bloco of BLOCOS) {
    const estado = await abrirEmDesktop(chamar, `http://localhost:${porta}/?bloco=${bloco}`);
    const base64 = await capturar(chamar, estado.altura);
    const caminho = join(dirSaida, `render-${bloco}-1440.png`);
    await writeFile(caminho, Buffer.from(base64, "base64"));
    linhas.push([bloco, String(estado.largura), String(estado.altura), caminho]);
  }
  return linhas;
}

/**
 * Carrega o render numa página em branco e compara alvo por alvo.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {string} renderBase64
 * @param {Map<string, {topo: number, altura: number}>} medidas
 * @param {string} dirSaida
 * @return {Promise<Array<object>>}
 */
async function compararTodos(chamar, renderBase64, medidas, dirSaida) {
  await chamar("Page.navigate", {url: "about:blank"});
  await esperar(300);
  await avaliar(chamar, AJUDANTES_NAVEGADOR);
  await avaliar(
    chamar,
    `(async () => {
      window.__render = await window.__carregar("data:image/png;base64,${renderBase64}");
      return window.__render.naturalWidth + "x" + window.__render.naturalHeight;
    })()`,
    true,
  );
  const resultados = [];
  for (const alvo of ALVOS) {
    const caixa = medidas.get(alvo.alvo);
    if (caixa === undefined) {
      throw new Error(`alvo sem medida: ${alvo.alvo}`);
    }
    resultados.push(await compararAlvo(chamar, alvo, caixa, dirSaida));
  }
  return resultados;
}

/**
 * @param {string[][]} blocos
 * @param {Array<object>} resultados
 * @param {number} limiar
 */
function imprimirRelatorio(blocos, resultados, limiar) {
  console.log("\n== BLOCOS CAPTURADOS (artefato do gate visual) ==");
  console.log(montarTabela(["bloco", "largura", "altura", "arquivo"], blocos));
  console.log("\n== DIFF DE PIXEL vs FIGMA (tolerancia 8/255 por canal) ==");
  console.log(
    montarTabela(
      ["alvo", "%divergente", "alturaFigma", "alturaRender", "deltaAltura", "hComparada"],
      resultados.map((r) => {
        const delta = r.alturaRender - r.alturaFigma;
        return [
          r.alvo,
          r.divergentePct.toFixed(2),
          String(r.alturaFigma),
          String(r.alturaRender),
          (delta > 0 ? "+" : "") + String(delta),
          String(r.alturaComparada),
        ];
      }),
    ),
  );
  console.log(`\nlimiar de reprova: ${limiar}% de pixels divergentes por alvo`);
}

/**
 * Abre a página, normaliza o andaime e devolve render + medidas.
 * @param {(m: string, p?: object) => Promise<object>} chamar
 * @param {number} porta
 * @param {string} dirSaida
 * @return {Promise<{renderBase64: string, medidas: Map<string, object>}>}
 */
async function prepararPagina(chamar, porta, dirSaida) {
  const estado = await abrirEmDesktop(chamar, `http://localhost:${porta}/`);
  if (estado.largura !== LARGURA) {
    throw new Error(`render saiu com ${estado.largura}px, esperado ${LARGURA}px`);
  }
  console.log(`fontes carregadas: Sora=${estado.fontes.sora} Roboto=${estado.fontes.roboto}`);
  if (!estado.fontes.sora || !estado.fontes.roboto) {
    console.warn("AVISO: fonte do Google nao carregou — o diff mede o fallback, nao o desenho.");
  }
  await normalizarPagina(chamar);
  // A remoção muda o layout: a altura tem que ser lida DEPOIS dela, senão o print sai
  // com uma faixa branca no fim e o diff da página inteira acusa a faixa.
  const altura = Number(await avaliar(chamar, "document.documentElement.scrollHeight"));
  const medidas = await medirAlvos(chamar, altura);
  const renderBase64 = await capturar(chamar, altura);
  const caminho = join(dirSaida, "render-pagina-1440.png");
  await writeFile(caminho, Buffer.from(renderBase64, "base64"));
  console.log(`render da pagina: ${caminho} (${LARGURA}x${altura})`);
  return {renderBase64, medidas};
}

async function principal() {
  const {porta, limiar, dirSaida} = lerArgumentos(process.argv.slice(2));
  await mkdir(dirSaida, {recursive: true});
  const chrome = await abrirChrome();
  try {
    const {renderBase64, medidas} = await prepararPagina(chrome.chamar, porta, dirSaida);
    const blocos = await capturarBlocos(chrome.chamar, porta, dirSaida);
    const resultados = await compararTodos(chrome.chamar, renderBase64, medidas, dirSaida);
    imprimirRelatorio(blocos, resultados, limiar);

    const reprovados = resultados.filter((r) => r.divergentePct > limiar);
    if (reprovados.length > 0) {
      for (const r of reprovados) {
        console.error(`FALHA ${r.alvo}: ${r.divergentePct.toFixed(2)}% > ${limiar}% — ${r.diff}`);
      }
      return 1;
    }
    console.log("OK: nenhum alvo acima do limiar.");
    return 0;
  } finally {
    chrome.fechar();
  }
}

principal()
  .then((codigo) => process.exit(codigo))
  .catch((erro) => {
    console.error(`ERRO: ${erro instanceof Error ? erro.message : String(erro)}`);
    process.exit(1);
  });
