/**
 * ─── O LADO DO CLIENTE ───────────────────────────────────────────────────────
 *
 * Quatro ações, uma credencial: o token do convite, sempre no CORPO do POST.
 * Na URL ele iria para o log de acesso da Vercel e da Cloudflare — e um token
 * em log de acesso é um convite que qualquer um com acesso ao painel abre.
 *
 * Nenhuma ação aqui exige sessão, e é assim de propósito: o cliente não tem
 * conta. O que o autoriza é ter o link, e o que o limita é o ESTADO do convite,
 * conferido em toda ação (`estadoDoConvite`).
 *
 * A conclusão não confere regra nenhuma neste arquivo, e isso não é esquecimento
 * — quem confere é `manual_concluir`, dentro da transação, com a lista de
 * obrigatórias lida do banco na hora. Conferir aqui seria conferir num instante
 * e gravar noutro.
 */
import type {
  AceiteLinha,
  AceiteResumo,
  ConviteLinha,
  PedidoConcluir,
  PedidoProgresso,
  RespostaAbrir,
  RespostaBaixar,
  RespostaConcluir,
} from '../tipos';
import { ErroDoBanco, atualizar, gravarOuAtualizar, primeira, rpc } from './banco';
import { garantirPdf } from './comprovante';
import { conviteAbertoDe, estadoDoConvite } from './convite';
import { registrarEvento } from './eventos';
import { ErroHttp, lerJson, responder, responderErro } from './http';
import { lerPedidoPublico } from './pedidos';
import { hashDoToken } from './token';
import { montarVersao } from './versao';

/** A linha de `manual_progresso`. Interna: o contrato só conhece o `Progresso`. */
interface ProgressoLinha {
  convite_id: string;
  secao_ordem: number;
  regras_marcadas: string[];
  nome_informado: string | null;
}

/** Só o que a consulta pediu. Tipar como a linha inteira seria mentir sobre o `select`. */
interface NumeroDaVersao {
  numero: number;
}

interface IdDoAceite {
  id: string;
}

/** O que `manual_concluir` devolve. `ja_existia` é a idempotência declarada. */
interface ResultadoDaConclusao {
  aceite_id: string;
  aceito_em: string;
  conteudo_sha256: string;
  ja_existia: boolean;
}

/**
 * As `raise exception` de `manual_concluir` que o cliente PODE ver. Elas são a
 * explicação da tela ("seu convite expirou"), não vazamento: já dizem o que o
 * próprio `abrir` diria. Qualquer outra mensagem do Postgres vira 500 genérico.
 */
const MOTIVOS_DA_CONCLUSAO = new Set([
  'convite_inexistente',
  'convite_revogado',
  'convite_expirado',
  'declaracao_nao_confirmada',
  'nome_ausente',
  'regras_faltando',
]);

function primeiroIp(pedido: Request): string | null {
  // `x-forwarded-for` é uma CADEIA: o primeiro valor é o cliente, o resto são
  // os proxies. Guardar a cadeia inteira estouraria os 64 do banco.
  const bruto = pedido.headers.get('x-forwarded-for');
  const primeiro = bruto?.split(',')[0]?.trim() ?? '';
  return primeiro.length > 0 ? primeiro.slice(0, 64) : null;
}

function navegador(pedido: Request): string | null {
  const bruto = pedido.headers.get('user-agent')?.trim() ?? '';
  return bruto.length > 0 ? bruto.slice(0, 400) : null;
}

async function conviteDoToken(token: string): Promise<ConviteLinha | null> {
  const hash = await hashDoToken(token);
  return primeira<ConviteLinha>(`manual_convites?token_hash=eq.${hash}&select=*`);
}

async function resumoDoAceite(conviteId: string): Promise<AceiteResumo | undefined> {
  const aceite = await primeira<AceiteLinha>(
    `manual_aceites?convite_id=eq.${conviteId}&select=*`,
  );
  if (aceite == null) return undefined;
  const versao = await primeira<NumeroDaVersao>(
    `manual_versoes?id=eq.${aceite.versao_id}&select=numero`,
  );
  return {
    aceite_id: aceite.id,
    aceito_em: aceite.aceito_em,
    conteudo_sha256: aceite.conteudo_sha256,
    versao_numero: versao?.numero ?? 0,
  };
}

/** O primeiro `abrir` de um convite pendente é o "recebeu e clicou". */
async function marcarAberto(convite: ConviteLinha): Promise<void> {
  if (convite.status !== 'pendente') return;
  const agora = new Date().toISOString();
  await atualizar('manual_convites', `id=eq.${convite.id}&status=eq.pendente`, {
    status: 'aberto',
    aberto_em: agora,
  });
  await registrarEvento({ convite_id: convite.id, ator: 'cliente', tipo: 'convite_aberto' });
}

async function abrir(convite: ConviteLinha | null): Promise<RespostaAbrir> {
  if (convite == null) return { estado: 'invalido' };
  const estado = estadoDoConvite(convite, new Date());
  if (estado === 'concluido') {
    return {
      estado,
      convite: conviteAbertoDe(convite),
      aceite: await resumoDoAceite(convite.id),
      invite_plataforma: convite.invite_plataforma,
    };
  }
  if (estado !== 'valido') return { estado };

  await marcarAberto(convite);
  const versao = await montarVersao(convite.versao_id);
  const salvo = await primeira<ProgressoLinha>(
    `manual_progresso?convite_id=eq.${convite.id}&select=*`,
  );
  return {
    estado,
    convite: conviteAbertoDe(convite),
    versao,
    progresso:
      salvo == null
        ? undefined
        : {
            secao_ordem: salvo.secao_ordem,
            regras_marcadas: salvo.regras_marcadas,
            nome_informado: salvo.nome_informado,
          },
  };
}

/** Retomar pelo mesmo link. NÃO é aceite: nada aqui é conferido nem congelado. */
async function salvarProgresso(
  convite: ConviteLinha | null,
  dados: PedidoProgresso,
): Promise<{ ok: true }> {
  if (convite == null) throw new ErroHttp(404, 'convite_invalido');
  const estado = estadoDoConvite(convite, new Date());
  if (estado !== 'valido') throw new ErroHttp(409, estado);
  await gravarOuAtualizar('manual_progresso', 'convite_id', {
    convite_id: convite.id,
    secao_ordem: dados.secao_ordem,
    regras_marcadas: dados.regras_marcadas,
    nome_informado: dados.nome_informado ?? null,
    atualizado_em: new Date().toISOString(),
  });
  await registrarEvento({
    convite_id: convite.id,
    ator: 'cliente',
    tipo: 'progresso_salvo',
    detalhes: { secao_ordem: dados.secao_ordem, marcadas: dados.regras_marcadas.length },
  });
  return { ok: true };
}

async function concluirNoBanco(
  convite: ConviteLinha,
  dados: PedidoConcluir,
  pedido: Request,
): Promise<ResultadoDaConclusao> {
  try {
    return await rpc<ResultadoDaConclusao>('manual_concluir', {
      p_convite: convite.id,
      p_nome: dados.nome ?? '',
      p_regras: dados.regras_marcadas,
      p_declaracao_confirmada: dados.declaracao_confirmada,
      p_ip: primeiroIp(pedido),
      p_user_agent: navegador(pedido),
    });
  } catch (erro) {
    if (erro instanceof ErroDoBanco && MOTIVOS_DA_CONCLUSAO.has(erro.mensagem)) {
      throw new ErroHttp(409, erro.mensagem);
    }
    throw erro;
  }
}

async function concluir(
  convite: ConviteLinha | null,
  dados: PedidoConcluir,
  pedido: Request,
): Promise<RespostaConcluir> {
  if (convite == null) throw new ErroHttp(404, 'convite_invalido');
  const estado = estadoDoConvite(convite, new Date());
  // 'concluido' segue adiante de propósito: a função SQL devolve o MESMO aceite
  // com `ja_existia`, e é assim que o clique duplo não vira erro na tela.
  if (estado === 'revogado' || estado === 'expirado' || estado === 'invalido') {
    throw new ErroHttp(409, `convite_${estado}`);
  }

  const resultado = await concluirNoBanco(convite, dados, pedido);
  let url: string | null = null;
  let sha: string | null = null;
  try {
    const comprovante = await garantirPdf(resultado.aceite_id, 'cliente');
    url = comprovante.url;
    sha = comprovante.sha256;
  } catch (erro) {
    // O aceite JÁ está gravado, e nada aqui pode desfazê-lo. O contrato prevê
    // `pdf_url: null` exatamente para este instante — a ação `baixar` termina.
    console.error('manual: pdf falhou depois do aceite', resultado.aceite_id, erro);
  }
  return {
    aceite_id: resultado.aceite_id,
    aceito_em: resultado.aceito_em,
    conteudo_sha256: resultado.conteudo_sha256,
    invite_plataforma: convite.invite_plataforma,
    pdf_url: url,
    pdf_sha256: sha,
  };
}

async function baixar(convite: ConviteLinha | null): Promise<RespostaBaixar> {
  if (convite == null) throw new ErroHttp(404, 'convite_invalido');
  if (convite.status !== 'concluido') throw new ErroHttp(409, 'sem_aceite');
  const aceite = await primeira<IdDoAceite>(
    `manual_aceites?convite_id=eq.${convite.id}&select=id`,
  );
  if (aceite == null) throw new ErroHttp(404, 'sem_aceite');
  const comprovante = await garantirPdf(aceite.id, 'cliente');
  await registrarEvento({
    convite_id: convite.id,
    ator: 'cliente',
    tipo: 'pdf_baixado',
    detalhes: { aceite_id: aceite.id },
  });
  return { pdf_url: comprovante.url };
}

export async function responderPublico(pedido: Request): Promise<Response> {
  if (pedido.method !== 'POST') return responderErro(new ErroHttp(405, 'metodo'));
  try {
    const dados = lerPedidoPublico(await lerJson(pedido));
    const convite = await conviteDoToken(dados.token);
    switch (dados.acao) {
      case 'abrir':
        return responder(await abrir(convite));
      case 'progresso':
        return responder(await salvarProgresso(convite, dados));
      case 'concluir':
        return responder(await concluir(convite, dados, pedido));
      case 'baixar':
        return responder(await baixar(convite));
      default:
        throw new ErroHttp(400, 'acao_invalida');
    }
  } catch (erro) {
    return responderErro(erro);
  }
}
