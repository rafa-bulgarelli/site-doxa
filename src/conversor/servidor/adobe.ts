/**
 * ─── A CONVERSA COM A ADOBE ──────────────────────────────────────────────────
 *
 * REST puro, sem SDK: o SDK Node da Adobe não roda no runtime de borda, e o que
 * ele faria são as seis chamadas deste arquivo.
 *
 * O ciclo é o MESMO que a prova de fidelidade rodou contra a API viva
 * (`scripts/conversor-prova.mjs`), e os nomes de campo daqui vieram de lá, não
 * de documentação:
 *
 *   token → POST /assets (URL assinada) → PUT nos bytes → operation/exportpdf
 *   (PDF→Word) ou operation/createpdf (Word→PDF) → poll do `location` até
 *   `done` → download → DELETE dos assets.
 *
 * ─── DUAS REGRAS QUE NÃO SE AFROUXAM AQUI ────────────────────────────────────
 *
 * 1. NADA de nome de arquivo, nem de conteúdo, em log. O que passa por aqui são
 *    contratos com dados pessoais; este módulo recebe BYTES e direção, e nunca
 *    o nome — é assim que ele não tem como vazar o que não deve.
 * 2. A limpeza dos assets não engole o erro da conversão: um `throw` na hora de
 *    apagar substituiria o diagnóstico real pelo da rede.
 *
 * A credencial (`ADOBE_CLIENT_ID`/`ADOBE_CLIENT_SECRET`) existe SÓ neste
 * arquivo. Ela nunca chega ao navegador, e é esse o desenho do recurso.
 */
import { MIME_DOCX, MIME_PDF } from '../config';
import type { CodigoDeErro, Direcao } from '../tipos';

const BASE = 'https://pdf-services.adobe.io';

/** De quanto em quanto tempo se pergunta "já terminou?". */
const ESPERA_MS = 2_000;

/**
 * O teto da paciência, contado do começo do job.
 *
 * A função de borda precisa COMEÇAR a responder em ~25 s. Dezoito segundos aqui
 * deixam folga para token, upload e download — passou disso, a resposta honesta
 * é 504, e não uma conexão que morre sem explicação no meio.
 */
const LIMITE_MS = 18_000;

/** O erro do provedor, já no vocabulário do contrato, com o status junto. */
export class ErroDoProvedor extends Error {
  constructor(
    readonly status: number,
    readonly codigo: CodigoDeErro,
    detalhe?: string,
  ) {
    super(detalhe ?? codigo);
    this.name = 'ErroDoProvedor';
  }
}

interface Acesso {
  token: string;
  clientId: string;
}

interface Conversao {
  uri: string;
  assetID?: string;
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function texto(dados: Record<string, unknown>, campo: string): string | null {
  const valor = dados[campo];
  return typeof valor === 'string' && valor.length > 0 ? valor : null;
}

function cabecalhos(acesso: Acesso): Record<string, string> {
  return { Authorization: `Bearer ${acesso.token}`, 'x-api-key': acesso.clientId };
}

/**
 * Uma chamada de rede que já traduz o silêncio do outro lado.
 *
 * `fetch` só lança quando NÃO houve resposta — e isso é `provedor_indisponivel`,
 * não `conversao_falhou`. A diferença importa para quem lê o erro: uma pede
 * "tente de novo", a outra pede "este documento não deu".
 */
async function chamar(url: string, init: RequestInit, passo: string): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (erro) {
    console.error('conversor/adobe: falha de rede em', passo, erro);
    throw new ErroDoProvedor(502, 'provedor_indisponivel', `${passo}: rede`);
  }
}

/**
 * O corpo do erro vai para o LOG, cortado — nunca para a resposta.
 *
 * Toda resposta ruim da Adobe é 502 aqui: ela RESPONDEU, então não é 504; e o
 * que ela disse não pode virar texto para o usuário.
 */
async function exigirOk(resposta: Response, passo: string, codigo: CodigoDeErro): Promise<void> {
  if (resposta.ok) return;
  const detalhe = await resposta.text().catch(() => '');
  console.error('conversor/adobe:', passo, resposta.status, detalhe.slice(0, 200));
  throw new ErroDoProvedor(502, codigo, `${passo}: HTTP ${resposta.status}`);
}

async function corpoJson(resposta: Response, passo: string): Promise<Record<string, unknown>> {
  const dados: unknown = await resposta.json().catch(() => null);
  if (!ehObjeto(dados)) {
    throw new ErroDoProvedor(502, 'conversao_falhou', `${passo}: resposta sem JSON`);
  }
  return dados;
}

/**
 * As credenciais do ambiente.
 *
 * Ausentes não é motivo para derrubar a função: é 502 com o log dizendo o que
 * falta, para quem for configurar a Vercel saber onde mexer.
 */
function credenciais(): { clientId: string; clientSecret: string } {
  const clientId = process.env.ADOBE_CLIENT_ID;
  const clientSecret = process.env.ADOBE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('conversor/adobe: faltam ADOBE_CLIENT_ID e/ou ADOBE_CLIENT_SECRET');
    throw new ErroDoProvedor(502, 'provedor_indisponivel', 'credenciais ausentes');
  }
  return { clientId, clientSecret };
}

/**
 * O token vale horas, e mesmo assim é pedido a cada conversão: são ~10 por dia,
 * e um cache na borda seria estado compartilhado entre execuções para economizar
 * uma chamada que ninguém sente.
 */
async function pegarToken(clientId: string, clientSecret: string): Promise<string> {
  const resposta = await chamar(
    `${BASE}/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
    },
    'token',
  );
  // Credencial recusada é problema NOSSO de configuração, não do documento:
  // quem pediu a conversão precisa ouvir "indisponível", não "não deu".
  await exigirOk(resposta, 'token', 'provedor_indisponivel');
  const token = texto(await corpoJson(resposta, 'token'), 'access_token');
  if (token == null) {
    throw new ErroDoProvedor(502, 'provedor_indisponivel', 'token: sem access_token');
  }
  return token;
}

/**
 * Sobe os bytes e devolve o `assetID`.
 *
 * São dois pedidos: o primeiro pede uma URL assinada, o segundo põe os bytes
 * nela — o documento nunca passa pelo endpoint da API da Adobe.
 */
async function subirAsset(acesso: Acesso, bytes: ArrayBuffer, mediaType: string): Promise<string> {
  const criado = await chamar(
    `${BASE}/assets`,
    {
      method: 'POST',
      headers: { ...cabecalhos(acesso), 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaType }),
    },
    'assets',
  );
  await exigirOk(criado, 'assets', 'conversao_falhou');
  const dados = await corpoJson(criado, 'assets');
  const uploadUri = texto(dados, 'uploadUri');
  const assetID = texto(dados, 'assetID');
  if (uploadUri == null || assetID == null) {
    throw new ErroDoProvedor(502, 'conversao_falhou', 'assets: resposta sem uploadUri/assetID');
  }
  const enviado = await chamar(
    uploadUri,
    { method: 'PUT', headers: { 'Content-Type': mediaType }, body: bytes },
    'upload',
  );
  await exigirOk(enviado, 'upload', 'conversao_falhou');
  return assetID;
}

/**
 * Pede a conversão e devolve o endereço do trabalho (`location`).
 *
 * São dois endpoints diferentes, e não um com parâmetro: `exportpdf` tira coisas
 * DE um PDF, `createpdf` faz um PDF DE outra coisa.
 */
async function pedirConversao(acesso: Acesso, assetID: string, direcao: Direcao): Promise<string> {
  const exportar = direcao === 'pdf-para-docx';
  const passo = exportar ? 'exportpdf' : 'createpdf';
  const corpo = exportar ? { assetID, targetFormat: 'docx' } : { assetID };
  const resposta = await chamar(
    `${BASE}/operation/${passo}`,
    {
      method: 'POST',
      headers: { ...cabecalhos(acesso), 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    },
    passo,
  );
  await exigirOk(resposta, passo, 'conversao_falhou');
  const local = resposta.headers.get('location');
  if (local == null) {
    throw new ErroDoProvedor(502, 'conversao_falhou', `${passo}: 2xx sem location`);
  }
  return local;
}

const dormir = (ms: number): Promise<void> =>
  new Promise((resolver) => {
    setTimeout(resolver, ms);
  });

/** Pergunta "já terminou?" até terminar, falhar ou estourar o teto. */
async function esperarFim(acesso: Acesso, local: string): Promise<Conversao> {
  const comeco = Date.now();
  for (;;) {
    const resposta = await chamar(local, { headers: cabecalhos(acesso) }, 'poll');
    await exigirOk(resposta, 'poll', 'conversao_falhou');
    const dados = await corpoJson(resposta, 'poll');
    const status = (texto(dados, 'status') ?? '').toLowerCase();
    if (status === 'done') return resultado(dados);
    if (status === 'failed') {
      throw new ErroDoProvedor(502, 'conversao_falhou', 'poll: o provedor recusou o documento');
    }
    if (Date.now() - comeco + ESPERA_MS >= LIMITE_MS) {
      throw new ErroDoProvedor(504, 'conversao_demorou', `poll: ${LIMITE_MS / 1000}s sem terminar`);
    }
    await dormir(ESPERA_MS);
  }
}

function resultado(dados: Record<string, unknown>): Conversao {
  const asset = dados.asset;
  if (!ehObjeto(asset)) {
    throw new ErroDoProvedor(502, 'conversao_falhou', 'poll: done sem asset');
  }
  const uri = texto(asset, 'downloadUri');
  if (uri == null) {
    throw new ErroDoProvedor(502, 'conversao_falhou', 'poll: done sem downloadUri');
  }
  // O id da SAÍDA é opcional na resposta, e o que ele decide é só se dá para
  // apagar o resultado do provedor além do original.
  const assetID = texto(asset, 'assetID');
  return assetID == null ? { uri } : { uri, assetID };
}

/** A URL de download já vem assinada — mandar o Bearer nela é o que a quebra. */
async function baixar(uri: string): Promise<ArrayBuffer> {
  const resposta = await chamar(uri, {}, 'download');
  await exigirOk(resposta, 'download', 'conversao_falhou');
  return resposta.arrayBuffer();
}

/**
 * Apaga o asset do provedor, e NUNCA lança.
 *
 * É contrato com dados pessoais: entrada e saída saem de lá assim que a
 * conversão termina, com sucesso ou sem. Falhar em apagar é linha de log — o
 * asset expira sozinho, e um erro daqui apagaria o diagnóstico de verdade.
 */
async function apagar(acesso: Acesso, assetID: string): Promise<void> {
  try {
    const resposta = await fetch(`${BASE}/assets/${assetID}`, {
      method: 'DELETE',
      headers: cabecalhos(acesso),
    });
    if (!resposta.ok) console.error('conversor/adobe: limpeza respondeu', resposta.status);
  } catch (erro) {
    console.error('conversor/adobe: limpeza falhou (rede)', erro);
  }
}

/**
 * Os bytes convertidos. Recebe bytes, devolve bytes: este módulo não sabe o
 * nome do arquivo, e é de propósito.
 */
export async function converter(bytes: ArrayBuffer, direcao: Direcao): Promise<ArrayBuffer> {
  const { clientId, clientSecret } = credenciais();
  const acesso: Acesso = { token: await pegarToken(clientId, clientSecret), clientId };
  const mediaType = direcao === 'pdf-para-docx' ? MIME_PDF : MIME_DOCX;
  const assetID = await subirAsset(acesso, bytes, mediaType);
  let saidaID: string | undefined;
  try {
    const conversao = await esperarFim(acesso, await pedirConversao(acesso, assetID, direcao));
    saidaID = conversao.assetID;
    return await baixar(conversao.uri);
  } finally {
    await apagar(acesso, assetID);
    if (saidaID != null) await apagar(acesso, saidaID);
  }
}
