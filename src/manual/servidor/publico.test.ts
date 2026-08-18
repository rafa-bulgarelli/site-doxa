/**
 * ─── OS TESTES DO LADO DO CLIENTE ────────────────────────────────────────────
 *
 * Nenhum teste aqui fala com a rede: `fetch` é trocado por um roteador de
 * mentira que responde por padrão de URL e ANOTA tudo que passou. É a anotação
 * que permite cobrar as duas coisas que não se veem no corpo da resposta — que
 * o token nunca virou parte de uma URL, e que a conclusão chegou ao banco com
 * o IP e o navegador certos.
 *
 * Uma URL que nenhuma rota simula LANÇA, de propósito: um `fetch` que devolve
 * `{}` para qualquer coisa faz o teste passar por engano e esconde a chamada
 * que ninguém pretendia fazer.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConviteLinha, RespostaAbrir, RespostaConcluir } from '../tipos';
import { estadoDoConvite } from './convite';
import { responderPublico } from './publico';

const CONVITE_ID = '11111111-1111-4111-8111-111111111111';
const VERSAO_ID = '22222222-2222-4222-8222-222222222222';
const SECAO_ID = '33333333-3333-4333-8333-333333333333';
const REGRA_ID = '44444444-4444-4444-8444-444444444444';
const ACEITE_ID = '55555555-5555-4555-8555-555555555555';
const TOKEN = 'Zt7Qw2LpX9aB4cD6eF8gH0jK1mN3oP5qR7sT9uV2wX4';

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

function convite(troca: Partial<ConviteLinha> = {}): ConviteLinha {
  return {
    id: CONVITE_ID,
    email: 'cliente@empresa.com.br',
    empresa: 'Empresa do Cliente',
    nome_cliente: 'Fulano de Tal',
  invite_plataforma: null,
    versao_id: VERSAO_ID,
    status: 'pendente',
    expira_em: null,
    criado_em: '2026-08-01T12:00:00.000Z',
    aberto_em: null,
    concluido_em: null,
    revogado_em: null,
    regenerado_de: null,
    ...troca,
  };
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

const ACEITE = {
  id: ACEITE_ID,
  convite_id: CONVITE_ID,
  versao_id: VERSAO_ID,
  nome: 'Fulano de Tal',
  empresa: 'Empresa do Cliente',
  email: 'cliente@empresa.com.br',
  declaracao: VERSAO.declaracao,
  aceito_em: '2026-08-14T18:32:00.000Z',
  ip: '203.0.113.9',
  user_agent: 'Mozilla/5.0',
  conteudo_sha256: 'd'.repeat(64),
  pdf_caminho: null,
  pdf_sha256: null,
  criado_em: '2026-08-14T18:32:00.000Z',
};

const SECAO = {
  id: SECAO_ID,
  versao_id: VERSAO_ID,
  slug: 'operacao',
  titulo: 'Operação',
  descricao: 'Como o dia a dia funciona.',
  ordem: 0,
};

const TEXTO_DA_REGRA = {
  codigo: 'OP-01',
  titulo: 'Aprovação em 24 horas',
  instrucao: 'Responda a cada peça em 24 horas úteis.',
  porque: 'Sem aprovação a veiculação atrasa.',
  exemplo: 'Recebeu terça às 10h: responda até quarta às 10h.',
  severidade: 'critica',
};

const REGRA = { ...TEXTO_DA_REGRA, id: REGRA_ID, secao_id: SECAO_ID, obrigatoria: true, ordem: 0 };

const ITEM_DO_ACEITE = {
  ...TEXTO_DA_REGRA,
  id: '66666666-6666-4666-8666-666666666666',
  aceite_id: ACEITE_ID,
  regra_id: REGRA_ID,
  aceito_em: ACEITE.aceito_em,
};

/** O caminho feliz inteiro: convite, versão, aceite, bucket. */
function rotasPadrao(linha: ConviteLinha | null): Rota[] {
  return [
    [/manual_convites\?token_hash=/, () => ({ corpo: linha == null ? [] : [linha] })],
    [/manual_convites\?id=/, () => ({ corpo: linha == null ? [] : [linha] })],
    [/manual_progresso/, () => ({ corpo: [] })],
    [/manual_secoes/, () => ({ corpo: [SECAO] })],
    [/manual_regras/, () => ({ corpo: [REGRA] })],
    [/manual_versoes/, () => ({ corpo: [VERSAO] })],
    [/manual_aceite_itens/, () => ({ corpo: [ITEM_DO_ACEITE] })],
    [/manual_aceites\?/, (url) =>
      url.includes('pdf_caminho=is.null')
        ? { corpo: [{ ...ACEITE, pdf_caminho: 'aceites/x.pdf', pdf_sha256: 'e'.repeat(64) }] }
        : { corpo: [ACEITE] },
    ],
    [/manual_eventos/, () => ({ corpo: null, status: 201 })],
    [/rpc\/manual_concluir/, () => ({
      corpo: {
        aceite_id: ACEITE_ID,
        aceito_em: ACEITE.aceito_em,
        conteudo_sha256: ACEITE.conteudo_sha256,
        ja_existia: false,
      },
    })],
    [/storage\/v1\/object\/sign\//, () => ({
      corpo: { signedURL: '/object/sign/manual-pdfs/aceites/x.pdf?token=assinado' },
    })],
    [/storage\/v1\/object\//, () => ({ corpo: { Key: 'manual-pdfs/aceites/x.pdf' } })],
  ];
}

function postar(corpo: unknown, cabecalhos: Record<string, string> = {}): Request {
  return new Request('https://www.doxaviral.com/api/manual/publico', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...cabecalhos },
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

describe('estadoDoConvite', () => {
  const agora = new Date('2026-08-14T12:00:00.000Z');

  it('deriva expirado do relógio, e não de um status gravado', () => {
    const vencido = convite({ expira_em: '2026-08-13T12:00:00.000Z' });
    expect(estadoDoConvite(vencido, agora)).toBe('expirado');
    expect(vencido.status).toBe('pendente');
  });

  it('não expira o que não tem prazo', () => {
    expect(estadoDoConvite(convite({ expira_em: null }), agora)).toBe('valido');
  });

  it('revogado e concluído ganham de expirado — prova não vence', () => {
    const vencido = '2026-08-13T12:00:00.000Z';
    expect(
      estadoDoConvite(
        convite({ status: 'revogado', revogado_em: vencido, expira_em: vencido }),
        agora,
      ),
    ).toBe('revogado');
    expect(
      estadoDoConvite(
        convite({ status: 'concluido', concluido_em: vencido, aberto_em: vencido, expira_em: vencido }),
        agora,
      ),
    ).toBe('concluido');
  });

  it('aberto continua válido enquanto o prazo não passou', () => {
    const aberto = convite({ status: 'aberto', aberto_em: '2026-08-10T12:00:00.000Z' });
    expect(estadoDoConvite(aberto, agora)).toBe('valido');
  });
});

describe('responderPublico — a portaria', () => {
  it('recusa o que não é POST', async () => {
    instalarFetch([]);
    const resposta = await responderPublico(
      new Request('https://www.doxaviral.com/api/manual/publico'),
    );
    expect(resposta.status).toBe(405);
    expect(chamadas).toHaveLength(0);
  });

  it('recusa corpo que não é pedido, sem encostar no banco', async () => {
    instalarFetch([]);
    for (const corpo of [null, [], { acao: 'sumir', token: TOKEN }, 'texto']) {
      const resposta = await responderPublico(postar(corpo));
      expect(resposta.status).toBe(400);
    }
    expect(chamadas).toHaveLength(0);
  });

  it('recusa token malformado antes de perguntar ao banco', async () => {
    instalarFetch([]);
    const resposta = await responderPublico(postar({ acao: 'abrir', token: 'x,or=(id.eq.1)' }));
    expect(resposta.status).toBe(400);
    expect(await resposta.json()).toEqual({ erro: 'token_invalido' });
    expect(chamadas).toHaveLength(0);
  });
});

describe('responderPublico — abrir', () => {
  it('busca pelo HASH: o token não aparece em URL nenhuma', async () => {
    instalarFetch(rotasPadrao(convite()));
    await responderPublico(postar({ acao: 'abrir', token: TOKEN }));
    expect(chamadas.length).toBeGreaterThan(0);
    for (const chamada of chamadas) expect(chamada.url).not.toContain(TOKEN);
    expect(chamadas[0].url).toMatch(/token_hash=eq\.[0-9a-f]{64}/);
  });

  it('token desconhecido é "invalido", e não um 404 que conta demais', async () => {
    instalarFetch(rotasPadrao(null));
    const resposta = await responderPublico(postar({ acao: 'abrir', token: TOKEN }));
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({ estado: 'invalido' });
  });

  it('convite vencido devolve "expirado" e NÃO devolve o manual', async () => {
    instalarFetch(rotasPadrao(convite({ expira_em: '2020-01-01T00:00:00.000Z' })));
    const corpo = (await (
      await responderPublico(postar({ acao: 'abrir', token: TOKEN }))
    ).json()) as RespostaAbrir;
    expect(corpo.estado).toBe('expirado');
    expect(corpo.versao).toBeUndefined();
    expect(corpo.convite).toBeUndefined();
  });

  it('convite revogado devolve "revogado"', async () => {
    const linha = convite({ status: 'revogado', revogado_em: '2026-08-10T00:00:00.000Z' });
    instalarFetch(rotasPadrao(linha));
    const corpo = (await (
      await responderPublico(postar({ acao: 'abrir', token: TOKEN }))
    ).json()) as RespostaAbrir;
    expect(corpo.estado).toBe('revogado');
    expect(corpo.versao).toBeUndefined();
  });

  it('convite válido monta a versão inteira e marca o primeiro acesso', async () => {
    instalarFetch(rotasPadrao(convite()));
    const corpo = (await (
      await responderPublico(postar({ acao: 'abrir', token: TOKEN }))
    ).json()) as RespostaAbrir;

    expect(corpo.estado).toBe('valido');
    expect(corpo.convite?.empresa).toBe('Empresa do Cliente');
    expect(corpo.versao?.numero).toBe(3);
    expect(corpo.versao?.secoes).toHaveLength(1);
    expect(corpo.versao?.secoes[0].regras[0].codigo).toBe('OP-01');
    expect(corpo.versao?.secoes[0].regras[0].porque).not.toBe('');

    const marcou = chamadas.find((c) => c.metodo === 'PATCH');
    expect(marcou?.url).toContain('status=eq.pendente');
    expect(marcou?.corpo).toMatchObject({ status: 'aberto' });
    const evento = chamadas.find((c) => c.url.includes('manual_eventos'));
    expect(evento?.corpo).toMatchObject({ tipo: 'convite_aberto', ator: 'cliente' });
  });

  it('convite já aberto não é remarcado a cada visita', async () => {
    instalarFetch(rotasPadrao(convite({ status: 'aberto', aberto_em: '2026-08-02T00:00:00.000Z' })));
    await responderPublico(postar({ acao: 'abrir', token: TOKEN }));
    expect(chamadas.filter((c) => c.metodo === 'PATCH')).toHaveLength(0);
  });

  it('convite concluído devolve o resumo do aceite, não o manual', async () => {
    const linha = convite({
      status: 'concluido',
      aberto_em: '2026-08-10T00:00:00.000Z',
      concluido_em: ACEITE.aceito_em,
    });
    instalarFetch(rotasPadrao(linha));
    const corpo = (await (
      await responderPublico(postar({ acao: 'abrir', token: TOKEN }))
    ).json()) as RespostaAbrir;
    expect(corpo.estado).toBe('concluido');
    expect(corpo.aceite).toMatchObject({ aceite_id: ACEITE_ID, versao_numero: 3 });
    expect(corpo.versao).toBeUndefined();
  });
});

describe('responderPublico — progresso', () => {
  it('grava onde o cliente parou, com a chave em convite_id', async () => {
    instalarFetch(rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })));
    const resposta = await responderPublico(
      postar({
        acao: 'progresso',
        token: TOKEN,
        secao_ordem: 2,
        regras_marcadas: [REGRA_ID, REGRA_ID],
        nome_informado: '  Beltrana  ',
      }),
    );
    expect(resposta.status).toBe(200);
    const gravou = chamadas.find((c) => c.url.includes('manual_progresso') && c.metodo === 'POST');
    expect(gravou?.url).toContain('on_conflict=convite_id');
    // A repetição do id sumiu, e o nome veio aparado: o progresso é normalizado
    // antes de virar linha, não depois.
    expect(gravou?.corpo).toMatchObject({
      convite_id: CONVITE_ID,
      secao_ordem: 2,
      regras_marcadas: [REGRA_ID],
      nome_informado: 'Beltrana',
    });
  });

  it('recusa progresso em convite revogado', async () => {
    instalarFetch(rotasPadrao(convite({ status: 'revogado', revogado_em: ACEITE.aceito_em })));
    const resposta = await responderPublico(
      postar({ acao: 'progresso', token: TOKEN, secao_ordem: 1, regras_marcadas: [] }),
    );
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'revogado' });
    expect(chamadas.filter((c) => c.metodo === 'POST' && c.url.includes('progresso'))).toHaveLength(0);
  });

  it('recusa regra que não é uuid — o filtro do PostgREST não é lugar de texto livre', async () => {
    instalarFetch(rotasPadrao(convite()));
    const resposta = await responderPublico(
      postar({ acao: 'progresso', token: TOKEN, secao_ordem: 0, regras_marcadas: ['1,2)'] }),
    );
    expect(resposta.status).toBe(400);
    expect(chamadas).toHaveLength(0);
  });
});

describe('responderPublico — concluir', () => {
  it('manda tudo para manual_concluir, com o primeiro IP da cadeia', async () => {
    instalarFetch(rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })));
    const resposta = await responderPublico(
      postar(
        {
          acao: 'concluir',
          token: TOKEN,
          nome: 'Fulano de Tal',
          regras_marcadas: [REGRA_ID],
          declaracao_confirmada: true,
        },
        {
          'x-forwarded-for': '203.0.113.9, 70.41.3.18, 150.172.238.178',
          'user-agent': 'Mozilla/5.0 (iPhone)',
        },
      ),
    );

    const corpo = (await resposta.json()) as RespostaConcluir;
    expect(resposta.status).toBe(200);
    expect(corpo.aceite_id).toBe(ACEITE_ID);
    expect(corpo.conteudo_sha256).toBe(ACEITE.conteudo_sha256);
    expect(corpo.pdf_url).toContain('/storage/v1/object/sign/');
    expect(corpo.pdf_sha256).toMatch(/^[0-9a-f]{64}$/);

    const rpc = chamadas.find((c) => c.url.includes('rpc/manual_concluir'));
    expect(rpc?.corpo).toMatchObject({
      p_convite: CONVITE_ID,
      p_regras: [REGRA_ID],
      p_declaracao_confirmada: true,
      p_ip: '203.0.113.9',
      p_user_agent: 'Mozilla/5.0 (iPhone)',
    });
  });

  it('sobe o PDF e só então carimba o par, com o filtro que evita a corrida', async () => {
    instalarFetch(rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })));
    await responderPublico(
      postar({
        acao: 'concluir',
        token: TOKEN,
        regras_marcadas: [REGRA_ID],
        declaracao_confirmada: true,
      }),
    );
    const subiu = chamadas.find((c) => c.url.includes('/storage/v1/object/manual-pdfs/'));
    expect(subiu?.metodo).toBe('POST');
    expect(subiu?.url).toContain(`aceites/${ACEITE_ID}.pdf`);
    const carimbou = chamadas.find(
      (c) => c.metodo === 'PATCH' && c.url.includes('manual_aceites'),
    );
    expect(carimbou?.url).toContain('pdf_caminho=is.null');
    expect(carimbou?.corpo).toMatchObject({ pdf_caminho: `aceites/${ACEITE_ID}.pdf` });
  });

  it('PDF que falha DEPOIS do aceite devolve pdf_url null — o aceite continua valendo', async () => {
    const quebrado: Rota[] = [
      [/storage\/v1\/object\//, () => ({ corpo: { error: 'nao hoje' }, status: 500 })],
      ...rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })),
    ];
    instalarFetch(quebrado);
    const resposta = await responderPublico(
      postar({
        acao: 'concluir',
        token: TOKEN,
        regras_marcadas: [REGRA_ID],
        declaracao_confirmada: true,
      }),
    );
    const corpo = (await resposta.json()) as RespostaConcluir;
    expect(resposta.status).toBe(200);
    expect(corpo.aceite_id).toBe(ACEITE_ID);
    expect(corpo.pdf_url).toBeNull();
    expect(corpo.pdf_sha256).toBeNull();
  });

  it('traduz a recusa da função SQL sem inventar mensagem', async () => {
    const faltando: Rota[] = [
      [/rpc\/manual_concluir/, () => ({ corpo: { message: 'regras_faltando' }, status: 400 })],
      ...rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })),
    ];
    instalarFetch(faltando);
    const resposta = await responderPublico(
      postar({
        acao: 'concluir',
        token: TOKEN,
        regras_marcadas: [],
        declaracao_confirmada: true,
      }),
    );
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'regras_faltando' });
  });

  it('erro de banco que não é regra de negócio não vaza para o cliente', async () => {
    const explodiu: Rota[] = [
      [/rpc\/manual_concluir/, () => ({
        corpo: { message: 'column manual_aceites.nome does not exist' },
        status: 400,
      })],
      ...rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })),
    ];
    instalarFetch(explodiu);
    const resposta = await responderPublico(
      postar({
        acao: 'concluir',
        token: TOKEN,
        regras_marcadas: [REGRA_ID],
        declaracao_confirmada: true,
      }),
    );
    expect(resposta.status).toBe(500);
    expect(await resposta.json()).toEqual({ erro: 'falhou' });
  });

  it('convite vencido não chega na função SQL', async () => {
    instalarFetch(rotasPadrao(convite({ expira_em: '2020-01-01T00:00:00.000Z' })));
    const resposta = await responderPublico(
      postar({
        acao: 'concluir',
        token: TOKEN,
        regras_marcadas: [REGRA_ID],
        declaracao_confirmada: true,
      }),
    );
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'convite_expirado' });
    expect(chamadas.filter((c) => c.url.includes('rpc/'))).toHaveLength(0);
  });
});

describe('responderPublico — baixar', () => {
  it('assina a URL de um aceite que já tem PDF, sem gerar de novo', async () => {
    const jaTem: Rota[] = [
      [/manual_aceites\?/, () => ({
        corpo: [{ ...ACEITE, pdf_caminho: 'aceites/pronto.pdf', pdf_sha256: 'f'.repeat(64) }],
      })],
      ...rotasPadrao(
        convite({ status: 'concluido', aberto_em: ACEITE.aceito_em, concluido_em: ACEITE.aceito_em }),
      ),
    ];
    instalarFetch(jaTem);
    const resposta = await responderPublico(postar({ acao: 'baixar', token: TOKEN }));
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({
      pdf_url: 'https://banco.teste/storage/v1/object/sign/manual-pdfs/aceites/x.pdf?token=assinado',
    });
    expect(chamadas.filter((c) => c.url.includes('manual_aceite_itens'))).toHaveLength(0);
  });

  it('convite sem conclusão não tem o que baixar', async () => {
    instalarFetch(rotasPadrao(convite({ status: 'aberto', aberto_em: ACEITE.aceito_em })));
    const resposta = await responderPublico(postar({ acao: 'baixar', token: TOKEN }));
    expect(resposta.status).toBe(409);
    expect(await resposta.json()).toEqual({ erro: 'sem_aceite' });
  });
});
