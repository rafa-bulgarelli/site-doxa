/**
 * O CONTRATO do motor de SEO. As tracks de conteúdo programam contra este
 * arquivo — nada aqui muda sem mudar o motor junto.
 *
 * A regra que explica o desenho: uma página SEO é DADO, não componente. Quem
 * escreve conteúdo preenche um objeto tipado e o compilador cobra os campos
 * obrigatórios; quem escreve layout lê o objeto e desenha. Sem essa fronteira,
 * a décima página vira uma cópia do layout da nona com o texto trocado, que é
 * exatamente a doorway page que o brief proíbe (§46).
 */

/** O que a página É. Decide o prefixo da URL, o layout e o `og:type`. */
export type Tipo =
  | 'solucao'
  | 'plataforma'
  | 'guia'
  | 'comparativo'
  | 'dor'
  | 'glossario'
  | 'hub';

/** A intenção de busca que a página atende (§37). */
export type Intencao = 'informacional' | 'comercial' | 'transacional' | 'navegacional';

/**
 * As URLs dos hubs, FECHADAS num union de propósito.
 *
 * Hub novo é mudança de arquitetura — quem cria um cluster decide onde ele
 * entra no grafo de links, e isso é decisão de motor. Se `hubs` fosse
 * `string[]`, uma track de conteúdo poderia inventar `/guias/qualquer-coisa`,
 * a página nasceria órfã e ninguém veria até a auditoria de órfãs.
 */
export type Hub =
  | '/guias/marketing-no-tiktok'
  | '/guias/reels-no-instagram'
  | '/guias/ia-no-marketing'
  | '/guias/marketing-organico'
  | '/guias/videos-curtos';

export interface Faq {
  pergunta: string;
  resposta: string;
}

/** Um passo numerado, dentro de um bloco `passos`. */
export interface Passo {
  titulo: string;
  texto: string;
}

/**
 * Um bloco do corpo.
 *
 * A marcação inline permitida em todo campo `texto` é DUAS coisas: `**negrito**`
 * e `[rótulo](/rota-ou-https)`. Só isso, e por escolha — um subset de Markdown
 * completo traria HTML arbitrário para dentro de um arquivo de conteúdo, e daí
 * para um `dangerouslySetInnerHTML` é um passo. Ver `inline.ts`.
 */
export type Bloco =
  | { tipo: 'paragrafo'; texto: string }
  /** O `id` da âncora é o slug do texto — é assim que o TOC acha o título. */
  | { tipo: 'titulo'; nivel: 2 | 3; texto: string }
  | { tipo: 'lista'; itens: readonly string[]; ordenada?: boolean }
  | { tipo: 'destaque'; texto: string; variante: 'nota' | 'atencao' | 'doxa' }
  | { tipo: 'tabela'; cabecalho: readonly string[]; linhas: ReadonlyArray<readonly string[]> }
  | { tipo: 'passos'; itens: readonly Passo[] }
  /** Vira `<details>` visível E `FAQPage` — nunca um sem o outro (§46). */
  | { tipo: 'faq'; itens: readonly Faq[] }
  | { tipo: 'cta'; texto: string; rotulo?: string };

/** O CTA de fecho da página. Ausente = o default do motor. */
export interface Cta {
  texto: string;
  rotulo: string;
}

export interface Pagina {
  tipo: Tipo;
  /** A URL final é `PREFIXO[tipo] + '/' + slug`. */
  slug: string;
  /** `<title>`, exclusivo e orientado à intenção — nunca `Keyword | DOXA` (§22). */
  titulo: string;
  /** `meta description`, 120–160 caracteres, exclusiva. */
  descricao: string;
  h1: string;
  /** O lead: a primeira frase responde à intenção da busca (§19). */
  resumo: string;
  intencao: Intencao;
  palavrasChave: readonly string[];
  /** Os clusters a que a página pertence. ≥1, exceto quando `tipo` é `hub`. */
  hubs: readonly Hub[];
  /** URLs internas — existentes ou em `ROTAS_PLANEJADAS`. */
  relacionadas: readonly string[];
  corpo: readonly Bloco[];
  /** `AAAA-MM-DD` — data da última mudança de CONTEÚDO, não do deploy. */
  atualizadoEm: string;
  cta?: Cta;
}

/**
 * Um índice de seção (`/solucoes`, `/guias`…). NÃO é uma `Pagina`: não tem
 * corpo escrito à mão, é gerado a partir do que existe no índice.
 */
export interface Secao {
  url: string;
  titulo: string;
  descricao: string;
  h1: string;
  resumo: string;
  paginas: readonly Pagina[];
}
