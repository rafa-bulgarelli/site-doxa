/**
 * ─── OS TESTES DA CONVERSA COM O CONVERSOR ───────────────────────────────────
 *
 * `fetch` é mockado: a função em `api/conversor` é da outra track e só chega no
 * merge. O que se prova aqui é o lado do CLIENTE do contrato — o que ele recusa
 * sem gastar rede, o que ele manda quando manda, e o que faz de cada resposta.
 *
 * O teste de "não chamou o `fetch`" é o mais importante da lista, e não é zelo
 * de performance: a recusa local existe para que quem escolheu um `.png` saiba
 * disso no mesmo segundo, em vez de esperar 4 MB subirem por uma rede de celular
 * para receber a mesma resposta.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CAMINHO_DA_API, enviar, nomeConvertido } from './enviar';
import { CAMPO_ARQUIVO, MIME_DOCX, MIME_PDF, TAMANHO_MAXIMO_BYTES } from './config';
import { tokenGuardado } from '../leads/dados/supabase';

// A sessão da Central é a fonte do token, e ela mora no `localStorage` — que
// não existe fora do navegador. Mockar o módulo é o que permite testar o
// cabeçalho `Authorization` sem inventar um navegador inteiro.
vi.mock('../leads/dados/supabase', () => ({
  tokenGuardado: vi.fn(() => 'token-do-time'),
}));

interface Chamada {
  endereco: string;
  opcoes: RequestInit;
}

interface RespostaFalsa {
  corpo?: BodyInit;
  status: number;
  cabecalhos?: Record<string, string>;
  /** `true` = o `fetch` nem completa, como numa rede que caiu. */
  rejeita?: boolean;
}

/** Troca o `fetch` global e devolve a lista viva de chamadas recebidas. */
function fingirFetch(resposta: RespostaFalsa): Chamada[] {
  const chamadas: Chamada[] = [];
  vi.stubGlobal('fetch', async (endereco: string, opcoes: RequestInit) => {
    chamadas.push({ endereco, opcoes });
    if (resposta.rejeita === true) throw new TypeError('Failed to fetch');
    return new Response(resposta.corpo ?? null, {
      status: resposta.status,
      headers: resposta.cabecalhos,
    });
  });
  return chamadas;
}

function pdfDeTeste(nome = 'contrato.pdf'): File {
  return new File(['%PDF-1.7 conteúdo'], nome, { type: MIME_PDF });
}

beforeEach(() => {
  vi.mocked(tokenGuardado).mockReturnValue('token-do-time');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('o que nem chega a subir', () => {
  it('recusa .png antes do fetch, com o código do contrato', async () => {
    const chamadas = fingirFetch({ status: 200 });
    const arquivo = new File(['isto é uma imagem'], 'print.png', { type: 'image/png' });

    const resultado = await enviar(arquivo);

    expect(resultado).toEqual({ ok: false, erro: 'tipo_nao_aceito' });
    expect(chamadas).toHaveLength(0);
  });

  it('recusa extensão aceita com MIME de outra coisa — .pdf que é imagem renomeada', async () => {
    const chamadas = fingirFetch({ status: 200 });
    const arquivo = new File(['png disfarçado'], 'contrato.pdf', { type: 'image/png' });

    const resultado = await enviar(arquivo);

    expect(resultado).toEqual({ ok: false, erro: 'tipo_nao_aceito' });
    expect(chamadas).toHaveLength(0);
  });

  it('aceita .docx que o navegador não soube tipar (octet-stream)', async () => {
    const chamadas = fingirFetch({ status: 200, corpo: new Blob(['pdf']) });
    const arquivo = new File(['docx'], 'contrato.docx', { type: 'application/octet-stream' });

    const resultado = await enviar(arquivo);

    expect(resultado.ok).toBe(true);
    expect(chamadas).toHaveLength(1);
  });

  it('recusa acima do teto antes do fetch', async () => {
    const chamadas = fingirFetch({ status: 200 });
    const gordo = new File([new Uint8Array(TAMANHO_MAXIMO_BYTES + 1)], 'gordo.pdf', {
      type: MIME_PDF,
    });

    const resultado = await enviar(gordo);

    expect(resultado).toEqual({ ok: false, erro: 'arquivo_grande' });
    expect(chamadas).toHaveLength(0);
  });

  it('sem sessão guardada, não gasta upload: devolve sem_sessao', async () => {
    vi.mocked(tokenGuardado).mockReturnValue(null);
    const chamadas = fingirFetch({ status: 200 });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'sem_sessao' });
    expect(chamadas).toHaveLength(0);
  });
});

describe('o pedido que sobe', () => {
  it('é POST na rota do contrato, com o arquivo no campo combinado', async () => {
    const chamadas = fingirFetch({ status: 200, corpo: new Blob(['docx']) });
    const arquivo = pdfDeTeste();

    await enviar(arquivo);

    expect(chamadas).toHaveLength(1);
    expect(chamadas[0].endereco).toBe(CAMINHO_DA_API);
    expect(chamadas[0].opcoes.method).toBe('POST');

    const corpo = chamadas[0].opcoes.body;
    if (!(corpo instanceof FormData)) throw new Error('esperava multipart/form-data');
    const enviado = corpo.get(CAMPO_ARQUIVO);
    if (!(enviado instanceof File)) throw new Error(`esperava o arquivo em "${CAMPO_ARQUIVO}"`);
    expect(enviado.name).toBe('contrato.pdf');
  });

  it('leva o token da sessão do time no Authorization', async () => {
    const chamadas = fingirFetch({ status: 200, corpo: new Blob(['docx']) });

    await enviar(pdfDeTeste());

    const cabecalhos = new Headers(chamadas[0].opcoes.headers);
    expect(cabecalhos.get('Authorization')).toBe('Bearer token-do-time');
    // O token é a credencial inteira do time: nunca na URL, que vai para log de
    // servidor, para o Referer e para o histórico do navegador.
    expect(chamadas[0].endereco).not.toContain('token-do-time');
  });

  it('não escreve Content-Type: quem monta o boundary do multipart é o navegador', async () => {
    const chamadas = fingirFetch({ status: 200, corpo: new Blob(['docx']) });

    await enviar(pdfDeTeste());

    expect(new Headers(chamadas[0].opcoes.headers).get('Content-Type')).toBeNull();
  });
});

describe('o documento que desce', () => {
  it('devolve o blob e o nome com a extensão trocada', async () => {
    fingirFetch({ status: 200, corpo: new Blob(['docx convertido']) });

    const resultado = await enviar(pdfDeTeste('Contrato de prestação.pdf'));

    if (!resultado.ok) throw new Error(`esperava sucesso, veio ${resultado.erro}`);
    expect(await resultado.conversao.blob.text()).toBe('docx convertido');
    expect(resultado.conversao.nomeSugerido).toBe('Contrato de prestação.docx');
  });

  it('troca nos dois sentidos, e só a última extensão', () => {
    expect(nomeConvertido('contrato.docx')).toBe('contrato.pdf');
    expect(nomeConvertido('anexo.v2.final.pdf')).toBe('anexo.v2.final.docx');
  });

  it('usa o nome do Content-Disposition quando o servidor manda um', async () => {
    fingirFetch({
      status: 200,
      corpo: new Blob(['docx']),
      cabecalhos: {
        'Content-Type': MIME_DOCX,
        'Content-Disposition': 'attachment; filename="contrato-convertido.docx"',
      },
    });

    const resultado = await enviar(pdfDeTeste());

    if (!resultado.ok) throw new Error('esperava sucesso');
    expect(resultado.conversao.nomeSugerido).toBe('contrato-convertido.docx');
  });

  it('ignora nome de resposta com caminho ou extensão fora do contrato', async () => {
    fingirFetch({
      status: 200,
      corpo: new Blob(['docx']),
      cabecalhos: { 'Content-Disposition': 'attachment; filename="../../malicioso.exe"' },
    });

    const resultado = await enviar(pdfDeTeste());

    if (!resultado.ok) throw new Error('esperava sucesso');
    expect(resultado.conversao.nomeSugerido).toBe('contrato.docx');
  });
});

describe('quando o servidor diz não', () => {
  it('401 vira sem_sessao — a página volta ao portão', async () => {
    fingirFetch({ status: 401 });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'sem_sessao' });
  });

  it('preserva o código do corpo quando ele é do contrato', async () => {
    fingirFetch({
      status: 502,
      corpo: '{"erro":"provedor_indisponivel"}',
      cabecalhos: { 'Content-Type': 'application/json' },
    });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'provedor_indisponivel' });
  });

  it('corpo ilegível não apaga o status: 504 continua sendo tempo esgotado', async () => {
    fingirFetch({ status: 504, corpo: '<html>gateway timeout</html>' });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'conversao_demorou' });
  });

  it('status sem código conhecido cai em conversao_falhou, nunca em exceção', async () => {
    fingirFetch({ status: 500 });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'conversao_falhou' });
  });

  it('código inventado no corpo é descartado em favor do status', async () => {
    fingirFetch({
      status: 415,
      corpo: '{"erro":"coisa_que_nao_existe"}',
      cabecalhos: { 'Content-Type': 'application/json' },
    });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'tipo_nao_aceito' });
  });

  it('rede fora vira provedor_indisponivel em vez de derrubar a página', async () => {
    fingirFetch({ status: 0, rejeita: true });

    const resultado = await enviar(pdfDeTeste());

    expect(resultado).toEqual({ ok: false, erro: 'provedor_indisponivel' });
  });
});
