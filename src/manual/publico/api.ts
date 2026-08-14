/**
 * ─── A CONVERSA COM A API ────────────────────────────────────────────────────
 *
 * Uma função por ação de `PedidoPublico`, todas no MESMO endpoint e todas em
 * POST com o token no CORPO: URL vai para log de servidor, corpo não — e o
 * token deste link é a credencial inteira do cliente.
 *
 * Nada aqui lança para o caminho normal. Falha esperada volta como
 * `{ ok: false, falha }` com a mensagem já em português, porque a tela precisa
 * decidir entre "tentar de novo" e "chame o CX" sem ler string de exceção.
 *
 * O texto do erro do servidor (`RespostaErro.erro`) NÃO vai para a tela. Ele é
 * motivo técnico, escrito para o log; o cliente lê a frase daqui, que fala a
 * língua dele. O motivo viaja no objeto para quem estiver depurando.
 */
import type {
  PedidoPublico,
  RespostaAbrir,
  RespostaBaixar,
  RespostaConcluir,
  RespostaErro,
} from '../tipos';

/** O único endereço do fluxo público. */
export const CAMINHO_DA_API = '/api/manual/publico';

export interface FalhaDaApi {
  /** Pronta para a tela, em português. */
  mensagem: string;
  /** `true` quando insistir tem chance real: rede caiu, servidor tropeçou. */
  recuperavel: boolean;
  /** O motivo técnico, para log. Nunca renderizado. */
  motivo?: string;
}

export type Resultado<T> =
  | { ok: true; dados: T }
  | { ok: false; falha: FalhaDaApi };

const SEM_REDE = 'Não conseguimos falar com o servidor. Verifique sua conexão.';
const SERVIDOR_RUIM = 'O servidor teve um problema agora. Tente de novo em instantes.';
const PEDIDO_RUIM = 'Este link não pôde ser lido. Peça um link novo para quem te enviou.';

/** Lê `{ erro }` sem confiar: corpo de erro pode vir vazio, HTML ou truncado. */
async function motivoDoCorpo(resposta: Response): Promise<string | undefined> {
  try {
    const corpo = (await resposta.json()) as Partial<RespostaErro>;
    return typeof corpo.erro === 'string' ? corpo.erro : undefined;
  } catch {
    // Corpo ilegível não é novidade nem erro nosso — o status já disse o que importa.
    return undefined;
  }
}

async function enviar<T>(pedido: PedidoPublico): Promise<Resultado<T>> {
  let resposta: Response;
  try {
    resposta = await fetch(CAMINHO_DA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
  } catch {
    return { ok: false, falha: { mensagem: SEM_REDE, recuperavel: true } };
  }

  if (!resposta.ok) {
    const motivo = await motivoDoCorpo(resposta);
    // 5xx e 429 passam; 4xx é o link ou o pedido, e insistir só repete o erro.
    const recuperavel = resposta.status >= 500 || resposta.status === 429;
    return {
      ok: false,
      falha: {
        mensagem: recuperavel ? SERVIDOR_RUIM : PEDIDO_RUIM,
        recuperavel,
        motivo: motivo ?? `http ${resposta.status}`,
      },
    };
  }

  // 204 é sucesso SEM corpo — pedir `json()` de um corpo vazio explodiria, e o
  // progresso, que não tem resposta para ler, é o caso natural disso.
  if (resposta.status === 204) return { ok: true, dados: {} as T };

  try {
    // safe: o endpoint é nosso e o corpo de sucesso é o do contrato em `tipos.ts`.
    const dados = (await resposta.json()) as T;
    return { ok: true, dados };
  } catch {
    return { ok: false, falha: { mensagem: SERVIDOR_RUIM, recuperavel: true, motivo: 'json' } };
  }
}

/** Abre o link: diz o estado do convite e, quando vale, traz o manual inteiro. */
export function abrirConvite(token: string): Promise<Resultado<RespostaAbrir>> {
  return enviar<RespostaAbrir>({ acao: 'abrir', token });
}

/**
 * Guarda onde o cliente parou.
 *
 * Quem chama IGNORA a falha de propósito: progresso é conforto entre visitas,
 * e travar a leitura do manual porque um `POST` de conveniência não subiu seria
 * punir o cliente por um problema que não é dele.
 */
export function salvarProgresso(
  pedido: Extract<PedidoPublico, { acao: 'progresso' }>,
): Promise<Resultado<Record<string, never>>> {
  return enviar<Record<string, never>>(pedido);
}

/** O aceite. A única chamada daqui que grava linha imutável. */
export function concluirAceite(
  pedido: Extract<PedidoPublico, { acao: 'concluir' }>,
): Promise<Resultado<RespostaConcluir>> {
  return enviar<RespostaConcluir>(pedido);
}

/** Uma URL assinada nova para o PDF — as anteriores duram minutos. */
export function pedirPdf(token: string): Promise<Resultado<RespostaBaixar>> {
  return enviar<RespostaBaixar>({ acao: 'baixar', token });
}
