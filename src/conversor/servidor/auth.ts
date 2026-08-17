/**
 * ─── QUEM PODE CONVERTER ─────────────────────────────────────────────────────
 *
 * A página do conversor mora atrás do login do time e manda o `access_token` da
 * sessão do Supabase no `Authorization: Bearer`. Aqui a pergunta é UMA:
 *
 *   o token vale? → `/auth/v1/user` responde.
 *
 * É o Supabase que confere assinatura e validade; validar JWT à mão aqui seria
 * reimplementar criptografia para errar.
 *
 * E é SÓ essa pergunta, de propósito: diferente do manual, o conversor não pede
 * linha em tabela de perfil. Quem tem sessão válida do projeto é o time — a
 * conta da Central não tem perfil em `manual_perfis`, e exigir um deixaria de
 * fora justamente quem usa a ferramenta. Por isso este arquivo NÃO importa
 * `autorizar` de `src/manual/servidor/auth.ts`.
 *
 * Este arquivo compila também no projeto da API: nada de DOM, nada de React.
 */
import type { CodigoDeErro } from '../tipos';

/**
 * O que a porta não deixou passar, já no vocabulário do contrato.
 *
 * Carrega o status junto porque quem traduz para HTTP (`converter.ts`) não
 * deve ter uma segunda tabela dizendo qual código é 401 e qual é 502 — duas
 * tabelas divergem.
 */
export class ErroDaSessao extends Error {
  constructor(
    readonly status: number,
    readonly codigo: CodigoDeErro,
    detalhe?: string,
  ) {
    super(detalhe ?? codigo);
    this.name = 'ErroDaSessao';
  }
}

interface Ambiente {
  url: string;
  chavePublica: string;
}

/**
 * Espelha `ambiente()`/`chavePublica()` de `src/manual/servidor/banco.ts` em
 * vez de importá-los: lá dentro a `SUPABASE_SERVICE_ROLE` é obrigatória, e o
 * conversor não escreve uma linha no banco — pedir a chave de serviço para
 * conferir um token seria carregar a credencial mais forte do projeto num
 * caminho que não precisa dela.
 */
function ambiente(): Ambiente {
  const url = process.env.VITE_SUPABASE_URL;
  const chavePublica = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !chavePublica) {
    console.error('conversor/auth: faltam VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY');
    // Não é culpa de quem pediu: sem como perguntar, ninguém é recusado por
    // sessão inválida. 502 diz "não consegui falar com quem sabe".
    throw new ErroDaSessao(502, 'provedor_indisponivel', 'ambiente do Supabase incompleto');
  }
  return { url, chavePublica };
}

function tokenDoCabecalho(pedido: Request): string {
  const cabecalho = pedido.headers.get('authorization') ?? '';
  if (!cabecalho.toLowerCase().startsWith('bearer ')) {
    throw new ErroDaSessao(401, 'sem_sessao');
  }
  const token = cabecalho.slice('bearer '.length).trim();
  if (token.length === 0) throw new ErroDaSessao(401, 'sem_sessao');
  return token;
}

/**
 * O id do usuário da sessão, ou erro. Lança `ErroDaSessao` — nunca devolve
 * `null`, para que não exista caminho em que o chamador esqueça de checar.
 */
export async function sessaoValida(pedido: Request): Promise<string> {
  const token = tokenDoCabecalho(pedido);
  const { url, chavePublica } = ambiente();
  let resposta: Response;
  try {
    resposta = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: chavePublica, Authorization: `Bearer ${token}` },
    });
  } catch (erro) {
    console.error('conversor/auth: falha de rede ao validar a sessao', erro);
    throw new ErroDaSessao(502, 'provedor_indisponivel', 'auth/v1/user: rede');
  }
  if (!resposta.ok) throw new ErroDaSessao(401, 'sessao_invalida');
  const usuario: unknown = await resposta.json().catch(() => null);
  const id = identificador(usuario);
  if (id == null) throw new ErroDaSessao(401, 'sessao_invalida');
  return id;
}

/** O `id` do corpo de `/auth/v1/user`, quando o corpo é o que se espera. */
function identificador(usuario: unknown): string | null {
  if (typeof usuario !== 'object' || usuario === null || !('id' in usuario)) return null;
  const { id } = usuario;
  return typeof id === 'string' && id.length > 0 ? id : null;
}
