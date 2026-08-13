/**
 * ─── A PORTA DE DADOS ────────────────────────────────────────────────────────
 *
 * O contrato entre a interface e o que quer que esteja guardando os leads. É a
 * única coisa que a Central conhece — ela nunca importou Supabase, nunca soube
 * de `fetch`, e não vai saber.
 *
 * Trocar de banco é escrever outra implementação desta interface e apontar a
 * fachada para ela. Nenhum componente muda.
 */
import type { ProvaDeHumano } from '../antibot';
import type { Lead, LeadNovo } from '../tipos';

export interface PortaDeLeads {
  /** Qual implementação respondeu. A Central avisa na tela quando é simulado. */
  modo: 'simulado' | 'supabase';

  /** Troca a senha do time por uma sessão. Devolve o erro em português, ou `null`. */
  entrar(senha: string): Promise<string | null>;

  /**
   * Se há sessão válida agora.
   *
   * Quem responde é a porta e não a Central: no Supabase isso é um token com
   * validade, no simulado é uma marca no navegador, e a Central não tem por que
   * conhecer nenhuma das duas formas.
   */
  sessaoAtiva(): boolean;

  sair(): void;

  /**
   * Grava um lead novo.
   *
   * A PROVA viaja junto: o campo-armadilha, o tempo que o preenchimento levou e
   * o token do captcha. Quem julga é o servidor — o navegador só carrega o
   * envelope, e por isso ele pode ser mentiroso sem estragar nada.
   */
  gravar(lead: LeadNovo, prova: ProvaDeHumano): Promise<void>;

  /**
   * A lista inteira, do mais novo para o mais velho.
   *
   * Lança `Error('sessao')` quando o token não vale mais e `Error('rede')` para
   * o resto — a Central trata os dois de formas diferentes, e diferenciar aqui
   * é mais barato do que a interface adivinhar pelo texto.
   */
  listar(): Promise<Lead[]>;

  marcarBaixados(ids: string[]): Promise<void>;

  /**
   * Apaga leads de vez. NÃO tem lixeira: o que sai daqui saiu do banco.
   *
   * Existe desde 13/08/2026 por decisão do dono — a regra anterior era
   * "ninguém apaga lead pelo painel", e está revogada nas duas pontas: aqui e
   * na política de DELETE do `schema.sql`. Quem protege contra o clique
   * acidental é a interface, com a confirmação em dois passos; o banco só
   * confere QUEM pode (a conta do time, autenticada).
   */
  excluir(ids: string[]): Promise<void>;
}
