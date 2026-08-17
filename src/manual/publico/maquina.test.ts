/**
 * ─── OS TESTES DA MÁQUINA DO FLUXO ───────────────────────────────────────────
 *
 * Cobrem o que, se quebrar, grava prova errada no banco: o gate de avanço, a
 * retomada pelo mesmo link, a montagem dos pedidos e a leitura dos estados do
 * convite.
 *
 * NÃO cobrem o desenho das telas — teste que afirma classe de Tailwind não
 * prova nada e quebra a cada ajuste. A validação visual é no navegador.
 *
 * As seções da amostra usam `ordem` começando em 1 DE PROPÓSITO: o schema só
 * garante `ordem >= 0`, e é assim que se prova que a retomada casa pelo campo
 * `ordem` e não pelo índice do array.
 */
import { describe, expect, it } from 'vitest';
import {
  aceiteDaSessao,
  alternarRegra,
  andamentoDe,
  capituloDoPasso,
  capitulosEmOrdem,
  chaveDoPasso,
  etapaDeRetomada,
  etapasDo,
  faltamNa,
  impedimentosDoAceite,
  informativasDa,
  marcadasCanonicas,
  marcadasDeRetomada,
  montarPedidoConcluir,
  montarPedidoProgresso,
  nomeDeRetomada,
  nomeParaAceite,
  obrigatoriasDaVersao,
  ordemDoPasso,
  passoAnterior,
  passoDeRetomada,
  podeAvancarDa,
  podeAvancarDaEtapa,
  podeAvancarDoPasso,
  podeConcluir,
  proximoPasso,
  secoesEmOrdem,
  situacaoDe,
  termosDaVersao,
} from './maquina';
import type { EstadoDoAceite, Passo, Sessao } from './maquina';
import type { ConviteAberto, Regra, RespostaAbrir, Secao, Versao } from '../tipos';

function regra(id: string, ordem: number, extra: Partial<Regra> = {}): Regra {
  return {
    id,
    codigo: id.toUpperCase(),
    titulo: `Regra ${id}`,
    instrucao: 'Faça assim.',
    porque: 'Porque sem isso o trabalho para.',
    exemplo: 'Mandar o material até quinta.',
    severidade: 'normal',
    obrigatoria: true,
    ordem,
    ...extra,
  };
}

function secao(id: string, ordem: number, regras: Regra[]): Secao {
  return {
    id,
    slug: id,
    titulo: `Seção ${id}`,
    descricao: 'O contexto antes das regras.',
    ordem,
    regras,
  };
}

const R1 = regra('r1', 1);
const R2 = regra('r2', 2, { severidade: 'critica' });
const R3 = regra('r3', 3, { obrigatoria: false });
const R4 = regra('r4', 1);

const S1 = secao('s1', 1, [R2, R1, R3]);
const S2 = secao('s2', 2, [R4]);

/**
 * A seção de termos, com uma regra OBRIGATÓRIA dentro.
 *
 * É uma armadilha de propósito: os termos não são capítulo, então essa regra
 * não tem checkbox em tela nenhuma. Se a máquina a cobrasse, o cliente ficaria
 * preso num impedimento que nenhum gesto resolve — e nenhum aceite sairia
 * jamais.
 */
const TERMOS = secao('termos', 3, [regra('t1', 1)]);

const VERSAO: Versao = {
  id: 'v1',
  numero: 3,
  titulo: 'Manual DOXA',
  declaracao: 'Declaro que li e concordo com tudo acima.',
  // Fora de ordem de propósito: quem ordena é a máquina, não a API.
  secoes: [S2, TERMOS, S1],
};

const COM_NOME: ConviteAberto = {
  email: 'cliente@empresa.com',
  empresa: 'Empresa LTDA',
  nome_cliente: 'Maria Souza',
  expira_em: null,
};

const SEM_NOME: ConviteAberto = { ...COM_NOME, nome_cliente: null };

function estado(extra: Partial<EstadoDoAceite> = {}): EstadoDoAceite {
  return {
    versao: VERSAO,
    convite: COM_NOME,
    marcadas: ['r1', 'r2', 'r4'],
    nomeInformado: '',
    declaracaoConfirmada: true,
    ...extra,
  };
}

describe('leitura da versão', () => {
  it('ordena seções e regras pelo campo ordem, mesmo vindo embaralhado', () => {
    expect(secoesEmOrdem(VERSAO).map((s) => s.id)).toEqual(['s1', 's2', 'termos']);
  });

  it('conta o manual inteiro no andamento — informativa não entra na conta', () => {
    expect(andamentoDe(VERSAO, []).total).toBe(3);
    expect(andamentoDe(VERSAO, ['r1', 'r3']).feitas).toBe(1);
    expect(andamentoDe(VERSAO, ['r1', 'r2', 'r4']).fracao).toBe(1);
  });
});

describe('capítulos e termos', () => {
  it('os capítulos são todas as seções MENOS os termos, na ordem do banco', () => {
    expect(capitulosEmOrdem(VERSAO).map((s) => s.id)).toEqual(['s1', 's2']);
    expect(termosDaVersao(VERSAO)?.slug).toBe('termos');
  });

  it('versão sem a seção de termos não tem documento, e nenhum capítulo se perde', () => {
    const semTermos: Versao = { ...VERSAO, secoes: [S2, S1] };
    expect(termosDaVersao(semTermos)).toBeUndefined();
    expect(capitulosEmOrdem(semTermos).map((s) => s.id)).toEqual(['s1', 's2']);
  });

  it('obrigatória escondida nos termos NÃO é cobrada: ela não tem checkbox em tela', () => {
    expect(obrigatoriasDaVersao(VERSAO).map((r) => r.id)).toEqual(['r1', 'r2', 'r4']);
    // Sem `t1` marcada, o aceite fecha. Cobrá-la travaria o fluxo para sempre.
    expect(podeConcluir(estado())).toBe(true);
  });

  it('o feitio do capítulo sai dos dados, nunca do slug', () => {
    // Com obrigatória, o capítulo cobra aceite; sem nenhuma, só explica. Quem
    // diz isso agora é a forma das ETAPAS — não existe mais um "feitio" à parte.
    expect(etapasDo(S1).some((etapa) => etapa.tipo === 'item')).toBe(true);
    const soLeitura = secao('so-leitura', 9, [regra('x', 1, { obrigatoria: false })]);
    expect(etapasDo(soLeitura).some((etapa) => etapa.tipo === 'item')).toBe(false);
    expect(informativasDa(S1).map((r) => r.id)).toEqual(['r3']);
  });
});

describe('o gate de avanço', () => {
  it('não avança com regra obrigatória por marcar', () => {
    expect(podeAvancarDa(S1, [])).toBe(false);
    expect(podeAvancarDa(S1, ['r1'])).toBe(false);
    expect(faltamNa(S1, ['r1']).map((r) => r.id)).toEqual(['r2']);
  });

  it('avança sem marcar a informativa: ela não tem checkbox', () => {
    expect(podeAvancarDa(S1, ['r1', 'r2'])).toBe(true);
    expect(faltamNa(S1, ['r1', 'r2'])).toEqual([]);
  });

  it('marcar a regra de OUTRA seção não libera esta', () => {
    expect(podeAvancarDa(S1, ['r4'])).toBe(false);
  });
});

/* ─── AS ETAPAS: UMA TELA POR ITEM ─────────────────────────────────────────── */

describe('as etapas de um capítulo', () => {
  it('N obrigatórias viram N telas de item — a conta sai dos dados, não do slug', () => {
    const etapas = etapasDo(S1);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual(['intro', 'item', 'item', 'respiro']);
    const itens = etapas.filter((etapa) => etapa.tipo === 'item');
    expect(itens.map((etapa) => (etapa.tipo === 'item' ? etapa.regra.id : null))).toEqual([
      'r1',
      'r2',
    ]);
    // A numeração da tela ("Item 2 de 2") é derivada, nunca escrita à mão.
    expect(itens.map((etapa) => (etapa.tipo === 'item' ? `${etapa.numero}/${etapa.total}` : ''))).toEqual([
      '1/2',
      '2/2',
    ]);
  });

  it('capítulo sem obrigatória vira UMA TELA POR CARTÃO — a parede morreu', () => {
    const soLeitura = secao('so-leitura', 9, [
      regra('x', 1, { obrigatoria: false }),
      regra('y', 2, { obrigatoria: false }),
    ]);
    const etapas = etapasDo(soLeitura);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual(['intro', 'cartao', 'cartao']);
    // A promessa do caminho sai da conta das telas, nunca escrita à mão.
    expect(etapas[0]).toEqual({ tipo: 'intro', itens: 0, passos: 2 });
    expect(etapas.map((etapa) => (etapa.tipo === 'cartao' ? etapa.regra.id : null))).toEqual([
      null,
      'x',
      'y',
    ]);
  });

  it('capítulo vazio abre e fecha na intro, sem tela órfã', () => {
    expect(etapasDo(secao('vazio', 9, [])).map((etapa) => etapa.tipo)).toEqual(['intro']);
  });

  it('sem informativa não há interlúdio para desenhar', () => {
    expect(etapasDo(S2).map((etapa) => etapa.tipo)).toEqual(['intro', 'item']);
  });

  it('o capítulo do clone ganha a etapa dos exemplos de foto, no fim', () => {
    const clone = secao('clone', 8, [regra('c1', 1, { obrigatoria: false })]);
    expect(etapasDo(clone).map((etapa) => etapa.tipo)).toEqual(['intro', 'cartao', 'fotos']);
  });

  it('o gate agora é por ETAPA: cada item cobra a confirmação dele mesmo', () => {
    const [intro, primeiro, segundo, respiro] = etapasDo(S1);
    expect(podeAvancarDaEtapa(intro, [])).toBe(true);
    expect(podeAvancarDaEtapa(primeiro, [])).toBe(false);
    expect(podeAvancarDaEtapa(primeiro, ['r1'])).toBe(true);
    // Marcar o item errado não abre a porta deste.
    expect(podeAvancarDaEtapa(segundo, ['r1'])).toBe(false);
    expect(podeAvancarDaEtapa(respiro, [])).toBe(true);
  });

  it('o gate do passo inteiro trava o item por marcar e libera o resto', () => {
    const noItem: Passo = { tipo: 'capitulo', indice: 0, etapa: 1 };
    expect(podeAvancarDoPasso(noItem, VERSAO, [])).toBe(false);
    expect(podeAvancarDoPasso(noItem, VERSAO, ['r1'])).toBe(true);
    expect(podeAvancarDoPasso({ tipo: 'capitulo', indice: 0 }, VERSAO, [])).toBe(true);
    expect(podeAvancarDoPasso({ tipo: 'revisao' }, VERSAO, [])).toBe(true);
  });

  it('a SAÍDA do capítulo cobra o capítulo inteiro, e não só a etapa da vez', () => {
    // A etapa 3 de S1 é o respiro: ela não cobra nada por si. Sair dali com um
    // item por marcar é o que a segunda trava impede — se a derivação das
    // etapas um dia pular um item, o gate ainda segura.
    const respiro: Passo = { tipo: 'capitulo', indice: 0, etapa: 3 };
    expect(podeAvancarDaEtapa(etapasDo(S1)[3], ['r1'])).toBe(true);
    expect(podeAvancarDoPasso(respiro, VERSAO, ['r1'])).toBe(false);
    expect(podeAvancarDoPasso(respiro, VERSAO, ['r1', 'r2'])).toBe(true);
  });

  it('a etapa de retomada é o PRIMEIRO item não marcado', () => {
    // Etapa 0 é a abertura do capítulo; o item r1 é a 1 e o r2 é a 2.
    expect(etapaDeRetomada(S1, [])).toBe(1);
    expect(etapaDeRetomada(S1, ['r1'])).toBe(2);
    // Tudo marcado: a última etapa, e não o item 1 de novo — reandar um
    // caminho terminado é o jeito rápido de o cliente fechar a aba.
    expect(etapaDeRetomada(S1, ['r1', 'r2'])).toBe(3);
    // Capítulo sem item nenhum abre no começo, que é a intro.
    expect(etapaDeRetomada(secao('so-leitura', 9, [regra('x', 1, { obrigatoria: false })]), [])).toBe(0);
  });
});

/* ─── OS PRINTS DA PLATAFORMA, ANCORADOS NO CARTÃO QUE ELES PROVAM ─────────── */

describe('os prints entram como etapa, na âncora deles', () => {
  /** O onboarding real: os códigos ON-1 e ON-2 são as âncoras da série 12.2x. */
  const ONBOARDING = secao('onboarding', 1, [
    regra('on-1', 1, { obrigatoria: false }),
    regra('on-2', 2, { obrigatoria: false }),
  ]);

  it('o print entra na tela SEGUINTE à do cartão que ele prova', () => {
    const etapas = etapasDo(ONBOARDING);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual([
      'intro',
      'cartao',
      'print',
      'print',
      'print',
      'cartao',
      'print',
    ]);
    // Os três prints do Doxa Scan provam o ON-1; o das redes prova o ON-2.
    expect(etapas.map((etapa) => (etapa.tipo === 'print' ? etapa.print.slug : null))).toEqual([
      null,
      null,
      'onboarding-scan',
      'onboarding-negocio',
      'onboarding-autoridade',
      null,
      'onboarding-redes',
    ]);
  });

  it('print sem âncora vai para o fim do capítulo, na ordem em que está no dado', () => {
    const voz = secao('voz', 2, [regra('vz-1', 1, { obrigatoria: false })]);
    const etapas = etapasDo(voz);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual([
      'intro',
      'cartao',
      'print',
      'print',
      'print',
      'print',
    ]);
    expect(
      etapas.flatMap((etapa) => (etapa.tipo === 'print' ? [etapa.print.slug] : [])),
    ).toEqual(['voz-minha-voz', 'voz-clone-de-voz', 'voz-verificar', 'voz-pendente']);
  });

  it('âncora de um código que a versão não tem cai no fim — nada se perde', () => {
    // Uma v2 antiga, com outros códigos na mesma seção: os prints continuam no
    // caminho, só sem a costura fina com o cartão.
    const antigo = secao('onboarding', 1, [regra('outro', 1, { obrigatoria: false })]);
    const etapas = etapasDo(antigo);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual([
      'intro',
      'cartao',
      'print',
      'print',
      'print',
      'print',
    ]);
  });

  it('capítulo sem print no mapa não ganha etapa nenhuma de print', () => {
    expect(etapasDo(S1).some((etapa) => etapa.tipo === 'print')).toBe(false);
  });
});

/* ─── OS PARES TRAVA → DESTRAVA ────────────────────────────────────────────── */

/**
 * A garantia como ela fica na v5: cada obrigatória seguida da informativa que
 * conta o que ela LIBERA, e o respiro (a última informativa) fechando tudo.
 */
const GARANTIA_V5 = secao('garantia', 4, [
  regra('g1', 10),
  regra('g1p', 15, { obrigatoria: false }),
  regra('g2', 20),
  regra('g2p', 25, { obrigatoria: false }),
  regra('g9', 95, { obrigatoria: false }),
]);

/** A garantia como ela está NO AR (v4): oito itens e o respiro, sem par nenhum. */
const GARANTIA_V4 = secao('garantia', 4, [
  regra('g1', 1),
  regra('g2', 2),
  regra('g9', 9, { obrigatoria: false }),
]);

describe('os pares trava → destrava', () => {
  it('a informativa colada na obrigatória vira a destrava DELA', () => {
    const etapas = etapasDo(GARANTIA_V5);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual([
      'intro',
      'item',
      'destrava',
      'item',
      'destrava',
      'respiro',
    ]);
    const [, item, destrava] = etapas;
    if (item.tipo !== 'item' || destrava.tipo !== 'destrava') throw new Error('esperava o par');
    expect(item.regra.id).toBe('g1');
    expect(item.comDestrava).toBe(true);
    // A trava do par é a OBRIGATÓRIA; o alívio é a informativa.
    expect(destrava.regra.id).toBe('g1');
    expect(destrava.alivio.id).toBe('g1p');
  });

  it('a última informativa do capítulo continua sendo o respiro, nunca uma destrava', () => {
    const etapas = etapasDo(GARANTIA_V5);
    const respiro = etapas[etapas.length - 1];
    if (respiro.tipo !== 'respiro') throw new Error('esperava o respiro no fim');
    expect(respiro.regras.map((uma) => uma.id)).toEqual(['g9']);
  });

  it('a v4 no ar não ganha par nenhum: a caixa fica no item, como sempre foi', () => {
    const etapas = etapasDo(GARANTIA_V4);
    expect(etapas.map((etapa) => etapa.tipo)).toEqual(['intro', 'item', 'item', 'respiro']);
    expect(etapas.every((etapa) => etapa.tipo !== 'item' || !etapa.comDestrava)).toBe(true);
  });

  it('com par, quem trava é a DESTRAVA — e o item deixa passar', () => {
    const [, item, destrava] = etapasDo(GARANTIA_V5);
    expect(podeAvancarDaEtapa(item, [])).toBe(true);
    expect(podeAvancarDaEtapa(destrava, [])).toBe(false);
    // O que abre a porta é o id da OBRIGATÓRIA: a informativa nunca vira aceite.
    expect(podeAvancarDaEtapa(destrava, ['g1p'])).toBe(false);
    expect(podeAvancarDaEtapa(destrava, ['g1'])).toBe(true);
  });

  it('sem par, quem trava continua sendo o item', () => {
    const [, item] = etapasDo(GARANTIA_V4);
    expect(podeAvancarDaEtapa(item, [])).toBe(false);
    expect(podeAvancarDaEtapa(item, ['g1'])).toBe(true);
  });

  it('a saída do capítulo cobra todas as obrigatórias, destrava ou não', () => {
    const versao: Versao = { ...VERSAO, secoes: [GARANTIA_V5] };
    const fim: Passo = { tipo: 'capitulo', indice: 0, etapa: 5 };
    expect(podeAvancarDoPasso(fim, versao, ['g1'])).toBe(false);
    expect(podeAvancarDoPasso(fim, versao, ['g1', 'g2'])).toBe(true);
  });

  it('a retomada cai na TRAVA do primeiro par não confirmado, não na destrava', () => {
    expect(etapaDeRetomada(GARANTIA_V5, [])).toBe(1);
    expect(etapaDeRetomada(GARANTIA_V5, ['g1'])).toBe(3);
    expect(etapaDeRetomada(GARANTIA_V5, ['g1', 'g2'])).toBe(5);
  });
});

describe('navegação entre passos', () => {
  const abertura: Passo = { tipo: 'abertura' };

  it('vai da abertura à identificação e daí para a PRIMEIRA etapa do capítulo 1', () => {
    expect(proximoPasso(abertura, VERSAO)).toEqual({ tipo: 'identificacao' });
    expect(proximoPasso({ tipo: 'identificacao' }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 0,
      etapa: 0,
    });
  });

  it('anda etapa por etapa dentro do capítulo antes de trocar de assunto', () => {
    // S1 tem quatro etapas: abertura, item r1, item r2, respiro.
    expect(proximoPasso({ tipo: 'capitulo', indice: 0 }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 0,
      etapa: 1,
    });
    expect(proximoPasso({ tipo: 'capitulo', indice: 0, etapa: 2 }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 0,
      etapa: 3,
    });
    // Só a ÚLTIMA etapa vira o capítulo seguinte, e sempre pela abertura dele.
    expect(proximoPasso({ tipo: 'capitulo', indice: 0, etapa: 3 }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 1,
      etapa: 0,
    });
  });

  it('a última etapa do último CAPÍTULO leva à revisão — os termos nunca viram passo', () => {
    expect(proximoPasso({ tipo: 'capitulo', indice: 1, etapa: 1 }, VERSAO)).toEqual({
      tipo: 'revisao',
    });
    expect(proximoPasso({ tipo: 'revisao' }, VERSAO)).toEqual({ tipo: 'revisao' });
  });

  it('voltar entra pelo FIM do capítulo anterior, e da revisão pelo fim do último', () => {
    // S2 tem duas etapas (abertura e o item r4): o fim dele é a etapa 1.
    expect(passoAnterior({ tipo: 'revisao' }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 1,
      etapa: 1,
    });
    expect(passoAnterior({ tipo: 'capitulo', indice: 0, etapa: 2 }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 0,
      etapa: 1,
    });
    // A etapa 3 de S1 é o respiro: voltar do capítulo 2 cai nele, e não na
    // abertura do capítulo 1 — desandar o caminho é refazer o último passo.
    expect(passoAnterior({ tipo: 'capitulo', indice: 1 }, VERSAO)).toEqual({
      tipo: 'capitulo',
      indice: 0,
      etapa: 3,
    });
    expect(passoAnterior({ tipo: 'capitulo', indice: 0 }, VERSAO)).toEqual({
      tipo: 'identificacao',
    });
    expect(passoAnterior(abertura, VERSAO)).toEqual(abertura);
  });

  it('o capítulo do passo sai da lista de capítulos, sem os termos', () => {
    expect(capituloDoPasso({ tipo: 'capitulo', indice: 0 }, VERSAO)?.id).toBe('s1');
    expect(capituloDoPasso({ tipo: 'capitulo', indice: 2 }, VERSAO)).toBeUndefined();
    expect(capituloDoPasso(abertura, VERSAO)).toBeUndefined();
  });

  it('a chave do passo distingue capítulos E etapas — cada item é uma tela', () => {
    expect(chaveDoPasso({ tipo: 'capitulo', indice: 1 })).toBe('capitulo-1-0');
    expect(chaveDoPasso({ tipo: 'capitulo', indice: 1, etapa: 3 })).toBe('capitulo-1-3');
    expect(chaveDoPasso(abertura)).toBe('abertura');
  });
});

describe('retomada pelo mesmo link', () => {
  it('casa o capítulo pelo campo ordem, não pelo índice do array', () => {
    // `secao_ordem: 2` é o SEGUNDO capítulo (índice 1). Casar por índice cairia
    // no capítulo errado — o bug que este teste existe para pegar.
    expect(passoDeRetomada(VERSAO, { secao_ordem: 2, regras_marcadas: [], nome_informado: null })).toEqual({
      tipo: 'capitulo',
      indice: 1,
      etapa: 1,
    });
  });

  it('reabre no PRIMEIRO item não marcado, derivado do que o servidor guardou', () => {
    const semNada = { secao_ordem: 1, regras_marcadas: [], nome_informado: null };
    expect(passoDeRetomada(VERSAO, semNada)).toEqual({ tipo: 'capitulo', indice: 0, etapa: 1 });
    // Com o primeiro item já confirmado, a volta é no segundo — e não numa
    // etapa gravada à parte, que divergiria das marcações na versão seguinte.
    expect(
      passoDeRetomada(VERSAO, { ...semNada, regras_marcadas: ['r1'] }),
    ).toEqual({ tipo: 'capitulo', indice: 0, etapa: 2 });
    // Id de outra versão não conta como item confirmado.
    expect(
      passoDeRetomada(VERSAO, { ...semNada, regras_marcadas: ['de-outra-versao'] }),
    ).toEqual({ tipo: 'capitulo', indice: 0, etapa: 1 });
  });

  it('ordem que não é de capítulo nenhum volta para a abertura', () => {
    expect(passoDeRetomada(VERSAO, { secao_ordem: 0, regras_marcadas: [], nome_informado: null })).toEqual({
      tipo: 'abertura',
    });
    // A ordem 3 é a dos TERMOS: não é capítulo, logo não é destino de retomada.
    expect(passoDeRetomada(VERSAO, { secao_ordem: 3, regras_marcadas: [], nome_informado: null })).toEqual({
      tipo: 'abertura',
    });
    expect(passoDeRetomada(VERSAO)).toEqual({ tipo: 'abertura' });
  });

  it('descarta id de regra que não existe nesta versão', () => {
    const progresso = { secao_ordem: 1, regras_marcadas: ['r1', 'de-outra-versao'], nome_informado: null };
    expect(marcadasDeRetomada(VERSAO, progresso)).toEqual(['r1']);
    expect(marcadasDeRetomada(VERSAO)).toEqual([]);
  });

  it('o nome do convite manda; sem ele, volta o que o cliente digitou', () => {
    const progresso = { secao_ordem: 1, regras_marcadas: [], nome_informado: 'João' };
    expect(nomeDeRetomada(COM_NOME, progresso)).toBe('Maria Souza');
    expect(nomeDeRetomada(SEM_NOME, progresso)).toBe('João');
    expect(nomeDeRetomada(SEM_NOME)).toBe('');
  });
});

describe('os pedidos que sobem para a API', () => {
  it('o progresso grava a ordem do capítulo e as marcações na ordem do manual', () => {
    const pedido = montarPedidoProgresso('tok', { tipo: 'capitulo', indice: 1 }, {
      versao: VERSAO,
      convite: COM_NOME,
      marcadas: ['r4', 'r1'],
      nomeInformado: '',
    });
    expect(pedido).toEqual({
      acao: 'progresso',
      token: 'tok',
      secao_ordem: 2,
      regras_marcadas: ['r1', 'r4'],
    });
  });

  it('a revisão grava o ÚLTIMO CAPÍTULO, nunca a ordem dos termos', () => {
    // A ordem 3 (termos) aqui apagaria o caminho andado: `passoDeRetomada` não
    // acharia destino e devolveria o cliente à abertura na próxima visita.
    expect(ordemDoPasso({ tipo: 'revisao' }, VERSAO)).toBe(2);
    expect(ordemDoPasso({ tipo: 'abertura' }, VERSAO)).toBe(0);
  });

  it('só manda nome_informado quando é o cliente que informa o nome', () => {
    const comum = { versao: VERSAO, marcadas: [], nomeInformado: '  Ana Lima  ' };
    const doCliente = montarPedidoProgresso('tok', { tipo: 'identificacao' }, {
      ...comum,
      convite: SEM_NOME,
    });
    const doCx = montarPedidoProgresso('tok', { tipo: 'identificacao' }, {
      ...comum,
      convite: COM_NOME,
    });
    expect(doCliente.nome_informado).toBe('Ana Lima');
    expect(doCx.nome_informado).toBeUndefined();
  });

  it('as marcações canônicas não repetem id nem carregam id estranho', () => {
    expect(marcadasCanonicas(VERSAO, ['r4', 'r1', 'r1', 'nao-existe'])).toEqual(['r1', 'r4']);
  });
});

describe('a porta do aceite', () => {
  it('recusa concluir sem a declaração confirmada', () => {
    const semDeclaracao = estado({ declaracaoConfirmada: false });
    expect(podeConcluir(semDeclaracao)).toBe(false);
    expect(impedimentosDoAceite(semDeclaracao)).toContain('Falta confirmar a declaração final.');
    expect(() => montarPedidoConcluir('tok', semDeclaracao)).toThrow(/conclusão bloqueada/);
  });

  it('recusa concluir com regra obrigatória por marcar, e diz quantas faltam', () => {
    const incompleto = estado({ marcadas: ['r1'] });
    expect(podeConcluir(incompleto)).toBe(false);
    expect(impedimentosDoAceite(incompleto)[0]).toBe('Faltam confirmar 2 itens do manual.');
    expect(impedimentosDoAceite(estado({ marcadas: ['r1', 'r2'] }))[0]).toBe(
      'Falta confirmar 1 item do manual.',
    );
  });

  it('recusa concluir sem nome quando o convite não trouxe um', () => {
    const semNome = estado({ convite: SEM_NOME, nomeInformado: ' ' });
    expect(impedimentosDoAceite(semNome)).toContain('Falta informar seu nome completo.');
    expect(() => montarPedidoConcluir('tok', semNome)).toThrow();
  });

  it('monta o pedido completo, com o nome limpo e as regras na ordem', () => {
    const pronto = estado({ convite: SEM_NOME, nomeInformado: '  Ana Lima ', marcadas: ['r4', 'r2', 'r1'] });
    expect(podeConcluir(pronto)).toBe(true);
    expect(montarPedidoConcluir('tok', pronto)).toEqual({
      acao: 'concluir',
      token: 'tok',
      nome: 'Ana Lima',
      regras_marcadas: ['r1', 'r2', 'r4'],
      declaracao_confirmada: true,
    });
  });

  it('quando o convite traz o nome, o pedido não carrega nome nenhum', () => {
    const pedido = montarPedidoConcluir('tok', estado({ nomeInformado: 'Outra Pessoa' }));
    expect(pedido.nome).toBeUndefined();
    expect(nomeParaAceite(COM_NOME, 'Outra Pessoa')).toBe('Maria Souza');
  });

  it('alternar marca e desmarca sem duplicar', () => {
    expect(alternarRegra(['r1'], 'r2')).toEqual(['r1', 'r2']);
    expect(alternarRegra(['r1', 'r2'], 'r1')).toEqual(['r2']);
  });
});

describe('o que o link abriu', () => {
  function resposta(dados: RespostaAbrir) {
    return situacaoDe({ ok: true, dados });
  }

  it('convite válido vira sessão, retomando onde parou', () => {
    const situacao = resposta({
      estado: 'valido',
      convite: SEM_NOME,
      versao: VERSAO,
      progresso: { secao_ordem: 2, regras_marcadas: ['r1'], nome_informado: 'João' },
    });
    expect(situacao.tipo).toBe('fluxo');
    if (situacao.tipo !== 'fluxo') throw new Error('esperava fluxo');
    // O capítulo vem da `secao_ordem`; a ETAPA vem das marcações — r4, a única
    // obrigatória de S2, continua por marcar.
    expect(situacao.sessao.passo).toEqual({ tipo: 'capitulo', indice: 1, etapa: 1 });
    expect(situacao.sessao.marcadas).toEqual(['r1']);
    expect(situacao.sessao.nome).toBe('João');
    // A declaração NUNCA volta confirmada de uma visita anterior.
    expect(situacao.sessao.declaracaoConfirmada).toBe(false);
  });

  it('cada estado ruim do convite tem a sua própria tela', () => {
    expect(resposta({ estado: 'invalido' })).toEqual({ tipo: 'bloqueado', estado: 'invalido' });
    expect(resposta({ estado: 'expirado' })).toEqual({ tipo: 'bloqueado', estado: 'expirado' });
    expect(resposta({ estado: 'revogado' })).toEqual({ tipo: 'bloqueado', estado: 'revogado' });
  });

  it('convite concluído não é erro: devolve o aceite para o cliente baixar', () => {
    const aceite = {
      aceite_id: 'a1',
      aceito_em: '2026-08-14T12:00:00Z',
      conteudo_sha256: 'abc',
      versao_numero: 3,
    };
    expect(resposta({ estado: 'concluido', aceite })).toEqual({ tipo: 'concluido', aceite });
  });

  it('resposta válida SEM o manual é falha sem volta, não tela em branco', () => {
    const situacao = resposta({ estado: 'valido', convite: COM_NOME });
    expect(situacao.tipo).toBe('falha');
    if (situacao.tipo !== 'falha') throw new Error('esperava falha');
    expect(situacao.falha.recuperavel).toBe(false);
  });

  it('estado fora do contrato é tratado como link inválido', () => {
    // Vem da REDE, não do nosso código: o `as` simula um servidor que respondeu
    // algo que o contrato não prevê.
    const estranho = { estado: 'coisa-nova' } as unknown as RespostaAbrir;
    expect(situacaoDe({ ok: true, dados: estranho })).toEqual({
      tipo: 'bloqueado',
      estado: 'invalido',
    });
  });

  it('falha de rede atravessa inteira, com a recuperabilidade preservada', () => {
    const falha = { mensagem: 'Sem rede.', recuperavel: true };
    expect(situacaoDe({ ok: false, falha })).toEqual({ tipo: 'falha', falha });
  });
});

describe('a sessão vira estado de aceite', () => {
  it('leva nome, marcações e declaração para a máquina do aceite', () => {
    const sessao: Sessao = {
      convite: SEM_NOME,
      versao: VERSAO,
      passo: { tipo: 'revisao' },
      marcadas: ['r1', 'r2', 'r4'],
      nome: 'Ana Lima',
      declaracaoConfirmada: true,
    };
    expect(podeConcluir(aceiteDaSessao(sessao))).toBe(true);
  });
});
