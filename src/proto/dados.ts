/**
 * Conteúdo dos protótipos da seção de comparação.
 *
 * PENDENTE-DONO: os itens são a lista do dono, ditada na conversa. Os dois
 * números abaixo NÃO estão resolvidos e são o que sustenta a seção inteira:
 *
 * - O custo mensal aqui é "R$ 5.000 a 8.000", que foi o que ele falou por
 *   último. O `src/components/semcom/config.ts` diz `R$ 10.500`. Os dois não
 *   podem estar certos, e num comparativo o número é a coisa toda: se o
 *   visitante achar que está inflado, ele perde a seção e leva a página junto.
 * - A garantia está copiada palavra por palavra do hero. Se a frase mudar, tem
 *   de mudar nos dois lugares ao mesmo tempo — duas versões da mesma promessa
 *   leem como duas promessas.
 */

export interface Item {
  /** O papel que hoje se contrata. */
  nome: string;
  /** O que ele é na conta de quem não tem Doxa. */
  sem: string;
  /** O que ele vira com Doxa. */
  com: string;
}

export const ITENS: readonly Item[] = [
  { nome: 'Video maker', sem: 'contratado', com: 'incluso' },
  { nome: 'Roteirista', sem: 'contratado', com: 'incluso' },
  { nome: 'Editor de vídeo', sem: 'contratado', com: 'incluso' },
  { nome: 'Horas de estúdio', sem: 'alugadas', com: 'não precisa' },
  { nome: 'Gravar conteúdo', sem: 'o seu tempo', com: 'não precisa' },
  { nome: 'Agência de marketing', sem: 'contratada', com: 'não precisa' },
  { nome: 'Tráfego pago', sem: 'todo mês', com: 'a gente é o orgânico' },
];

export const SEM = {
  titulo: 'Sem Doxa',
  valor: 'R$ 5.000 a 8.000',
  nota: 'por mês, e o seu tempo',
};

export const COM = {
  titulo: 'Com Doxa',
  valor: 'Uma foto e um áudio de 30s',
  nota: 'Um milhão de views. Ou seu dinheiro de volta.',
};

/** PENDENTE-DONO: título meu, na estrutura paralela do resto do site. */
export const TITULO = ['Sete contratações.', 'Ou uma foto e um áudio.'];
