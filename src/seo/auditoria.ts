import { existe, linksInternosDe, paginas, resolverLink, secoes, urlDe } from './indice';
import { tokens } from './inline';
import { ROTAS_PLANEJADAS } from './rotas-planejadas';
import { HUBS } from './site';
import type { Bloco, Pagina, Tipo } from './tipos';

/**
 * A AUDITORIA do grafo interno: quem linka para quem, e quem ficou de fora.
 *
 * ─── POR QUE ELA AVISA EM VEZ DE REPROVAR ────────────────────────────────────
 *
 * O que `seo.test.ts` cobra é invariante: title duplicado, canonical errado,
 * link para rota inexistente. São defeitos de uma página só, e a página que os
 * tem está errada sozinha.
 *
 * O que se mede aqui é diferente: uma página órfã depende do que as OUTRAS
 * páginas escreveram, e as tracks de conteúdo mergeiam em ordem imprevisível.
 * Uma auditoria estrita reprovaria a primeira página de um cluster por ser a
 * única dele — e reprovaria de novo a segunda, e a terceira, até o cluster
 * fechar. Reprovação que aparece por motivo alheio é reprovação que se aprende
 * a ignorar, e daí ela deixa de valer para o caso real.
 *
 * Então: aqui saem AVISOS, e o gate estrito é da fase seguinte, quando a rede
 * de conteúdo estiver de pé. Este arquivo não decide se o build passa; ele
 * imprime o mapa (`pnpm seo:audit`) e diz onde o mapa tem buraco.
 */

/** O que um aviso é. `codigo` é estável — dá para filtrar por ele num script. */
export type CodigoDeAviso =
  | 'orfa'
  | 'sem-saida'
  | 'hub-sem-pagina'
  | 'hub-sem-membro'
  | 'rota-planejada-sem-pagina';

export interface Aviso {
  codigo: CodigoDeAviso;
  /** A URL de que o aviso fala. */
  alvo: string;
  mensagem: string;
}

export interface NoDoGrafo {
  url: string;
  tipo: Tipo;
  titulo: string;
  /** Páginas publicadas para as quais esta aponta. */
  saida: readonly string[];
  /** Páginas publicadas que apontam para esta — o índice de seção NÃO conta. */
  entrada: readonly string[];
  /** Links que esta página escreveu para rotas ainda não publicadas. */
  planejados: readonly string[];
  /** Quantas palavras o corpo tem. */
  palavras: number;
}

export interface Auditoria {
  grafo: readonly NoDoGrafo[];
  avisos: readonly Aviso[];
}

/** Todo texto de um bloco, incluindo o que só o layout desenha. */
function textosDe(bloco: Bloco): readonly string[] {
  switch (bloco.tipo) {
    case 'paragrafo':
    case 'titulo':
    case 'destaque':
    case 'cta':
      return [bloco.texto];
    case 'lista':
      return bloco.itens;
    case 'tabela':
      return [...bloco.cabecalho, ...bloco.linhas.flat()];
    case 'passos':
      return bloco.itens.flatMap((item) => [item.titulo, item.texto]);
    case 'faq':
      return bloco.itens.flatMap((item) => [item.pergunta, item.resposta]);
    default:
      throw new Error('Bloco de tipo desconhecido no corpo da página.');
  }
}

/**
 * A pergunta reduzida ao que ela PERGUNTA: sem acento, sem caixa, sem
 * pontuação, sem espaço sobrando.
 *
 * "Quanto custa?" e "Quanto custa" são a MESMA pergunta para quem lê e para o
 * Google, e duas páginas que marcam `FAQPage` com ela disputam o mesmo rich
 * result — o buscador escolhe uma e desconfia das duas. Comparar por `===` não
 * enxergaria isso. Vive aqui, e não no teste, porque o gate (`seo.test.ts`) e o
 * aviso (`pnpm seo:audit`) TÊM de concordar sobre o que é a mesma pergunta:
 * duas normalizações divergentes fariam o audit dizer "limpo" sobre o que o
 * teste reprova.
 */
export function normalizarPergunta(pergunta: string): string {
  return pergunta
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Quantas palavras a pessoa lê no corpo.
 *
 * Contadas DEPOIS de `tokens()`: `**escala**` é uma palavra e não três pedaços,
 * e `[UGC](/glossario/ugc)` é uma palavra e não a rota inteira. Contar o texto
 * cru premiaria quem enche a página de marcação.
 */
export function palavrasDe(pagina: Pagina): number {
  const texto = pagina.corpo
    .flatMap(textosDe)
    .flatMap((cru) => tokens(cru).map((token) => token.texto))
    .join(' ');
  return texto.split(/\s+/).filter((palavra) => palavra.length > 0).length;
}

/**
 * Quem aponta para esta página, sem contar o índice de seção.
 *
 * O índice sai da conta de propósito: TODA página recebe link dele, então
 * incluí-lo faria "órfã" ser um estado impossível e a auditoria não mediria
 * nada. Órfã aqui é a definição estrita — a página em que só se chega descendo
 * a prateleira, e não porque algum texto do site achou que ela era útil.
 *
 * O link do HUB conta, e é um link real: `PaginaHub` lista os membros do
 * cluster, derivados de `hubs`. Ele só existe se a página do hub existir.
 */
function entradasDe(alvo: Pagina): readonly string[] {
  const url = urlDe(alvo);
  const explicitas = paginas()
    .filter((pagina) => urlDe(pagina) !== url)
    .filter((pagina) => linksInternosDe(pagina).includes(url))
    .map(urlDe);
  const viaHub = alvo.hubs.filter((hub) => existe(hub));
  return [...new Set([...explicitas, ...viaHub])].sort();
}

export function auditar(): Auditoria {
  const todas = paginas();
  const publicadas = new Set(todas.map(urlDe));

  const grafo: NoDoGrafo[] = todas.map((pagina) => {
    const url = urlDe(pagina);
    const links = [...new Set(linksInternosDe(pagina))].filter((href) => href !== url);
    return {
      url,
      tipo: pagina.tipo,
      titulo: pagina.titulo,
      saida: links.filter((href) => publicadas.has(href)).sort(),
      entrada: entradasDe(pagina),
      planejados: links.filter((href) => resolverLink(href) === 'planejada').sort(),
      palavras: palavrasDe(pagina),
    };
  });

  const avisos: Aviso[] = [];

  for (const no of grafo) {
    if (no.entrada.length === 0) {
      avisos.push({
        codigo: 'orfa',
        alvo: no.url,
        mensagem:
          'só recebe link do índice da seção — nenhuma outra página do site aponta para ela.',
      });
    }
    // Página que não envia link nenhum não passa autoridade adiante e deixa
    // quem leu sem próximo passo dentro do site (§16).
    if (no.saida.length === 0 && no.planejados.length === 0) {
      avisos.push({
        codigo: 'sem-saida',
        alvo: no.url,
        mensagem: 'não linka para nenhuma outra página do site, nem planejada.',
      });
    }
  }

  for (const hub of Object.keys(HUBS)) {
    if (!publicadas.has(hub)) {
      avisos.push({
        codigo: 'hub-sem-pagina',
        alvo: hub,
        mensagem: ROTAS_PLANEJADAS.includes(hub)
          ? 'está no union `Hub` e em `rotas-planejadas.ts`, mas a página ainda não existe.'
          : 'está no union `Hub` e NÃO está em `rotas-planejadas.ts` — link para ele quebra o build.',
      });
    }
    const membros = todas.filter((pagina) => pagina.hubs.some((dela) => dela === hub));
    if (membros.length === 0) {
      avisos.push({
        codigo: 'hub-sem-membro',
        alvo: hub,
        mensagem: 'nenhuma página declarou este cluster — o hub nasceria com a lista vazia.',
      });
    }
  }

  const citadas = new Set(grafo.flatMap((no) => no.planejados));
  for (const rota of [...citadas].sort()) {
    avisos.push({
      codigo: 'rota-planejada-sem-pagina',
      alvo: rota,
      mensagem: 'citada em texto e ainda sem página: o link está renderizado como TEXTO.',
    });
  }

  return { grafo, avisos };
}

/** O relatório em texto, para o terminal do `pnpm seo:audit`. */
export function relatorio(): string {
  const { grafo, avisos } = auditar();
  const linhas: string[] = [];

  linhas.push(`PÁGINAS (${grafo.length}) e ÍNDICES (${secoes().length})`);
  linhas.push('');
  for (const no of grafo) {
    linhas.push(`  ${no.url}  [${no.tipo}]  ${no.palavras} palavras`);
    linhas.push(`      recebe de : ${no.entrada.length > 0 ? no.entrada.join(', ') : '— ninguém'}`);
    linhas.push(`      envia para: ${no.saida.length > 0 ? no.saida.join(', ') : '— ninguém'}`);
    if (no.planejados.length > 0) {
      linhas.push(`      planejados: ${no.planejados.join(', ')}`);
    }
  }

  linhas.push('');
  linhas.push(`AVISOS (${avisos.length}) — avisos NÃO reprovam o build`);
  linhas.push('');
  if (avisos.length === 0) {
    linhas.push('  nenhum.');
  }
  for (const aviso of avisos) {
    linhas.push(`  [${aviso.codigo}] ${aviso.alvo}`);
    linhas.push(`      ${aviso.mensagem}`);
  }

  return linhas.join('\n');
}
