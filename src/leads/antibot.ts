/**
 * ─── AS REGRAS DO ANTI-BOT, num lugar só ─────────────────────────────────────
 *
 * Este arquivo é lido pelos DOIS lados: o formulário no navegador e o endpoint
 * no servidor. É de propósito — as duas pontas precisam concordar sobre o nome
 * do campo-armadilha e sobre quanto tempo é rápido demais, e duas cópias dessa
 * combinação divergem no primeiro ajuste.
 *
 * ─── POR QUE ISTO NÃO É UM CAPTCHA ───────────────────────────────────────────
 *
 * Um captcha no navegador não protege nada sozinho: quem quiser inserir lixo
 * não precisa abrir a página — copia a chave pública do bundle e fala direto
 * com o banco. O que protege é o ENDPOINT ser a única porta de escrita. Estas
 * regras são as três camadas baratas que rodam ANTES de gastar uma chamada de
 * captcha, e elas pegam a maior parte do lixo automatizado.
 */

/**
 * O campo-armadilha.
 *
 * Um `input` de verdade, escondido do olho e do leitor de tela, com nome de
 * campo comum. Gente nunca o preenche — não o vê. Robô que preenche formulário
 * por varredura de campos preenche, e se entrega.
 *
 * O nome é banal de propósito: um campo chamado `honeypot` é reconhecido por
 * qualquer biblioteca de spam. "empresa_site" parece o que ele finge ser.
 */
export const ARMADILHA = 'empresa_site';

/**
 * O tempo mínimo, em milissegundos, entre abrir o formulário e enviá-lo.
 *
 * São NOVE perguntas, quatro delas digitadas. Ninguém faz isso em oito
 * segundos — o recorde nos meus testes automatizados, que não param para
 * pensar, foi de doze. Um robô faz em duzentos milissegundos.
 *
 * O número é generoso de propósito: barrar gente de verdade é um custo muito
 * mais alto do que deixar passar um robô lento, e o Turnstile existe para pegar
 * quem sobrar.
 */
export const TEMPO_MINIMO = 8000;

/** Quantos envios do mesmo IP em `JANELA_MINUTOS`. */
export const LIMITE_POR_IP = 5;
export const JANELA_MINUTOS = 10;

/** O que o navegador manda junto com o lead, para o endpoint julgar. */
export interface ProvaDeHumano {
  /** O conteúdo do campo-armadilha. Vazio é o esperado. */
  armadilha: string;
  /** Milissegundos entre a montagem do formulário e o envio. */
  levou: number;
  /** O token do Turnstile, quando ele estiver ligado. */
  token: string | null;
}

/** O veredito, com o motivo — o endpoint devolve o motivo só no log. */
export type Veredito = { ok: true } | { ok: false; motivo: string };

/**
 * As duas checagens que não precisam de rede nem de banco.
 *
 * Pura de propósito: é o pedaço que dá para provar por teste, e é onde os erros
 * de sinal (barrar gente de verdade) doem mais.
 */
export function julgarSemRede(prova: ProvaDeHumano): Veredito {
  if (prova.armadilha.trim().length > 0) return { ok: false, motivo: 'armadilha' };
  // `levou` chega do cliente e não é confiável — um robô manda o número que
  // quiser. Ele não está aqui para deter quem sabe o que está fazendo, e sim
  // para custar UMA linha de código a mais para quem não sabe.
  if (!Number.isFinite(prova.levou) || prova.levou < TEMPO_MINIMO) {
    return { ok: false, motivo: 'rapido demais' };
  }
  return { ok: true };
}
