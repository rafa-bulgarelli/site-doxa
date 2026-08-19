/**
 * Testes de `relatorio.mjs` — a parte que DECIDE.
 *
 * Nada aqui toca rede, chave, disco ou a API do Google: tudo é fixture
 * inventada. É de propósito — o valor deste arquivo é provar a regra do gatilho
 * da rodada 4 e a ponderação da posição, e essas duas não precisam de quota.
 *
 * Onde um engano custa caro: uma média SIMPLES de posição por cluster faria a
 * torre reescrever a página errada, e ninguém perceberia — o relatório sairia
 * bonito com o número trocado.
 */
import { describe, expect, it } from 'vitest';
import {
  DOMINIO_PADRAO,
  SEM_DADO,
  SEM_INSPECAO,
  URL_DESCONHECIDA,
  agregarPor,
  divergencias,
  extrairLocs,
  gatilhoRodada4,
  montarMapa,
  renderizarBaseline,
  resumirInspecao,
} from './relatorio.mjs';

const D = DOMINIO_PADRAO;

/** Uma página de conteúdo mínima, no formato de `src/seo/tipos.ts`. */
function pagina(tipo, slug, hubs, titulo = slug) {
  return { tipo, slug, hubs, titulo };
}

/** O `urlDe` do índice real, reduzido ao que o mapa precisa. */
const PREFIXO = {
  solucao: '/solucoes',
  plataforma: '/plataformas',
  guia: '/guias',
  dor: '/guias',
  comparativo: '/comparativos',
  glossario: '/glossario',
  hub: '/guias',
};
const urlDe = (p) => `${PREFIXO[p.tipo]}/${p.slug}`;

const PAGINAS = [
  pagina('solucao', 'video-com-ia', ['/guias/ia-no-marketing']),
  pagina('guia', 'retencao', ['/guias/videos-curtos', '/guias/ia-no-marketing']),
  pagina('hub', 'videos-curtos', []),
];
const SECOES = [
  { url: '/solucoes', titulo: 'Soluções', h1: 'Soluções' },
  { url: '/guias', titulo: 'Guias', h1: 'Guias' },
];
const MAPA = montarMapa({ paginas: PAGINAS, secoes: SECOES, urlDe });

/** Linha de `searchAnalytics` no formato que a API devolve. */
function linhaPagina(url, impressions, position, clicks = 0) {
  return { keys: [url], clicks, impressions, ctr: impressions === 0 ? 0 : clicks / impressions, position };
}

/** Linha de `['query','page']`. */
function linhaQuery(query, url, impressions, position, clicks = 0) {
  return {
    keys: [query, url],
    clicks,
    impressions,
    ctr: impressions === 0 ? 0 : clicks / impressions,
    position,
  };
}

/** O `dados` que `renderizarBaseline` espera, no estado "dia zero". */
function dadosVazios(extra = {}) {
  return {
    geradoEm: '2026-08-19',
    propriedade: { siteUrl: 'sc-domain:doxaviral.com', tipo: 'Domínio', permissao: 'siteFullUser' },
    janela: { inicio: '2026-07-22', fim: '2026-08-19', dias: 28 },
    datasComDado: [],
    sitemapGsc: null,
    locsNoAr: [`${D}/`],
    mapa: MAPA,
    contagemIndice: { paginas: PAGINAS.length, indices: SECOES.length, home: 1 },
    linhasPorPagina: [],
    linhasQueryPagina: [],
    inspecao: { feita: false, resultados: [], abortada: false },
    regra: { posicaoMin: 8, posicaoMax: 20, minImpressoes: 30 },
    ...extra,
  };
}

describe('extrairLocs', () => {
  it('tira as URLs de um sitemap e ignora o resto do XML', () => {
    const xml = `<?xml version="1.0"?>
      <urlset><url><loc>${D}/</loc><lastmod>2026-08-18</lastmod></url>
      <url><loc>${D}/guias/retencao</loc></url>
      <url><loc>  ${D}/solucoes/video-com-ia  </loc></url></urlset>`;
    expect(extrairLocs(xml)).toEqual([
      `${D}/`,
      `${D}/guias/retencao`,
      `${D}/solucoes/video-com-ia`,
    ]);
  });

  it('devolve lista vazia para XML sem `<loc>` — e não explode', () => {
    expect(extrairLocs('<urlset></urlset>')).toEqual([]);
    expect(extrairLocs(undefined)).toEqual([]);
  });
});

describe('montarMapa', () => {
  it('inclui a home (com barra) e os índices de seção, além das páginas', () => {
    expect(MAPA.get(`${D}/`)?.tipo).toBe('home');
    expect(MAPA.get(`${D}/solucoes`)?.tipo).toBe('indice');
    expect(MAPA.get(`${D}/solucoes/video-com-ia`)?.tipo).toBe('solucao');
    expect(MAPA.size).toBe(6);
  });

  it('põe a página de hub no PRÓPRIO cluster — ela é a cabeça dele', () => {
    expect(MAPA.get(`${D}/guias/videos-curtos`)?.hubs).toEqual(['/guias/videos-curtos']);
  });
});

describe('agregarPor', () => {
  it("pondera a posição por impressões, não por média simples ('tipo')", () => {
    // 10 impressões na posição 40 e 90 na posição 10: a média simples daria 25,
    // e a ponderada dá 13 — é a ponderada que descreve o que o usuário vê.
    const linhas = [
      linhaPagina(`${D}/solucoes/video-com-ia`, 10, 40),
      linhaPagina(`${D}/guias/retencao`, 90, 10),
    ];
    const porTipo = agregarPor(linhas, MAPA, 'tipo');
    const solucao = porTipo.find((linha) => linha.chave === 'solucao');
    const guia = porTipo.find((linha) => linha.chave === 'guia');
    expect(solucao.posicao).toBeCloseTo(40, 5);
    expect(guia.posicao).toBeCloseTo(10, 5);

    const porHub = agregarPor(linhas, MAPA, 'hub');
    const ia = porHub.find((linha) => linha.chave === '/guias/ia-no-marketing');
    expect(ia.impressoes).toBe(100);
    expect(ia.posicao).toBeCloseTo(13, 5);
  });

  it('conta a página de 2 hubs nos DOIS clusters', () => {
    const linhas = [linhaPagina(`${D}/guias/retencao`, 50, 12, 5)];
    const porHub = agregarPor(linhas, MAPA, 'hub');
    const curtos = porHub.find((linha) => linha.chave === '/guias/videos-curtos');
    const ia = porHub.find((linha) => linha.chave === '/guias/ia-no-marketing');
    expect(curtos.impressoes).toBe(50);
    expect(ia.impressoes).toBe(50);
    expect(curtos.paginas).toBe(1);
  });

  it('mostra toda chave do mapa, mesmo zerada, com posição nula', () => {
    const porTipo = agregarPor([], MAPA, 'tipo');
    expect(porTipo.map((linha) => linha.chave).sort()).toEqual([
      'guia',
      'home',
      'hub',
      'indice',
      'solucao',
    ]);
    expect(porTipo.every((linha) => linha.posicao === null && linha.impressoes === 0)).toBe(true);
  });

  it('joga página desconhecida do índice local em `(fora do índice)`', () => {
    const porTipo = agregarPor([linhaPagina(`${D}/rota-que-nao-existe`, 7, 30)], MAPA, 'tipo');
    expect(porTipo.find((linha) => linha.chave === '(fora do índice)')?.impressoes).toBe(7);
  });
});

describe('gatilhoRodada4', () => {
  const regra = { posicaoMin: 8, posicaoMax: 20, minImpressoes: 30 };
  const url = `${D}/guias/retencao`;

  it('inclui as bordas 8.0 e 20.0 e exclui 7.9 e 20.1', () => {
    const dentro = (posicaoDaPagina) =>
      gatilhoRodada4({ linhasPorPagina: [linhaPagina(url, 100, posicaoDaPagina)] }, regra).length;
    expect(dentro(8)).toBe(1);
    expect(dentro(20)).toBe(1);
    expect(dentro(7.9)).toBe(0);
    expect(dentro(20.1)).toBe(0);
  });

  it('exige impressões ≥ o mínimo — 29 fica de fora, 30 entra', () => {
    const comImpressoes = (n) =>
      gatilhoRodada4({ linhasPorPagina: [linhaPagina(url, n, 12)] }, regra).length;
    expect(comImpressoes(29)).toBe(0);
    expect(comImpressoes(30)).toBe(1);
  });

  it('anexa as 3 queries de maior impressão da página, ordenadas', () => {
    const resultado = gatilhoRodada4(
      {
        linhasPorPagina: [linhaPagina(url, 200, 12, 3)],
        linhasQueryPagina: [
          linhaQuery('retencao de video', url, 120, 11),
          linhaQuery('como reter publico', url, 50, 14),
          linhaQuery('video curto retencao', url, 20, 18),
          linhaQuery('quarta query', url, 5, 30),
          linhaQuery('de outra pagina', `${D}/solucoes/video-com-ia`, 999, 9),
        ],
      },
      regra,
    );
    expect(resultado).toHaveLength(1);
    expect(resultado[0].queries.map((item) => item.query)).toEqual([
      'retencao de video',
      'como reter publico',
      'video curto retencao',
    ]);
  });

  it('cai nas linhas de query+página quando não há consulta por página', () => {
    const resultado = gatilhoRodada4(
      {
        linhasQueryPagina: [
          linhaQuery('uma', url, 20, 10),
          linhaQuery('outra', url, 20, 10),
        ],
      },
      regra,
    );
    expect(resultado).toHaveLength(1);
    expect(resultado[0].impressoes).toBe(40);
  });

  it('devolve lista vazia no dia zero, sem linha nenhuma', () => {
    expect(gatilhoRodada4({}, regra)).toEqual([]);
  });
});

describe('resumirInspecao', () => {
  it('conta verdict × coverageState sem quebrar o texto com espaço', () => {
    const resumo = resumirInspecao([
      { verdict: 'PASS', coverageState: 'Submitted and indexed' },
      { verdict: 'PASS', coverageState: 'Submitted and indexed' },
      { verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google' },
      { erro: 'HTTP 429' },
    ]);
    expect(resumo[0]).toEqual({
      verdict: 'PASS',
      coverageState: 'Submitted and indexed',
      contagem: 2,
    });
    expect(resumo.find((linha) => linha.verdict === 'erro')).toEqual({
      verdict: 'erro',
      coverageState: 'HTTP 429',
      contagem: 1,
    });
  });

  it('soma das contagens = número de URLs inspecionadas', () => {
    const resultados = Array.from({ length: 7 }, (_, indice) => ({
      verdict: indice % 2 === 0 ? 'PASS' : 'NEUTRAL',
      coverageState: indice % 2 === 0 ? 'Submitted and indexed' : 'Crawled - currently not indexed',
    }));
    const total = resumirInspecao(resultados).reduce((soma, linha) => soma + linha.contagem, 0);
    expect(total).toBe(7);
  });
});

describe('divergencias', () => {
  it('acha URL que só existe no ar e URL que só existe no índice local', () => {
    const locs = [`${D}/`, `${D}/guias/retencao`, `${D}/pagina-fantasma`];
    const { soNoAr, soNoIndice } = divergencias(locs, MAPA);
    expect(soNoAr).toEqual([`${D}/pagina-fantasma`]);
    expect(soNoIndice).toContain(`${D}/solucoes/video-com-ia`);
    expect(soNoIndice).not.toContain(`${D}/`);
  });

  it('não acusa a home por causa da barra final', () => {
    const { soNoAr, soNoIndice } = divergencias(
      [...MAPA.keys()].map((url) => (url.endsWith('/') ? url.slice(0, -1) : url)),
      MAPA,
    );
    expect(soNoAr).toEqual([]);
    expect(soNoIndice).toEqual([]);
  });
});

describe('renderizarBaseline', () => {
  it('escreve as 8 seções e diz "sem dado ainda" quando tudo está vazio', () => {
    const texto = renderizarBaseline(dadosVazios());
    for (let numero = 1; numero <= 8; numero += 1) {
      expect(texto).toMatch(new RegExp(`^## ${numero}\\. `, 'm'));
    }
    expect(texto).toContain(SEM_DADO);
    expect(texto).toContain('nenhuma página no gatilho ainda');
    expect(texto).toContain('este é o dia zero');
  });

  it('diz que não inspecionou quando a execução pulou a URL Inspection', () => {
    expect(renderizarBaseline(dadosVazios())).toContain(SEM_INSPECAO);
  });

  it('avisa que ainda não há 28 dias de coleta', () => {
    expect(renderizarBaseline(dadosVazios())).toContain('Ainda sem 28 dias de coleta');
  });

  it('lista a página do gatilho quando ela existe, com as queries', () => {
    const url = `${D}/guias/retencao`;
    const texto = renderizarBaseline(
      dadosVazios({
        datasComDado: Array.from({ length: 28 }, (_, indice) => `2026-07-${23 + indice}`),
        linhasPorPagina: [linhaPagina(url, 120, 12.4, 2)],
        linhasQueryPagina: [linhaQuery('retencao de video', url, 120, 12.4, 2)],
      }),
    );
    expect(texto).toContain(`- ${url} — 120 impressões, posição 12.4`);
    expect(texto).toContain('`retencao de video`');
    expect(texto).not.toContain('nenhuma página no gatilho ainda');
  });

  it('escapa a barra vertical de uma query — senão a tabela Markdown quebra', () => {
    const url = `${D}/guias/retencao`;
    const texto = renderizarBaseline(
      dadosVazios({ linhasQueryPagina: [linhaQuery('doxa | preco', url, 4, 30)] }),
    );
    expect(texto).toContain('doxa \\| preco');
  });

  it('resume a inspeção e conta as URLs inspecionadas', () => {
    const texto = renderizarBaseline(
      dadosVazios({
        inspecao: {
          feita: true,
          abortada: false,
          resultados: [
            {
              url: `${D}/guias/retencao`,
              verdict: 'PASS',
              coverageState: 'Submitted and indexed',
              lastCrawlTime: '2026-08-19T10:00:00Z',
            },
            { url: `${D}/solucoes/video-com-ia`, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google' },
          ],
        },
      }),
    );
    expect(texto).toContain('URLs inspecionadas: **2**');
    expect(texto).toContain('| PASS | Submitted and indexed | 1 |');
    expect(texto).toContain('O Google conhece 1 das 1 URLs do sitemap e indexou 1.');
  });

  it('NÃO conta como conhecida a URL que o Google diz desconhecer', () => {
    const desconhecidas = Array.from({ length: 3 }, (_, indice) => ({
      url: `${D}/glossario/verbete-${indice}`,
      verdict: 'NEUTRAL',
      coverageState: URL_DESCONHECIDA,
    }));
    const texto = renderizarBaseline(
      dadosVazios({
        locsNoAr: [`${D}/`, ...desconhecidas.map((item) => item.url)],
        inspecao: {
          feita: true,
          abortada: false,
          resultados: [
            {
              url: `${D}/`,
              verdict: 'PASS',
              coverageState: 'Submitted and indexed',
              lastCrawlTime: '2026-08-19T10:00:00Z',
            },
            ...desconhecidas,
          ],
        },
      }),
    );
    expect(texto).toContain('O Google conhece 1 das 4 URLs do sitemap e indexou 1.');
  });

  it('NÃO deixa vazar credencial no texto gerado (sentinela)', () => {
    const texto = renderizarBaseline(dadosVazios());
    expect(texto).not.toMatch(/ya29\.|Bearer |private_key|BEGIN (RSA )?PRIVATE/);
  });
});
