/**
 * ─── A CONVERSA COM O BANCO ──────────────────────────────────────────────────
 *
 * `fetch` cru no PostgREST, como em `api/lead.ts`, e pelo mesmo motivo: o
 * runtime de borda não é Node, e trazer o cliente do Supabase para cá custaria
 * um pacote inteiro para fazer o que quatro funções fazem.
 *
 * Tudo aqui fala com a `service_role`, e isso é o desenho de `manual.sql`:
 * escrita em convite, progresso, aceite e item não existe para papel nenhum, e
 * as funções SQL têm `revoke` de `anon` e `authenticated`. A API é o único
 * caminho — o que também quer dizer que qualquer descuido aqui é um descuido
 * SEM rede de proteção do RLS embaixo.
 *
 * Por isso nenhum valor vindo do cliente entra num filtro sem passar por
 * `validar.ts` antes.
 */
import { ErroHttp } from './http';

/** O erro do banco carrega a mensagem para quem SABE traduzi-la (as `raise` de `manual_concluir`). */
export class ErroDoBanco extends Error {
  constructor(
    readonly status: number,
    readonly mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ErroDoBanco';
  }
}

interface Ambiente {
  url: string;
  servico: string;
}

/**
 * Sem URL ou sem `service_role` não há degradação possível: diferente do
 * formulário de leads, aqui não existe caminho com a chave pública — ela não
 * enxerga uma linha deste esquema. Então é 503, e o log diz o que falta.
 */
export function ambiente(): Ambiente {
  const url = process.env.VITE_SUPABASE_URL;
  const servico = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !servico) {
    throw new ErroHttp(
      503,
      'indisponivel',
      'faltam VITE_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE',
    );
  }
  return { url, servico };
}

/** A chave pública, usada SÓ para validar a sessão do time em `/auth/v1/user`. */
export function chavePublica(): string {
  const publica = process.env.VITE_SUPABASE_ANON_KEY;
  if (!publica) throw new ErroHttp(503, 'indisponivel', 'falta VITE_SUPABASE_ANON_KEY');
  return publica;
}

async function chamar(caminho: string, init: RequestInit = {}): Promise<Response> {
  const { url, servico } = ambiente();
  const cabecalhos = new Headers(init.headers);
  cabecalhos.set('apikey', servico);
  cabecalhos.set('Authorization', `Bearer ${servico}`);
  if (init.body != null) cabecalhos.set('Content-Type', 'application/json');
  return fetch(`${url}${caminho}`, { ...init, headers: cabecalhos });
}

/** A mensagem do PostgREST, quando ele manda uma. É o que traduz `raise exception`. */
async function motivoDe(resposta: Response): Promise<string> {
  const texto = await resposta.text();
  try {
    const corpo: unknown = JSON.parse(texto);
    if (typeof corpo === 'object' && corpo !== null && 'message' in corpo) {
      const { message } = corpo as { message?: unknown };
      if (typeof message === 'string') return message;
    }
  } catch {
    // Nem todo erro do PostgREST é JSON (um 502 do proxy, por exemplo). O texto
    // cru serve para o log do mesmo jeito.
  }
  return texto.slice(0, 400);
}

async function exigirOk(resposta: Response, operacao: string): Promise<void> {
  if (resposta.ok) return;
  const motivo = await motivoDe(resposta);
  console.error('manual/banco:', operacao, resposta.status, motivo);
  throw new ErroDoBanco(resposta.status, motivo);
}

export async function consultar<T>(consulta: string): Promise<T[]> {
  const resposta = await chamar(`/rest/v1/${consulta}`);
  await exigirOk(resposta, `select ${consulta}`);
  const linhas = (await resposta.json()) as T[];
  return Array.isArray(linhas) ? linhas : [];
}

/** A primeira linha, ou `null`. Quem chama decide se ausência é erro. */
export async function primeira<T>(consulta: string): Promise<T | null> {
  const linhas = await consultar<T>(`${consulta}&limit=1`);
  return linhas.length > 0 ? linhas[0] : null;
}

export async function inserir<T>(tabela: string, linha: Record<string, unknown>): Promise<T> {
  const resposta = await chamar(`/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(linha),
  });
  await exigirOk(resposta, `insert ${tabela}`);
  const linhas = (await resposta.json()) as T[];
  if (!Array.isArray(linhas) || linhas.length === 0) {
    throw new ErroDoBanco(502, `insert em ${tabela} nao devolveu linha`);
  }
  return linhas[0];
}

/** Sem `return=representation`: para evento e afins, a linha de volta é peso morto. */
export async function inserirMudo(tabela: string, linha: Record<string, unknown>): Promise<void> {
  const resposta = await chamar(`/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(linha),
  });
  await exigirOk(resposta, `insert ${tabela}`);
}

/**
 * Devolve as linhas alteradas — e a LISTA VAZIA é informação, não detalhe:
 * é como se sabe que o filtro não pegou ninguém (o convite já estava revogado,
 * o par do PDF já tinha sido preenchido por outra chamada).
 */
export async function atualizar<T>(
  tabela: string,
  filtro: string,
  campos: Record<string, unknown>,
): Promise<T[]> {
  const resposta = await chamar(`/rest/v1/${tabela}?${filtro}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(campos),
  });
  await exigirOk(resposta, `update ${tabela}`);
  const linhas = (await resposta.json()) as T[];
  return Array.isArray(linhas) ? linhas : [];
}

/** Insere ou sobrescreve pela chave em conflito — o progresso do cliente. */
export async function gravarOuAtualizar(
  tabela: string,
  chave: string,
  linha: Record<string, unknown>,
): Promise<void> {
  const resposta = await chamar(`/rest/v1/${tabela}?on_conflict=${chave}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(linha),
  });
  await exigirOk(resposta, `upsert ${tabela}`);
}

/** As funções de `manual.sql`. Só a `service_role` chega aqui — é o `revoke` que garante. */
export async function rpc<T>(nome: string, argumentos: Record<string, unknown>): Promise<T> {
  const resposta = await chamar(`/rest/v1/rpc/${nome}`, {
    method: 'POST',
    body: JSON.stringify(argumentos),
  });
  await exigirOk(resposta, `rpc ${nome}`);
  return (await resposta.json()) as T;
}
