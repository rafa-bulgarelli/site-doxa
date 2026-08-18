import type { Pagina } from '../../tipos';

/**
 * A dor de CADÊNCIA. Vizinha de `/guias/como-produzir-conteudo-sem-equipe`, e
 * a fronteira entre as duas está no keyword-map, seção Canibalização: esta
 * página é sobre RITMO (a rotina, o calendário, o dia que aperta); a outra é
 * sobre CAPACIDADE (de onde sai o material). Quando a resposta for "não tenho
 * o que postar", esta manda para a outra e não repete o bloco dela.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · no máximo um vídeo por dia útil, porque dois no mesmo dia disputam o mesmo
 *    espaço → `RT-2`, `docs/seo/source-of-truth.md` §8, fonte:
 *    `supabase/manual-seed-v1.sql:187-191`;
 *  · a janela de 24 horas de relógio entre publicações → `RH-1`, §8, fonte:
 *    `supabase/manual-seed-v1.sql:205-207`;
 *  · nos dias úteis os únicos vídeos curtos dos perfis participantes são os da
 *    operação; fins de semana o cliente pode publicar os próprios → §8, fonte:
 *    `supabase/manual-seed-v1.sql:212,229`;
 *  · 60 conteúdos únicos em 90 dias, um por dia útil → §2 e §8, fonte:
 *    `supabase/manual-seed-v1.sql:179,183`;
 *  · "não tenho tempo" e "não tenho equipe" são travas declaradas pelos
 *    próprios leads no formulário da landing → §7, fonte:
 *    `src/components/comparacao/config.ts:444-449`;
 *  · o entregável chega pronto para postar e quem publica é o cliente → §2,
 *    fonte: `src/components/HowItWorks.tsx:92`.
 */
export const pagina: Pagina = {
  tipo: 'dor',
  slug: 'como-postar-todos-os-dias-sem-equipe',
  titulo: 'Como postar todos os dias sem virar refém do calendário',
  descricao:
    'O que muda quando a publicação vira rotina e não tarefa: o ritmo que funciona, o que fazer no dia em que nada foi produzido e o que não compensa.',
  h1: 'Como postar todos os dias sem equipe',
  resumo:
    'Postar todo dia não é uma questão de disciplina, é uma questão de desenho: quem consegue manter o ritmo separou o dia de produzir do dia de publicar, e nunca depende de ter uma ideia boa hoje para publicar hoje. Abaixo, como montar essa rotina sozinho, e o que fazer nos dias em que ela falhar.',
  intencao: 'informacional',
  palavrasChave: [
    'como postar todos os dias',
    'postar todo dia nas redes',
    'consistência de postagem',
    'rotina de conteúdo',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/guias/como-produzir-conteudo-sem-equipe',
    '/guias/estrategia-de-conteudo-para-empresas',
    '/guias/como-aumentar-o-alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a rotina já está desenhada e o gargalo é ter quem produza todo dia, conte o volume que a sua empresa precisa manter. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O erro de desenho que derruba quase todo mundo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A rotina que falha é sempre a mesma: acordar, pensar no que postar, produzir e publicar no mesmo dia. Ela funciona por uma semana, talvez duas, e cai no primeiro dia de agenda cheia — porque depende de três coisas darem certo ao mesmo tempo, todos os dias, para sempre.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A rotina que se sustenta separa as etapas no tempo. Você produz em bloco, num dia só, e publica ao longo da semana a partir do que já está pronto. A publicação deixa de ser uma decisão criativa e vira uma tarefa de dois minutos, que sobrevive ao dia ruim. É a diferença entre depender de inspiração diária e depender de um estoque.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A rotina em quatro blocos',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Um dia de captura por semana',
          texto:
            'Duas a três horas, um cenário só, uma roupa só, e todos os vídeos da semana gravados em sequência. Trocar de contexto é o que consome tempo; gravar dez coisas parecidas de uma vez custa muito menos que dez gravações de uma.',
        },
        {
          titulo: 'Um bloco de edição, também semanal',
          texto:
            'Corte, legenda embutida e capa dos vídeos daquela semana, com o mesmo padrão visual. Padrão não é falta de criatividade: é o que permite editar dez vídeos sem decidir dez vezes.',
        },
        {
          titulo: 'Uma fila com folga',
          texto:
            'Trabalhe sempre com pelo menos uma semana de vídeos prontos à frente. A fila é o que transforma um imprevisto em atraso de produção, e não em um buraco na publicação.',
        },
        {
          titulo: 'Dois minutos por dia para publicar',
          texto:
            'Um vídeo por dia, no mesmo horário aproximado, e só. Se a plataforma tiver agendamento e ele funcionar para o seu formato, use; se não, publicar à mão continua sendo uma tarefa de dois minutos.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Um por dia, e não quatro no sábado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A tentação de compensar a semana parada publicando tudo de uma vez é forte, e é contraproducente: vídeos publicados no mesmo dia disputam a mesma audiência, e um atropela o alcance do outro. A regra que a Doxa aplica nos perfis dos clientes é de no máximo um vídeo por dia útil, com pelo menos 24 horas de relógio entre um e outro — se um vídeo saiu na segunda às 22h, o próximo só a partir das 22h de terça.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Se você atrasou três dias, não publique três vídeos hoje. Publique um, e recomece a fila amanhã: o vídeo atrasado não perde valor, mas o vídeo atropelado perde alcance.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que fazer nos dias em que a rotina falha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Acabou a fila.** Publique um vídeo antigo que foi bem, com abertura nova. Não é reciclagem preguiçosa: é um teste com variável trocada.',
        '**O dia de captura caiu.** Grave três vídeos curtos de celular, sem produção, sobre perguntas que você respondeu por mensagem nesta semana. Costumam performar melhor do que os planejados.',
        '**Você não tem o que dizer.** Esse é outro problema, e ele tem página própria: [como produzir conteúdo sem equipe](/guias/como-produzir-conteudo-sem-equipe) trata de onde o material sai.',
        '**A semana inteira caiu.** Volte publicando um por dia, sem tentar recuperar o atraso. Consistência daqui para a frente vale mais do que o histórico limpo.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quanto é "todo dia", na prática',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Todo dia útil, na maior parte dos casos, e não sete dias por semana. A operação da Doxa usa como referência sessenta conteúdos únicos em noventa dias — um por dia útil —, e o fim de semana fica fora dessa contagem. Para uma pessoa sozinha, cinco por semana é um alvo alto mas alcançável; três por semana mantidos por seis meses vale mais do que sete por semana durante três semanas.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que não compensa',
    },
    {
      tipo: 'lista',
      itens: [
        'Agendar um mês inteiro de conteúdo em um único planejamento fechado: quando o quinto vídeo mostrar o que a audiência quer, os outros vinte e cinco já estão presos.',
        'Publicar qualquer coisa só para não quebrar a sequência. Um vídeo fraco não é neutro: ele consome a amostra que o próximo teria.',
        'Terceirizar só a edição e continuar sendo o gargalo da gravação, que é a etapa cara.',
        'Trocar o formato toda semana em nome da variedade, o que impede qualquer conclusão sobre o que funcionou.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        '"Não tenho tempo" e "não tenho equipe" estão entre as travas que os próprios interessados marcam no formulário da Doxa — não é um problema raro nem um problema de quem é desorganizado. A operação da empresa existe para tirar as etapas de produção do caminho: o vídeo chega pronto para postar, e quem publica continua sendo a marca, no perfil dela. A rotina desta página continua valendo; o que muda é quem carrega o peso da gravação e da edição.',
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
          pergunta: 'Publicar menos vezes por semana prejudica o alcance?',
          resposta:
            'Publicar menos reduz a quantidade de dado que a plataforma tem sobre o seu público, o que costuma deixar o crescimento mais lento. Mas a regularidade importa mais que a frequência absoluta: três vídeos por semana mantidos por seis meses entregam mais do que sete por semana durante um mês e depois nada.',
        },
        {
          pergunta: 'Posso agendar tudo e esquecer?',
          resposta:
            'Agendar a publicação ajuda; agendar o planejamento inteiro atrapalha. Vale manter um mês de material produzido, mas com liberdade para trocar a ordem e reagir ao que os primeiros vídeos mostrarem sobre a audiência.',
        },
        {
          pergunta: 'Qual é o melhor horário para postar?',
          resposta:
            'O horário muda pouco em comparação com a abertura do vídeo e a regularidade da publicação. Vale escolher um horário razoável para o seu público, manter esse horário, e gastar a energia que sobrar melhorando os primeiros segundos.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: é desenho de rotina, não disciplina.
 * [x]  2. Fatos da Doxa com entrada no source of truth (§2, §7, §8).
 * [x]  3. Nada da §9.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada; os 60 conteúdos entram como referência de
 *          cadência da operação.
 * [x]  6. Intenção própria: CADÊNCIA. A canibalização com
 *          `/guias/como-produzir-conteudo-sem-equipe` está resolvida como o
 *          keyword-map manda — quando a resposta é "não tenho o que postar",
 *          esta página aponta para a outra e não repete o bloco dela.
 * [x]  7. Incremental: os quatro blocos, o plano para o dia em que a rotina
 *          falha e a janela de 24 h de relógio.
 * [x]  8. Title, description e H1 exclusivos.
 * [x]  9. Pertence a `/guias/marketing-organico`, recebe dele e envia links.
 * [x] 10. Não é comparativo; admite que a rotina falha e diz o que fazer.
 * [x] 11. CTA único no fim, condicionado ao gargalo de produção.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "operação".
 * [x] 14. Publicaria sem Google: sim — é o desenho de rotina que eu passaria a
 *          um dono de negócio que quer manter um perfil sozinho.
 * ────────────────────────────────────────────────────────────────────────── */
