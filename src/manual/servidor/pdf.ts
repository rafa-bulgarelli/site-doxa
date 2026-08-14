/**
 * ─── O COMPROVANTE ───────────────────────────────────────────────────────────
 *
 * O documento que o cliente leva depois de aceitar — e que a equipe abre meses
 * depois, quando a conversa é "isso estava no manual?".
 *
 * ─── DE ONDE SAI O TEXTO, E POR QUÊ ISSO É O PONTO INTEIRO ───────────────────
 *
 * Das linhas de `manual_aceite_itens`, congeladas pela transação do aceite, e
 * NUNCA das tabelas vivas de seção e regra. Um PDF regerado seis meses depois
 * tem de sair IDÊNTICO ao da hora do aceite, mesmo que a regra tenha sido
 * reescrita — ler `manual_regras` aqui transformaria a prova num espelho do
 * presente, que é exatamente o que ela não pode ser.
 *
 * É por isso que o comprovante não tem seções: o snapshot não guarda a que
 * seção cada regra pertencia. O que ele guarda é o CÓDIGO, e é ele que carrega
 * o agrupamento.
 *
 * ─── A ARMADILHA DA FONTE ────────────────────────────────────────────────────
 *
 * `StandardFonts.Helvetica` do pdf-lib só codifica WinAnsi. Acento português
 * passa (á, ç, ã, õ vivem em Latin-1), mas travessão longo, aspas curvas e
 * qualquer coisa fora dessa faixa fazem o `drawText` LANÇAR — o PDF não sai, e
 * o erro aparece só quando um texto com o caractere errado é aceito. Por isso
 * todo texto passa por `sanitizar` antes de encostar na página, e por isso o
 * teste abre o PDF gerado e procura palavras acentuadas lá dentro.
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { PDFFont, PDFPage } from 'pdf-lib';
import type { Severidade } from '../tipos';

/** A4 em pontos, e a margem que sobrou depois de imprimir e olhar. */
const LARGURA = 595.28;
const ALTURA = 841.89;
const MARGEM = 56;
const RODAPE = 42;
const UTIL = LARGURA - MARGEM * 2;

const TINTA = rgb(0.08, 0.08, 0.1);
const APAGADO = rgb(0.42, 0.42, 0.46);
const CRITICA = rgb(0.62, 0.11, 0.11);

export interface ItemDoComprovante {
  codigo: string;
  titulo: string;
  instrucao: string;
  porque: string;
  exemplo: string;
  severidade: Severidade;
}

export interface DadosDoComprovante {
  aceite_id: string;
  nome: string;
  empresa: string;
  email: string;
  aceito_em: string;
  declaracao: string;
  conteudo_sha256: string;
  versao_numero: number;
  versao_titulo: string;
  itens: ItemDoComprovante[];
}

/**
 * As trocas que salvam o glifo antes de a faixa cortar o resto.
 *
 * Espaco exotico e caractere de largura zero vao por PONTO DE CODIGO, e nao
 * como caractere no fonte: os dois sao invisiveis num editor, e uma regra que
 * ninguem enxerga e uma regra que alguem apaga sem querer. Os visiveis (aspas
 * curvas, travessao, reticencia) ficam literais, que se leem melhor assim.
 */
const ESPACO_EXOTICO = new RegExp('[\\u00A0\\u2000-\\u200A\\u202F\\u205F\\u3000]', 'g');
const LARGURA_ZERO = new RegExp('[\\u200B-\\u200D\\uFEFF]', 'g');

const TROCAS: ReadonlyArray<readonly [RegExp, string]> = [
  [/[‘’‚‛]/g, "'"],
  [/[“”„‟]/g, '"'],
  [/[‐‑‒–—―]/g, '-'],
  [/…/g, '...'],
  [/[•●·]/g, '-'],
  [ESPACO_EXOTICO, ' '],
  [LARGURA_ZERO, ''],
  [/€/g, 'EUR'],
  [/™/g, '(TM)'],
  [/\t/g, '  '],
];

/** ASCII imprimivel + Latin-1 acentuado. O que sobrar nao existe na Helvetica. */
const FORA_DA_FONTE = new RegExp('[^\\x20-\\x7E\\u00A1-\\u00FF\\n]', 'g');

export function sanitizar(texto: string): string {
  let saida = texto.replace(/\r\n?/g, '\n');
  for (const [de, para] of TROCAS) saida = saida.replace(de, para);
  return saida.replace(FORA_DA_FONTE, '');
}

/**
 * Brasil não tem horário de verão desde 2019, então o deslocamento é fixo. Um
 * `toLocaleString` com fuso dependeria do ICU do runtime de borda, que é
 * exatamente o tipo de coisa que funciona no teste e falha no ar.
 */
const BRASILIA_MINUTOS = -180;

export function dataLegivel(iso: string): string {
  const quando = new Date(iso);
  if (Number.isNaN(quando.getTime())) return iso;
  const local = new Date(quando.getTime() + BRASILIA_MINUTOS * 60_000);
  const dd = (n: number) => String(n).padStart(2, '0');
  const dia = `${dd(local.getUTCDate())}/${dd(local.getUTCMonth() + 1)}/${local.getUTCFullYear()}`;
  const hora = `${dd(local.getUTCHours())}:${dd(local.getUTCMinutes())}`;
  return `${dia} as ${hora} (horario de Brasilia)`;
}

interface Lapis {
  documento: PDFDocument;
  pagina: PDFPage;
  y: number;
  normal: PDFFont;
  negrito: PDFFont;
}

interface Traco {
  tamanho?: number;
  negrito?: boolean;
  cor?: ReturnType<typeof rgb>;
  recuo?: number;
  espacoDepois?: number;
}

function quebrar(texto: string, fonte: PDFFont, tamanho: number, largura: number): string[] {
  const linhas: string[] = [];
  for (const paragrafo of texto.split('\n')) {
    let atual = '';
    for (const palavra of paragrafo.split(/\s+/).filter((p) => p.length > 0)) {
      const tentativa = atual.length === 0 ? palavra : `${atual} ${palavra}`;
      if (fonte.widthOfTextAtSize(tentativa, tamanho) <= largura) {
        atual = tentativa;
        continue;
      }
      if (atual.length > 0) linhas.push(atual);
      atual = palavra;
      // Uma palavra sozinha maior que a linha (um hash, uma URL) é partida no
      // meio — melhor um corte visível do que texto saindo pela margem.
      while (fonte.widthOfTextAtSize(atual, tamanho) > largura && atual.length > 1) {
        let corte = atual.length - 1;
        while (corte > 1 && fonte.widthOfTextAtSize(atual.slice(0, corte), tamanho) > largura) {
          corte -= 1;
        }
        linhas.push(atual.slice(0, corte));
        atual = atual.slice(corte);
      }
    }
    linhas.push(atual);
  }
  return linhas;
}

function novaPagina(lapis: Lapis): void {
  lapis.pagina = lapis.documento.addPage([LARGURA, ALTURA]);
  lapis.y = ALTURA - MARGEM;
}

function escrever(lapis: Lapis, texto: string, traco: Traco = {}): void {
  const tamanho = traco.tamanho ?? 10.5;
  const fonte = traco.negrito === true ? lapis.negrito : lapis.normal;
  const recuo = traco.recuo ?? 0;
  const altura = tamanho * 1.42;
  for (const linha of quebrar(sanitizar(texto), fonte, tamanho, UTIL - recuo)) {
    if (lapis.y - altura < MARGEM + RODAPE) novaPagina(lapis);
    lapis.y -= altura;
    lapis.pagina.drawText(linha, {
      x: MARGEM + recuo,
      y: lapis.y,
      size: tamanho,
      font: fonte,
      color: traco.cor ?? TINTA,
    });
  }
  lapis.y -= traco.espacoDepois ?? 0;
}

function capa(lapis: Lapis, dados: DadosDoComprovante): void {
  lapis.y -= 40;
  escrever(lapis, 'DOXA', { tamanho: 30, negrito: true, espacoDepois: 4 });
  escrever(lapis, 'COMPROVANTE DE ACEITE DO MANUAL DO CLIENTE', {
    tamanho: 12,
    negrito: true,
    cor: APAGADO,
    espacoDepois: 26,
  });
  escrever(lapis, `Manual v${dados.versao_numero} — ${dados.versao_titulo}`, {
    tamanho: 15,
    negrito: true,
    espacoDepois: 20,
  });

  const ficha: ReadonlyArray<readonly [string, string]> = [
    ['Cliente', dados.nome],
    ['Empresa', dados.empresa],
    ['E-mail', dados.email],
    ['Aceito em', dataLegivel(dados.aceito_em)],
    ['Regras aceitas', String(dados.itens.length)],
    ['Identificador do aceite', dados.aceite_id],
    ['Hash do conteudo (SHA-256)', dados.conteudo_sha256],
  ];
  for (const [rotulo, valor] of ficha) {
    escrever(lapis, rotulo, { tamanho: 8.5, negrito: true, cor: APAGADO });
    escrever(lapis, valor, { tamanho: 11, espacoDepois: 9 });
  }
}

function declaracao(lapis: Lapis, dados: DadosDoComprovante): void {
  lapis.y -= 14;
  escrever(lapis, 'DECLARACAO', { tamanho: 11, negrito: true, cor: APAGADO, espacoDepois: 6 });
  escrever(lapis, dados.declaracao, { tamanho: 10.5, espacoDepois: 10 });
  escrever(
    lapis,
    `Confirmada por ${dados.nome} em ${dataLegivel(dados.aceito_em)}.`,
    { tamanho: 10, cor: APAGADO, espacoDepois: 6 },
  );
}

function regras(lapis: Lapis, itens: ItemDoComprovante[]): void {
  novaPagina(lapis);
  escrever(lapis, 'AS REGRAS ACEITAS, UMA A UMA', {
    tamanho: 11,
    negrito: true,
    cor: APAGADO,
    espacoDepois: 12,
  });
  for (const item of itens) {
    const critica = item.severidade === 'critica';
    escrever(lapis, `${item.codigo} — ${item.titulo}`, {
      tamanho: 11.5,
      negrito: true,
      cor: critica ? CRITICA : TINTA,
      espacoDepois: 2,
    });
    if (critica) {
      escrever(lapis, 'REGRA CRITICA — descumprir pode invalidar a garantia.', {
        tamanho: 8.5,
        negrito: true,
        cor: CRITICA,
        espacoDepois: 2,
      });
    }
    escrever(lapis, item.instrucao, { tamanho: 10.5, recuo: 10, espacoDepois: 3 });
    if (item.porque.length > 0) {
      escrever(lapis, `Por que: ${item.porque}`, {
        tamanho: 9.5,
        recuo: 10,
        cor: APAGADO,
        espacoDepois: 3,
      });
    }
    if (item.exemplo.length > 0) {
      escrever(lapis, `Exemplo: ${item.exemplo}`, {
        tamanho: 9.5,
        recuo: 10,
        cor: APAGADO,
        espacoDepois: 3,
      });
    }
    lapis.y -= 10;
  }
}

/** O rodapé só existe depois de todas as páginas: "de M" precisa saber quem é M. */
function rodapes(documento: PDFDocument, fonte: PDFFont, hash: string): void {
  const paginas = documento.getPages();
  const verificacao = sanitizar(`Verificacao SHA-256: ${hash}`);
  paginas.forEach((pagina, indice) => {
    pagina.drawText(verificacao, {
      x: MARGEM,
      y: MARGEM - 14,
      size: 7,
      font: fonte,
      color: APAGADO,
    });
    const numero = `Pagina ${indice + 1} de ${paginas.length}`;
    pagina.drawText(numero, {
      x: LARGURA - MARGEM - fonte.widthOfTextAtSize(numero, 7),
      y: MARGEM - 26,
      size: 7,
      font: fonte,
      color: APAGADO,
    });
  });
}

export async function gerarPdf(dados: DadosDoComprovante): Promise<Uint8Array<ArrayBuffer>> {
  const documento = await PDFDocument.create();
  documento.setTitle(sanitizar(`Comprovante de aceite — ${dados.empresa}`));
  documento.setAuthor('DOXA');
  documento.setSubject(sanitizar(`Manual do Cliente v${dados.versao_numero}`));

  const normal = await documento.embedFont(StandardFonts.Helvetica);
  const negrito = await documento.embedFont(StandardFonts.HelveticaBold);
  const lapis: Lapis = {
    documento,
    pagina: documento.addPage([LARGURA, ALTURA]),
    y: ALTURA - MARGEM,
    normal,
    negrito,
  };

  capa(lapis, dados);
  declaracao(lapis, dados);
  if (dados.itens.length > 0) regras(lapis, dados.itens);
  rodapes(documento, normal, dados.conteudo_sha256);

  // A cópia não é paranoia de tipo: o pdf-lib devolve `Uint8Array` sobre
  // `ArrayBufferLike`, que no tipo admite `SharedArrayBuffer` — e `fetch` e
  // `crypto.subtle` recusam os dois. Um comprovante tem dezenas de KB; copiar
  // uma vez aqui é mais barato do que uma asserção de tipo em cada uso.
  const salvo = await documento.save();
  const bytes = new Uint8Array(salvo.byteLength);
  bytes.set(salvo);
  return bytes;
}
