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
 */
export const PECAS: readonly Peca[] = [
  { nome: 'Video\nmaker', forma: 'circulo', cor: '#E2542C', lado: 118 },
  { nome: 'Roteirista', forma: 'quadrado', cor: '#EFC04A', lado: 106 },
  { nome: 'Editor de\nvídeo', forma: 'pentagono', cor: '#4E9E6A', lado: 126 },
  { nome: 'Horas de\nestúdio', forma: 'estrela', cor: '#3C7FA8', lado: 150 },
  { nome: 'Gravar\nconteúdo', forma: 'hexagono', cor: '#EDE9DC', lado: 122 },
  { nome: 'Agência de\nmarketing', forma: 'asterisco', cor: '#A9569F', lado: 142 },
  { nome: 'Tráfego\npago', forma: 'losango', cor: '#CF4747', lado: 128 },
  { nome: 'O seu\ntempo', forma: 'circulo', cor: '#F4F1E8', lado: 156, destaque: true },
];

/**
 * PENDENTE-DONO — este número não está resolvido, e ele sustenta a seção
 * inteira.
 *
 * Aqui está "R$ 5.000 a 8.000", que foi o que o dono falou por último. O
 * `src/components/semcom/config.ts` diz `R$ 10.500`. Os dois não podem estar
 * certos ao mesmo tempo, e num comparativo o número é a coisa toda: se o
 * visitante achar que está inflado, ele perde a seção e leva a página junto.
 */
export const CUSTO = 'R$ 5.000 a 8.000';
export const CUSTO_UNIDADE = '/mês';

/**
 * A recorrência, dita duas vezes de propósito — no sufixo do número e aqui.
 *
 * O dono pediu destaque para ela, e o motivo é comercial: um custo mensal lido
 * como se fosse único é a diferença entre a conta parecer cara e parecer
 * enorme. "Todo mês" é o que transforma um preço em uma sangria.
 */
export const RECORRENCIA = 'Todo mês. E de novo no mês seguinte.';

/** O que se envia. É a única coisa que o cliente faz. */
export const ENVIO = ['Uma foto', 'e um áudio.'];

/**
 * A garantia, copiada palavra por palavra do hero.
 *
 * Se a frase mudar, tem de mudar nos dois lugares no mesmo commit: duas versões
 * da mesma promessa leem como duas promessas, e uma delas vai parecer a letra
 * miúda da outra.
 */
export const GARANTIA = ['Um milhão de views.', 'Ou seu dinheiro de volta.'];

/** PENDENTE-DONO: título meu, na estrutura paralela do resto do site. */
export const TITULO = ['Sete contratações.', 'Ou uma foto e um áudio.'];
export const APOIO = 'A Doxa entra no lugar da equipe inteira de conteúdo.';
