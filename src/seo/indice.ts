import { linksDe } from './inline';
import { ROTAS_PLANEJADAS } from './rotas-planejadas';
import { DIRETORIO, HUBS, PREFIXO, ROTAS_DA_LANDING, SECOES } from './site';
import type { Bloco, Pagina, Secao } from './tipos';

/**
 * O índice de todas as páginas SEO, montado do sistema de arquivos.
 *
 * `import.meta.glob` com `eager` porque o motor precisa da lista INTEIRA em
 * três momentos que não podem esperar por promise: o prerender (que escreve um
 * arquivo por rota), o sitemap e o teste de invariantes. Um registro escrito à
 * mão faria a mesma coisa e teria o defeito de sempre — a página nova que
 * alguém esquece de registrar existe no disco e não existe no sitemap.
 */
const MODULOS = import.meta.glob<{ pagina: Pagina }>('./conteudo/*/*.ts', { eager: true });

const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

/** A URL final de uma página. Sem barra no fim — é a forma canônica. */
export function urlDe(pagina: Pagina): string {
  return `${PREFIXO[pagina.tipo]}/${pagina.slug}`;
}

/** Todo texto de um bloco que pode carregar marcação inline. */
function textosDe(bloco: Bloco): readonly string[] {
  switch (bloco.tipo) {
    case 'paragrafo':
    case 'titulo':
      return [bloco.texto];
    case 'destaque':
      return [bloco.texto];
    case 'cta':
      return [bloco.texto];
    case 'lista':
      return bloco.itens;
    case 'tabela':
      return bloco.linhas.flat();
    case 'passos':
      return bloco.itens.flatMap((item) => [item.titulo, item.texto]);
    case 'faq':
      return bloco.itens.flatMap((item) => [item.pergunta, item.resposta]);
    default:
      throw new Error('Bloco de tipo desconhecido no corpo da página.');
  }
}

/** Todos os links internos citados no corpo de uma página. */
export function linksInternosDe(pagina: Pagina): readonly string[] {
  const doCorpo = pagina.corpo.flatMap((bloco) => textosDe(bloco).flatMap(linksDe));
  return [...doCorpo, ...pagina.relacionadas].filter((href) => href.startsWith('/'));
}

/**
 * Valida uma página e explode com o caminho do arquivo no erro.
 *
 * Roda na CARGA do módulo, não no teste: o prerender importa este arquivo, e
 * uma página inválida tem de derrubar o build antes de virar HTML publicado.
 */
export function validarPagina(pagina: Pagina, caminho: string): void {
  const erro = (motivo: string): never => {
    throw new Error(`Página SEO inválida em ${caminho}: ${motivo}`);
  };
  const partes = caminho.split('/');
  const pasta = partes[partes.length - 2];
  const arquivo = partes[partes.length - 1].replace(/\.ts$/, '');
  if (pasta !== DIRETORIO[pagina.tipo]) {
    erro(`tipo "${pagina.tipo}" pertence a conteudo/${DIRETORIO[pagina.tipo]}/, não a ${pasta}/`);
  }
  if (!SLUG_VALIDO.test(pagina.slug)) erro(`slug "${pagina.slug}" fora de ^[a-z0-9]+(-[a-z0-9]+)*$`);
  if (pagina.slug !== arquivo) erro(`slug "${pagina.slug}" diferente do arquivo "${arquivo}.ts"`);
  if (!DATA_VALIDA.test(pagina.atualizadoEm)) {
    erro(`atualizadoEm "${pagina.atualizadoEm}" não é AAAA-MM-DD`);
  }
  if (Number.isNaN(Date.parse(pagina.atualizadoEm))) {
    erro(`atualizadoEm "${pagina.atualizadoEm}" não é data real`);
  }
  if (pagina.tipo !== 'hub' && pagina.hubs.length === 0) erro('nenhum hub — página órfã de cluster');
  if (pagina.tipo === 'hub' && !HUBS_CONHECIDOS.includes(urlDe(pagina))) {
    erro(`hub "${urlDe(pagina)}" não está no union Hub de tipos.ts`);
  }
  if (pagina.corpo.length === 0) erro('corpo vazio — placeholder é proibido (§46)');
}

/**
 * As URLs dos hubs, derivadas de `HUBS` e não reescritas: o union `Hub` é o
 * dono da lista, e uma segunda cópia aqui divergiria no primeiro hub novo.
 */
const HUBS_CONHECIDOS: readonly string[] = Object.keys(HUBS);

function carregar(): readonly Pagina[] {
  const lista: Pagina[] = [];
  for (const caminho of Object.keys(MODULOS).sort()) {
    const modulo = MODULOS[caminho];
    if (modulo == null || typeof modulo.pagina !== 'object' || modulo.pagina == null) {
      throw new Error(`${caminho} não exporta \`pagina\`.`);
    }
    validarPagina(modulo.pagina, caminho);
    lista.push(modulo.pagina);
  }
  return lista;
}

const PAGINAS = carregar();

export function paginas(): readonly Pagina[] {
  return PAGINAS;
}

export function porUrl(url: string): Pagina | undefined {
  return PAGINAS.find((pagina) => urlDe(pagina) === url);
}

/**
 * As seções que TÊM página. Índice vazio não é gerado — uma `/plataformas` sem
 * nada listado é a página placeholder que o brief proíbe (§46).
 */
export function secoes(): readonly Secao[] {
  // Sem `.sort()`: a ordem de inserção de `SECOES` é a ordem EDITORIAL — Soluções
  // primeiro, Glossário por último. Em ordem alfabética o cabeçalho abriria por
  // "Comparativos", que não é por onde se entra no site.
  return Object.keys(SECOES)
    .map((url) => {
      const dados = SECOES[url];
      if (dados == null) throw new Error(`Seção sem dados: ${url}`);
      const membros = PAGINAS.filter((pagina) => PREFIXO[pagina.tipo] === url);
      return { url, ...dados, paginas: membros };
    })
    .filter((secao) => secao.paginas.length > 0);
}

/** Toda URL que este build publica: páginas + índices de seção. */
export function urlsPublicadas(): readonly string[] {
  return [...PAGINAS.map(urlDe), ...secoes().map((secao) => secao.url)].sort();
}

export function existe(url: string): boolean {
  return urlsPublicadas().includes(url);
}

export type EstadoDoLink = 'existe' | 'planejada' | 'desconhecida';

/**
 * O que fazer com um link interno.
 *
 * `planejada` é o estado que faz o motor render o rótulo como texto: a URL está
 * no mapa de conteúdo mas a página ainda não nasceu. `desconhecida` é erro de
 * digitação e o teste reprova.
 */
export function resolverLink(url: string): EstadoDoLink {
  if (ehDaLanding(url)) return 'existe';
  if (existe(url)) return 'existe';
  if (ROTAS_PLANEJADAS.includes(url)) return 'planejada';
  return 'desconhecida';
}

/**
 * A URL é a landing (ou uma âncora dela)?
 *
 * Separada de `existe()` porque as duas respondem perguntas diferentes: `existe`
 * quer dizer "este build escreveu um arquivo para esta rota", e a landing não
 * passa pelo prerender — ela é a SPA do `index.html`. Quem lista cards de
 * conteúdo (`Relacionadas`) usa esta função para NÃO transformar a home num
 * card de artigo, que é o que ela não é.
 */
export function ehDaLanding(url: string): boolean {
  return ROTAS_DA_LANDING.includes(url);
}
