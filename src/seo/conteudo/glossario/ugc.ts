import type { Pagina } from '../../tipos';

/**
 * Verbete: DEFINE a sigla. O guia `/guias/o-que-e-ugc` explica os dois sentidos
 * em que a palavra é usada hoje; o comparativo decide entre formatos. Divisão
 * do `docs/seo/keyword-map.md`.
 *
 * ADJACÊNCIA §47 do brief: a Doxa não vende UGC, e esta página não sugere que
 * venda. O termo é definido de forma editorial e neutra.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'ugc',
  titulo: 'UGC: o que a sigla significa e como ela mudou de sentido',
  descricao:
    'UGC é conteúdo gerado pelo usuário. O que a sigla queria dizer originalmente, o que ela passou a significar no mercado e por que a confusão importa.',
  h1: 'UGC',
  resumo:
    'UGC é a sigla de user generated content, ou conteúdo gerado pelo usuário: material publicado por pessoas comuns, e não pela marca. No mercado brasileiro a palavra ganhou um segundo sentido, e essa ambiguidade cria mal-entendidos caros em briefing.',
  intencao: 'informacional',
  palavrasChave: ['ugc', 'user generated content', 'ugc creator significado'],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/o-que-e-ugc',
    '/comparativos/ugc-vs-conteudo-de-marca',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'UGC é a sigla de user generated content, conteúdo gerado pelo usuário: qualquer material publicado por pessoas comuns sobre uma marca, sem que a marca tenha produzido ou encomendado. Uma avaliação em vídeo, uma foto do produto recebido, um comentário elogiando ou reclamando.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O segundo sentido, que é o mais usado hoje',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Na prática do mercado, UGC virou também o nome de um formato: vídeo com aparência de conteúdo espontâneo, gravado por um criador contratado pela marca, no celular, sem produção publicitária aparente. Nesse segundo sentido, a peça é paga e roteirizada — a única coisa espontânea é o visual.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Os dois sentidos convivem, e vale confirmar qual está em jogo antes de fechar qualquer combinado: um é material que aparece sozinho e a marca aproveita; o outro é uma produção encomendada com estética de vídeo caseiro.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que o formato funciona',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Porque o feed de vídeo curto premia o que parece uma pessoa falando com você, e castiga o que parece um anúncio. Uma peça de aparência caseira atravessa a defesa automática que todo mundo desenvolveu contra publicidade — e é por isso que marcas grandes passaram a encomendar vídeos que parecem não ter sido encomendados.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que isso exige de quem contrata',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Transparência, principalmente. Conteúdo pago apresentado como opinião espontânea é problema de publicidade, não de estética, e as plataformas têm regras próprias de sinalização. A aparência caseira é uma escolha de linguagem legítima; esconder que houve pagamento não é.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para os dois sentidos em detalhe, o guia [o que é UGC](/guias/o-que-e-ugc). Para escolher entre esse formato e o vídeo de marca, o comparativo [UGC ou conteúdo de marca](/comparativos/ugc-vs-conteudo-de-marca).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Nenhum fato sobre a Doxa nesta página — e nenhuma sugestão de que a
 *          empresa venda UGC. Adjacência tratada editorialmente (§47).
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: a sigla. Os dois sentidos em detalhe são do guia.
 * [x]  7. Incremental: a ambiguidade do termo e a nota sobre transparência.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário coerente.
 * [x] 14. Publicaria sem Google: sim — a ambiguidade da sigla causa
 *          mal-entendido real em briefing.
 * ────────────────────────────────────────────────────────────────────────── */
