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
 * ─── E POR QUE SÓ `#forms` E `#faq`, E NÃO QUALQUER ÂNCORA ───────────────────
 *
 * Porque preservar um fragmento não é a mesma coisa que HONRAR um fragmento, e
 * quem honra é o `App.tsx` — que tem um seguro de montagem, e ele cobre estes
 * dois alvos e mais nenhum.
 *
 * `#faq` entrou agora, e a razão de ele ter ficado de fora antes vale a pena
 * ficar escrita, porque é o que este arquivo protege. O rodapé das páginas SEO
 * leva "Perguntas" para `/#faq`, e o FAQ da landing é `lazy` como todo o resto:
 * no instante em que o documento carrega, o elemento `#faq` não existe. O
 * navegador tenta reencontrar a âncora enquanto o documento não terminou de
 * carregar e desiste no `load` — ou seja, o resultado passaria a depender da
 * rede. Numa conexão rápida a seção monta a tempo e a página salta; numa lenta,
 * ela não monta, o salto não acontece e a pessoa fica no topo com `#faq` na
 * barra de endereço. Duas visitas idênticas, dois comportamentos — e um defeito
 * DETERMINÍSTICO (abre sempre no topo) era melhor do que esse.
 *
 * O que mudou não foi a régua, foi o outro lado: o `App.tsx` passou a esperar
 * as seções acima do FAQ montarem e a rolar até ele, exatamente como já fazia
 * com `#forms`. Com o salto garantido, preservar o fragmento deixou de ser uma
 * aposta na rede. A régua continua a mesma, e é ela que mantém a lista curta:
 * **sobrevive o fragmento que a landing sabe honrar, e nenhum outro.** Qualquer
 * âncora nova entra aqui no mesmo dia em que ganha o seguro lá, e o teste ao
 * lado cobra as duas pontas juntas.
 *
 * Este arquivo é PURO de propósito — nada de `window`, nada de `history`. A
 * única importação é `ancoras.ts`, que é um punhado de `const` string e o dono
 * dos ids da landing. É o que permite ao teste rodar todas as combinações sem
 * navegador nenhum, e é onde a regra fica legível: no `main.tsx` ela seria mais
 * um `if` no meio de um bloco que já roda antes do React existir.
 */
import { HREF_FAQ, HREF_FORMS } from './ancoras';

/**
 * Os fragmentos que a landing sabe honrar — e por isso os únicos que sobrevivem
 * ao boot. `App.tsx` tem, para cada um destes, o seguro que espera a seção
 * `lazy` montar e rola até ela; um fragmento sem esse par do outro lado é uma
 * aposta na rede (o cabeçalho explica).
 */
const HONRADOS: readonly string[] = [HREF_FORMS, HREF_FAQ];

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
 * DUAS condições, e as duas têm de valer:
 *
 *  1. o fragmento é `#forms` ou `#faq` — os que a landing sabe honrar (ver
 *     acima);
 *  2. a página foi aberta numa navegação NOVA.
 *
 * Fora disso a resposta é não, e o `main.tsx` limpa a barra como sempre fez.
 *
 * `undefined` (o navegador não sabe dizer) cai no comportamento ANTIGO, e não
 * no novo: um site que abre no meio da página é um defeito que todo mundo vê;
 * um link profundo que abre no topo é uma comodidade que se perde. Na dúvida,
 * perde-se a comodidade.
 *
 * `prerender` fica do lado do `navigate`, e é a leitura literal do que ele
 * significa: a página foi montada adiantada e depois ATIVADA por um clique. Do
 * ponto de vista de quem clicou, é uma chegada — não uma volta ao que já estava
 * aberto, que é o caso de `reload` e `back_forward`. Qualquer tipo futuro que o
 * navegador invente cai aqui também, e é de propósito: a lista curta é a das
 * duas situações em que o fragmento comprovadamente é herança.
 */
export function deveManterFragmento(tipo: string | undefined, hash: string): boolean {
  if (!HONRADOS.includes(hash)) return false;
  if (tipo == null) return false;
  return tipo !== 'reload' && tipo !== 'back_forward';
}
