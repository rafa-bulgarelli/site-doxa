import type { Pagina } from '../../tipos';

/**
 * O hub do cluster de Instagram.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · Instagram é uma das três redes da garantia →
 *    `docs/seo/source-of-truth.md` §2 "Plataformas", fonte:
 *    `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`;
 *  · o mesmo arquivo nas três redes, no mesmo dia → `RT-1`, §8, fonte:
 *    `supabase/manual-seed-v1.sql:183`;
 *  · nos dias úteis os únicos vídeos curtos dos perfis participantes são os da
 *    operação; fotos, carrosséis e stories seguem liberados → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:445-451`;
 *    `supabase/manual-seed-v1.sql:212`. Condição de cliente, dita como tal;
 *  · impulsionar é proibido nos perfis onde a estratégia está ativa → §8,
 *    fonte: `supabase/manual-seed-v1.sql:241`;
 *  · entregável vertical, legendado, no formato do feed → §2 "Entregável",
 *    fonte: `src/components/HowItWorks.tsx:92`.
 *
 * Nenhum número de mercado, nenhuma estatística de terceiro: sem fonte nomeada
 * no repositório, o texto explica mecanismo em vez de citar pesquisa.
 */
export const pagina: Pagina = {
  tipo: 'hub',
  slug: 'reels-no-instagram',
  titulo: 'Reels no Instagram: produção, formato e distribuição',
  descricao:
    'Como os Reels são distribuídos para quem não segue o perfil, o que muda em relação ao feed antigo e como uma marca organiza produção e cadência.',
  h1: 'Reels no Instagram',
  resumo:
    'O Reels é a parte do Instagram que costuma entregar vídeo a quem ainda não segue o perfil — o resto da rede tende a servir quem já está lá. Este hub trata do formato, da cadência e da produção que sustentam Reels de marca, e aponta para a página de cada assunto do cluster.',
  intencao: 'informacional',
  palavrasChave: [
    'reels no instagram',
    'como fazer reels',
    'estratégia de reels',
    'reels para marcas',
  ],
  hubs: [],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-aumentar-o-alcance-organico',
    '/glossario/alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o gargalo do seu Instagram não é ideia, é produção, conte quantos Reels a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que boa parte do alcance de quem não te segue costuma vir do Reels',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O Instagram tem dois modos de entregar conteúdo. Um mostra o que você publicou para quem já segue o perfil, e é o modo do feed clássico: previsível, limitado ao tamanho da sua lista. O outro recomenda vídeo vertical para gente que nunca ouviu falar de você, e é o modo do Reels. Para uma marca que precisa crescer, o segundo costuma entregar mais — o primeiro tende a conservar o que já existe.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Isso explica o desenho estranho de muitos perfis de empresa: carrossel bonito, engajamento razoável entre os seguidores e nenhuma pessoa nova chegando. O alcance que traz gente de fora costuma se concentrar no formato que boa parte das marcas produz menos, porque é o que dá mais trabalho.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que um Reels de marca precisa entregar',
    },
    {
      tipo: 'lista',
      itens: [
        'O básico de formato — vertical, assunto declarado nos primeiros segundos, um assunto por vídeo e [legenda embutida](/glossario/legenda-embutida) — vale igual nas três redes, e está reunido em [vídeos curtos](/guias/videos-curtos).',
        'O que é próprio do Reels: a curva de [retenção](/glossario/retencao) cai na primeira transição fraca, e um vídeo que tenta cobrir três tópicos costuma perder nos três.',
        'Um fecho que faça sentido sozinho: boa parte de quem assiste não vai abrir o perfil para entender o contexto.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Cadência: o erro mais caro é o silêncio irregular',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Publicar três Reels numa terça e sumir por quinze dias entrega menos do que publicar um por dia útil durante três semanas. A razão é simples e não tem nada de mística: vídeos publicados juntos disputam a mesma audiência, e um perfil que fica em silêncio não gera amostra nenhuma para a plataforma aprender quem gosta do que você faz. Consistência aqui não é disciplina moral, é volume de teste.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A pergunta que vem em seguida é como manter esse ritmo sem uma equipe. Ela tem página própria: [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe) trata da rotina, e [como produzir conteúdo sem equipe](/guias/como-produzir-conteudo-sem-equipe) trata de onde o material sai.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra neste assunto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O Instagram é uma das três redes em que os vídeos da operação da Doxa são publicados, junto com TikTok e YouTube Shorts, e o vídeo entregue já sai vertical, legendado e no formato do feed. Duas condições da operação valem citar aqui porque explicam a lógica, e são condições de quem já é cliente: o mesmo arquivo vai para as três redes no mesmo dia, e nos dias úteis os únicos vídeos curtos publicados nos perfis participantes são os da operação — fotos, carrosséis e stories continuam liberados.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Nos perfis em que a estratégia está ativa, impulsionar publicação é proibido. A meta é de visualizações orgânicas, e mídia paga no mesmo perfil embaralha o dado que a operação usa para decidir o que produzir a seguir.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde continuar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Para o lado comercial do assunto — o que uma empresa precisa organizar internamente —, veja [Reels para empresas](/plataformas/instagram-reels-para-empresas). Para crescimento sem impulsionar nada, [como crescer no Instagram organicamente](/guias/como-crescer-no-instagram-organicamente). Para escolher entre as duas redes maiores, [TikTok ou Instagram](/comparativos/tiktok-vs-instagram).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o Reels é o que entrega para quem não segue.
 * [x]  2. Fatos da Doxa com entrada no source of truth (§2 Plataformas e
 *          Entregável, §8 RT-1, dias úteis e zero impulsionamento).
 * [x]  3. Nada da §9 apareceu.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é enunciada com número nem prazo.
 * [x]  6. Intenção própria: o mapa do cluster de Instagram. Crescimento é do
 *          guia; o lado comercial é da página de plataforma.
 * [x]  7. Incremental: a separação entre os dois modos de entrega e a razão
 *          concreta da cadência.
 * [x]  8. Title, description e H1 exclusivos; H2 em hierarquia real.
 * [x]  9. Hub: envia links contextuais e recebe do cluster.
 * [x] 10. Não é comparativo; ainda assim admite o limite do formato.
 * [x] 11. CTA único no fim, condicionado ao gargalo de produção.
 * [x] 12. Sem stuffing: "Reels" aparece onde a frase pede.
 * [x] 13. Vocabulário do dono: "vertical, legendado, no formato do feed",
 *          "operação".
 * [x] 14. Publicaria sem Google: sim — é a explicação que falta a quem produz
 *          carrossel e não entende por que ninguém novo chega.
 * ────────────────────────────────────────────────────────────────────────── */
