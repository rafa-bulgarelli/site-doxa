#!/usr/bin/env node
/**
 * O PRERENDER: transforma cada página SEO num arquivo HTML dentro de `dist/`.
 *
 * ─── POR QUE ISTO EXISTE ─────────────────────────────────────────────────────
 *
 * O site é uma SPA: `index.html` tem um `<div id="root">` vazio e o conteúdo
 * aparece quando o JS roda. Isso é aceitável para uma landing que se alcança
 * por link direto e é péssimo para uma rede de páginas que se alcança pela
 * busca — o brief é explícito (§28): o HTML das páginas SEO tem de estar pronto
 * SEM depender de JS do cliente.
 *
 * ─── COMO ELE SERVE NA VERCEL ────────────────────────────────────────────────
 *
 * O filesystem tem precedência sobre o `rewrite` do `vercel.json` (o próprio
 * `vercel.README.md` documenta isso: é por essa razão que `/robots.txt` e os
 * assets não caem na SPA). Escrevendo `dist/solucoes/x/index.html`, a Vercel
 * serve esse arquivo em `/solucoes/x` e o rewrite nunca é consultado. Com
 * `"trailingSlash": false` no `vercel.json`, `/solucoes/x/` redireciona para a
 * forma sem barra com 308 — uma URL canônica só.
 *
 * Localmente, o `vite preview` (sirv) faz o contrário: serve o arquivo em
 * `/solucoes/x/` COM barra e manda `/solucoes/x` para a SPA. É comportamento do
 * sirv, não da Vercel; a prova local usa a forma com barra.
 *
 * ─── O QUE ELE FAZ, EM ORDEM ─────────────────────────────────────────────────
 *
 *  1. `vite build --ssr` de `src/seo/prerender/entrada.tsx` para `.vite/`
 *     (ignorado pelo git), herdando `vite.config.ts` — inclusive o plugin react;
 *  2. importa o bundle e pergunta a ele quais rotas existem;
 *  3. lê `dist/index.html` e extrai o `href` do CSS do build cliente. É o mesmo
 *     arquivo da landing: o Tailwind varre `src/**` e as classes dos layouts
 *     SEO já estão lá. Sem esse href a página sai sem estilo nenhum, então a
 *     ausência dele é erro fatal e não aviso;
 *  4. escreve um `index.html` por rota e o `sitemap.xml`.
 *
 * Qualquer falha derruba o build (exit 1). Publicar metade das páginas é pior
 * do que não publicar nenhuma: o sitemap prometeria URLs que dão 404.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const SAIDA_SSR = join(RAIZ, '.vite', 'prerender');

/** Falha alto: mensagem única, código 1, nada escrito pela metade. */
function morrer(mensagem) {
  console.error(`\n[prerender] ${mensagem}\n`);
  process.exit(1);
}

async function compilarEntrada() {
  await build({
    // `publicDir: false` porque este build é SSR: o bundle sai para `.vite/` e
    // nada nele serve arquivo estático. Sem a linha, o Vite copia os 27 MB de
    // `public/` (fontes, vídeos, mídia dos cases) para dentro de `.vite/` a cada
    // `pnpm build` — segundos de I/O por build, para um diretório que ninguém lê.
    publicDir: false,
    build: {
      ssr: 'src/seo/prerender/entrada.tsx',
      outDir: '.vite/prerender',
      emptyOutDir: true,
    },
    logLevel: 'warn',
  });
  return import(pathToFileURL(join(SAIDA_SSR, 'entrada.js')).href);
}

/**
 * O `href` do CSS do build cliente.
 *
 * Extraído do `dist/index.html` em vez de adivinhado: o nome carrega um hash de
 * conteúdo que muda a cada alteração de estilo, e um caminho fixo aqui viraria
 * um 404 silencioso — a página abriria sem CSS nenhum e ninguém veria no build.
 */
async function acharCss() {
  const indice = join(DIST, 'index.html');
  let html;
  try {
    html = await readFile(indice, 'utf8');
  } catch {
    morrer(`${indice} não existe. Rode o \`vite build\` antes do prerender.`);
  }
  const achado = /href="(\/assets\/index-[^"]+\.css)"/.exec(html);
  if (achado === null) {
    morrer('não achei o <link> do CSS em dist/index.html — o prerender sairia sem estilo.');
  }
  return achado[1];
}

async function escrever(caminho, conteudo) {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, conteudo, 'utf8');
}

async function principal() {
  const entrada = await compilarEntrada();
  const cssHref = await acharCss();
  const rotas = entrada.rotas();
  if (!Array.isArray(rotas) || rotas.length === 0) {
    morrer('a entrada não devolveu rota nenhuma.');
  }

  for (const rota of rotas) {
    if (typeof rota !== 'string' || !rota.startsWith('/')) {
      morrer(`rota inválida: ${String(rota)}`);
    }
    const html = entrada.renderizar(rota, { cssHref });
    await escrever(join(DIST, rota, 'index.html'), html);
    console.log(`[prerender] ${rota}  ->  dist${rota}/index.html`);
  }

  await escrever(join(DIST, 'sitemap.xml'), entrada.sitemap());
  console.log(`[prerender] sitemap.xml  ->  dist/sitemap.xml`);
  console.log(`[prerender] ${rotas.length} rota(s), CSS em ${cssHref}`);
}

principal().catch((erro) => {
  morrer(erro instanceof Error ? `${erro.message}\n${erro.stack ?? ''}` : String(erro));
});
