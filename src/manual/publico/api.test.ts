/**
 * ─── OS TESTES DA CONVERSA COM A API ─────────────────────────────────────────
 *
 * `fetch` é mockado: a API de verdade é da outra track e chega no merge. O que
 * se prova aqui é o CONTRATO do lado do cliente — método, endereço, onde o
 * token viaja — e a tradução de cada falha em algo que o cliente entenda.
 *
 * O teste do token no CORPO não é zelo: token em query string entra em log de
 * servidor, em Referer e no histórico do navegador, e este token é a credencial
 * inteira do cliente.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CAMINHO_DA_API, abrirConvite, concluirAceite, pedirPdf, salvarProgresso } from './api';

interface Chamada {
  endereco: string;
  opcoes: RequestInit;
}

interface RespostaFalsa {
  corpo: string;
  status: number;
  /** `true` = o `fetch` nem completa, como numa rede que caiu. */
  rejeita?: boolean;
}

/** Troca o `fetch` global e devolve a lista viva de chamadas recebidas. */
function fingirFetch(resposta: RespostaFalsa): Chamada[] {
  const chamadas: Chamada[] = [];
  vi.stubGlobal('fetch', async (endereco: string, opcoes: RequestInit) => {
    chamadas.push({ endereco, opcoes });
    if (resposta.rejeita === true) throw new TypeError('Failed to fetch');
    // 204 é "sem conteúdo" no protocolo: o próprio construtor de `Response`
    // recusa um corpo aqui, nem que seja string vazia.
    const corpo = resposta.status === 204 ? null : resposta.corpo;
    return new Response(corpo, {
      status: resposta.status,
      headers: { 'Content-Type': 'application/json' },
    });
  });
  return chamadas;
}

function corpoDe(chamada: Chamada): Record<string, unknown> {
  return JSON.parse(String(chamada.opcoes.body)) as Record<string, unknown>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('o envelope de toda chamada', () => {
  it('é POST no endpoint único, com o token no CORPO e nunca na URL', async () => {
    const chamadas = fingirFetch({ corpo: '{"estado":"valido"}', status: 200 });
    await abrirConvite('token-secreto');

    expect(chamadas[0].endereco).toBe(CAMINHO_DA_API);
    expect(chamadas[0].endereco).not.toContain('token-secreto');
    expect(chamadas[0].opcoes.method).toBe('POST');
    expect(corpoDe(chamadas[0])).toEqual({ acao: 'abrir', token: 'token-secreto' });
  });

  it('devolve o corpo do contrato quando o servidor responde ok', async () => {
    fingirFetch({ corpo: '{"estado":"concluido","aceite":{"aceite_id":"a1"}}', status: 200 });
    const resultado = await abrirConvite('tok');
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) throw new Error('esperava sucesso');
    expect(resultado.dados.estado).toBe('concluido');
  });

  it('leva o pedido de conclusão inteiro, sem reescrever campo', async () => {
    const chamadas = fingirFetch({ corpo: '{"aceite_id":"a1"}', status: 200 });
    await concluirAceite({
      acao: 'concluir',
      token: 'tok',
      nome: 'Ana Lima',
      regras_marcadas: ['r1', 'r2'],
      declaracao_confirmada: true,
    });
    expect(corpoDe(chamadas[0])).toEqual({
      acao: 'concluir',
      token: 'tok',
      nome: 'Ana Lima',
      regras_marcadas: ['r1', 'r2'],
      declaracao_confirmada: true,
    });
  });

  it('o pedido do PDF é o mesmo endpoint, com a ação de baixar', async () => {
    const chamadas = fingirFetch({ corpo: '{"pdf_url":"https://exemplo/assinada"}', status: 200 });
    const resultado = await pedirPdf('tok');
    expect(corpoDe(chamadas[0])).toEqual({ acao: 'baixar', token: 'tok' });
    if (!resultado.ok) throw new Error('esperava sucesso');
    expect(resultado.dados.pdf_url).toBe('https://exemplo/assinada');
  });
});

describe('o progresso', () => {
  it('aceita 204 sem corpo como sucesso, em vez de chamar de erro', async () => {
    fingirFetch({ corpo: '', status: 204 });
    const resultado = await salvarProgresso({
      acao: 'progresso',
      token: 'tok',
      secao_ordem: 2,
      regras_marcadas: ['r1'],
      nome_informado: 'Ana Lima',
    });
    expect(resultado.ok).toBe(true);
  });
});

describe('quando dá errado', () => {
  it('rede fora vira falha recuperável, com frase em português', async () => {
    fingirFetch({ corpo: '', status: 0, rejeita: true });
    const resultado = await abrirConvite('tok');
    if (resultado.ok) throw new Error('esperava falha');
    expect(resultado.falha.recuperavel).toBe(true);
    expect(resultado.falha.mensagem).toMatch(/conexão/i);
  });

  it('erro 500 é recuperável e guarda o motivo técnico fora da tela', async () => {
    fingirFetch({ corpo: '{"erro":"pdf_falhou"}', status: 500 });
    const resultado = await abrirConvite('tok');
    if (resultado.ok) throw new Error('esperava falha');
    expect(resultado.falha.recuperavel).toBe(true);
    expect(resultado.falha.motivo).toBe('pdf_falhou');
    // O motivo do log NÃO vaza para a frase que o cliente lê.
    expect(resultado.falha.mensagem).not.toContain('pdf_falhou');
  });

  it('erro 4xx não é recuperável: insistir só repete a mesma resposta', async () => {
    fingirFetch({ corpo: '{"erro":"token_invalido"}', status: 400 });
    const resultado = await abrirConvite('tok');
    if (resultado.ok) throw new Error('esperava falha');
    expect(resultado.falha.recuperavel).toBe(false);
    expect(resultado.falha.motivo).toBe('token_invalido');
  });

  it('excesso de tentativas (429) é recuperável — é questão de esperar', async () => {
    fingirFetch({ corpo: '', status: 429 });
    const resultado = await salvarProgresso({
      acao: 'progresso',
      token: 'tok',
      secao_ordem: 1,
      regras_marcadas: [],
    });
    if (resultado.ok) throw new Error('esperava falha');
    expect(resultado.falha.recuperavel).toBe(true);
    // Corpo vazio não quebra a leitura do erro: sobra o status.
    expect(resultado.falha.motivo).toBe('http 429');
  });

  it('corpo de sucesso ilegível vira falha, não tela montada com lixo', async () => {
    fingirFetch({ corpo: 'não é json', status: 200 });
    const resultado = await abrirConvite('tok');
    if (resultado.ok) throw new Error('esperava falha');
    expect(resultado.falha.motivo).toBe('json');
  });
});
