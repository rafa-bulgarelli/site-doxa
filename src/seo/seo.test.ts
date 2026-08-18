import { describe, expect, it } from 'vitest';
import { urlAbsoluta } from './head';
import { linksInternosDe, paginas, resolverLink, secoes, urlDe, urlsPublicadas } from './indice';
import { renderizar, rotas } from './prerender/entrada';
import { entradas } from './sitemap';
import { HUBS, SECOES } from './site';

/**
 * As invariantes de TODA página SEO, presentes e futuras.
 *
 * Este arquivo é o gate do §39 do brief: title/h1/description duplicados,
 * canonical errado, slug fora do padrão, link interno quebrado, página órfã de
 * cluster e sitemap incompleto param aqui, e não numa auditoria três meses
 * depois com trinta páginas publicadas. Ele varre `paginas()`, então uma track
 * de conteúdo nova é coberta sem escrever teste nenhum.
 */

const TODAS = paginas();
const CSS = '/assets/index-teste.css';

/** O HTML de uma rota, renderizado uma vez e reaproveitado pelos casos. */
const HTML = new Map<string, string>(
  rotas().map((rota) => [rota, renderizar(rota, { cssHref: CSS })]),
);

function contar(html: string, agulha: string): number {
  return html.split(agulha).length - 1;
}

describe('o índice', () => {
  it('carregou pelo menos uma página', () => {
    expect(TODAS.length).toBeGreaterThan(0);
  });

  it('não tem URL repetida', () => {
    const urls = TODAS.map(urlDe);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('não repete title, h1 nem description entre páginas', () => {
    for (const campo of ['titulo', 'h1', 'descricao'] as const) {
      const valores = TODAS.map((pagina) => pagina[campo]);
      expect(new Set(valores).size, `${campo} duplicado`).toBe(valores.length);
    }
  });

  it('não repete o title de uma página com o de um índice de seção', () => {
    const titulos = [
      ...TODAS.map((pagina) => pagina.titulo),
      ...Object.values(SECOES).map((secao) => secao.titulo),
    ];
    expect(new Set(titulos).size).toBe(titulos.length);
  });
});

describe('cada página', () => {
  it.each(TODAS.map((pagina) => [urlDe(pagina), pagina] as const))('%s', (url, pagina) => {
    expect(pagina.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(url.startsWith('/')).toBe(true);
    expect(url.endsWith('/')).toBe(false);

    // 120–160 é a janela em que o Google mostra a description inteira. Curta
    // demais ele completa com texto da página; longa demais ele corta no meio.
    expect(pagina.descricao.length).toBeGreaterThanOrEqual(120);
    expect(pagina.descricao.length).toBeLessThanOrEqual(160);

    // 65 é o corte prático do title na SERP de desktop.
    expect(pagina.titulo.length).toBeLessThanOrEqual(65);
    expect(pagina.titulo.length).toBeGreaterThan(0);
    expect(pagina.h1.length).toBeGreaterThan(0);
    expect(pagina.resumo.length).toBeGreaterThan(0);
    expect(pagina.corpo.length).toBeGreaterThan(0);
    expect(pagina.palavrasChave.length).toBeGreaterThan(0);

    expect(pagina.atualizadoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(pagina.atualizadoEm))).toBe(false);

    // Página sem cluster é página órfã: ninguém linka para ela e ela não
    // sustenta autoridade nenhuma (§16).
    if (pagina.tipo === 'hub') {
      expect(Object.keys(HUBS)).toContain(url);
    } else {
      expect(pagina.hubs.length).toBeGreaterThanOrEqual(1);
    }
    for (const hub of pagina.hubs) {
      expect(Object.keys(HUBS)).toContain(hub);
    }
  });
});

describe('links internos', () => {
  it('todo link do corpo e das relacionadas existe ou está planejado', () => {
    for (const pagina of TODAS) {
      for (const href of linksInternosDe(pagina)) {
        expect(resolverLink(href), `${urlDe(pagina)} aponta para ${href}`).not.toBe('desconhecida');
      }
    }
  });

  it('nenhuma página linka para si mesma', () => {
    for (const pagina of TODAS) {
      expect(pagina.relacionadas).not.toContain(urlDe(pagina));
    }
  });
});

describe('o sitemap', () => {
  it('lista a home, todos os índices e todas as páginas — e nada mais', () => {
    const esperado = [urlAbsoluta('/'), ...urlsPublicadas().map(urlAbsoluta)].sort();
    expect(entradas().map((entrada) => entrada.loc).sort()).toEqual(esperado);
  });
});

describe('o HTML gerado', () => {
  it('cobre exatamente as rotas publicadas', () => {
    expect([...rotas()].sort()).toEqual([...urlsPublicadas()].sort());
    expect(rotas().length).toBe(TODAS.length + secoes().length);
  });

  it.each([...HTML.keys()])('%s', (rota) => {
    const html = HTML.get(rota);
    if (html == null) throw new Error(`Sem HTML para ${rota}`);

    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<html lang="pt-BR">');

    // Exatamente um h1: é a hierarquia que o §22 cobra, e dois h1 numa página
    // fazem o buscador escolher sozinho qual é o assunto.
    expect(contar(html, '<h1')).toBe(1);

    // A condição do §28: nenhum JS de aplicação. O único <script> é o JSON-LD.
    expect(contar(html, 'type="module"')).toBe(0);
    expect(contar(html, '<script type="application/ld+json">')).toBe(
      contar(html, '<script'),
    );

    expect(contar(html, 'name="description"')).toBe(1);
    expect(contar(html, 'rel="canonical"')).toBe(1);
    expect(html).toContain(`rel="canonical" href="${urlAbsoluta(rota)}"`);
    expect(html).toContain(`href="${CSS}"`);
    expect(contar(html, '<title>')).toBe(1);
  });

  it('o title de cada rota é o dela, não o da landing', () => {
    for (const pagina of TODAS) {
      const html = HTML.get(urlDe(pagina));
      expect(html).toContain(`<title>${pagina.titulo}</title>`);
    }
    for (const secao of secoes()) {
      const html = HTML.get(secao.url);
      expect(html).toContain(`<title>${secao.titulo}</title>`);
    }
  });

  it('o corpo da página aparece no HTML sem executar nada', () => {
    for (const pagina of TODAS) {
      const html = HTML.get(urlDe(pagina));
      expect(html).toContain(pagina.h1);
      const primeiroParagrafo = pagina.corpo.find((bloco) => bloco.tipo === 'paragrafo');
      if (primeiroParagrafo != null && primeiroParagrafo.tipo === 'paragrafo') {
        const trecho = primeiroParagrafo.texto.slice(0, 40).replace(/\*\*/g, '');
        expect(html).toContain(trecho.split('[')[0]);
      }
    }
  });

  it('marca FAQPage só onde as perguntas estão visíveis', () => {
    for (const pagina of TODAS) {
      const html = HTML.get(urlDe(pagina));
      if (html == null) throw new Error(`Sem HTML para ${urlDe(pagina)}`);
      const temBlocoFaq = pagina.corpo.some((bloco) => bloco.tipo === 'faq');
      expect(html.includes('<details')).toBe(temBlocoFaq);
    }
  });
});
