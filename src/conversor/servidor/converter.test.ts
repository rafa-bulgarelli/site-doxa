/**
 * ─── OS TESTES DA ROTA DE CONVERSÃO ──────────────────────────────────────────
 *
 * Três coisas aqui não podem estar certas "quase sempre":
 *
 *   1. A PORTA. Sem sessão válida ninguém converte — e nada do corpo é lido
 *      antes disso, porque o upload de quem não está logado não deve nem ser
 *      bufferizado na borda.
 *   2. O FILTRO. `.png` e arquivo acima do teto morrem AQUI, antes de virar
 *      pedido pago na Adobe e antes de o documento sair da nossa mão.
 *   3. A LIMPEZA. Entrada e saída são apagadas do provedor. É contrato com dados
 *      pessoais: um `DELETE` que deixasse de acontecer não daria erro nenhum, e
 *      ninguém perceberia — só um teste percebe.
 *
 * Como nos testes do manual, `fetch` é de mentira e uma URL não simulada LANÇA:
 * chamada nova sem rota é defeito, não silêncio.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MIME_DOCX, MIME_PDF, TAMANHO_MAXIMO_BYTES } from '../config';
import { responderConversor } from './converter';

const URL_ROTA = 'https://www.doxaviral.com/api/conversor';
const UPLOAD = 'https://upload.adobe.teste/entrada';
const TRABALHO = 'https://pdf-services.adobe.io/jobs/job-de-teste';
const DOWNLOAD = 'https://download.adobe.teste/saida';
const ASSET_ENTRADA = 'asset-entrada';
const ASSET_SAIDA = 'asset-saida';
const USUARIO_ID = '33333333-3333-4333-8333-333333333333';

/** Os bytes que a Adobe "devolve" — o teste confere que chegam intactos. */
const SAIDA = new Uint8Array([80, 75, 3, 4, 42, 7]);

interface Chamada {
  metodo: string;
  url: string;
  corpo: unknown;
}

interface Resposta {
  corpo?: unknown;
  // `BlobPart`, e nao `Uint8Array`: e o tipo que `File` e `Response` aceitam sem
  // discussao sobre qual ArrayBuffer esta por baixo.
  bytes?: BlobPart;
  status?: number;
  cabecalhos?: Record<string, string>;
}

type Rota = readonly [string, RegExp, (url: string, corpo: unknown) => Resposta];

let chamadas: Chamada[] = [];

function instalarFetch(rotas: readonly Rota[]): void {
  vi.stubGlobal('fetch', async (entrada: unknown, init: RequestInit = {}) => {
    const url = String(entrada);
    const metodo = init.method ?? 'GET';
    const corpo = typeof init.body === 'string' ? JSON.parse(init.body) : null;
    chamadas.push({ metodo, url, corpo });
    for (const [metodoDaRota, padrao, responde] of rotas) {
      if (metodoDaRota !== metodo || !padrao.test(url)) continue;
      const resposta = responde(url, corpo);
      const status = resposta.status ?? 200;
      // 204 é o que a Adobe responde ao DELETE, e um 204 COM corpo não é uma
      // resposta que exista — o construtor recusa.
      const corpoDaResposta = resposta.bytes ?? JSON.stringify(resposta.corpo ?? null);
      const conteudo = status === 204 ? null : corpoDaResposta;
      return new Response(conteudo, {
        status,
        headers: { 'content-type': 'application/json', ...resposta.cabecalhos },
      });
    }
    throw new Error(`rota nao simulada: ${metodo} ${url}`);
  });
}

const SESSAO: Rota = ['GET', /auth\/v1\/user/, () => ({ corpo: { id: USUARIO_ID } })];

/** O ciclo inteiro da Adobe, do jeito que a prova de fidelidade o mediu. */
function rotasAdobe(operacao: 'exportpdf' | 'createpdf', statusDoJob = 'done'): Rota[] {
  return [
    ['POST', /pdf-services\.adobe\.io\/token/, () => ({ corpo: { access_token: 'token-adobe' } })],
    [
      'POST',
      /pdf-services\.adobe\.io\/assets$/,
      () => ({ corpo: { uploadUri: UPLOAD, assetID: ASSET_ENTRADA } }),
    ],
    ['PUT', /upload\.adobe\.teste/, () => ({ status: 200 })],
    [
      'POST',
      new RegExp(`operation/${operacao}$`),
      () => ({ status: 201, cabecalhos: { location: TRABALHO } }),
    ],
    [
      'GET',
      /pdf-services\.adobe\.io\/jobs/,
      () => ({
        corpo:
          statusDoJob === 'done'
            ? { status: 'done', asset: { downloadUri: DOWNLOAD, assetID: ASSET_SAIDA } }
            : { status: statusDoJob },
      }),
    ],
    ['GET', /download\.adobe\.teste/, () => ({ bytes: SAIDA })],
    ['DELETE', /pdf-services\.adobe\.io\/assets\//, () => ({ status: 204 })],
  ];
}

function rotasFelizes(operacao: 'exportpdf' | 'createpdf' = 'exportpdf'): Rota[] {
  return [SESSAO, ...rotasAdobe(operacao)];
}

interface Envio {
  nome?: string;
  tipo?: string;
  // `BlobPart`, e nao `Uint8Array`: e o tipo que `File` e `Response` aceitam sem
  // discussao sobre qual ArrayBuffer esta por baixo.
  bytes?: BlobPart;
  autorizacao?: string;
  campo?: string;
}

function enviar(envio: Envio = {}): Request {
  const {
    nome = 'contrato-teste.pdf',
    tipo = MIME_PDF,
    bytes = new Uint8Array([37, 80, 68, 70]),
    autorizacao = 'Bearer sessao-de-teste',
    campo = 'arquivo',
  } = envio;
  const formulario = new FormData();
  formulario.set(campo, new File([bytes], nome, { type: tipo }));
  const cabecalhos: Record<string, string> = {};
  if (autorizacao.length > 0) cabecalhos.authorization = autorizacao;
  return new Request(URL_ROTA, { method: 'POST', headers: cabecalhos, body: formulario });
}

function chamadasDe(metodo: string, pedaco: string): Chamada[] {
  return chamadas.filter((c) => c.metodo === metodo && c.url.includes(pedaco));
}

/**
 * Faz os 18 s de espera do poll passarem num piscar.
 *
 * Fake timer do vitest não serve aqui: o `formData()` do pedido é lido no meio
 * do caminho, e o parser de `multipart` não termina com o relógio inteiro
 * congelado — o teste estoura por timeout sem nunca chegar ao poll. Trocar SÓ o
 * `setTimeout` da espera e o `Date.now` que a conta usa mede exatamente o que
 * interessa: quantas rodadas o teto permite.
 */
function acelerarEspera(): void {
  let agora = Date.now();
  vi.spyOn(Date, 'now').mockImplementation(() => agora);
  vi.stubGlobal('setTimeout', (acao: () => void, ms = 0) => {
    agora += ms;
    queueMicrotask(acao);
    return 0;
  });
}

beforeEach(() => {
  chamadas = [];
  process.env.VITE_SUPABASE_URL = 'https://banco.teste';
  process.env.VITE_SUPABASE_ANON_KEY = 'chave-publica-de-teste';
  process.env.ADOBE_CLIENT_ID = 'cliente-de-teste';
  process.env.ADOBE_CLIENT_SECRET = 'segredo-de-teste';
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('responderConversor — a porta', () => {
  it('recusa o que não é POST, e diz o que aceita', async () => {
    instalarFetch([]);
    const resposta = await responderConversor(new Request(URL_ROTA));
    expect(resposta.status).toBe(405);
    expect(resposta.headers.get('allow')).toBe('POST');
    expect(chamadas).toHaveLength(0);
  });

  it('sem Authorization é 401 sem_sessao, e o corpo nem é lido', async () => {
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(enviar({ autorizacao: '' }));
    expect(resposta.status).toBe(401);
    expect(await resposta.json()).toEqual({ erro: 'sem_sessao' });
    expect(chamadas).toHaveLength(0);
  });

  it('token que o Supabase recusa é 401 sessao_invalida, e a Adobe não é tocada', async () => {
    instalarFetch([
      ['GET', /auth\/v1\/user/, () => ({ corpo: { message: 'invalid token' }, status: 401 })],
      ...rotasAdobe('exportpdf'),
    ]);
    const resposta = await responderConversor(enviar());
    expect(resposta.status).toBe(401);
    expect(await resposta.json()).toEqual({ erro: 'sessao_invalida' });
    expect(chamadasDe('POST', 'pdf-services')).toHaveLength(0);
  });
});

describe('responderConversor — o filtro', () => {
  it('.png é 415, e nada sobe para o provedor', async () => {
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(
      enviar({ nome: 'print.png', tipo: 'image/png' }),
    );
    expect(resposta.status).toBe(415);
    expect(await resposta.json()).toEqual({ erro: 'tipo_nao_aceito' });
    expect(chamadasDe('POST', 'pdf-services')).toHaveLength(0);
  });

  it('campo com outro nome é 415 — nada convertível chegou', async () => {
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(enviar({ campo: 'file' }));
    expect(resposta.status).toBe(415);
    expect(await resposta.json()).toEqual({ erro: 'tipo_nao_aceito' });
  });

  it('acima do teto é 413, e nada sobe para o provedor', async () => {
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(
      enviar({ bytes: new Uint8Array(TAMANHO_MAXIMO_BYTES + 1) }),
    );
    expect(resposta.status).toBe(413);
    expect(await resposta.json()).toEqual({ erro: 'arquivo_grande' });
    expect(chamadasDe('POST', 'pdf-services')).toHaveLength(0);
  });

  it('.docx que o navegador mandou como octet-stream passa — quem decide é a extensão', async () => {
    instalarFetch(rotasFelizes('createpdf'));
    const resposta = await responderConversor(
      enviar({ nome: 'contrato-teste.docx', tipo: 'application/octet-stream' }),
    );
    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('content-type')).toBe(MIME_PDF);
  });
});

describe('responderConversor — a conversão', () => {
  it('PDF entra, Word sai: bytes, tipo e nome do arquivo', async () => {
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(enviar());
    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('content-type')).toBe(MIME_DOCX);
    expect(resposta.headers.get('content-disposition')).toBe(
      'attachment; filename="contrato-teste.docx"; filename*=UTF-8\'\'contrato-teste.docx',
    );
    expect(new Uint8Array(await resposta.arrayBuffer())).toEqual(SAIDA);
  });

  it('nome com acento vai nas duas formas — ASCII e UTF-8', async () => {
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(enviar({ nome: 'aquisição.pdf' }));
    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('content-disposition')).toBe(
      'attachment; filename="aquisi__o.docx"; filename*=UTF-8\'\'aquisi%C3%A7%C3%A3o.docx',
    );
  });

  it('Word entra, PDF sai — e pela operação certa da Adobe', async () => {
    instalarFetch(rotasFelizes('createpdf'));
    const resposta = await responderConversor(
      enviar({ nome: 'contrato-teste.docx', tipo: MIME_DOCX }),
    );
    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('content-type')).toBe(MIME_PDF);
    expect(resposta.headers.get('content-disposition')).toContain('filename="contrato-teste.pdf"');
    expect(chamadasDe('POST', 'operation/createpdf')).toHaveLength(1);
    expect(chamadasDe('POST', 'operation/exportpdf')).toHaveLength(0);
  });

  it('apaga do provedor a entrada E a saída', async () => {
    instalarFetch(rotasFelizes());
    expect((await responderConversor(enviar())).status).toBe(200);
    expect(chamadasDe('DELETE', `/assets/${ASSET_ENTRADA}`)).toHaveLength(1);
    expect(chamadasDe('DELETE', `/assets/${ASSET_SAIDA}`)).toHaveLength(1);
  });

  it('apaga a entrada mesmo quando a conversão falha', async () => {
    instalarFetch([SESSAO, ...rotasAdobe('exportpdf', 'failed')]);
    const resposta = await responderConversor(enviar());
    expect(resposta.status).toBe(502);
    expect(await resposta.json()).toEqual({ erro: 'conversao_falhou' });
    expect(chamadasDe('DELETE', `/assets/${ASSET_ENTRADA}`)).toHaveLength(1);
  });

  it('credencial da Adobe ausente é 502 provedor_indisponivel, não queda', async () => {
    delete process.env.ADOBE_CLIENT_ID;
    instalarFetch(rotasFelizes());
    const resposta = await responderConversor(enviar());
    expect(resposta.status).toBe(502);
    expect(await resposta.json()).toEqual({ erro: 'provedor_indisponivel' });
    expect(chamadasDe('POST', 'pdf-services')).toHaveLength(0);
  });

  it('job que não termina a tempo é 504, e não uma conexão que morre', async () => {
    instalarFetch([SESSAO, ...rotasAdobe('exportpdf', 'in progress')]);
    acelerarEspera();
    const resposta = await responderConversor(enviar());
    expect(resposta.status).toBe(504);
    expect(await resposta.json()).toEqual({ erro: 'conversao_demorou' });
    expect(chamadasDe('DELETE', `/assets/${ASSET_ENTRADA}`)).toHaveLength(1);
  });
});
