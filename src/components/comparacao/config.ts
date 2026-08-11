import type { PorIdioma } from '../../idioma';
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
const ITENS_PT: readonly Item[] = [
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
const SEM_GARANTIA_PT = ['E ainda assim,', 'nenhuma garantia de viralizar.'];

/**
 * A última linha da ladainha, e a única que não se compra.
 *
 * Fica fora da lista e em creme: as outras são fornecedores e contas, esta é a
 * pessoa que está lendo. É o item que nenhum dos vinte e cinco resolve.
 */
const TEMPO_PT: Item = { nome: 'E o seu tempo.', icone: 'Hourglass', cor: '#F4F1E8' };

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
const CUSTO_UNIDADE_PT = '/mês';

/**
 * As duas falas dos dois painéis.
 *
 * PENDENTE-DONO: reescrita minha da opção C do dono. "Quanto custa não ter
 * Doxa?" fazia a marca aparecer pelo negativo; assim a pergunta é sobre ELE. E
 * nenhuma das duas frases fala do produto: uma fala do custo dele, a outra do
 * desejo dele. A virada de preto para creme é que responde.
 */
const PERGUNTA_PT = ['Quanto custa não ter a Doxa', 'na sua empresa?'];

/**
 * A MESMA pergunta, com as dobras da tela estreita.
 *
 * O dono subiu o título 1,25x no telefone, e a 36px a primeira linha de
 * `PERGUNTA` mede 321 pixels nos 280 úteis de um aparelho de 320. Ela quebra
 * sozinha depois do "a", deixando "Doxa" órfã numa linha — o defeito que ele já
 * apontou três vezes em três títulos diferentes.
 *
 * Continuam DUAS linhas, e não três: 238 e 261 pixels, as duas com folga. Três
 * custariam mais 37 pixels de altura, e quem paga essa altura é a janela em que
 * a fatura de vinte e cinco linhas corre, logo abaixo.
 *
 * A dobra cai depois de "ter" e mantém o artigo com o substantivo — "a Doxa na
 * sua empresa?" é uma oração inteira na segunda linha.
 *
 * ATENÇÃO: são as MESMAS palavras de `PERGUNTA`, só com outras dobras. Se a
 * pergunta mudar, as duas mudam no mesmo commit — senão o telefone e o desktop
 * passam a fazer perguntas diferentes, e ninguém vê até um cliente ver.
 */
const PERGUNTA_ESTREITA_PT = ['Quanto custa não ter', 'a Doxa na sua empresa?'];

/**
 * O convite, e a ORDEM dele é o pedido do dono.
 *
 * Era "Pronto para viralizar?", que é o fim da história contada primeiro. Com a
 * Doxa dentro da empresa acontecem duas coisas, e nesta sequência: a conta cai,
 * e depois vêm as views. O título agora diz as duas na ordem em que elas
 * acontecem — e é a mesma ordem em que a coluna abaixo dele está escrita, com o
 * custo riscado antes da garantia.
 */
const CONVITE_PT = ['Você corta a conta inteira.', 'E ainda assim, viraliza.'];

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
const TROCA_DEPOIS_PT = 'Uma foto e um áudio.';

/**
 * O que está sendo riscado, dito em COISAS e não em contagem.
 *
 * Era "R$ 8.000 a 10.500/mês, 25 contratações", e o dono recusou o número: 25
 * contratações é um total de inventário, e ninguém sente um total. Uma agência
 * sente. Tráfego pago sente — é uma linha que a pessoa reconhece do próprio
 * extrato. A lista completa está logo acima, no painel escuro, contada uma a
 * uma; aqui embaixo o que precisa aparecer são as duas ou três que doem mais.
 */
const TROCA_ANTES_PT = 'uma agência, tráfego pago…';

/**
 * A frase de onde sai o fio até o formulário.
 *
 * PENDENTE-DONO: redação minha a partir do insight do dono — o hero mostra uma
 * foto e uma voz correndo por um fio até o vídeo pronto, e aqui a última entrada
 * que falta é a pessoa. A frase e o fio dizem a mesma coisa, e é por isso que
 * ela é curta: o desenho já fez metade do trabalho.
 */
const FALTA_PT = ['Falta uma coisa:', 'você.'];

/**
 * A garantia, copiada palavra por palavra do hero.
 *
 * Se a frase mudar, tem de mudar nos dois lugares no mesmo commit: duas versões
 * da mesma promessa leem como duas promessas, e uma delas vai parecer a letra
 * miúda da outra.
 */
const GARANTIA_PT = ['Um milhão de views.', 'Ou seu dinheiro de volta.'];

/**
 * O QUE OS R$ 100 COMPRAM, e a redação inteira é reenquadramento do dono.
 *
 * Ela dizia "simbólicos, e é filtro", com o corpo explicando que não era o preço
 * do diagnóstico e sim o que fazia a Doxa conversar só com quem já decidiu. O
 * dono recusou o enquadramento inteiro, e ele estava certo por uma razão que
 * vale mais do que gosto: FILTRO é uma palavra sobre o vendedor. Ela explica por
 * que a empresa cobra, não o que o cliente leva. Numa tela em que a pessoa está
 * decidindo gastar dinheiro, a única pergunta que importa é a segunda.
 *
 * Agora os cem reais têm um objeto: eles marcam a Auditoria Estratégica Doxa —
 * o mesmo nome que abre o cartão, em `AUDITORIA`. O formulário deixa de cobrar
 * para conversar e passa a cobrar por uma coisa que tem nome, hora e gente do
 * outro lado.
 *
 * ATENÇÃO ao verbo, e a nota é a mesma de antes com mais motivo agora: o que a
 * página prometer por esses cem reais passa a ser serviço contratado. "Marcar" e
 * "olhar o seu perfil" são promessas que uma reunião de trinta minutos cumpre.
 * "Diagnóstico completo" ou "plano de conteúdo" não são — e a diferença entre as
 * duas é o consultor entrando na chamada devendo ou entregando. Prometer menos e
 * entregar mais continua sendo a única direção segura aqui.
 *
 * Se este par mudar, o rótulo do botão em `Formulario.tsx` muda junto: ele diz
 * "Pagar R$ 100 e agendar", e é a mesma promessa dita uma terceira vez.
 */
const FILTRO_PT = {
  valor: 'R$ 100',
  titulo: 'para marcar a auditoria estratégica.',
  corpo:
    'Uma reunião com o time Doxa. A gente olha o seu perfil antes e chega com a conversa pronta.',
};

/** O título do passo do pagamento. Diz o que falta, e o que falta é marcar. */
const PAGAMENTO_TITULO_PT = 'Falta marcar a reunião.';

/**
 * O rótulo do botão que cobra, e a redação é do dono.
 *
 * Era "Pagar R$ 100 e agendar" — o botão dizia o preço e o que acontecia. Agora
 * diz o DESEJO, que é o registro do resto da página.
 *
 * ATENÇÃO, e fica registrado porque não é detalhe: este é o último elemento que
 * a pessoa toca antes de ser cobrada, e ele deixou de nomear a cobrança. O que
 * segura a transparência agora é a vizinhança — o `FILTRO` mostra "R$ 100" em
 * serifa de 2,4rem logo acima, e o `PAGAMENTO_CHAMADA` diz "complete o
 * pagamento" entre os dois. Se um dia o valor sair de perto do botão, este
 * rótulo volta a precisar do número.
 *
 * SEGUNDO PENDENTE: "meu perfil" fala com quem escolheu "Quero viralizar minha
 * empresa" no primeiro passo. Para quem escolheu "Quero ser uma agência
 * licenciada", a frase não descreve o que a pessoa quer. O formulário já sabe a
 * resposta (`dados.caminho`) — se o dono quiser, o rótulo passa a ter duas
 * versões pelo mesmo caminho que separa as duas conversas.
 */
const PAGAMENTO_ACAO_PT = 'Viralizar meu perfil';

/**
 * O nome do que a pessoa está preenchendo, decidido pelo dono.
 *
 * Em caixa de frase, a pedido dele — só a primeira letra, e o nome próprio. Ele
 * já foi versalete desenhado por CSS, e o argumento de então (nunca escrever em
 * caixa alta no arquivo, porque leitor de tela soletra o que parece sigla) segue
 * valendo e agora é de graça.
 *
 * O que mudou junto foi a natureza da linha. Versalete a 11px é ETIQUETA, e
 * etiqueta se lê de raspão; em serifa grande, com a fita do FAQ correndo por
 * dentro das letras, ela virou o TÍTULO do cartão — e é o mesmo nome que o passo
 * do pagamento usa para dizer o que os R$ 100 marcam.
 */
const AUDITORIA_PT = 'Auditoria estratégica Doxa';

/**
 * O que os R$ 100 compram, dito no passo em que se paga.
 *
 * PENDENTE-DONO: a frase é dele, palavra por palavra. Ela entra ABAIXO do título
 * do passo e não no lugar: aquela linha é o nome do passo e cabe na serifa
 * grande; esta é a instrução, e instrução em corpo de manchete lê como anúncio.
 *
 * ATENÇÃO: isto é promessa pública. "Agendar uma reunião" obriga a existir uma
 * reunião agendada — não um contato, não um retorno. `RETORNO`, logo abaixo, foi
 * alinhado a ela: as duas telas prometiam coisas diferentes na mesma passagem.
 */
const PAGAMENTO_CHAMADA_PT =
  'Complete o pagamento para agendar uma reunião com o time Doxa.';

/**
 * O que acontece depois de pagar. Vai na tela de sucesso e ao lado do botão.
 *
 * Reescrito junto com o resto: dizia "um consultor entra em contato em até 24
 * horas" enquanto a tela anterior prometia "agendar uma reunião". Eram duas
 * promessas diferentes na mesma passagem — contato não é reunião marcada, e
 * quem pagou ia cobrar a que leu por último.
 */
const RETORNO_PT = 'O time Doxa chama você em até 24 horas para marcar a sua auditoria.';

/** As formas de pagamento, listadas antes de existirem de verdade. */
const PAGAMENTOS_PT = ['Pix', 'Cartão', 'Apple Pay', 'Google Pay'];

/** A opção que abre um campo em vez de responder sozinha. */
const OUTRO_PT = 'Outro';

export interface PerguntaFicha {
  /*
   * Três perguntas de contexto, e eram cinco.
   *
   * Saíram "o que você quer que os vídeos façam?" e "você aparece nos vídeos?",
   * a pedido do dono. As duas eram boas perguntas de BRIEFING e ruins de
   * qualificação: a resposta muda o roteiro, não muda se a conversa acontece —
   * e cada pergunta no meio do funil custa gente que desiste. As duas voltam a
   * ser feitas pelo consultor, na ligação, onde elas valem mais.
   */
  chave: 'segmento' | 'objetivo' | 'faturamento' | 'trava';
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
const FICHA_PT: readonly PerguntaFicha[] = [
  {
    chave: 'segmento',
    rotulo: 'Nicho',
    pergunta: 'Qual é o nicho da sua empresa?',
    dica: 'Para o consultor chegar sabendo do que se trata.',
    opcoes: [
      'Advocacia',
      'Saúde e estética',
      'Imóveis',
      'Educação e cursos',
      'Alimentação',
      'Varejo e e-commerce',
      'Serviços para empresas',
      OUTRO_PT,
    ],
    livre: 'Qual é o nicho da sua empresa',
  },
  {
    chave: 'objetivo',
    rotulo: 'Objetivo',
    pergunta: 'Qual o seu objetivo com nossos vídeos?',
    dica: 'É o que decide o roteiro. Uma resposta só.',
    /*
     * Objetivos de NEGÓCIO, e não de vaidade.
     *
     * Nenhuma opção fala em views, seguidor ou alcance — a página inteira
     * promete um milhão de views, e repetir isso aqui devolveria como pergunta
     * o que já foi dado como garantia. O que o consultor não sabe é para ONDE a
     * pessoa quer que essas views vão, e é isso que muda o roteiro: quem quer
     * vender pede prova e oferta; quem quer autoridade pede opinião e rosto.
     *
     * Uma só, e não múltipla como a trava: perguntar "o objetivo" e aceitar
     * quatro devolve uma lista de desejos em vez de uma prioridade — e é a
     * prioridade que o roteirista precisa para escolher o que fica de fora.
     *
     * PENDENTE-DONO: a lista é minha, tirada do que a página promete. Ele vai
     * saber a certa depois de cinquenta leads, e `OUTRO` é a válvula até lá.
     */
    opcoes: [
      'Vender mais',
      'Gerar leads para o time comercial',
      'Virar autoridade no meu nicho',
      'Fazer a marca ser conhecida',
      'Lançar um produto ou serviço',
      OUTRO_PT,
    ],
    livre: 'Qual é o seu objetivo',
  },
  {
    chave: 'faturamento',
    rotulo: 'Faturamento',
    pergunta: 'Quanto a empresa fatura hoje?',
    dica: 'Por faixa, e fica entre nós. É o que dimensiona a proposta.',
    /*
     * A escada do faturamento, refeita a pedido do dono.
     *
     * Saiu o "até 20 mil" — abaixo do budget mínimo, essa empresa já não passa
     * do corte — e saiu o "prefiro não dizer", que era uma saída sem custo para
     * a única pergunta que dimensiona a proposta.
     *
     * E o topo deixou de ser um teto: "mais de 200 mil" juntava numa pílula só
     * a empresa de trezentos mil e a de cinco milhões, que são duas conversas
     * comerciais completamente diferentes. Agora a escada sobe até "mais de 5
     * milhões", e é lá em cima que ela ganha degraus.
     */
    opcoes: [
      'Até R$ 50 mil',
      'R$ 50 a 200 mil',
      'R$ 200 a 500 mil',
      'R$ 500 mil a R$ 1 milhão',
      'R$ 1 a 3 milhões',
      'R$ 3 a 5 milhões',
      'Mais de R$ 5 milhões',
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
];

/** O fecho da ficha, depois da última pergunta. */
const FICHA_FIM_PT = {
  titulo: 'Agora sim.',
  corpo: 'O consultor lê isto antes de te chamar. A conversa começa do meio.',
};

/**
 * ─── A PERGUNTA DE CORTE ─────────────────────────────────────────────────────
 *
 * Quanto a pessoa consegue investir por mês. É a única pergunta do formulário
 * que pode ENCERRÁ-LO, e é do dono a decisão de tê-la.
 *
 * O que ela compra: o consultor deixa de gastar a primeira ligação descobrindo
 * que não há orçamento. O que ela custa: uma parte das pessoas sai da página
 * sabendo que não é para elas — e essa é exatamente a intenção, dita na cara em
 * vez de descoberta depois de duas conversas.
 *
 * As faixas são estreitas embaixo e largas em cima porque é embaixo que a
 * decisão acontece: a diferença entre mil e mil e quinhentos muda a resposta do
 * consultor, a diferença entre quatro e cinco mil não muda quase nada.
 *
 * A ORDEM IMPORTA e é lida por código: a primeira faixa é a que desqualifica —
 * `CORTE` aponta para ela por índice, então mexer na ordem sem mexer no corte
 * passa a barrar a faixa errada em silêncio.
 */
const INVESTIMENTO_PT = {
  rotulo: 'Budget',
  pergunta: 'Qual é o seu budget mensal?',
  dica: 'Por faixa. É o que define se a Doxa cabe no seu momento.',
  /*
   * CINCO faixas, a pedido do dono, e com um buraco fechado.
   *
   * Ele ditou "abaixo de 1000, entre 1000 e 2000, entre 3000 e 4000, entre
   * 4000 e 5000, acima de 5k" — cinco itens, mas com a faixa dos dois aos três
   * mil faltando. Uma escada com degrau faltando não é detalhe: quem consegue
   * dois mil e quinhentos não tem em que clicar, e o formulário trava no passo
   * que existe para não travar ninguém.
   *
   * Fechado esticando a faixa do meio até quatro mil. Quatro dos cinco rótulos
   * são os dele, palavra por palavra; o terceiro é o que cobre o vão. Se a
   * intenção era outra — separar 2–3 e 3–4 e juntar em cima —, é trocar esta
   * lista e a tabela de `INVESTIMENTO` em `leads/score.ts`, que lê os mesmos
   * textos.
   */
  faixas: [
    'Abaixo de R$ 1.000',
    'R$ 1.000 a R$ 2.000',
    'R$ 2.000 a R$ 4.000',
    'R$ 4.000 a R$ 5.000',
    'Mais de R$ 5.000',
  ],
} as const;

/** A faixa que encerra o formulário. Índice, e não texto repetido. */
export const CORTE = 0;

/**
 * O fim da linha para quem ficou abaixo da faixa.
 *
 * PENDENTE-DONO: a redação é minha, e vale a leitura dele — é a única tela do
 * site que diz não a alguém. Escrita para não humilhar e para não enganar:
 * agradece, diz que é uma questão de MOMENTO e não de mérito, e não promete
 * uma ligação que não vai acontecer. A porta fica encostada, não trancada.
 *
 * Nenhum botão aqui. Um "voltar" convidaria a pessoa a trocar a resposta para
 * passar no filtro, e um filtro que se contorna não filtra nada.
 */
const DESQUALIFICADO_PT = {
  titulo: 'Obrigado pela sinceridade.',
  corpo:
    'A Doxa não se encaixa no seu momento — o nosso trabalho começa numa faixa acima dessa, e prometer o contrário seria custar o seu dinheiro para nada.',
  fecho: 'Quando a operação crescer, a porta continua aqui.',
};

/** O convite para responder a ficha, na tela de confirmação. */
const FICHA_CONVITE_PT = {
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

/*
 * ─── A MESMA SEÇÃO, EM INGLÊS ────────────────────────────────────────────────
 *
 * Cada constante daqui é o ESPELHO da sua irmã `_PT`: mesma estrutura, mesma
 * ordem, mesmo comprimento de lista. A ordem não é estética — o formulário
 * grava a resposta CANÔNICA em português achando o índice da opção clicada na
 * lista do idioma da tela, e uma lista fora de ordem gravaria a resposta
 * errada sem nenhum erro no console. Quem mexer numa lista mexe nas duas.
 *
 * O espanhol recebe o PORTUGUÊS de propósito: a copy ES é um card próprio, e
 * até lá quem escolhe Español lê o original — que é exatamente o que o site
 * fazia ontem. `PorIdioma` obriga a chave a existir; apontá-la para o PT é o
 * que mantém o compilador cobrando os três idiomas sem inventar uma tradução
 * que ninguém revisou.
 */

const ITENS_EN: readonly Item[] = [
  { nome: 'A videographer.', icone: 'Video', cor: '#E2542C' },
  { nome: 'A scriptwriter.', icone: 'PenLine', cor: '#F0B429' },
  { nome: 'A video editor.', icone: 'Scissors', cor: '#3FA06A' },
  { nome: 'A social media manager.', icone: 'AtSign', cor: '#2E86C1' },
  { nome: 'A creative director.', icone: 'Megaphone', cor: '#B8449C' },
  { nome: 'A camera.', icone: 'Camera', cor: '#E0453F' },
  { nome: 'Lenses.', icone: 'Aperture', cor: '#D98E4A' },
  { nome: 'A tripod.', icone: 'Wrench', cor: '#3FA06A' },
  { nome: 'A lav mic.', icone: 'Mic', cor: '#2E86C1' },
  { nome: 'A gimbal.', icone: 'Move', cor: '#E2542C' },
  { nome: 'Memory cards.', icone: 'HardDrive', cor: '#B8449C' },
  { nome: 'A studio.', icone: 'Building2', cor: '#F0B429' },
  { nome: 'Lighting.', icone: 'Lightbulb', cor: '#D98E4A' },
  { nome: 'A set.', icone: 'Frame', cor: '#E0453F' },
  { nome: 'Hours of filming.', icone: 'Timer', cor: '#2E86C1' },
  { nome: 'An edit bay.', icone: 'MonitorPlay', cor: '#3FA06A' },
  { nome: 'An editing license.', icone: 'KeyRound', cor: '#F0B429' },
  { nome: 'A music library.', icone: 'Music', cor: '#B8449C' },
  { nome: 'A stock image library.', icone: 'ImageIcon', cor: '#E2542C' },
  { nome: 'Captioning.', icone: 'Subtitles', cor: '#D98E4A' },
  { nome: 'An agency.', icone: 'Users', cor: '#E0453F' },
  { nome: 'A media buyer.', icone: 'Target', cor: '#2E86C1' },
  { nome: 'A paid media budget.', icone: 'Wallet', cor: '#3FA06A' },
  { nome: 'A content calendar.', icone: 'CalendarDays', cor: '#F0B429' },
  { nome: 'Reports.', icone: 'BarChart3', cor: '#B8449C' },
];

const SEM_GARANTIA_EN = ['And still,', 'no guarantee of going viral.'];
const TEMPO_EN: Item = { nome: 'And your time.', icone: 'Hourglass', cor: '#F4F1E8' };
const CUSTO_UNIDADE_EN = '/mo';
const PERGUNTA_EN = ['What does it cost to NOT have Doxa', 'in your business?'];
const PERGUNTA_ESTREITA_EN = ['What does it cost to NOT', 'have Doxa in your business?'];
const CONVITE_EN = ['You cut the whole bill.', 'And still go viral.'];
const TROCA_DEPOIS_EN = 'One photo and one audio clip.';
const TROCA_ANTES_EN = 'an agency, paid media…';
const FALTA_EN = ["One thing's missing:", 'you.'];
const GARANTIA_EN = ['One million views.', 'Or your money back.'];

const FILTRO_EN = {
  valor: 'R$ 100',
  titulo: 'to book your strategic audit.',
  corpo:
    'A meeting with the Doxa team. We review your profile beforehand and come ready to talk.',
};
const PAGAMENTO_TITULO_EN = 'One thing left: book the meeting.';
const PAGAMENTO_ACAO_EN = 'Take my profile viral';
const AUDITORIA_EN = 'Doxa strategic audit';
const PAGAMENTO_CHAMADA_EN = 'Complete the payment to book a meeting with the Doxa team.';
const RETORNO_EN = 'The Doxa team will reach out within 24 hours to book your audit.';
const PAGAMENTOS_EN = ['Pix', 'Card', 'Apple Pay', 'Google Pay'];
const OUTRO_EN = 'Other';

const FICHA_EN: readonly PerguntaFicha[] = [
  {
    chave: 'segmento',
    rotulo: 'Niche',
    pergunta: 'What niche is your business in?',
    dica: 'So the consultant shows up knowing what it is about.',
    opcoes: [
      'Law',
      'Health & aesthetics',
      'Real estate',
      'Education & courses',
      'Food & beverage',
      'Retail & e-commerce',
      'B2B services',
      OUTRO_EN,
    ],
    livre: 'What niche is your business in',
  },
  {
    chave: 'objetivo',
    rotulo: 'Goal',
    pergunta: 'What is your goal with our videos?',
    dica: 'It decides the script. Pick one.',
    opcoes: [
      'Sell more',
      'Generate leads for the sales team',
      'Become an authority in my niche',
      'Get the brand known',
      'Launch a product or service',
      OUTRO_EN,
    ],
    livre: 'What is your goal',
  },
  {
    chave: 'faturamento',
    rotulo: 'Revenue',
    pergunta: 'What is the business revenue today?',
    dica: 'By range, and it stays between us. It sizes the proposal.',
    opcoes: [
      'Up to R$ 50k',
      'R$ 50k to 200k',
      'R$ 200k to 500k',
      'R$ 500k to R$ 1M',
      'R$ 1M to 3M',
      'R$ 3M to 5M',
      'Over R$ 5M',
    ],
  },
  {
    chave: 'trava',
    rotulo: 'Blocker',
    pergunta: 'What is stopping you from posting today?',
    dica: 'Pick as many as apply.',
    opcoes: [
      'I do not have time',
      'I do not know what to say',
      'I do not like being on camera',
      'I paid an agency before and it did not work',
      'I do not have a team',
    ],
    multipla: true,
  },
];

const FICHA_FIM_EN = {
  titulo: "Now we're talking.",
  corpo: 'The consultant reads this before calling you. The conversation starts halfway in.',
};

const INVESTIMENTO_EN = {
  rotulo: 'Budget',
  pergunta: 'What is your monthly budget?',
  dica: 'By range. It tells us whether Doxa fits your moment.',
  faixas: [
    'Under R$ 1,000',
    'R$ 1,000 to R$ 2,000',
    'R$ 2,000 to R$ 4,000',
    'R$ 4,000 to R$ 5,000',
    'Over R$ 5,000',
  ],
} as const;

const DESQUALIFICADO_EN = {
  titulo: 'Thank you for being honest.',
  corpo:
    'Doxa is not the right fit for your moment — our work starts a tier above that range, and promising otherwise would cost you money for nothing.',
  fecho: 'When the operation grows, the door is still here.',
};

const FICHA_CONVITE_EN = {
  titulo: 'Meanwhile: five questions.',
  corpo: 'So the consultant does not show up cold to your call. Takes a minute.',
  botao: 'Answer',
};

/* ─── OS PARES EXPORTADOS ───────────────────────────────────────────────────── */

export const ITENS: PorIdioma<readonly Item[]> = { pt: ITENS_PT, en: ITENS_EN};
export const SEM_GARANTIA: PorIdioma<readonly string[]> = {
  pt: SEM_GARANTIA_PT, en: SEM_GARANTIA_EN,
};
export const TEMPO: PorIdioma<Item> = { pt: TEMPO_PT, en: TEMPO_EN};
export const CUSTO_UNIDADE: PorIdioma<string> = {
  pt: CUSTO_UNIDADE_PT, en: CUSTO_UNIDADE_EN,
};
export const PERGUNTA: PorIdioma<readonly string[]> = {
  pt: PERGUNTA_PT, en: PERGUNTA_EN,
};
export const PERGUNTA_ESTREITA: PorIdioma<readonly string[]> = {
  pt: PERGUNTA_ESTREITA_PT, en: PERGUNTA_ESTREITA_EN,
};
export const CONVITE: PorIdioma<readonly string[]> = {
  pt: CONVITE_PT, en: CONVITE_EN,
};
export const TROCA_DEPOIS: PorIdioma<string> = {
  pt: TROCA_DEPOIS_PT, en: TROCA_DEPOIS_EN,
};
export const TROCA_ANTES: PorIdioma<string> = {
  pt: TROCA_ANTES_PT, en: TROCA_ANTES_EN,
};
export const FALTA: PorIdioma<readonly string[]> = { pt: FALTA_PT, en: FALTA_EN};
export const GARANTIA: PorIdioma<readonly string[]> = {
  pt: GARANTIA_PT, en: GARANTIA_EN,
};
export const FILTRO: PorIdioma<typeof FILTRO_PT> = { pt: FILTRO_PT, en: FILTRO_EN};
export const PAGAMENTO_TITULO: PorIdioma<string> = {
  pt: PAGAMENTO_TITULO_PT, en: PAGAMENTO_TITULO_EN,
};
export const PAGAMENTO_ACAO: PorIdioma<string> = {
  pt: PAGAMENTO_ACAO_PT, en: PAGAMENTO_ACAO_EN,
};
export const AUDITORIA: PorIdioma<string> = {
  pt: AUDITORIA_PT, en: AUDITORIA_EN,
};
export const PAGAMENTO_CHAMADA: PorIdioma<string> = {
  pt: PAGAMENTO_CHAMADA_PT, en: PAGAMENTO_CHAMADA_EN,
};
export const RETORNO: PorIdioma<string> = { pt: RETORNO_PT, en: RETORNO_EN};
export const PAGAMENTOS: PorIdioma<readonly string[]> = {
  pt: PAGAMENTOS_PT, en: PAGAMENTOS_EN,
};
export const OUTRO: PorIdioma<string> = { pt: OUTRO_PT, en: OUTRO_EN};
export const FICHA: PorIdioma<readonly PerguntaFicha[]> = {
  pt: FICHA_PT, en: FICHA_EN,
};
export const FICHA_FIM: PorIdioma<typeof FICHA_FIM_PT> = {
  pt: FICHA_FIM_PT, en: FICHA_FIM_EN,
};
/** A forma da pergunta de corte — o `as const` do PT congelaria os literais. */
interface Investimento {
  rotulo: string;
  pergunta: string;
  dica: string;
  faixas: readonly string[];
}

export const INVESTIMENTO: PorIdioma<Investimento> = {
  pt: INVESTIMENTO_PT, en: INVESTIMENTO_EN,
};
export const DESQUALIFICADO: PorIdioma<typeof DESQUALIFICADO_PT> = {
  pt: DESQUALIFICADO_PT, en: DESQUALIFICADO_EN,
};
export const FICHA_CONVITE: PorIdioma<typeof FICHA_CONVITE_PT> = {
  pt: FICHA_CONVITE_PT, en: FICHA_CONVITE_EN,
};
