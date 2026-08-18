import type { Pagina } from '../../tipos';

/**
 * Verbete: DEFINE o entregável. A execução ("como escrever um") é do guia
 * `/guias/como-escrever-roteiro-de-video-curto`, escrito em paralelo — este
 * arquivo não abre passo a passo nem lista de fórmulas, pela mesma regra que
 * separa `/glossario/hook` do guia de vídeos que prendem.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · cada vídeo entregue é único, com roteiro, voz clonada, edição e capa →
 *    `docs/seo/source-of-truth.md` §2, fonte: `supabase/manual-seed-v2.sql:168`;
 *  · o processo depois de contratar passa por temas, roteiros, versões e
 *    materiais, acompanhados pela empresa → §2, fonte:
 *    `src/components/faq/config.ts:466-467`.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'roteiro-de-video-curto',
  titulo: 'Roteiro de vídeo curto: o que ele decide antes da gravação',
  descricao:
    'Roteiro de vídeo curto é o texto que define o que será dito e mostrado, na ordem. O que ele contém, o que o diferencia de um roteiro longo e por que existe.',
  h1: 'Roteiro de vídeo curto',
  resumo:
    'Em quinze a sessenta segundos não há espaço para improviso: cada frase ocupa uma fatia grande do total, e é o roteiro que decide qual delas fica.',
  intencao: 'informacional',
  // A dona da busca exata "roteiro de vídeo curto" é a página de tutorial,
  // /guias/como-escrever-roteiro-de-video-curto (keyword-map:130). Aqui fica a
  // variante definicional — quem procura o que o roteiro É, não como escrever.
  palavrasChave: [
    'roteiro para vídeo curto',
    'o que é roteiro de vídeo',
    'roteiro para reels',
    'script de vídeo vertical',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/como-escrever-roteiro-de-video-curto',
    '/glossario/hook',
    '/glossario/cta',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Roteiro de vídeo curto é o texto que define, antes da gravação, o que vai ser falado e o que vai ser mostrado, na ordem em que acontecem. Ele cabe em poucas linhas e costuma ser lido em voz alta antes de valer — se travar na leitura, trava na gravação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que ele contém',
    },
    {
      tipo: 'lista',
      itens: [
        'A abertura, que é trabalho de [hook](/glossario/hook) e decide se alguém continua assistindo.',
        'O desenvolvimento: uma ideia por vídeo, sem desvio, com o mínimo de contexto necessário.',
        'O fecho, que é onde cabe a [chamada para ação](/glossario/cta) — uma só.',
        'As indicações visuais: o que aparece na tela em cada trecho, porque em vídeo vertical a imagem é metade da informação.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que ele não parece um roteiro de cinema',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Roteiro longo constrói cena; roteiro curto elimina. A restrição de tempo transforma o trabalho em corte: tirar a saudação, tirar a apresentação, tirar o "antes de começar", tirar o segundo assunto. O que sobra tem de fazer sentido para quem chegou sem contexto nenhum, porque o feed de recomendação entrega o vídeo justamente a quem não segue o perfil.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que escrever antes muda o resultado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Sem roteiro, o vídeo costuma ser gravado várias vezes até sair aceitável, e a decisão do que dizer acaba sendo tomada na edição, quando as opções já acabaram. Com roteiro, a discussão acontece no texto — que é barato de mudar — e a gravação vira execução. É também o que torna possível manter padrão entre uma peça e a seguinte, e o que permite aprovar conteúdo antes de produzi-lo.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Na operação da Doxa, o roteiro é parte do entregável: cada vídeo é único, com roteiro, voz clonada, edição e capa — e temas, roteiros e versões podem ser acompanhados pela empresa cliente ao longo da produção.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para escrever um na prática, com estrutura e exemplos, o guia [como escrever roteiro de vídeo curto](/guias/como-escrever-roteiro-de-video-curto).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Os dois fatos da Doxa têm entrada no source of truth (§2).
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: o que o entregável É. O passo a passo é do guia
 *          `/guias/como-escrever-roteiro-de-video-curto`.
 * [x]  7. Incremental: "roteiro longo constrói cena, roteiro curto elimina" e
 *          o argumento de que sem roteiro a decisão cai na edição.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo do verbete.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação", "voz clonada", "cada vídeo é único".
 * [x] 14. Publicaria sem Google: sim — a diferença entre roteiro que constrói
 *          e roteiro que elimina é o que trava quem vem do vídeo longo.
 * ────────────────────────────────────────────────────────────────────────── */
