/**
 * ─── OS TESTES DO LADO DA EQUIPE ─────────────────────────────────────────────
 *
 * Duas coisas aqui não podem estar certas "quase sempre":
 *
 *   1. O PAPEL. Um 'cx' que consiga publicar versão troca o manual de todo
 *      convite novo — e ninguém percebe até um cliente aceitar o texto errado.
 *   2. O TOKEN. Ele aparece uma vez, no link da resposta, e o que vai para o
 *      banco é só o hash. Um teste que confira só o formato do link deixaria
 *      passar a versão que grava o token cru numa coluna.
 *
 * Como no lado do cliente, `fetch` é de mentira e uma URL não simulada LANÇA.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sha256Hex } from './hash';
import { responderAdmin } from './admin';
import type { RespostaConviteCriado, RespostaVersao } from '../tipos';

const PERFIL_ID = '99999999-9999-4999-8999-999999999999';
const CONVITE_ID = '11111111-1111-4111-8111-111111111111';
const VERSAO_ID = '22222222-2222-4222-8222-222222222222';
const ACEITE_ID = '55555555-5555-4555-8555-555555555555';
const NOVO_CONVITE_ID = '77777777-7777-4777-8777-777777777777';

interface Chamada {
  metodo: string;
  url: string;
  corpo: unknown;
}

interface Resposta {
  corpo?: unknown;
  status?: number;
}

type Rota = readonly [RegExp, (url: string, corpo: unknown) => Resposta];

let chamadas: Chamada[] = [];

function instalarFetch(rotas: readonly Rota[]): void {
  vi.stubGlobal('fetch', async (entrada: unknown, init: RequestInit = {}) => {
    const url = String(entrada);
    const corpo = typeof init.body === 'string' ? JSON.parse(init.body) : null;
    chamadas.push({ metodo: init.method ?? 'GET', url, corpo });
    for (const [padrao, responde] of rotas) {
      if (padrao.test(url)) {
        const resposta = responde(url, corpo);
        return new Response(JSON.stringify(resposta.corpo ?? null), {
          status: resposta.status ?? 200,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    throw new Error(`rota nao simulada: ${init.method ?? 'GET'} ${url}`);
  });
}

const VERSAO = {
  id: VERSAO_ID,
  numero: 3,
  titulo: 'Manual do Cliente DOXA',
  declaracao: 'Declaro que li e compreendi cada regra deste manual.',
  status: 'publicada',
  hash_conteudo: 'c'.repeat(64),
  criado_em: '2026-07-01T12:00:00.000Z',
  publicado_em: '2026-07-02T12:00:00.000Z',
};

const CONVITE = {
  id: CONVITE_ID,
  email: 'cliente@empresa.com.br',
  empresa: 'Empresa do Cliente',
  nome_cliente: 'Fulano de Tal',
  versao_id: VERSAO_ID,
  status: 'pendente',
  expira_em: null,
  criado_em: '2026-08-01T12:00:00.000Z',
  aberto_em: null,
  concluido_em: null,
  revogado_em: null,
  regenerado_de: null,
};

function rotasPadrao(papel: 'admin' | 'cx' = 'admin', trocaConvite: Record<string, unknown> = {}): Rota[] {
  const convite = { ...CONVITE, ...trocaConvite };
  return [
    [/auth\/v1\/user/, () => ({ corpo: { id: PERFIL_ID, email: 'equipe@doxaviral.com' } })],
    [/manual_perfis/, () => ({ corpo: [{ id: PERFIL_ID, nome: 'Equipe DOXA', papel }] })],
    [/manual_versoes\?status=eq\.publicada/, () => ({ corpo: [VERSAO] })],
    [/manual_convites\?id=/, (_url, corpo) =>
      corpo == null ? { corpo: [convite] } : { corpo: [{ ...convite, ...corpo }] },
    ],
    [/manual_convites/, (_url, corpo) => ({
      corpo: [{ ...CONVITE, ...(corpo as Record<string, unknown>), id: NOVO_CONVITE_ID }],
    })],
    [/manual_aceites/, () => ({
      corpo: [
        {
          id: ACEITE_ID,
          convite_id: CONVITE_ID,
          versao_id: VERSAO_ID,
          nome: 'Fulano de Tal',
          empresa: 'Empresa do Cliente',
          email: 'cliente@empresa.com.br',
          declaracao: VERSAO.declaracao,
          aceito_em: '2026-08-14T18:32:00.000Z',
          ip: null,
          user_agent: null,
          conteudo_sha256: 'd'.repeat(64),
          pdf_caminho: 'aceites/pronto.pdf',
          pdf_sha256: 'e'.repeat(64),
          criado_em: '2026-08-14T18:32:00.000Z',
        },
      ],
    })],
    [/manual_eventos/, () => ({ corpo: null, status: 201 })],
    [/rpc\/manual_publicar_versao/, () => ({ corpo: { ...VERSAO, numero: 4 } })],
    [/rpc\/manual_criar_rascunho/, () => ({
      corpo: { ...VERSAO, id: NOVO_CONVITE_ID, numero: 5, status: 'rascunho' },
    })],
    [/storage\/v1\/object\/sign\//, () => ({
      corpo: { signedURL: '/object/sign/manual-pdfs/aceites/pronto.pdf?token=assinado' },
    })],
  ];
}

function postar(corpo: unknown, autorizacao = 'Bearer sessao-valida-de-teste'): Request {
  const cabecalhos: Record<string, string> = { 'content-type': 'application/json' };
  if (autorizacao.length > 0) cabecalhos.authorization = autorizacao;
  return new Request('https://www.doxaviral.com/api/manual/admin', {
    method: 'POST',
    headers: cabecalhos,
    body: JSON.stringify(corpo),
  });
}

beforeEach(() => {
  chamadas = [];
  process.env.VITE_SUPABASE_URL = 'https://banco.teste';
  process.env.SUPABASE_SERVICE_ROLE = 'chave-de-servico-de-teste';
  process.env.VITE_SUPABASE_ANON_KEY = 'chave-publica-de-teste';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('responderAdmin — a porta', () => {
  it('recusa o que não é POST', async () => {
    instalarFetch([]);
    const resposta = await responderAdmin(
      new Request('https://www.doxaviral.com/api/manual/admin'),
    );
    expect(resposta.status).toBe(405);
    expect(chamadas).toHaveLength(0);
  });

  it('sem Authorization não chega a olhar o corpo', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(postar({ acao: 'convite_criar' }, ''));
    expect(resposta.status).toBe(401);
    expect(await resposta.json()).toEqual({ erro: 'sem_sessao' });
    expect(chamadas).toHaveLength(0);
  });

  it('sessão que o Supabase recusa é 401, e o banco não é consultado', async () => {
    instalarFetch([
      [/auth\/v1\/user/, () => ({ corpo: { message: 'invalid token' }, status: 401 })],
      ...rotasPadrao(),
    ]);
    const resposta = await responderAdmin(postar({ acao: 'convite_criar' }));
    expect(resposta.status).toBe(401);
    expect(chamadas.filter((c) => c.url.includes('manual_perfis'))).toHaveLength(0);
  });

  it('sessão válida SEM perfil na casa é 403 — autenticado não é autorizado', async () => {
    instalarFetch([[/manual_perfis/, () => ({ corpo: [] })], ...rotasPadrao()]);
    const resposta = await responderAdmin(postar({ acao: 'convite_criar' }));
    expect(resposta.status).toBe(403);
    expect(await resposta.json()).toEqual({ erro: 'sem_perfil' });
  });

  it('recusa ação que não existe', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(postar({ acao: 'apagar_tudo' }));
    expect(resposta.status).toBe(400);
    expect(await resposta.json()).toEqual({ erro: 'acao_invalida' });
  });
});

describe('responderAdmin — o papel', () => {
  it("'cx' cuida de convite", async () => {
    instalarFetch(rotasPadrao('cx'));
    const resposta = await responderAdmin(
      postar({ acao: 'convite_criar', email: 'novo@cliente.com', empresa: 'Cliente Novo' }),
    );
    expect(resposta.status).toBe(201);
  });

  it("'cx' NÃO publica versão", async () => {
    instalarFetch(rotasPadrao('cx'));
    const resposta = await responderAdmin(
      postar({ acao: 'versao_publicar', versao_id: VERSAO_ID }),
    );
    expect(resposta.status).toBe(403);
    expect(await resposta.json()).toEqual({ erro: 'sem_permissao' });
    expect(chamadas.filter((c) => c.url.includes('rpc/'))).toHaveLength(0);
  });

  it("'cx' NÃO duplica versão — rascunho também mexe no conteúdo", async () => {
    instalarFetch(rotasPadrao('cx'));
    const resposta = await responderAdmin(
      postar({ acao: 'versao_rascunho', origem_id: VERSAO_ID }),
    );
    expect(resposta.status).toBe(403);
  });

  it("'admin' publica", async () => {
    instalarFetch(rotasPadrao('admin'));
    const resposta = await responderAdmin(
      postar({ acao: 'versao_publicar', versao_id: VERSAO_ID }),
    );
    expect(resposta.status).toBe(200);
    expect((await resposta.json()) as RespostaVersao).toEqual({
      versao_id: VERSAO_ID,
      numero: 4,
    });
  });
});

describe('responderAdmin — convite_criar', () => {
  it('devolve o link uma vez e grava só o hash', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(
      postar({
        acao: 'convite_criar',
        email: 'Novo@Cliente.COM',
        empresa: '  Cliente Novo  ',
        nome_cliente: 'Quem Assina',
      }),
    );
    const corpo = (await resposta.json()) as RespostaConviteCriado;
    expect(resposta.status).toBe(201);
    expect(corpo.link).toMatch(
      /^https:\/\/www\.doxaviral\.com\/manual-doxa\/convite\/[A-Za-z0-9_-]{43}$/,
    );

    const token = corpo.link.split('/').pop() ?? '';
    const gravou = chamadas.find((c) => c.metodo === 'POST' && c.url.includes('manual_convites'));
    const linha = gravou?.corpo as Record<string, unknown>;
    expect(linha.token_hash).toBe(await sha256Hex(token));
    expect(JSON.stringify(linha)).not.toContain(token);
    expect(Object.keys(linha)).not.toContain('token');
    // E-mail normalizado, empresa aparada: o que entra no banco é o limpo.
    expect(linha.email).toBe('novo@cliente.com');
    expect(linha.empresa).toBe('Cliente Novo');
    expect(linha.versao_id).toBe(VERSAO_ID);
    expect(linha.criado_por).toBe(PERFIL_ID);
  });

  it('dois convites, dois tokens diferentes', async () => {
    instalarFetch(rotasPadrao());
    const um = (await (
      await responderAdmin(postar({ acao: 'convite_criar', email: 'a@b.com', empresa: 'AB' }))
    ).json()) as RespostaConviteCriado;
    const outro = (await (
      await responderAdmin(postar({ acao: 'convite_criar', email: 'a@b.com', empresa: 'AB' }))
    ).json()) as RespostaConviteCriado;
    expect(um.link).not.toBe(outro.link);
  });

  it('registra o evento com o autor', async () => {
    instalarFetch(rotasPadrao());
    await responderAdmin(postar({ acao: 'convite_criar', email: 'a@b.com', empresa: 'AB' }));
    const evento = chamadas.find((c) => c.url.includes('manual_eventos'));
    expect(evento?.corpo).toMatchObject({
      tipo: 'convite_criado',
      ator: 'equipe',
      ator_id: PERFIL_ID,
    });
  });

  it('sem versão publicada não há convite a emitir', async () => {
    instalarFetch([
      [/manual_versoes\?status=eq\.publicada/, () => ({ corpo: [] })],
      ...rotasPadrao(),
    ]);
    const resposta = await responderAdmin(
      postar({ acao: 'convite_criar', email: 'a@b.com', empresa: 'AB' }),
    );
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'sem_versao_publicada' });
  });

  it('recusa e-mail que não é e-mail, antes de gastar um token', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(
      postar({ acao: 'convite_criar', email: 'sem-arroba', empresa: 'AB' }),
    );
    expect(resposta.status).toBe(400);
    expect(chamadas.filter((c) => c.metodo === 'POST' && c.url.includes('convites'))).toHaveLength(0);
  });
});

describe('responderAdmin — revogar e regenerar', () => {
  it('revoga só o que ainda está de pé', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(
      postar({ acao: 'convite_revogar', convite_id: CONVITE_ID }),
    );
    expect(resposta.status).toBe(200);
    const revogou = chamadas.find((c) => c.metodo === 'PATCH');
    expect(revogou?.url).toContain('status=in.(pendente,aberto)');
    expect(revogou?.corpo).toMatchObject({ status: 'revogado' });
    const evento = chamadas.find((c) => c.url.includes('manual_eventos'));
    expect(evento?.corpo).toMatchObject({ tipo: 'convite_revogado', ator_id: PERFIL_ID });
  });

  it('não revoga convite já concluído — a prova fica', async () => {
    instalarFetch(rotasPadrao('admin', { status: 'concluido', concluido_em: '2026-08-10T00:00:00.000Z' }));
    const resposta = await responderAdmin(
      postar({ acao: 'convite_revogar', convite_id: CONVITE_ID }),
    );
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'convite_concluido' });
    expect(chamadas.filter((c) => c.metodo === 'PATCH')).toHaveLength(0);
  });

  it('regenerar revoga o antigo e emite outro apontando para ele', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(
      postar({ acao: 'convite_regenerar', convite_id: CONVITE_ID }),
    );
    const corpo = (await resposta.json()) as RespostaConviteCriado;
    expect(resposta.status).toBe(201);
    expect(corpo.convite_id).toBe(NOVO_CONVITE_ID);

    expect(chamadas.find((c) => c.metodo === 'PATCH')?.corpo).toMatchObject({
      status: 'revogado',
    });
    const novo = chamadas.find((c) => c.metodo === 'POST' && c.url.includes('manual_convites'));
    expect(novo?.corpo).toMatchObject({
      regenerado_de: CONVITE_ID,
      email: CONVITE.email,
      empresa: CONVITE.empresa,
      nome_cliente: CONVITE.nome_cliente,
    });
    const tipos = chamadas
      .filter((c) => c.url.includes('manual_eventos'))
      .map((c) => (c.corpo as { tipo: string }).tipo);
    expect(tipos).toContain('convite_revogado');
    expect(tipos).toContain('convite_criado');
    expect(tipos).toContain('convite_regenerado');
  });

  it('regenerar de convite vencido renasce com a duração original, contada de agora', async () => {
    // Criado 2026-08-01 com 7 dias de prazo — vencido em 08/08, muito antes de
    // hoje. Herdar esse `expira_em` faria o link novo nascer morto.
    instalarFetch(rotasPadrao('admin', {
      expira_em: '2026-08-08T12:00:00.000Z',
    }));
    const resposta = await responderAdmin(
      postar({ acao: 'convite_regenerar', convite_id: CONVITE_ID }),
    );
    expect(resposta.status).toBe(201);
    const novo = chamadas.find((c) => c.metodo === 'POST' && c.url.includes('manual_convites'));
    const prazo = new Date((novo?.corpo as { expira_em: string }).expira_em).getTime();
    const seteDias = 7 * 24 * 60 * 60 * 1000;
    expect(prazo).toBeGreaterThan(Date.now());
    expect(prazo - Date.now()).toBeLessThanOrEqual(seteDias);
    expect(prazo - Date.now()).toBeGreaterThan(seteDias - 60_000);
  });

  it('regenerar mantém prazo que ainda está vivo', async () => {
    const futuro = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    instalarFetch(rotasPadrao('admin', { expira_em: futuro }));
    await responderAdmin(postar({ acao: 'convite_regenerar', convite_id: CONVITE_ID }));
    const novo = chamadas.find((c) => c.metodo === 'POST' && c.url.includes('manual_convites'));
    expect((novo?.corpo as { expira_em: string }).expira_em).toBe(futuro);
  });

  it('recusa id que não é uuid', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(
      postar({ acao: 'convite_revogar', convite_id: 'x)or(1.eq.1' }),
    );
    expect(resposta.status).toBe(400);
    expect(chamadas.filter((c) => c.url.includes('manual_convites'))).toHaveLength(0);
  });
});

describe('responderAdmin — pdf_baixar e versão', () => {
  it('assina o PDF do aceite e registra quem baixou', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(postar({ acao: 'pdf_baixar', aceite_id: ACEITE_ID }));
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({
      pdf_url:
        'https://banco.teste/storage/v1/object/sign/manual-pdfs/aceites/pronto.pdf?token=assinado',
    });
    const evento = chamadas.find((c) => c.url.includes('manual_eventos'));
    expect(evento?.corpo).toMatchObject({
      tipo: 'pdf_baixado',
      ator: 'equipe',
      ator_id: PERFIL_ID,
      convite_id: CONVITE_ID,
    });
  });

  it('duplica versão como rascunho, com o autor junto', async () => {
    instalarFetch(rotasPadrao());
    const resposta = await responderAdmin(
      postar({ acao: 'versao_rascunho', origem_id: VERSAO_ID }),
    );
    expect(resposta.status).toBe(201);
    const rpc = chamadas.find((c) => c.url.includes('rpc/manual_criar_rascunho'));
    expect(rpc?.corpo).toEqual({ p_origem: VERSAO_ID, p_autor: PERFIL_ID });
  });

  it('a recusa da função SQL vira 409 sem contar o que o Postgres disse', async () => {
    instalarFetch([
      [/rpc\/manual_publicar_versao/, () => ({
        corpo: { message: 'versao 3 esta publicada — so rascunho se publica' },
        status: 400,
      })],
      ...rotasPadrao(),
    ]);
    const resposta = await responderAdmin(
      postar({ acao: 'versao_publicar', versao_id: VERSAO_ID }),
    );
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'versao_recusada' });
  });
});
