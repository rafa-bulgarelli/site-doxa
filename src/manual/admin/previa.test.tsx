/**
 * ─── A PRÉVIA DO MANUAL ──────────────────────────────────────────────────────
 *
 * Duas coisas se provam aqui, e as duas quebram em silêncio:
 *
 *  1. a COSTURA. A área do time lê linhas planas do PostgREST e o fluxo do
 *     cliente espera uma `Versao` aninhada. Um erro nessa tradução — regra na
 *     seção errada, ordem trocada, campo esquecido — não dá erro nenhum: dá um
 *     manual plausível e errado, que é o pior resultado possível numa tela cujo
 *     propósito é CONFERIR o manual;
 *  2. o que a prévia NÃO tem. Ela anda até o fim e não pode oferecer nada capaz
 *     de gravar aceite. O botão de concluir precisa estar ausente por teste, e
 *     precisa continuar PRESENTE no fluxo do cliente — a mesma revisão serve
 *     aos dois, e é essa a única diferença entre eles.
 *
 * As telas saem por `renderToStaticMarkup`, o padrão do repo: sem DOM, sem
 * jsdom, sem dependência nova. A sessão é montada à mão para cada passo, que é
 * o que permite ver a revisão sem simular seis cliques.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { montarVersao } from './conteudo';
import { estadoDaPrevia } from './PreviaDoManual';
import { Previa, TelaDaPrevia, sessaoDeExemplo } from '../publico/Previa';
import { Revisao } from '../publico/Revisao';
import { aceiteDaSessao, termosDaVersao } from '../publico/maquina';
import type { Sessao } from '../publico/maquina';
import type { RegraLinha, SecaoLinha, Versao, VersaoLinha } from '../tipos';

/* ─── AS LINHAS, COMO O POSTGREST AS ENTREGA ───────────────────────────────── */

const VERSAO_LINHA: VersaoLinha = {
  id: 'v-2',
  numero: 2,
  titulo: 'Manual DOXA',
  declaracao: 'Declaro que li, entendi e concordo com o manual inteiro.',
  status: 'publicada',
  hash_conteudo: 'sha',
  criado_em: '2026-08-01T12:00:00Z',
  publicado_em: '2026-08-02T12:00:00Z',
};

function secao(extra: Partial<SecaoLinha> & Pick<SecaoLinha, 'id' | 'slug'>): SecaoLinha {
  return {
    versao_id: 'v-2',
    titulo: 'Seção',
    descricao: 'A descrição da seção.',
    ordem: 0,
    ...extra,
  };
}

function regra(extra: Partial<RegraLinha> & Pick<RegraLinha, 'id' | 'secao_id'>): RegraLinha {
  return {
    codigo: 'R1',
    titulo: 'Regra',
    instrucao: 'A instrução da regra.',
    porque: 'O porquê da regra.',
    exemplo: 'O exemplo da regra.',
    severidade: 'normal',
    obrigatoria: false,
    ordem: 0,
    ...extra,
  };
}

/* Fora de ordem de propósito: a API entrega ordenado, o teste não. */
const SECOES: SecaoLinha[] = [
  secao({ id: 's-garantia', slug: 'garantia', titulo: 'A rotina que protege a garantia', ordem: 2 }),
  secao({ id: 's-voz', slug: 'voz', titulo: 'A sua voz', ordem: 1 }),
  secao({ id: 's-termos', slug: 'termos', titulo: 'Termos de uso', ordem: 3 }),
];

const REGRAS: RegraLinha[] = [
  regra({
    id: 'ga2',
    secao_id: 's-garantia',
    codigo: 'GA-2',
    titulo: 'Baixou, publicou — sem editar nada',
    obrigatoria: true,
    severidade: 'critica',
    ordem: 2,
  }),
  regra({
    id: 'ga1',
    secao_id: 's-garantia',
    codigo: 'GA-1',
    titulo: 'Um milhão em 90 dias',
    obrigatoria: true,
    severidade: 'critica',
    ordem: 1,
  }),
  regra({ id: 'vz1', secao_id: 's-voz', codigo: 'VZ-1', titulo: 'Grave num lugar silencioso' }),
  regra({ id: 'tu1', secao_id: 's-termos', codigo: 'TU-1', titulo: 'O que a DOXA entrega' }),
];

const VERSAO: Versao = montarVersao(VERSAO_LINHA, SECOES, REGRAS);

/* ─── A COSTURA ────────────────────────────────────────────────────────────── */

describe('montarVersao', () => {
  it('monta a versão vigente no shape que o fluxo do cliente lê', () => {
    expect(VERSAO.id).toBe('v-2');
    expect(VERSAO.numero).toBe(2);
    expect(VERSAO.titulo).toBe('Manual DOXA');
    expect(VERSAO.declaracao).toContain('Declaro que li');
  });

  it('ordena as seções pela ordem do banco, não pela ordem em que chegaram', () => {
    expect(VERSAO.secoes.map((umaSecao) => umaSecao.slug)).toEqual(['voz', 'garantia', 'termos']);
  });

  it('aninha cada regra na SUA seção, na ordem do capítulo', () => {
    const garantia = VERSAO.secoes.find((umaSecao) => umaSecao.slug === 'garantia');
    if (garantia == null) throw new Error('a amostra precisa ter a garantia');
    expect(garantia.regras.map((uma) => uma.id)).toEqual(['ga1', 'ga2']);
    const voz = VERSAO.secoes.find((umaSecao) => umaSecao.slug === 'voz');
    expect(voz?.regras.map((uma) => uma.id)).toEqual(['vz1']);
  });

  it('não leva para o contrato público as chaves estrangeiras do banco', () => {
    const [primeira] = VERSAO.secoes;
    expect(Object.keys(primeira)).not.toContain('versao_id');
    expect(Object.keys(primeira.regras[0])).not.toContain('secao_id');
  });

  it('versão sem seção nenhuma vira um manual vazio, não um erro', () => {
    expect(montarVersao(VERSAO_LINHA, [], []).secoes).toEqual([]);
  });
});

/* ─── OS ESTADOS DO CARREGAMENTO ───────────────────────────────────────────── */

describe('estadoDaPrevia', () => {
  const base = {
    cargaDoPainel: 'pronto',
    erroDoPainel: null,
    carregandoConteudo: false,
    erroDoConteudo: null,
    versao: VERSAO,
  } as const;

  it('espera o painel antes de dizer que não há versão publicada', () => {
    expect(
      estadoDaPrevia({ ...base, cargaDoPainel: 'carregando', versao: null }).tipo,
    ).toBe('carregando');
  });

  it('sessão vencida vem antes de tudo — quem precisa entrar não "tenta de novo"', () => {
    expect(estadoDaPrevia({ ...base, cargaDoPainel: 'sessao', versao: null }).tipo).toBe('sessao');
  });

  it('o erro do conteúdo aparece com a mensagem que veio do banco', () => {
    const estado = estadoDaPrevia({ ...base, erroDoConteudo: 'O banco recusou a operação.' });
    expect(estado).toEqual({ tipo: 'erro', mensagem: 'O banco recusou a operação.' });
  });

  it('erro do painel sem mensagem ainda diz alguma coisa útil', () => {
    const estado = estadoDaPrevia({ ...base, cargaDoPainel: 'erro', versao: null });
    if (estado.tipo !== 'erro') throw new Error('deveria ser erro');
    expect(estado.mensagem.length).toBeGreaterThan(0);
  });

  it('carga pronta e nenhuma vigente: o recado de publicar, não um manual vazio', () => {
    expect(estadoDaPrevia({ ...base, versao: null }).tipo).toBe('sem-versao');
  });

  it('com a versão na mão, a prévia abre', () => {
    expect(estadoDaPrevia(base)).toEqual({ tipo: 'pronta', versao: VERSAO });
  });
});

/* ─── AS TELAS DA PRÉVIA ───────────────────────────────────────────────────── */

const nada = () => undefined;

function desenhar(no: Parameters<typeof renderToStaticMarkup>[0]): string {
  return renderToStaticMarkup(no);
}

/** O atributo que o React escreve num botão travado — a classe não serve. */
const BOTAO_TRAVADO = 'disabled=""';

/** O gesto que a prévia não pode oferecer em passo nenhum. */
const BOTAO_DE_CONCLUIR = 'Confirmar e concluir';

function emPasso(passo: Sessao['passo']): string {
  return desenhar(
    <TelaDaPrevia
      sessao={{ ...sessaoDeExemplo(VERSAO), passo }}
      trocarSessao={nada}
      aoRecomecar={nada}
    />,
  );
}

describe('a prévia no lugar do cliente', () => {
  it('abre no manual de verdade, com o cliente de mentira à vista', () => {
    const html = desenhar(<Previa versao={VERSAO} />);
    expect(html).toContain('Manual DOXA');
    expect(html).toContain('Empresa Exemplo');
    // Dois capítulos: os termos não contam, e a promessa sai dos dados.
    expect(html).toContain('2 capítulos curtos');
  });

  it('a faixa de PRÉVIA fica na tela em todo passo', () => {
    expect(desenhar(<Previa versao={VERSAO} />)).toContain('PRÉVIA');
    expect(emPasso({ tipo: 'capitulo', indice: 0 })).toContain('PRÉVIA');
    expect(emPasso({ tipo: 'capitulo', indice: 1, etapa: 1 })).toContain('PRÉVIA');
    expect(emPasso({ tipo: 'revisao' })).toContain('PRÉVIA');
  });

  it('a identificação chega preenchida: nada a digitar para andar', () => {
    const html = emPasso({ tipo: 'identificacao' });
    expect(html).toContain('Cliente Exemplo');
    expect(html).toContain('cliente@exemplo.com');
    expect(html).not.toContain('<input');
  });

  it('o capítulo de leitura anda POR TELAS, com o conteúdo da versão vigente', () => {
    // A parede caiu também aqui: a abertura promete o caminho e não despeja o
    // capítulo. É de graça — a prévia reusa o fluxo do cliente, tela por tela.
    const abertura = emPasso({ tipo: 'capitulo', indice: 0 });
    expect(abertura).toContain('A sua voz');
    expect(abertura).toContain('Capítulo 1 de 2');
    expect(abertura).toContain('Começar →');
    expect(abertura).not.toContain('Grave num lugar silencioso');

    const cartao = emPasso({ tipo: 'capitulo', indice: 0, etapa: 1 });
    expect(cartao).toContain('Grave num lugar silencioso');
    expect(cartao).toContain('Passo 1 de 1');
  });

  it('a prévia mostra os prints reais da plataforma, um por tela', () => {
    const html = emPasso({ tipo: 'capitulo', indice: 0, etapa: 2 });
    expect(html).toContain('Na plataforma, é assim');
    expect(html.match(/src="\/manual\/prints\//g)?.length).toBe(1);
  });

  it('o capítulo de aceites virou UMA TELA POR ITEM, e a prévia anda por elas', () => {
    // A abertura do capítulo explica e não cobra nada.
    const intro = emPasso({ tipo: 'capitulo', indice: 1 });
    expect(intro).toContain('São 2 itens, um por tela.');
    expect(intro).not.toContain('type="checkbox"');

    // Cada item tem a sua tela, com a sua ÚNICA caixa e o avanço travado.
    const primeiro = emPasso({ tipo: 'capitulo', indice: 1, etapa: 1 });
    expect(primeiro).toContain('Item 1 de 2');
    expect(primeiro).toContain('Um milhão em 90 dias');
    expect(primeiro).not.toContain('Baixou, publicou — sem editar nada');
    expect(primeiro.match(/type="checkbox"/g)?.length).toBe(1);
    expect(primeiro).toContain(BOTAO_TRAVADO);

    const segundo = emPasso({ tipo: 'capitulo', indice: 1, etapa: 2 });
    expect(segundo).toContain('Item 2 de 2');
    expect(segundo).toContain('Baixou, publicou — sem editar nada');
  });

  it('o fim da prévia é um selo, e NÃO o botão que grava aceite', () => {
    const html = emPasso({ tipo: 'revisao' });
    expect(html).toContain('Fim da prévia — nenhum aceite foi gravado.');
    expect(html).toContain('Recomeçar a prévia');
    expect(html).not.toContain(BOTAO_DE_CONCLUIR);
  });

  it('a revisão da prévia ainda mostra a declaração e os termos — só não conclui', () => {
    const html = emPasso({ tipo: 'revisao' });
    expect(html).toContain('Declaro que li, entendi e concordo com o manual inteiro.');
    expect(html).toContain('Ler os termos completos');
    expect(html).not.toContain(BOTAO_DE_CONCLUIR);
  });

  it('em passo nenhum a prévia oferece concluir — nem nas etapas de item', () => {
    expect(desenhar(<Previa versao={VERSAO} />)).not.toContain(BOTAO_DE_CONCLUIR);
    expect(emPasso({ tipo: 'identificacao' })).not.toContain(BOTAO_DE_CONCLUIR);
    // As telas novas do capítulo de leitura entram na mesma prova: cartão e
    // print são passo do fluxo, e passo do fluxo não pode gravar aceite.
    expect(emPasso({ tipo: 'capitulo', indice: 0, etapa: 1 })).not.toContain(BOTAO_DE_CONCLUIR);
    expect(emPasso({ tipo: 'capitulo', indice: 0, etapa: 2 })).not.toContain(BOTAO_DE_CONCLUIR);
    expect(emPasso({ tipo: 'capitulo', indice: 1 })).not.toContain(BOTAO_DE_CONCLUIR);
    expect(emPasso({ tipo: 'capitulo', indice: 1, etapa: 1 })).not.toContain(BOTAO_DE_CONCLUIR);
    expect(emPasso({ tipo: 'capitulo', indice: 1, etapa: 2 })).not.toContain(BOTAO_DE_CONCLUIR);
  });
});

/* ─── E O CLIENTE, QUE PRECISA DO BOTÃO ────────────────────────────────────── */

describe('a revisão do cliente', () => {
  it('sem o selo da prévia, o botão de concluir continua onde sempre esteve', () => {
    const sessao: Sessao = { ...sessaoDeExemplo(VERSAO), passo: { tipo: 'revisao' } };
    const html = desenhar(
      <Revisao
        estado={aceiteDaSessao(sessao)}
        nomeParaMostrar="Cliente Exemplo"
        termos={termosDaVersao(VERSAO)}
        impedimentos={[]}
        enviando={false}
        aoConfirmarDeclaracao={nada}
        aoConcluir={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain(BOTAO_DE_CONCLUIR);
    expect(html).not.toContain('Fim da prévia');
  });
});
