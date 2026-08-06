import type { Duvida } from './config';

/**
 * O motor do FAQ, e ele cabe em trinta linhas porque não precisa de mais.
 *
 * Não há modelo aqui, e é uma decisão e não uma limitação. Esta página vende uma
 * garantia de dinheiro de volta: um gerador solto respondendo sobre prazo,
 * escopo e reembolso acerta quase sempre e, no dia em que erra, publicou uma
 * promessa comercial que a empresa passa a dever. O que este campo faz é achar
 * qual das respostas ESCRITAS pelo dono é a pergunta que a pessoa fez — e dizer
 * que não sabe quando nenhuma é. Dizer que não sabe é a feature.
 *
 * Quando a resposta gerada valer o risco, o que muda é esta função e mais nada:
 * a conversa, o campo e o desenho continuam iguais.
 */

/**
 * Texto comparável: minúsculo, sem acento e sem pontuação.
 *
 * Sem acento porque metade das pessoas digita "preco" e "garantia" no celular
 * sem parar para achar o til, e uma busca que exige acento devolve "não sei"
 * para uma pergunta que ela tem a resposta. `NFD` separa a letra do acento em
 * dois caracteres, e a faixa `U+0300..U+036F` apaga só o acento — a letra fica.
 */
export function normaliza(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Os dois pesos, e a distância entre eles é a regra toda.
 *
 * Uma âncora vale três termos comuns porque a pergunta que mistura dois assuntos
 * tem de ir para o assunto ESPECÍFICO. "Como funciona a garantia?" traz um
 * `como funciona` da dúvida do processo e um `garantia` da dúvida da garantia; se
 * os dois valessem igual, o desempate seria a ordem do arquivo — e a pessoa
 * receberia uma resposta sobre foto e áudio para uma pergunta sobre dinheiro de
 * volta. Com três para um, quem foi específico ganha sempre.
 */
const PESO_ANCORA = 6;
const PESO_TERMO = 2;

/**
 * O mínimo para uma resposta ser dada.
 *
 * Um termo comum basta — "como funciona", sozinho, tem de achar alguma coisa. O
 * que segura o falso positivo não é o piso, é a curadoria das listas: palavra
 * que caberia em qualquer pergunta não entra em nenhuma delas.
 */
const PISO = PESO_TERMO;

/**
 * Se um termo aparece na consulta.
 *
 * Prefixo nos dois sentidos, e é o que cobre a flexão sem uma tabela de
 * conjugação: "garantias" começa com "garantia", e "garanti" (que alguém digitou
 * pela metade) é começo de "garantia". O piso de quatro letras no lado curto é o
 * que impede "co" de casar com "como", "conta" e "cobrar" ao mesmo tempo.
 *
 * Expressão de mais de uma palavra é procurada inteira, na ordem: "dinheiro de
 * volta" só conta se estiver escrito assim.
 */
function casa(texto: string, palavras: readonly string[], bruto: string) {
  const termo = normaliza(bruto);
  if (termo.includes(' ')) return texto.includes(termo);
  return palavras.some((p) => p.startsWith(termo) || (termo.startsWith(p) && p.length >= 4));
}

function pontua(consulta: string, duvida: Duvida) {
  const texto = normaliza(consulta);
  const palavras = texto.split(' ').filter(Boolean);
  let pontos = 0;

  for (const ancora of duvida.ancoras) {
    if (casa(texto, palavras, ancora)) pontos += PESO_ANCORA;
  }
  for (const termo of duvida.termos) {
    if (casa(texto, palavras, termo)) pontos += PESO_TERMO;
  }

  return pontos;
}

/**
 * A dúvida que melhor responde ao que foi digitado, ou `null`.
 *
 * `null` não é erro: é o caminho para o consultor, que é para onde a página
 * inteira aponta.
 */
export function encontra(consulta: string, duvidas: readonly Duvida[]): Duvida | null {
  let melhor: Duvida | null = null;
  let maior = 0;

  for (const duvida of duvidas) {
    const pontos = pontua(consulta, duvida);
    // `>` e não `>=`: no empate fica a primeira da lista, e a ordem de `DUVIDAS`
    // é a do dono. Empate resolvido por ordem de arquivo é previsível; resolvido
    // pela última iteração é sorte.
    if (pontos > maior) {
      maior = pontos;
      melhor = duvida;
    }
  }

  return maior >= PISO ? melhor : null;
}
