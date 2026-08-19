#!/usr/bin/env node
/**
 * `pnpm gsc:baseline` — a FOTO do que o Google já vê da biblioteca da Doxa.
 *
 * ─── O QUE ELE ESCREVE ───────────────────────────────────────────────────────
 *
 * Um arquivo `docs/seo/baseline-<AAAA-MM-DD>.md` com oito seções fixas: a
 * propriedade e a janela, o sitemap (API × ar × índice local), a cobertura URL
 * a URL, as queries com impressão, o desempenho por página, a posição média por
 * tipo e por hub, o gatilho da rodada 4 e a leitura honesta do dia zero.
 *
 * ─── POR QUE "DIA ZERO" ──────────────────────────────────────────────────────
 *
 * O site entrou no ar em 2026-08-18 e o Search Console atrasa ~2 dias. O
 * relatório de hoje mede quase-nada, e é exatamente esse quase-nada que se quer
 * registrar: sem a foto do primeiro dia não existe a comparação de quatro
 * semanas depois. Onde não há dado, ele escreve que não há — nada é estimado.
 *
 * ─── O CUSTO EM QUOTA ────────────────────────────────────────────────────────
 *
 * A URL Inspection tem 2000 chamadas/dia e 600/min por propriedade. Uma
 * execução completa gasta UMA por URL do sitemap (hoje 69), sequenciais. Rodar
 * em laço queima a quota do dia inteiro para todo mundo — use `--sem-inspecao`
 * quando estiver só mexendo no formato do relatório.
 *
 * ─── FLAGS ───────────────────────────────────────────────────────────────────
 *
 *   --dias N            janela do Search Analytics (default 28)
 *   --sem-inspecao      pula a URL Inspection (custo zero de quota)
 *   --min-impressoes N  mínimo de impressões do gatilho da rodada 4 (default 30)
 *   --saida <dir>       onde escrever (default `docs/seo`)
 *
 * Ele só LÊ: escopo `webmasters.readonly`. Falha de token, de propriedade ou do
 * sitemap no ar mata o processo ANTES de escrever qualquer coisa — meio
 * relatório no disco é pior que relatório nenhum, porque parece completo.
 */
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { build } from 'vite';

import { ESCOPO_LEITURA, obterToken } from './auth.mjs';
import {
  SITEMAP_DA_DOXA,
  consultarBusca,
  escolherPropriedade,
  inspecionarUrl,
  listarPropriedades,
  listarSitemaps,
} from './api.mjs';
import {
  DOMINIO_PADRAO,
  extrairLocs,
  gatilhoRodada4,
  montarMapa,
  renderizarBaseline,
} from './relatorio.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SAIDA_DO_MAPA = join(RAIZ, '.vite', 'gsc-mapa');

/** Quantos erros seguidos de inspeção antes de desistir do resto da lista. */
const ERROS_SEGUIDOS_PARA_ABORTAR = 10;

/** Teto de linhas de cada consulta — o da API é 25 000; 5 000 sobra para 69 URLs. */
const LIMITE_POR_PAGINA = 1000;
const LIMITE_QUERY_PAGINA = 5000;

/** Falha alto: mensagem única, código 1. Mesmo formato do `prova.mjs`. */
function morrer(mensagem) {
  console.error(`\n[gsc:baseline] ${mensagem}\n`);
  process.exit(1);
}

/** Progresso vai para o stderr: o stdout é o caminho do arquivo, e só. */
function log(mensagem) {
  console.error(`[gsc] ${mensagem}`);
}

/** "Domínio" quando `sc-domain:` — cobre http/https, com e sem `www`. */
function tipoDaPropriedade(siteUrl) {
  return siteUrl.startsWith('sc-domain:') ? 'Domínio' : 'Prefixo de URL';
}

/** `AAAA-MM-DD` em UTC, deslocado de `dias` — a API só fala nesse formato. */
function dataUtc(dias = 0) {
  const agora = new Date();
  agora.setUTCDate(agora.getUTCDate() + dias);
  return agora.toISOString().slice(0, 10);
}

/**
 * Lê as flags, já convertidas e validadas.
 *
 * `--dias` e `--min-impressoes` chegam como texto do shell; um `--dias abc`
 * viraria `NaN`, `startDate` viraria `Invalid Date` e a API responderia 400 com
 * uma mensagem que não menciona a flag. Melhor morrer aqui, dizendo qual é.
 *
 * @return {{dias: number, semInspecao: boolean, minImpressoes: number, saida: string}}
 */
function lerFlags() {
  const { values } = parseArgs({
    options: {
      dias: { type: 'string', default: '28' },
      'sem-inspecao': { type: 'boolean', default: false },
      'min-impressoes': { type: 'string', default: '30' },
      saida: { type: 'string', default: join(RAIZ, 'docs', 'seo') },
    },
  });

  const inteiroPositivo = (texto, nome) => {
    const valor = Number(texto);
    if (!Number.isInteger(valor) || valor <= 0) {
      morrer(`--${nome} precisa ser inteiro positivo; veio "${texto}".`);
    }
    return valor;
  };

  return {
    dias: inteiroPositivo(values.dias, 'dias'),
    semInspecao: values['sem-inspecao'] === true,
    minImpressoes: inteiroPositivo(values['min-impressoes'], 'min-impressoes'),
    saida: values.saida,
  };
}

/**
 * O sitemap NO AR — o que o Google baixa, não o que o repositório tem.
 *
 * Público, sem auth. Se ele não responder, o baseline morre: sem a lista de
 * URLs não há o que inspecionar nem com o que comparar o índice local.
 *
 * @return {Promise<string[]>}
 */
async function baixarSitemapDoAr() {
  const resposta = await fetch(SITEMAP_DA_DOXA, { signal: AbortSignal.timeout(20_000) });
  if (!resposta.ok) {
    morrer(`${SITEMAP_DA_DOXA} respondeu HTTP ${resposta.status} — sem lista de URLs, sem baseline.`);
  }
  const locs = extrairLocs(await resposta.text());
  if (locs.length === 0) {
    morrer(`${SITEMAP_DA_DOXA} respondeu 200 mas sem nenhum <loc>.`);
  }
  return locs;
}

/**
 * O índice local (`src/seo/indice.ts`) carregado a partir de um `.mjs`.
 *
 * `indice.ts` monta a lista com `import.meta.glob`, que é do Vite e não existe
 * no Node cru — daí o build SSR antes, o mesmo truque do `scripts/seo-audit.mjs`.
 * A saída vai para `.vite/`, que o git ignora.
 *
 * @return {Promise<{mapa: Map<string, object>, contagem: object}>}
 */
async function carregarIndiceLocal() {
  log('montando o mapa URL → tipo/hub (vite build --ssr) ...');
  await build({
    publicDir: false,
    build: { ssr: 'src/seo/indice.ts', outDir: '.vite/gsc-mapa', emptyOutDir: true },
    logLevel: 'warn',
  });

  const modulo = await import(pathToFileURL(join(SAIDA_DO_MAPA, 'indice.js')).href);
  if (typeof modulo.paginas !== 'function' || typeof modulo.urlDe !== 'function') {
    throw new Error('o bundle do índice não exporta `paginas`/`urlDe`.');
  }

  const paginas = modulo.paginas();
  const secoes = modulo.secoes();
  return {
    mapa: montarMapa({ paginas, secoes, urlDe: modulo.urlDe, dominio: DOMINIO_PADRAO }),
    contagem: { paginas: paginas.length, indices: secoes.length, home: 1 },
  };
}

/**
 * Uma consulta do Search Analytics; propriedade nova devolve `{}` sem `rows`.
 *
 * @param {string} token
 * @param {string} siteUrl
 * @param {{inicio: string, fim: string}} janela
 * @param {string[]} dimensions
 * @param {number} rowLimit
 * @return {Promise<object[]>}
 */
async function consultar(token, siteUrl, janela, dimensions, rowLimit) {
  const resposta = await consultarBusca(token, siteUrl, {
    startDate: janela.inicio,
    endDate: janela.fim,
    dimensions,
    rowLimit,
    // `all` inclui os dias "frescos", ainda não finais. Sem ele, uma propriedade
    // de 1 dia de vida devolve vazio e o relatório mente por omissão.
    dataState: 'all',
  });
  return resposta?.rows ?? [];
}

/**
 * Inspeciona as URLs uma a uma — UMA chamada por URL, sem paralelismo.
 *
 * Erro numa URL não derruba o relatório: vira a linha "erro: ..." na seção 3 e
 * o laço segue. Mas dez erros SEGUIDOS não são azar, são quota estourada ou
 * permissão perdida — aí ele para e diz isso, em vez de gastar as 60 chamadas
 * restantes para colecionar o mesmo 429.
 *
 * @param {string} token
 * @param {string} siteUrl
 * @param {readonly string[]} urls
 * @return {Promise<{feita: boolean, resultados: object[], abortada: boolean}>}
 */
async function inspecionarTodas(token, siteUrl, urls) {
  const resultados = [];
  let errosSeguidos = 0;
  let abortada = false;

  for (const [indice, url] of urls.entries()) {
    if ((indice + 1) % 10 === 0 || indice === 0) {
      log(`inspecionando ${indice + 1}/${urls.length} ...`);
    }
    try {
      const resposta = await inspecionarUrl(token, siteUrl, url);
      const estado = resposta?.inspectionResult?.indexStatusResult ?? {};
      resultados.push({
        url,
        verdict: estado.verdict,
        coverageState: estado.coverageState,
        indexingState: estado.indexingState,
        lastCrawlTime: estado.lastCrawlTime,
        pageFetchState: estado.pageFetchState,
        robotsTxtState: estado.robotsTxtState,
      });
      errosSeguidos = 0;
    } catch (erro) {
      // Só o status entra no relatório: o corpo do erro do Google não carrega
      // credencial, mas encurtá-lo evita colar uma URL assinada por engano.
      const status = erro?.status ?? 'falha de rede';
      resultados.push({ url, erro: `erro: ${status}` });
      errosSeguidos += 1;
      log(`erro em ${url}: ${status}`);
      if (errosSeguidos >= ERROS_SEGUIDOS_PARA_ABORTAR) {
        abortada = true;
        log(`${ERROS_SEGUIDOS_PARA_ABORTAR} erros seguidos — abortando a inspeção.`);
        break;
      }
    }
  }

  log(`inspecionadas ${resultados.length} URLs.`);
  return { feita: true, resultados, abortada };
}

/**
 * Escreve o arquivo de forma ATÔMICA: temporário e depois `rename`.
 *
 * O `rename` no mesmo diretório é atômico no sistema de arquivos — ou o
 * baseline antigo continua inteiro, ou o novo aparece inteiro. Ninguém abre um
 * relatório cortado no meio da seção 5 achando que acabou ali.
 *
 * @param {string} caminho
 * @param {string} conteudo
 * @return {Promise<void>}
 */
async function escreverAtomico(caminho, conteudo) {
  await mkdir(dirname(caminho), { recursive: true });
  const temporario = `${caminho}.parcial`;
  await writeFile(temporario, conteudo, 'utf8');
  await rename(temporario, caminho);
}

/**
 * A propriedade que se vai medir, e a permissão que a SA tem nela.
 *
 * Sem propriedade nenhuma o comando morre aqui: tudo o que viesse depois
 * mediria o vazio e escreveria um relatório de zeros com cara de verdade.
 *
 * @param {string} token
 * @return {Promise<{siteUrl: string, permissao: string}>}
 */
async function resolverPropriedade(token) {
  const propriedades = await listarPropriedades(token);
  if (propriedades.length === 0) {
    morrer('a service account não enxerga propriedade nenhuma — rode `pnpm gsc:prova`.');
  }
  const siteUrl = escolherPropriedade(propriedades, process.env.GSC_SITE_URL);
  const entrada = propriedades.find((item) => item.siteUrl === siteUrl);
  log(`propriedade: ${siteUrl} (${tipoDaPropriedade(siteUrl)})`);
  return { siteUrl, permissao: entrada?.permissionLevel ?? '(desconhecida)' };
}

/**
 * Colhe TUDO o que o relatório precisa — API, sitemap no ar e índice local.
 *
 * Devolve o objeto que `renderizarBaseline` consome. Nada é escrito no disco
 * aqui: o relatório só vira arquivo depois que a última consulta voltou.
 *
 * @param {{token: string, siteUrl: string, permissao: string,
 *   janela: object, flags: object, hoje: string}} entrada
 * @return {Promise<object>}
 */
async function colher({ token, siteUrl, permissao, janela, flags, hoje }) {
  const sitemaps = await listarSitemaps(token, siteUrl);
  const sitemapGsc = sitemaps.find((entrada) => entrada?.path === SITEMAP_DA_DOXA) ?? null;

  const locsNoAr = await baixarSitemapDoAr();
  log(`sitemap no ar: ${locsNoAr.length} <loc>.`);

  const { mapa, contagem } = await carregarIndiceLocal();
  log(`índice local: ${mapa.size} URLs.`);

  log(`search analytics: ${janela.inicio} → ${janela.fim}.`);
  const linhasPorPagina = await consultar(token, siteUrl, janela, ['page'], LIMITE_POR_PAGINA);
  const linhasQueryPagina = await consultar(
    token,
    siteUrl,
    janela,
    ['query', 'page'],
    LIMITE_QUERY_PAGINA,
  );
  const linhasPorData = await consultar(token, siteUrl, janela, ['date'], LIMITE_POR_PAGINA);

  const inspecao = flags.semInspecao
    ? { feita: false, resultados: [], abortada: false }
    : await inspecionarTodas(token, siteUrl, locsNoAr);

  return {
    geradoEm: hoje,
    propriedade: { siteUrl, tipo: tipoDaPropriedade(siteUrl), permissao },
    janela,
    datasComDado: linhasPorData.map((linha) => linha.keys[0]).sort(),
    sitemapGsc,
    locsNoAr,
    mapa,
    contagemIndice: contagem,
    linhasPorPagina,
    linhasQueryPagina,
    inspecao,
    regra: { posicaoMin: 8, posicaoMax: 20, minImpressoes: flags.minImpressoes },
  };
}

/**
 * O stdout: o caminho do arquivo e três linhas de resumo. O resto é stderr.
 *
 * @param {object} dados
 * @param {string} caminho
 */
function imprimirResumo(dados, caminho) {
  const { inspecao, locsNoAr, datasComDado, linhasQueryPagina } = dados;
  const cobertura = inspecao.feita
    ? `${inspecao.resultados.length} URLs inspecionadas`
    : 'não inspecionado';
  console.log(caminho);
  console.log(`  cobertura:  ${cobertura} de ${locsNoAr.length} no sitemap no ar`);
  console.log(
    `  busca:      ${datasComDado.length} dia(s) com dado, ` +
      `${linhasQueryPagina.length} linha(s) de query`,
  );
  console.log(`  gatilho:    ${gatilhoRodada4(dados, dados.regra).length} página(s) na rodada 4`);
}

async function principal() {
  const flags = lerFlags();
  const hoje = dataUtc(0);
  const janela = { inicio: dataUtc(-flags.dias), fim: hoje, dias: flags.dias };

  const token = await obterToken({ escopo: ESCOPO_LEITURA });
  const { siteUrl, permissao } = await resolverPropriedade(token);
  const dados = await colher({ token, siteUrl, permissao, janela, flags, hoje });

  const caminho = join(flags.saida, `baseline-${hoje}.md`);
  await escreverAtomico(caminho, renderizarBaseline(dados));
  imprimirResumo(dados, caminho);
}

principal().catch((erro) => {
  morrer(erro instanceof Error ? erro.message : String(erro));
});
