/**
 * ─── OS DADOS DA ÁREA DA EQUIPE ──────────────────────────────────────────────
 *
 * Duas vias, e a fronteira entre elas é de segurança, não de gosto:
 *
 *   LEITURA         →  PostgREST direto, com a sessão do time. Toda tabela
 *                      `manual_*` tem a política "equipe le" (`manual.sql`).
 *   ESCRITA COM PODER  →  `POST /api/manual/admin`, com a service_role do outro
 *                      lado: criar convite (o token só existe na resposta),
 *                      revogar, regenerar, assinar URL de PDF, publicar versão.
 *   ESCRITA DIRETA  →  exceções deliberadas do RLS: o CONTEÚDO de um rascunho e
 *                      os eventos de `ator: 'equipe'`. Quem julga o estado é o
 *                      TRIGGER, não esta camada — por isso o erro do banco vira
 *                      frase em português aqui embaixo, e não um "400".
 *
 * O token da sessão é o MESMO da Central de leads, e é importado de lá: a conta
 * é uma só, e duplicar `CONTA_DO_TIME` seria criar uma segunda verdade sobre
 * quem é o time (ver a armadilha no CLAUDE.md).
 *
 * O transporte recebe o token por PARÂMETRO — é o que permite testar a montagem
 * do pedido com `fetch` mockado, sem navegador e sem sessão.
 */
import { CONTA_DO_TIME, tokenGuardado } from '../../leads/dados/supabase';
import type {
  AceiteItemLinha,
  AceiteLinha,
  ConviteLinha,
  EventoLinha,
  PedidoAdmin,
  PedidoConviteCriar,
  Progresso,
  RegraLinha,
  RespostaConviteCriado,
  RespostaPdf,
  RespostaVersao,
  SecaoLinha,
  VersaoLinha,
} from '../tipos';

/** O endpoint da equipe. Relativo: mesma origem do site, sem CORS. */
export const ROTA_API_ADMIN = '/api/manual/admin';

/*
 * As variáveis de ambiente são lidas DENTRO das funções, e não no topo do
 * módulo: no topo elas congelam no instante do import, e o teste que troca o
 * ambiente antes de chamar a função encontraria o valor velho.
 */
function base(): string {
  return (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
}

function chave(): string {
  return (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';
}

/** A URL de uma consulta ao PostgREST. Separada para poder ser provada. */
export function urlDaConsulta(recurso: string, consulta: string): string {
  return `${base()}/rest/v1/${recurso}?${consulta}`;
}

/** A lista de ids como o PostgREST quer dentro de um `in.(…)`. */
export function listaDeIds(ids: readonly string[]): string {
  return ids.map((id) => `"${id}"`).join(',');
}

function cabecalho(token: string): Record<string, string> {
  return {
    apikey: chave(),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * O erro do banco em português.
 *
 * A mensagem que interessa é a do TRIGGER — "so rascunho se edita" chega aqui
 * quando alguém tenta editar uma versão que já foi publicada, e isso não é um
 * defeito: é a regra funcionando. Mostrar o texto cru do Postgres faria o time
 * abrir chamado para uma recusa esperada.
 */
export function mensagemDoErro(status: number, corpo: string): string {
  if (/so rascunho se edita|imutavel|nao e rascunho|nao se apaga|nao muda mais/i.test(corpo)) {
    return 'Esta versão não é mais rascunho — conteúdo publicado não se edita. Duplique como rascunho.';
  }
  if (/duplicate key|unique/i.test(corpo)) {
    return 'Já existe um item com esse código ou endereço nesta versão.';
  }
  if (/violates check constraint|check/i.test(corpo)) {
    return 'Algum campo está fora do formato que o banco aceita.';
  }
  if (status === 404) return 'Não encontramos isso no banco.';
  return 'O banco recusou a operação.';
}

async function corpoDoErro(resposta: Response): Promise<string> {
  try {
    return await resposta.text();
  } catch {
    // Corpo ilegível não muda o que se faz: a mensagem genérica cobre.
    return '';
  }
}

/* ─── LEITURA ──────────────────────────────────────────────────────────────── */

/**
 * Lê uma tabela do esquema do manual.
 *
 * Lança `Error('sessao')` quando o token venceu e `Error(mensagem)` no resto —
 * a tela trata os dois de formas diferentes, e distinguir aqui é mais barato do
 * que a interface adivinhar pelo texto.
 */
export async function ler<L>(recurso: string, consulta: string, token: string): Promise<L[]> {
  let resposta: Response;
  try {
    resposta = await fetch(urlDaConsulta(recurso, consulta), { headers: cabecalho(token) });
  } catch {
    throw new Error('Não deu para falar com o servidor.');
  }
  if (resposta.status === 401 || resposta.status === 403) throw new Error('sessao');
  if (!resposta.ok) throw new Error(mensagemDoErro(resposta.status, await corpoDoErro(resposta)));
  return (await resposta.json()) as L[];
}

/* ─── ESCRITA DIRETA (rascunho e eventos) ──────────────────────────────────── */

export type Metodo = 'POST' | 'PATCH' | 'DELETE';

export async function escrever(
  metodo: Metodo,
  recurso: string,
  consulta: string,
  token: string,
  corpo?: unknown,
): Promise<void> {
  let resposta: Response;
  try {
    resposta = await fetch(urlDaConsulta(recurso, consulta), {
      method: metodo,
      // `return=minimal`: a tela já sabe o que mandou, e o eco só gastaria rede.
      headers: { ...cabecalho(token), Prefer: 'return=minimal' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error('Não deu para falar com o servidor.');
  }
  if (resposta.status === 401 || resposta.status === 403) throw new Error('sessao');
  if (!resposta.ok) throw new Error(mensagemDoErro(resposta.status, await corpoDoErro(resposta)));
}

/* ─── ESCRITA COM PODER (a API) ────────────────────────────────────────────── */

/** O `{ erro: '…' }` da API, quando o corpo é mesmo isso. */
export function erroDaApi(corpo: string): string | null {
  try {
    const json: unknown = JSON.parse(corpo);
    if (json != null && typeof json === 'object' && 'erro' in json) {
      const texto = (json as { erro: unknown }).erro;
      if (typeof texto === 'string' && texto.length > 0) return texto;
    }
    return null;
  } catch {
    // Corpo que não é JSON: quem responde não foi a nossa função.
    return null;
  }
}

/**
 * Um POST ao endpoint da equipe, sempre com o token da sessão no cabeçalho.
 *
 * Devolve `null` quando a resposta veio sem corpo (204) — há ações, como
 * revogar, cujo sucesso não tem nada a dizer. Quem PRECISA do corpo passa por
 * `exigirResposta`, e o erro sai com o nome da coisa que faltou.
 */
export async function chamarAdmin<R>(pedido: PedidoAdmin, token: string): Promise<R | null> {
  let resposta: Response;
  try {
    resposta = await fetch(ROTA_API_ADMIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(pedido),
    });
  } catch {
    throw new Error('Não deu para falar com o servidor.');
  }
  if (resposta.status === 401 || resposta.status === 403) throw new Error('sessao');
  const corpo = await corpoDoErro(resposta);
  if (!resposta.ok) {
    const daApi = erroDaApi(corpo);
    // 404 SEM o `{ erro }` da nossa função não é "não achei no banco": é o
    // endereço que não tem a API — `pnpm dev` serve só o site, e as funções
    // de `api/` só existem num deploy da Vercel. Já custou um susto real:
    // a mensagem antiga mandava o time procurar um cadastro que nunca existiu.
    if (daApi == null && resposta.status === 404) {
      throw new Error(
        'A API do manual não existe neste endereço — o dev local serve só o site. Teste num deploy da Vercel.',
      );
    }
    // O texto da API já é escrito para ser lido por gente; só quando ele não
    // vier é que a mensagem genérica entra.
    throw new Error(daApi ?? mensagemDoErro(resposta.status, corpo));
  }
  // Resposta vazia (204) é sucesso sem conteúdo — `JSON.parse('')` seria um
  // erro inventado por nós em cima de uma operação que deu certo.
  return corpo.length > 0 ? (JSON.parse(corpo) as R) : null;
}

/** O corpo que a tela precisa, ou um erro que diz o que faltou. */
export function exigirResposta<R>(resposta: R | null, oque: string): R {
  if (resposta == null) throw new Error(`A API não devolveu ${oque}.`);
  return resposta;
}

/* ─── A SESSÃO ─────────────────────────────────────────────────────────────── */

/**
 * O token do time, ou o fim da linha.
 *
 * As conveniências abaixo pegam a sessão daqui para que os componentes não
 * precisem carregá-la de mão em mão; o transporte continua recebendo o token
 * por parâmetro, que é o que o mantém testável.
 */
export function tokenDoTime(): string {
  const token = tokenGuardado();
  if (token == null) throw new Error('sessao');
  return token;
}

/* ─── AS CONSULTAS QUE A ÁREA FAZ ──────────────────────────────────────────── */

export function listarConvites(): Promise<ConviteLinha[]> {
  return ler<ConviteLinha>('manual_convites', 'select=*&order=criado_em.desc', tokenDoTime());
}

export function listarVersoes(): Promise<VersaoLinha[]> {
  return ler<VersaoLinha>('manual_versoes', 'select=*&order=numero.desc', tokenDoTime());
}

export function listarAceitesRecentes(quantos: number): Promise<AceiteLinha[]> {
  return ler<AceiteLinha>(
    'manual_aceites',
    `select=*&order=aceito_em.desc&limit=${quantos}`,
    tokenDoTime(),
  );
}

export function buscarConvite(id: string): Promise<ConviteLinha[]> {
  return ler<ConviteLinha>('manual_convites', `select=*&id=eq.${id}`, tokenDoTime());
}

export function buscarAceiteDoConvite(conviteId: string): Promise<AceiteLinha[]> {
  return ler<AceiteLinha>('manual_aceites', `select=*&convite_id=eq.${conviteId}`, tokenDoTime());
}

export function listarItensDoAceite(aceiteId: string): Promise<AceiteItemLinha[]> {
  return ler<AceiteItemLinha>(
    'manual_aceite_itens',
    `select=*&aceite_id=eq.${aceiteId}&order=codigo.asc`,
    tokenDoTime(),
  );
}

export function listarEventos(conviteId: string): Promise<EventoLinha[]> {
  return ler<EventoLinha>(
    'manual_eventos',
    `select=*&convite_id=eq.${conviteId}&order=criado_em.desc`,
    tokenDoTime(),
  );
}

export function buscarProgresso(conviteId: string): Promise<Progresso[]> {
  return ler<Progresso>(
    'manual_progresso',
    `select=secao_ordem,regras_marcadas,nome_informado&convite_id=eq.${conviteId}`,
    tokenDoTime(),
  );
}

/** O conteúdo inteiro de uma versão: as seções e as regras de todas elas. */
export async function carregarConteudo(
  versaoId: string,
): Promise<{ secoes: SecaoLinha[]; regras: RegraLinha[] }> {
  const token = tokenDoTime();
  const secoes = await ler<SecaoLinha>(
    'manual_secoes',
    `select=*&versao_id=eq.${versaoId}&order=ordem.asc`,
    token,
  );
  if (secoes.length === 0) return { secoes, regras: [] };
  const regras = await ler<RegraLinha>(
    'manual_regras',
    `select=*&secao_id=in.(${listaDeIds(secoes.map((s) => s.id))})&order=ordem.asc`,
    token,
  );
  return { secoes, regras };
}

/* ─── O QUE A EQUIPE ESCREVE DIRETO ────────────────────────────────────────── */

/**
 * Anota um evento da equipe na linha do tempo do convite.
 *
 * `ator` é sempre 'equipe' porque a política do banco só aceita isso desta
 * sessão — forjar um evento de cliente seria sujar a prova.
 */
export function registrarEvento(
  tipo: string,
  conviteId: string | null,
  detalhes: Record<string, unknown> = {},
): Promise<void> {
  return escrever('POST', 'manual_eventos', 'select=id', tokenDoTime(), {
    convite_id: conviteId,
    ator: 'equipe',
    ator_id: CONTA_DO_TIME,
    tipo,
    detalhes,
  });
}

export function salvarCabecalhoDaVersao(
  versaoId: string,
  campos: { titulo: string; declaracao: string },
): Promise<void> {
  return escrever('PATCH', 'manual_versoes', `id=eq.${versaoId}`, tokenDoTime(), campos);
}

export function criarSecao(secao: Omit<SecaoLinha, 'id'>): Promise<void> {
  return escrever('POST', 'manual_secoes', 'select=id', tokenDoTime(), secao);
}

export function salvarSecao(id: string, campos: Partial<SecaoLinha>): Promise<void> {
  return escrever('PATCH', 'manual_secoes', `id=eq.${id}`, tokenDoTime(), campos);
}

export function apagarSecao(id: string): Promise<void> {
  return escrever('DELETE', 'manual_secoes', `id=eq.${id}`, tokenDoTime());
}

export function criarRegra(regra: Omit<RegraLinha, 'id'>): Promise<void> {
  return escrever('POST', 'manual_regras', 'select=id', tokenDoTime(), regra);
}

export function salvarRegra(id: string, campos: Partial<RegraLinha>): Promise<void> {
  return escrever('PATCH', 'manual_regras', `id=eq.${id}`, tokenDoTime(), campos);
}

export function apagarRegra(id: string): Promise<void> {
  return escrever('DELETE', 'manual_regras', `id=eq.${id}`, tokenDoTime());
}

/* ─── O QUE SÓ A API PODE FAZER ────────────────────────────────────────────── */

export async function criarConvite(pedido: PedidoConviteCriar): Promise<RespostaConviteCriado> {
  const criado = await chamarAdmin<RespostaConviteCriado>(pedido, tokenDoTime());
  return exigirResposta(criado, 'o link do convite');
}

export async function revogarConvite(conviteId: string): Promise<void> {
  await chamarAdmin({ acao: 'convite_revogar', convite_id: conviteId }, tokenDoTime());
}

export async function regenerarConvite(conviteId: string): Promise<RespostaConviteCriado> {
  const criado = await chamarAdmin<RespostaConviteCriado>(
    { acao: 'convite_regenerar', convite_id: conviteId },
    tokenDoTime(),
  );
  return exigirResposta(criado, 'o link do convite novo');
}

export async function baixarPdf(aceiteId: string): Promise<RespostaPdf> {
  const pdf = await chamarAdmin<RespostaPdf>(
    { acao: 'pdf_baixar', aceite_id: aceiteId },
    tokenDoTime(),
  );
  return exigirResposta(pdf, 'o endereço do PDF');
}

export async function criarRascunho(origemId: string): Promise<RespostaVersao> {
  const versao = await chamarAdmin<RespostaVersao>(
    { acao: 'versao_rascunho', origem_id: origemId },
    tokenDoTime(),
  );
  return exigirResposta(versao, 'o rascunho novo');
}

export async function publicarVersao(versaoId: string): Promise<RespostaVersao> {
  const versao = await chamarAdmin<RespostaVersao>(
    { acao: 'versao_publicar', versao_id: versaoId },
    tokenDoTime(),
  );
  return exigirResposta(versao, 'a versão publicada');
}
