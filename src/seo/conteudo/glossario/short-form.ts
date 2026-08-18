import type { Pagina } from '../../tipos';

/**
 * Verbete: o TERMO EM INGLÊS e a definição. O hub `/guias/videos-curtos` é o
 * mapa em português; o guia é execução. Divisão do `docs/seo/keyword-map.md`.
 *
 * FATOS DA DOXA USADOS AQUI:
 *  · o entregável é vertical, legendado, no formato do feed →
 *    `docs/seo/source-of-truth.md` §2, fonte:
 *    `src/components/HowItWorks.tsx:92`;
 *  · as três redes em que a operação publica → §2, fonte:
 *    `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`.
 */
export const pagina: Pagina = {
  tipo: 'glossario',
  slug: 'short-form',
  titulo: 'Short-form: o que o termo quer dizer na prática',
  descricao:
    'Short-form é o vídeo curto e vertical distribuído por recomendação. O que define o formato, onde ele vive e o que o diferencia de um vídeo curto qualquer.',
  h1: 'Short-form',
  resumo:
    'No Brasil o mesmo formato é chamado de Reels, TikTok ou Shorts, conforme a rede — e a duração é a parte menos importante da definição.',
  intencao: 'informacional',
  palavrasChave: ['short form', 'vídeo short form', 'formato curto vertical'],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/solucoes/videos-curtos-para-empresas',
    '/glossario/watch-time',
  ],
  atualizadoEm: '2026-08-18',
  corpo: [
    {
      tipo: 'paragrafo',
      texto:
        'Short-form é o vídeo curto, vertical e distribuído por recomendação — aquele que aparece para quem não escolheu vê-lo. É o formato do TikTok, dos Reels do Instagram e do YouTube Shorts, e o nome em inglês pegou junto com a adoção do formato pelas três plataformas.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que define o formato',
    },
    {
      tipo: 'lista',
      itens: [
        '**Vertical**, ocupando a tela inteira do celular. Vídeo horizontal com barras é outro formato.',
        '**Distribuído por recomendação**, não por assinatura: a plataforma escolhe quem vê, e o histórico de quem assiste costuma pesar mais do que a lista de seguidores.',
        '**Curto**, o que hoje significa algo entre alguns segundos e poucos minutos — e a duração exata varia por plataforma e muda com o tempo.',
        '**Consumido em sequência**, um vídeo depois do outro, o que torna a saída para o próximo a alternativa mais fácil que existe.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que a duração é a parte menos importante',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um vídeo de trinta segundos publicado num site, que só aparece para quem clicou, não se comporta como short-form: não há concorrência com o próximo vídeo, não há decisão de continuar a cada instante, e o custo de sair é alto. O que define o formato é o modo de distribuição, e é dele que vêm todas as regras práticas — abertura declarada, um assunto por peça, legenda embutida.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa se encaixa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É o formato em que a operação da Doxa trabalha: o vídeo entregue sai vertical, legendado e no formato do feed, e vai para o Instagram, o TikTok e o YouTube Shorts. O hub de [vídeos curtos](/guias/videos-curtos) reúne o assunto inteiro em português.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Define na primeira frase.
 * [x]  2. Os dois fatos da Doxa têm entrada no source of truth (§2).
 * [x]  3/4/5. Nada da §9, nenhum termo proibido, garantia não citada.
 * [x]  6. Intenção própria: o termo em inglês. O mapa é do hub.
 * [x]  7. Incremental: o argumento de que distribuição, e não duração, define
 *          o formato.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos` e conecta a 3 relacionados.
 * [x] 10. Não se aplica.
 * [x] 11. Sem CTA de compra no corpo.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "vertical, legendado, no formato do feed".
 * [x] 14. Publicaria sem Google: sim.
 * ────────────────────────────────────────────────────────────────────────── */
