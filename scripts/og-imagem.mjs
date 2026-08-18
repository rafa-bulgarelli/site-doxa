#!/usr/bin/env node
/**
 * A IMAGEM DE PRÉVIA (`public/og.png`), gerada e não desenhada à mão.
 *
 * ─── POR QUE UM SCRIPT, E NÃO UM ARQUIVO NO REPOSITÓRIO ──────────────────────
 *
 * Porque a imagem repete DUAS frases que já existem em outro lugar — o
 * `og:title` e a `og:description` do `index.html` — e uma imagem binária não
 * tem como avisar que a frase dela envelheceu. Com o script, a fonte das duas
 * está aqui em texto, ao lado do aviso de que ela é cópia: mudou a promessa na
 * landing, muda aqui e roda `pnpm og:imagem` no mesmo commit.
 *
 * Nada é inventado (§2 do brief): as duas frases são as da landing, palavra por
 * palavra. Uma terceira promessa, escrita só para caber na imagem, seria uma
 * afirmação comercial que nenhuma página sustenta.
 *
 * ─── COMO ELE FAZ ────────────────────────────────────────────────────────────
 *
 *  1. escreve um HTML de 1200×630 em `.vite/og/` (ignorado pelo git), com as
 *     fontes e a wordmark referenciadas por `file://` — os mesmos arquivos que
 *     o site serve, e não uma fonte parecida do sistema;
 *  2. tira um screenshot com o Chrome headless direto em `public/og.png`.
 *
 * PNG, e não AVIF nem WebP: boa parte dos leitores de link (o do WhatsApp
 * inclusive) não decodifica os dois, e o cartão sairia sem imagem — que é o
 * problema inteiro que este arquivo existe para resolver.
 *
 * Rodar: `pnpm og:imagem`. Não roda no `pnpm build` de propósito — a imagem
 * muda quando a promessa muda, e não a cada deploy; um PNG regerado a cada
 * build viraria ruído binário em todo diff.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const executar = promisify(execFile);

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = join(RAIZ, 'public', 'og.png');
const TEMPORARIO = join(RAIZ, '.vite', 'og');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const LARGURA = 1200;
export const ALTURA = 630;

/**
 * As duas frases. CÓPIAS de `index.html` (`og:title` e `og:description`),
 * palavra por palavra — mexeu lá, mexe aqui e rode o script no mesmo commit.
 */
const PROMESSA = 'Um milhão de views. Ou seu dinheiro de volta.';
const SUBTITULO = 'Uma foto e um áudio viram sessenta conteúdos em noventa dias.';

/** Um caminho do repositório na forma `file://`, que é o que o Chrome carrega. */
function arquivo(...partes) {
  return pathToFileURL(join(RAIZ, ...partes)).href;
}

/**
 * O documento da imagem.
 *
 * Medidas em pixel absoluto porque a tela tem tamanho fixo e conhecido: não há
 * telefone nem desktop aqui, há um retângulo de 1200×630. O respiro de 88px nas
 * bordas é margem de segurança — o WhatsApp corta o cartão nas laterais em
 * algumas prévias, e o que estiver colado na borda some.
 */
function documento() {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<style>
  @font-face {
    font-family: 'Instrument Serif';
    src: url('${arquivo('public', 'fonts', 'InstrumentSerif-400-normal-latin.woff2')}') format('woff2');
    font-weight: 400;
    font-display: block;
  }
  @font-face {
    font-family: 'Almarai';
    src: url('${arquivo('public', 'fonts', 'Almarai-400-normal-latin.woff2')}') format('woff2');
    font-weight: 400;
    font-display: block;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${LARGURA}px; height: ${ALTURA}px; background: #000; }
  body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 88px;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
  .topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }
  /* align-self explícito: num flex de coluna o item é esticado à largura
     inteira por padrão, e a wordmark sairia com 1024px de largura. (Sem crase
     neste comentário: ele mora dentro de um template literal do JS.) */
  .wordmark { height: 38px; width: auto; display: block; align-self: center; }
  .promessa {
    font-family: 'Instrument Serif', serif;
    font-size: 92px;
    line-height: 1.03;
    letter-spacing: -0.01em;
    max-width: 900px;
  }
  .rodape {
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    padding-top: 30px;
  }
  .subtitulo {
    font-family: 'Almarai', sans-serif;
    font-size: 27px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
  }
  .dominio {
    font-family: 'Almarai', sans-serif;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.32);
    white-space: nowrap;
  }
</style>
</head>
<body>
  <div class="topo">
    <img class="wordmark" src="${arquivo('brand', 'doxa-wordmark-white.png')}" alt="Doxa" />
    <p class="dominio">doxaviral.com</p>
  </div>
  <p class="promessa">${PROMESSA}</p>
  <div class="rodape">
    <p class="subtitulo">${SUBTITULO}</p>
  </div>
</body>
</html>
`;
}

async function principal() {
  await mkdir(TEMPORARIO, { recursive: true });
  const html = join(TEMPORARIO, 'og.html');
  await writeFile(html, documento(), 'utf8');

  // `--virtual-time-budget` é o que substitui um "espere as fontes": sem ele o
  // screenshot sai no primeiro quadro, antes de os dois `.woff2` decodificarem,
  // e a imagem vira a mesma frase na fonte de sistema. `--allow-file-access-from-files`
  // libera o HTML `file://` a ler a fonte e a wordmark, que também são `file://`.
  await executar(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=3000',
    `--window-size=${LARGURA},${ALTURA}`,
    `--screenshot=${SAIDA}`,
    pathToFileURL(html).href,
  ]);

  console.log(`[og-imagem] ${SAIDA}  (${LARGURA}x${ALTURA})`);
}

principal().catch((erro) => {
  console.error(`\n[og-imagem] ${erro instanceof Error ? erro.message : String(erro)}\n`);
  process.exit(1);
});
