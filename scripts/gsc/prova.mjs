#!/usr/bin/env node
/**
 * `pnpm gsc:prova [--submeter]` — a PROVA de que a torre enxerga o Search Console.
 *
 * ─── O QUE ELE RESPONDE ──────────────────────────────────────────────────────
 *
 * Três perguntas que ninguém deveria responder por palpite:
 *   1. a service account foi mesmo adicionada à propriedade? (`sites.list`)
 *   2. a propriedade é de Domínio (`sc-domain:`) ou de prefixo? — muda o
 *      `siteUrl` de TODA chamada seguinte;
 *   3. o `sitemap.xml` das 69 URLs está submetido lá? (`sitemaps.list`)
 *
 * Sem `--submeter`, ele só LÊ: pede token de escopo de leitura e termina com 0
 * mesmo se o sitemap faltar — apenas avisa. Com `--submeter` e o sitemap
 * ausente, pede um segundo token, agora de escrita, faz o PUT e relista. O
 * escopo de escrita só é pedido quando vai ser usado, e essa é a razão de
 * serem dois tokens e não um.
 *
 * Não enxergar propriedade nenhuma é falha (exit 1), não aviso: sem isso, tudo
 * o que vem depois nesta trilha mede o vazio.
 */
import { ESCOPO_ESCRITA, ESCOPO_LEITURA, obterToken } from './auth.mjs';
import {
  EMAIL_DA_SERVICE_ACCOUNT,
  SITEMAP_DA_DOXA,
  escolherPropriedade,
  listarPropriedades,
  listarSitemaps,
  submeterSitemap,
} from './api.mjs';

/** Falha alto: mensagem única, código 1. Mesmo formato do `prerender.mjs`. */
function morrer(mensagem) {
  console.error(`\n[gsc:prova] ${mensagem}\n`);
  process.exit(1);
}

/** @param {string} texto */
function titulo(texto) {
  console.log(`\n── ${texto} ${'─'.repeat(Math.max(0, 68 - texto.length))}`);
}

/**
 * "Domínio" quando `sc-domain:` — cobre http/https, com e sem `www`.
 *
 * @param {string} siteUrl
 * @return {string}
 */
function tipoDaPropriedade(siteUrl) {
  return siteUrl.startsWith('sc-domain:') ? 'Domínio' : 'Prefixo de URL';
}

/**
 * Imprime um sitemap em uma linha por campo que interessa.
 *
 * `contents[].indexed` fica de fora de propósito: é campo DEPRECADO da API e
 * devolve 0 sempre — imprimi-lo faria alguém concluir "nenhuma indexada".
 *
 * @param {object} sitemap entrada de `sitemaps.list`.
 */
function imprimirSitemap(sitemap) {
  console.log(`  • ${sitemap.path}`);
  console.log(`      lastSubmitted:   ${sitemap.lastSubmitted ?? '(nunca)'}`);
  console.log(`      lastDownloaded:  ${sitemap.lastDownloaded ?? '(ainda não baixado)'}`);
  console.log(`      isPending:       ${sitemap.isPending === true}`);
  console.log(`      isSitemapsIndex: ${sitemap.isSitemapsIndex === true}`);
  console.log(`      errors/warnings: ${sitemap.errors ?? 0} / ${sitemap.warnings ?? 0}`);
  for (const conteudo of sitemap.contents ?? []) {
    console.log(`      contents:        ${conteudo.type} — submitted ${conteudo.submitted}`);
  }
}

/**
 * @param {Array<object>} sitemaps
 * @return {boolean}
 */
function contemOSitemapDaDoxa(sitemaps) {
  return sitemaps.some((sitemap) => sitemap?.path === SITEMAP_DA_DOXA);
}

async function principal() {
  const submeter = process.argv.slice(2).includes('--submeter');

  const token = await obterToken({ escopo: ESCOPO_LEITURA });

  titulo('propriedades que a service account enxerga');
  console.log(`   service account: ${EMAIL_DA_SERVICE_ACCOUNT}`);
  const propriedades = await listarPropriedades(token);
  if (propriedades.length === 0) {
    morrer(
      'a service account não enxerga propriedade NENHUMA (sites.list veio vazio). ' +
        `Search Console → Configurações → Usuários e permissões → adicione ${EMAIL_DA_SERVICE_ACCOUNT}.`,
    );
  }
  for (const entrada of propriedades) {
    console.log(`  • ${entrada.siteUrl}   [${entrada.permissionLevel}]`);
  }

  const escolhida = escolherPropriedade(propriedades, process.env.GSC_SITE_URL);
  const permissao = propriedades.find((entrada) => entrada.siteUrl === escolhida)?.permissionLevel;
  titulo('propriedade escolhida');
  console.log(`  siteUrl:         ${escolhida}`);
  console.log(`  tipo:            ${tipoDaPropriedade(escolhida)}`);
  console.log(`  permissionLevel: ${permissao ?? '(desconhecido)'}`);

  titulo('sitemaps da propriedade');
  let sitemaps = await listarSitemaps(token, escolhida);
  if (sitemaps.length === 0) {
    console.log('  (nenhum sitemap submetido)');
  }
  for (const sitemap of sitemaps) {
    imprimirSitemap(sitemap);
  }

  titulo('o sitemap da Doxa');
  if (contemOSitemapDaDoxa(sitemaps)) {
    console.log(`  OK: ${SITEMAP_DA_DOXA} está submetido.`);
    return;
  }

  if (!submeter) {
    console.log('  AVISO: sitemap não submetido — rode com --submeter');
    console.log(`         (${SITEMAP_DA_DOXA} não consta na lista acima)`);
    return;
  }

  console.log(`  ausente — submetendo ${SITEMAP_DA_DOXA} ...`);
  // Segundo token, agora de escrita: o de leitura acima levaria 403 no PUT.
  const tokenDeEscrita = await obterToken({ escopo: ESCOPO_ESCRITA });
  await submeterSitemap(tokenDeEscrita, escolhida, SITEMAP_DA_DOXA);
  console.log('  PUT aceito (204). Relistando ...');

  sitemaps = await listarSitemaps(token, escolhida);
  for (const sitemap of sitemaps) {
    imprimirSitemap(sitemap);
  }
  if (contemOSitemapDaDoxa(sitemaps)) {
    console.log(`\n  OK: ${SITEMAP_DA_DOXA} agora consta.`);
    console.log('  `isPending: true` / sem `lastDownloaded` logo após submeter é normal.');
  } else {
    morrer('o PUT foi aceito mas o sitemap não apareceu na relistagem.');
  }
}

principal()
  .then(() => {
    console.log('');
  })
  .catch((erro) => {
    morrer(erro instanceof Error ? erro.message : String(erro));
  });
