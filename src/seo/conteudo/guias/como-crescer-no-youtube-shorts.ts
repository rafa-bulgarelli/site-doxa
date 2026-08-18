import type { Pagina } from '../../tipos';

/**
 * O guia informacional da terceira rede.
 *
 * Fronteira com a vizinha: `/plataformas/youtube-shorts-para-empresas` é a
 * página COMERCIAL — "o canal que fica pela metade", o que o YouTube tem que as
 * outras duas não têm, quando o Shorts não deveria ser o primeiro passo. Esta
 * é de EXECUÇÃO, e o eixo dela não existe lá: as duas superfícies (o feed de
 * Shorts e o canal) fazem trabalhos diferentes, e o título é lido — o que muda
 * a forma de escrever. `/guias/como-usar-o-mesmo-video-nas-tres-redes` é dona
 * do arquivo; `/guias/como-medir-resultado-de-conteudo-organico`, da medição.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · YouTube Shorts é uma das três redes da operação, com views SOMADAS entre
 *    elas → `docs/seo/source-of-truth.md` §2 e §3(c), fonte:
 *    `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21` — sempre com
 *    a ressalva "conforme as condições e o prazo do contrato";
 *  · o mesmo arquivo nas três redes, no mesmo dia → §8, regra `RT-1`, fonte:
 *    `supabase/manual-seed-v1.sql:183`;
 *  · entregável vertical, legendado, no formato do feed, publicado pelo
 *    cliente → §2, fonte: `src/components/HowItWorks.tsx:92`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * NENHUM número de audiência do YouTube aparece aqui — nem de usuários, nem de
 * visualizações diárias, nem de crescimento da plataforma. São estatísticas de
 * terceiro sem fonte citável no repositório, e a página foi escrita para não
 * precisar de nenhuma.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-crescer-no-youtube-shorts',
  titulo: 'Como crescer no YouTube Shorts: o feed e o canal',
  descricao:
    'No Shorts existem duas superfícies com trabalhos diferentes, e o título é lido por quem busca. O que muda na escrita, nos primeiros trinta vídeos e no canal.',
  h1: 'Como crescer no YouTube Shorts',
  resumo:
    'Crescer no Shorts é fazer duas coisas que parecem uma só: ser recomendado no feed, que se comporta como o das outras redes de vídeo curto, e transformar quem assistiu em audiência do canal, que é uma superfície diferente com regras próprias. Quem cuida só da primeira acumula visualizações sem público; quem cuida só da segunda arruma um canal bonito que ninguém encontra.',
  intencao: 'informacional',
  palavrasChave: [
    'como crescer no youtube shorts',
    'youtube shorts dicas',
    'ganhar inscritos com shorts',
    'título de shorts',
    'canal de shorts',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/plataformas/youtube-shorts-para-empresas',
    '/guias/como-usar-o-mesmo-video-nas-tres-redes',
    '/guias/como-medir-resultado-de-conteudo-organico',
    '/glossario/short-form',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a terceira rede já está no plano e o gargalo é produzir vídeo vertical com constância para as três, conte o que a sua empresa precisa por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Duas superfícies, dois trabalhos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O feed de Shorts funciona como os outros feeds de vídeo curto: a peça é oferecida a um grupo pequeno, e o que esse grupo faz com ela decide se a entrega cresce. Nada de novo — hook, retenção e ritmo valem igual. O canal é outra coisa: ele é uma página, com nome, descrição, seções e histórico, e é lá que alguém decide se quer receber os próximos vídeos.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A consequência prática é que os dois trabalhos são independentes. Um Short pode alcançar muita gente e não converter ninguém, porque o canal não deu motivo; e um canal bem-arrumado não recebe visita se nenhuma peça é recomendada. Crescer, aqui, é fechar as duas pontas — e é a segunda que costuma ficar de fora.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O título é lido, e isso muda a escrita',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a diferença mais concreta em relação às outras duas redes: no YouTube o título é um campo visível, que aparece junto do vídeo e é o texto que a busca da plataforma encontra. Nas outras redes, a legenda é apoio; aqui, o título é porta de entrada — e continua sendo porta meses depois, quando a peça já saiu de circulação no feed.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Escreva o título como pergunta ou afirmação**, do jeito que uma pessoa digitaria. "Por que o joelho dói ao correr" encontra gente; "Dica #14" não encontra ninguém.',
        '**Repita no título a promessa do vídeo**, e não o nome da série. Numeração é organização interna, não informação.',
        '**Use o campo de descrição** para uma frase que situe o assunto. É o único dos três lugares em que ela é lida por quem chegou de propósito.',
        '**Não copie a legenda do TikTok.** Aquele texto foi escrito para ser visto sob o vídeo, não para responder a uma busca.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Como o título continua encontrável depois, o Shorts é a única das três redes em que vale gastar dois minutos por peça escrevendo esse campo — e é o único trabalho adicional real de publicar ali.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que fazer com os primeiros trinta vídeos',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Suba o que você já produziu, um por dia',
          texto:
            'Se a sua empresa já publica vertical em outra rede, o acervo existe. O arquivo é o mesmo — a exportação limpa está em [como usar o mesmo vídeo nas três redes](/guias/como-usar-o-mesmo-video-nas-tres-redes) — e o custo é de upload, não de produção.',
        },
        {
          titulo: 'Escreva um título de busca para cada um',
          texto:
            'Trinta títulos que respondem a trinta perguntas diferentes. É esse conjunto, e não o volume em si, que faz o canal começar a aparecer para quem procura o assunto.',
        },
        {
          titulo: 'Agrupe por tema em playlists',
          texto:
            'Playlist é a estrutura que transforma uma lista de vídeos avulsos em algo que se parece com um lugar. Ela também dá ao visitante um segundo vídeo para assistir, que é o momento em que a inscrição costuma acontecer.',
        },
        {
          titulo: 'Só então olhe os números',
          texto:
            'Antes de trinta peças, qualquer conclusão é sobre ruído. Depois delas, a leitura útil é por título e por tema — quais assuntos continuaram recebendo visualização depois da primeira semana.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Três erros que travam um canal',
    },
    {
      tipo: 'lista',
      itens: [
        '**Subir o arquivo baixado de outra rede.** Ele vem com selo, com nome de outro perfil em cima da imagem e com qualidade menor. Quem assiste percebe em meio segundo, e o canal inteiro passa a parecer um espelho.',
        '**Publicar em lote depois de semanas parado.** Vale o mesmo que nas outras redes: peças publicadas perto demais disputam a mesma audiência. Uma por dia rende mais do que dez num sábado.',
        '**Deixar o canal sem resposta.** Nome genérico, descrição vazia, nenhuma seção organizada: a pessoa que gostou do vídeo chega, não entende o que é aquilo, e sai. Foi alcance conquistado e desperdiçado na porta.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que os números demoram mais aqui',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Duas coisas atrasam a leitura no Shorts. A primeira é que uma peça pode continuar recebendo visualização bem depois da estreia, o que faz o resultado de uma semana mudar na semana seguinte. A segunda é que inscritos são um indicador atrasado por natureza: a pessoa costuma assistir a vários vídeos antes de decidir. Comparar mês a mês, e não dia a dia, é o que evita conclusão errada — o resto da rotina de medição está em [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'O YouTube Shorts é uma das três redes da operação da Doxa, ao lado do Instagram e do TikTok, e a meta é de views somadas entre elas — conforme as condições e o prazo do contrato. É por isso que a rotina combinada com quem já é cliente prevê o mesmo arquivo nas três, no mesmo dia: deixar uma de fora não muda só o alcance dela, muda a conta inteira.',
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
          pergunta: 'Preciso ter vídeos longos no canal para os Shorts renderem?',
          resposta:
            'Não é pré-requisito: o feed de Shorts distribui a peça curta por conta própria, e um canal só de vídeos curtos funciona. O vídeo longo entra em outra conta — ele dá para quem gostou do curto um lugar onde ficar mais tempo, o que costuma ajudar na decisão de se inscrever. Como ele custa muito mais para produzir, é uma escolha posterior, não um começo.',
        },
        {
          pergunta: 'Vale publicar Shorts num canal que já tem outro assunto?',
          resposta:
            'Vale se os dois assuntos compartilham o mesmo público; se não compartilham, o canal fica difícil de entender e a pessoa que chegou por um tema não sabe se quer os outros. Quando os temas são realmente distantes, separar em dois canais custa pouco e resolve — o material antigo não precisa sair do ar em nenhum dos casos.',
        },
        {
          pergunta: 'Quantos inscritos são necessários para começar a aparecer?',
          resposta:
            'Nenhum. O feed de Shorts é de recomendação, o que significa que a peça é oferecida a quem não conhece o canal desde o primeiro dia — e é justamente por isso que o número de inscritos é o último indicador a se mexer. Ele é consequência do trabalho, não condição para começá-lo.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que fazer hoje',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra o canal da sua empresa e olhe três coisas: a descrição diz o que é aquilo em uma frase? Os últimos títulos são perguntas que alguém digitaria? Existe alguma playlist? Se as três respostas forem não, o trabalho da semana não é gravar nada novo — é arrumar a porta por onde o alcance que você já tem está passando reto.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: são duas superfícies com trabalhos
 *          diferentes, e é preciso fechar as duas pontas.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §3, §8).
 * [x]  3. Nada da §9; nenhum número de audiência do YouTube em lugar nenhum.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. Views somadas nas três redes com "conforme as condições e o prazo do
 *          contrato".
 * [x]  6. Intenção própria: execução no Shorts. A página COMERCIAL da rede é
 *          /plataformas/youtube-shorts-para-empresas e continua dona de "o
 *          canal que fica pela metade" e de "quando o Shorts não é o primeiro
 *          passo"; nenhum bloco dela é repetido.
 * [x]  7. Incremental: as duas superfícies, o título como campo de busca e o
 *          plano dos primeiros trinta vídeos.
 * [x]  8. title (46 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/videos-curtos; links contextuais úteis.
 * [x] 10. Não é comparativo; diz que vídeo longo não é pré-requisito e que
 *          inscritos são consequência, em vez de vender atalho.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "views somadas", "vertical", "operação".
 * [x] 14. Teste final (§45): sim — é o que eu faria no canal de uma empresa
 *          que já publica nas outras duas redes.
 * ────────────────────────────────────────────────────────────────────────── */
