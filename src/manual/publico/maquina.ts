/**
 * ─── A MÁQUINA DO FLUXO ──────────────────────────────────────────────────────
 *
 * Tudo que decide ALGUMA COISA no caminho do cliente mora aqui, e nada aqui
 * conhece React, DOM ou `fetch`. É de propósito: o gate que impede avançar com
 * uma regra obrigatória por marcar é a única linha do fluxo que, se errar,
 * grava um aceite falso no banco — e uma coisa dessas se prova com teste, não
 * com clique.
 *
 * As duas invariantes que os testes protegem:
 *  1. só avança de seção quem marcou TODAS as `obrigatoria` daquela seção;
 *  2. o pedido de conclusão nunca sai sem declaração confirmada, sem nome e
 *     sem o manual inteiro marcado.
 */
import type {
  AceiteResumo,
  ConviteAberto,
  EstadoDoConvite,
  PedidoConcluir,
  PedidoProgresso,
  Progresso,
  Regra,
  RespostaAbrir,
  Secao,
  Versao,
} from '../tipos';
import type { FalhaDaApi, Resultado } from './api';
import { printsDaSecao } from './prints';
import type { Print } from './prints';

/**
 * Onde o cliente está. A ordem é a do dono: abertura → identificação →
 * capítulos → revisão. A conclusão não é passo daqui — ela é OUTRA rota
 * (`/concluido`), porque depois do aceite não existe "voltar".
 *
 * `etapa` é onde ele está DENTRO do capítulo. Ela nasceu de um veredito do dono
 * olhando a v2: "você deixa tudo na mesma página e o cara vai descer marcando
 * tudo, não vai nem ler nada". Uma etapa por item obrigatório é o que devolve o
 * gesto de LER antes de confirmar. Ausente = a primeira, para que um passo
 * montado à mão (a prévia, um teste) continue válido.
 */
export type Passo =
  | { tipo: 'abertura' }
  | { tipo: 'identificacao' }
  | { tipo: 'capitulo'; indice: number; etapa?: number }
  | { tipo: 'revisao' };

/** Um nome com duas letras já é um nome; um espaço em branco não é. */
export const MINIMO_DO_NOME = 2;

/**
 * A única seção que NÃO é capítulo.
 *
 * Termos de uso são documento, não passo de leitura: eles aparecem inteiros na
 * revisão final, atrás de "ler os termos completos", e nunca no meio do caminho.
 * Este é um dos DOIS lugares do fluxo em que um slug decide comportamento (o
 * outro é `SLUG_DO_CLONE`, e ele só acrescenta uma ilustração) — todo o resto é
 * dirigido pelos dados, então uma versão sem este slug (a v1, por exemplo)
 * simplesmente tem um capítulo a mais e nenhum termo.
 */
export const SLUG_DOS_TERMOS = 'termos';

/* ─── LEITURA DA VERSÃO ────────────────────────────────────────────────────── */

/**
 * As seções na ordem do manual.
 *
 * A API entrega ordenado, mas ordenar de novo custa nada e tira do fluxo a
 * dependência de um `order by` que mora em outro repositório de decisões — se
 * um dia a query mudar, o cliente não lê o manual embaralhado.
 */
export function secoesEmOrdem(versao: Versao): Secao[] {
  return [...versao.secoes].sort((uma, outra) => uma.ordem - outra.ordem);
}

/** Os capítulos navegáveis: toda seção menos os termos, na ordem do banco. */
export function capitulosEmOrdem(versao: Versao): Secao[] {
  return secoesEmOrdem(versao).filter((secao) => secao.slug !== SLUG_DOS_TERMOS);
}

/** O documento contratual, quando a versão traz um. */
export function termosDaVersao(versao: Versao): Secao | undefined {
  return secoesEmOrdem(versao).find((secao) => secao.slug === SLUG_DOS_TERMOS);
}

export function regrasEmOrdem(secao: Secao): Regra[] {
  return [...secao.regras].sort((uma, outra) => uma.ordem - outra.ordem);
}

/** As regras com checkbox. As outras são texto informativo e não travam nada. */
export function obrigatoriasDa(secao: Secao): Regra[] {
  return regrasEmOrdem(secao).filter((regra) => regra.obrigatoria);
}

/** O que o capítulo explica sem cobrar nada — e, na garantia, a nota de alívio. */
export function informativasDa(secao: Secao): Regra[] {
  return regrasEmOrdem(secao).filter((regra) => !regra.obrigatoria);
}

/* ─── AS ETAPAS DE UM CAPÍTULO ─────────────────────────────────────────────── */

/**
 * O SEGUNDO — e último — lugar do fluxo em que um slug decide comportamento.
 *
 * O capítulo do clone ganha um quadro de exemplos de foto ("que foto serve, que
 * foto não serve") como etapa própria, a pedido do dono. É apresentação, não
 * gate: versão sem este slug simplesmente não tem o quadro, e nada mais muda.
 */
export const SLUG_DO_CLONE = 'clone';

/**
 * Uma tela dentro do capítulo.
 *
 * `intro` abre QUALQUER capítulo (a cena grande, o título, o contexto e a
 * promessa do caminho); `cartao` é UMA regra informativa explicada sozinha;
 * `print` é UMA imagem da plataforma; `item` é UMA regra obrigatória; a
 * `destrava` é o par dela — o que a regra impede à esquerda, o que ela libera à
 * direita — e é lá que a confirmação acontece quando o par existe; `respiro` é
 * o interlúdio positivo com as informativas que sobraram; `fotos` é o quadro de
 * exemplos do clone.
 *
 * Não existe mais tela que despeje o capítulo inteiro: o feitio `leitura` foi
 * removido porque era exatamente a parede de texto que o dono reprovou ("uma
 * coisa de cada vez"). Nenhuma versão do manual renderiza mais uma.
 */
export type Etapa =
  | { tipo: 'intro'; itens: number; passos: number }
  | { tipo: 'cartao'; regra: Regra; numero: number; total: number }
  | { tipo: 'print'; print: Print }
  | { tipo: 'item'; regra: Regra; numero: number; total: number; comDestrava: boolean }
  | { tipo: 'destrava'; regra: Regra; alivio: Regra }
  | { tipo: 'respiro'; regras: Regra[] }
  | { tipo: 'fotos' };

/**
 * A destrava de uma obrigatória: a informativa IMEDIATAMENTE seguinte a ela.
 *
 * É dirigido a DADOS, não a código: quem monta o par é a `ordem` do banco — na
 * v5, `GA-3` em 30 e `GA-3P` em 35 — e nada aqui conhece código de regra.
 *
 * A segunda condição é a que faz a v4 (a versão no ar enquanto a v5 não é
 * aplicada) continuar exatamente como está: **a última informativa do capítulo
 * é sempre o respiro, nunca a destrava de alguém**. O capítulo fecha no alívio,
 * e é por isso que o `GA-9` da v4 — informativa logo depois do `GA-8` — segue
 * sendo o interlúdio do fim, com a confirmação do GA-8 na tela dele, como
 * sempre foi. Versão sem informativa intercalada nenhuma não tem par nenhum.
 */
function destravaDe(secao: Secao, regra: Regra): Regra | undefined {
  const regras = regrasEmOrdem(secao);
  const indice = regras.findIndex((outra) => outra.id === regra.id) + 1;
  const seguinte = regras[indice];
  if (seguinte == null || seguinte.obrigatoria) return undefined;
  return indice === regras.length - 1 ? undefined : seguinte;
}

/** As informativas que NÃO são destrava de ninguém — o alívio do fim. */
function respiroDe(secao: Secao): Regra[] {
  const destravas = new Set(
    obrigatoriasDa(secao)
      .map((regra) => destravaDe(secao, regra)?.id)
      .filter((id): id is string => id != null),
  );
  return informativasDa(secao).filter((regra) => !destravas.has(regra.id));
}

interface PrintsDoCapitulo {
  /** Por `codigo` da regra âncora — o print entra na tela seguinte à dela. */
  ancorados: Map<string, Print[]>;
  /** Os sem âncora, e os de um código que ESTA versão não tem: vão para o fim. */
  soltos: Print[];
}

/** Reparte os prints do capítulo entre os que têm âncora viva e os que não. */
function printsDoCapitulo(secao: Secao): PrintsDoCapitulo {
  const codigos = new Set(regrasEmOrdem(secao).map((regra) => regra.codigo));
  const ancorados = new Map<string, Print[]>();
  const soltos: Print[] = [];
  for (const print of printsDaSecao(secao.slug)) {
    const codigo = print.apos;
    if (codigo == null || !codigos.has(codigo)) {
      soltos.push(print);
      continue;
    }
    ancorados.set(codigo, [...(ancorados.get(codigo) ?? []), print]);
  }
  return { ancorados, soltos };
}

/**
 * As etapas do capítulo, DERIVADAS dos dados.
 *
 * N obrigatórias = N telas de item (mais a destrava de cada uma que tiver par);
 * capítulo sem obrigatória = uma tela por regra, com os prints da plataforma
 * entrando logo depois do cartão que eles provam. Nada aqui conta até oito nem
 * sabe o que é a garantia: uma versão antiga do manual atravessa isto sem um
 * único caso especial, e uma versão com dez itens ganha dez telas sozinha.
 */
export function etapasDo(secao: Secao): Etapa[] {
  const obrigatorias = obrigatoriasDa(secao);
  const { ancorados, soltos } = printsDoCapitulo(secao);
  const etapas: Etapa[] = [];
  const printsApos = (codigo: string): Etapa[] =>
    (ancorados.get(codigo) ?? []).map((print) => ({ tipo: 'print', print }));

  if (obrigatorias.length > 0) {
    obrigatorias.forEach((regra, indice) => {
      const alivio = destravaDe(secao, regra);
      const total = obrigatorias.length;
      etapas.push({ tipo: 'item', regra, numero: indice + 1, total, comDestrava: alivio != null });
      // A parte boa vem colada na regra que a explica: primeiro o que não pode,
      // na tela seguinte o que continua podendo — e é ali que se confirma.
      if (alivio != null) etapas.push({ tipo: 'destrava', regra, alivio });
      etapas.push(...printsApos(regra.codigo));
    });
    // O alívio que sobrou vem DEPOIS do último item, e sozinho na tela: no meio
    // da lista ele lia como mais uma condição, que é o contrário do que diz.
    const respiro = respiroDe(secao);
    if (respiro.length > 0) etapas.push({ tipo: 'respiro', regras: respiro });
  } else {
    const cartoes = regrasEmOrdem(secao);
    cartoes.forEach((regra, indice) => {
      etapas.push({ tipo: 'cartao', regra, numero: indice + 1, total: cartoes.length });
      etapas.push(...printsApos(regra.codigo));
    });
  }

  for (const print of soltos) etapas.push({ tipo: 'print', print });
  if (secao.slug === SLUG_DO_CLONE) etapas.push({ tipo: 'fotos' });

  // A intro é montada por último porque ela PROMETE o caminho ("são 5 passos
  // curtos"), e o tamanho do caminho só existe depois de derivá-lo.
  return [{ tipo: 'intro', itens: obrigatorias.length, passos: etapas.length }, ...etapas];
}

/** Em que etapa o passo está. Passo que não é capítulo não tem etapa: é a 0. */
export function etapaDoPasso(passo: Passo): number {
  return passo.tipo === 'capitulo' ? passo.etapa ?? 0 : 0;
}

/** A etapa daquele índice, ou `undefined` quando o índice não existe. */
export function etapaAtualDe(secao: Secao, indice: number): Etapa | undefined {
  return etapasDo(secao)[indice];
}

/**
 * O gate por ETAPA: quem cobra é a tela onde a caixa está.
 *
 * Sem par, a caixa fica na tela do item e é ele que trava — o comportamento de
 * sempre, e o que a v4 no ar continua fazendo. Com par, a caixa desce para a
 * destrava (não se pede aceite antes de contar a parte boa), então o item
 * deixa passar e a trava é a destrava. A confirmação continua sendo a da
 * OBRIGATÓRIA nos dois casos: a informativa nunca vira aceite.
 */
export function podeAvancarDaEtapa(etapa: Etapa, marcadas: readonly string[]): boolean {
  switch (etapa.tipo) {
    case 'item':
      return etapa.comDestrava || marcadas.includes(etapa.regra.id);
    case 'destrava':
      return marcadas.includes(etapa.regra.id);
    case 'intro':
    case 'cartao':
    case 'print':
    case 'respiro':
    case 'fotos':
      return true;
    default:
      throw new Error(`etapa desconhecida: ${JSON.stringify(etapa)}`);
  }
}

/**
 * O gate do passo inteiro — o que a tela chama antes de andar.
 *
 * São DUAS travas, e a segunda não é redundância: a etapa cobra o item dela, e
 * a saída do capítulo cobra o capítulo INTEIRO (`podeAvancarDa`). Se um dia a
 * derivação das etapas pular um item — versão nova, campo novo, o que for —, a
 * primeira trava deixaria passar e a segunda ainda seguraria. É a mesma razão
 * de `montarPedidoConcluir` repetir o gate do botão: o que vira linha imutável
 * no banco tem duas portas, não uma.
 *
 * Passo sem capítulo (abertura, identificação, revisão) não trava nada aqui: o
 * que impede o ACEITE é `impedimentosDoAceite`, e essa porta é outra.
 */
export function podeAvancarDoPasso(
  passo: Passo,
  versao: Versao,
  marcadas: readonly string[],
): boolean {
  const capitulo = capituloDoPasso(passo, versao);
  if (capitulo == null) return true;
  const indice = etapaDoPasso(passo);
  const etapa = etapaAtualDe(capitulo, indice);
  if (etapa != null && !podeAvancarDaEtapa(etapa, marcadas)) return false;
  const saindoDoCapitulo = indice >= etapasDo(capitulo).length - 1;
  return !saindoDoCapitulo || podeAvancarDa(capitulo, marcadas);
}

/**
 * Onde reabrir DENTRO do capítulo: o primeiro item ainda não marcado.
 *
 * É a tela do ITEM, nunca a da destrava — com par, a pessoa volta para a regra
 * e lê de novo o que não pode antes de reencontrar a confirmação do outro lado.
 * Quem já marcou tudo cai na última etapa: reapresentar o item 1 a quem já o
 * confirmou é fazer a pessoa reandar um caminho que ela terminou. Capítulo sem
 * item nenhum abre no começo, que é a intro.
 */
export function etapaDeRetomada(secao: Secao, marcadas: readonly string[]): number {
  const etapas = etapasDo(secao);
  const pendente = etapas.findIndex(
    (etapa) => etapa.tipo === 'item' && !marcadas.includes(etapa.regra.id),
  );
  if (pendente >= 0) return pendente;
  return etapas.some((etapa) => etapa.tipo === 'item') ? etapas.length - 1 : 0;
}

/**
 * Os aceites do manual inteiro — só os que o cliente CONSEGUE marcar.
 *
 * A conta anda pelos capítulos, não por todas as seções: uma obrigatória
 * escondida nos termos não teria checkbox em tela nenhuma, e cobrá-la travaria
 * o fluxo para sempre num impedimento que ninguém consegue resolver.
 */
export function obrigatoriasDaVersao(versao: Versao): Regra[] {
  return capitulosEmOrdem(versao).flatMap(obrigatoriasDa);
}

/** O que ainda falta marcar NESTA seção, na ordem em que aparece na tela. */
export function faltamNa(secao: Secao, marcadas: readonly string[]): Regra[] {
  return obrigatoriasDa(secao).filter((regra) => !marcadas.includes(regra.id));
}

/** O gate. Sem isto o aceite pode nascer incompleto — é a linha mais cara daqui. */
export function podeAvancarDa(secao: Secao, marcadas: readonly string[]): boolean {
  return faltamNa(secao, marcadas).length === 0;
}

/** O que falta no manual INTEIRO — o que a revisão final cobra. */
export function faltamNaVersao(versao: Versao, marcadas: readonly string[]): Regra[] {
  return obrigatoriasDaVersao(versao).filter((regra) => !marcadas.includes(regra.id));
}

export interface Andamento {
  feitas: number;
  total: number;
  /** 0 a 1. Vale 1 quando a versão não tem nenhuma regra obrigatória. */
  fracao: number;
}

export function andamentoDe(versao: Versao, marcadas: readonly string[]): Andamento {
  const total = obrigatoriasDaVersao(versao).length;
  const feitas = total - faltamNaVersao(versao, marcadas).length;
  return { feitas, total, fracao: total === 0 ? 1 : feitas / total };
}

/* ─── RETOMADA (o servidor é a memória entre visitas) ──────────────────────── */

/**
 * As marcações que sobrevivem à retomada.
 *
 * Filtra pelo que existe NESTA versão: id de regra que não está mais no manual
 * é lixo de uma versão anterior, e mandá-lo de volta no aceite sujaria a prova.
 */
export function marcadasDeRetomada(versao: Versao, progresso?: Progresso): string[] {
  if (progresso == null) return [];
  const existem = new Set(secoesEmOrdem(versao).flatMap((secao) => secao.regras.map((r) => r.id)));
  return progresso.regras_marcadas.filter((id) => existem.has(id));
}

/**
 * Onde reabrir.
 *
 * `secao_ordem` é o campo `ordem` da seção, NÃO o índice do array — o schema
 * só garante `ordem >= 0`, e casar por índice quebraria em silêncio se a
 * numeração começasse em 1. Ordem que não bate com seção nenhuma (o `default 0`
 * de quem nunca começou, por exemplo) devolve a abertura.
 *
 * A ETAPA não vem do servidor: ela é derivada das marcações já gravadas. O
 * banco guarda o que a pessoa confirmou, e é dele que sai onde ela parou —
 * gravar um número de etapa criaria uma segunda verdade para a mesma coisa, e
 * as duas divergiriam na primeira versão nova do manual.
 */
export function passoDeRetomada(versao: Versao, progresso?: Progresso): Passo {
  if (progresso == null) return { tipo: 'abertura' };
  const capitulos = capitulosEmOrdem(versao);
  const indice = capitulos.findIndex((secao) => secao.ordem === progresso.secao_ordem);
  if (indice < 0) return { tipo: 'abertura' };
  const capitulo = capitulos[indice];
  return {
    tipo: 'capitulo',
    indice,
    etapa: etapaDeRetomada(capitulo, marcadasDeRetomada(versao, progresso)),
  };
}

/** O nome que o campo mostra ao reabrir: o do convite manda, o digitado guarda. */
export function nomeDeRetomada(convite: ConviteAberto, progresso?: Progresso): string {
  return convite.nome_cliente ?? progresso?.nome_informado ?? '';
}

/* ─── NAVEGAÇÃO ────────────────────────────────────────────────────────────── */

/** O último índice de etapa do capítulo — para onde "voltar" cai vindo da frente. */
function ultimaEtapaDe(capitulo: Secao | undefined): number {
  if (capitulo == null) return 0;
  return Math.max(etapasDo(capitulo).length - 1, 0);
}

export function proximoPasso(passo: Passo, versao: Versao): Passo {
  const capitulos = capitulosEmOrdem(versao);
  switch (passo.tipo) {
    case 'abertura':
      return { tipo: 'identificacao' };
    case 'identificacao':
      return capitulos.length === 0
        ? { tipo: 'revisao' }
        : { tipo: 'capitulo', indice: 0, etapa: 0 };
    case 'capitulo': {
      // Dentro do capítulo primeiro: só quando a última etapa acaba é que o
      // caminho troca de assunto.
      const capitulo = capitulos[passo.indice];
      const etapa = etapaDoPasso(passo);
      if (capitulo != null && etapa < ultimaEtapaDe(capitulo)) {
        return { tipo: 'capitulo', indice: passo.indice, etapa: etapa + 1 };
      }
      return passo.indice + 1 < capitulos.length
        ? { tipo: 'capitulo', indice: passo.indice + 1, etapa: 0 }
        : { tipo: 'revisao' };
    }
    case 'revisao':
      // Depois da revisão vem o aceite, e quem o dispara é o `Fluxo` — não há
      // passo seguinte para onde caminhar sozinho.
      return passo;
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/** Voltar é SEMPRE permitido: reler não é risco, é o que se quer que aconteça. */
export function passoAnterior(passo: Passo, versao: Versao): Passo {
  const capitulos = capitulosEmOrdem(versao);
  switch (passo.tipo) {
    case 'abertura':
      return passo;
    case 'identificacao':
      return { tipo: 'abertura' };
    case 'capitulo': {
      const etapa = etapaDoPasso(passo);
      if (etapa > 0) return { tipo: 'capitulo', indice: passo.indice, etapa: etapa - 1 };
      if (passo.indice === 0) return { tipo: 'identificacao' };
      // Voltar entra pelo FIM do capítulo anterior: é o passo que se acabou de
      // dar, ao contrário. Cair na abertura dele seria refazer o capítulo.
      const anterior = passo.indice - 1;
      return { tipo: 'capitulo', indice: anterior, etapa: ultimaEtapaDe(capitulos[anterior]) };
    }
    case 'revisao': {
      if (capitulos.length === 0) return { tipo: 'identificacao' };
      const ultimo = capitulos.length - 1;
      return { tipo: 'capitulo', indice: ultimo, etapa: ultimaEtapaDe(capitulos[ultimo]) };
    }
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/** O capítulo do passo, ou `undefined` nos passos que não são capítulo. */
export function capituloDoPasso(passo: Passo, versao: Versao): Secao | undefined {
  if (passo.tipo !== 'capitulo') return undefined;
  return capitulosEmOrdem(versao)[passo.indice];
}

/* ─── OS PEDIDOS ───────────────────────────────────────────────────────────── */

/**
 * Que `secao_ordem` gravar para este passo.
 *
 * A revisão grava o ÚLTIMO CAPÍTULO, não um número próprio: quem reabre o link
 * cai no último capítulo e chega à declaração de novo por vontade própria.
 * Declaração pré-confirmada por retomada não seria aceite, seria acidente.
 *
 * E é o último CAPÍTULO, nunca a ordem dos termos: gravar a ordem de uma seção
 * que a navegação não conhece faria `passoDeRetomada` não achar destino nenhum
 * e devolver o cliente à abertura, apagando o caminho andado.
 */
export function ordemDoPasso(passo: Passo, versao: Versao): number {
  const capitulos = capitulosEmOrdem(versao);
  if (capitulos.length === 0) return 0;
  switch (passo.tipo) {
    case 'abertura':
    case 'identificacao':
      return 0;
    case 'capitulo': {
      const capitulo = capitulos[passo.indice];
      return capitulo == null ? 0 : capitulo.ordem;
    }
    case 'revisao':
      return capitulos[capitulos.length - 1].ordem;
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/** As marcações na ordem canônica do manual, sem id estranho e sem repetição. */
export function marcadasCanonicas(versao: Versao, marcadas: readonly string[]): string[] {
  const escolhidas = new Set(marcadas);
  return secoesEmOrdem(versao)
    .flatMap(regrasEmOrdem)
    .filter((regra) => escolhidas.has(regra.id))
    .map((regra) => regra.id);
}

export interface EstadoDoAceite {
  versao: Versao;
  convite: ConviteAberto;
  marcadas: readonly string[];
  /** O que o cliente digitou. Ignorado quando o convite já traz o nome. */
  nomeInformado: string;
  declaracaoConfirmada: boolean;
}

/** `true` quando o convite não trouxe nome e o cliente precisa se identificar. */
export function precisaDeNome(convite: ConviteAberto): boolean {
  return convite.nome_cliente == null;
}

export function nomeValido(nome: string): boolean {
  return nome.trim().length >= MINIMO_DO_NOME;
}

/** O nome que vai para o aceite: o do convite manda; senão, o digitado, limpo. */
export function nomeParaAceite(convite: ConviteAberto, nomeInformado: string): string {
  return convite.nome_cliente ?? nomeInformado.trim();
}

export function montarPedidoProgresso(
  token: string,
  passo: Passo,
  estado: Pick<EstadoDoAceite, 'versao' | 'convite' | 'marcadas' | 'nomeInformado'>,
): PedidoProgresso {
  const pedido: PedidoProgresso = {
    acao: 'progresso',
    token,
    secao_ordem: ordemDoPasso(passo, estado.versao),
    regras_marcadas: marcadasCanonicas(estado.versao, estado.marcadas),
  };
  // O nome só viaja quando é o cliente quem o informa: mandar de volta o nome
  // que o CX digitou daria ao navegador do cliente uma caneta sobre um dado
  // que não é dele.
  const nome = estado.nomeInformado.trim();
  if (precisaDeNome(estado.convite) && nome.length > 0) pedido.nome_informado = nome;
  return pedido;
}

/** O que ainda impede o aceite. Vazio = pode concluir. Vira texto na revisão. */
export function impedimentosDoAceite(estado: EstadoDoAceite): string[] {
  const impedimentos: string[] = [];
  const faltam = faltamNaVersao(estado.versao, estado.marcadas);
  if (faltam.length > 0) {
    impedimentos.push(
      faltam.length === 1
        ? 'Falta confirmar 1 item do manual.'
        : `Faltam confirmar ${faltam.length} itens do manual.`,
    );
  }
  if (precisaDeNome(estado.convite) && !nomeValido(estado.nomeInformado)) {
    impedimentos.push('Falta informar seu nome completo.');
  }
  if (!estado.declaracaoConfirmada) {
    impedimentos.push('Falta confirmar a declaração final.');
  }
  return impedimentos;
}

export function podeConcluir(estado: EstadoDoAceite): boolean {
  return impedimentosDoAceite(estado).length === 0;
}

/**
 * Monta o pedido de conclusão — e recusa montar o que não pode ser aceito.
 *
 * O gate está DUAS vezes no caminho (o botão desabilitado e este `throw`) de
 * propósito: o botão é aparência e some num refactor de UI; isto aqui é a
 * última porta antes de uma linha imutável no banco.
 */
export function montarPedidoConcluir(token: string, estado: EstadoDoAceite): PedidoConcluir {
  const impedimentos = impedimentosDoAceite(estado);
  if (impedimentos.length > 0) {
    throw new Error(`conclusão bloqueada: ${impedimentos.join(' ')}`);
  }
  const pedido: PedidoConcluir = {
    acao: 'concluir',
    token,
    regras_marcadas: marcadasCanonicas(estado.versao, estado.marcadas),
    declaracao_confirmada: true,
  };
  if (precisaDeNome(estado.convite)) pedido.nome = estado.nomeInformado.trim();
  return pedido;
}

/* ─── MARCAR E DESMARCAR ───────────────────────────────────────────────────── */

/** Alterna uma regra sem duplicar id — a lista é o que vira prova no aceite. */
export function alternarRegra(marcadas: readonly string[], id: string): string[] {
  return marcadas.includes(id) ? marcadas.filter((outro) => outro !== id) : [...marcadas, id];
}

/* ─── O QUE A TELA MOSTRA DEPOIS DE ABRIR O LINK ───────────────────────────── */

/** Tudo que o fluxo carrega enquanto o cliente lê. */
export interface Sessao {
  convite: ConviteAberto;
  versao: Versao;
  passo: Passo;
  marcadas: string[];
  nome: string;
  declaracaoConfirmada: boolean;
}

/**
 * A resposta do `abrir` traduzida em UMA tela.
 *
 * Existe como tipo puro — sem React — porque é aqui que se decide se o cliente
 * vê o manual, um recado de link morto ou o comprovante que ele voltou buscar.
 * Essa decisão é testável, e um `if` perdido dentro de JSX não é.
 */
export type Situacao =
  | { tipo: 'falha'; falha: FalhaDaApi }
  | { tipo: 'bloqueado'; estado: Exclude<EstadoDoConvite, 'valido' | 'concluido'> }
  | { tipo: 'concluido'; aceite?: AceiteResumo }
  | { tipo: 'fluxo'; sessao: Sessao };

const CONTRATO_QUEBRADO =
  'O convite abriu, mas veio sem o manual. Isso é um problema nosso, não seu.';

function sessaoDe(resposta: RespostaAbrir): Situacao {
  const { convite, versao, progresso } = resposta;
  if (convite == null || versao == null) {
    // Servidor respondeu 'valido' sem o conteúdo: não dá para ler manual
    // nenhum, e insistir repetiria a mesma resposta.
    return { tipo: 'falha', falha: { mensagem: CONTRATO_QUEBRADO, recuperavel: false } };
  }
  return {
    tipo: 'fluxo',
    sessao: {
      convite,
      versao,
      passo: passoDeRetomada(versao, progresso),
      marcadas: marcadasDeRetomada(versao, progresso),
      nome: nomeDeRetomada(convite, progresso),
      // Nunca retomada: confirmar a declaração é ato do cliente NESTA visita.
      declaracaoConfirmada: false,
    },
  };
}

export function situacaoDe(resultado: Resultado<RespostaAbrir>): Situacao {
  if (!resultado.ok) return { tipo: 'falha', falha: resultado.falha };
  switch (resultado.dados.estado) {
    case 'valido':
      return sessaoDe(resultado.dados);
    case 'concluido':
      return { tipo: 'concluido', aceite: resultado.dados.aceite };
    case 'invalido':
    case 'expirado':
    case 'revogado':
      return { tipo: 'bloqueado', estado: resultado.dados.estado };
    default:
      // Estado que não está no contrato veio da rede, não do nosso código: o
      // link não serve, e tratar como inválido é a resposta honesta.
      return { tipo: 'bloqueado', estado: 'invalido' };
  }
}

/** O recorte da sessão que a máquina do aceite entende. */
export function aceiteDaSessao(sessao: Sessao): EstadoDoAceite {
  return {
    versao: sessao.versao,
    convite: sessao.convite,
    marcadas: sessao.marcadas,
    nomeInformado: sessao.nome,
    declaracaoConfirmada: sessao.declaracaoConfirmada,
  };
}

/**
 * Identidade do passo em texto: serve de `key` no React e de comparação aqui.
 *
 * A ETAPA entra na chave porque cada item é uma TELA: sem ela, andar do item 3
 * para o 4 não mexeria no foco nem na rolagem, e o cliente veria o texto trocar
 * no meio da página sem entender que mudou de assunto.
 */
export function chaveDoPasso(passo: Passo): string {
  return passo.tipo === 'capitulo' ? `capitulo-${passo.indice}-${etapaDoPasso(passo)}` : passo.tipo;
}
