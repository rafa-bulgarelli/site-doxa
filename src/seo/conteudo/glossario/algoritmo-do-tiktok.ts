import type { Pagina } from '../../tipos';

/**
 * Verbete: explica o MECANISMO de distribuição. O método ("como viralizar") é
 * do guia; o hub organiza. "Algoritmo" é palavra deste verbete, "viralizar" é
 * do guia — divisão do `docs/seo/keyword-map.md`.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · "dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance
 *    do outro" → `docs/seo/source-of-truth.md` §8, `RT-2`, fonte:
 *    `supabase/manual-seed-v1.sql:187-191`.
 *
 * Nenhum detalhe interno do sistema de recomendação é afirmado como fato: a
 * página descreve o comportamento observável, que é o que se pode verificar.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'algoritmo-do-tiktok',
  titulo: 'Algoritmo do TikTok: como o vídeo chega até as pessoas',
  descricao:
    'O que se sabe sobre a distribuição do TikTok: como um vídeo é testado com um grupo pequeno, que sinais pesam e o que é mito sobre o funcionamento.',
  h1: 'Algoritmo do TikTok',
  resumo:
    'O algoritmo do TikTok é o sistema que decide para quem cada vídeo é mostrado. Ele funciona por testes sucessivos: mostra a um grupo pequeno, observa o comportamento e amplia ou interrompe a entrega a partir do que viu.',
  intencao: 'informacional',
  palavrasChave: [
    'algoritmo do tiktok',
    'como funciona o algoritmo tiktok',
    'for you page',
  ],
  hubs: ['/guias/marketing-no-tiktok'],
  relacionadas: [
    '/guias/marketing-no-tiktok',
    '/guias/como-viralizar-no-tiktok',
    '/glossario/retencao',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'O algoritmo do TikTok é o sistema que decide quais vídeos aparecem no feed de recomendações de cada pessoa. Ele não parte da lista de quem você segue: parte do vídeo, testa a reação de um grupo pequeno e decide se continua entregando.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O ciclo, em quatro passos',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Amostra inicial',
          texto:
            'O vídeo é mostrado a um grupo pequeno de pessoas, escolhido pelo assunto, pela língua e pelo histórico delas — não pelo tamanho do seu perfil.',
        },
        {
          titulo: 'Observação',
          texto:
            'O sistema mede o que aconteceu: quanto tempo as pessoas assistiram, se reassistiram, se compartilharam, se comentaram, se saíram nos primeiros segundos.',
        },
        {
          titulo: 'Decisão',
          texto:
            'Se os sinais forem bons, a entrega cresce para um grupo maior. Se não, ela desacelera. O ciclo se repete a cada nova faixa de audiência.',
        },
        {
          titulo: 'Cauda longa',
          texto:
            'Um vídeo que funcionou pode continuar sendo entregue por semanas, porque o teste não tem prazo fixo de validade.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os sinais que mais pesam',
    },
    {
      tipo: 'lista',
      itens: [
        'Tempo assistido em relação à duração — a [retenção](/glossario/retencao) é o sinal mais denso, porque qualquer espectador o produz.',
        'Reassistir o mesmo vídeo, que é uma versão ainda mais forte do sinal anterior.',
        'Compartilhamento, que carrega intenção clara de recomendar a alguém.',
        'Comentário, principalmente quando gera resposta e conversa.',
        'Seguir o perfil depois de assistir, que é o sinal mais raro e o mais valioso.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que é mito',
    },
    {
      tipo: 'lista',
      itens: [
        '**Que existe um castigo pessoal.** O que costuma haver é uma sequência de vídeos com retenção baixa, o que reduz a amostra inicial dos seguintes.',
        '**Que hashtag define o alcance.** Ela ajuda a classificar o assunto, e não substitui a reação das pessoas.',
        '**Que o horário decide.** Ele pesa pouco ao lado do que abre o vídeo e da constância de quem publica.',
        '**Que publicar mais no mesmo dia acelera.** As peças do mesmo dia concorrem pela mesma amostra inicial — é a razão pela qual a operação da Doxa limita a um vídeo por dia útil nos perfis dos clientes.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'As plataformas publicam no máximo uma visão geral do próprio sistema de recomendação; o detalhe interno não é público e muda. O que está descrito aqui é comportamento observável, não engenharia reversa — e é assim que deve ser lido.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para o método de quem quer usar esse mecanismo a favor, o guia [como viralizar no TikTok](/guias/como-viralizar-no-tiktok). Para o assunto inteiro, o hub de [marketing no TikTok](/guias/marketing-no-tiktok).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. O único fato da Doxa tem entrada no source of truth (§8, RT-2).
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: o mecanismo. O método é do guia.
 * [x]  7. Incremental: o ciclo em quatro passos e a lista de mitos, com a
 *          ressalva honesta de que ninguém publica o funcionamento interno.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-no-tiktok` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação".
 * [x] 14. Publicaria sem Google: sim — a ressalva sobre o que NÃO se sabe é o
 *          que falta em quase toda página deste assunto.
 * ────────────────────────────────────────────────────────────────────────── */
