import type { Pagina } from '../../tipos';

/**
 * O hub do cluster de TikTok — a página-mãe que segura plataforma, guia,
 * verbete e comparativo do assunto.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · TikTok é uma das três redes da garantia (com Instagram e YouTube Shorts) →
 *    `docs/seo/source-of-truth.md` §2 "Plataformas", fonte:
 *    `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`;
 *  · o mesmo arquivo publicado nas três redes, no mesmo dia → `RT-1`,
 *    `docs/seo/source-of-truth.md` §8, fonte: `supabase/manual-seed-v1.sql:183`;
 *  · no máximo um vídeo da operação por dia útil, porque "dois vídeos no mesmo
 *    dia disputam o mesmo espaço e um atropela o alcance do outro" → `RT-2`,
 *    `docs/seo/source-of-truth.md` §8, fonte:
 *    `supabase/manual-seed-v1.sql:187-191`. É condição de quem JÁ é cliente, e
 *    a página diz isso com essas palavras;
 *  · impulsionar é proibido nos perfis onde a estratégia está ativa →
 *    `docs/seo/source-of-truth.md` §8, fonte: `supabase/manual-seed-v1.sql:241`;
 *  · a Doxa não garante que um vídeo específico viralize →
 *    `docs/seo/source-of-truth.md` §1, fonte:
 *    `src/components/faq/config.ts:324-325`.
 *
 * O resto é mecânica pública das plataformas, escrita sem número de terceiro:
 * nenhuma estatística de mercado entra aqui, porque nenhuma tem fonte nomeada
 * neste repositório (§49 do brief, `BLOCKED_EXTERNAL_CREDENTIAL`).
 */
export const pagina: Pagina = {
  tipo: 'hub',
  slug: 'marketing-no-tiktok',
  titulo: 'Marketing no TikTok: o guia de quem posta por uma marca',
  descricao:
    'Como o TikTok distribui vídeo, o que muda quando o perfil é de uma empresa e quais decisões de formato, cadência e medição sustentam o perfil.',
  h1: 'Marketing no TikTok',
  resumo:
    'No TikTok, quantas pessoas veem o seu próximo vídeo depende menos do tamanho do perfil do que se imagina: a plataforma costuma mostrar cada publicação para um grupo pequeno, boa parte dele de quem ainda não te segue, e o que esse grupo faz orienta o resto da distribuição. Este hub organiza o que uma marca precisa decidir antes de postar e aponta para a página de cada assunto.',
  intencao: 'informacional',
  palavrasChave: [
    'marketing no tiktok',
    'estratégia de tiktok',
    'como fazer marketing no tiktok',
    'tiktok para marcas',
  ],
  hubs: [],
  relacionadas: [
    '/plataformas/tiktok-para-empresas',
    '/guias/como-viralizar-no-tiktok',
    '/glossario/algoritmo-do-tiktok',
    '/comparativos/tiktok-vs-instagram',
    '/guias/videos-curtos',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a sua empresa já sabe o que quer publicar e trava na produção, conte o volume que você precisa manter. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que muda quando o perfil é de uma marca',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No TikTok o tamanho do perfil pesa pouco sobre o alcance do próximo vídeo — não é passaporte nem teto. A distribuição costuma começar por uma amostra de pessoas que não conhecem a marca, e o que elas fazem nos primeiros segundos — ficar, sair, voltar, comentar, compartilhar — orienta se a plataforma continua entregando. Um perfil de empresa com poucos seguidores e um vídeo bom compete com um perfil grande e um vídeo morno, e às vezes ganha.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A consequência prática é desconfortável para quem vem do marketing tradicional: **um vídeo que foi bem não garante o próximo**. Isso torna o TikTok o canal em que volume e teste valem mais do que planejamento longo — e o canal em que uma marca descobre rápido que o assunto que ela achava interessante não é o assunto que a audiência dela assiste até o fim.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As três decisões que sustentam um perfil de empresa',
    },
    {
      tipo: 'lista',
      itens: [
        '**Formato.** Vertical, assunto declarado nos primeiros segundos e [legenda embutida](/glossario/legenda-embutida) — o conjunto vale igual nas três redes e está em [vídeos curtos](/guias/videos-curtos). O que abre o vídeo é o [hook](/glossario/hook), e é ele que decide se existe segundo 10.',
        '**Cadência.** Publicar com regularidade dá à plataforma amostras suficientes para aprender quem é o público do perfil; publicar em rajada não acelera nada. O intervalo que a operação usa está em [conteúdo orgânico para empresas](/solucoes/conteudo-organico-para-empresas).',
        '**Medida.** Seguidor é vaidade tardia. O que diz se o conteúdo está funcionando é [retenção](/glossario/retencao), [watch time](/glossario/watch-time) e a proporção de quem chegou sem seguir o perfil.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os erros que mais aparecem em perfil de marca',
    },
    {
      tipo: 'lista',
      itens: [
        'Adaptar o comercial de TV: vinheta, logo e trinta segundos de contexto antes do assunto. O corte acontece antes da mensagem.',
        'Postar só quando há campanha. O perfil fica sem dado nenhum entre uma campanha e outra, e cada retomada começa do zero.',
        'Publicar em rajada para "compensar" a semana parada, em vez de espaçar o que já está pronto.',
        'Trocar o formato a cada semana antes de qualquer teste terminar, o que impede saber o que funcionou.',
        'Tratar o vídeo que performou como exceção de sorte, em vez de refazê-lo em cinco variações.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra neste assunto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O TikTok é uma das três redes em que os vídeos da operação da Doxa são publicados — as outras duas são o Instagram e o YouTube Shorts. Duas regras da operação dizem bem o que a empresa acredita sobre este canal, e valem como condição de quem já é cliente, não como conselho universal: o mesmo arquivo vai para as três redes no mesmo dia, e cada perfil recebe no máximo um vídeo da operação por dia útil.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A razão da segunda regra está escrita no manual do cliente: dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance do outro.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que a Doxa não faz: prometer que um vídeo específico vai viralizar. A operação é construída para gerar volume, dados e testes suficientes para aumentar as chances de alcançar audiências grandes — e é assim que a empresa descreve a própria garantia.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde continuar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se você quer entender o mecanismo de distribuição, comece pelo verbete do [algoritmo do TikTok](/glossario/algoritmo-do-tiktok). Se o que falta é método, o guia de [como viralizar no TikTok](/guias/como-viralizar-no-tiktok) trata do que dá e do que não dá para controlar. Se a dúvida é onde investir o esforço primeiro, o comparativo [TikTok ou Instagram](/comparativos/tiktok-vs-instagram) separa as duas redes por critério.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde à busca: como o TikTok decide o alcance.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md
 *          (§2 Plataformas, §8 RT-1/RT-2, §1 "não garante que um vídeo viralize").
 * [x]  3. Nada da §9: sem preço, mensalidade, fidelidade, direitos, agência
 *          licenciada, 1.500 clientes nem "parceiros".
 * [x]  4. Termos proibidos ausentes: a Doxa não é chamada de agência, as
 *          ferramentas não aparecem como parceiras, sem curso/assinatura/tráfego.
 * [x]  5. A garantia não é citada com número; só a redação prudente de que a
 *          operação aumenta chances e não promete um vídeo viral.
 * [x]  6. Intenção própria: o MAPA do cluster de TikTok. O método é do guia
 *          `/guias/como-viralizar-no-tiktok`, o mecanismo é do verbete.
 * [x]  7. Incremental: as três decisões, os cinco erros e a razão escrita da
 *          regra de cadência — nenhum deles é o resumo padrão da SERP.
 * [x]  8. Title, description e H1 exclusivos; H2 em hierarquia real.
 * [x]  9. É hub: recebe do cluster e envia links contextuais úteis, além da
 *          lista automática de membros que o motor monta.
 * [x] 10. Não se aplica (não é comparativo); ainda assim o texto admite que o
 *          canal não garante resultado.
 * [x] 11. CTA único, no fim, condicionado — topo de funil aponta antes para o
 *          próximo conteúdo do cluster.
 * [x] 12. "Marketing no TikTok" aparece onde caberia sem buscador; sem lista de
 *          sinônimos empilhados.
 * [x] 13. Vocabulário do dono: "operação", "viralizar", "legenda embutida".
 * [x] 14. Publicaria sem Google: sim — é o que eu diria a alguém que assumiu o
 *          perfil da empresa hoje e perguntou por onde começar.
 * ────────────────────────────────────────────────────────────────────────── */
