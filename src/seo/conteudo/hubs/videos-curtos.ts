import type { Pagina } from '../../tipos';

/**
 * O hub do cluster de formato — hook, retenção, watch time, UGC e o resto do
 * vocabulário de vídeo curto.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o entregável é vertical, legendado, no formato do feed →
 *    `docs/seo/source-of-truth.md` §2 "Entregável", fonte:
 *    `src/components/HowItWorks.tsx:92`;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → §2, fonte:
 *    `supabase/manual-seed-v2.sql:168`;
 *  · a referência de volume da operação é 60 conteúdos únicos em 90 dias, um
 *    por dia útil → §2 e §8, fonte: `supabase/manual-seed-v1.sql:179,183`;
 *  · as três redes em que a operação publica → §2, fonte:
 *    `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`;
 *  · "baixou, publicou" — publicar exatamente o arquivo entregue, sem alterar
 *    corte, duração, velocidade, proporção, legenda ou capa → §8, fonte:
 *    `supabase/manual-seed-v1.sql:263`, regra `AL-1` (`:267-269`). A RAZÃO da
 *    regra é a do próprio manual, quase palavra por palavra: "cada elemento do
 *    vídeo é decidido com foco em desempenho. Alterar um detalhe muda a peça
 *    inteira, e a DOXA não consegue responder pelo resultado de um conteúdo que
 *    não é mais o que produziu". Condição de cliente, dita como tal;
 *  · a Doxa não promete que um vídeo específico viralize → §1, fonte:
 *    `src/components/faq/config.ts:324-325`.
 *
 * Sem número de mercado sobre duração ideal, taxa de retenção média ou
 * "X segundos de atenção": não há fonte nomeada para nada disso aqui.
 */
export const pagina: Pagina = {
  tipo: 'hub',
  slug: 'videos-curtos',
  titulo: 'Vídeos curtos: o formato que domina as três redes',
  descricao:
    'O que faz um vídeo curto ser assistido até o fim: hook, retenção, watch time e as decisões de formato que valem no TikTok, no Reels e no Shorts.',
  h1: 'Vídeos curtos',
  resumo:
    'Um vídeo curto é assistido ou descartado em menos tempo do que leva para ler esta frase, e quase tudo que decide o resultado acontece antes do quinto segundo. Este hub reúne o vocabulário do formato — hook, retenção, watch time — e as decisões de produção que valem igual no TikTok, no Reels e no YouTube Shorts.',
  intencao: 'informacional',
  palavrasChave: [
    'vídeos curtos',
    'short form',
    'vídeo vertical',
    'conteúdo em vídeo curto',
  ],
  hubs: [],
  relacionadas: [
    '/solucoes/videos-curtos-para-empresas',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/glossario/hook',
    '/glossario/retencao',
    '/guias/por-que-meus-videos-nao-tem-views',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o formato você já entendeu e o que falta é alguém para produzir na frequência certa, conte quantos vídeos a sua empresa precisa por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que o formato curto se comporta diferente de tudo antes dele',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Num feed de vídeo curto, a pessoa não escolhe o que assistir: ela recebe. A decisão dela não é "vou ver este", é "vou continuar vendo este". Essa inversão explica boa parte do que parece estranho no formato — por que a abertura importa mais do que o fim, por que contexto no começo mata o vídeo, e por que um assunto excelente mal apresentado tem menos alcance do que um assunto banal bem aberto.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quem publica precisa então otimizar duas coisas em ordem: quantas pessoas passam dos primeiros segundos, e quanto tempo ficam depois disso. A primeira é o trabalho do [hook](/glossario/hook). A segunda é [retenção](/glossario/retencao), medida em conjunto pelo [watch time](/glossario/watch-time). Nenhuma das duas tem a ver com produção cara.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As decisões de formato que valem nas três redes',
    },
    {
      tipo: 'lista',
      itens: [
        'Vertical de ponta a ponta, sem barras e sem recorte de material horizontal — vídeo reaproveitado de outro formato aparece como vídeo reaproveitado.',
        '**Legenda embutida no arquivo**: é acessibilidade para quem não ouve, resolve as situações em que ligar o som não é opção e ajuda a segurar a atenção — e, diferente da legenda automática, ela não some quando o vídeo é baixado e republicado.',
        'Assunto declarado nos primeiros segundos, antes de qualquer apresentação da marca.',
        'Um assunto por vídeo. Dois assuntos criam uma transição, e é na transição que a curva cai.',
        'Duração ditada pelo conteúdo, não por uma regra: o vídeo termina quando a ideia termina, e nem um segundo depois.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que o mesmo arquivo serve às três redes',
    },
    {
      tipo: 'paragrafo',
      texto:
        'TikTok, Instagram Reels e YouTube Shorts pedem o mesmo formato e costumam responder a sinais parecidos, o que torna o reaproveitamento honesto — não é preguiça, é distribuição. Como publicar a mesma peça nas três sem estragar o arquivo está em [como usar o mesmo vídeo nas três redes](/guias/como-usar-o-mesmo-video-nas-tres-redes).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que muda de rede para rede é o que cada uma faz com o vídeo depois. O comparativo [TikTok ou Instagram](/comparativos/tiktok-vs-instagram) trata dessa parte com mais cuidado.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra neste assunto',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É o formato em que a operação inteira da Doxa trabalha. Cada vídeo entregue é único — roteiro, voz clonada, edição e capa —, sai vertical, legendado e no formato do feed, e vai para as três redes. A referência de volume da operação é de sessenta conteúdos únicos em noventa dias, um por dia útil — condição de quem já é cliente, conforme as condições e o prazo do contrato —, o que dá a ordem de grandeza do que se entende aqui por publicar com constância.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A regra que o manual do cliente resume em duas palavras: baixou, publicou — o arquivo entregue vai ao ar exatamente como saiu. O que cada alteração custa, item por item, está em [vídeos curtos para empresas](/solucoes/videos-curtos-para-empresas).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'E a ressalva que a Doxa faz em público: nenhum vídeo específico tem viralização prometida. O que se constrói é volume, dado e teste suficientes para aumentar as chances de alcançar audiências grandes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde continuar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se os seus vídeos não estão sendo vistos, [por que os seus vídeos não têm views](/guias/por-que-meus-videos-nao-tem-views) começa pelo diagnóstico. Se o problema é a abertura, [como fazer vídeos curtos que prendem](/guias/como-fazer-videos-curtos-que-prendem). Se você precisa do vocabulário antes, os verbetes de [hook](/glossario/hook), [retenção](/glossario/retencao) e [watch time](/glossario/watch-time) são curtos de propósito.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. Primeira frase responde: o que decide o resultado acontece antes do
 *          quinto segundo.
 * [x]  2. Fatos da Doxa com entrada no source of truth (§1, §2, §8).
 * [x]  3. Nada da §9: sem preço, prazo do primeiro vídeo nem direitos do vídeo.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. Os 60 conteúdos em 90 dias entram como REFERÊNCIA DE VOLUME da
 *          operação, não como promessa de garantia — o número da garantia
 *          (1 milhão de views) não aparece aqui.
 * [x]  6. Intenção própria: o mapa do formato. A execução é do guia
 *          `/guias/como-fazer-videos-curtos-que-prendem`; a definição em inglês
 *          é do verbete `/glossario/short-form`.
 * [x]  7. Incremental: a inversão "não escolhe, recebe" e a regra
 *          "baixou, publicou" com o motivo dela.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Hub: envia contextuais e recebe do cluster.
 * [x] 10. Não é comparativo; ainda assim manda para o comparativo de redes em
 *          vez de decidir por quem lê.
 * [x] 11. CTA único, no fim.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "baixou, publicou", "vertical, legendado, no
 *          formato do feed", "operação", "viralizar".
 * [x] 14. Publicaria sem Google: sim — a lista de decisões de formato é o que
 *          eu passaria para alguém antes da primeira gravação.
 * ────────────────────────────────────────────────────────────────────────── */
