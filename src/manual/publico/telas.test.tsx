/**
 * ─── AS TELAS MONTAM? ────────────────────────────────────────────────────────
 *
 * `renderToStaticMarkup` — sem DOM, sem jsdom, sem dependência nova. Não é
 * teste de desenho (classe de Tailwind não se afirma em teste); é a prova de
 * que cada tela RENDERIZA e de que o texto que decide alguma coisa está nela:
 * o rótulo do aceite, o botão travado, a frase de cada link morto.
 *
 * A lacuna que isto fecha é real: a lógica pura pode estar perfeita e o fluxo
 * quebrar num acesso a campo indefinido dentro do JSX — e no celular do
 * cliente isso é uma tela branca, sem erro visível para ninguém.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ConviteAberto, Versao } from '../tipos';
import Fluxo from './Fluxo';
import { Abertura } from './Abertura';
import { Conclusao } from './Conclusao';
import { Identificacao } from './Identificacao';
import { Revisao } from './Revisao';
import { Secao } from './Secao';
import { JaConcluido, LinkExpirado, LinkInvalido, LinkRevogado } from './Estados';
import { andamentoDe, secoesEmOrdem } from './maquina';
import type { EstadoDoAceite } from './maquina';

const VERSAO: Versao = {
  id: 'v1',
  numero: 3,
  titulo: 'Manual DOXA',
  declaracao: 'Declaro que li, entendi e concordo com o manual inteiro.',
  secoes: [
    {
      id: 's1',
      slug: 'prazos',
      titulo: 'Prazos',
      descricao: 'Como o tempo funciona por aqui.',
      ordem: 1,
      regras: [
        {
          id: 'r1',
          codigo: 'PR-01',
          titulo: 'Material até quinta',
          instrucao: 'Envie o material até quinta-feira.',
          porque: 'Sem material não há edição na sexta.',
          exemplo: 'Mandar os brutos na quarta à noite.',
          severidade: 'critica',
          obrigatoria: true,
          ordem: 1,
        },
        {
          id: 'r2',
          codigo: 'PR-02',
          titulo: 'Feriado conta',
          instrucao: 'Feriado não estica prazo.',
          porque: 'A grade de publicação não para.',
          exemplo: 'Adiantar o envio na véspera.',
          severidade: 'normal',
          obrigatoria: false,
          ordem: 2,
        },
      ],
    },
  ],
};

const CONVITE: ConviteAberto = {
  email: 'cliente@empresa.com',
  empresa: 'Empresa LTDA',
  nome_cliente: null,
  expira_em: '2026-09-01T12:00:00Z',
};

function desenhar(no: Parameters<typeof renderToStaticMarkup>[0]): string {
  return renderToStaticMarkup(no);
}

const nada = () => undefined;

/**
 * O ATRIBUTO, não a classe.
 *
 * Procurar a palavra "disabled" solta dá falso positivo: os botões carregam
 * `disabled:bg-white/15` no `class` mesmo quando estão liberados. Isto aqui é
 * o que o React escreve quando o botão está de fato travado.
 */
const BOTAO_TRAVADO = 'disabled=""';

describe('as telas do caminho', () => {
  it('a abertura conta o que é, quanto custa e o que fica registrado', () => {
    const html = desenhar(<Abertura versao={VERSAO} convite={CONVITE} aoComecar={nada} />);
    expect(html).toContain('Manual DOXA');
    expect(html).toContain('Empresa LTDA');
    expect(html).toContain('O que fica registrado');
    // A informativa não entra na conta de regras a confirmar.
    expect(html).toContain('1 regra');
  });

  it('a identificação trava e-mail e empresa e só abre campo para o nome', () => {
    const html = desenhar(
      <Identificacao
        convite={CONVITE}
        nome=""
        aoDigitarNome={nada}
        aoAvancar={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('cliente@empresa.com');
    expect(html).toContain('Seu nome completo');
    // Um só campo digitável na tela inteira: o nome.
    expect(html.match(/<input/g)?.length).toBe(1);
    // Sem nome válido, o botão de seguir nasce travado.
    expect(html).toContain(BOTAO_TRAVADO);
  });

  it('a identificação não abre campo quando o convite já traz o nome', () => {
    const html = desenhar(
      <Identificacao
        convite={{ ...CONVITE, nome_cliente: 'Maria Souza' }}
        nome="Maria Souza"
        aoDigitarNome={nada}
        aoAvancar={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Maria Souza');
    expect(html).not.toContain('<input');
  });

  it('a seção mostra o porquê, o exemplo, o selo da crítica e o aceite', () => {
    const secao = secoesEmOrdem(VERSAO)[0];
    const html = desenhar(
      <Secao
        secao={secao}
        posicao={1}
        total={1}
        andamento={andamentoDe(VERSAO, [])}
        marcadas={[]}
        aoAlternar={nada}
        aoAvancar={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Por que existe');
    expect(html).toContain('Na prática');
    expect(html).toContain('Crítica');
    expect(html).toContain('Li, entendi e concordo');
    expect(html).toContain('Informativo');
    expect(html).toContain('Falta confirmar 1 regra desta seção.');
    // Nada marcado: o botão de avançar está travado.
    expect(html).toContain(BOTAO_TRAVADO);
  });

  it('a seção libera o avanço com a obrigatória marcada', () => {
    const html = desenhar(
      <Secao
        secao={secoesEmOrdem(VERSAO)[0]}
        posicao={1}
        total={1}
        andamento={andamentoDe(VERSAO, ['r1'])}
        marcadas={['r1']}
        aoAlternar={nada}
        aoAvancar={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Tudo desta seção confirmado.');
    expect(html).not.toContain(BOTAO_TRAVADO);
  });

  it('a revisão mostra a declaração inteira e o aviso da garantia', () => {
    const estado: EstadoDoAceite = {
      versao: VERSAO,
      convite: CONVITE,
      marcadas: ['r1'],
      nomeInformado: 'Ana Lima',
      declaracaoConfirmada: false,
    };
    const html = desenhar(
      <Revisao
        estado={estado}
        nomeParaMostrar="Ana Lima"
        impedimentos={['Falta confirmar a declaração final.']}
        enviando={false}
        aoConfirmarDeclaracao={nada}
        aoConcluir={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Declaro que li, entendi e concordo com o manual inteiro.');
    expect(html).toContain('invalidar a garantia');
    expect(html).toContain('Confirmo que li e concordo com a declaração acima');
    expect(html).toContain('Falta confirmar a declaração final.');
    expect(html).toContain(BOTAO_TRAVADO);
    // O termo que o dono proibiu não aparece em lugar nenhum do fluxo.
    expect(html.toLowerCase()).not.toContain('assinatura eletrônica');
  });

  it('a conclusão entrega registro, data, versão e o link do PDF', () => {
    const html = desenhar(
      <Conclusao
        comprovante={{
          token: 'tok',
          aceite_id: 'a-123',
          aceito_em: '2026-08-14T12:00:00Z',
          conteudo_sha256: 'abc',
          pdf_url: 'https://exemplo/assinada.pdf',
          pdf_sha256: 'def',
          versao_numero: 3,
          nome: 'Ana Lima',
          empresa: 'Empresa LTDA',
        }}
        pedindoPdf={false}
        aoPedirPdf={nada}
      />,
    );
    expect(html).toContain('a-123');
    expect(html).toContain('Versão 3');
    expect(html).toContain('href="https://exemplo/assinada.pdf"');
    expect(html).toContain('arquivado');
  });

  it('sem PDF pronto, a conclusão pede um em vez de oferecer link morto', () => {
    const html = desenhar(
      <Conclusao
        comprovante={{
          token: 'tok',
          aceite_id: 'a-123',
          aceito_em: '2026-08-14T12:00:00Z',
          conteudo_sha256: 'abc',
          pdf_url: null,
          pdf_sha256: null,
          versao_numero: 3,
          nome: 'Ana Lima',
          empresa: 'Empresa LTDA',
        }}
        pedindoPdf={false}
        aoPedirPdf={nada}
      />,
    );
    expect(html).not.toContain('<a href');
    expect(html).toContain('Baixar meu comprovante em PDF');
  });
});

describe('as telas de link morto', () => {
  it('cada estado diz o que houve e o que fazer, sem culpar o cliente', () => {
    expect(desenhar(<LinkInvalido />)).toContain('não é válido');
    expect(desenhar(<LinkExpirado />)).toContain('expirou');
    expect(desenhar(<LinkRevogado />)).toContain('cancelado');
  });

  it('o convite já concluído mostra o registro e o botão de baixar', () => {
    const html = desenhar(
      <JaConcluido
        aceite={{
          aceite_id: 'a-999',
          aceito_em: '2026-08-14T12:00:00Z',
          conteudo_sha256: 'abc',
          versao_numero: 2,
        }}
        aoBaixar={nada}
        baixando={false}
      />,
    );
    expect(html).toContain('a-999');
    expect(html).toContain('Baixar meu comprovante em PDF');
  });
});

describe('o roteador do fluxo', () => {
  it('caminho sem convite cai na tela de link inválido', () => {
    expect(desenhar(<Fluxo segmentos={[]} navegar={nada} />)).toContain('não é válido');
    expect(desenhar(<Fluxo segmentos={['convite']} navegar={nada} />)).toContain('não é válido');
  });

  it('o convite começa carregando, sem piscar erro antes da resposta', () => {
    const html = desenhar(<Fluxo segmentos={['convite', 'tok']} navegar={nada} />);
    expect(html).toContain('Abrindo seu manual');
  });

  it('/concluido sem comprovante na memória orienta reabrir o convite', () => {
    const html = desenhar(<Fluxo segmentos={['concluido']} navegar={nada} />);
    expect(html).toContain('Manual concluído');
    expect(html).toContain('reabra o link do convite');
  });
});
