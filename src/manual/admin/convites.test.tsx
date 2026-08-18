/**
 * ─── OS TESTES DA LISTA DE CONVITES ──────────────────────────────────────────
 *
 * Três coisas se provam aqui, e as três só quebram na cara do CX:
 *
 *  1. o botão de EXCLUIR existe na linha do convite que ainda dá para apagar e
 *     NÃO existe na do concluído. A API recusa o concluído com 409 de qualquer
 *     jeito, mas oferecer o gesto e depois negá-lo é ensinar que o painel erra;
 *  2. a exclusão só acontece em DOIS TEMPOS — o primeiro clique pergunta, o
 *     segundo apaga. Um teste que só olhasse o `onClick` não veria a pergunta;
 *  3. a tipografia dos rótulos. Caixa alta some do painel inteiro (ordem do
 *     dono), e uma classe esquecida num `<th>` não dá erro nenhum: dá uma tela
 *     quase certa, que ninguém repara e ninguém corrige.
 *
 * As telas saem por `renderToStaticMarkup`, o padrão do repo: sem DOM, sem
 * jsdom, sem dependência nova. O painel é montado à mão, que é o que permite
 * ver a lista pronta sem rede nem sessão.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Convites } from './Convites';
import { NovoConvite } from './NovoConvite';
import { ExcluirEmDoisTempos } from './pecas';
import type { EstadoDoPainel } from './usarAdmin';
import type { ConviteLinha, StatusDoConvite, VersaoLinha } from '../tipos';

const VERSAO: VersaoLinha = {
  id: 'v-1',
  numero: 1,
  titulo: 'Manual DOXA',
  declaracao: 'Declaro que li o manual inteiro.',
  status: 'publicada',
  hash_conteudo: 'sha',
  criado_em: '2026-08-01T12:00:00Z',
  publicado_em: '2026-08-02T12:00:00Z',
};

function convite(status: StatusDoConvite): ConviteLinha {
  return {
    id: `c-${status}`,
    email: 'contato@empresa.com',
    empresa: 'Empresa do Cliente',
    nome_cliente: null,
    invite_plataforma: null,
    versao_id: VERSAO.id,
    status,
    expira_em: null,
    criado_em: '2026-08-10T12:00:00Z',
    aberto_em: null,
    concluido_em: status === 'concluido' ? '2026-08-11T12:00:00Z' : null,
    revogado_em: null,
    regenerado_de: null,
  };
}

function painelCom(convites: ConviteLinha[]): EstadoDoPainel {
  return {
    convites,
    versoes: [VERSAO],
    vigente: VERSAO,
    carga: 'pronto',
    erro: null,
    recarregar: () => Promise.resolve(),
  };
}

function listaDe(convites: ConviteLinha[]): string {
  return renderToStaticMarkup(
    <Convites painel={painelCom(convites)} ir={() => undefined} situacaoInicial="todos" />,
  );
}

describe('o botão de excluir na lista', () => {
  it('aparece no convite que ainda não virou prova', () => {
    expect(listaDe([convite('pendente')])).toContain('Excluir');
  });

  it('NÃO aparece no concluído — a prova não se apaga', () => {
    const html = listaDe([convite('concluido')]);
    expect(html).not.toContain('Excluir');
    // A linha continua lá, com a situação: some o botão, não o convite.
    expect(html).toContain('Empresa do Cliente');
  });

  it('some junto com o regenerar quando o convite já foi aceito', () => {
    expect(listaDe([convite('concluido')])).not.toContain('Regenerar');
  });
});

describe('a exclusão em dois tempos', () => {
  const nada = () => undefined;

  it('no primeiro tempo só pergunta — não há botão de apagar de vez', () => {
    const html = renderToStaticMarkup(
      <ExcluirEmDoisTempos
        confirmando={false}
        ocupado={false}
        aoPedir={nada}
        aoConfirmar={nada}
        aoDesistir={nada}
      />,
    );
    expect(html).toContain('Excluir');
    expect(html).not.toContain('Excluir de vez');
    expect(html).not.toContain('Cancelar');
  });

  it('no segundo tempo cobra a certeza e deixa desistir', () => {
    const html = renderToStaticMarkup(
      <ExcluirEmDoisTempos
        confirmando
        ocupado={false}
        aoPedir={nada}
        aoConfirmar={nada}
        aoDesistir={nada}
      />,
    );
    expect(html).toContain('Excluir de vez');
    expect(html).toContain('Cancelar');
    // 44px é o alvo mínimo do dedo, e este é o clique que não tem volta.
    expect(html).toContain('min-h-[44px]');
  });

  it('enquanto apaga, diz que está apagando e tranca os dois botões', () => {
    const html = renderToStaticMarkup(
      <ExcluirEmDoisTempos
        confirmando
        ocupado
        aoPedir={nada}
        aoConfirmar={nada}
        aoDesistir={nada}
      />,
    );
    expect(html).toContain('Excluindo…');
    // O atributo, e não a classe `disabled:opacity-40`: os dois botões trancam
    // enquanto a chamada corre, e clicar de novo mandaria o pedido em dobro.
    expect(html.match(/disabled=""/g) ?? []).toHaveLength(2);
  });
});

describe('o formulário do convite novo', () => {
  it('tem o campo do invite da plataforma, e ele é opcional', () => {
    const html = renderToStaticMarkup(
      <NovoConvite vigente={VERSAO} aoCriar={() => undefined} aoFechar={() => undefined} />,
    );
    expect(html).toContain('Invite plataforma DOXA (opcional)');
    expect(html).toContain('começando em https://');
  });
});

describe('os rótulos do painel', () => {
  it('não sobrou caixa alta nem na lista nem no formulário', () => {
    const lista = listaDe([convite('pendente'), convite('concluido')]);
    const formulario = renderToStaticMarkup(
      <NovoConvite vigente={VERSAO} aoCriar={() => undefined} aoFechar={() => undefined} />,
    );
    expect(lista).not.toContain('uppercase');
    expect(formulario).not.toContain('uppercase');
  });

  it('o cabeçalho da tabela é serifa, e não etiqueta espaçada', () => {
    const lista = listaDe([convite('pendente')]);
    expect(lista).toContain('font-serif');
    expect(lista).not.toContain('tracking-[0.1em]');
  });
});
