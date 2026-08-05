/**
 * Conteúdo do dono da seção de comparação. Tudo que é número ou texto de
 * negócio mora aqui — o resto dos arquivos só sabe desenhar.
 */

export type Forma =
  | 'circulo'
  | 'quadrado'
  | 'pentagono'
  | 'estrela'
  | 'hexagono'
  | 'losango'
  | 'asterisco';

export interface Peca {
  /** O papel que hoje se contrata. `\n` quebra a linha dentro da forma. */
  nome: string;
  forma: Forma;
  cor: string;
  /** Lado do corpo, em pixels. É o que enche o palco — ver `Blocos.tsx`. */
  lado: number;
  /** A peça que a seção quer que doa mais. Uma só, senão nenhuma. */
  destaque?: boolean;
}

/**
 * As sete contratações que a Doxa substitui, mais o tempo do dono da empresa.
 *
 * A QUANTIDADE das contratações é parte do argumento — "sete contratações" está
 * no título. O tempo é a oitava peça e não conta para esse sete: ele não se
 * contrata, e é por isso que ele é o destaque. Era uma linha de rodapé
 * ("mais o seu tempo") e virou objeto a pedido do dono, o que é a leitura certa:
 * numa pilha de coisas que se pagam, a que não se compra tem de ser a maior.
 *
 * Cada peça tem forma e cor próprias, ditadas pelo dono. É exceção à regra
 * monocromática do `tailwind.config.js`, e defensável: cada uma é um FORNECEDOR,
 * gente de fora, e a página já abre essa exceção para o azul e o vermelho do
 * Instagram na parede de prova. Cor aqui diz "isto não é a Doxa" sem escrever.
 *
 * A paleta é uma FAMÍLIA, não sete cores soltas: todas na mesma faixa de
 * luminosidade e com o croma puxado para baixo, o que faz sete matizes diferentes
 * lerem como um conjunto em vez de um arco-íris. A primeira versão usava as
 * cores no talo e o dono chamou de desarmônica — com razão: cor saturada em
 * quantidade não tem hierarquia, e sem hierarquia não há harmonia.
 *
 * Os lados também vieram para uma escala curta (114 a 146). Sete tamanhos
 * arbitrários é ruído; a variação que sobrou existe só para compensar o que cada
 * recorte come — uma estrela de 146 tem a mesma mancha que um círculo de 118.
 */
export const PECAS: readonly Peca[] = [
  { nome: 'Video\nmaker', forma: 'circulo', cor: '#C25A3C', lado: 118 },
  { nome: 'Roteirista', forma: 'quadrado', cor: '#D8A13F', lado: 114 },
  { nome: 'Editor de\nvídeo', forma: 'pentagono', cor: '#5A8C63', lado: 126 },
  { nome: 'Horas de\nestúdio', forma: 'estrela', cor: '#43708F', lado: 146 },
  { nome: 'Gravar\nconteúdo', forma: 'hexagono', cor: '#8E5F86', lado: 124 },
  { nome: 'Agência de\nmarketing', forma: 'asterisco', cor: '#B04B45', lado: 140 },
  { nome: 'Tráfego\npago', forma: 'losango', cor: '#C7A98B', lado: 134 },
  { nome: 'O seu\ntempo', forma: 'circulo', cor: '#F4F1E8', lado: 150, destaque: true },
];

/**
 * O custo do jeito antigo, resolvido pelo dono nesta rodada.
 *
 * Era a divergência mais cara do repositório — `semcom/config.ts` dizia
 * R$ 10.500 e esta seção dizia R$ 5.000 a 8.000. Os dois foram para a faixa
 * abaixo no mesmo commit. Se este número mudar de novo, os dois arquivos mudam
 * juntos: num comparativo o número é a coisa toda, e a página não pode dizer
 * dois valores para o mesmo custo.
 */
export const CUSTO = 'R$ 8.000 a 10.500';
export const CUSTO_UNIDADE = '/mês';

/**
 * A recorrência, dita duas vezes de propósito — no sufixo do número e aqui.
 *
 * Um custo mensal lido como se fosse único é a diferença entre a conta parecer
 * cara e parecer enorme. "Todo mês" é o que transforma um preço em uma sangria.
 */
export const RECORRENCIA = 'Todo mês. E de novo no mês seguinte.';

/**
 * As duas falas dos dois painéis.
 *
 * PENDENTE-DONO: reescrita minha da opção C do dono. "Quanto custa não ter
 * Doxa?" fazia a marca aparecer pelo negativo; assim a pergunta é sobre ELE. E
 * nenhuma das duas frases fala do produto: uma fala do custo dele, a outra do
 * desejo dele. A virada de preto para creme é que responde.
 */
export const PERGUNTA = ['Quanto custa', 'continuar assim?'];
export const CONVITE = 'Pronto para viralizar?';

/** O que se envia. É a única coisa que o cliente faz. */
export const ENVIO = 'Uma foto e um áudio. O resto é com a Doxa.';

/**
 * A garantia, copiada palavra por palavra do hero.
 *
 * Se a frase mudar, tem de mudar nos dois lugares no mesmo commit: duas versões
 * da mesma promessa leem como duas promessas, e uma delas vai parecer a letra
 * miúda da outra.
 */
export const GARANTIA = ['Um milhão de views.', 'Ou seu dinheiro de volta.'];

/** O que se ganha ao clicar, para o botão não ser um salto no escuro. */
export const CUSTO_DO_CLIQUE = 'Leva menos de um minuto.';
