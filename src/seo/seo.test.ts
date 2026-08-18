import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { normalizarPergunta, palavrasDe } from './auditoria';
import { urlAbsoluta } from './head';
import { linksInternosDe, paginas, resolverLink, secoes, urlDe, urlsPublicadas } from './indice';
import { tokens } from './inline';
import { BlocoDoCorpo } from './layout/Blocos';
import { renderizar, rotas } from './prerender/entrada';
import { ROTAS_PLANEJADAS } from './rotas-planejadas';
import { entradas } from './sitemap';
import { HUBS, OG_IMAGEM, SECOES } from './site';
import type { Bloco } from './tipos';

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

/**
 * O texto como o React o escreve no HTML.
 *
 * Sem isto, um title com `&`, aspas ou apóstrofo — "Orgânico & pago", "o que é
 * 'hook'" — nunca é encontrado no HTML renderizado, e o teste que deveria
 * cobrar o title certo passa a cobrar um title que não existe. É a mesma lista
 * de cinco caracteres que o `react-dom/server` escapa.
 */
function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** O inverso de `escaparHtml` — para ler o HTML como TEXTO de novo. */
function desescaparHtml(texto: string): string {
  return texto
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * O que a pessoa LÊ num pedaço de HTML: sem tag, sem entidade, sem sobra de
 * espaço.
 *
 * Existe porque o layout quebra uma frase em vários elementos — `**escala**`
 * vira `<strong>`, `[guia](/guias)` vira `<a>` —, então a frase do arquivo de
 * conteúdo nunca aparece contígua no markup. Comparar texto com texto é o
 * único jeito de o teste cobrar "o parágrafo está na página" sem cobrar junto
 * "o parágrafo não usa negrito", que não é regra nenhuma.
 */
function textoVisivel(html: string): string {
  return desescaparHtml(html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Só o `<main>`: o cabeçalho e o rodapé repetem texto em toda página. */
function main(html: string): string {
  const inicio = html.indexOf('<main');
  const fim = html.indexOf('</main>');
  if (inicio < 0 || fim < 0) throw new Error('HTML sem <main>.');
  return html.slice(inicio, fim);
}

/** O texto de conteúdo achatado pelo MESMO parser que o layout usa. */
function achatar(texto: string): string {
  return tokens(texto)
    .map((token) => token.texto)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Os nós de JSON-LD de um documento, já parseados. */
function jsonLdDe(html: string): ReadonlyArray<Record<string, unknown>> {
  const blocos = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
  return blocos.map((bloco) => {
    const cru = bloco.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
    const no: unknown = JSON.parse(cru);
    if (typeof no !== 'object' || no === null) throw new Error('JSON-LD que não é objeto.');
    return { ...no };
  });
}

/**
 * A description reduzida ao que ela DIZ: sem acento, sem pontuação, sem caixa.
 *
 * Duas descriptions que só diferem por vírgula são a mesma na SERP, e o Google
 * escolhe uma das duas páginas. O teste tem de enxergar a duplicata como o
 * leitor a enxerga, e não como o `===` a enxerga.
 */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Quanto duas frases se sobrepõem, de 0 a 1 (interseção sobre união). */
function semelhanca(a: string, b: string): number {
  const palavrasA = new Set(normalizar(a).split(' '));
  const palavrasB = new Set(normalizar(b).split(' '));
  const comuns = [...palavrasA].filter((palavra) => palavrasB.has(palavra)).length;
  const uniao = new Set([...palavrasA, ...palavrasB]).size;
  return uniao === 0 ? 0 : comuns / uniao;
}

/**
 * As aberturas proibidas do §19: a página tem de RESPONDER a busca na primeira
 * frase. Quem abre com "no mundo digital" está aquecendo, e quem buscou já sabe
 * em que mundo vive.
 */
const ABERTURAS_PROIBIDAS: readonly string[] = [
  'no mundo digital',
  'em um mundo',
  'num mundo',
  'atualmente',
  'nos dias de hoje',
  'cada vez mais',
];

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
      expect(html).toContain(`<title>${escaparHtml(pagina.titulo)}</title>`);
    }
    for (const secao of secoes()) {
      const html = HTML.get(secao.url);
      expect(html).toContain(`<title>${escaparHtml(secao.titulo)}</title>`);
    }
  });

  it('o corpo da página aparece no HTML sem executar nada', () => {
    for (const pagina of TODAS) {
      const html = HTML.get(urlDe(pagina));
      if (html == null) throw new Error(`Sem HTML para ${urlDe(pagina)}`);
      expect(html).toContain(pagina.h1);
      const primeiroParagrafo = pagina.corpo.find((bloco) => bloco.tipo === 'paragrafo');
      if (primeiroParagrafo == null || primeiroParagrafo.tipo !== 'paragrafo') continue;
      const trecho = achatar(primeiroParagrafo.texto).slice(0, 40);
      expect(
        textoVisivel(main(html)),
        `${urlDe(pagina)}: o primeiro parágrafo não aparece no <main>`,
      ).toContain(trecho);
    }
  });

  /**
   * O caso que derrubava o teste acima antes de ele comparar texto achatado:
   * um parágrafo que ABRE em negrito. No HTML ele sai partido em
   * `<strong>…</strong><span>…</span>`, então a fatia crua do arquivo de
   * conteúdo — mesmo sem os `**` — não existe contígua em lugar nenhum, e a
   * página era reprovada por uma ênfase legítima.
   */
  it('acha o primeiro parágrafo mesmo quando ele abre em negrito', () => {
    const bloco: Bloco = {
      tipo: 'paragrafo',
      texto: '**Vídeo curto** é o formato que a plataforma distribui sem mídia paga.',
    };
    const html = renderToStaticMarkup(createElement(BlocoDoCorpo, { bloco }));

    expect(textoVisivel(html)).toContain(achatar(bloco.texto).slice(0, 40));
    // A comparação ANTIGA (fatia crua, só sem os `**`) não achava — é isto que
    // fazia o gate reprovar conteúdo correto.
    expect(html).not.toContain(bloco.texto.slice(0, 40).replace(/\*\*/g, ''));
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

describe('o FAQ do corpus', () => {
  /**
   * A MESMA pergunta em duas páginas é `FAQPage` duplicado.
   *
   * Cada bloco `faq` vira um nó `FAQPage` no JSON-LD daquela URL. Quando duas
   * URLs marcam a mesma pergunta, o Google tem dois candidatos para o mesmo
   * rich result e a saída dele é escolher um e rebaixar o outro — ou nenhum. É
   * o item 39 do brief (conteúdo duplicado) na camada de schema, e não dá para
   * ver lendo uma página só: só aparece varrendo o corpus inteiro, que é o que
   * este teste faz.
   *
   * A mesma pergunta REPETIDA dentro de uma página também cai aqui: a URL
   * aparece duas vezes na lista. Um `FAQPage` com a pergunta em dobro é o mesmo
   * defeito, com o mesmo diagnóstico.
   */
  it('não repete a mesma pergunta em duas páginas', () => {
    const onde = new Map<string, { pergunta: string; urls: string[] }>();
    for (const pagina of TODAS) {
      for (const bloco of pagina.corpo) {
        if (bloco.tipo !== 'faq') continue;
        for (const item of bloco.itens) {
          const chave = normalizarPergunta(item.pergunta);
          const registro = onde.get(chave) ?? { pergunta: item.pergunta, urls: [] };
          registro.urls.push(urlDe(pagina));
          onde.set(chave, registro);
        }
      }
    }

    const repetidas = [...onde.values()]
      .filter((registro) => registro.urls.length > 1)
      .map((registro) => `"${registro.pergunta}" → ${registro.urls.join(', ')}`)
      .sort();

    expect(repetidas, 'a mesma pergunta marcada como FAQPage em mais de uma página').toEqual([]);
  });
});

describe('a description de cada página', () => {
  // Não basta serem diferentes: duas descriptions que só divergem por vírgula
  // e caixa são a MESMA na SERP, e aí o Google escolhe sozinho qual das duas
  // páginas mostrar — que é o item 39 do brief (conteúdo duplicado).
  it('não repete outra nem quase', () => {
    const todas = [
      ...TODAS.map((pagina) => [urlDe(pagina), pagina.descricao] as const),
      ...Object.entries(SECOES).map(([url, secao]) => [url, secao.descricao] as const),
    ];
    for (let i = 0; i < todas.length; i += 1) {
      for (let j = i + 1; j < todas.length; j += 1) {
        const [urlA, descricaoA] = todas[i];
        const [urlB, descricaoB] = todas[j];
        expect(normalizar(descricaoA), `${urlA} e ${urlB} têm a mesma description`).not.toBe(
          normalizar(descricaoB),
        );
        expect(
          semelhanca(descricaoA, descricaoB),
          `${urlA} e ${urlB} têm descriptions quase iguais`,
        ).toBeLessThan(0.9);
      }
    }
  });
});

describe('a abertura de cada página', () => {
  // §19: a primeira frase responde à busca. Aquecimento genérico é o sinal mais
  // barato de texto escrito para preencher espaço.
  it.each(TODAS.map((pagina) => [urlDe(pagina), pagina] as const))('%s', (_url, pagina) => {
    const primeiroParagrafo = pagina.corpo.find((bloco) => bloco.tipo === 'paragrafo');
    const aberturas = [pagina.resumo];
    if (primeiroParagrafo != null && primeiroParagrafo.tipo === 'paragrafo') {
      aberturas.push(primeiroParagrafo.texto);
    }
    for (const abertura of aberturas) {
      const inicio = normalizar(abertura);
      for (const proibida of ABERTURAS_PROIBIDAS) {
        expect(inicio.startsWith(proibida), `abre com "${proibida}"`).toBe(false);
      }
    }
  });
});

describe('o tamanho do corpo', () => {
  /**
   * Trezentas palavras é o piso do que responde uma busca com alguma
   * profundidade; abaixo disso a página é um resumo do título. O verbete de
   * glossário tem piso menor (120) e por definição: ele existe para responder
   * "o que é X" em poucas linhas, e esticá-lo até 300 palavras seria encher
   * linguiça — exatamente o que o §46 chama de conteúdo raso.
   */
  it.each(TODAS.map((pagina) => [urlDe(pagina), pagina] as const))('%s', (_url, pagina) => {
    const piso = pagina.tipo === 'glossario' ? 120 : 300;
    expect(palavrasDe(pagina)).toBeGreaterThanOrEqual(piso);
  });
});

describe('os hubs do union', () => {
  /**
   * `Hub` é fechado em `tipos.ts`. Um hub sem página e sem rota planejada é uma
   * URL que o motor promete e ninguém vai escrever — e toda página do cluster
   * apontaria para 404 pelo breadcrumb.
   *
   * O hub que AINDA não tem página só avisa: as páginas de hub são de outra
   * track e mergeiam depois desta. A reprovação é para o hub que nem planejado
   * está.
   */
  it('todo hub tem página publicada ou rota planejada', () => {
    const publicadas = new Set(urlsPublicadas());
    const pendentes: string[] = [];
    for (const hub of Object.keys(HUBS)) {
      if (publicadas.has(hub)) continue;
      expect(ROTAS_PLANEJADAS, `hub ${hub} sem página e fora de rotas-planejadas.ts`).toContain(hub);
      pendentes.push(hub);
    }
    if (pendentes.length > 0) {
      console.warn(`[seo] hubs planejados e ainda sem página: ${pendentes.join(', ')}`);
    }
  });
});

describe('o JSON-LD de cada rota', () => {
  it.each([...HTML.keys()])('%s', (rota) => {
    const html = HTML.get(rota);
    if (html == null) throw new Error(`Sem HTML para ${rota}`);
    const nos = jsonLdDe(html);

    expect(nos.length).toBeGreaterThan(0);
    for (const no of nos) {
      expect(no['@context']).toBe('https://schema.org');
      expect(typeof no['@type']).toBe('string');
      // `undefined` serializado vira a string "undefined" no HTML, e o Google
      // lê isso como se fosse o valor do campo.
      expect(JSON.stringify(no)).not.toContain('"undefined"');
    }

    // Um `@type` por página: dois nós do mesmo tipo é duplicata de grafo, e o
    // Rich Results Test reclama dela.
    const tipos = nos.map((no) => no['@type']);
    expect(new Set(tipos).size).toBe(tipos.length);

    const principal = tipos.filter((tipo) => tipo === 'Article' || tipo === 'WebPage');
    expect(principal.length).toBe(1);
    expect(tipos).toContain('BreadcrumbList');
  });

  it('o BreadcrumbList repete o breadcrumb que está na tela', () => {
    for (const rota of HTML.keys()) {
      const html = HTML.get(rota);
      if (html == null) throw new Error(`Sem HTML para ${rota}`);
      const trilha = jsonLdDe(html).find((no) => no['@type'] === 'BreadcrumbList');
      if (trilha == null) throw new Error(`${rota} sem BreadcrumbList`);
      const itens = trilha.itemListElement;
      if (!Array.isArray(itens)) throw new Error(`${rota}: itemListElement não é lista`);

      itens.forEach((item: unknown, indice) => {
        if (typeof item !== 'object' || item === null) throw new Error('ListItem inválido');
        const nome = 'name' in item ? item.name : undefined;
        const posicao = 'position' in item ? item.position : undefined;
        const destino = 'item' in item ? item.item : undefined;
        expect(posicao).toBe(indice + 1);
        expect(typeof nome).toBe('string');
        if (typeof nome !== 'string') throw new Error('nome do ListItem não é string');
        // O nome da migalha está VISÍVEL no `<nav aria-label="Você está aqui">`.
        expect(html, `${rota}: migalha "${nome}" marcada e invisível`).toContain(
          escaparHtml(nome),
        );
        expect(typeof destino).toBe('string');
      });

      // A última migalha é a página atual, e a URL dela é o canonical.
      const ultima = itens[itens.length - 1];
      if (typeof ultima !== 'object' || ultima === null || !('item' in ultima)) {
        throw new Error(`${rota}: última migalha sem item`);
      }
      expect(ultima.item).toBe(urlAbsoluta(rota));
    }
  });

  it('marca FAQPage só onde há bloco faq', () => {
    for (const pagina of TODAS) {
      const html = HTML.get(urlDe(pagina));
      if (html == null) throw new Error(`Sem HTML para ${urlDe(pagina)}`);
      const temBlocoFaq = pagina.corpo.some((bloco) => bloco.tipo === 'faq');
      const temSchemaFaq = jsonLdDe(html).some((no) => no['@type'] === 'FAQPage');
      expect(temSchemaFaq).toBe(temBlocoFaq);
    }
  });
});

describe('o cartão social de cada rota', () => {
  it.each([...HTML.keys()])('%s', (rota) => {
    const html = HTML.get(rota);
    if (html == null) throw new Error(`Sem HTML para ${rota}`);

    // `og:url` e canonical têm de ser o MESMO endereço: divergentes, o cartão
    // compartilhado aponta para uma URL e o índice para outra.
    expect(html).toContain(`property="og:url" content="${urlAbsoluta(rota)}"`);
    expect(contar(html, 'property="og:url"')).toBe(1);

    if (OG_IMAGEM != null) {
      // Absoluta: `og:image` relativa não é resolvida por leitor de link nenhum.
      expect(html).toContain(`property="og:image" content="${urlAbsoluta(OG_IMAGEM)}"`);
      expect(html).toContain('property="og:image:width" content="1200"');
      expect(html).toContain('property="og:image:height" content="630"');
      expect(html).toContain('name="twitter:card" content="summary_large_image"');
    }
  });
});
