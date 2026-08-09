/**
 * Conteúdo do dono da seção de comparação. Tudo que é número ou texto de
 * negócio mora aqui — o resto dos arquivos só sabe desenhar.
 */

export interface Item {
  /** Como o item aparece na ladainha, com o artigo. */
  nome: string;
  /** O nome do ícone no `lucide-react`, resolvido em `Ladainha.tsx`. */
  icone: string;
  /** O fundo da lâmina que segue o ponteiro. */
  cor: string;
  /**
   * PENDENTE-DONO: a foto da lâmina, quando existir.
   *
   * O dono pediu imagem seguindo o mouse. Não temos vinte e cinco fotos — as
   * únicas em `public/media/` são os reels dos clientes, que não têm nada a ver
   * com "uma câmera" ou "um roteirista". Enquanto elas não chegam, a lâmina é
   * ícone sobre cor, que é uma escolha e não um remendo: some o campo, entra a
   * `<img>` no mesmo lugar e nada mais muda.
   */
  imagem?: string;
}

/**
 * O inventário do jeito antigo, escrito como a conta de quem paga.
 *
 * Cada linha começa com o artigo — "um video maker", "uma câmera" — e é o dono
 * quem pediu assim. A diferença não é estilística: "Video maker" é uma categoria
 * de equipamento, "Um video maker" é uma contratação. A lista tem de doer no
 * bolso de quem lê, e o que dói é a unidade, não o inventário.
 *
 * PENDENTE-DONO: a lista é minha, montada a partir do que ele ditou e estendida
 * para o resto do que a conta inclui. Vale revisão item a item — cada linha é
 * uma afirmação sobre o custo de outra empresa, e uma que não se sustenta
 * contamina as outras vinte e quatro.
 *
 * As cores são vivas, e agora podem ser: só UMA lâmina existe na tela por vez,
 * então não há arco-íris a evitar. A paleta apagada foi feita para quando as
 * vinte e cinco apareciam juntas — a regra da harmonia é sobre o que se vê ao
 * mesmo tempo, não sobre o que existe no arquivo.
 */
export const ITENS: readonly Item[] = [
  { nome: 'Um video maker.', icone: 'Video', cor: '#E2542C' },
  { nome: 'Um roteirista.', icone: 'PenLine', cor: '#F0B429' },
  { nome: 'Um editor de vídeo.', icone: 'Scissors', cor: '#3FA06A' },
  { nome: 'Um social media.', icone: 'AtSign', cor: '#2E86C1' },
  { nome: 'Um diretor de criação.', icone: 'Megaphone', cor: '#B8449C' },
  { nome: 'Uma câmera.', icone: 'Camera', cor: '#E0453F' },
  { nome: 'Lentes.', icone: 'Aperture', cor: '#D98E4A' },
  { nome: 'Um tripé.', icone: 'Wrench', cor: '#3FA06A' },
  { nome: 'Um microfone de lapela.', icone: 'Mic', cor: '#2E86C1' },
  { nome: 'Um estabilizador.', icone: 'Move', cor: '#E2542C' },
  { nome: 'Cartões de memória.', icone: 'HardDrive', cor: '#B8449C' },
  { nome: 'Um estúdio.', icone: 'Building2', cor: '#F0B429' },
  { nome: 'Iluminação.', icone: 'Lightbulb', cor: '#D98E4A' },
  { nome: 'Um cenário.', icone: 'Frame', cor: '#E0453F' },
  { nome: 'Horas de gravação.', icone: 'Timer', cor: '#2E86C1' },
  { nome: 'Uma ilha de edição.', icone: 'MonitorPlay', cor: '#3FA06A' },
  { nome: 'Licença de edição.', icone: 'KeyRound', cor: '#F0B429' },
  { nome: 'Banco de trilhas.', icone: 'Music', cor: '#B8449C' },
  { nome: 'Banco de imagens.', icone: 'ImageIcon', cor: '#E2542C' },
  { nome: 'Legendagem.', icone: 'Subtitles', cor: '#D98E4A' },
  { nome: 'Uma agência.', icone: 'Users', cor: '#E0453F' },
  { nome: 'Um gestor de tráfego.', icone: 'Target', cor: '#2E86C1' },
  { nome: 'Verba de tráfego pago.', icone: 'Wallet', cor: '#3FA06A' },
  { nome: 'Um calendário editorial.', icone: 'CalendarDays', cor: '#F0B429' },
  { nome: 'Relatórios.', icone: 'BarChart3', cor: '#B8449C' },
];

/**
 * O soco do painel escuro, e a dobradiça para o painel claro.
 *
 * PENDENTE-DONO: texto meu, a partir do argumento do dono. É a frase mais
 * importante desta coluna e por isso é a maior: vinte e cinco contratações e um
 * custo recorrente ainda deixam a pessoa sem o que ela queria. Sem esta linha, a
 * garantia do outro lado é uma vantagem; com ela, é a resposta a uma falta que
 * acabou de ser nomeada.
 */
export const SEM_GARANTIA = ['E ainda assim,', 'nenhuma garantia de viralizar.'];

/**
 * A última linha da ladainha, e a única que não se compra.
 *
 * Fica fora da lista e em creme: as outras são fornecedores e contas, esta é a
 * pessoa que está lendo. É o item que nenhum dos vinte e cinco resolve.
 */
export const TEMPO: Item = { nome: 'E o seu tempo.', icone: 'Hourglass', cor: '#F4F1E8' };

/**
 * O custo do jeito antigo, resolvido pelo dono nesta rodada.
 *
 * Era a divergência mais cara do repositório — `semcom/config.ts` dizia
 * R$ 10.500 e esta seção dizia R$ 5.000 a 8.000. Os dois foram para a faixa
 * abaixo no mesmo commit. Se este número mudar de novo, os dois arquivos mudam
 * juntos: num comparativo o número é a coisa toda, e a página não pode dizer
 * dois valores para o mesmo custo.
 */
export const CUSTO_DE = 8000;
export const CUSTO_ATE = 10500;
export const CUSTO_UNIDADE = '/mês';

/**
 * As duas falas dos dois painéis.
 *
 * PENDENTE-DONO: reescrita minha da opção C do dono. "Quanto custa não ter
 * Doxa?" fazia a marca aparecer pelo negativo; assim a pergunta é sobre ELE. E
 * nenhuma das duas frases fala do produto: uma fala do custo dele, a outra do
 * desejo dele. A virada de preto para creme é que responde.
 */
export const PERGUNTA = ['Quanto custa não ter a Doxa', 'na sua empresa?'];

/**
 * A MESMA pergunta, quebrada para a tela estreita.
 *
 * O dono pediu o título uma vez e meia maior no telefone, e a 2,7rem a primeira
 * linha de `PERGUNTA` mede 385 pixels numa tela que tem 280 úteis. Ela quebra
 * sozinha, e quebra no pior lugar possível: depois do "a", deixando "Doxa"
 * órfã numa linha só — que foi exatamente o defeito que ele relatou quando o
 * título ainda era 36px.
 *
 * Então a quebra é escrita, e não deixada para o navegador. As três linhas saem
 * em 171, 200 e 214 pixels: nenhuma órfã, nenhuma perto do limite, e o corte
 * cai entre orações em vez de no meio de uma.
 *
 * ATENÇÃO: são as MESMAS palavras de `PERGUNTA`, só com outras dobras. Se a
 * pergunta mudar, as duas mudam no mesmo commit — senão o telefone e o desktop
 * passam a fazer perguntas diferentes, e é o tipo de divergência que ninguém vê
 * até um cliente ver.
 */
export const PERGUNTA_ESTREITA = ['Quanto custa', 'não ter a Doxa', 'na sua empresa?'];

/**
 * O convite, e a ORDEM dele é o pedido do dono.
 *
 * Era "Pronto para viralizar?", que é o fim da história contada primeiro. Com a
 * Doxa dentro da empresa acontecem duas coisas, e nesta sequência: a conta cai,
 * e depois vêm as views. O título agora diz as duas na ordem em que elas
 * acontecem — e é a mesma ordem em que a coluna abaixo dele está escrita, com o
 * custo riscado antes da garantia.
 */
export const CONVITE = ['Você corta a conta inteira.', 'E ainda assim, viraliza.'];

/*
 * O parágrafo de instrução saiu da coluna, a pedido do dono.
 *
 * Ele dizia "preencha aqui do lado, um consultor fala com você em até 24
 * horas" — e as duas metades já estavam ditas em outro lugar: o formulário ao
 * lado é visivelmente um formulário, e o prazo de 24 horas aparece na tela de
 * confirmação, que é onde ele vira uma promessa que a pessoa precisa guardar.
 * Escrito também aqui, era uma legenda explicando um objeto que está à vista.
 */

/**
 * A troca, dita como troca: o custo do jeito antigo riscado, e o que entra no
 * lugar dele.
 *
 * O riscado é o pedido do dono, e o que ele risca é O CUSTO — nunca um preço da
 * Doxa ao lado. ATENÇÃO, é a armadilha mais cara desta seção: pôr "R$ 8.000 a
 * 10.500" riscado com "R$ 100" embaixo diz que a Doxa custa cem reais por mês. O
 * `FILTRO` de R$ 100 é espanta-curioso para falar com um consultor, não
 * mensalidade, e uma página que promete cem reais de mensalidade cria a
 * expectativa antes da primeira conversa — o consultor passa a corrigir a
 * própria página em vez de vender. O que entra no lugar do custo é o ESFORÇO:
 * vinte e cinco contratações viram uma foto e um áudio.
 *
 * PENDENTE-DONO: se o dono quiser um número aqui, ele tem de ser o preço real do
 * serviço, decidido por ele, e passa a ser uma promessa pública.
 */
export const TROCA_DEPOIS = 'Uma foto e um áudio.';

/**
 * O que está sendo riscado, dito em COISAS e não em contagem.
 *
 * Era "R$ 8.000 a 10.500/mês, 25 contratações", e o dono recusou o número: 25
 * contratações é um total de inventário, e ninguém sente um total. Uma agência
 * sente. Tráfego pago sente — é uma linha que a pessoa reconhece do próprio
 * extrato. A lista completa está logo acima, no painel escuro, contada uma a
 * uma; aqui embaixo o que precisa aparecer são as duas ou três que doem mais.
 */
export const TROCA_ANTES = 'uma agência, tráfego pago…';

/**
 * A frase de onde sai o fio até o formulário.
 *
 * PENDENTE-DONO: redação minha a partir do insight do dono — o hero mostra uma
 * foto e uma voz correndo por um fio até o vídeo pronto, e aqui a última entrada
 * que falta é a pessoa. A frase e o fio dizem a mesma coisa, e é por isso que
 * ela é curta: o desenho já fez metade do trabalho.
 */
export const FALTA = ['Falta uma coisa:', 'você.'];

/**
 * A garantia, copiada palavra por palavra do hero.
 *
 * Se a frase mudar, tem de mudar nos dois lugares no mesmo commit: duas versões
 * da mesma promessa leem como duas promessas, e uma delas vai parecer a letra
 * miúda da outra.
 */
export const GARANTIA = ['Um milhão de views.', 'Ou seu dinheiro de volta.'];

/**
 * A explicação dos R$ 100, e ela precisa estar ao lado do botão.
 *
 * PENDENTE-DONO: redação minha a partir do enquadramento do dono — os cem reais
 * são espanta-curioso, não preço. Sem essa frase na mesma tela, cobrar para
 * falar com um fornecedor lê como "eles cobram para me vender", e a conversão
 * cai. Dita como filtro, ela vira sinal de que do outro lado tem gente séria.
 *
 * ATENÇÃO ao verbo: o que a página prometer por esses cem reais passa a ser
 * serviço contratado. "Diagnóstico completo" obriga a entregar um diagnóstico
 * completo. Prometer menos e entregar mais é a única direção segura aqui.
 */
export const FILTRO = {
  valor: 'R$ 100',
  titulo: 'simbólicos, e é filtro.',
  corpo: 'Não é o preço do diagnóstico — é o que faz a gente conversar só com quem já decidiu.',
};

/**
 * O nome do que a pessoa está preenchendo, decidido pelo dono.
 *
 * O cartão não se apresentava: começava na trilha de etapas, e quem chegava por
 * um botão de CTA via um campo de nome sem saber o que estava começando. Com o
 * título, o mesmo formulário deixa de ser "um cadastro" e passa a ser uma
 * AUDITORIA — que é o que os R$ 100 compram. É a palavra que justifica o preço
 * antes de o preço aparecer, três passos depois.
 *
 * Escrito em capitulares pelo CSS e não aqui: em caixa alta no arquivo, ele
 * chegaria gritado em qualquer lugar que reusasse a constante, inclusive num
 * leitor de tela — que soletra sigla.
 */
export const AUDITORIA = 'Auditoria Estratégica Doxa';

/**
 * O que os R$ 100 compram, dito no passo em que se paga.
 *
 * PENDENTE-DONO: a frase é dele, palavra por palavra. Ela entra ABAIXO de
 * "Falta o filtro." e não no lugar: aquela linha é o título do passo e cabe na
 * serifa grande; esta é a instrução, e instrução em corpo de manchete lê como
 * anúncio. Juntas elas dizem o par que o passo precisa — por que se cobra, e o
 * que acontece quando se paga.
 *
 * ATENÇÃO: isto é promessa pública. "Agendar uma reunião" obriga a existir uma
 * reunião agendada — não um contato, não um retorno. Se o processo real for
 * ligar em 24 horas e marcar depois, o verbo aqui tem de mudar junto.
 */
export const PAGAMENTO_CHAMADA =
  'Complete o pagamento para agendar uma reunião com o time Doxa.';

/** O que acontece depois de pagar. Vai na tela de sucesso e ao lado do botão. */
export const RETORNO = 'Um consultor entra em contato em até 24 horas.';

/** As formas de pagamento, listadas antes de existirem de verdade. */
export const PAGAMENTOS = ['Pix', 'Cartão', 'Apple Pay', 'Google Pay'];

/** A opção que abre um campo em vez de responder sozinha. */
export const OUTRO = 'Outro';

export interface PerguntaFicha {
  chave: 'segmento' | 'faturamento' | 'objetivo' | 'trava' | 'aparece';
  /** O rótulo curto da resposta guardada. */
  rotulo: string;
  pergunta: string;
  dica: string;
  opcoes: readonly string[];
  /** Aceita mais de uma resposta — e aí precisa de botão para seguir. */
  multipla?: boolean;
  /** O texto do campo que a opção `OUTRO` abre. Sem isto, `OUTRO` não aparece. */
  livre?: string;
}

/**
 * A ficha do consultor: o que se pergunta DEPOIS do dinheiro.
 *
 * A ordem das duas metades do formulário é a decisão de conversão mais cara
 * desta seção, e ela é contra-intuitiva. O kit padrão de qualificação —
 * faturamento, verba, meta — existe para separar quem pode pagar de quem não
 * pode ANTES de gastar o tempo de um vendedor. Aqui quem separa é o checkout, e
 * um filtro de R$ 100 é mais duro que qualquer pergunta de faixa: ninguém mente
 * num Pix. Perguntadas antes, essas perguntas cobrariam conversão duas vezes
 * pelo mesmo trabalho — e cobrariam a cara, porque faturamento é justamente a
 * pergunta que faz fechar a aba, e ela fecharia a aba ANTES de o preço aparecer,
 * que é o único instante em que este funil recebe.
 *
 * Depois de pagar, a pessoa está no melhor estado do funil inteiro:
 * comprometida, esperando 24 horas, e querendo que a ligação valha o que ela
 * acabou de gastar. É aí que ela responde faturamento de verdade. E se ela
 * abandonar no meio, já foram recebidos o contato e o dinheiro — o custo de
 * abandono aqui é zero, que é o que torna toda pergunta desta lista PULÁVEL.
 *
 * Faixa e nunca número aberto: ninguém digita faturamento exato, e quem digita
 * arredonda para cima. Faixa também é a única forma que serve para agrupar
 * depois — cem respostas em texto livre não viram uma tabela.
 *
 * PENDENTE-DONO, três coisas:
 *
 * 1. Os SEGMENTOS são chute meu a partir do mercado que a página descreve. Os
 *    certos são os que o dono mais atende, e ele vai saber depois de cinquenta
 *    leads — a lista existe para ser trocada, e `OUTRO` é a válvula até lá.
 * 2. As FAIXAS de faturamento estão cortadas onde o argumento da seção deixa de
 *    valer: a página diz que o jeito antigo custa R$ 8.000 a 10.500 por mês
 *    (`CUSTO_DE`/`CUSTO_ATE`), e quem fatura 15 mil não tem esse problema. O
 *    primeiro degrau serve para o consultor saber, antes de abrir a boca, que a
 *    comparação inteira não fala com aquela pessoa.
 * 3. O DESTINO das respostas continua sem decisão — o mesmo pendente que trava
 *    o formulário de ir ao ar, agora com cinco campos a mais esperando por ele.
 */
export const FICHA: readonly PerguntaFicha[] = [
  {
    chave: 'segmento',
    rotulo: 'Segmento',
    pergunta: 'O que a sua empresa vende?',
    dica: 'Para o consultor chegar sabendo do que se trata.',
    opcoes: [
      'Advocacia',
      'Saúde e estética',
      'Imóveis',
      'Educação e cursos',
      'Alimentação',
      'Varejo e e-commerce',
      'Serviços para empresas',
      OUTRO,
    ],
    livre: 'O que a sua empresa vende',
  },
  {
    chave: 'faturamento',
    rotulo: 'Faturamento',
    pergunta: 'Quanto a empresa fatura hoje?',
    dica: 'Por faixa, e fica entre nós. É o que dimensiona a proposta.',
    opcoes: [
      'Até R$ 20 mil',
      'R$ 20 a 50 mil',
      'R$ 50 a 200 mil',
      'Mais de R$ 200 mil',
      'Prefiro não dizer',
    ],
  },
  {
    chave: 'objetivo',
    rotulo: 'Objetivo',
    pergunta: 'O que você quer que os vídeos façam?',
    dica: 'A resposta muda o roteiro antes de mudar qualquer outra coisa.',
    opcoes: [
      'Vender mais',
      'Autoridade no meu nicho',
      'Lançar algo novo',
      'Atrair gente boa para a equipe',
    ],
  },
  {
    chave: 'trava',
    rotulo: 'Trava',
    pergunta: 'O que te impede de postar hoje?',
    dica: 'Pode marcar mais de uma.',
    opcoes: [
      'Não tenho tempo',
      'Não sei o que falar',
      'Não gosto de aparecer',
      'Já paguei agência e não deu certo',
      'Não tenho equipe',
    ],
    multipla: true,
  },
  {
    chave: 'aparece',
    rotulo: 'Aparecer',
    /*
     * A pergunta que nenhum formulário de qualificação padrão tem, e a mais
     * desta empresa que existe na lista.
     *
     * As outras quatro serviriam a qualquer fornecedor de qualquer coisa. Esta
     * é sobre a ENTREGA: a oferta da página é "uma foto e um áudio", e se a
     * pessoa não quer aparecer, muda o que se produz, muda o preço e muda a
     * conversa inteira. É também a objeção mais silenciosa do mercado — quem
     * tem vergonha de câmera não escreve isso em lugar nenhum, e some.
     */
    pergunta: 'Você aparece nos vídeos?',
    dica: 'Não aparecer é uma resposta comum aqui, e tem caminho.',
    opcoes: ['Apareço', 'Prefiro não aparecer', 'Tanto faz'],
  },
];

/** O fecho da ficha, depois da última pergunta. */
export const FICHA_FIM = {
  titulo: 'Agora sim.',
  corpo: 'O consultor lê isto antes de te chamar. A conversa começa do meio.',
};

/** O convite para responder a ficha, na tela de confirmação. */
export const FICHA_CONVITE = {
  titulo: 'Enquanto isso: cinco perguntas.',
  corpo: 'Para o consultor não chegar cru na sua ligação. Leva um minuto.',
  botao: 'Responder',
};

/**
 * As duas cores de estado da seção, e são as duas únicas dela.
 *
 * Vermelho no lado sem Doxa, verde no lado com — pedido do dono, e exceção
 * consciente à regra monocromática do `tailwind.config`. É a exceção certa
 * porque aqui a cor não decora: ela É o estado, e "parado" e "no ar" se leem
 * antes de qualquer palavra.
 *
 * Moram aqui e não em cada componente porque três lugares as usam: o selo dos
 * dois painéis e a trilha de etapas do formulário. O verde da etapa concluída é
 * o mesmo verde do selo "Com Doxa" de propósito — é a mesma afirmação, feita
 * uma vez sobre a empresa e outra sobre o campo que a pessoa acabou de
 * responder.
 */
export const PARADO = '#E0453F';
export const NO_AR = '#3FA06A';
