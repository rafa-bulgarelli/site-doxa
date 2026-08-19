/**
 * WRAPPERS da Search Console API — REST cru sobre `fetch`, sem SDK.
 *
 * ─── O CONTRATO ──────────────────────────────────────────────────────────────
 *
 * Toda função de rede recebe o `token` como PRIMEIRO argumento. Nenhuma delas
 * busca token sozinha, e é de propósito: quem chama decide o escopo (leitura ou
 * escrita) uma vez, no topo, e fica óbvio no código quando um comando pede
 * permissão de escrita. Um wrapper que se autentica sozinho esconde isso.
 *
 * Erro de HTTP vira `Error` com o status e os primeiros 300 caracteres do
 * corpo. O corpo de erro do Google traz `{error:{code,message,status}}` — diz o
 * que houve e não carrega credencial nenhuma.
 *
 * ─── DUAS APIS, DOIS HOSTS ───────────────────────────────────────────────────
 *
 * `sites`, `sitemaps` e `searchAnalytics` são a v3 antiga, em
 * `www.googleapis.com/webmasters/v3`. A inspeção de URL é a API nova, em
 * `searchconsole.googleapis.com/v1`. O mesmo token serve as duas.
 */

/** Base da API v3 (sites, sitemaps, searchAnalytics). */
export const BASE_WEBMASTERS = 'https://www.googleapis.com/webmasters/v3';

/** Base da API v1 (urlInspection). */
export const BASE_SEARCHCONSOLE = 'https://searchconsole.googleapis.com/v1';

/** O sitemap que o `prerender.mjs` publica — 69 `<loc>`, home + 68 rotas. */
export const SITEMAP_DA_DOXA = 'https://www.doxaviral.com/sitemap.xml';

/** Domínio do site. Com **L**: o `doxavira.com` (sem L) não é nosso. */
export const DOMINIO_DA_DOXA = 'doxaviral.com';

/** Quem precisa estar na propriedade para tudo isto funcionar. */
export const EMAIL_DA_SERVICE_ACCOUNT = 'torre-seo@doxa-506016.iam.gserviceaccount.com';

/**
 * O `siteUrl` vai no CAMINHO da URL, então precisa de escape completo.
 *
 * `sc-domain:doxaviral.com` → `sc-domain%3Adoxaviral.com`;
 * `https://www.doxaviral.com/` → `https%3A%2F%2Fwww.doxaviral.com%2F`.
 * Sem isso, as barras do prefixo viram segmentos de caminho e a API responde
 * 404 numa propriedade que existe.
 *
 * @param {string} siteUrl
 * @return {string}
 */
export function codificarSiteUrl(siteUrl) {
  return encodeURIComponent(siteUrl);
}

/**
 * Executa a chamada e devolve o JSON — ou lança com status + trecho do corpo.
 *
 * @param {string} url
 * @param {string} token
 * @param {{metodo?: string, corpo?: unknown}} [opcoes]
 * @return {Promise<unknown>} JSON da resposta, ou `{}` quando ela vem sem corpo.
 */
async function chamar(url, token, { metodo = 'GET', corpo } = {}) {
  const cabecalhos = { authorization: `Bearer ${token}` };
  if (corpo !== undefined) {
    cabecalhos['content-type'] = 'application/json';
  }

  const resposta = await fetch(url, {
    method: metodo,
    headers: cabecalhos,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (!resposta.ok) {
    const texto = (await resposta.text()).slice(0, 300);
    const erro = new Error(`${metodo} ${url} → HTTP ${resposta.status}. Resposta: ${texto}`);
    erro.status = resposta.status;
    throw erro;
  }

  // `sitemaps.submit` responde 204 sem corpo; `text()` vazio quebraria o JSON.parse.
  const texto = await resposta.text();
  if (texto.trim() === '') {
    return {};
  }
  return JSON.parse(texto);
}

/**
 * `sites.list` — as propriedades que esta service account enxerga.
 *
 * Quando a SA não foi adicionada a propriedade nenhuma, a API responde 200 com
 * `{}` (e não 403). Por isso o `?? []`: a ausência de acesso não é exceção de
 * rede, é uma lista vazia — quem chama decide o que dizer ao dono.
 *
 * @param {string} token
 * @return {Promise<Array<{siteUrl: string, permissionLevel: string}>>}
 */
export async function listarPropriedades(token) {
  const dados = await chamar(`${BASE_WEBMASTERS}/sites`, token);
  return dados?.siteEntry ?? [];
}

/**
 * `sitemaps.list` — os sitemaps submetidos para a propriedade.
 *
 * Atenção ao ler o resultado: `contents[].indexed` é campo DEPRECADO e vem 0
 * sempre. Lê-lo como "nenhuma URL indexada" é o erro clássico aqui.
 *
 * @param {string} token
 * @param {string} siteUrl
 * @return {Promise<Array<object>>}
 */
export async function listarSitemaps(token, siteUrl) {
  const dados = await chamar(
    `${BASE_WEBMASTERS}/sites/${codificarSiteUrl(siteUrl)}/sitemaps`,
    token,
  );
  return dados?.sitemap ?? [];
}

/**
 * `sitemaps.submit` — PUT idempotente; responde 204 sem corpo.
 *
 * Exige token de ESCRITA (`ESCOPO_ESCRITA`). Com token de leitura, 403.
 *
 * @param {string} token
 * @param {string} siteUrl
 * @param {string} feedpath URL absoluta do sitemap.
 * @return {Promise<void>}
 */
export async function submeterSitemap(token, siteUrl, feedpath) {
  await chamar(
    `${BASE_WEBMASTERS}/sites/${codificarSiteUrl(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
    token,
    { metodo: 'PUT' },
  );
}

/**
 * `searchAnalytics.query` — as queries, cliques, impressões e posições.
 *
 * O corpo passa cru, sem opinião: quem consulta escolhe `startDate`, `endDate`,
 * `dimensions`, `rowLimit`. A track de baseline é dona dessa decisão.
 *
 * @param {string} token
 * @param {string} siteUrl
 * @param {object} corpo corpo da consulta, conforme a API.
 * @return {Promise<object>}
 */
export async function consultarBusca(token, siteUrl, corpo) {
  return chamar(
    `${BASE_WEBMASTERS}/sites/${codificarSiteUrl(siteUrl)}/searchAnalytics/query`,
    token,
    { metodo: 'POST', corpo },
  );
}

/**
 * `urlInspection.index.inspect` — o que o Google sabe de UMA URL.
 *
 * @param {string} token
 * @param {string} siteUrl propriedade dona da URL.
 * @param {string} url URL absoluta a inspecionar.
 * @return {Promise<object>}
 */
export async function inspecionarUrl(token, siteUrl, url) {
  return chamar(`${BASE_SEARCHCONSOLE}/urlInspection/index:inspect`, token, {
    metodo: 'POST',
    corpo: { inspectionUrl: url, siteUrl, languageCode: 'pt-BR' },
  });
}

/**
 * Escolhe a propriedade da Doxa entre as que a SA enxerga (função PURA).
 *
 * A ordem é deliberada: `GSC_SITE_URL` manda quando existe (e falha alto se
 * apontar para uma propriedade que a SA não vê — silenciar isso levaria a
 * medir a propriedade errada); sem ela, prefere-se a de **Domínio**
 * (`sc-domain:`), porque ela cobre http/https, com e sem `www`, e um prefixo
 * cobre só a sua variante.
 *
 * @param {Array<{siteUrl: string}>} entradas o que `sites.list` devolveu.
 * @param {string} [preferida] normalmente `process.env.GSC_SITE_URL`.
 * @return {string} o `siteUrl` escolhido.
 */
export function escolherPropriedade(entradas, preferida) {
  const lista = Array.isArray(entradas) ? entradas : [];
  const urls = lista.map((entrada) => entrada?.siteUrl).filter((url) => typeof url === 'string');

  if (typeof preferida === 'string' && preferida !== '') {
    if (!urls.includes(preferida)) {
      throw new Error(
        `GSC_SITE_URL=${preferida} não está entre as propriedades que a service account ` +
          `enxerga: ${urls.length === 0 ? '(nenhuma)' : urls.join(', ')}.`,
      );
    }
    return preferida;
  }

  const dominio = urls.find(
    (url) => url.startsWith('sc-domain:') && url.includes(DOMINIO_DA_DOXA),
  );
  if (dominio !== undefined) {
    return dominio;
  }

  const prefixo = urls.find((url) => url.includes(DOMINIO_DA_DOXA));
  if (prefixo !== undefined) {
    return prefixo;
  }

  throw new Error(
    `nenhuma propriedade de ${DOMINIO_DA_DOXA} entre as que a service account enxerga: ` +
      `${urls.length === 0 ? '(nenhuma)' : urls.join(', ')}. ` +
      `Confira no painel se ${EMAIL_DA_SERVICE_ACCOUNT} é usuário da propriedade ` +
      '(Search Console → Configurações → Usuários e permissões).',
  );
}
