import type { Pagina } from '../../tipos';

/**
 * Verbete curto de propósito: define a sigla e resolve UMA dúvida concreta —
 * onde a chamada entra num vídeo de trinta segundos. Não abre lista de
 * "fórmulas de CTA que convertem" e não vira página de conversão: a régua de
 * copy reprova na hora "CTA de compra no meio de um verbete de glossário", e
 * seria irônico exatamente aqui. O exemplo real usado é o da própria landing,
 * porque ele tem fonte.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · a CTA canônica da landing é "Quero viralizar" →
 *    `docs/seo/source-of-truth.md` §2, fonte: `src/components/Hero.tsx:42`;
 *  · toda CTA de conversão do site aponta para o mesmo destino → §2, fonte:
 *    `src/ancoras.ts:15-28`.
 *
 * NÃO entra aqui nenhum número de conversão: não há fonte para isso no
 * projeto, e "CTA no fim aumenta X%" seria estatística inventada.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'cta',
  titulo: 'CTA: a chamada para ação e onde ela cabe num vídeo',
  descricao:
    'CTA é a frase que pede uma ação específica de quem assistiu. O que ela precisa ter, onde entra num vídeo curto e por que pedir duas coisas anula as duas.',
  h1: 'CTA',
  resumo:
    'CTA é a sigla de call to action, ou chamada para ação: a frase que pede de quem assistiu uma ação concreta e única. Ela não é o fim do vídeo por convenção — é o único momento em que a peça transforma atenção em alguma coisa.',
  intencao: 'informacional',
  palavrasChave: [
    'cta',
    'o que é cta',
    'chamada para ação',
    'call to action em vídeo',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/glossario/roteiro-de-video-curto',
    '/glossario/hook',
    '/glossario/engajamento',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'CTA é a sigla de call to action, em português chamada para ação: a frase que pede de quem assistiu uma ação concreta — comentar uma palavra, salvar, seguir, clicar no link, mandar mensagem, agendar uma conversa. O que a define é o verbo, e o fato de haver um só.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde ela entra num vídeo curto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No fecho, depois de o conteúdo ter entregado o que a abertura prometeu. Pedir antes disso é cobrar por algo que ainda não foi dado, e o [hook](/glossario/hook) tem outra função — ele existe para segurar, não para pedir. Em peça de trinta segundos, a chamada costuma caber em uma frase, dita e escrita na tela, sem despedida antes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Uma por vídeo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Pedir para curtir, comentar, salvar, seguir e clicar no link no mesmo fecho é a forma mais rápida de não conseguir nenhuma das cinco. Escolha a ação que corresponde ao objetivo daquele vídeo: conteúdo de descoberta pede seguir; conteúdo útil pede salvar; conteúdo de oferta pede a conversa. A ação também tem de ser possível de fazer na hora, no aparelho em que a pessoa está.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A chamada de conversão da própria Doxa é uma frase só, "Quero viralizar", e todas as chamadas do site levam ao mesmo destino — o formulário. É um exemplo do princípio: um verbo, um lugar para chegar, sem alternativa competindo ao lado.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A chamada é a última linha do [roteiro](/glossario/roteiro-de-video-curto), e o que ela pede aparece depois nas métricas de [engajamento](/glossario/engajamento) — que é onde dá para conferir se o pedido foi atendido.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Os dois fatos da Doxa têm entrada no source of truth (§2): a CTA
 *          canônica da landing e o destino único das chamadas.
 * [x]  3/4/5. Nada da §9 (sem preço, sem prazo), nenhum termo proibido, a
 *          garantia não é citada.
 * [x]  6. Intenção própria: a sigla e o LUGAR dela no vídeo. O roteiro é
 *          verbete vizinho; a execução de hook é do guia.
 * [x]  7. Incremental: "pedir cinco coisas é a forma de não conseguir nenhuma"
 *          e o critério de escolher a ação pelo objetivo do vídeo.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 4 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. SEM CTA de compra no corpo — o verbete sobre CTA não vende nada, e
 *          a menção à landing é exemplo declarado, não convite.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "Quero viralizar" citado palavra por palavra.
 * [x] 14. Publicaria sem Google: sim — o vídeo que pede cinco coisas no fim é
 *          erro visível em qualquer feed.
 * ────────────────────────────────────────────────────────────────────────── */
