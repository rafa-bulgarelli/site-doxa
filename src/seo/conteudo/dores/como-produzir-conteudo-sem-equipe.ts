import type { Pagina } from '../../tipos';

/**
 * A dor de CAPACIDADE — de onde sai o material. Vizinha de
 * `/guias/como-postar-todos-os-dias-sem-equipe`, que trata do RITMO. A
 * fronteira está no keyword-map, seção Canibalização: esta página não repete o
 * bloco de rotina da outra, e a outra manda para cá quando a resposta for
 * "não tenho o que postar".
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o inventário do "jeito antigo" (as 25 contratações: video maker,
 *    roteirista, editor, social media, diretor de criação, câmera, lentes,
 *    tripé, lapela, estabilizador, cartões, estúdio, iluminação, cenário,
 *    horas de gravação, ilha de edição, licença, banco de trilhas, banco de
 *    imagens, legendagem, agência, gestor de tráfego, verba, calendário,
 *    relatórios) e o custo de R$ 8.000 a R$ 10.500 por mês →
 *    `docs/seo/source-of-truth.md` §4, fonte:
 *    `src/components/comparacao/config.ts:44-70,100-101`. Publicado como
 *    ILUSTRAÇÃO do que uma operação interna acumula — é a ressalva escrita no
 *    próprio arquivo, que marca a lista como `PENDENTE-DONO`;
 *  · 18 dias até o primeiro vídeo pelo jeito antigo e as 9 etapas (briefing,
 *    roteiro, aprovação, agenda, estúdio, filmmaker, captação, edição,
 *    publicação) → §4, fonte: `src/components/semcom/config.ts:10-20,26`;
 *  · "não tenho tempo", "não sei o que falar", "não gosto de aparecer",
 *    "não tenho equipe" são travas declaradas pelos leads no formulário → §7,
 *    fonte: `src/components/comparacao/config.ts:444-449`;
 *  · uma foto e uma amostra de voz viram um clone que grava no lugar do
 *    cliente; o vídeo chega pronto para postar → §1 e §2, fonte:
 *    `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`;
 *  · a Doxa assume grande parte da operação, e o que o cliente precisa gravar
 *    varia conforme o formato, definido no onboarding → §2, fonte:
 *    `src/components/faq/config.ts:431-432`.
 */
export const pagina: Pagina = {
  tipo: 'dor',
  slug: 'como-produzir-conteudo-sem-equipe',
  titulo: 'Como produzir conteúdo sem equipe: o que dá com uma pessoa',
  descricao:
    'De onde sai o material quando não há equipe: as fontes que já existem no negócio, o que cortar da produção e quando terceirizar compensa mesmo.',
  h1: 'Como produzir conteúdo sem equipe',
  resumo:
    'O material já existe no seu negócio: são as perguntas que você responde por mensagem, os erros que você vê o cliente cometer e as decisões que você toma toda semana. O que falta quase nunca é assunto — é um processo que transforme isso em vídeo sem depender de estúdio, roteirista e agenda. Abaixo, como montar esse processo com uma pessoa só.',
  intencao: 'informacional',
  palavrasChave: [
    'produzir conteúdo sem equipe',
    'não tenho equipe de marketing',
    'criar conteúdo sozinho',
    'produção de conteúdo com uma pessoa',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-postar-todos-os-dias-sem-equipe',
    '/solucoes/producao-de-conteudo-em-escala',
    '/comparativos/agencia-vs-equipe-interna',
    '/guias/o-que-e-ugc',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o processo desta página já está montado e mesmo assim o volume não sai, conte quanto a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As quatro fontes de conteúdo que já estão no seu negócio',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Antes de qualquer processo, o inventário. Quem trabalha com clientes produz assunto todos os dias e não percebe, porque o que é óbvio para quem está dentro costuma ser exatamente o que falta para quem está fora.',
    },
    {
      tipo: 'lista',
      itens: [
        '**As perguntas repetidas.** Toda pergunta que você respondeu duas vezes esta semana é um vídeo. Se duas pessoas perguntaram, duzentas têm a dúvida e não perguntaram.',
        '**Os erros que você vê acontecer.** O que o cliente faz errado antes de chegar até você costuma render bem, porque a pessoa se reconhece no erro antes de saber que é sobre ela.',
        '**As decisões do dia.** Por que você recusou aquele pedido, por que cobra de um jeito e não de outro, o que mudou na sua forma de trabalhar. É o que ninguém mais pode publicar.',
        '**Os bastidores concretos.** Não o escritório bonito: o processo real, o antes e depois, a coisa sendo feita. Funciona porque é específico e verificável.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Um exercício de vinte minutos que costuma render um mês: abra as suas conversas de trabalho da última semana e anote toda pergunta que você respondeu. Cada linha é um vídeo, e o roteiro é a própria resposta que você já deu.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O processo mínimo de uma pessoa só',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Uma lista viva de assuntos',
          texto:
            'Um arquivo único, aberto o tempo todo, onde a pergunta entra no instante em que aparece. Sem esse arquivo, você recomeça o trabalho de lembrar toda semana, e é aí que a produção morre.',
        },
        {
          titulo: 'Roteiro em três linhas, não em página',
          texto:
            'Abertura (a pergunta ou o erro), o miolo (a resposta, com um exemplo concreto) e o fecho (o que a pessoa faz com isso). Roteiro longo demais vira leitura, e leitura no vídeo se ouve.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Gravação e edição vêm depois disso, e o jeito de fazer as duas caberem numa pessoa é de rotina, não de assunto: trabalhar em lote, com um padrão definido, e manter uma fila de vídeos prontos à frente. Esse desenho é o tema de [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe), e esta página não o repete.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que cortar sem dó',
    },
    {
      tipo: 'lista',
      itens: [
        'Cenário elaborado, iluminação de estúdio e equipamento caro: o feed não premia produção, premia o que prende. Um vídeo de celular bem aberto ganha de um vídeo caro mal aberto.',
        'Aprovação por comitê. Cada rodada de aprovação custa dias, e dias custam a cadência inteira.',
        'Trilha e efeito visual em cima de um conteúdo que não se sustenta sem eles.',
        'Pesquisa de tema que não passa pelas quatro fontes acima: o material que só você tem é o que ninguém encontra pesquisando.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'E se você não quer aparecer',
    },
    {
      tipo: 'paragrafo',
      texto:
        '"Não gosto de aparecer" é uma das travas que os próprios interessados marcam no formulário da Doxa, e é uma restrição legítima, não uma desculpa. Há caminhos: gravar só a voz sobre imagens do trabalho sendo feito, usar texto na tela com captura de tela, filmar as mãos em vez do rosto, ou colocar outra pessoa da empresa na frente da câmera. Todos custam mais roteiro e menos exposição, e todos funcionam — o que não funciona é o vídeo sem ninguém e sem nada acontecendo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando terceirizar passa a fazer sentido',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O ponto de virada não é o dia em que você se cansa: é o dia em que a produção vira o gargalo do negócio. Vale fazer a conta do que uma operação interna acumula — video maker, roteirista, editor, social media, câmera, microfone, estúdio, ilha de edição, banco de trilhas, calendário, relatórios. Somado, isso custa entre **R$ 8.000 e R$ 10.500 por mês** na conta que a Doxa publica na própria landing, e é uma ilustração do que uma operação interna acumula, não um levantamento de mercado.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Além do custo, há o relógio: pelo caminho tradicional, o primeiro vídeo passa por briefing, roteiro, aprovação, agenda, estúdio, filmmaker, captação, edição e publicação — nove etapas, cerca de dezoito dias até o primeiro arquivo no ar. Para quem precisa de volume, o problema não é o preço de um vídeo: é que o segundo custa quase o mesmo que o primeiro.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa ataca justamente a etapa de gravação, que é a mais cara de repetir: o cliente manda uma foto e uma amostra da própria voz, a plataforma monta um clone que grava os vídeos no lugar dele, e o arquivo chega pronto para postar. A empresa assume grande parte da operação, e o que ainda precisa vir do cliente — imagens, vídeos, áudios ou participações — é mapeado no início e varia conforme o formato escolhido para a marca.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que continua sendo seu, com ou sem ajuda de fora: saber o que a sua audiência precisa ouvir. Essa parte nenhuma operação terceirizada resolve, e a lista de assuntos do começo desta página continua sendo o trabalho mais importante.',
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
          pergunta: 'E se o meu negócio for chato demais para render conteúdo?',
          resposta:
            'Quase sempre o que falta é inventário, não assunto. Antes de concluir que não há o que dizer, passe pelas quatro fontes desta página: as perguntas que você respondeu duas vezes na semana, os erros que você vê o cliente cometer, as decisões que você tomou e o processo real sendo executado. Se nenhuma das quatro render uma linha, aí sim o problema é outro.',
        },
        {
          pergunta: 'Preciso de câmera e microfone profissionais?',
          resposta:
            'Não para começar. Um celular recente, luz natural e um microfone de lapela de baixo custo cobrem o essencial. O que separa um vídeo assistido de um vídeo ignorado é a abertura e o assunto, não a resolução.',
        },
        {
          pergunta: 'Conteúdo gravado por celular funciona para uma marca?',
          resposta:
            'Funciona, e em vídeo curto costuma funcionar melhor do que material de aparência publicitária. O formato premia o que parece uma pessoa falando com você, e é isso que explica a presença de material gravado por criadores nas três redes.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o material já existe no negócio.
 * [x]  2. Fatos da Doxa com entrada no source of truth (§1, §2, §4, §7).
 * [x]  3. Nada da §9: o custo citado é o do "jeito antigo" publicado na
 *          landing, com a ressalva de ilustração; a mensalidade da Doxa não
 *          aparece.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: CAPACIDADE — de onde sai o material. Todo o bloco
 *          de ROTINA (gravar em lote, editar por padrão, manter fila, calendário
 *          fechado, terceirizar só a edição) é da página vizinha
 *          `/guias/como-postar-todos-os-dias-sem-equipe`: aqui ele vira UMA
 *          frase com link, e nem os passos nem o FAQ o repetem.
 * [x]  7. Incremental: as quatro fontes de conteúdo, o exercício de vinte
 *          minutos e o caminho para quem não quer aparecer.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/videos-curtos`, recebe dele e envia links.
 * [x] 10. Não é comparativo; admite explicitamente o que a terceirização NÃO
 *          resolve.
 * [x] 11. CTA único no fim, condicionado.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone", "pronto para postar", "operação",
 *          "o jeito antigo".
 * [x] 14. Publicaria sem Google: sim — o inventário de fontes é a primeira
 *          coisa que eu faria com alguém travado no "não sei o que postar".
 * ────────────────────────────────────────────────────────────────────────── */
