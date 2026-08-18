import type { Pagina } from '../../tipos';

/**
 * O guia de execução do cluster de Instagram. Ele fica com o método de
 * crescimento; a dor `/guias/como-aumentar-o-alcance-organico` fica com o
 * diagnóstico de queda, e o verbete com a definição da métrica.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · zero impulsionamento nos perfis com a estratégia ativa, inclusive em
 *    publicações que não são da operação, com pausa de campanhas antigas antes
 *    da primeira publicação → fonte: `docs/seo/source-of-truth.md` §8
 *    (`supabase/manual-seed-v1.sql:241`);
 *  · engajamento artificial (seguidores, curtidas, views, comentários) contamina
 *    resultados, viola a metodologia e pode gerar penalização das redes →
 *    fonte: §8 (`supabase/manual-seed-v1.sql:287`);
 *  · comentários não devem ser limitados nem desativados; ofensivos podem ser
 *    excluídos → fonte: §8 (card 004, linhas 523-529);
 *  · no máximo um vídeo por dia útil, sem compensar acumulando, com 24 horas de
 *    relógio entre publicações → fonte: §8, regras `RT-2` e `RH-1`. O bloco
 *    completo pertence a `/guias/como-viralizar-no-tiktok`: aqui ficam duas
 *    linhas e o link, para não duplicar a mesma explicação em dois guias;
 *  · de segunda a sexta os únicos vídeos curtos nos perfis participantes são os
 *    da operação; fotos, carrosséis e stories seguem liberados; no fim de semana
 *    o cliente pode publicar vídeos próprios → fonte: §8 (card 004, 445-463);
 *  · 60 conteúdos únicos em 90 dias, o mesmo arquivo nas três redes → fonte: §8,
 *    regra `RT-1`;
 *  · views das metas 100% orgânicas, sem compra de mídia → fonte: §8
 *    (`src/components/faq/config.ts:174-175`);
 *  · retorno em até 24 horas e auditoria estratégica → fonte: §2.
 *
 * O resto é mecânica pública do aplicativo — Reels como superfície de
 * descoberta, perfil como página de decisão, salvamento e mensagem como sinais.
 * Nenhum número de plataforma aparece: não há fonte citável para nenhum.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-crescer-no-instagram-organicamente',
  titulo: 'Como crescer no Instagram organicamente sem impulsionar',
  descricao:
    'Crescer no Instagram sem verba tem método: Reels como porta de entrada, perfil que decide em três segundos, cadência controlada e a métrica certa para medir.',
  h1: 'Como crescer no Instagram organicamente',
  resumo:
    'Crescer no Instagram sem impulsionar depende de três coisas que não são o número de seguidores: quantas contas que ainda não seguem você foram alcançadas, o que elas encontram quando abrem o perfil e com que regularidade você aparece de novo. Abaixo, o método por trás dessas três, os atalhos que cobram caro e o que olhar toda semana.',
  intencao: 'informacional',
  palavrasChave: [
    'crescer no instagram organicamente',
    'ganhar seguidores sem pagar',
    'alcance orgânico no instagram',
    'crescer com reels',
    'instagram sem impulsionar',
  ],
  hubs: ['/guias/reels-no-instagram'],
  relacionadas: [
    '/guias/como-aumentar-o-alcance-organico',
    '/glossario/alcance-organico',
    '/plataformas/instagram-reels-para-empresas',
    '/comparativos/tiktok-vs-instagram',
    '/guias/como-fazer-videos-curtos-que-prendem',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o método está claro e o que falta é produzir com constância, conte quantos vídeos a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Escolha a métrica certa antes de escolher a tática',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Seguidor é a métrica mais fácil de olhar e a mais fácil de fabricar, e por isso ela é a pior para guiar decisão. O que sustenta crescimento de um perfil de empresa são três números que quase ninguém acompanha: quantas **contas que ainda não seguem** foram alcançadas na semana, quantas pessoas **salvaram ou enviaram** um conteúdo a alguém, e quantas **conversas** começaram por causa de uma publicação.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A lógica é simples de justificar. Alcance de não seguidores diz se você está sendo descoberto; salvamento e envio dizem se o conteúdo é útil o suficiente para ser guardado ou repassado; conversa diz se algo daquilo se transforma em negócio. Seguidores são consequência dos três — e um perfil pode ganhar seguidores sem melhorar nenhum deles, o que é exatamente o quadro de quem cresce e não vende. A definição formal da métrica está em [alcance orgânico](/glossario/alcance-organico).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Reels é a porta; o perfil é a decisão',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O vídeo curto é hoje a superfície do Instagram que entrega conteúdo para quem não segue. É por ali que uma conta nova é descoberta — e é por isso que um perfil que só publica foto e carrossel cresce devagar, mesmo publicando bem: ele fala quase só com quem já está lá.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que acontece depois do vídeo, porém, é decidido no perfil. A pessoa assiste, abre o perfil e leva alguns segundos para responder a uma pergunta: "isso aqui é para mim?". Se a resposta não estiver visível sem rolar, ela sai. Nome, descrição, primeiros conteúdos visíveis e destaques são a página de decisão de um perfil de empresa — e costumam estar desatualizados justamente nos perfis que acabaram de começar a crescer.',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Diga para quem você fala, no lugar mais visível',
          texto:
            'A descrição do perfil não é espaço para slogan: é onde se escreve o que a empresa resolve e para quem. Quem chegou pelo vídeo precisa se reconhecer ali em uma linha.',
        },
        {
          titulo: 'Deixe as três primeiras posições coerentes',
          texto:
            'Os conteúdos que aparecem primeiro funcionam como vitrine. Se os três forem sobre assuntos diferentes, o visitante não consegue prever o que vai receber ao seguir — e não segue.',
        },
        {
          titulo: 'Publique com regularidade previsível',
          texto:
            'Regularidade vale mais que volume irregular. Três vídeos por semana, toda semana, rendem mais do que doze num mês e nenhum no seguinte, porque a segunda opção não gera comparação possível entre as peças.',
        },
        {
          titulo: 'Responda quem falou com você',
          texto:
            'Comentário e mensagem são onde a relação vira negócio. Um comentário respondido no mesmo dia também mantém a publicação viva por mais tempo, e não custa nada além de atenção.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um aviso de cadência cabe aqui, e o resto dele está em outro lugar: dois vídeos publicados com poucas horas de diferença disputam a mesma audiência, e o intervalo de 24 horas de relógio entre um e o próximo protege o alcance do que ainda está rodando. A regra inteira, com o exemplo e a razão de ela existir, está em [como viralizar no TikTok](/guias/como-viralizar-no-tiktok) — e vale igual aqui, porque a disputa é entre as suas peças, não entre as redes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os atalhos que cobram caro',
    },
    {
      tipo: 'lista',
      itens: [
        '**Seguir e deixar de seguir em massa.** Rende número e não rende audiência: quem seguiu de volta por reciprocidade não assiste, e um público que não assiste piora o desempenho de cada vídeo novo.',
        '**Repostar conteúdo genérico de terceiros.** Enche o calendário e não constrói nada: nada ali é seu, e o perfil vira mural de frases que a audiência já viu em outros dez lugares.',
        '**Deixar o perfil desatualizado enquanto o alcance cresce.** Descrição antiga, destaques de uma campanha encerrada, link quebrado. É o único atalho desta lista que custa venda no mesmo dia em que um vídeo vai bem.',
        '**Trocar de assunto toda semana.** Um perfil que fala de tudo não é lembrado por nada, e quem chega pelo vídeo não consegue prever o que vai receber ao seguir.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Os dois atalhos mais caros não são específicos do Instagram e por isso ficam em outras páginas: comprar engajamento — que contamina a leitura e pode gerar penalização das redes — está entre [os erros que derrubam o alcance de um perfil](/guias/como-viralizar-no-tiktok), e impulsionar a publicação que está sendo medida como orgânica está em [orgânico ou pago](/comparativos/organico-vs-pago).',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Todo atalho de engajamento tem o mesmo custo escondido: ele mente para você. Depois de comprar número, nenhum relatório do perfil serve para decidir o que produzir na semana seguinte — e essa decisão é a única coisa que faz o perfil crescer.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que olhar toda semana',
    },
    {
      tipo: 'lista',
      itens: [
        '**Alcance de contas que não seguem**, na semana, comparado com a semana anterior. É o termômetro de descoberta.',
        '**Salvamentos e envios por publicação.** Dizem o que a audiência considerou útil o bastante para guardar ou repassar.',
        '**Retenção dos vídeos**, para separar o que prende do que só foi entregue. Um vídeo com alcance alto e retenção baixa foi mostrado, não assistido.',
        '**Conversas iniciadas.** É a métrica que liga o perfil ao caixa, e a única que o time comercial reconhece.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Compare sempre o perfil com ele mesmo, nunca com o de outra empresa: audiência, histórico e nicho diferentes tornam a comparação externa inútil. Se os números caíram de forma generalizada, o problema é de diagnóstico e está tratado em [como aumentar o alcance orgânico](/guias/como-aumentar-o-alcance-organico); se o problema é a peça, ele está em [como fazer vídeos curtos que prendem](/guias/como-fazer-videos-curtos-que-prendem).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Na Doxa, esse método é a própria operação: 60 conteúdos únicos em 90 dias, um por dia útil, o mesmo arquivo publicado no Instagram, no TikTok e no YouTube Shorts, sem impulsionamento em nenhum deles — as visualizações contabilizadas nas metas são 100% orgânicas. Quem publica é o cliente, no perfil dele.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Perguntas frequentes',
    },
    {
      tipo: 'faq',
      itens: [
        {
          pergunta: 'Preciso publicar stories todo dia?',
          resposta:
            'Stories falam com quem já segue e não são o motor de descoberta do perfil — quem não conhece a marca chega pelo vídeo, não pelo story. Eles servem para manter a relação viva e para testar assunto a custo baixo, e um ritmo diário ali é opcional. O que não pode oscilar é a regularidade do vídeo, que é o que traz gente nova.',
        },
        {
          pergunta: 'Hashtag ainda ajuda a crescer no Instagram?',
          resposta:
            'Hashtag tende a funcionar como classificação do assunto, e não é ela que decide a entrega — o que decide é o que a audiência faz com o vídeo. Um punhado de termos realmente relacionados ao tema basta; blocos de trinta hashtags genéricas não compram alcance e deixam a legenda pior de ler.',
        },
        {
          pergunta: 'O feed precisa ser bonito para o perfil crescer?',
          resposta:
            'Coerência pesa mais do que estética. Quem chega pelo vídeo abre o perfil para responder se aquilo é para ele, e essa resposta vem do assunto das primeiras publicações e da descrição, não da paleta de cores. Feed impecável e assunto disperso é a combinação que faz um perfil ganhar visitas e não ganhar seguidores.',
        },
        {
          pergunta: 'Quantos seguidores são suficientes para começar a vender?',
          resposta:
            'Não existe um número, e é por isso que esta página mede outra coisa: o que costuma preceder a venda é conversa iniciada. Perfis pequenos com audiência certa conversam mais do que perfis grandes com audiência genérica — e uma base inflada por sorteio ou por seguidor comprado atrasa a venda em vez de antecipá-la.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde começar esta semana',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Reescreva a descrição do perfil para dizer o que você resolve e para quem, confira se há dois vídeos publicados a menos de 24 horas um do outro e escolha o assunto que você consegue defender em quatro vídeos diferentes na semana que vem. São três horas de trabalho e resolvem mais do que qualquer mudança de horário de postagem.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: as três coisas de que o crescimento
 *          depende, e nenhuma delas é o número de seguidores.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (cadência, zero
 *          impulsionamento, engajamento artificial, comentários, 60/90 dias,
 *          views 100% orgânicas, 24 horas).
 * [x]  3. Nada da §9: sem preço, sem promessa de prazo, sem número de rede.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada; o que aparece é a rotina de publicação.
 * [x]  6. Intenção própria: método de crescimento. A dor cuida do diagnóstico
 *          de queda, o verbete da definição, a plataforma do lado comercial.
 * [x]  7. Informação incremental: as quatro métricas semanais e a página de
 *          decisão do perfil. A cadência (RT-2/RH-1) é do guia de TikTok e aqui
 *          aparece em duas linhas com link — um dono por bloco.
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de Reels; links para a dor, o verbete, a plataforma, o
 *          comparativo de redes e o guia de execução da peça.
 * [x] 10. Não é comparativo; ainda assim recusa o atalho fácil (impulsionar) e
 *          nomeia o que não funciona.
 * [x] 11. CTA único, no fim, condicionado à produção.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "60 conteúdos", "views orgânicas", "quem publica
 *          é o cliente".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
