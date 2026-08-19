/**
 * A parte PURA do `pnpm gsc:baseline`: agrega, decide e renderiza o Markdown.
 *
 * ─── POR QUE SEPARADO DO `baseline.mjs` ──────────────────────────────────────
 *
 * Nada aqui faz rede, lê chave, toca disco ou olha o relógio. Tudo entra por
 * argumento e sai como valor. É o que permite testar a regra que realmente
 * decide dinheiro — o gatilho da rodada 4, a posição ponderada por hub — sem
 * gastar quota da API e sem fixture de credencial. O `baseline.mjs` é o
 * contrário: só I/O, zero regra.
 *
 * ─── A REGRA DE OURO DO DIA ZERO ─────────────────────────────────────────────
 *
 * O site entrou no ar em 2026-08-18 e o Search Console atrasa ~2 dias. Onde não
 * há dado, o relatório diz `sem dado ainda (site no ar desde ...)` e para por
 * aí. Nenhuma seção estima, arredonda para cima ou "projeta" — um baseline que
 * inventa o dia zero destrói a própria comparação de quatro semanas depois.
 */

/** Com `www`, sem barra final — a forma canônica de toda URL do site. */
export const DOMINIO_PADRAO = 'https://www.doxaviral.com';

/** O dia em que a biblioteca entrou no ar. Âncora de honestidade do relatório. */
export const NO_AR_DESDE = '2026-08-18';

/** A ÚNICA frase para "não há dado". Repetida à mão ela divergiria. */
export const SEM_DADO = `sem dado ainda (site no ar desde ${NO_AR_DESDE})`;

/** O aviso fixo da seção 1 — o leitor tem de saber por que está tudo vazio. */
export const AVISO_ATRASO = `o GSC atrasa ~2 dias; site no ar desde ${NO_AR_DESDE}`;

/** Quantos dias de coleta um baseline precisa para valer comparação. */
export const DIAS_PARA_BASELINE = 28;

/** O que a seção 3 escreve quando a execução pulou a URL Inspection. */
export const SEM_INSPECAO = 'não inspecionado nesta execução';

/**
 * O `coverageState` de quem o Google nunca viu — na língua CANÔNICA da API.
 *
 * A inspeção é pedida em `en-US` (`IDIOMA_DA_INSPECAO`, em `api.mjs`) por causa
 * desta linha: em pt-BR a mesma resposta vem como "O Google não reconhece o
 * URL", a comparação abaixo nunca casa e a seção 8 afirma que o Google conhece
 * todas as URLs do sitemap. Mexeu no idioma lá, mexe aqui.
 */
export const URL_DESCONHECIDA = 'URL is unknown to Google';

/**
 * Tira a barra final para COMPARAR urls, nunca para exibi-las.
 *
 * As `keys[].page` do GSC vêm sem barra final; a home é `.../`. Comparar cru
 * faria a home do sitemap não casar com a home do índice local, e a divergência
 * apareceria na seção 2 como se fosse achado — quando é só formatação.
 *
 * @param {string} url
 * @return {string}
 */
function semBarraFinal(url) {
  const texto = typeof url === 'string' ? url : '';
  return texto.length > 1 && texto.endsWith('/') ? texto.slice(0, -1) : texto;
}

/**
 * Os `<loc>` de um sitemap XML, na ordem, sem repetição.
 *
 * Regex e não parser de XML de propósito: a única coisa que se quer do arquivo
 * é a lista de URLs, e o sitemap é gerado por nós (`src/seo/sitemap.ts`), não
 * por terceiro.
 *
 * @param {string} xml
 * @return {string[]}
 */
export function extrairLocs(xml) {
  const texto = typeof xml === 'string' ? xml : '';
  const vistas = new Set();
  for (const achado of texto.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    vistas.add(achado[1]);
  }
  return [...vistas];
}

/**
 * @typedef {object} EntradaDoMapa
 * @property {string} tipo tipo da página, mais `indice` e `home`.
 * @property {string[]} hubs clusters a que ela pertence (URLs de hub).
 * @property {string} titulo
 */

/**
 * URL absoluta → tipo/hubs/título, para toda página que este build publica.
 *
 * Uma página de tipo `hub` entra no PRÓPRIO cluster: ela é a cabeça dele, e
 * deixá-la fora faria a linha do hub na seção 6 medir o cluster sem a página
 * que mais recebe link dele.
 *
 * @param {{paginas: readonly object[], secoes: readonly object[],
 *   urlDe: (pagina: object) => string, dominio?: string}} entrada
 * @return {Map<string, EntradaDoMapa>}
 */
export function montarMapa({ paginas, secoes, urlDe, dominio = DOMINIO_PADRAO }) {
  const mapa = new Map();
  mapa.set(`${dominio}/`, { tipo: 'home', hubs: [], titulo: 'Home' });

  for (const pagina of paginas ?? []) {
    const caminho = urlDe(pagina);
    const hubs = pagina.tipo === 'hub' ? [caminho] : [...(pagina.hubs ?? [])];
    mapa.set(`${dominio}${caminho}`, { tipo: pagina.tipo, hubs, titulo: pagina.titulo });
  }

  for (const secao of secoes ?? []) {
    const url = `${dominio}${secao.url}`;
    if (!mapa.has(url)) {
      mapa.set(url, { tipo: 'indice', hubs: [], titulo: secao.h1 ?? secao.titulo ?? secao.url });
    }
  }

  return mapa;
}

/**
 * Acha a URL no mapa tolerando a barra final dos dois lados.
 *
 * @param {Map<string, EntradaDoMapa>} mapa
 * @param {string} url
 * @return {EntradaDoMapa | undefined}
 */
export function procurarNoMapa(mapa, url) {
  const direto = mapa.get(url);
  if (direto !== undefined) {
    return direto;
  }
  const sem = semBarraFinal(url);
  return mapa.get(sem) ?? mapa.get(`${sem}/`);
}

/** O rótulo das páginas que o GSC reporta e o índice local não conhece. */
const FORA_DO_INDICE = '(fora do índice)';

/** O rótulo de quem não pertence a cluster nenhum — home e índices de seção. */
const SEM_HUB = '(sem hub)';

/**
 * As chaves de agregação de uma página, na dimensão pedida.
 *
 * @param {EntradaDoMapa | undefined} dados
 * @param {'tipo' | 'hub'} dimensao
 * @return {string[]}
 */
function chavesDe(dados, dimensao) {
  if (dados === undefined) {
    return [FORA_DO_INDICE];
  }
  if (dimensao === 'tipo') {
    return [dados.tipo];
  }
  return dados.hubs.length === 0 ? [SEM_HUB] : [...dados.hubs];
}

/**
 * @typedef {object} LinhaAgregada
 * @property {string} chave
 * @property {number} paginas quantas páginas tiveram linha no GSC.
 * @property {number} impressoes
 * @property {number} cliques
 * @property {number | null} ctr fração (0–1); `null` sem impressão.
 * @property {number | null} posicao média PONDERADA por impressões.
 */

/**
 * Soma as linhas por página em `tipo` ou `hub` — página com 2 hubs conta nos 2.
 *
 * A posição é ponderada por impressões, não média simples: uma página com 3
 * impressões na posição 2 não pode puxar o cluster inteiro para cima de outra
 * com 3000 impressões na posição 40. Toda chave do mapa aparece na saída, mesmo
 * zerada — no dia zero a tabela vazia é a informação.
 *
 * @param {ReadonlyArray<{keys: string[], clicks?: number, impressions?: number,
 *   position?: number}>} linhasPorPagina
 * @param {Map<string, EntradaDoMapa>} mapa
 * @param {'tipo' | 'hub'} dimensao
 * @return {LinhaAgregada[]}
 */
export function agregarPor(linhasPorPagina, mapa, dimensao) {
  const acumulado = new Map();
  const semear = (chave) => {
    if (!acumulado.has(chave)) {
      acumulado.set(chave, { paginas: new Set(), impressoes: 0, cliques: 0, somaPosicao: 0 });
    }
    return acumulado.get(chave);
  };

  for (const dados of mapa.values()) {
    for (const chave of chavesDe(dados, dimensao)) {
      semear(chave);
    }
  }

  for (const linha of linhasPorPagina ?? []) {
    const pagina = linha?.keys?.[0];
    if (typeof pagina !== 'string') {
      continue;
    }
    const impressoes = linha.impressions ?? 0;
    for (const chave of chavesDe(procurarNoMapa(mapa, pagina), dimensao)) {
      const alvo = semear(chave);
      alvo.paginas.add(semBarraFinal(pagina));
      alvo.impressoes += impressoes;
      alvo.cliques += linha.clicks ?? 0;
      alvo.somaPosicao += (linha.position ?? 0) * impressoes;
    }
  }

  return [...acumulado.entries()]
    .map(([chave, valor]) => ({
      chave,
      paginas: valor.paginas.size,
      impressoes: valor.impressoes,
      cliques: valor.cliques,
      ctr: valor.impressoes === 0 ? null : valor.cliques / valor.impressoes,
      posicao: valor.impressoes === 0 ? null : valor.somaPosicao / valor.impressoes,
    }))
    .sort((a, b) => b.impressoes - a.impressoes || a.chave.localeCompare(b.chave, 'pt-BR'));
}

/**
 * Soma linhas do GSC por página (a `keys[indice]` é a URL).
 *
 * @param {ReadonlyArray<object>} linhas
 * @param {number} indice posição da URL dentro de `keys`.
 * @return {Map<string, {pagina: string, impressoes: number, cliques: number,
 *   somaPosicao: number}>}
 */
function somarPorPagina(linhas, indice) {
  const total = new Map();
  for (const linha of linhas ?? []) {
    const pagina = linha?.keys?.[indice];
    if (typeof pagina !== 'string') {
      continue;
    }
    const chave = semBarraFinal(pagina);
    const atual = total.get(chave) ?? { pagina, impressoes: 0, cliques: 0, somaPosicao: 0 };
    const impressoes = linha.impressions ?? 0;
    atual.impressoes += impressoes;
    atual.cliques += linha.clicks ?? 0;
    atual.somaPosicao += (linha.position ?? 0) * impressoes;
    total.set(chave, atual);
  }
  return total;
}

/**
 * As 3 queries de maior impressão de uma página.
 *
 * @param {ReadonlyArray<object>} linhasQueryPagina linhas de `['query','page']`.
 * @param {string} pagina
 * @return {Array<{query: string, impressoes: number, posicao: number}>}
 */
function topQueriesDa(linhasQueryPagina, pagina) {
  const alvo = semBarraFinal(pagina);
  return (linhasQueryPagina ?? [])
    .filter((linha) => semBarraFinal(linha?.keys?.[1] ?? '') === alvo)
    .map((linha) => ({
      query: linha.keys[0],
      impressoes: linha.impressions ?? 0,
      posicao: linha.position ?? 0,
    }))
    .sort((a, b) => b.impressoes - a.impressoes)
    .slice(0, 3);
}

/**
 * O GATILHO DA RODADA 4 — a regra fixa, num lugar só.
 *
 * Página com posição média entre 8 e 20 (inclusive) E impressões ≥ o mínimo na
 * janela. É a página que já aparece e não é clicada: mexer nela rende mais que
 * escrever uma nova. As bordas são inclusivas de propósito — 8.0 e 20.0 entram.
 *
 * Recebe as DUAS consultas: as linhas por página dão o número autoritativo (é
 * o mesmo da seção 5) e as de query+página dão as três queries que explicam a
 * linha. Sem as linhas por página, agrega as de query — o total de impressões
 * por query pode ser maior que o da página, e é por isso que ele é o segundo
 * recurso, não o primeiro.
 *
 * @param {{linhasPorPagina?: ReadonlyArray<object>,
 *   linhasQueryPagina?: ReadonlyArray<object>}} consultas
 * @param {{posicaoMin?: number, posicaoMax?: number, minImpressoes?: number}} [regra]
 * @return {Array<{pagina: string, impressoes: number, cliques: number,
 *   posicao: number, queries: Array<{query: string, impressoes: number,
 *   posicao: number}>}>}
 */
export function gatilhoRodada4(
  { linhasPorPagina = [], linhasQueryPagina = [] } = {},
  { posicaoMin = 8, posicaoMax = 20, minImpressoes = 30 } = {},
) {
  const total =
    linhasPorPagina.length > 0
      ? somarPorPagina(linhasPorPagina, 0)
      : somarPorPagina(linhasQueryPagina, 1);

  return [...total.values()]
    .filter((linha) => linha.impressoes >= minImpressoes)
    .map((linha) => ({
      pagina: linha.pagina,
      impressoes: linha.impressoes,
      cliques: linha.cliques,
      posicao: linha.somaPosicao / linha.impressoes,
      queries: topQueriesDa(linhasQueryPagina, linha.pagina),
    }))
    .filter((linha) => linha.posicao >= posicaoMin && linha.posicao <= posicaoMax)
    .sort((a, b) => b.impressoes - a.impressoes);
}

/**
 * Conta `verdict × coverageState` dos resultados da URL Inspection.
 *
 * URL que falhou na chamada vira a linha `erro`, com o motivo no lugar do
 * `coverageState` — some-la do resumo faria a soma das contagens não bater com
 * o número de URLs inspecionadas, que é exatamente a conferência que se faz.
 *
 * @param {ReadonlyArray<{verdict?: string, coverageState?: string,
 *   erro?: string}>} resultados
 * @return {Array<{verdict: string, coverageState: string, contagem: number}>}
 */
export function resumirInspecao(resultados) {
  // O valor do `Map` é o objeto pronto, e a chave é só um identificador: o
  // `coverageState` TEM espaço ("Submitted and indexed"), então remontar o par
  // por `split` de separador seria quebrar o texto no primeiro espaço dele.
  const contagem = new Map();
  for (const resultado of resultados ?? []) {
    const houveErro = typeof resultado?.erro === 'string' && resultado.erro !== '';
    const verdict = houveErro ? 'erro' : (resultado?.verdict ?? 'VERDICT_UNSPECIFIED');
    const coverageState = houveErro ? resultado.erro : (resultado?.coverageState ?? '—');
    const chave = `${verdict} :: ${coverageState}`;
    const atual = contagem.get(chave) ?? { verdict, coverageState, contagem: 0 };
    atual.contagem += 1;
    contagem.set(chave, atual);
  }

  return [...contagem.values()].sort(
    (a, b) =>
      b.contagem - a.contagem ||
      a.verdict.localeCompare(b.verdict) ||
      a.coverageState.localeCompare(b.coverageState),
  );
}

/**
 * O que está no sitemap no ar e não no índice local, e vice-versa.
 *
 * Achado, não erro: uma URL só no ar é página apagada com sitemap velho em
 * cache; uma só no índice é build que ainda não subiu.
 *
 * @param {readonly string[]} locs
 * @param {Map<string, EntradaDoMapa>} mapa
 * @return {{soNoAr: string[], soNoIndice: string[]}}
 */
export function divergencias(locs, mapa) {
  const noAr = new Set((locs ?? []).map(semBarraFinal));
  const soNoAr = (locs ?? []).filter((url) => procurarNoMapa(mapa, url) === undefined);
  const soNoIndice = [...mapa.keys()].filter((url) => !noAr.has(semBarraFinal(url)));
  return { soNoAr, soNoIndice: soNoIndice.sort() };
}

/** Inteiro sem separador de milhar — o relatório é lido em diff, não em planilha. */
function inteiro(valor) {
  return String(Math.round(valor ?? 0));
}

/** Posição com 1 casa; `—` quando não há impressão para ponderar. */
function posicao(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor.toFixed(1) : '—';
}

/** CTR em % com 1 casa; `—` quando não há impressão. */
function taxa(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) ? `${(valor * 100).toFixed(1)}%` : '—';
}

/**
 * Escapa a barra vertical: query com `|` quebraria a tabela Markdown inteira.
 *
 * @param {unknown} valor
 * @return {string}
 */
function celula(valor) {
  return String(valor ?? '—').replaceAll('|', '\\|');
}

/**
 * Monta uma tabela Markdown; sem linhas, devolve a frase de vazio.
 *
 * @param {readonly string[]} cabecalho
 * @param {ReadonlyArray<readonly unknown[]>} linhas
 * @param {string} vazio
 * @return {string}
 */
function tabela(cabecalho, linhas, vazio) {
  if (linhas.length === 0) {
    return vazio;
  }
  const topo = `| ${cabecalho.join(' | ')} |`;
  const regua = `| ${cabecalho.map(() => '---').join(' | ')} |`;
  const corpo = linhas.map((linha) => `| ${linha.map(celula).join(' | ')} |`);
  return [topo, regua, ...corpo].join('\n');
}

/** @param {object} dados @return {string} */
function secao1(dados) {
  const { propriedade, janela, datasComDado } = dados;
  const primeira = datasComDado.length === 0 ? SEM_DADO : datasComDado[0];
  const ultima = datasComDado.length === 0 ? SEM_DADO : datasComDado[datasComDado.length - 1];
  return [
    '## 1. Propriedade e janela',
    '',
    `- **siteUrl:** \`${propriedade.siteUrl}\``,
    `- **tipo:** ${propriedade.tipo}`,
    `- **permissão:** ${propriedade.permissao}`,
    `- **janela pedida:** ${janela.inicio} → ${janela.fim} (${janela.dias} dias)`,
    `- **primeira data com dado:** ${primeira}`,
    `- **última data com dado:** ${ultima}`,
    `- **dias com dado:** ${datasComDado.length}`,
    `- **aviso:** ${AVISO_ATRASO}`,
  ].join('\n');
}

/** @param {object} dados @return {string} */
function secao2(dados) {
  const { sitemapGsc, locsNoAr, mapa } = dados;
  const { soNoAr, soNoIndice } = divergencias(locsNoAr, mapa);
  const submetidas = (sitemapGsc?.contents ?? [])
    .map((conteudo) => `${conteudo.type}: ${inteiro(conteudo.submitted)}`)
    .join(', ');

  const estado =
    sitemapGsc == null
      ? ['- **no GSC:** o sitemap da Doxa NÃO consta em `sitemaps.list`.']
      : [
          `- **path:** \`${sitemapGsc.path}\``,
          `- **lastSubmitted:** ${sitemapGsc.lastSubmitted ?? '(nunca)'}`,
          `- **lastDownloaded:** ${sitemapGsc.lastDownloaded ?? '(ainda não baixado)'}`,
          `- **isPending:** ${sitemapGsc.isPending === true}`,
          `- **errors / warnings:** ${inteiro(sitemapGsc.errors)} / ${inteiro(sitemapGsc.warnings)}`,
          `- **submitted:** ${submetidas === '' ? '—' : submetidas}`,
        ];

  return [
    '## 2. Sitemap (API × ar × índice local)',
    '',
    ...estado,
    `- **\`<loc>\` no sitemap no ar:** ${locsNoAr.length}`,
    `- **URLs no índice local:** ${mapa.size} (${dados.contagemIndice.paginas} páginas + ` +
      `${dados.contagemIndice.indices} índices de seção + 1 home)`,
    '',
    '`contents[].indexed` não aparece aqui de propósito: é campo depreciado da API e',
    'devolve 0 sempre — quem indexou de verdade está na seção 3.',
    '',
    '**Divergências**',
    '',
    soNoAr.length === 0 && soNoIndice.length === 0
      ? '- nenhuma: o sitemap no ar e o índice local publicam exatamente as mesmas URLs.'
      : [
          ...soNoAr.map((url) => `- só no AR (não existe no índice local): ${url}`),
          ...soNoIndice.map((url) => `- só no ÍNDICE local (não está no sitemap no ar): ${url}`),
        ].join('\n'),
  ].join('\n');
}

/** @param {object} dados @return {string} */
function secao3(dados) {
  const { inspecao, mapa } = dados;
  if (!inspecao.feita) {
    return ['## 3. Cobertura por URL (URL Inspection)', '', SEM_INSPECAO].join('\n');
  }

  const resumo = resumirInspecao(inspecao.resultados);
  const linhas = inspecao.resultados.map((resultado) => [
    resultado.url,
    procurarNoMapa(mapa, resultado.url)?.tipo ?? '(fora do índice)',
    resultado.erro == null ? (resultado.verdict ?? '—') : 'erro',
    resultado.erro ?? resultado.coverageState ?? '—',
    resultado.lastCrawlTime ?? '—',
  ]);

  return [
    '## 3. Cobertura por URL (URL Inspection)',
    '',
    `URLs inspecionadas: **${inspecao.resultados.length}**` +
      (inspecao.abortada ? ' — inspeção ABORTADA: 10 erros seguidos da API.' : ''),
    '',
    'O `coverageState` vem em inglês de propósito: ele é a chave que classifica a URL,',
    'e traduzido pela API ele muda de texto e quebra a regra que conta as indexadas.',
    '',
    tabela(['verdict', 'coverageState', 'URLs'], resumo.map((linha) => [
      linha.verdict,
      linha.coverageState,
      inteiro(linha.contagem),
    ]), '(nenhuma URL inspecionada)'),
    '',
    tabela(['url', 'tipo', 'verdict', 'coverageState', 'lastCrawlTime'], linhas, SEM_DADO),
  ].join('\n');
}

/** Quantas URLs por posição na janela — o topo da seção 4. */
const TOPO_DE_QUERIES = 50;

/** @param {object} dados @return {string} */
function secao4(dados) {
  const linhas = [...(dados.linhasQueryPagina ?? [])]
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, TOPO_DE_QUERIES)
    .map((linha) => [
      linha.keys[0],
      linha.keys[1],
      inteiro(linha.impressions),
      inteiro(linha.clicks),
      taxa(linha.ctr),
      posicao(linha.position),
    ]);

  return [
    `## 4. Queries com impressões (últimos ${dados.janela.dias} dias)`,
    '',
    tabela(
      ['query', 'página', 'impressões', 'cliques', 'CTR', 'posição'],
      linhas,
      `${SEM_DADO} — nenhuma query devolveu impressão na janela.`,
    ),
  ].join('\n');
}

/** @param {object} dados @return {string} */
function secao5(dados) {
  const { linhasPorPagina, mapa } = dados;
  const comDado = new Set(
    (linhasPorPagina ?? []).map((linha) => semBarraFinal(linha?.keys?.[0] ?? '')),
  );
  const semLinha = [...mapa.keys()].filter((url) => !comDado.has(semBarraFinal(url)));

  const linhas = [...(linhasPorPagina ?? [])]
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .map((linha) => {
      const dadosDaPagina = procurarNoMapa(mapa, linha.keys[0]);
      return [
        linha.keys[0],
        inteiro(linha.impressions),
        inteiro(linha.clicks),
        taxa(linha.ctr),
        posicao(linha.position),
        dadosDaPagina?.tipo ?? '(fora do índice)',
        dadosDaPagina?.hubs?.[0] ?? '—',
      ];
    });

  return [
    '## 5. Desempenho por página',
    '',
    tabela(
      ['página', 'impressões', 'cliques', 'CTR', 'posição', 'tipo', 'hub principal'],
      linhas,
      `${SEM_DADO} — nenhuma página devolveu impressão na janela.`,
    ),
    '',
    `${semLinha.length} páginas sem impressão registrada na janela.`,
  ].join('\n');
}

/** @param {object} dados @return {string} */
function secao6(dados) {
  const cabecalho = ['chave', 'páginas com dado', 'impressões', 'cliques', 'posição média'];
  const paraTabela = (linhas) =>
    linhas.map((linha) => [
      linha.chave,
      inteiro(linha.paginas),
      inteiro(linha.impressoes),
      inteiro(linha.cliques),
      posicao(linha.posicao),
    ]);

  return [
    '## 6. Posição média por tipo e por hub',
    '',
    'Posição média **ponderada por impressões** — a média simples deixaria uma página',
    'de 3 impressões mandar no cluster inteiro.',
    '',
    '**Por tipo**',
    '',
    tabela(cabecalho, paraTabela(agregarPor(dados.linhasPorPagina, dados.mapa, 'tipo')), SEM_DADO),
    '',
    '**Por hub (cluster)** — página com 2 hubs conta nos 2.',
    '',
    tabela(cabecalho, paraTabela(agregarPor(dados.linhasPorPagina, dados.mapa, 'hub')), SEM_DADO),
  ].join('\n');
}

/** @param {object} dados @return {string} */
function secao7(dados) {
  const { regra, janela, datasComDado } = dados;
  const noGatilho = gatilhoRodada4(dados, regra);
  const coletaCompleta = datasComDado.length >= DIAS_PARA_BASELINE;

  const lista =
    noGatilho.length === 0
      ? ['nenhuma página no gatilho ainda.']
      : noGatilho.map((linha) => {
          const queries = linha.queries
            .map((item) => `\`${item.query}\` (${inteiro(item.impressoes)} impr.)`)
            .join(', ');
          return (
            `- ${linha.pagina} — ${inteiro(linha.impressoes)} impressões, ` +
            `posição ${posicao(linha.posicao)}, ${inteiro(linha.cliques)} cliques. ` +
            `Top queries: ${queries === '' ? '—' : queries}`
          );
        });

  return [
    '## 7. Gatilho da rodada 4',
    '',
    'A regra, fixa: **posição média entre 8 e 20 (inclusive) E impressões ≥ ' +
      `${regra.minImpressoes} em ${DIAS_PARA_BASELINE} dias**, com pelo menos ` +
      `${DIAS_PARA_BASELINE} dias de coleta.`,
    '',
    coletaCompleta
      ? `Coleta: ${datasComDado.length} dias com dado na janela de ${janela.dias} dias.`
      : `Ainda sem ${DIAS_PARA_BASELINE} dias de coleta (${datasComDado.length} dias com dado) — ` +
        'a lista abaixo é indicativa e a rodada 4 NÃO dispara por ela.',
    '',
    ...lista,
  ].join('\n');
}

/**
 * A leitura do dia zero — gerada por REGRA, não por prosa.
 *
 * Cada linha sai de um número das seções acima. Nada de adjetivo: o relatório
 * que se elogia sozinho é o que ninguém confere.
 *
 * @param {object} dados
 * @return {string}
 */
function secao8(dados) {
  const { inspecao, locsNoAr, datasComDado, sitemapGsc } = dados;
  const resultados = inspecao.feita ? inspecao.resultados : [];
  const conhecidas = resultados.filter(
    (item) => item.erro == null && item.coverageState !== URL_DESCONHECIDA,
  ).length;
  const indexadas = resultados.filter((item) => item.verdict === 'PASS').length;
  const noGatilho = gatilhoRodada4(dados, dados.regra);
  const queriesComImpressao = (dados.linhasQueryPagina ?? []).filter(
    (linha) => (linha.impressions ?? 0) > 0,
  ).length;

  const cobertura = inspecao.feita
    ? `- O Google conhece ${conhecidas} das ${locsNoAr.length} URLs do sitemap e indexou ${indexadas}.`
    : `- Cobertura por URL: ${SEM_INSPECAO}.`;
  const sitemap =
    sitemapGsc == null
      ? '- O sitemap não consta na propriedade — nada foi processado.'
      : `- O sitemap foi baixado pelo Google em ${sitemapGsc.lastDownloaded ?? '(ainda não)'}, ` +
        `com ${inteiro(sitemapGsc.errors)} erro(s) e ${inteiro(sitemapGsc.warnings)} aviso(s).`;

  return [
    '## 8. Leitura honesta do dia zero',
    '',
    cobertura,
    sitemap,
    `- Há ${datasComDado.length} dia(s) com dado de busca na janela; ${queriesComImpressao} ` +
      'linha(s) de query com impressão.',
    `- Páginas no gatilho da rodada 4: ${noGatilho.length}.`,
    `- baseline útil pede ~4 semanas de coleta; este é o dia zero.`,
  ].join('\n');
}

/**
 * O relatório inteiro, em Markdown — as 8 seções, sempre, mesmo vazias.
 *
 * Seção fixa e título fixo porque a documentação referencia cada uma pelo nome:
 * sumir com a seção 4 num dia sem query quebraria o link de quem lê.
 *
 * @param {object} dados tudo o que `baseline.mjs` colheu.
 * @return {string}
 */
export function renderizarBaseline(dados) {
  return [
    `# Baseline GSC — ${dados.geradoEm} (dia zero)`,
    '',
    'Gerado por `pnpm gsc:baseline` a partir da Search Console API.',
    `Aviso: ${AVISO_ATRASO}.`,
    'Onde não há dado, está escrito que não há — nada aqui é estimado.',
    '',
    secao1(dados),
    '',
    secao2(dados),
    '',
    secao3(dados),
    '',
    secao4(dados),
    '',
    secao5(dados),
    '',
    secao6(dados),
    '',
    secao7(dados),
    '',
    secao8(dados),
    '',
  ].join('\n');
}
