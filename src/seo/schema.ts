import { urlAbsoluta } from './head';
import { NOME } from './site';
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
      name: item.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: item.resposta },
    })),
  };
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
