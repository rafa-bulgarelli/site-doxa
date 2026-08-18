import type { Pagina } from '../../tipos';

/**
 * A regra `RT-1` virada em guia de execução: um arquivo, três redes, no mesmo
 * dia — e o que precisa ser verdade no arquivo para isso funcionar.
 *
 * Fronteira com as vizinhas: `/comparativos/tiktok-vs-instagram` decide ENTRE
 * as redes e é dono do bloco "a expectativa muda de rede para rede";
 * `/plataformas/youtube-shorts-para-empresas` é a página COMERCIAL da terceira
 * rede; `/solucoes/videos-curtos-para-empresas` é dona do bloco "baixou,
 * publicou". Esta página é a única que trata da PEÇA: exportação, área segura,
 * marca-d'água e leitura de três números que não são comparáveis entre si.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o mesmo arquivo nas três redes — Instagram, TikTok e YouTube Shorts —, no
 *    mesmo dia → `docs/seo/source-of-truth.md` §8, regra `RT-1`, fonte:
 *    `supabase/manual-seed-v1.sql:183`; as três redes em `:84`. É condição de
 *    quem já é cliente da Doxa, e a página diz isso;
 *  · views SOMADAS entre as três redes → §3(c), fonte:
 *    `supabase/manual-seed-v1.sql:84`; sempre com a ressalva "conforme as
 *    condições e o prazo do contrato";
 *  · entregável vertical, legendado, no formato do feed → §2, fonte:
 *    `src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`;
 *  · 24 horas de relógio entre publicações → §8, regra `RH-1`, fonte:
 *    `supabase/manual-seed-v1.sql:205-207`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * A área segura e a marca-d'água são mecânica observável de interface, escritas
 * como régua de trabalho e não como número de plataforma: não há, no
 * repositório, fonte citável para porcentagem de tela de nenhuma das três.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-usar-o-mesmo-video-nas-tres-redes',
  titulo: 'Como usar o mesmo vídeo no TikTok, no Reels e no Shorts',
  descricao:
    'Um arquivo serve às três redes se ele for exportado para a mais exigente. Área segura, marca-d’água, ordem de publicação e como ler três números diferentes.',
  h1: 'Como usar o mesmo vídeo nas três redes',
  resumo:
    'Um vídeo vertical bem exportado serve ao TikTok, ao Reels e ao YouTube Shorts sem nenhuma nova edição — o que quebra a jogada não é a rede, é o arquivo: legenda encostada na borda, marca-d’água de outra plataforma, capa que só existe num lugar. Abaixo, o que precisa ser verdade no arquivo, em que ordem publicar e como ler três números que não se comparam entre si.',
  intencao: 'informacional',
  palavrasChave: [
    'mesmo vídeo nas três redes',
    'publicar o mesmo vídeo no tiktok e reels',
    'reaproveitar vídeo vertical',
    'área segura vídeo vertical',
    'marca d água tiktok no instagram',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/comparativos/tiktok-vs-instagram',
    '/plataformas/youtube-shorts-para-empresas',
    '/guias/como-medir-resultado-de-conteudo-organico',
    '/guias/como-crescer-no-youtube-shorts',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a distribuição nas três redes já está resolvida e o que falta é volume de peça para publicar nelas, conte o que a sua empresa precisa por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que um arquivo só resolve as três',
    },
    {
      tipo: 'paragrafo',
      texto:
        'As três redes pedem a mesma coisa: vídeo vertical, curto, distribuído por recomendação para gente que não segue o perfil. Isso torna a peça intercambiável de verdade — o mesmo arquivo entra nas três sem nova edição, e por isso ampliar a distribuição não cobra nada da produção.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que muda de uma rede para a outra é o que cada uma faz com o vídeo depois, e essa parte tem página própria em [TikTok ou Instagram](/comparativos/tiktok-vs-instagram). Aqui o assunto é anterior: como sair do editor com um arquivo que não precise ser tocado de novo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Exporte uma vez, para a mais exigente',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A regra que economiza retrabalho é exportar sempre pensando na rede que cobre mais tela com botões, e não na que você usa mais. Um arquivo que sobrevive à interface mais invasiva sobrevive às outras duas. O que ele precisa ter:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Vertical de ponta a ponta**, sem barra preta e sem recorte de material horizontal.',
        '**Legenda embutida no arquivo**, e não a legenda automática da plataforma — a automática não viaja junto quando o vídeo sai de um lugar para o outro, e some se o arquivo for reexportado.',
        '**Nada de informação nas bordas**: nem legenda, nem logo, nem número de telefone, nem texto de apoio.',
        '**Sem marca-d’água de rede nenhuma**, inclusive a sua.',
        '**Uma capa escolhida por você**, e não o primeiro quadro sorteado pela rede.',
        '**Áudio próprio no arquivo.** Trilha adicionada por dentro de uma rede não existe nas outras duas.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A área segura, na prática',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Cada rede desenha a própria interface por cima do vídeo — legendas do sistema, nome do perfil, botões de ação, barra de progresso — e nenhuma das três põe essas coisas exatamente no mesmo lugar. O resultado é conhecido: a legenda que ficava perfeita no editor aparece cortada pela metade num app e coberta pelos botões no outro.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A régua conservadora que funciona nas três é simples de aplicar e não depende de decorar número de plataforma nenhuma: **deixe a faixa de cima e a de baixo do quadro completamente vazias, e mantenha a coluna da direita livre**. Todo o texto vive no miolo. Depois de exportar, faça o teste que ninguém faz: publique como rascunho ou visualização em cada uma das três e olhe no celular, com o app aberto, antes de publicar de verdade.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'O erro mais caro dessa etapa não é estético. Legenda coberta pela interface é informação que ninguém leu, num formato que costuma ser consumido sem som — e o vídeo perde exatamente na parte que ele tinha para dizer.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A marca-d’água entrega o vídeo antes do conteúdo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O caminho mais tentador é o pior: publicar numa rede, baixar de lá o arquivo pronto e subir nas outras duas. O que desce do botão de download costuma vir com o selo da rede de origem, com o nome do perfil animado por cima da imagem e com qualidade menor do que a do original. Quem assiste identifica na hora que aquilo veio de outro lugar, e conteúdo com cara de reaproveitado tende a ser tratado como reaproveitado.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A correção é organizacional, não técnica: **o arquivo mestre sai do editor e vai para uma pasta**, e é dessa pasta que saem as três publicações. Nenhuma delas usa a outra como fonte. Vale para a capa também — a mesma imagem, subida à mão nos três lugares.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O mesmo dia, e o intervalo por rede',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Publicar a peça nas três no mesmo dia mantém a operação simples e a comparação honesta: um vídeo, uma data, três resultados. O horário não precisa ser o mesmo.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que precisa ser respeitado é o intervalo **dentro de cada rede** — e vale o mesmo que está em [como viralizar no TikTok](/guias/como-viralizar-no-tiktok): dois vídeos publicados perto demais no mesmo perfil competem entre si ali. A régua de 24 horas de relógio entre uma publicação e a próxima naquele perfil é a que a Doxa combina com quem já é cliente, e ela se copia sem contratar nada. Publicar em três redes não conta como três vídeos; conta como um, três vezes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Três números que não se comparam entre si',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A parte que confunde vem depois: a mesma peça devolve resultados muito diferentes nas três, e a tentação é concluir que duas delas "não funcionam". A leitura correta desses números é assunto de [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico); o que vale registrar aqui são os quatro cuidados de quem publica em três lugares de uma vez.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Compare cada rede com ela mesma.** O vídeo de terça contra o de quinta, no mesmo perfil, é a única comparação limpa.',
        '**Olhe a fatia de quem não segue o perfil** em cada uma. É o recorte que mostra se a peça está encontrando gente nova ou circulando entre conhecidos.',
        '**Não desligue a rede que rende menos** antes de um trimestre inteiro. Ela é a que custa menos para manter — o arquivo já existe.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que fazer com esses números depois de coletados está em [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'É esse o desenho da operação da Doxa, e é condição de quem já é cliente: o mesmo arquivo publicado nas três redes — Instagram, TikTok e YouTube Shorts —, no mesmo dia, com as visualizações somadas entre elas, conforme as condições e o prazo do contrato. O que chega à empresa é o vídeo pronto para postar, vertical e legendado; quem publica é ela, nos perfis dela.',
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
          pergunta: 'A rede reduz o alcance de um vídeo que veio de outra plataforma?',
          resposta:
            'O que se vê é mais simples do que a teoria: o arquivo baixado de outra rede vem com selo, com o nome de outro perfil em cima da imagem e com qualidade menor, e quem assiste percebe. Antes de discutir distribuição, portanto, o problema é do arquivo — e ele some quando a peça sai do editor em vez de sair do botão de download.',
        },
        {
          pergunta: 'Preciso escrever uma descrição diferente em cada rede?',
          resposta:
            'O arquivo é o mesmo; o campo de texto ao lado dele não precisa ser. Vale escrever uma versão por rede porque cada uma usa esse campo de um jeito: no YouTube ele é lido por quem chega pela busca, e nas outras duas ele funciona mais como legenda de apoio. É o único item da publicação que compensa personalizar, e leva menos de um minuto.',
        },
        {
          pergunta: 'Posso publicar em dias diferentes em cada rede para render mais?',
          resposta:
            'Pode, mas você perde a comparação: com datas diferentes, deixa de dar para saber se a diferença de resultado veio da rede ou do dia. Manter a mesma data não custa nada e transforma cada peça num teste com três leituras.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O teste de cinco minutos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Pegue o seu último vídeo publicado e abra-o nas três redes, no celular, uma de cada vez. Anote onde a legenda encosta na interface, se aparece selo de alguma plataforma e se a capa é a mesma nos três lugares. Resposta ruim em uma delas é problema do arquivo — e o conserto vale para todos os próximos.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: um arquivo serve às três; o que quebra é
 *          o arquivo, não a rede.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §3, §8).
 * [x]  3. Nada da §9: sem preço, prazo, fidelidade, direitos do vídeo.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. Os números do contrato (três redes, views somadas) vêm com "conforme
 *          as condições e o prazo do contrato".
 * [x]  6. Intenção própria: a PEÇA em três redes. A escolha entre redes é de
 *          /comparativos/tiktok-vs-instagram; "baixou, publicou" é de
 *          /solucoes/videos-curtos-para-empresas; a cadência é de
 *          /guias/como-viralizar-no-tiktok (uma frase + LINK no corpo); a
 *          leitura dos números é de /guias/como-medir-resultado-de-conteudo-
 *          organico (uma frase + LINK).
 * [x]  7. Incremental: a régua de área segura, a pasta como arquivo mestre e a
 *          leitura de três números não comparáveis. Nada disso está na SERP.
 * [x]  8. title (61 caracteres), description e H1 exclusivos; H2 em hierarquia.
 * [x]  9. Hub /guias/videos-curtos; links contextuais, nenhum decorativo.
 * [x] 10. Não é comparativo; admite que a mesma peça rende diferente nas três
 *          e desaconselha desligar a rede que rende menos cedo demais.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "views somadas", "pronto para postar",
 *          "vertical, legendado, no formato do feed".
 * [x] 14. Teste final (§45): sim — é o checklist que eu passaria por cima do
 *          ombro de quem está exportando.
 * ────────────────────────────────────────────────────────────────────────── */
