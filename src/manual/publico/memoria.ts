/**
 * ─── O COMPROVANTE NA MÃO ────────────────────────────────────────────────────
 *
 * O que a tela de conclusão precisa saber depois que a rota já mudou para
 * `/manual-doxa/concluido`. Vive na memória do MÓDULO, e só.
 *
 * Não é `localStorage` de propósito: a `pdf_url` é assinada e dura minutos —
 * guardada no disco do navegador ela vira um link morto que promete um
 * documento e entrega um erro, no celular de um cliente, dias depois. E o
 * `aceite_id` é a chave de uma prova jurídica: ela não tem por que sobreviver
 * ao fechamento da aba.
 *
 * Consequência aceita: recarregar `/concluido` esvazia isto e a tela cai na
 * confirmação genérica, que manda reabrir o link do convite — e o `abrir` de um
 * convite concluído devolve o aceite e o botão de baixar de novo. O caminho de
 * volta existe; o que não existe é link assinado zumbi.
 */
import type { RespostaConcluir } from '../tipos';

export interface Comprovante extends RespostaConcluir {
  /** Para pedir uma URL nova quando a assinada vencer. */
  token: string;
  versao_numero: number;
  nome: string;
  empresa: string;
}

let naMao: Comprovante | undefined;

export function guardarComprovante(comprovante: Comprovante): void {
  naMao = comprovante;
}

export function pegarComprovante(): Comprovante | undefined {
  return naMao;
}

/** Usado ao sair da tela de conclusão e pelos testes, que não compartilham estado. */
export function esquecerComprovante(): void {
  naMao = undefined;
}
