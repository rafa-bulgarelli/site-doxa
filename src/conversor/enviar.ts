/**
 * ─── A CONVERSA COM A API DO CONVERSOR ───────────────────────────────────────
 *
 * A única peça da página que fala com a rede. Ela recebe o arquivo que a pessoa
 * escolheu e devolve o documento convertido — ou um `CodigoDeErro` do contrato,
 * nunca uma exceção: a tela precisa decidir entre "mostre a mensagem" e "volte
 * ao portão" sem ler string de `catch`.
 *
 * ─── POR QUE A VALIDAÇÃO ACONTECE DUAS VEZES ─────────────────────────────────
 *
 * Extensão, MIME e tamanho são conferidos AQUI, antes do `fetch`, e de novo no
 * servidor. Não é desconfiança do servidor nem redundância: subir 4 MB por uma
 * rede de celular para receber um "tipo não aceito" gasta o tempo e o dado de
 * quem já podia ter sido avisado no mesmo segundo do clique. A checagem do
 * navegador é uma GENTILEZA — quem garante é a de lá, porque esta roda numa
 * máquina que não é nossa.
 *
 * O erro local usa os MESMOS códigos do contrato de propósito: a tela tem uma
 * frase por código, e ela não deve precisar saber se a recusa veio de perto ou
 * de longe.
 */
import {
  CAMPO_ARQUIVO,
  EXTENSAO_DOCX,
  EXTENSAO_PDF,
  EXTENSOES_ACEITAS,
  MIME_DOCX,
  MIME_PDF,
  TAMANHO_MAXIMO_BYTES,
} from './config';
import { tokenGuardado } from '../leads/dados/supabase';
import type { CodigoDeErro } from './tipos';

/** O endereço da rota do contrato. Relativo: mesma origem, sem CORS. */
export const CAMINHO_DA_API = '/api/conversor';

/** O documento que voltou, pronto para virar um download. */
export interface ConversaoPronta {
  blob: Blob;
  /** O nome com que o arquivo desce na máquina de quem pediu. */
  nomeSugerido: string;
}

export type ResultadoDaConversao =
  | { ok: true; conversao: ConversaoPronta }
  | { ok: false; erro: CodigoDeErro };

/** O vocabulário fechado do contrato, em forma de lista para conferir na mão. */
const CODIGOS: readonly CodigoDeErro[] = [
  'sem_sessao',
  'sessao_invalida',
  'tipo_nao_aceito',
  'arquivo_grande',
  'conversao_falhou',
  'conversao_demorou',
  'provedor_indisponivel',
];

/** O MIME que cada extensão deveria trazer, quando o navegador sabe dizer. */
const MIME_DA_EXTENSAO: Record<string, string> = {
  [EXTENSAO_PDF]: MIME_PDF,
  [EXTENSAO_DOCX]: MIME_DOCX,
};

/**
 * Os tipos que significam "não faço ideia".
 *
 * Em algumas máquinas o `.docx` chega como `application/octet-stream` e o PDF
 * chega sem tipo nenhum. Recusar por causa disso seria negar um arquivo
 * perfeitamente válido — quando o navegador não sabe, quem manda é a extensão.
 */
const MIMES_VAGOS: readonly string[] = ['', 'application/octet-stream'];

function extensaoDe(nome: string): string {
  const ponto = nome.lastIndexOf('.');
  return ponto === -1 ? '' : nome.slice(ponto).toLowerCase();
}

/**
 * O nome do arquivo que desce: o original com a extensão trocada.
 *
 * `contrato.pdf` sobe e `contrato.docx` desce. A pessoa reconhece o próprio
 * documento na pasta de downloads sem abrir nenhum dos dois.
 */
export function nomeConvertido(nomeOriginal: string): string {
  const extensao = extensaoDe(nomeOriginal);
  const destino = extensao === EXTENSAO_PDF ? EXTENSAO_DOCX : EXTENSAO_PDF;
  return `${nomeOriginal.slice(0, nomeOriginal.length - extensao.length)}${destino}`;
}

/** A recusa local, no mesmo vocabulário da recusa do servidor. */
function recusaLocal(arquivo: File): CodigoDeErro | undefined {
  const extensao = extensaoDe(arquivo.name);
  if (!EXTENSOES_ACEITAS.includes(extensao)) return 'tipo_nao_aceito';

  const tipo = arquivo.type.toLowerCase();
  if (!MIMES_VAGOS.includes(tipo) && tipo !== MIME_DA_EXTENSAO[extensao]) {
    // Extensão de documento com MIME de outra coisa: um `.pdf` renomeado a
    // partir de uma imagem chega assim, e o provedor o recusaria lá na frente.
    return 'tipo_nao_aceito';
  }

  if (arquivo.size > TAMANHO_MAXIMO_BYTES) return 'arquivo_grande';
  return undefined;
}

function ehCodigo(valor: string): valor is CodigoDeErro {
  // `some` com `===` e não `includes`: a lista é de `CodigoDeErro` (é ela que
  // acusa um código fora do contrato), e `includes` exigiria um `as` só para
  // comparar com o texto que chegou da rede.
  return CODIGOS.some((codigo) => codigo === valor);
}

/**
 * Lê `{ erro }` sem confiar no corpo.
 *
 * Erro de servidor chega vazio, em HTML de gateway ou truncado com a mesma
 * frequência com que chega no formato combinado — e um `JSON.parse` que lança
 * aqui apagaria o status, que é a informação que sobrou.
 */
async function codigoDoCorpo(resposta: Response): Promise<CodigoDeErro | undefined> {
  try {
    const corpo: unknown = await resposta.json();
    if (typeof corpo !== 'object' || corpo === null || !('erro' in corpo)) return undefined;
    const { erro } = corpo;
    return typeof erro === 'string' && ehCodigo(erro) ? erro : undefined;
  } catch {
    // Corpo ilegível não é novidade nem erro nosso: o status decide sozinho.
    return undefined;
  }
}

/** O código que o status sozinho já entrega, quando o corpo não ajuda. */
function codigoDoStatus(status: number): CodigoDeErro {
  switch (status) {
    case 401:
      return 'sem_sessao';
    case 413:
      return 'arquivo_grande';
    case 415:
      return 'tipo_nao_aceito';
    case 504:
      return 'conversao_demorou';
    default:
      return 'conversao_falhou';
  }
}

/**
 * O nome que o servidor sugeriu, quando ele sugeriu um utilizável.
 *
 * Só passa nome sem caminho e com extensão do contrato: `Content-Disposition` é
 * texto de uma resposta, e um `../` ou um `.exe` vindos dali iriam direto para
 * o atributo `download` de uma âncora.
 */
function nomeDoCabecalho(resposta: Response): string | undefined {
  const bruto = resposta.headers.get('Content-Disposition');
  if (bruto == null) return undefined;

  const comCodificacao = /filename\*=UTF-8''([^;]+)/i.exec(bruto);
  const simples = /filename="?([^";]+)"?/i.exec(bruto);
  let nome: string | undefined;
  if (comCodificacao !== null) {
    try {
      nome = decodeURIComponent(comCodificacao[1]);
    } catch {
      // Percentagem malformada: o nome local resolve, e é melhor que um erro.
      nome = undefined;
    }
  } else if (simples !== null) {
    nome = simples[1];
  }
  if (nome == null) return undefined;

  const semCaminho = nome.split(/[/\\]/).pop()?.trim() ?? '';
  const aceito = EXTENSOES_ACEITAS.includes(extensaoDe(semCaminho));
  return aceito ? semCaminho : undefined;
}

/**
 * Sobe o arquivo e devolve o documento convertido.
 *
 * A direção (PDF→Word ou Word→PDF) NÃO viaja: ela sai do tipo do que subiu, e
 * quem decide é o servidor — mandá-la daqui seria uma segunda fonte da mesma
 * verdade, livre para discordar da primeira.
 */
export async function enviar(arquivo: File): Promise<ResultadoDaConversao> {
  const recusa = recusaLocal(arquivo);
  // O arquivo vem antes da sessão de propósito: um `.png` escolhido por engano
  // é sobre o que a pessoa acabou de fazer, e mandá-la ao portão por causa
  // disso esconderia o erro de verdade atrás de um pedido de senha.
  if (recusa !== undefined) return { ok: false, erro: recusa };

  const token = tokenGuardado();
  if (token == null) return { ok: false, erro: 'sem_sessao' };

  const corpo = new FormData();
  corpo.append(CAMPO_ARQUIVO, arquivo);

  let resposta: Response;
  try {
    resposta = await fetch(CAMINHO_DA_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: corpo,
    });
  } catch {
    // A rede que caiu foi a daqui, mas para quem lê o efeito é o mesmo do
    // provedor fora do ar: não foi possível falar com quem converte.
    return { ok: false, erro: 'provedor_indisponivel' };
  }

  if (!resposta.ok) {
    const doCorpo = await codigoDoCorpo(resposta);
    return { ok: false, erro: doCorpo ?? codigoDoStatus(resposta.status) };
  }

  const blob = await resposta.blob();
  return {
    ok: true,
    conversao: { blob, nomeSugerido: nomeDoCabecalho(resposta) ?? nomeConvertido(arquivo.name) },
  };
}
