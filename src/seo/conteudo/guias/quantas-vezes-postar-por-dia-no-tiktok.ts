import type { Pagina } from '../../tipos';

/**
 * A pergunta direta, respondida na primeira frase.
 *
 * Fronteira com a vizinha: `/guias/como-viralizar-no-tiktok` é o DONO do bloco
 * de cadência — o mecanismo (a distribuição continua por horas, o vídeo
 * seguinte disputa a mesma audiência) está lá, e aqui aparece resumido em duas
 * frases com link. O que esta página tem de próprio é o resto da pergunta: o
 * que entra na conta, o que fazer depois de já ter publicado dois, e os três
 * casos em que duas publicações no mesmo dia se justificam.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · no máximo um vídeo por dia útil, sem compensar publicando vários no mesmo
 *    dia, porque "dois vídeos no mesmo dia disputam o mesmo espaço e um
 *    atropela o alcance do outro" → `docs/seo/source-of-truth.md` §8, regra
 *    `RT-2`, fonte: `supabase/manual-seed-v1.sql:187-191`;
 *  · o intervalo de 24 horas de RELÓGIO, com o exemplo da segunda às 22h → §8,
 *    regra `RH-1`, fonte: `supabase/manual-seed-v1.sql:205-207`;
 *  · a regra vale para vídeo curto: fotos, carrosséis e stories seguem
 *    liberados de segunda a sexta → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:445-451`;
 *  · sábado e domingo o cliente pode publicar vídeos curtos próprios, mesmo a
 *    menos de 24 h de um vídeo da Doxa → §8, fonte:
 *    `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:457-463`;
 *  · 60 conteúdos únicos em 90 dias, um por dia útil → §2 e §8, regra `RT-1`,
 *    fonte: `supabase/manual-seed-v1.sql:179,183`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * Todas essas regras são condição de quem já é cliente da Doxa, e a página diz
 * isso onde as cita. Nenhum número de plataforma entra aqui: o TikTok não
 * publica limite de frequência, e inventar um seria afirmar por ele.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'quantas-vezes-postar-por-dia-no-tiktok',
  titulo: 'Quantas vezes postar por dia no TikTok: a resposta curta',
  descricao:
    'Um vídeo por dia, com pelo menos 24 horas de relógio até o próximo. O que entra nessa conta, o que fazer se você já publicou dois e as exceções reais.',
  h1: 'Quantas vezes postar por dia no TikTok',
  resumo:
    'Um vídeo por dia, e nunca dois com menos de 24 horas de intervalo. Não é uma regra da plataforma: é consequência de como um vídeo é distribuído — o segundo é oferecido para a mesma audiência que ainda estava recebendo o primeiro, e um atropela o alcance do outro. Abaixo, o que entra nessa conta, o que fazer se você já publicou dois hoje e as três exceções que existem de verdade.',
  intencao: 'informacional',
  palavrasChave: [
    'quantas vezes postar por dia no tiktok',
    'quantos vídeos por dia no tiktok',
    'frequência de postagem tiktok',
    'intervalo entre postagens',
    'postar duas vezes por dia',
  ],
  hubs: ['/guias/marketing-no-tiktok'],
  relacionadas: [
    '/guias/marketing-no-tiktok',
    '/guias/como-viralizar-no-tiktok',
    '/guias/como-postar-todos-os-dias-sem-equipe',
    '/glossario/algoritmo-do-tiktok',
    '/guias/como-produzir-60-videos-em-90-dias',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a frequência está clara e o problema é sustentar um vídeo por dia útil todo mês, conte quanto a sua empresa precisa publicar. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que o segundo vídeo do dia custa caro',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A distribuição de um vídeo não termina quando você publica: ela continua por horas, enquanto a plataforma vai oferecendo a peça a levas sucessivas de pessoas. Publicar de novo nesse meio-tempo coloca o vídeo novo na frente da mesma audiência que ainda estava recebendo o anterior — e os dois passam a disputar o mesmo espaço. O mecanismo completo está em [como viralizar no TikTok](/guias/como-viralizar-no-tiktok); a consequência prática é esta página.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O intervalo que resolve é de **24 horas de relógio, não de calendário**. Se um vídeo saiu na segunda-feira às 22h, o próximo só a partir das 22h de terça — publicar às 9h de terça é publicar onze horas depois, com o primeiro ainda em circulação.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Isso não vale só para o TikTok: as três redes de vídeo curto distribuem por recomendação, e a régua de um por dia por perfil vale igual no Reels e no YouTube Shorts.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que entra na conta e o que não entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A régua é sobre vídeo curto no feed de recomendação, e só sobre isso. Confundir os formatos faz gente deixar de publicar coisas que não competiam com nada:',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Formato', 'Entra na conta?'],
      linhas: [
        ['Vídeo curto publicado no perfil', 'Sim — é exatamente o que a régua limita'],
        ['Stories', 'Não; eles vivem em outra superfície'],
        ['Foto e carrossel', 'Não competem pelo mesmo espaço de recomendação'],
        ['Live', 'Não é peça de feed, e a distribuição dela é própria'],
        ['Repost de vídeo de outra pessoa', 'Não conta como publicação sua, mas ocupa a sua audiência'],
        ['O mesmo vídeo publicado em outra rede', 'Não; a conta é por perfil, em cada rede'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A última linha costuma ser a que mais alivia: publicar a mesma peça no TikTok, no Reels e no Shorts no mesmo dia é um vídeo, três vezes, e não três vídeos. Como fazer isso sem estragar o arquivo está em [como usar o mesmo vídeo nas três redes](/guias/como-usar-o-mesmo-video-nas-tres-redes).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Você já publicou dois hoje. E agora?',
    },
    {
      tipo: 'lista',
      itens: [
        '**Não apague o segundo.** Apagar não devolve o alcance que o primeiro perdeu e ainda tira do ar uma peça que já recebeu audiência.',
        '**Não publique um terceiro para "compensar".** O erro é de acúmulo; acrescentar mais uma peça só divide a mesma audiência em três.',
        '**Conte 24 horas a partir do segundo**, e retome a régua a partir daí. Um dia sem publicar não custa nada; dois vídeos no mesmo dia disputam o mesmo espaço, e um atropela o alcance do outro.',
        '**Anote o horário.** O caso mais comum de publicação dupla nasce de não saber que horas o vídeo anterior saiu — e é o item mais barato de consertar da lista inteira.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As três exceções que existem de verdade',
    },
    {
      tipo: 'lista',
      itens: [
        '**Cobertura ao vivo de um evento.** Quando o conteúdo é datado e perde o sentido no dia seguinte, publicar em sequência é uma escolha consciente: você troca alcance por atualidade, sabendo o que está pagando.',
        '**Perfis diferentes.** A conta é por perfil. Duas marcas, dois perfis, dois vídeos no mesmo dia não disputam nada entre si.',
        '**Fim de semana.** Na rotina que a Doxa combina com quem é cliente, sábado e domingo ficam fora da contagem de dias úteis, e a empresa pode publicar vídeos curtos próprios mesmo a menos de 24 horas de uma peça da operação.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'O que não é exceção: ter dois vídeos prontos. Peça pronta que não pode sair hoje não é problema, é fila — e fila é o estado saudável de uma operação de conteúdo, não o sintoma de um atraso.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conta do mês, então',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um por dia útil dá algo entre vinte e vinte e dois vídeos por mês, e cerca de sessenta num trimestre. É o teto prático da régua — e é também a faixa em que dez a quinze peças por formato cabem sem apertar, que é o volume por formato que costuma separar padrão de acaso. Quem produz menos não está violando regra nenhuma; está só demorando mais para aprender.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A régua desta página é literalmente a regra que a Doxa escreve para quem já é cliente: no máximo um vídeo da operação por dia útil, sem compensar publicando vários no mesmo dia, com pelo menos 24 horas de relógio entre publicações, dentro de um volume mínimo de 60 conteúdos únicos em 90 dias — conforme as condições e o prazo do contrato. Quem produz por conta própria pode adotar o mesmo intervalo sem contratar nada.',
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
          pergunta: 'Stories e carrosséis atrapalham o vídeo do dia?',
          resposta:
            'Não competem pelo mesmo espaço: o vídeo curto é distribuído no feed de recomendação, e story, foto e carrossel vivem em outras superfícies, entregues principalmente a quem já segue o perfil. Dá para publicar os três no mesmo dia sem prejuízo nenhum ao vídeo — e, em perfis que precisam falar todo dia, é justamente aí que o resto do assunto cabe.',
        },
        {
          pergunta: 'Tenho dois perfis. Posso publicar nos dois no mesmo dia?',
          resposta:
            'Pode, porque a conta é por perfil: são audiências e históricos diferentes, e um vídeo não disputa espaço com o outro. O cuidado é de conteúdo, não de frequência — se as duas peças forem quase iguais e os públicos se sobrepuserem, a mesma pessoa vê a mesma coisa duas vezes, o que gasta a novidade em dobro.',
        },
        {
          pergunta: 'Publicar de madrugada ou no fim de semana muda alguma coisa?',
          resposta:
            'O horário move pouco perto da abertura e da regularidade — o assunto está em [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe). O que muda de fato é o fim de semana: como a régua é contada em dias úteis, sábado e domingo funcionam como espaço livre para conteúdo próprio, sem interferir na sequência da semana.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A conferência de trinta segundos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra o seu perfil e olhe a data e a hora das dez últimas publicações. Se houver dois vídeos no mesmo dia, você já sabe onde foi parte do alcance perdido. Se houver dias de silêncio seguidos de rajadas, o problema não é a régua — é a fila, e ela se resolve em [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a pergunta do title: um por dia, 24 h de
 *          intervalo. Sem aquecimento.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §8).
 * [x]  3. Nada da §9.
 * [x]  4. Termos proibidos ausentes; nenhuma promessa de alcance.
 * [x]  5. Os números do manual vêm com "conforme as condições e o prazo do
 *          contrato" e rotulados como condição de cliente.
 * [x]  6. Intenção própria: a pergunta de frequência. O MECANISMO da cadência
 *          é de /guias/como-viralizar-no-tiktok e aparece aqui em duas frases
 *          com link; a rotina semanal é de /guias/como-postar-todos-os-dias.
 * [x]  7. Incremental: a tabela do que entra na conta, o protocolo de quem já
 *          publicou dois e as três exceções reais.
 * [x]  8. title (55 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/marketing-no-tiktok; links contextuais úteis.
 * [x] 10. Não é comparativo; nomeia as exceções em vez de vender a régua como
 *          lei da plataforma — e diz que o TikTok não publica limite nenhum.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "dia útil", "conteúdos únicos", "auditoria
 *          estratégica".
 * [x] 14. Teste final (§45): sim — é a resposta que eu daria por mensagem, com
 *          a parte que ninguém pergunta e precisa saber.
 * ────────────────────────────────────────────────────────────────────────── */
