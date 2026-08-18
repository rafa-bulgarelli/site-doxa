/**
 * ─── O LADO DA EQUIPE ────────────────────────────────────────────────────────
 *
 * Sete ações, uma credencial: o `access_token` da sessão do time no
 * `Authorization: Bearer`. Toda uma passa por `autorizar` ANTES de a ação ser
 * lida — não existe caminho aqui que toque no banco sem saber quem pediu.
 *
 * ─── O PAPEL, E POR QUE ELE DIVIDE ASSIM ─────────────────────────────────────
 *
 * 'cx' cuida do dia a dia: cria, revoga, regenera e exclui convite, e baixa
 * comprovante. Publicar e duplicar versão são de 'admin' porque mexem no
 * CONTEÚDO que todo convite novo vai carregar — publicar por engano troca o
 * manual do mundo inteiro, e revogar um convite por engano custa um link novo.
 * Excluir só alcança o que nunca virou aceite: a prova o banco não deixa cair.
 *
 * ─── O LINK APARECE UMA VEZ ──────────────────────────────────────────────────
 *
 * `convite_criar` é o único instante em que o token existe fora do navegador do
 * cliente. O banco guarda o hash; fechou a resposta, acabou. Perdeu o link?
 * Regenera — que revoga o antigo e emite outro, com a cadeia registrada em
 * `regenerado_de`.
 */
import { ROTA_BASE } from '../config';
import type {
  ConviteLinha,
  PedidoAdmin,
  PedidoConviteCriar,
  PedidoConviteExcluir,
  PedidoConviteRegenerar,
  PedidoConviteRevogar,
  PedidoPdfBaixar,
  PedidoVersaoRascunho,
  RespostaConviteCriado,
  RespostaPdf,
  RespostaVersao,
  VersaoLinha,
} from '../tipos';
import { autorizar, exigirPapel, type Autor } from './auth';
import { ErroDoBanco, ambiente, atualizar, inserir, primeira, rpc } from './banco';
import { garantirPdf } from './comprovante';
import { registrarEvento } from './eventos';
import { ErroHttp, lerJson, responder, responderErro } from './http';
import { lerPedidoAdmin } from './pedidos';
import { gerarToken, hashDoToken } from './token';
import { exigirUuid, objetoDe } from './validar';
import { versaoPublicada } from './versao';

/** O domínio de produção. O link vai por WhatsApp e precisa ser absoluto. */
const SITE = 'https://www.doxaviral.com';

/** O teto do `check` de `invite_plataforma` em `manual_convites`. */
const MAXIMO_DO_INVITE = 500;

/** A linha do aceite que o `pdf_baixar` precisa — nada além do vínculo. */
interface AceiteDoConvite {
  id: string;
  convite_id: string;
}

function linkDoConvite(token: string): string {
  return `${SITE}${ROTA_BASE}/convite/${token}`;
}

async function conviteDe(conviteId: string): Promise<ConviteLinha> {
  const convite = await primeira<ConviteLinha>(`manual_convites?id=eq.${conviteId}&select=*`);
  if (convite == null) throw new ErroHttp(404, 'convite_inexistente');
  return convite;
}

/**
 * O link de cadastro na plataforma, na régua EXATA do `check` da coluna: http
 * ou https, até 500 caracteres. Sem o `i` no padrão de propósito — o `~` do
 * Postgres é sensível a maiúsculas, e um 'HTTPS://' que passasse por aqui
 * viraria um 500 do banco em vez deste 400 que o CX consegue ler.
 */
function inviteOpcional(valor: unknown): string | undefined {
  if (valor == null) return undefined;
  if (typeof valor !== 'string') {
    throw new ErroHttp(400, 'campo_invalido', 'invite_plataforma nao e texto');
  }
  const limpo = valor.trim();
  if (limpo.length === 0) return undefined;
  if (limpo.length > MAXIMO_DO_INVITE || !/^https?:\/\//.test(limpo)) {
    throw new ErroHttp(400, 'campo_invalido', 'invite_plataforma nao e link ate 500');
  }
  return limpo;
}

/**
 * As duas entradas que o lado da equipe valida por conta própria, ao lado da
 * regra que as usa: o `invite_plataforma`, que só faz sentido junto do `check`
 * que ele espelha, e o `convite_excluir`, a única ação destrutiva do manual —
 * nenhuma das duas tem par no fluxo público que `pedidos.ts` atende junto. O
 * resto do corpo continua passando inteiro pela portaria comum.
 */
function lerPedidoDaEquipe(corpo: unknown): PedidoAdmin {
  const bruto = objetoDe(corpo);
  if (bruto.acao === 'convite_excluir') {
    return { acao: 'convite_excluir', convite_id: exigirUuid(bruto.convite_id, 'convite_id') };
  }
  const pedido = lerPedidoAdmin(bruto);
  if (pedido.acao !== 'convite_criar') return pedido;
  return { ...pedido, invite_plataforma: inviteOpcional(bruto.invite_plataforma) };
}

/**
 * Emite convite e link. A versão é sempre a PUBLICADA no momento da emissão, e
 * é ela que o convite carrega para sempre — publicar um manual novo amanhã não
 * muda o que este cliente vai ver.
 */
async function criarConvite(
  autor: Autor,
  dados: Pick<
    PedidoConviteCriar,
    'email' | 'empresa' | 'nome_cliente' | 'expira_em' | 'invite_plataforma'
  >,
  regeneradoDe: string | null,
): Promise<RespostaConviteCriado> {
  const versao = await versaoPublicada();
  if (versao == null) throw new ErroHttp(409, 'sem_versao_publicada');

  const token = gerarToken();
  const convite = await inserir<ConviteLinha>('manual_convites', {
    token_hash: await hashDoToken(token),
    email: dados.email,
    empresa: dados.empresa,
    nome_cliente: dados.nome_cliente ?? null,
    invite_plataforma: dados.invite_plataforma ?? null,
    versao_id: versao.id,
    expira_em: dados.expira_em ?? null,
    criado_por: autor.id,
    regenerado_de: regeneradoDe,
  });

  await registrarEvento({
    convite_id: convite.id,
    ator: 'equipe',
    ator_id: autor.id,
    tipo: 'convite_criado',
    detalhes: { versao_id: versao.id, regenerado_de: regeneradoDe },
  });
  return { convite_id: convite.id, link: linkDoConvite(token) };
}

/**
 * Revoga, e trata "não pegou ninguém" como o que é: alguém já revogou, ou o
 * cliente já concluiu. O `update` filtrado é o que evita bater no trigger de
 * convite concluído, que recusaria a mudança com uma exceção do Postgres.
 */
async function revogar(autor: Autor, conviteId: string): Promise<ConviteLinha> {
  const convite = await conviteDe(conviteId);
  if (convite.status === 'concluido') throw new ErroHttp(409, 'convite_concluido');
  if (convite.status === 'revogado') return convite;
  const linhas = await atualizar<ConviteLinha>(
    'manual_convites',
    `id=eq.${conviteId}&status=in.(pendente,aberto)`,
    { status: 'revogado', revogado_em: new Date().toISOString() },
  );
  if (linhas.length === 0) throw new ErroHttp(409, 'convite_mudou');
  await registrarEvento({
    convite_id: conviteId,
    ator: 'equipe',
    ator_id: autor.id,
    tipo: 'convite_revogado',
  });
  return linhas[0];
}

/**
 * O prazo do convite novo. Herdar `expira_em` vencido criaria um filho que já
 * nasce expirado — e regenerar um link vencido para reenviar é exatamente o
 * caso natural. Prazo ainda vivo se mantém; vencido renasce com a duração
 * original, contada de agora; sem prazo continua sem prazo.
 */
function prazoRenovado(antigo: ConviteLinha): string | undefined {
  if (antigo.expira_em == null) return undefined;
  const expira = new Date(antigo.expira_em).getTime();
  if (expira > Date.now()) return antigo.expira_em;
  const duracao = expira - new Date(antigo.criado_em).getTime();
  return new Date(Date.now() + Math.max(duracao, 0)).toISOString();
}

async function regenerar(autor: Autor, dados: PedidoConviteRegenerar): Promise<RespostaConviteCriado> {
  const antigo = await conviteDe(dados.convite_id);
  await revogar(autor, antigo.id);
  const novo = await criarConvite(
    autor,
    {
      email: antigo.email,
      empresa: antigo.empresa,
      nome_cliente: antigo.nome_cliente ?? undefined,
      // O cadastro na plataforma não mudou porque o link do manual mudou: quem
      // regenera quer o MESMO convite outra vez, botão final incluído.
      invite_plataforma: antigo.invite_plataforma ?? undefined,
      expira_em: prazoRenovado(antigo),
    },
    antigo.id,
  );
  await registrarEvento({
    convite_id: antigo.id,
    ator: 'equipe',
    ator_id: autor.id,
    tipo: 'convite_regenerado',
    detalhes: { novo_convite_id: novo.convite_id },
  });
  return novo;
}

/**
 * O DELETE cru. `banco.ts` não tem um apagar, e não é esquecimento: esta é a
 * única escrita destrutiva do manual, e ela fica ao lado da regra que a
 * autoriza, não numa caixa de ferramentas que qualquer módulo abre.
 */
async function apagarConvite(conviteId: string): Promise<void> {
  const { url, servico } = ambiente();
  const resposta = await fetch(`${url}/rest/v1/manual_convites?id=eq.${conviteId}`, {
    method: 'DELETE',
    headers: { apikey: servico, Authorization: `Bearer ${servico}`, Prefer: 'return=minimal' },
  });
  if (resposta.ok) return;
  const motivo = (await resposta.text()).slice(0, 400);
  console.error('manual/admin: delete convite recusado', resposta.status, motivo);
  // 4xx aqui é a rede de segurança do banco falando — a `raise` do trigger, ou
  // o `on delete restrict` do aceite. As duas só disparam para convite que
  // virou prova entre a leitura e o apagar. O resto é infraestrutura, e sobe.
  if (resposta.status >= 400 && resposta.status < 500) {
    throw new ErroHttp(409, 'convite_concluido');
  }
  throw new ErroDoBanco(resposta.status, motivo);
}

/**
 * Apaga o convite que NÃO chegou ao aceite — o link errado, o teste, o cliente
 * que desistiu. O 409 sai da LEITURA, antes do DELETE, porque o CX precisa do
 * motivo; o trigger de `manual.sql` recusa o concluído de todo jeito.
 *
 * De propósito não há evento: `manual_eventos` aponta para o convite com
 * `on delete cascade`, então o registro do apagar seria apagado no mesmo
 * comando. Registro que some junto com o fato não é registro.
 */
async function excluirConvite(dados: PedidoConviteExcluir): Promise<{ ok: true }> {
  const convite = await conviteDe(dados.convite_id);
  if (convite.status === 'concluido') throw new ErroHttp(409, 'convite_concluido');
  await apagarConvite(convite.id);
  return { ok: true };
}

async function baixarPdf(autor: Autor, dados: PedidoPdfBaixar): Promise<RespostaPdf> {
  const aceite = await primeira<AceiteDoConvite>(
    `manual_aceites?id=eq.${dados.aceite_id}&select=id,convite_id`,
  );
  if (aceite == null) throw new ErroHttp(404, 'aceite_inexistente');
  const comprovante = await garantirPdf(aceite.id, 'equipe', autor.id);
  await registrarEvento({
    convite_id: aceite.convite_id,
    ator: 'equipe',
    ator_id: autor.id,
    tipo: 'pdf_baixado',
    detalhes: { aceite_id: aceite.id },
  });
  return { pdf_url: comprovante.url };
}

/** As duas RPC de versão. A mensagem do Postgres nunca sai daqui como está. */
async function chamarVersao(nome: string, argumentos: Record<string, unknown>): Promise<RespostaVersao> {
  try {
    const versao = await rpc<VersaoLinha>(nome, argumentos);
    return { versao_id: versao.id, numero: versao.numero };
  } catch (erro) {
    if (erro instanceof ErroDoBanco && erro.status >= 400 && erro.status < 500) {
      // 4xx do PostgREST aqui é sempre uma `raise` das funções de `manual.sql`
      // ("so rascunho se publica", "versao sem regra obrigatoria"). É regra de
      // negócio, e a equipe precisa saber qual — mas o texto vai só ao log.
      console.error('manual/admin: versao recusada', nome, erro.mensagem);
      throw new ErroHttp(409, 'versao_recusada');
    }
    throw erro;
  }
}

async function despachar(pedido: Request, autor: Autor): Promise<Response> {
  const dados = lerPedidoDaEquipe(await lerJson(pedido));
  switch (dados.acao) {
    case 'convite_criar':
      exigirPapel(autor, ['admin', 'cx']);
      return responder(await criarConvite(autor, dados, null), 201);
    case 'convite_revogar':
      exigirPapel(autor, ['admin', 'cx']);
      return responder(await revogarERelatar(autor, dados));
    case 'convite_regenerar':
      exigirPapel(autor, ['admin', 'cx']);
      return responder(await regenerar(autor, dados), 201);
    case 'convite_excluir':
      // A mesma régua de revogar: quem cria e revoga convite também tira do
      // caminho o que nunca virou aceite.
      exigirPapel(autor, ['admin', 'cx']);
      return responder(await excluirConvite(dados));
    case 'pdf_baixar':
      exigirPapel(autor, ['admin', 'cx']);
      return responder(await baixarPdf(autor, dados));
    case 'versao_rascunho':
      exigirPapel(autor, ['admin']);
      return responder(await rascunho(autor, dados), 201);
    case 'versao_publicar':
      exigirPapel(autor, ['admin']);
      return responder(await chamarVersao('manual_publicar_versao', { p_versao: dados.versao_id }));
    default:
      throw new ErroHttp(400, 'acao_invalida');
  }
}

function rascunho(autor: Autor, dados: PedidoVersaoRascunho): Promise<RespostaVersao> {
  return chamarVersao('manual_criar_rascunho', { p_origem: dados.origem_id, p_autor: autor.id });
}

/**
 * Revogar não tem resposta no contrato — e não precisa: a lista da equipe lê o
 * PostgREST direto, como a Central, e recarrega. O `{ ok: true }` é o mesmo
 * "recebi" de `api/lead.ts`.
 */
async function revogarERelatar(autor: Autor, dados: PedidoConviteRevogar): Promise<{ ok: true }> {
  await revogar(autor, dados.convite_id);
  return { ok: true };
}

export async function responderAdmin(pedido: Request): Promise<Response> {
  if (pedido.method !== 'POST') return responderErro(new ErroHttp(405, 'metodo'));
  try {
    const autor = await autorizar(pedido);
    return await despachar(pedido, autor);
  } catch (erro) {
    return responderErro(erro);
  }
}
