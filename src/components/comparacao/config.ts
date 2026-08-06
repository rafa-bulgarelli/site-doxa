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
 * O rótulo do bloco da lista, e o que ele faz pela seção.
 *
 * A seção JÁ é uma conta; dar a ela a forma de uma é o que tira o painel do
 * genérico. Com este rótulo e com os itens numerados, o bloco deixa de ser "um
 * texto grande" e passa a ser um documento — e um documento é sério de um jeito
 * que uma frase solta não é.
 */
export const FATURA = 'Para fazer sozinho, você precisa de';

/** Quantos itens a conta tem, contados e nunca escritos à mão. */
export const TOTAL_ITENS = ITENS.length;

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
 * O convite, e a ORDEM dele é o pedido do dono.
 *
 * Era "Pronto para viralizar?", que é o fim da história contada primeiro. Com a
 * Doxa dentro da empresa acontecem duas coisas, e nesta sequência: a conta cai,
 * e depois vêm as views. O título agora diz as duas na ordem em que elas
 * acontecem — e é a mesma ordem em que a coluna abaixo dele está escrita, com o
 * custo riscado antes da garantia.
 */
export const CONVITE = ['Corta a conta.', 'Depois viraliza.'];

/**
 * O que se faz AGORA, que é diferente do que se faz depois.
 *
 * Falava do produto — "você manda uma foto e um áudio" —, e o dono corrigiu: a
 * foto e o áudio são o que acontece depois de fechar. Nesta tela, ao lado de um
 * formulário aberto, a única ação que existe é preencher o formulário. Uma
 * frase que descreve a etapa seguinte, colada na etapa atual, manda a pessoa
 * pensar em algo que ela ainda não pode fazer.
 */
export const ENVIO = 'Preencha aqui do lado. Um consultor fala com você em até 24 horas.';

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
export const TROCA_ANTES = 'uma agência, tráfego pago e um estúdio';

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

/** O que acontece depois de pagar. Vai na tela de sucesso e ao lado do botão. */
export const RETORNO = 'Um consultor entra em contato em até 24 horas.';

/** As formas de pagamento, listadas antes de existirem de verdade. */
export const PAGAMENTOS = ['Pix', 'Cartão', 'Apple Pay', 'Google Pay'];
