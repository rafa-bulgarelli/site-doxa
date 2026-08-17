/**
 * ─── A ROTA DO CONVERSOR ─────────────────────────────────────────────────────
 *
 * `POST /api/conversor`: entra um documento, sai o MESMO documento no outro
 * formato. A ordem dos passos aqui é o desenho, não detalhe de implementação:
 *
 *   1. método       — só POST;
 *   2. sessão       — antes de LER o corpo, para que um upload de quem não está
 *                     logado nem seja bufferizado;
 *   3. tipo e teto  — 415 e 413 ANTES de tocar no provedor, porque cada arquivo
 *                     que sobe para a Adobe é dinheiro e é um documento a mais
 *                     na mão de terceiro;
 *   4. conversão    — e só então.
 *
 * A DIREÇÃO não é pergunta: PDF que entra sai `.docx`, `.docx` que entra sai
 * PDF. Perguntar "para qual formato?" seria um clique com uma resposta só.
 *
 * ─── O QUE A RESPOSTA CONTA ──────────────────────────────────────────────────
 *
 * Erro é `{ erro: <código> }` do contrato, e nada mais: resposta do provedor,
 * stack e nome de arquivo ficam no log — o nome do arquivo é o nome do cliente
 * do contrato, e ele não aparece nem em log, nem em mensagem.
 */
import {
  CAMPO_ARQUIVO,
  EXTENSAO_DOCX,
  EXTENSAO_PDF,
  MIME_DOCX,
  MIME_PDF,
  TAMANHO_MAXIMO_BYTES,
} from '../config';
import type { CodigoDeErro, Direcao, RespostaErro } from '../tipos';
import { ErroDoProvedor, converter } from './adobe';
import { ErroDaSessao, sessaoValida } from './auth';

/** O que o pedido trouxe e não serve. Mesma forma dos outros dois erros. */
class ErroDoPedido extends Error {
  constructor(
    readonly status: number,
    readonly codigo: CodigoDeErro,
    detalhe?: string,
  ) {
    super(detalhe ?? codigo);
    this.name = 'ErroDoPedido';
  }
}

/**
 * O que o navegador manda quando NÃO sabe o tipo — e acontece: em algumas
 * máquinas um `.docx` chega como `application/octet-stream`. Nesses casos quem
 * decide é a extensão; recusar seria negar um arquivo perfeitamente válido.
 */
const MIMES_GENERICOS: readonly string[] = ['', 'application/octet-stream', 'binary/octet-stream'];

/**
 * A folga do envelope `multipart` sobre o tamanho do arquivo: fronteira,
 * cabeçalhos de parte e quebras de linha. Serve para recusar pelo
 * `content-length` sem acusar de "grande" um arquivo que está no limite.
 */
const MARGEM_MULTIPART = 4 * 1024;

const MIME_DE_SAIDA: Record<Direcao, string> = {
  'pdf-para-docx': MIME_DOCX,
  'docx-para-pdf': MIME_PDF,
};

const EXTENSAO_DE_SAIDA: Record<Direcao, string> = {
  'pdf-para-docx': EXTENSAO_DOCX,
  'docx-para-pdf': EXTENSAO_PDF,
};

interface NomeDeSaida {
  /** O nome como a pessoa o reconhece, acentos inclusos. */
  completo: string;
  /** O mesmo nome reduzido ao que cabe num cabeçalho HTTP sem quebrá-lo. */
  ascii: string;
}

function corpoDeErro(status: number, erro: CodigoDeErro): Response {
  const corpo: RespostaErro = { erro };
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function responderErro(erro: unknown): Response {
  if (
    erro instanceof ErroDoPedido ||
    erro instanceof ErroDaSessao ||
    erro instanceof ErroDoProvedor
  ) {
    if (erro.status >= 500) console.error('conversor:', erro.status, erro.codigo, erro.message);
    return corpoDeErro(erro.status, erro.codigo);
  }
  // O que o código não previu não sabe o que é seguro contar. 502 e log.
  console.error('conversor: falha inesperada', erro);
  return corpoDeErro(502, 'conversao_falhou');
}

/**
 * O teto pelo `content-length`, antes de bufferizar o corpo.
 *
 * O cabeçalho é uma promessa do cliente e pode faltar ou mentir — por isso o
 * tamanho real é conferido de novo depois. Este passo existe só para não
 * carregar na memória da borda um envio que já está condenado.
 */
function exigirTamanhoDeclarado(pedido: Request): void {
  const cabecalho = pedido.headers.get('content-length');
  if (cabecalho == null) return;
  const bytes = Number(cabecalho);
  if (Number.isNaN(bytes)) return;
  if (bytes > TAMANHO_MAXIMO_BYTES + MARGEM_MULTIPART) {
    throw new ErroDoPedido(413, 'arquivo_grande', `content-length ${bytes}`);
  }
}

function exigirTamanho(bytes: number): void {
  if (bytes > TAMANHO_MAXIMO_BYTES) {
    throw new ErroDoPedido(413, 'arquivo_grande', `${bytes} bytes`);
  }
}

/**
 * O arquivo do formulário.
 *
 * Corpo que não é `multipart`, campo com outro nome ou campo de texto no lugar
 * do arquivo caem todos em 415: nada convertível chegou. O contrato não tem
 * palavra para "pedido malformado", e inventar uma quebraria o tipo que a
 * página consome.
 */
async function arquivoDoPedido(pedido: Request): Promise<File> {
  let formulario: FormData;
  try {
    formulario = await pedido.formData();
  } catch {
    throw new ErroDoPedido(415, 'tipo_nao_aceito', 'corpo que nao e multipart/form-data');
  }
  const valor = formulario.get(CAMPO_ARQUIVO);
  if (valor == null || typeof valor === 'string') {
    throw new ErroDoPedido(415, 'tipo_nao_aceito', `sem o campo ${CAMPO_ARQUIVO}`);
  }
  return valor;
}

function extensaoDe(nome: string): string {
  const ponto = nome.lastIndexOf('.');
  return ponto < 0 ? '' : nome.slice(ponto).toLowerCase();
}

/**
 * A direção sai do arquivo, e sai de DUAS pistas: a extensão e o MIME.
 *
 * O detalhe do erro carrega extensão e tipo, que descrevem o formato — nunca o
 * nome, que descreve a pessoa.
 */
function direcaoDe(arquivo: File): Direcao {
  const extensao = extensaoDe(arquivo.name);
  const tipo = arquivo.type.toLowerCase();
  const combina = (esperado: string): boolean =>
    tipo === esperado || MIMES_GENERICOS.includes(tipo);
  if (extensao === EXTENSAO_PDF && combina(MIME_PDF)) return 'pdf-para-docx';
  if (extensao === EXTENSAO_DOCX && combina(MIME_DOCX)) return 'docx-para-pdf';
  throw new ErroDoPedido(415, 'tipo_nao_aceito', `extensao "${extensao}", tipo "${tipo}"`);
}

/**
 * O nome de saída: o mesmo do original, com a extensão nova.
 *
 * O `filename` puro precisa ser ASCII — um acento cru no cabeçalho é resposta
 * inválida, e caminho de barra vindo do cliente não entra em cabeçalho nenhum.
 * Por isso vão os dois: o ASCII para quem só entende o formato antigo, e o
 * `filename*` com o nome de verdade, que é o que o navegador prefere.
 */
function nomeDeSaida(nomeOriginal: string, extensao: string): NomeDeSaida {
  const semCaminho = nomeOriginal.split(/[\\/]/).pop() ?? '';
  const base = semCaminho.replace(/\.[^.]*$/, '').trim();
  const completo = `${base.length > 0 ? base : 'documento'}${extensao}`;
  const ascii = completo.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return { completo, ascii };
}

function respostaDoDocumento(bytes: ArrayBuffer, nomeOriginal: string, direcao: Direcao): Response {
  const nome = nomeDeSaida(nomeOriginal, EXTENSAO_DE_SAIDA[direcao]);
  const utf8 = encodeURIComponent(nome.completo);
  const disposicao = `attachment; filename="${nome.ascii}"; filename*=UTF-8''${utf8}`;
  return new Response(bytes, {
    status: 200,
    headers: {
      'content-type': MIME_DE_SAIDA[direcao],
      'content-disposition': disposicao,
      'content-length': String(bytes.byteLength),
      // O documento é de uma pessoa só: nada disto encosta em cache de CDN.
      'cache-control': 'no-store',
    },
  });
}

/**
 * O método errado responde 405 SEM corpo, e de propósito: o vocabulário de erro
 * do contrato não tem palavra para isso, e inventar uma quebraria o tipo que a
 * página consome. O `Allow` diz o que fazer.
 */
function recusaDeMetodo(): Response {
  return new Response(null, {
    status: 405,
    headers: { allow: 'POST', 'cache-control': 'no-store' },
  });
}

export async function responderConversor(pedido: Request): Promise<Response> {
  if (pedido.method !== 'POST') return recusaDeMetodo();
  try {
    await sessaoValida(pedido);
    exigirTamanhoDeclarado(pedido);
    const arquivo = await arquivoDoPedido(pedido);
    const direcao = direcaoDe(arquivo);
    const bytes = await arquivo.arrayBuffer();
    exigirTamanho(bytes.byteLength);
    return respostaDoDocumento(await converter(bytes, direcao), arquivo.name, direcao);
  } catch (erro) {
    return responderErro(erro);
  }
}
