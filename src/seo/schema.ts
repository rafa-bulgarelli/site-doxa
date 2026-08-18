import { urlAbsoluta } from './head';
import { tokens } from './inline';
import {
  IDIOMA,
  NOME,
  OG_IMAGEM,
  OG_IMAGEM_ALTURA,
  OG_IMAGEM_LARGURA,
} from './site';
import type { Faq } from './tipos';

/**
 * Os builders de JSON-LD.
 *
 * A regra que governa este arquivo inteiro, e ela vem do brief (§24, §46):
 * **nunca marcar o que não está visível na página.** Um `FAQPage` cujas
 * perguntas não aparecem no HTML é schema enganoso, e é a categoria de erro
 * que custa manual action — não posição. Por isso `faqPage` recebe os MESMOS
 * itens que o bloco `faq` desenha, vindos do mesmo objeto de conteúdo, e não
 * uma segunda lista.
 */

/**
 * Um nó JSON-LD. O valor é `unknown` porque cada `@type` tem campos próprios;
 * quem monta o nó é quem sabe o formato, e é lá que a checagem acontece.
 */
export interface NoJsonLd {
  readonly '@context'?: string;
  readonly '@type': string;
  readonly [campo: string]: unknown;
}

/**
 * A DOXA como entidade, uma vez só.
 *
 * O brief (§24) chama entidade inconsistente pelo nome: o mesmo negócio
 * descrito de três jeitos em três páginas não vira uma entidade no índice, vira
 * três candidatas fracas. Por isso `Organization` é uma FUNÇÃO e não um objeto
 * copiado — o `index.html` da landing é a única cópia que existe fora daqui, e
 * ela está marcada com o mesmo aviso.
 *
 * Sem `sameAs`: ele lista os PERFIS OFICIAIS da entidade, e não há um único
 * link de rede social no repositório inteiro (procurado em `src/`, `public/`,
 * `docs/` e `index.html`). Apontar um perfil que ninguém confirmou ser da Doxa
 * é dizer ao buscador que aquela conta é a empresa — exatamente o schema
 * enganoso do §46. Achou o perfil oficial, entra aqui; até lá, ausente.
 */
export function organization(): NoJsonLd {
  const base: NoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: NOME,
    url: urlAbsoluta('/'),
  };
  // O logo é o `og.png`: é o único arquivo de marca em formato que o Google lê
  // (a wordmark do site é AVIF, que ele não decodifica para logo). Ele mostra a
  // wordmark sobre o preto da marca, que é o que a landing mostra.
  if (OG_IMAGEM == null) return base;
  return {
    ...base,
    logo: {
      '@type': 'ImageObject',
      url: urlAbsoluta(OG_IMAGEM),
      width: OG_IMAGEM_LARGURA,
      height: OG_IMAGEM_ALTURA,
    },
  };
}

/**
 * A referência à Doxa DENTRO de outro nó (`author`, `publisher`, `isPartOf`).
 *
 * Sem `@context`: contexto se declara uma vez por grafo, no nó de fora. Repetido
 * no nó aninhado ele não quebra nada e polui o JSON — e polui em toda página.
 */
function entidadeDoxa(): NoJsonLd {
  return { '@type': 'Organization', name: NOME, url: urlAbsoluta('/') };
}

/**
 * O site como um todo. SEM `SearchAction`, e isso é decisão e não esquecimento:
 * `SearchAction` promete uma caixa de busca interna que este site não tem, e o
 * Google testa a URL do template antes de acreditar.
 */
export function webSite(): NoJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: NOME,
    url: urlAbsoluta('/'),
    inLanguage: IDIOMA,
    publisher: entidadeDoxa(),
  };
}

export interface DadosArtigo {
  url: string;
  /** O `headline`. É o `titulo` da página — nunca uma segunda manchete. */
  titulo: string;
  descricao: string;
  /** `AAAA-MM-DD`. Vira `dateModified`, que é o que a página mostra por extenso. */
  atualizadoEm: string;
  idioma?: string;
}

/**
 * O `Article` do conteúdo editorial: guia, dor, comparativo e verbete.
 *
 * ─── POR QUE NÃO HÁ `datePublished` ──────────────────────────────────────────
 *
 * Porque o contrato (`tipos.ts`) tem UMA data, `atualizadoEm`, e ela é a da
 * última mudança de conteúdo. Copiá-la para `datePublished` diria ao Google que
 * o artigo NASCEU no dia em que foi editado — falso no primeiro artigo que for
 * revisado, e é o §46 na definição: marcação que contradiz a página. O rodapé
 * do artigo diz "Conteúdo atualizado em …", e é isso, e só isso, que sai
 * marcado. No dia em que `Pagina` ganhar `publicadoEm`, esta é uma linha.
 */
export function article(dados: DadosArtigo): NoJsonLd {
  const url = urlAbsoluta(dados.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: dados.titulo,
    description: dados.descricao,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: dados.idioma ?? IDIOMA,
    dateModified: dados.atualizadoEm,
    author: entidadeDoxa(),
    publisher: entidadeDoxa(),
  };
}

export interface DadosWebPage {
  url: string;
  titulo: string;
  descricao: string;
  atualizadoEm?: string;
  idioma?: string;
}

export function webPage(dados: DadosWebPage): NoJsonLd {
  const base: NoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: dados.titulo,
    description: dados.descricao,
    url: urlAbsoluta(dados.url),
    inLanguage: dados.idioma ?? 'pt-BR',
    isPartOf: { '@type': 'WebSite', name: NOME, url: urlAbsoluta('/') },
  };
  // `dateModified` ausente em vez de `undefined`: o JSON.stringify some com a
  // chave de qualquer jeito, mas um nó sem o campo é mais fácil de comparar em
  // teste do que um nó com o campo valendo nada.
  if (dados.atualizadoEm == null) return base;
  return { ...base, dateModified: dados.atualizadoEm };
}

export interface Migalha {
  nome: string;
  /** Caminho interno. A última migalha é a página atual e também leva URL. */
  url: string;
}

export function breadcrumbList(migalhas: readonly Migalha[]): NoJsonLd {
  if (migalhas.length === 0) throw new Error('BreadcrumbList sem migalha nenhuma.');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migalhas.map((migalha, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: migalha.nome,
      item: urlAbsoluta(migalha.url),
    })),
  };
}

/**
 * O `FAQPage` de um bloco `faq`.
 *
 * Assinado e pronto, mas ainda NÃO ligado à casca: a track de fundação decide
 * onde ele entra junto com `Organization`, `WebSite` e `Article`. Emitir dois
 * grafos concorrentes na mesma página antes dessa decisão é o caminho curto
 * para o Rich Results Test reclamar de duplicata.
 */
export function faqPage(itens: readonly Faq[]): NoJsonLd {
  if (itens.length === 0) throw new Error('FAQPage sem pergunta nenhuma.');
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: itens.map((item) => ({
      '@type': 'Question',
      name: textoPlano(item.pergunta),
      acceptedAnswer: { '@type': 'Answer', text: textoPlano(item.resposta) },
    })),
  };
}

/**
 * O texto de conteúdo sem a marcação inline.
 *
 * `**escala**` e `[UGC](/glossario/ugc)` são instruções para o LAYOUT. Na tela
 * a pessoa lê "escala" e "UGC"; no JSON-LD, sem isto, o Google leria os
 * asteriscos e o caminho da rota — e a regra do arquivo é que o schema diga a
 * mesma coisa que a página (§46). O parser já existe em `inline.ts`; aqui só se
 * joga fora a formatação e se guarda o texto.
 */
function textoPlano(texto: string): string {
  return tokens(texto)
    .map((token) => token.texto)
    .join('');
}

/**
 * O JSON de um nó, seguro para ir dentro de `<script type="application/ld+json">`.
 *
 * O `<` vira a escapada unicode porque a sequência `</script` dentro de uma
 * string JSON FECHA a tag no parser do navegador — o resto do JSON vaza como texto na
 * página e o schema some. Nenhum conteúdo nosso tem `<` hoje; a escapada existe
 * para o dia em que tiver.
 */
export function paraScript(no: NoJsonLd): string {
  return JSON.stringify(no).replace(/</g, '\\u003c');
}
