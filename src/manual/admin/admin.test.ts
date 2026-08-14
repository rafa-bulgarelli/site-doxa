/**
 * ─── OS TESTES DA ÁREA DA EQUIPE ─────────────────────────────────────────────
 *
 * Cobrem o que quebra em silêncio: a derivação de "expirado" (que não existe no
 * banco), os filtros, a montagem do pedido de convite, o CSV e as contas do
 * editor de rascunho — slug, código e reordenação, todas com um `check` do
 * Postgres do outro lado.
 *
 * NÃO cobrem o desenho. Um teste que afirma que um botão tem `rounded-full` não
 * prova nada e quebra a cada ajuste de estilo.
 */
import { describe, expect, it } from 'vitest';
import { montarCsvDeConvites, nomeDoArquivo } from './csv';
import {
  contarSituacoes,
  derivarConvites,
  pedidoDeCriacao,
  situacaoDo,
  validarConvite,
} from './filtrar';
import {
  podePublicar,
  proximaOrdem,
  proximoCodigo,
  regrasDaSecao,
  slugDe,
  slugLivre,
  trocarOrdem,
} from './conteudo';
import type { EscolhasDeConvite, RascunhoDeConvite } from './filtrar';
import type { ConviteLinha, RegraLinha, SecaoLinha, VersaoLinha } from '../tipos';

const AGORA = new Date('2026-08-14T12:00:00.000Z').getTime();
const ONTEM = new Date('2026-08-13T12:00:00.000Z').toISOString();
const AMANHA = new Date('2026-08-15T12:00:00.000Z').toISOString();

function convite(extra: Partial<ConviteLinha> = {}): ConviteLinha {
  return {
    id: Math.random().toString(36).slice(2),
    email: 'contato@empresa.com',
    empresa: 'Empresa',
    nome_cliente: null,
    versao_id: 'v1',
    status: 'pendente',
    expira_em: null,
    criado_em: ONTEM,
    aberto_em: null,
    concluido_em: null,
    revogado_em: null,
    regenerado_de: null,
    ...extra,
  };
}

function regra(extra: Partial<RegraLinha> = {}): RegraLinha {
  return {
    id: Math.random().toString(36).slice(2),
    secao_id: 's1',
    codigo: 'R1',
    titulo: 'Regra',
    instrucao: 'Faça assim.',
    porque: '',
    exemplo: '',
    severidade: 'normal',
    obrigatoria: true,
    ordem: 0,
    ...extra,
  };
}

const escolhas: EscolhasDeConvite = {
  busca: '',
  situacao: 'todos',
  versaoId: 'todas',
  ordem: 'recentes',
  pagina: 1,
  porPagina: 10,
};

describe('a situação do convite', () => {
  it('deriva expirado do relógio — o banco nunca grava esse status', () => {
    expect(situacaoDo(convite({ expira_em: ONTEM }), AGORA)).toBe('expirado');
    expect(situacaoDo(convite({ expira_em: AMANHA }), AGORA)).toBe('pendente');
    expect(situacaoDo(convite({ expira_em: null }), AGORA)).toBe('pendente');
  });

  it('expira também o que já tinha sido aberto', () => {
    const aberto = convite({ status: 'aberto', aberto_em: ONTEM, expira_em: ONTEM });
    expect(situacaoDo(aberto, AGORA)).toBe('expirado');
  });

  it('concluído e revogado vencem o relógio — o que aconteceu, aconteceu', () => {
    // O caso que mais engana: um convite aceito HÁ MESES tem `expira_em` no
    // passado. Chamá-lo de "expirado" na tela faria o time achar que o cliente
    // não assinou.
    const concluido = convite({ status: 'concluido', concluido_em: ONTEM, expira_em: ONTEM });
    const revogado = convite({ status: 'revogado', revogado_em: ONTEM, expira_em: ONTEM });
    expect(situacaoDo(concluido, AGORA)).toBe('concluido');
    expect(situacaoDo(revogado, AGORA)).toBe('revogado');
  });
});

describe('a lista de convites', () => {
  it('conta cada situação, com o expirado saindo do pendente', () => {
    const contagem = contarSituacoes(
      [
        convite(),
        convite({ expira_em: ONTEM }),
        convite({ status: 'concluido', concluido_em: ONTEM, aberto_em: ONTEM }),
      ],
      AGORA,
    );
    expect(contagem).toMatchObject({
      total: 3,
      pendente: 1,
      expirado: 1,
      concluido: 1,
      aberto: 0,
      revogado: 0,
    });
  });

  it('busca sem acento e sem caixa, por empresa, e-mail e nome', () => {
    const lista = [
      convite({ empresa: 'Padaria Peçanha' }),
      convite({ empresa: 'Outra', email: 'joao@outra.com' }),
      convite({ empresa: 'Terceira', nome_cliente: 'João Ávila' }),
    ];
    expect(derivarConvites(lista, { ...escolhas, busca: 'pecanha' }, AGORA).filtrados).toHaveLength(1);
    expect(derivarConvites(lista, { ...escolhas, busca: 'JOAO@' }, AGORA).filtrados).toHaveLength(1);
    expect(derivarConvites(lista, { ...escolhas, busca: 'avila' }, AGORA).filtrados).toHaveLength(1);
  });

  it('filtra por situação derivada e por versão', () => {
    const lista = [
      convite({ versao_id: 'v1', expira_em: ONTEM }),
      convite({ versao_id: 'v2' }),
      convite({ versao_id: 'v2', expira_em: ONTEM }),
    ];
    expect(derivarConvites(lista, { ...escolhas, situacao: 'expirado' }, AGORA).filtrados).toHaveLength(2);
    expect(derivarConvites(lista, { ...escolhas, versaoId: 'v2' }, AGORA).filtrados).toHaveLength(2);
    const dois = derivarConvites(
      lista,
      { ...escolhas, situacao: 'expirado', versaoId: 'v2' },
      AGORA,
    );
    expect(dois.filtrados).toHaveLength(1);
  });

  it('ordena por data e por empresa', () => {
    const velho = convite({ empresa: 'Zeta', criado_em: '2026-01-01T00:00:00.000Z' });
    const novo = convite({ empresa: 'Alfa', criado_em: '2026-08-01T00:00:00.000Z' });
    const lista = [velho, novo];
    expect(derivarConvites(lista, escolhas, AGORA).filtrados[0].empresa).toBe('Alfa');
    expect(derivarConvites(lista, { ...escolhas, ordem: 'antigos' }, AGORA).filtrados[0].empresa).toBe('Zeta');
    expect(derivarConvites(lista, { ...escolhas, ordem: 'empresa' }, AGORA).filtrados[0].empresa).toBe('Alfa');
  });

  it('não deixa a página passar do fim da lista', () => {
    const lista = [convite(), convite(), convite()];
    const visao = derivarConvites(lista, { ...escolhas, porPagina: 2, pagina: 9 }, AGORA);
    expect(visao.paginas).toBe(2);
    expect(visao.pagina).toBe(2);
    expect(visao.daPagina).toHaveLength(1);
  });

  it('não perde convite quando a lista cabe numa página só', () => {
    const visao = derivarConvites([convite()], { ...escolhas, porPagina: 10 }, AGORA);
    expect(visao.paginas).toBe(1);
    expect(visao.daPagina).toHaveLength(1);
  });
});

describe('o formulário do convite', () => {
  const cheio: RascunhoDeConvite = {
    email: 'cliente@empresa.com',
    empresa: 'Empresa do Cliente',
    nomeCliente: 'Maria',
    expiraEm: '2026-08-20',
  };

  it('aceita o preenchimento completo', () => {
    expect(validarConvite(cheio, AGORA)).toEqual({});
  });

  it('recusa e-mail torto e empresa curta, e explica cada um', () => {
    const problemas = validarConvite({ ...cheio, email: 'sem-arroba', empresa: 'A' }, AGORA);
    expect(problemas.email).toBeTruthy();
    expect(problemas.empresa).toBeTruthy();
  });

  it('recusa prazo no passado — convite que nasce vencido não abre', () => {
    expect(validarConvite({ ...cheio, expiraEm: '2026-08-01' }, AGORA).expiraEm).toBeTruthy();
  });

  it('deixa o nome em branco: quem informa é o cliente', () => {
    expect(validarConvite({ ...cheio, nomeCliente: '' }, AGORA)).toEqual({});
  });

  it('monta o pedido da API com o prazo no FIM do dia escolhido', () => {
    const pedido = pedidoDeCriacao(cheio);
    expect(pedido.acao).toBe('convite_criar');
    expect(pedido.email).toBe('cliente@empresa.com');
    expect(pedido.nome_cliente).toBe('Maria');
    // O dia inteiro vale: quem digita 20/08 espera o convite vivo até o fim
    // daquele dia, não até a meia-noite anterior.
    expect(new Date(pedido.expira_em ?? '').getTime()).toBeGreaterThan(
      new Date('2026-08-20T00:00:00').getTime(),
    );
  });

  it('omite os opcionais em branco em vez de mandar string vazia', () => {
    const pedido = pedidoDeCriacao({ ...cheio, nomeCliente: '  ', expiraEm: '' });
    expect(pedido.nome_cliente).toBeUndefined();
    expect(pedido.expira_em).toBeUndefined();
  });

  it('tira o espaço sobrando do que a pessoa colou', () => {
    const pedido = pedidoDeCriacao({ ...cheio, email: '  cliente@empresa.com ', empresa: ' Loja ' });
    expect(pedido.email).toBe('cliente@empresa.com');
    expect(pedido.empresa).toBe('Loja');
  });
});

describe('a exportação', () => {
  const versoes: VersaoLinha[] = [
    {
      id: 'v1',
      numero: 3,
      titulo: 'Manual',
      declaracao: 'x',
      status: 'publicada',
      hash_conteudo: 'a'.repeat(64),
      criado_em: ONTEM,
      publicado_em: ONTEM,
    },
  ];

  it('põe o BOM e o cabeçalho — sem eles o Excel abre acento torto', () => {
    const csv = montarCsvDeConvites([], versoes, AGORA);
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv).toContain('Empresa,E-mail');
  });

  it('protege vírgula e aspas de dentro da célula', () => {
    const csv = montarCsvDeConvites(
      [convite({ empresa: 'Silva, Souza e "Cia"' })],
      versoes,
      AGORA,
    );
    expect(csv).toContain('"Silva, Souza e ""Cia"""');
  });

  it('desarma a fórmula do Excel quando a célula começa com sinal', () => {
    // Injeção de CSV: sem o apóstrofo, o Excel EXECUTA o texto de um estranho.
    const csv = montarCsvDeConvites([convite({ empresa: '=SOMA(A1:A9)' })], versoes, AGORA);
    expect(csv).toContain("'=SOMA(A1:A9)");
  });

  it('leva a situação derivada e o número da versão, não os ids', () => {
    const csv = montarCsvDeConvites(
      [convite({ versao_id: 'v1', expira_em: ONTEM })],
      versoes,
      AGORA,
    );
    expect(csv).toContain('Expirado');
    expect(csv).toContain('v3');
    expect(csv).not.toContain('v1,');
  });

  it('nomeia o arquivo com a data e a quantidade', () => {
    expect(nomeDoArquivo(7)).toMatch(/^convites-manual-\d{4}-\d{2}-\d{2}-7\.csv$/);
  });
});

describe('as contas do editor', () => {
  it('faz do título um slug que o `check` do banco aceita', () => {
    expect(slugDe('Operação & Prazos')).toBe('operacao-prazos');
    expect(slugDe('  ')).toBe('secao');
    expect(slugDe('Já!')).toBe('ja');
    expect(slugDe('Seção nova')).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('desvia do slug que já existe — o par versão+slug é único', () => {
    expect(slugLivre('Seção nova', ['secao-nova'])).toBe('secao-nova-2');
    expect(slugLivre('Seção nova', ['secao-nova', 'secao-nova-2'])).toBe('secao-nova-3');
  });

  it('dá o próximo código livre, e não a contagem', () => {
    // Apagar a R2 e criar outra não pode devolver "R2" se a R3 existe? Pode —
    // o que não pode é repetir um código VIVO, e é isso que se prova aqui.
    expect(proximoCodigo([regra({ codigo: 'R1' }), regra({ codigo: 'R3' })])).toBe('R2');
    expect(proximoCodigo([regra({ codigo: 'R1' }), regra({ codigo: 'R2' })])).toBe('R3');
    expect(proximoCodigo([])).toBe('R1');
  });

  it('põe o item novo no fim da fila, começando em zero', () => {
    expect(proximaOrdem([])).toBe(0);
    expect(proximaOrdem([{ id: 'a', ordem: 0 }, { id: 'b', ordem: 4 }])).toBe(5);
  });

  it('troca só o par vizinho, e nada nas pontas', () => {
    const fila = [
      { id: 'a', ordem: 0 },
      { id: 'b', ordem: 1 },
      { id: 'c', ordem: 2 },
    ];
    expect(trocarOrdem(fila, 'b', -1)).toEqual([
      { id: 'b', ordem: 0 },
      { id: 'a', ordem: 1 },
    ]);
    expect(trocarOrdem(fila, 'a', -1)).toEqual([]);
    expect(trocarOrdem(fila, 'c', 1)).toEqual([]);
  });

  it('desempata posições iguais em vez de trocar nada', () => {
    const empatada = [
      { id: 'a', ordem: 0 },
      { id: 'b', ordem: 0 },
    ];
    const trocado = trocarOrdem(empatada, 'b', -1);
    expect(trocado).toEqual([
      { id: 'b', ordem: 0 },
      { id: 'a', ordem: 1 },
    ]);
  });

  it('agrupa as regras da seção na ordem em que o cliente as vê', () => {
    const secao: SecaoLinha = {
      id: 's1',
      versao_id: 'v1',
      slug: 's',
      titulo: 'S',
      descricao: '',
      ordem: 0,
    };
    const lista = [
      regra({ secao_id: 's1', codigo: 'R2', ordem: 2 }),
      regra({ secao_id: 's2', codigo: 'R9', ordem: 0 }),
      regra({ secao_id: 's1', codigo: 'R1', ordem: 1 }),
    ];
    expect(regrasDaSecao(lista, secao).map((r) => r.codigo)).toEqual(['R1', 'R2']);
  });

  it('só deixa publicar o que tem regra obrigatória — sem ela não há aceite', () => {
    expect(podePublicar([regra({ obrigatoria: false })])).toBe(false);
    expect(podePublicar([regra({ obrigatoria: false }), regra({ obrigatoria: true })])).toBe(true);
    expect(podePublicar([])).toBe(false);
  });
});
