/**
 * ─── OS TESTES DO COMPROVANTE ────────────────────────────────────────────────
 *
 * O que quebra em silêncio aqui é a FONTE. `StandardFonts.Helvetica` só
 * codifica WinAnsi: um travessão longo colado de um documento do Word faz o
 * `drawText` lançar, o PDF não sai, e ninguém descobre até um cliente aceitar
 * um manual com esse caractere dentro.
 *
 * Por isso o teste não se contenta em ver o PDF nascer: ele ABRE o arquivo
 * gerado e procura as palavras acentuadas lá dentro.
 *
 * "Abrir" é literal. O pdf-lib comprime todo fluxo de conteúdo com Flate — o
 * primeiro rascunho deste teste procurava o texto nos bytes crus e falhava sem
 * dizer por quê. Então `textoDoPdf` descomprime cada fluxo e lê o resultado em
 * latin-1: na faixa do Latin-1, o byte do WinAnsi É o ponto de código, e o
 * acento volta inteiro.
 */
import { Buffer } from 'node:buffer';
import { inflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { sha256Hex } from './hash';
import { dataLegivel, gerarPdf, sanitizar, type DadosDoComprovante } from './pdf';

function comprovante(troca: Partial<DadosDoComprovante> = {}): DadosDoComprovante {
  return {
    aceite_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
    nome: 'Conceição Albuquerque',
    empresa: 'Açaí & Cia Comércio Ltda',
    email: 'conceicao@acaiecia.com.br',
    aceito_em: '2026-08-14T18:32:00.000Z',
    declaracao:
      'Declaro que li e compreendi cada regra deste manual, que tive a oportunidade ' +
      'de perguntar o que não estava claro e que aceito as condições da garantia.',
    conteudo_sha256: 'a'.repeat(64),
    versao_numero: 3,
    versao_titulo: 'Manual do Cliente DOXA',
    itens: [
      {
        codigo: 'OP-01',
        titulo: 'Aprovação de peça em 24 horas',
        instrucao: 'Responda a cada peça enviada dentro de 24 horas úteis.',
        porque: 'Sem aprovação a veiculação atrasa e a verba do mês não é gasta.',
        exemplo: 'Recebeu a peça na terça às 10h: responda até quarta às 10h.',
        severidade: 'critica',
      },
      {
        codigo: 'FN-02',
        titulo: 'Manutenção do orçamento',
        instrucao: 'Mantenha o saldo da conta de anúncios acima do mínimo combinado.',
        porque: 'Campanha que para por saldo perde o aprendizado do algoritmo.',
        exemplo: 'Orçamento de R$ 300 por dia: deixe ao menos R$ 2.100 na conta.',
        severidade: 'normal',
      },
    ],
    ...troca,
  };
}

/**
 * WinAnsi É a windows-1252 — dizer o nome certo ao decodificador é o que faz o
 * acento voltar. E o rótulo 'latin1' do `TextDecoder` NÃO serve para o
 * caminho de volta: pela norma da WHATWG ele é um apelido de windows-1252, e os
 * bytes 0x80–0x9F voltam como € ‚ „ … (pontos de código de quatro dígitos), o
 * que estraga qualquer `charCodeAt` sobre binário. Para andar em cima dos
 * bytes, `Buffer` com 'latin1', que é 1 para 1 de verdade.
 */
function comoTexto(bytes: Uint8Array): string {
  return new TextDecoder('windows-1252').decode(bytes);
}

/**
 * O pdf-lib não escreve `(Aprovação) Tj` — escreve `<4170726F7661E7E36F> Tj`,
 * em hexadecimal. Sem desfazer isso, procurar palavra no fluxo descomprimido
 * não acha nada e o teste passa a impressão de que o PDF está vazio.
 */
function decodificarHex(conteudo: string): string {
  return conteudo.replace(/<([0-9A-Fa-f]+)>/g, (_inteiro: string, hex: string) =>
    comoTexto(Buffer.from(hex, 'hex')),
  );
}

/** Todo fluxo Flate do arquivo, descomprimido e emendado. É o texto do PDF. */
function textoDoPdf(bytes: Uint8Array): string {
  const cru = Buffer.from(bytes);
  const bruto = cru.toString('latin1');
  const abertura = /stream\r?\n/g;
  let saida = '';
  let achado = abertura.exec(bruto);
  while (achado !== null) {
    const inicio = achado.index + achado[0].length;
    const fim = bruto.indexOf('endstream', inicio);
    if (fim > inicio) {
      try {
        saida += `${decodificarHex(comoTexto(inflateSync(cru.subarray(inicio, fim))))}\n`;
      } catch {
        // Nem todo fluxo é Flate (uma fonte embutida, por exemplo). O que não
        // descomprime não interessa a este teste.
      }
    }
    achado = abertura.exec(bruto);
  }
  return saida;
}

describe('sanitizar', () => {
  it('preserva acento português, que é o que o cliente lê', () => {
    expect(sanitizar('Aprovação, manutenção e endereço às três')).toBe(
      'Aprovação, manutenção e endereço às três',
    );
  });

  it('troca o que a Helvetica não codifica por um equivalente legível', () => {
    expect(sanitizar('um — dois – três')).toBe('um - dois - três');
    expect(sanitizar('“aspas” e ‘simples’')).toBe('"aspas" e \'simples\'');
    expect(sanitizar('espere…')).toBe('espere...');
  });

  it('some com o que não tem glifo nenhum, em vez de deixar o PDF explodir', () => {
    expect(sanitizar('tudo certo 🎉')).toBe('tudo certo ');
    expect(sanitizar('largura​zero')).toBe('largurazero');
    expect(sanitizar('espaço duro')).toBe('espaço duro');
  });
});

describe('dataLegivel', () => {
  it('mostra o horário de Brasília, e diz que é dele', () => {
    expect(dataLegivel('2026-08-14T18:32:00.000Z')).toBe(
      '14/08/2026 as 15:32 (horario de Brasilia)',
    );
  });

  it('devolve o que recebeu quando a data não é data', () => {
    expect(dataLegivel('nem-data')).toBe('nem-data');
  });
});

describe('gerarPdf', () => {
  it('nasce um PDF de verdade, com mais de uma página', async () => {
    const bytes = await gerarPdf(comprovante());
    expect(comoTexto(bytes).startsWith('%PDF-')).toBe(true);
    const aberto = await PDFDocument.load(bytes);
    expect(aberto.getPageCount()).toBeGreaterThanOrEqual(2);
  });

  it('carrega quem aceitou, o que aceitou e a declaração — com os acentos', async () => {
    const texto = textoDoPdf(await gerarPdf(comprovante()));
    expect(texto).toContain('Conceição');
    expect(texto).toContain('Albuquerque');
    expect(texto).toContain('Comércio');
    expect(texto).toContain('Manual v3');
    expect(texto).toContain('compreendi');
    expect(texto).toContain('OP-01');
    expect(texto).toContain('FN-02');
    expect(texto).toContain('Aprovação');
    expect(texto).toContain('CRITICA');
  });

  it('imprime o hash de verificação no rodapé de toda página', async () => {
    const dados = comprovante({ conteudo_sha256: 'b'.repeat(64) });
    const texto = textoDoPdf(await gerarPdf(dados));
    const ocorrencias = texto.split(`Verificacao SHA-256: ${'b'.repeat(64)}`).length - 1;
    const aberto = await PDFDocument.load(await gerarPdf(dados));
    expect(ocorrencias).toBe(aberto.getPageCount());
  });

  it('não explode com texto fora do WinAnsi — sanitiza e segue', async () => {
    const dados = comprovante({
      empresa: 'Açaí 🎉 & Cia — “premium”',
      itens: [
        {
          codigo: 'ZZ-99',
          titulo: 'Regra com emoji 🚀 e travessão —',
          instrucao: 'Instrução com ‘aspas curvas’ e espaço duro.',
          porque: '',
          exemplo: '',
          severidade: 'normal',
        },
      ],
    });
    const texto = textoDoPdf(await gerarPdf(dados));
    expect(texto).toContain('ZZ-99');
    expect(texto).toContain('Açaí');
    expect(texto).not.toContain('🚀');
  });

  it('o SHA-256 do arquivo tem 64 hex e muda quando o conteúdo muda', async () => {
    const um = await sha256Hex(await gerarPdf(comprovante()));
    const outro = await sha256Hex(await gerarPdf(comprovante({ nome: 'Outra Pessoa' })));
    expect(um).toMatch(/^[0-9a-f]{64}$/);
    expect(outro).toMatch(/^[0-9a-f]{64}$/);
    expect(um).not.toBe(outro);
  });
});
