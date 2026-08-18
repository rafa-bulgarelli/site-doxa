/**
 * A marcação inline dos arquivos de conteúdo, e só ela: `**negrito**` e
 * `[rótulo](/rota)`.
 *
 * Por que um parser de duas regras em vez de Markdown: um `texto` de conteúdo é
 * escrito por quem escreve copy, e Markdown completo aceita HTML cru. Aceitar
 * HTML cru obriga o layout a usar `dangerouslySetInnerHTML`, e a partir daí uma
 * aspa mal fechada num arquivo de conteúdo vira markup quebrado numa página
 * indexada. Aqui o parser devolve TOKENS e quem escapa é o React, que escapa
 * tudo por padrão — não existe caminho de texto para HTML neste motor.
 */

export interface TokenTexto {
  tipo: 'texto';
  texto: string;
}

export interface TokenNegrito {
  tipo: 'negrito';
  texto: string;
}

export interface TokenLink {
  tipo: 'link';
  href: string;
  texto: string;
}

export type Token = TokenTexto | TokenNegrito | TokenLink;

/** `**negrito**` OU `[rótulo](destino)`, nesta ordem de precedência. */
const MARCACAO = /\*\*([^*]+)\*\*|\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/** Interno começa com `/`; externo tem de ser HTTPS. Não há terceira forma. */
function validarHref(href: string, origem: string): void {
  if (href.startsWith('/')) return;
  if (href.startsWith('https://')) return;
  throw new Error(
    `Link inválido em "${origem}": "${href}". Use uma rota interna (/…) ou uma URL https://.`,
  );
}

/**
 * Quebra um texto de conteúdo nos tokens que o layout desenha.
 *
 * `**` sobrando dispara erro em vez de virar asterisco na tela: negrito não
 * fechado é sempre typo, e um typo que renderiza é um typo que ninguém vê.
 */
export function tokens(texto: string): readonly Token[] {
  const saida: Token[] = [];
  let cursor = 0;
  MARCACAO.lastIndex = 0;
  let achado = MARCACAO.exec(texto);
  while (achado !== null) {
    if (achado.index > cursor) {
      saida.push({ tipo: 'texto', texto: texto.slice(cursor, achado.index) });
    }
    // `RegExpExecArray` é tipado como `string[]`, mas grupo alternativo que não
    // casou vem `undefined` em tempo de execução. As anotações abaixo contam a
    // verdade que o tipo do lib.dom esconde.
    const bruto: string = achado[0];
    const negrito: string | undefined = achado[1];
    const rotulo: string | undefined = achado[2];
    const href: string | undefined = achado[3];
    if (negrito != null) {
      saida.push({ tipo: 'negrito', texto: negrito });
    } else if (rotulo != null && href != null) {
      validarHref(href, texto);
      saida.push({ tipo: 'link', href, texto: rotulo });
    }
    cursor = achado.index + bruto.length;
    achado = MARCACAO.exec(texto);
  }
  if (cursor < texto.length) {
    saida.push({ tipo: 'texto', texto: texto.slice(cursor) });
  }
  for (const token of saida) {
    if (token.tipo === 'texto' && token.texto.includes('**')) {
      throw new Error(`Negrito não fechado em "${texto}".`);
    }
  }
  return saida;
}

/** Todos os `href` citados num texto — o que o teste de links internos varre. */
export function linksDe(texto: string): readonly string[] {
  return tokens(texto)
    .filter((token): token is TokenLink => token.tipo === 'link')
    .map((token) => token.href);
}

/**
 * O slug de um título, que vira o `id` da âncora do TOC.
 *
 * `NFD` + remoção de diacríticos porque âncora com acento é escapada na URL
 * (`#produ%C3%A7%C3%A3o`) e vira ilegível em qualquer lugar onde alguém a cole.
 */
export function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
