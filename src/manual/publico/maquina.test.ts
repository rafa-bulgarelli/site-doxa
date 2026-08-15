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
  faltamNa,
  feitioDo,
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
    expect(feitioDo(S1)).toBe('aceites');
    expect(feitioDo(secao('so-leitura', 9, [regra('x', 1, { obrigatoria: false })]))).toBe(
      'leitura',
    );
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

describe('navegação entre passos', () => {
  const abertura: Passo = { tipo: 'abertura' };

  it('vai da abertura à identificação e daí para o primeiro capítulo', () => {
    expect(proximoPasso(abertura, VERSAO)).toEqual({ tipo: 'identificacao' });
    expect(proximoPasso({ tipo: 'identificacao' }, VERSAO)).toEqual({ tipo: 'capitulo', indice: 0 });
  });

  it('o último CAPÍTULO leva à revisão — os termos nunca viram um passo', () => {
    expect(proximoPasso({ tipo: 'capitulo', indice: 1 }, VERSAO)).toEqual({ tipo: 'revisao' });
    expect(proximoPasso({ tipo: 'revisao' }, VERSAO)).toEqual({ tipo: 'revisao' });
  });

  it('voltar é sempre possível, e da revisão cai no último capítulo', () => {
    expect(passoAnterior({ tipo: 'revisao' }, VERSAO)).toEqual({ tipo: 'capitulo', indice: 1 });
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

  it('a chave do passo distingue capítulos diferentes', () => {
    expect(chaveDoPasso({ tipo: 'capitulo', indice: 1 })).toBe('capitulo-1');
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
    });
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
    expect(situacao.sessao.passo).toEqual({ tipo: 'capitulo', indice: 1 });
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
