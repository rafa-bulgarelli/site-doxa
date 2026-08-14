/**
 * ─── OS TESTES DO TRANSPORTE ─────────────────────────────────────────────────
 *
 * O `fetch` é mockado: o que se prova aqui é o que SAI do navegador — o método,
 * o endereço, o cabeçalho com o token da sessão e o corpo do pedido — e como a
 * resposta do outro lado vira estado na tela.
 *
 * O caso que justifica o arquivo inteiro: um 401 tem de virar `Error('sessao')`
 * e nada mais, porque é ele que faz o painel pedir a senha de novo em vez de
 * oferecer "tentar de novo" para quem só precisa entrar.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ROTA_API_ADMIN,
  chamarAdmin,
  erroDaApi,
  escrever,
  exigirResposta,
  ler,
  listaDeIds,
  mensagemDoErro,
  urlDaConsulta,
} from './dados';
import type { PedidoConviteCriar } from '../tipos';

const TOKEN = 'token-da-sessao';

interface ChamadaVista {
  url: string;
  init: RequestInit | undefined;
}

/** Um `fetch` de mentira que anota o que foi pedido e devolve o que se mandar. */
function fingirFetch(resposta: Response): ChamadaVista[] {
  const vistas: ChamadaVista[] = [];
  vi.stubGlobal('fetch', (url: string, init?: RequestInit) => {
    vistas.push({ url: String(url), init });
    return Promise.resolve(resposta.clone());
  });
  return vistas;
}

/** Os cabeçalhos do pedido. `Headers` normaliza o nome — nada de `as`. */
function cabecalhosDe(chamada: ChamadaVista): Headers {
  return new Headers(chamada.init?.headers);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('o endereço da consulta', () => {
  it('monta a URL do PostgREST com a base do ambiente', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://banco.exemplo');
    expect(urlDaConsulta('manual_convites', 'select=*')).toBe(
      'https://banco.exemplo/rest/v1/manual_convites?select=*',
    );
  });

  it('cita os ids do `in.(…)` — sem aspas o PostgREST recusa uuid', () => {
    expect(listaDeIds(['a', 'b'])).toBe('"a","b"');
  });
});

describe('a leitura', () => {
  it('leva o token da sessão e devolve as linhas', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://banco.exemplo');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'chave-publica');
    const vistas = fingirFetch(new Response(JSON.stringify([{ id: 'c1' }]), { status: 200 }));

    const linhas = await ler<{ id: string }>('manual_convites', 'select=*', TOKEN);

    expect(linhas).toEqual([{ id: 'c1' }]);
    expect(vistas[0].url).toBe('https://banco.exemplo/rest/v1/manual_convites?select=*');
    expect(cabecalhosDe(vistas[0]).get('Authorization')).toBe(`Bearer ${TOKEN}`);
    expect(cabecalhosDe(vistas[0]).get('apikey')).toBe('chave-publica');
  });

  it('transforma 401 em `sessao`, e só isso', async () => {
    fingirFetch(new Response('', { status: 401 }));
    await expect(ler('manual_convites', 'select=*', TOKEN)).rejects.toThrow('sessao');
  });

  it('explica o trigger em português quando o banco recusa a edição', async () => {
    fingirFetch(
      new Response(
        JSON.stringify({ message: 'a versao desta manual_regras esta publicada — so rascunho se edita' }),
        { status: 400 },
      ),
    );
    await expect(escrever('PATCH', 'manual_regras', 'id=eq.1', TOKEN, { ordem: 1 })).rejects.toThrow(
      /não é mais rascunho/i,
    );
  });

  it('não inventa erro quando a rede cai — a frase é a da rede', async () => {
    vi.stubGlobal('fetch', () => Promise.reject(new Error('fetch failed')));
    await expect(ler('manual_convites', 'select=*', TOKEN)).rejects.toThrow(/servidor/i);
  });
});

describe('a escrita direta', () => {
  it('manda PATCH com `return=minimal` e o corpo em JSON', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://banco.exemplo');
    const vistas = fingirFetch(new Response(null, { status: 204 }));

    await escrever('PATCH', 'manual_secoes', 'id=eq.s1', TOKEN, { ordem: 2 });

    expect(vistas[0].init?.method).toBe('PATCH');
    expect(vistas[0].url).toBe('https://banco.exemplo/rest/v1/manual_secoes?id=eq.s1');
    expect(cabecalhosDe(vistas[0]).get('Prefer')).toBe('return=minimal');
    expect(vistas[0].init?.body).toBe('{"ordem":2}');
  });

  it('DELETE vai sem corpo nenhum', async () => {
    const vistas = fingirFetch(new Response(null, { status: 204 }));
    await escrever('DELETE', 'manual_regras', 'id=eq.r1', TOKEN);
    expect(vistas[0].init?.method).toBe('DELETE');
    expect(vistas[0].init?.body).toBeUndefined();
  });
});

describe('a API da equipe', () => {
  const pedido: PedidoConviteCriar = {
    acao: 'convite_criar',
    email: 'cliente@empresa.com',
    empresa: 'Empresa',
  };

  it('posta o pedido na rota da equipe, com o token no cabeçalho', async () => {
    const vistas = fingirFetch(
      new Response(JSON.stringify({ convite_id: 'c1', link: 'https://site/manual-doxa/convite/t' }), {
        status: 200,
      }),
    );

    const criado = await chamarAdmin<{ convite_id: string; link: string }>(pedido, TOKEN);

    expect(vistas[0].url).toBe(ROTA_API_ADMIN);
    expect(vistas[0].init?.method).toBe('POST');
    expect(cabecalhosDe(vistas[0]).get('Authorization')).toBe(`Bearer ${TOKEN}`);
    expect(vistas[0].init?.body).toBe(JSON.stringify(pedido));
    expect(criado?.link).toBe('https://site/manual-doxa/convite/t');
  });

  it('mostra a frase da API quando ela recusa', async () => {
    fingirFetch(new Response(JSON.stringify({ erro: 'Sem versão publicada.' }), { status: 409 }));
    await expect(chamarAdmin(pedido, TOKEN)).rejects.toThrow('Sem versão publicada.');
  });

  it('trata 403 como sessão vencida, como o PostgREST', async () => {
    fingirFetch(new Response('', { status: 403 }));
    await expect(chamarAdmin(pedido, TOKEN)).rejects.toThrow('sessao');
  });

  it('aceita sucesso sem corpo — 204 não é `JSON.parse` de string vazia', async () => {
    fingirFetch(new Response(null, { status: 204 }));
    await expect(chamarAdmin(pedido, TOKEN)).resolves.toBeNull();
  });

  it('cobra o corpo de quem precisa dele, com o nome do que faltou', () => {
    expect(() => exigirResposta(null, 'o link do convite')).toThrow(/o link do convite/);
    expect(exigirResposta({ link: 'x' }, 'o link do convite')).toEqual({ link: 'x' });
  });
});

describe('as mensagens', () => {
  it('lê o `{ erro }` da API e ignora o que não for JSON', () => {
    expect(erroDaApi('{"erro":"Convite já concluído."}')).toBe('Convite já concluído.');
    expect(erroDaApi('<html>502</html>')).toBeNull();
    expect(erroDaApi('{"outra":1}')).toBeNull();
  });

  it('traduz as recusas conhecidas do banco', () => {
    expect(mensagemDoErro(400, 'duplicate key value violates unique constraint')).toMatch(/já existe/i);
    expect(mensagemDoErro(404, '')).toMatch(/não encontramos/i);
    expect(mensagemDoErro(500, 'boom')).toMatch(/recusou/i);
  });
});
