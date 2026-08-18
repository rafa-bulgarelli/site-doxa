import { describe, expect, it } from 'vitest';
import { breadcrumbList, faqPage, paraScript, webPage } from './schema';
import { DOMINIO } from './site';

describe('webPage', () => {
  const no = webPage({
    url: '/solucoes/exemplo',
    titulo: 'Título',
    descricao: 'Descrição.',
    atualizadoEm: '2026-08-17',
  });

  it('monta um WebPage com URL absoluta', () => {
    expect(no['@type']).toBe('WebPage');
    expect(no['@context']).toBe('https://schema.org');
    expect(no.url).toBe(`${DOMINIO}/solucoes/exemplo`);
    expect(no.dateModified).toBe('2026-08-17');
  });

  it('omite dateModified quando não há data', () => {
    const semData = webPage({ url: '/solucoes', titulo: 'T', descricao: 'D' });
    expect('dateModified' in semData).toBe(false);
  });
});

describe('breadcrumbList', () => {
  it('numera as posições a partir de 1 e absolutiza as URLs', () => {
    const no = breadcrumbList([
      { nome: 'Início', url: '/' },
      { nome: 'Soluções', url: '/solucoes' },
    ]);
    expect(no['@type']).toBe('BreadcrumbList');
    expect(no.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${DOMINIO}/` },
      { '@type': 'ListItem', position: 2, name: 'Soluções', item: `${DOMINIO}/solucoes` },
    ]);
  });

  it('recusa uma trilha vazia', () => {
    expect(() => breadcrumbList([])).toThrow(/sem migalha/);
  });
});

describe('faqPage', () => {
  it('vira Question + acceptedAnswer', () => {
    const no = faqPage([{ pergunta: 'P?', resposta: 'R.' }]);
    expect(no.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'P?',
        acceptedAnswer: { '@type': 'Answer', text: 'R.' },
      },
    ]);
  });

  it('recusa FAQ vazio', () => {
    expect(() => faqPage([])).toThrow(/sem pergunta/);
  });
});

describe('paraScript', () => {
  // `</script` dentro de uma string JSON fecha a tag no parser do navegador e o
  // resto do grafo vaza como texto na página.
  it('escapa o menor-que para não fechar a tag', () => {
    const json = paraScript({ '@type': 'WebPage', name: '</script><b>x' });
    expect(json).not.toContain('</script');
    expect(json).toContain('\\u003c/script');
  });
});
