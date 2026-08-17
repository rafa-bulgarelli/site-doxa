/**
 * ─── AS TELAS MONTAM? ────────────────────────────────────────────────────────
 *
 * `renderToStaticMarkup` — sem DOM, sem jsdom, sem dependência nova. Não é
 * teste de desenho (classe de Tailwind não se afirma em teste); é a prova de
 * que cada tela RENDERIZA e de que o que decide alguma coisa está nela: o
 * checkbox só onde deve existir, o botão travado, os termos na revisão, a frase
 * de cada link morto.
 *
 * A lacuna que isto fecha é real: a lógica pura pode estar perfeita e o fluxo
 * quebrar num acesso a campo indefinido dentro do JSX — e no celular do
 * cliente isso é uma tela branca, sem erro visível para ninguém.
 *
 * A amostra tem o FORMATO da v2 (capítulo de leitura · capítulo de aceites ·
 * termos) porque é o formato que o cliente recebe. O que separa um do outro é
 * o dado, nunca o slug: o slug aqui só escolhe a cena e aparta os termos.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ConviteAberto, Secao, Versao } from '../tipos';
import Fluxo from './Fluxo';
import { Abertura } from './Abertura';
import { Capitulo } from './Capitulo';
import { Conclusao } from './Conclusao';
import { Identificacao } from './Identificacao';
import { Revisao } from './Revisao';
import { DocumentoDeTermos } from './Termos';
import { JaConcluido, LinkExpirado, LinkInvalido, LinkRevogado } from './Estados';
import { capitulosEmOrdem, termosDaVersao } from './maquina';
import type { EstadoDoAceite } from './maquina';

const LEITURA: Secao = {
  id: 's-voz',
  slug: 'voz',
  titulo: 'A sua voz',
  descricao: 'A plataforma clona a sua voz a partir de uma gravação sua.',
  ordem: 1,
  regras: [
    {
      id: 'vz1',
      codigo: 'VZ-1',
      titulo: 'Grave num lugar silencioso',
      instrucao: 'Nada de eco, música ou rua no fundo.',
      porque: 'O clone aprende com tudo que estiver no áudio.',
      exemplo: 'Quarto fechado, ar-condicionado desligado.',
      severidade: 'normal',
      obrigatoria: false,
      ordem: 1,
    },
  ],
};

const GARANTIA: Secao = {
  id: 's-garantia',
  slug: 'garantia',
  titulo: 'A rotina que protege a sua garantia',
  descricao: 'São os itens que sustentam o estorno de 100%.',
  ordem: 2,
  regras: [
    {
      id: 'ga1',
      codigo: 'GA-1',
      titulo: 'Um milhão em 90 dias',
      instrucao: 'A contagem começa no primeiro vídeo publicado.',
      porque: 'É contra esse número que o resultado será aferido.',
      exemplo: 'Primeiro vídeo em março, aferição até maio.',
      severidade: 'critica',
      obrigatoria: true,
      ordem: 1,
    },
    {
      id: 'ga2',
      codigo: 'GA-2',
      titulo: 'Baixou, publicou — sem editar nada',
      instrucao: 'Publique exatamente o arquivo recebido.',
      porque: 'Cada detalhe do vídeo é decidido para desempenho.',
      exemplo: 'Não troque a música nem ponha a sua logo.',
      severidade: 'critica',
      obrigatoria: true,
      ordem: 2,
    },
    {
      id: 'ga3',
      codigo: 'GA-3',
      titulo: 'O que NÃO quebra a garantia',
      instrucao: 'Perder um dia isolado de publicação não invalida nada.',
      porque: 'A rotina tem folga de verdade.',
      exemplo: 'Viajou na quarta? Publique na quinta.',
      severidade: 'normal',
      obrigatoria: false,
      ordem: 3,
    },
  ],
};

/**
 * O clone fica FORA da versão da amostra de propósito.
 *
 * Ele existe só para provar a etapa dos exemplos de foto; dentro da `VERSAO`,
 * mudaria a contagem que a abertura promete ("2 capítulos curtos") e o teste da
 * promessa passaria a medir duas coisas ao mesmo tempo.
 */
const CLONE: Secao = {
  id: 's-clone',
  slug: 'clone',
  titulo: 'O seu clone',
  descricao: 'As fotos alimentam o clone visual.',
  ordem: 9,
  regras: [
    {
      id: 'cl1',
      codigo: 'CL-1',
      titulo: 'Foto nítida, de frente, em boa luz',
      instrucao: 'Rosto inteiro visível, luz uniforme.',
      porque: 'O clone é construído do que aparece.',
      exemplo: 'Fotografe de dia, de frente para a janela.',
      severidade: 'normal',
      obrigatoria: false,
      ordem: 1,
    },
  ],
};

/**
 * O onboarding também fica FORA da `VERSAO`, pelo mesmo motivo do clone: ele
 * existe aqui para provar os prints reais da plataforma, e dentro da versão
 * mudaria a contagem que a abertura promete.
 */
const ONBOARDING: Secao = {
  id: 's-onboarding',
  slug: 'onboarding',
  titulo: 'O onboarding',
  descricao: 'As respostas do onboarding são a matéria-prima dos seus vídeos.',
  ordem: 8,
  regras: [
    {
      id: 'ob1',
      codigo: 'OB-1',
      titulo: 'Responda concreto',
      instrucao: 'Nada de resposta genérica.',
      porque: 'É desse texto que saem os roteiros.',
      exemplo: 'Diga o número, não "muitos clientes".',
      severidade: 'normal',
      obrigatoria: false,
      ordem: 1,
    },
  ],
};

const TERMOS: Secao = {
  id: 's-termos',
  slug: 'termos',
  titulo: 'Termos de uso',
  descricao: 'O detalhe completo das condições que você está aceitando.',
  ordem: 3,
  regras: [
    {
      id: 'tu1',
      codigo: 'TU-1',
      titulo: 'O que a DOXA entrega',
      instrucao: 'A DOXA produz e entrega os vídeos prontos para publicação.',
      porque: 'A metodologia é um sistema.',
      exemplo: '',
      severidade: 'normal',
      obrigatoria: false,
      ordem: 1,
    },
    {
      id: 'tu2',
      codigo: 'TU-2',
      titulo: 'A garantia e o estorno',
      instrucao: 'Cumpridas as condições, existe estorno de 100% conforme o contrato.',
      porque: 'Meta, período e contagem precisam estar claros.',
      exemplo: '',
      severidade: 'normal',
      obrigatoria: false,
      ordem: 2,
    },
  ],
};

const VERSAO: Versao = {
  id: 'v1',
  numero: 3,
  titulo: 'Manual DOXA',
  declaracao: 'Declaro que li, entendi e concordo com o manual inteiro.',
  secoes: [LEITURA, GARANTIA, TERMOS],
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

/** Um capítulo NUMA etapa. Sem etapa é a primeira, como no passo sem etapa. */
function capitulo(indice: number, etapa = 0, marcadas: string[] = []) {
  const capitulos = capitulosEmOrdem(VERSAO);
  return desenhar(
    <Capitulo
      capitulo={capitulos[indice]}
      posicao={indice + 1}
      total={capitulos.length}
      etapa={etapa}
      marcadas={marcadas}
      aoAlternar={nada}
      aoAvancar={nada}
      aoVoltar={nada}
    />,
  );
}

describe('as telas do caminho', () => {
  it('a abertura promete o tamanho real do manual: capítulos e itens', () => {
    const html = desenhar(<Abertura versao={VERSAO} convite={CONVITE} aoComecar={nada} />);
    expect(html).toContain('Manual DOXA');
    expect(html).toContain('Empresa LTDA');
    expect(html).toContain('O que fica registrado');
    // Dois capítulos (os termos não contam) e dois itens para confirmar.
    expect(html).toContain('2 capítulos curtos');
    expect(html).toContain('2 itens');
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

  it('capítulo informativo NÃO renderiza checkbox — só explica e libera o Entendi', () => {
    const html = capitulo(0);
    expect(html).toContain('A sua voz');
    expect(html).toContain('Grave num lugar silencioso');
    expect(html).toContain('Capítulo 1 de 2');
    expect(html).toContain('Entendi →');
    // A promessa do redesenho: capítulo que explica não cobra caixa nenhuma.
    expect(html).not.toContain('<input');
    expect(html).not.toContain('type="checkbox"');
    // E, sem nada a travar, o botão nasce aberto.
    expect(html).not.toContain(BOTAO_TRAVADO);
  });

  it('o capítulo da garantia ABRE explicando, sem cobrar caixa nenhuma', () => {
    const html = capitulo(1);
    expect(html).toContain('A rotina que protege a sua garantia');
    expect(html).toContain('São 2 itens, um por tela.');
    expect(html).not.toContain('type="checkbox"');
    expect(html).not.toContain(BOTAO_TRAVADO);
    expect(html).toContain('Começar pelo item 1 →');
  });

  it('cada item da garantia é uma TELA: um item, uma caixa, e o próximo travado', () => {
    const html = capitulo(1, 1);
    // A promessa do redesenho: uma caixa na tela inteira, não a lista toda.
    expect(html.match(/type="checkbox"/g)?.length).toBe(1);
    expect(html).toContain('Item 1 de 2');
    expect(html).toContain('Um milhão em 90 dias');
    // O item 2 não está nesta tela — é o que impede descer marcando tudo.
    expect(html).not.toContain('Baixou, publicou — sem editar nada');
    expect(html).toContain('Li, entendi e concordo com este item');
    expect(html).toContain('Confirme o item acima para continuar.');
    expect(html).toContain(BOTAO_TRAVADO);
  });

  it('confirmado o item, a tela libera o próximo — e só o próximo', () => {
    const html = capitulo(1, 1, ['ga1']);
    expect(html).toContain('Próximo item →');
    expect(html).not.toContain(BOTAO_TRAVADO);
    expect(html).not.toContain('Ir para a revisão final');
  });

  it('o item crítico avisa que descumprir quebra a garantia', () => {
    expect(capitulo(1, 2)).toContain('Este item, descumprido, pode quebrar a garantia.');
    expect(capitulo(1, 2)).toContain('Item 2 de 2');
  });

  it('depois do último item vem o interlúdio — e ele não cobra nada', () => {
    const html = capitulo(1, 3, ['ga1', 'ga2']);
    expect(html).toContain('Respire');
    expect(html).toContain('Os 2 itens estão confirmados.');
    expect(html).toContain('O que NÃO quebra a garantia');
    expect(html).not.toContain('type="checkbox"');
    // Última etapa do último capítulo: daqui a saída é a revisão.
    expect(html).toContain('Ir para a revisão final');
    expect(html).not.toContain(BOTAO_TRAVADO);
  });

  it('o capítulo do clone ganha a etapa de exemplos de foto, depois dos cartões', () => {
    const html = desenhar(
      <Capitulo
        capitulo={CLONE}
        posicao={1}
        total={1}
        etapa={1}
        marcadas={[]}
        aoAlternar={nada}
        aoAvancar={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Que foto serve — e que foto não serve');
    expect(html).not.toContain('type="checkbox"');
  });

  it('os termos aparecem na revisão, atrás de "ler os termos completos"', () => {
    const html = desenhar(
      <Revisao
        estado={estadoDaRevisao()}
        nomeParaMostrar="Ana Lima"
        termos={termosDaVersao(VERSAO)}
        impedimentos={['Falta confirmar a declaração final.']}
        enviando={false}
        aoConfirmarDeclaracao={nada}
        aoConcluir={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Termos de uso');
    expect(html).toContain('O detalhe completo das condições');
    expect(html).toContain('Ler os termos completos');
  });

  it('a revisão é enxuta: dados, itens confirmados, declaração inteira e o aceite', () => {
    const html = desenhar(
      <Revisao
        estado={estadoDaRevisao()}
        nomeParaMostrar="Ana Lima"
        termos={termosDaVersao(VERSAO)}
        impedimentos={['Falta confirmar a declaração final.']}
        enviando={false}
        aoConfirmarDeclaracao={nada}
        aoConcluir={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).toContain('Ana Lima');
    expect(html).toContain('cliente@empresa.com');
    expect(html).toContain('Um milhão em 90 dias');
    expect(html).toContain('Declaro que li, entendi e concordo com o manual inteiro.');
    expect(html).toContain('Confirmo que li e concordo com a declaração acima');
    expect(html).toContain('Falta confirmar a declaração final.');
    expect(html).toContain(BOTAO_TRAVADO);
    // O termo que o dono proibiu não aparece em lugar nenhum do fluxo.
    expect(html.toLowerCase()).not.toContain('assinatura eletrônica');
  });

  it('versão sem seção de termos: a revisão não oferece um documento vazio', () => {
    const semTermos: Versao = { ...VERSAO, secoes: [LEITURA, GARANTIA] };
    const html = desenhar(
      <Revisao
        estado={{ ...estadoDaRevisao(), versao: semTermos }}
        nomeParaMostrar="Ana Lima"
        termos={termosDaVersao(semTermos)}
        impedimentos={[]}
        enviando={false}
        aoConfirmarDeclaracao={nada}
        aoConcluir={nada}
        aoVoltar={nada}
      />,
    );
    expect(html).not.toContain('Ler os termos completos');
    expect(html).toContain('Confirmo que li e concordo com a declaração acima');
  });

  it('o documento dos termos sai inteiro, numerado, em corpo de leitura', () => {
    const termos = termosDaVersao(VERSAO);
    if (termos == null) throw new Error('a amostra precisa ter os termos');
    const html = desenhar(<DocumentoDeTermos secao={termos} />);
    expect(html).toContain('1. O que a DOXA entrega');
    expect(html).toContain('2. A garantia e o estorno');
    expect(html).toContain('estorno de 100% conforme o contrato');
    // Documento é para ler, não para marcar.
    expect(html).not.toContain('type="checkbox"');
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

/* ─── OS PRINTS REAIS DA PLATAFORMA ────────────────────────────────────────── */

/** Um capítulo solto, fora da `VERSAO` — para não mexer na contagem da abertura. */
function capituloAvulso(secao: Secao, etapa = 0): string {
  return desenhar(
    <Capitulo
      capitulo={secao}
      posicao={1}
      total={1}
      etapa={etapa}
      marcadas={[]}
      aoAlternar={nada}
      aoAvancar={nada}
      aoVoltar={nada}
    />,
  );
}

/** As tags `<img>` de print que a tela produziu, inteiras, para inspecionar. */
function imagensDePrint(html: string): string[] {
  return html.match(/<img[^>]*src="\/manual\/prints\/[^>]*>/g) ?? [];
}

function altDe(tag: string): string {
  return /alt="([^"]*)"/.exec(tag)?.[1] ?? '';
}

describe('os prints reais da plataforma', () => {
  it('o capítulo do onboarding mostra os 3 prints, depois dos cartões', () => {
    const html = capituloAvulso(ONBOARDING);
    expect(html).toContain('Na plataforma, é assim');
    expect(html.match(/src="\/manual\/prints\/onboarding-/g)?.length).toBe(3);
    expect(imagensDePrint(html)).toHaveLength(3);
    // O cartão vem ANTES do print: primeiro o que fazer, depois onde fazer.
    expect(html.indexOf('Responda concreto')).toBeLessThan(html.indexOf('/manual/prints/'));
  });

  it('o capítulo da voz mostra os 2 prints', () => {
    const html = capitulo(0);
    expect(html.match(/src="\/manual\/prints\/voz-/g)?.length).toBe(2);
    expect(imagensDePrint(html)).toHaveLength(2);
    // Print não substitui o texto do capítulo — ele entra junto.
    expect(html).toContain('Grave num lugar silencioso');
  });

  it('todo print carrega alt de verdade e reserva o próprio espaço', () => {
    for (const tag of [...imagensDePrint(capituloAvulso(ONBOARDING)), ...imagensDePrint(capitulo(0))]) {
      // `alt` descritivo: a imagem carrega informação que não está escrita.
      expect(altDe(tag).length).toBeGreaterThan(40);
      expect(tag).toContain('width="1400"');
      expect(tag).toMatch(/height="\d+"/);
      expect(tag).toContain('loading="lazy"');
    }
  });

  it('capítulo sem print não abre o bloco', () => {
    for (const html of [capituloAvulso(CLONE), capitulo(1)]) {
      expect(html).not.toContain('/manual/prints/');
      expect(html).not.toContain('Na plataforma, é assim');
    }
  });
});

function estadoDaRevisao(): EstadoDoAceite {
  return {
    versao: VERSAO,
    convite: CONVITE,
    marcadas: ['ga1'],
    nomeInformado: 'Ana Lima',
    declaracaoConfirmada: false,
  };
}

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
