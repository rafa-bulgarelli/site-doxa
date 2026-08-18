import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { article, breadcrumbList, faqPage, organization, paraScript, webPage, webSite } from './schema';
import type { NoJsonLd } from './schema';
import { DOMINIO, NOME } from './site';

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

describe('organization', () => {
  const no = organization();

  it('é a Doxa, na raiz do domínio, com o logo em PNG', () => {
    expect(no['@context']).toBe('https://schema.org');
    expect(no['@type']).toBe('Organization');
    expect(no.name).toBe(NOME);
    expect(no.url).toBe(`${DOMINIO}/`);
    expect(no.logo).toEqual({
      '@type': 'ImageObject',
      url: `${DOMINIO}/og.png`,
      width: 1200,
      height: 630,
    });
  });

  // `sameAs` afirma ao buscador "esta conta é a empresa". Não há um único perfil
  // oficial no repositório, e chutar um é o schema enganoso do §46.
  it('não inventa sameAs', () => {
    expect('sameAs' in no).toBe(false);
  });
});

describe('webSite', () => {
  const no = webSite();

  it('aponta para a organização como publisher', () => {
    expect(no['@type']).toBe('WebSite');
    expect(no.url).toBe(`${DOMINIO}/`);
    expect(no.inLanguage).toBe('pt-BR');
    expect(no.publisher).toEqual({ '@type': 'Organization', name: NOME, url: `${DOMINIO}/` });
  });

  // `SearchAction` promete uma caixa de busca interna, e o Google testa a URL do
  // template antes de acreditar. Este site não tem busca.
  it('não declara SearchAction', () => {
    expect('potentialAction' in no).toBe(false);
  });
});

describe('article', () => {
  const no = article({
    url: '/guias/exemplo',
    titulo: 'Um guia',
    descricao: 'A descrição do guia.',
    atualizadoEm: '2026-08-17',
  });

  it('leva headline, url, autor e publisher', () => {
    expect(no['@type']).toBe('Article');
    expect(no.headline).toBe('Um guia');
    expect(no.url).toBe(`${DOMINIO}/guias/exemplo`);
    expect(no.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': `${DOMINIO}/guias/exemplo` });
    expect(no.author).toEqual({ '@type': 'Organization', name: NOME, url: `${DOMINIO}/` });
    expect(no.publisher).toEqual(no.author);
  });

  // O contrato tem UMA data, a da última mudança de conteúdo, e é a que a página
  // mostra por extenso. Copiá-la para `datePublished` diria que o artigo nasceu
  // no dia em que foi editado — falso no primeiro artigo revisado (§46).
  it('marca dateModified e não inventa datePublished', () => {
    expect(no.dateModified).toBe('2026-08-17');
    expect('datePublished' in no).toBe(false);
  });
});

describe('faqPage', () => {
  // Na tela a pessoa lê "escala" e "UGC"; sem achatar, o Google leria os
  // asteriscos e o caminho da rota, e o schema deixaria de dizer o que a página
  // diz.
  it('achata a marcação inline da pergunta e da resposta', () => {
    const no = faqPage([
      { pergunta: 'O que é **UGC**?', resposta: 'Veja o [verbete](/glossario/ugc).' },
    ]);
    expect(no.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'O que é UGC?',
        acceptedAnswer: { '@type': 'Answer', text: 'Veja o verbete.' },
      },
    ]);
  });
});

/**
 * O `index.html` da landing é HTML estático: ele não importa TypeScript, então o
 * bloco de JSON-LD dele é uma CÓPIA de `organization()` e `webSite()`. Cópia sem
 * teste diverge — este é o teste.
 */
describe('o JSON-LD da landing', () => {
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
  const achado = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);

  it('existe e é JSON válido', () => {
    expect(achado).not.toBeNull();
  });

  it('é exatamente o que schema.ts monta, sem uma vírgula de diferença', () => {
    if (achado === null) throw new Error('index.html sem bloco de JSON-LD.');
    const grafo: unknown = JSON.parse(achado[1]);
    if (typeof grafo !== 'object' || grafo === null || !('@graph' in grafo)) {
      throw new Error('O JSON-LD da landing não tem @graph.');
    }
    const nos: unknown = grafo['@graph'];
    if (!Array.isArray(nos)) throw new Error('O @graph da landing não é lista.');

    // `@context` mora no nó de fora do grafo, então ele sai da comparação.
    const semContexto = (no: NoJsonLd): Record<string, unknown> => {
      const copia: Record<string, unknown> = { ...no };
      delete copia['@context'];
      return copia;
    };
    expect(nos).toEqual([semContexto(organization()), semContexto(webSite())]);
  });
});
