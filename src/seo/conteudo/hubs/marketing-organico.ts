import type { Pagina } from '../../tipos';

/**
 * O hub do cluster de orgânico — o mais amplo dos cinco, e o que segura as
 * dores de cadência e de alcance.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · as visualizações contabilizadas nas metas são orgânicas, sem depender de
 *    compra de mídia → `docs/seo/source-of-truth.md` §8, fonte:
 *    `src/components/faq/config.ts:174-175,344-345`;
 *  · impulsionar, turbinar ou promover é proibido nos perfis onde a estratégia
 *    está ativa → §8, fonte: `supabase/manual-seed-v1.sql:241`;
 *  · engajamento artificial (comprar seguidores, curtidas, views) contamina
 *    resultado e pode gerar penalização das redes → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:531-543`;
 *  · custo mensal do "jeito antigo", R$ 8.000 a R$ 10.500, e as 25
 *    contratações → §4, fonte: `src/components/comparacao/config.ts:44-70,
 *    100-101`. Publicado como ILUSTRAÇÃO do que uma operação interna acumula,
 *    que é a ressalva escrita no próprio arquivo;
 *  · a Doxa não vende tráfego pago → §1, fonte: `public/llms.txt:42`;
 *  · empresas pequenas cabem "desde que exista potencial para transformar
 *    conteúdo em um canal relevante de crescimento" → §7, fonte:
 *    `src/components/faq/config.ts:364-365`.
 */
export const pagina: Pagina = {
  tipo: 'hub',
  slug: 'marketing-organico',
  titulo: 'Marketing orgânico: crescer sem comprar cada visualização',
  descricao:
    'O que sustenta crescimento orgânico em vídeo, por que ele demora mais que mídia paga e o que fazer quando o alcance do perfil para de crescer.',
  h1: 'Marketing orgânico',
  resumo:
    'Marketing orgânico é crescer por distribuição, não por compra: em vez de pagar por cada visualização, você produz conteúdo que as plataformas entregam de graça porque as pessoas assistem. Demora mais para engrenar e não para quando a verba acaba. Este hub reúne o que sustenta esse canal e aponta para a página de cada assunto.',
  intencao: 'informacional',
  palavrasChave: [
    'marketing orgânico',
    'crescimento orgânico',
    'alcance orgânico redes sociais',
    'crescer sem pagar anúncio',
  ],
  hubs: [],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/marketing-no-tiktok',
    '/guias/ia-no-marketing',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a sua empresa quer transformar conteúdo num canal previsível e o gargalo é produzir com constância, conte o que precisa publicar. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que é marketing orgânico, sem rodeio',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É todo alcance que a plataforma entrega sem cobrar por ele. Você publica, a rede mostra para um grupo de pessoas, e o comportamento desse grupo decide se ela mostra para mais gente. Nada disso é gratuito de verdade — custa produção, tempo e constância —, mas o custo não é por visualização, e é essa diferença que muda o formato do negócio.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A diferença para a mídia paga aparece no calendário: um vídeo que funcionou em março ainda pode trazer gente em setembro, e um anúncio desligado em março não trouxe mais ninguém no dia 2 de abril. A comparação por custo, prazo e previsibilidade tem página própria em [orgânico ou pago](/comparativos/organico-vs-pago).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As quatro coisas que sustentam um canal orgânico',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Volume suficiente para gerar dado',
          texto:
            'Um perfil que publica quatro vezes por mês não tem amostra para descobrir nada. A quantidade não é vaidade: é a matéria-prima do aprendizado sobre o que a sua audiência assiste até o fim.',
        },
        {
          titulo: 'Formato que a plataforma distribui',
          texto:
            'Hoje isso significa, em primeiro lugar, vídeo vertical curto: é o formato em que uma parte relevante do alcance costuma vir de quem ainda não segue o perfil. Carrossel e foto também aparecem em recomendação, mas costumam render mais entre quem já está lá.',
        },
        {
          titulo: 'Um critério para descartar',
          texto:
            'Sem uma regra clara sobre o que refazer e o que abandonar, a operação vira produção de conteúdo por hábito, e o mês seguinte repete os erros do anterior.',
        },
        {
          titulo: 'Paciência com o prazo certo',
          texto:
            'Orgânico não é lento por natureza; é lento no começo, quando ainda não há dado. O erro comum é desistir exatamente no ponto em que a operação começaria a usar o que aprendeu.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que não funciona, e por que ainda é tentador',
    },
    {
      tipo: 'lista',
      itens: [
        'Comprar seguidores, curtidas ou visualizações: contamina o dado que você usaria para decidir, e pode gerar penalização das redes.',
        'Impulsionar um post orgânico para "dar um empurrão": o alcance sobe, mas você deixa de saber se o conteúdo se sustentava sozinho.',
        'Repetir o mesmo tema porque ele funcionou uma vez, sem variar nada — o que funcionou foi uma execução, não um assunto.',
        'Trocar de estratégia toda vez que um vídeo vai mal, o que garante nunca terminar um teste.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O custo real de montar isso por dentro',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Reunir por dentro tudo que uma operação de conteúdo exige — video maker, roteirista, editor, social media, câmera, microfone, estúdio, ilha de edição, banco de trilhas, calendário editorial, relatórios — custa entre **R$ 8.000 e R$ 10.500 por mês**, na conta que a Doxa publica na própria landing. É um inventário ilustrativo do que uma operação interna acumula, não um levantamento de mercado; serve para mostrar que o custo é fixo e recorrente mesmo nos meses em que nada viraliza.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra neste assunto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa opera exatamente neste canal: as visualizações contabilizadas nas metas são orgânicas, vindas da distribuição dos conteúdos produzidos dentro da operação, sem depender da compra de mídia. A empresa não vende tráfego pago, e nos perfis em que a estratégia está ativa impulsionar publicações é proibido — se a marca quiser complementar com anúncios, isso é feito separadamente.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Empresa pequena cabe nessa lógica, na redação da própria Doxa, desde que exista potencial para transformar conteúdo num canal relevante de crescimento. Não é um canal para todo negócio, e dizer isso é mais útil do que fingir o contrário.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde continuar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se o alcance do seu perfil parou de crescer, comece por [como aumentar o alcance orgânico](/guias/como-aumentar-o-alcance-organico). Se o problema é manter o ritmo, [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe). Se você ainda está decidindo entre investir em conteúdo ou em anúncio, [orgânico ou pago](/comparativos/organico-vs-pago).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Primeira frase responde: orgânico é alcance que a plataforma entrega
 *          sem cobrar por ele.
 * [x]  2. Fatos da Doxa com entrada no source of truth (§1, §4, §7, §8).
 * [x]  3. Nada da §9: o custo citado é o do "jeito antigo" publicado na
 *          landing, não a mensalidade da Doxa — que continua fora.
 * [x]  4. Termos proibidos ausentes; tráfego pago aparece só como o que a Doxa
 *          NÃO vende.
 * [x]  5. A garantia não é enunciada com número nem prazo.
 * [x]  6. Intenção própria: o mapa do cluster. A tabela do comparativo não é
 *          repetida aqui, conforme a seção Canibalização do keyword-map.
 * [x]  7. Incremental: os quatro sustentáculos, os quatro antipadrões e a
 *          ressalva sobre o inventário de custo.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Hub: envia contextuais e recebe do cluster.
 * [x] 10. Admite que orgânico não serve a todo negócio.
 * [x] 11. CTA único, no fim.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "operação", "views somadas" implícito em
 *          "visualizações contabilizadas nas metas", "o jeito antigo".
 * [x] 14. Publicaria sem Google: sim — a lista do que não funciona é o que eu
 *          diria a quem está prestes a comprar seguidor.
 * ────────────────────────────────────────────────────────────────────────── */
