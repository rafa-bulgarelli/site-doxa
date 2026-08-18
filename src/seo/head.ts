import { DOMINIO, LOCALE_OG, NOME, OG_IMAGEM } from './site';
import type { Tipo } from './tipos';

/**
 * As tags de `<head>` de uma página SEO, como DADO.
 *
 * Elas saem daqui como uma lista de metas em vez de JSX porque é isso que
 * torna a regra testável: o teste pergunta "existe exatamente um canonical e
 * ele é absoluto sem barra final?" a esta função, e não a uma string de HTML
 * renderizado, onde a mesma pergunta vira uma regex frágil.
 */

/** `og:*` exige `property`; o resto do mundo usa `name`. */
export interface Meta {
  atributo: 'name' | 'property';
  chave: string;
  conteudo: string;
}

export interface Cabeca {
  titulo: string;
  canonical: string;
  metas: readonly Meta[];
}

/** Índices de seção não são `Tipo`; entram aqui como `'indice'`. */
export type TipoDeCabeca = Tipo | 'indice';

export interface EntradaCabeca {
  /** Caminho interno começando com `/`, sem domínio e sem barra final. */
  url: string;
  titulo: string;
  descricao: string;
  tipo: TipoDeCabeca;
}

/**
 * `website` para o que é uma prateleira, `article` para o que é um texto
 * assinado no tempo. O Google não ranqueia por causa disso — quem lê é o
 * compartilhamento em rede social, e um guia anunciado como "website" perde a
 * data no cartão.
 */
export function tipoOg(tipo: TipoDeCabeca): 'website' | 'article' {
  switch (tipo) {
    case 'solucao':
    case 'plataforma':
    case 'hub':
    case 'indice':
      return 'website';
    case 'guia':
    case 'comparativo':
    case 'dor':
    case 'glossario':
      return 'article';
    default:
      throw new Error(`Tipo desconhecido para og:type: ${String(tipo)}`);
  }
}

/** A URL absoluta canônica. Sem barra final, sempre — ver `vercel.README.md`. */
export function urlAbsoluta(url: string): string {
  if (!url.startsWith('/')) throw new Error(`URL interna precisa começar com "/": ${url}`);
  const semBarra = url.length > 1 ? url.replace(/\/+$/, '') : url;
  return `${DOMINIO}${semBarra === '/' ? '/' : semBarra}`;
}

export function cabeca(entrada: EntradaCabeca): Cabeca {
  const canonical = urlAbsoluta(entrada.url);
  const metas: Meta[] = [
    { atributo: 'name', chave: 'description', conteudo: entrada.descricao },
    { atributo: 'property', chave: 'og:type', conteudo: tipoOg(entrada.tipo) },
    { atributo: 'property', chave: 'og:title', conteudo: entrada.titulo },
    { atributo: 'property', chave: 'og:description', conteudo: entrada.descricao },
    { atributo: 'property', chave: 'og:url', conteudo: canonical },
    { atributo: 'property', chave: 'og:site_name', conteudo: NOME },
    { atributo: 'property', chave: 'og:locale', conteudo: LOCALE_OG },
    { atributo: 'name', chave: 'twitter:card', conteudo: 'summary_large_image' },
    { atributo: 'name', chave: 'twitter:title', conteudo: entrada.titulo },
    { atributo: 'name', chave: 'twitter:description', conteudo: entrada.descricao },
  ];
  // `og:image` só quando o arquivo existe. Uma tag apontando para o vazio faz o
  // WhatsApp mostrar um cartão com moldura quebrada — pior do que sem imagem.
  if (OG_IMAGEM != null) {
    metas.push({ atributo: 'property', chave: 'og:image', conteudo: urlAbsoluta(OG_IMAGEM) });
  }
  return { titulo: entrada.titulo, canonical, metas };
}
