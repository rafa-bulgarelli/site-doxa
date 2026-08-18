#!/usr/bin/env node
/**
 * `pnpm seo:audit` — o MAPA da rede interna, impresso no terminal.
 *
 * ─── O QUE ELE É, E O QUE ELE NÃO É ──────────────────────────────────────────
 *
 * Ele NÃO é um gate. Sai com código 0 mesmo cheio de aviso, e isso é decisão:
 * o que ele mede — órfã, hub sem membro, rota citada antes de existir — depende
 * do que as OUTRAS páginas escreveram, e as tracks de conteúdo mergeiam em
 * ordem imprevisível. Reprovar a primeira página de um cluster por ela ser a
 * única dele ensina todo mundo a ignorar a reprovação. O que reprova mora em
 * `src/seo/seo.test.ts` e roda no `pnpm test`.
 *
 * Ele É a foto: quem linka para quem, quem não recebe link de ninguém, quanta
 * palavra cada página tem, e o que ainda falta nascer. É o que se olha antes de
 * decidir a próxima página a escrever.
 *
 * ─── POR QUE UM BUILD SSR ANTES ──────────────────────────────────────────────
 *
 * `src/seo/auditoria.ts` puxa `indice.ts`, e `indice.ts` monta a lista de
 * páginas com `import.meta.glob` — que é do Vite e não existe no Node cru. O
 * mesmo caminho que o `prerender.mjs` usa, e pelo mesmo motivo. A saída vai
 * para `.vite/auditoria/`, que o git ignora.
 */
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = join(RAIZ, '.vite', 'auditoria');

async function principal() {
  await build({
    // Nada de estático aqui: é um módulo que roda uma vez e imprime texto.
    // Sem a linha, o Vite copiaria os 27 MB de `public/` para `.vite/`.
    publicDir: false,
    build: {
      ssr: 'src/seo/auditoria.ts',
      outDir: '.vite/auditoria',
      emptyOutDir: true,
    },
    logLevel: 'warn',
  });

  const modulo = await import(pathToFileURL(join(SAIDA, 'auditoria.js')).href);
  if (typeof modulo.relatorio !== 'function') {
    throw new Error('o bundle da auditoria não exporta `relatorio`.');
  }
  console.log('');
  console.log(modulo.relatorio());
  console.log('');
}

principal().catch((erro) => {
  console.error(`\n[seo:audit] ${erro instanceof Error ? erro.message : String(erro)}\n`);
  process.exit(1);
});
