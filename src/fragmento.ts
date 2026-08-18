/**
 * ─── QUANDO O `#forms` DA BARRA DE ENDEREÇO VALE, E QUANDO ELE É LIXO ─────────
 *
 * O `main.tsx` apaga o fragmento antes do primeiro render, e por dois motivos
 * bons que continuam valendo (estão escritos lá): a restauração de rolagem e a
 * âncora HERDADA — aquela que ficou na barra depois de um clique e faz o próximo
 * reload abrir no meio da página em vez de no começo.
 *
 * O que ele não sabia distinguir é a origem do fragmento. Um `#forms` que veio
 * de um CLIQUE na sessão anterior é lixo; um `#forms` que veio de FORA — do
 * botão "Falar com a Doxa" de uma página de `/solucoes`, de um link colado no
 * WhatsApp — é a intenção inteira da visita. Apagados os dois juntos, o
 * visitante que pediu o formulário cai no topo da home e tem de procurar.
 *
 * O navegador responde essa pergunta: `PerformanceNavigationTiming.type` diz
 * COMO a página foi aberta. `reload` e `back_forward` são as duas situações em
 * que o fragmento é herança; `navigate` é alguém chegando agora, com o endereço
 * que escolheu.
 *
 * Este arquivo é PURO de propósito — nada de `window`, nada de `history`. É o
 * que permite ao teste rodar as cinco combinações sem navegador nenhum, e é
 * onde a regra fica legível: no `main.tsx` ela seria mais um `if` no meio de um
 * bloco que já roda antes do React existir.
 */

/**
 * O mínimo de uma entrada de `performance.getEntriesByType('navigation')`.
 *
 * `type` é `unknown` e opcional porque quem entrega a lista é o navegador: em
 * `PerformanceNavigationTiming` o campo existe e é string, e numa
 * `PerformanceEntry` genérica ele não existe. Modelar assim deixa a checagem
 * acontecer aqui, uma vez, em vez de virar um `as` no arquivo de boot.
 */
export interface EntradaDeNavegacao {
  readonly entryType: string;
  readonly type?: unknown;
}

/**
 * Como esta página foi aberta: `navigate`, `reload`, `back_forward`,
 * `prerender` — ou `undefined` quando o navegador não conta.
 */
export function tipoDeNavegacao(entradas: readonly EntradaDeNavegacao[]): string | undefined {
  const primeira = entradas[0];
  if (primeira == null) return undefined;
  return typeof primeira.type === 'string' ? primeira.type : undefined;
}

/**
 * O fragmento sobrevive ao boot?
 *
 * Só numa navegação nova e com fragmento de verdade. Fora disso a resposta é
 * não, e o `main.tsx` limpa a barra como sempre fez.
 *
 * `undefined` (o navegador não sabe dizer) cai no comportamento ANTIGO, e não
 * no novo: um site que abre no meio da página é um defeito que todo mundo vê;
 * um link profundo que abre no topo é uma comodidade que se perde. Na dúvida,
 * perde-se a comodidade.
 */
export function deveManterFragmento(tipo: string | undefined, hash: string): boolean {
  if (hash === '') return false;
  if (tipo == null) return false;
  return tipo !== 'reload' && tipo !== 'back_forward';
}
