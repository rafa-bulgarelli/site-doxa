/**
 * Conteúdo do dono da seção de comparação. Tudo que é número ou texto de
 * negócio mora aqui — o resto dos arquivos só sabe desenhar.
 */

export interface Peca {
  /** O papel que hoje se contrata. */
  nome: string;
}

/**
 * As sete contratações que a Doxa substitui, ditadas pelo dono.
 *
 * A QUANTIDADE é parte do argumento: "sete contratações" está no título, e cada
 * peça tem uma cor em `Blocos.tsx`. Mexer nesta lista mexe nos dois.
 */
export const PECAS: readonly Peca[] = [
  { nome: 'Video maker' },
  { nome: 'Roteirista' },
  { nome: 'Editor de vídeo' },
  { nome: 'Horas de estúdio' },
  { nome: 'Gravar conteúdo' },
  { nome: 'Agência de marketing' },
  { nome: 'Tráfego pago' },
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
export const CUSTO_NOTA = 'mais o seu tempo';

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
