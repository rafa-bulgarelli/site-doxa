import { describe, expect, it } from 'vitest';
import { urlAbsoluta } from './head';
import { paginas, secoes, urlDe } from './indice';
import { DOMINIO } from './site';
import { HOME, entradas, sitemapXml } from './sitemap';

describe('entradas', () => {
  it('começa pela home, com o lastmod de conteúdo dela', () => {
    const lista = entradas();
    expect(lista[0]).toEqual(HOME);
    expect(HOME.loc).toBe(`${DOMINIO}/`);
    // A regra herdada do `public/sitemap.xml` que este módulo substituiu:
    // `lastmod` é data de mudança de CONTEÚDO, não de deploy. Se esta constante
    // começar a se mexer a cada build, o buscador aprende a ignorar o arquivo.
    expect(HOME.lastmod).toBe('2026-08-10');
  });

  it('lista todas as páginas e todos os índices publicados, e só eles', () => {
    const esperadas = [
      `${DOMINIO}/`,
      ...secoes().map((secao) => urlAbsoluta(secao.url)),
      ...paginas().map((pagina) => urlAbsoluta(urlDe(pagina))),
    ].sort();
    expect(entradas().map((entrada) => entrada.loc).sort()).toEqual(esperadas);
  });

  it('usa o atualizadoEm de cada página como lastmod', () => {
    for (const pagina of paginas()) {
      const entrada = entradas().find((item) => item.loc === urlAbsoluta(urlDe(pagina)));
      expect(entrada?.lastmod).toBe(pagina.atualizadoEm);
    }
  });

  it('dá ao índice de seção a maior data das páginas que ele lista', () => {
    for (const secao of secoes()) {
      const maior = [...secao.paginas.map((pagina) => pagina.atualizadoEm)].sort().pop();
      const entrada = entradas().find((item) => item.loc === urlAbsoluta(secao.url));
      expect(entrada?.lastmod).toBe(maior);
    }
  });
});

describe('sitemapXml', () => {
  const xml = sitemapXml();

  it('é um urlset bem formado', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('tem um <loc> por entrada', () => {
    const locs = xml.match(/<loc>/g) ?? [];
    expect(locs.length).toBe(entradas().length);
  });

  // Um comentário XML com `--` no meio é XML inválido, e o arquivo inteiro
  // deixa de ser lido pelo buscador.
  it('não tem hífen duplo dentro do comentário', () => {
    const comentario = /<!--([\s\S]*?)-->/.exec(xml);
    expect(comentario).not.toBeNull();
    expect(comentario?.[1].includes('--')).toBe(false);
  });
});
