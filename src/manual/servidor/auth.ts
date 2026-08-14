/**
 * ─── QUEM É A EQUIPE ─────────────────────────────────────────────────────────
 *
 * A área da equipe manda o `access_token` da sessão do Supabase no
 * `Authorization: Bearer`. Este arquivo faz duas perguntas, nesta ordem:
 *
 *   1. O token vale?  → `/auth/v1/user` responde (é o Supabase que valida a
 *      assinatura e a validade; conferir JWT à mão aqui seria reimplementar
 *      criptografia para errar).
 *   2. Esse usuário é da casa, e com que papel? → `manual_perfis`.
 *
 * A segunda pergunta é a que importa: uma sessão VÁLIDA do Supabase pode ser de
 * qualquer conta que exista no projeto. Sem a linha em `manual_perfis`, a
 * resposta é 403 — autenticado não é autorizado.
 */
import type { Papel } from '../tipos';
import { ambiente, chavePublica, primeira } from './banco';
import { ErroHttp } from './http';
import { ehUuid } from './validar';

export interface Autor {
  id: string;
  nome: string;
  papel: Papel;
}

interface PerfilLinha {
  id: string;
  nome: string;
  papel: string;
}

function tokenDoCabecalho(pedido: Request): string {
  const cabecalho = pedido.headers.get('authorization') ?? '';
  if (!cabecalho.toLowerCase().startsWith('bearer ')) throw new ErroHttp(401, 'sem_sessao');
  const token = cabecalho.slice('bearer '.length).trim();
  if (token.length === 0) throw new ErroHttp(401, 'sem_sessao');
  return token;
}

async function usuarioDaSessao(token: string): Promise<string> {
  const { url } = ambiente();
  const resposta = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: chavePublica(), Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) throw new ErroHttp(401, 'sessao_invalida');
  const usuario = (await resposta.json()) as { id?: unknown };
  // O id vai virar filtro do PostgREST logo abaixo: só entra se for uuid.
  if (!ehUuid(usuario.id)) throw new ErroHttp(401, 'sessao_invalida');
  return usuario.id;
}

export async function autorizar(pedido: Request): Promise<Autor> {
  const usuarioId = await usuarioDaSessao(tokenDoCabecalho(pedido));
  const perfil = await primeira<PerfilLinha>(
    `manual_perfis?id=eq.${usuarioId}&select=id,nome,papel`,
  );
  if (perfil == null) throw new ErroHttp(403, 'sem_perfil');
  if (perfil.papel !== 'admin' && perfil.papel !== 'cx') {
    throw new ErroHttp(403, 'papel_desconhecido');
  }
  return { id: perfil.id, nome: perfil.nome, papel: perfil.papel };
}

/**
 * O papel decide o que a ação pode fazer. Publicar e duplicar versão são de
 * 'admin': mexem no CONTEÚDO que todo convite novo vai carregar. Convite e PDF
 * são o dia a dia do CX.
 */
export function exigirPapel(autor: Autor, permitidos: readonly Papel[]): void {
  if (!permitidos.includes(autor.papel)) throw new ErroHttp(403, 'sem_permissao');
}
