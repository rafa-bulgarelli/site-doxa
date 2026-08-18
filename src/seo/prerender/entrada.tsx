import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { cabeca, tipoOg } from '../head';
import { porUrl, resolverLink, secoes, urlDe, urlsPublicadas } from '../indice';
import { Casca } from '../layout/Casca';
import { PaginaArtigo } from '../layout/PaginaArtigo';
import { PaginaHub } from '../layout/PaginaHub';
import { PaginaSecao } from '../layout/PaginaSecao';
import { PaginaSolucao } from '../layout/PaginaSolucao';
import { article, breadcrumbList, faqPage, webPage } from '../schema';
import type { Migalha, NoJsonLd } from '../schema';
import { sitemapXml } from '../sitemap';
import { HUBS, PREFIXO, SECOES } from '../site';
import type { Faq, Pagina, Secao } from '../tipos';

/**
 * A ENTRADA do prerender: tudo que `scripts/prerender.mjs` importa.
 *
 * Este arquivo é PURO — nenhum `fs`, nenhum `process`, nenhuma leitura de
 * ambiente. O script de fora conhece o disco; este aqui conhece o site. A
 * fronteira é o que permite ao `seo.test.ts` renderizar todas as rotas dentro
 * do vitest, sem escrever um byte em lugar nenhum.
 */

/** Toda rota que este build publica, na ordem em que o script vai escrevê-las. */
export function rotas(): readonly string[] {
  return urlsPublicadas();
}

export function sitemap(): string {
  return sitemapXml();
}

function secaoDe(url: string): Secao | undefined {
  return secoes().find((secao) => secao.url === url);
}

/** `Início › Seção › [Hub ›] Página`. Hub inexistente não vira migalha. */
function migalhasDe(pagina: Pagina): readonly Migalha[] {
  const urlSecao = PREFIXO[pagina.tipo];
  const dadosSecao = SECOES[urlSecao];
  if (dadosSecao == null) throw new Error(`Sem dados de seção para ${urlSecao}`);
  const trilha: Migalha[] = [
    { nome: 'Início', url: '/' },
    { nome: dadosSecao.h1, url: urlSecao },
  ];
  const hub = pagina.hubs[0];
  // O hub entra só se a página dele já existir: uma migalha apontando para 404
  // é um link quebrado no topo de toda página do cluster, e o BreadcrumbList
  // repetiria a URL morta para o Google.
  if (hub != null && resolverLink(hub) === 'existe' && hub !== urlDe(pagina)) {
    trilha.push({ nome: HUBS[hub].titulo, url: hub });
  }
  trilha.push({ nome: pagina.h1, url: urlDe(pagina) });
  return trilha;
}

function corpoDe(pagina: Pagina): ReactElement {
  switch (pagina.tipo) {
    case 'solucao':
    case 'plataforma':
      return <PaginaSolucao pagina={pagina} />;
    case 'hub':
      return <PaginaHub pagina={pagina} />;
    case 'guia':
    case 'dor':
    case 'comparativo':
    case 'glossario':
      return <PaginaArtigo pagina={pagina} />;
    default:
      throw new Error(`Sem layout para o tipo "${String(pagina.tipo)}".`);
  }
}

/** Todas as perguntas VISÍVEIS da página — as dos blocos `faq`, e só elas. */
function perguntasDe(pagina: Pagina): readonly Faq[] {
  return pagina.corpo.flatMap((bloco) => (bloco.tipo === 'faq' ? [...bloco.itens] : []));
}

/**
 * O grafo de JSON-LD de uma página de conteúdo.
 *
 * TRÊS nós no máximo, e cada um responde a uma coisa que está na tela:
 *
 *  - `Article` ou `WebPage`, pelo MESMO critério do `og:type` (`tipoOg`): o que
 *    é texto assinado no tempo é `Article`, o que é prateleira comercial é
 *    `WebPage`. Dois critérios separados divergiriam na primeira página nova, e
 *    a página anunciaria uma coisa no cartão social e outra no schema.
 *  - `BreadcrumbList` com as MESMAS migalhas que o `<nav>` desenha — o mesmo
 *    array, não uma segunda lista montada aqui.
 *  - `FAQPage` só quando existe bloco `faq`, com as mesmas perguntas que o
 *    `<details>` mostra. Sem bloco, o nó não existe: FAQ marcado sem FAQ na
 *    página é a marcação enganosa do §46, e ela custa manual action.
 *
 * `Organization` e `WebSite` NÃO entram aqui. Eles descrevem o site inteiro e
 * são declarados uma vez, no `index.html` da landing; repetidos em cada página
 * seriam a mesma entidade afirmada trinta vezes. O vínculo vem por dentro —
 * `WebPage.isPartOf` e `Article.publisher` apontam para ela.
 */
function jsonLdDePagina(pagina: Pagina, migalhas: readonly Migalha[]): readonly NoJsonLd[] {
  const url = urlDe(pagina);
  const principal =
    tipoOg(pagina.tipo) === 'article'
      ? article({
          url,
          titulo: pagina.titulo,
          descricao: pagina.descricao,
          atualizadoEm: pagina.atualizadoEm,
        })
      : webPage({
          url,
          titulo: pagina.titulo,
          descricao: pagina.descricao,
          atualizadoEm: pagina.atualizadoEm,
        });
  const grafo: NoJsonLd[] = [principal, breadcrumbList(migalhas)];
  const perguntas = perguntasDe(pagina);
  if (perguntas.length > 0) grafo.push(faqPage(perguntas));
  return grafo;
}

function documentoDePagina(pagina: Pagina, cssHref: string): ReactElement {
  const url = urlDe(pagina);
  const migalhas = migalhasDe(pagina);
  const jsonLd = jsonLdDePagina(pagina, migalhas);
  return (
    <Casca
      cabeca={cabeca({ url, titulo: pagina.titulo, descricao: pagina.descricao, tipo: pagina.tipo })}
      cssHref={cssHref}
      jsonLd={jsonLd}
      migalhas={migalhas}
      relacionadas={pagina.relacionadas}
      cta={pagina.cta}
    >
      {corpoDe(pagina)}
    </Casca>
  );
}

function documentoDeSecao(secao: Secao, cssHref: string): ReactElement {
  const migalhas: readonly Migalha[] = [
    { nome: 'Início', url: '/' },
    { nome: secao.h1, url: secao.url },
  ];
  const jsonLd: readonly NoJsonLd[] = [
    webPage({ url: secao.url, titulo: secao.titulo, descricao: secao.descricao }),
    breadcrumbList(migalhas),
  ];
  return (
    <Casca
      cabeca={cabeca({
        url: secao.url,
        titulo: secao.titulo,
        descricao: secao.descricao,
        tipo: 'indice',
      })}
      cssHref={cssHref}
      jsonLd={jsonLd}
      migalhas={migalhas}
      relacionadas={[]}
    >
      <PaginaSecao secao={secao} />
    </Casca>
  );
}

export interface OpcoesDeRender {
  /** O `href` do CSS do build cliente, lido de `dist/index.html`. */
  cssHref: string;
}

/** O HTML completo de uma rota, pronto para virar `dist<rota>/index.html`. */
export function renderizar(url: string, opcoes: OpcoesDeRender): string {
  const pagina = porUrl(url);
  const secao = secaoDe(url);
  const documento =
    pagina != null
      ? documentoDePagina(pagina, opcoes.cssHref)
      : secao != null
        ? documentoDeSecao(secao, opcoes.cssHref)
        : null;
  if (documento == null) throw new Error(`Rota sem conteúdo: ${url}`);
  return `<!doctype html>\n${renderToStaticMarkup(documento)}\n`;
}
