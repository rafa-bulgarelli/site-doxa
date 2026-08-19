/**
 * AUTENTICAÇÃO na API do Google Search Console — JWT assinado → access token.
 *
 * ─── POR QUE À MÃO, SEM SDK ──────────────────────────────────────────────────
 *
 * O fluxo inteiro de uma service account cabe em três passos que o Node 24 já
 * sabe fazer sozinho: montar um JWT, assiná-lo com `crypto.sign` (RS256) e
 * trocá-lo por um token no endpoint do Google com `fetch`. Puxar `googleapis`
 * traria ~50 MB de dependência transitiva para isso — e a torre roda estes
 * scripts fora do bundle do site, onde cada dependência nova é uma superfície
 * a mais para auditar. Zero dependência nova é decisão, não preguiça.
 *
 * ─── ONDE MORA A CHAVE, E POR QUE NÃO AQUI ───────────────────────────────────
 *
 * A chave JSON da service account é SEGREDO e vive FORA do repositório, em
 * `~/.config/doxa/gsc-service-account.json` (diretório 700, arquivo 600). O
 * `.gitignore` tem regras específicas para o nome dela como rede de segurança,
 * mas a regra de verdade é essa: o arquivo nunca entra na árvore do git.
 *
 * Env vars que este módulo lê:
 *   • `GSC_KEY_PATH`  — caminho da chave. Sem ela, o default acima.
 *   • `GSC_SITE_URL`  — (lida em `api.mjs`) força a propriedade do Search
 *                       Console, quando houver mais de uma.
 *
 * ─── A REGRA QUE NÃO SE NEGOCIA ──────────────────────────────────────────────
 *
 * Nada aqui imprime chave nem token. Nem em erro, nem em debug, nem "só desta
 * vez": um `access_token` colado num log de CI é uma credencial vazada com uma
 * hora de validade, e a `private_key` é uma credencial vazada para sempre. As
 * mensagens de erro citam CAMINHO e status HTTP — nunca conteúdo.
 */
import { readFileSync } from 'node:fs';
import { sign as assinarCrypto } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Leitura: o suficiente para `sites.list`, `sitemaps.list` e as consultas. */
export const ESCOPO_LEITURA = 'https://www.googleapis.com/auth/webmasters.readonly';

/** Escrita: só `sitemaps.submit` precisa. Pedido apenas sob `--submeter`. */
export const ESCOPO_ESCRITA = 'https://www.googleapis.com/auth/webmasters';

/** Uma hora é o teto que o Google aceita para a validade do JWT. */
const VALIDADE_EM_SEGUNDOS = 3600;

/**
 * Caminho da chave: `GSC_KEY_PATH` quando definida, senão o default.
 *
 * O `~` literal não é expandido por ninguém dentro do Node — quem escrevesse
 * `~/.config/...` criaria um diretório chamado `~` no cwd. Daí `homedir()`.
 *
 * @return {string} caminho absoluto do JSON da service account.
 */
export function caminhoDaChave() {
  const doAmbiente = process.env.GSC_KEY_PATH;
  if (typeof doAmbiente === 'string' && doAmbiente.trim() !== '') {
    return doAmbiente;
  }
  return join(homedir(), '.config', 'doxa', 'gsc-service-account.json');
}

/**
 * @typedef {object} ChaveDeServico
 * @property {string} clientEmail e-mail da service account (não é segredo).
 * @property {string} chavePrivada PEM da `private_key` — SEGREDO, nunca logar.
 * @property {string} audiencia `token_uri` da chave.
 */

/**
 * Lê e valida o JSON da service account.
 *
 * As mensagens de erro dizem o CAMINHO e o campo que falta, jamais o valor de
 * campo nenhum: quem depura precisa saber qual arquivo abrir, não o que tem
 * dentro dele.
 *
 * @param {string} [caminho] caminho do JSON; default `caminhoDaChave()`.
 * @return {ChaveDeServico}
 */
export function lerChave(caminho = caminhoDaChave()) {
  let bruto;
  try {
    bruto = readFileSync(caminho, 'utf8');
  } catch {
    throw new Error(
      `não achei a chave da service account em ${caminho}. ` +
        'Aponte `GSC_KEY_PATH` para o JSON ou mova-o para esse caminho ' +
        '(diretório 700, arquivo 600 — ele NÃO entra no repositório).',
    );
  }

  let objeto;
  try {
    objeto = JSON.parse(bruto);
  } catch {
    // Sem repassar a mensagem do JSON.parse: ela costuma vir com um trecho do
    // arquivo, e o arquivo é a chave privada.
    throw new Error(`${caminho} não é um JSON válido.`);
  }
  if (typeof objeto !== 'object' || objeto === null) {
    throw new Error(`${caminho} não é um JSON de service account (esperava um objeto).`);
  }

  const { client_email: clientEmail, private_key: chavePrivada, token_uri: audiencia } = objeto;
  for (const [campo, valor] of [
    ['client_email', clientEmail],
    ['private_key', chavePrivada],
    ['token_uri', audiencia],
  ]) {
    if (typeof valor !== 'string' || valor === '') {
      throw new Error(
        `${caminho} não tem o campo \`${campo}\`. ` +
          'Baixe de novo a chave da service account no console do GCP (tipo "JSON").',
      );
    }
  }

  return { clientEmail, chavePrivada, audiencia };
}

/**
 * base64url: o base64 do JWT, sem `=` e com o alfabeto seguro para URL.
 *
 * @param {Buffer|string} entrada
 * @return {string}
 */
export function base64url(entrada) {
  const buffer = typeof entrada === 'string' ? Buffer.from(entrada, 'utf8') : entrada;
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Monta o JWT (função PURA — não assina, não lê arquivo, não faz rede).
 *
 * Separada da assinatura de propósito: assim o teste confere as claims sem
 * chegar perto de chave nenhuma.
 *
 * @param {object} parametros
 * @param {string} parametros.clientEmail vira `iss` e `sub`.
 * @param {string} parametros.escopo `ESCOPO_LEITURA` ou `ESCOPO_ESCRITA`.
 * @param {string} parametros.audiencia `token_uri` da chave.
 * @param {number} [parametros.agora] epoch em SEGUNDOS; default, o relógio.
 * @return {{cabecalho: string, corpo: string, mensagem: string}}
 */
export function montarJwt({ clientEmail, escopo, audiencia, agora = Math.floor(Date.now() / 1000) }) {
  if (!clientEmail || !escopo || !audiencia) {
    throw new Error('montarJwt exige `clientEmail`, `escopo` e `audiencia`.');
  }
  const cabecalho = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const corpo = base64url(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      scope: escopo,
      aud: audiencia,
      iat: agora,
      exp: agora + VALIDADE_EM_SEGUNDOS,
    }),
  );
  return { cabecalho, corpo, mensagem: `${cabecalho}.${corpo}` };
}

/**
 * Assina a mensagem do JWT com a chave privada (RS256).
 *
 * @param {string} mensagem `cabecalho.corpo`.
 * @param {string} chavePrivadaPem PEM da service account — SEGREDO.
 * @return {string} assinatura em base64url.
 */
export function assinar(mensagem, chavePrivadaPem) {
  return base64url(assinarCrypto('RSA-SHA256', Buffer.from(mensagem, 'utf8'), chavePrivadaPem));
}

/**
 * Troca o JWT por um `access_token` no endpoint do Google.
 *
 * O token volta como string e é passado adiante por argumento — nunca fica em
 * variável global, nunca é impresso.
 *
 * @param {object} [parametros]
 * @param {string} [parametros.escopo] default `ESCOPO_LEITURA`.
 * @param {string} [parametros.caminho] caminho da chave.
 * @return {Promise<string>} o `access_token`.
 */
export async function obterToken({ escopo = ESCOPO_LEITURA, caminho = caminhoDaChave() } = {}) {
  const chave = lerChave(caminho);
  const { mensagem } = montarJwt({
    clientEmail: chave.clientEmail,
    escopo,
    audiencia: chave.audiencia,
  });
  const jwt = `${mensagem}.${assinar(mensagem, chave.chavePrivada)}`;

  const resposta = await fetch(chave.audiencia, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!resposta.ok) {
    // O corpo de erro do endpoint de token traz `{error, error_description}` —
    // nunca o token, nunca a assertion. É seguro mostrar, e é o único jeito de
    // distinguir "relógio fora de hora" de "API não ativada no projeto".
    const corpo = (await resposta.text()).slice(0, 300);
    throw new Error(
      `troca do JWT por token falhou (HTTP ${resposta.status}). Resposta: ${corpo}`,
    );
  }

  const dados = await resposta.json();
  if (typeof dados?.access_token !== 'string') {
    throw new Error('o endpoint de token respondeu 200 sem `access_token`.');
  }
  return dados.access_token;
}
