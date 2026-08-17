#!/usr/bin/env node
/**
 * ─── A PROVA DE FIDELIDADE DO PROVEDOR ───────────────────────────────────────
 *
 * Antes de escrever uma linha de integração, uma pergunta precisa de resposta
 * medida: o provedor devolve o MESMO documento em Word, ou devolve um texto
 * corrido com a diagramação perdida? O caso de uso do dono são CONTRATOS — uma
 * cláusula que troca de página, uma tabela que vira parágrafo, e a ferramenta
 * não serve para nada.
 *
 * Este script roda o ciclo inteiro da Adobe PDF Services (token → asset →
 * upload → exportpdf → poll → download → limpeza) contra um PDF de verdade e
 * grava o `.docx` ao lado dele, para inspeção humana. É ferramenta de bancada,
 * não código de produção: nada em `src/` ou `api/` importa daqui.
 *
 * `.mjs` de propósito — fica FORA do `tsc -b` e usa o `fetch` nativo do Node 20,
 * sem dependência nova no `package.json` por causa de um teste manual.
 *
 * PRIVACIDADE: o documento de prova é um contrato real, com dados pessoais.
 * Este script NUNCA imprime conteúdo, nem o NOME do arquivo — só fatos
 * estruturais (bytes, tempo, status), porque a saída daqui é colada em report.
 * O asset é apagado do provedor ao final, mesmo quando a conversão falha.
 *
 * Uso:
 *   ADOBE_CLIENT_ID=... ADOBE_CLIENT_SECRET=... \
 *     node scripts/conversor-prova.mjs caminho/do/contrato.pdf
 */
import { readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';

const BASE = 'https://pdf-services.adobe.io';
const MIME_PDF = 'application/pdf';

/** Intervalo entre duas perguntas de "já terminou?" ao provedor. */
const ESPERA_MS = 1500;

/** Teto da paciência. Oito páginas levam segundos; minutos aqui é defeito. */
const LIMITE_MS = 180_000;

const USO = [
  'Uso: node scripts/conversor-prova.mjs <arquivo.pdf>',
  '',
  '  Converte o PDF em .docx pela Adobe PDF Services e grava a saída ao lado',
  '  do original, com o mesmo nome. Imprime só fatos estruturais.',
  '',
  '  Ambiente (obrigatório): ADOBE_CLIENT_ID, ADOBE_CLIENT_SECRET',
].join('\n');

/**
 * O corpo de uma resposta que deu errado, curto e sem conteúdo de documento.
 *
 * A Adobe responde erro em JSON descritivo; o corte em 200 caracteres é o
 * seguro contra despejar qualquer coisa maior no terminal.
 */
async function motivo(resposta) {
  const texto = await resposta.text().catch(() => '');
  return texto.slice(0, 200);
}

async function exigirOk(resposta, passo) {
  if (resposta.ok) return;
  throw new Error(`${passo}: HTTP ${resposta.status} — ${await motivo(resposta)}`);
}

/** O token de acesso, que vale por horas e é pedido uma vez por execução. */
async function pegarToken(clientId, clientSecret) {
  const resposta = await fetch(`${BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
  });
  await exigirOk(resposta, 'token');
  const dados = await resposta.json();
  if (typeof dados.access_token !== 'string') {
    throw new Error(`token: resposta sem access_token (campos: ${Object.keys(dados).join(', ')})`);
  }
  return dados.access_token;
}

function cabecalhos(auth) {
  return { Authorization: `Bearer ${auth.token}`, 'x-api-key': auth.clientId };
}

/**
 * Sobe os bytes e devolve o `assetID`.
 *
 * São dois pedidos e não um: o primeiro pede uma URL de upload assinada, o
 * segundo põe os bytes nela — os bytes nunca passam pelo endpoint da API.
 */
async function subirAsset(auth, bytes) {
  const criado = await fetch(`${BASE}/assets`, {
    method: 'POST',
    headers: { ...cabecalhos(auth), 'Content-Type': 'application/json' },
    body: JSON.stringify({ mediaType: MIME_PDF }),
  });
  await exigirOk(criado, 'assets');
  const dados = await criado.json();
  if (typeof dados.uploadUri !== 'string' || typeof dados.assetID !== 'string') {
    throw new Error(`assets: resposta inesperada (campos: ${Object.keys(dados).join(', ')})`);
  }
  const enviado = await fetch(dados.uploadUri, {
    method: 'PUT',
    headers: { 'Content-Type': MIME_PDF },
    body: bytes,
  });
  await exigirOk(enviado, 'upload');
  return dados.assetID;
}

/** Pede a conversão. A resposta é 201 e o trabalho fica no header `location`. */
async function pedirExportacao(auth, assetID) {
  const resposta = await fetch(`${BASE}/operation/exportpdf`, {
    method: 'POST',
    headers: { ...cabecalhos(auth), 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetID, targetFormat: 'docx' }),
  });
  await exigirOk(resposta, 'exportpdf');
  const local = resposta.headers.get('location');
  if (local == null) throw new Error('exportpdf: 2xx sem header location');
  return local;
}

const dormir = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

/** Pergunta "já terminou?" até terminar, falhar ou estourar o limite. */
async function esperarFim(auth, local) {
  const comeco = Date.now();
  while (Date.now() - comeco < LIMITE_MS) {
    const resposta = await fetch(local, { headers: cabecalhos(auth) });
    await exigirOk(resposta, 'poll');
    const dados = await resposta.json();
    const status = String(dados.status ?? '').toLowerCase();
    if (status === 'done') {
      const uri = dados.asset?.downloadUri;
      if (typeof uri !== 'string') {
        throw new Error(`poll: done sem downloadUri (campos: ${Object.keys(dados).join(', ')})`);
      }
      return uri;
    }
    if (status === 'failed') {
      throw new Error(`poll: o provedor recusou o documento (status ${status})`);
    }
    await dormir(ESPERA_MS);
  }
  throw new Error(`poll: passou de ${LIMITE_MS / 1000}s sem terminar`);
}

/** A URL de download já vem assinada — mandar o Bearer nela é o que a quebra. */
async function baixar(uri) {
  const resposta = await fetch(uri);
  await exigirOk(resposta, 'download');
  return Buffer.from(await resposta.arrayBuffer());
}

/**
 * Apaga o asset do provedor. É contrato com dados pessoais: o arquivo não fica
 * hospedado num terceiro depois que a prova terminou.
 */
async function apagarAsset(auth, assetID) {
  const resposta = await fetch(`${BASE}/assets/${assetID}`, {
    method: 'DELETE',
    headers: cabecalhos(auth),
  });
  return resposta.status;
}

function lerAmbiente() {
  const clientId = process.env.ADOBE_CLIENT_ID;
  const clientSecret = process.env.ADOBE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      [
        'faltam credenciais: exporte ADOBE_CLIENT_ID e ADOBE_CLIENT_SECRET',
        '(painel da Adobe Developer Console, projeto de PDF Services) e rode de novo.',
      ].join(' '),
    );
  }
  return { clientId, clientSecret };
}

async function main() {
  const argumentos = process.argv.slice(2);
  if (argumentos.includes('--help') || argumentos.includes('-h')) {
    console.log(USO);
    return;
  }
  const caminho = argumentos[0];
  if (caminho == null) {
    console.error(USO);
    process.exitCode = 1;
    return;
  }
  if (extname(caminho).toLowerCase() !== '.pdf') {
    throw new Error('a entrada precisa ser um .pdf — esta prova mede PDF → Word');
  }

  const { clientId, clientSecret } = lerAmbiente();
  // O ENOENT cru ecoaria o caminho digitado — e o caminho carrega o nome do
  // contrato, que esta saída não pode imprimir (ela é colada em report).
  let entrada;
  try {
    entrada = await readFile(caminho);
  } catch {
    throw new Error('nao consegui ler o arquivo do caminho informado — confira o caminho e tente de novo');
  }
  console.log(`entrada: ${entrada.byteLength} bytes`);

  const comeco = Date.now();
  const auth = { token: await pegarToken(clientId, clientSecret), clientId };
  console.log(`token: ok (${Date.now() - comeco} ms)`);

  const assetID = await subirAsset(auth, entrada);
  console.log(`upload: ok (${Date.now() - comeco} ms)`);
  try {
    const local = await pedirExportacao(auth, assetID);
    const uri = await esperarFim(auth, local);
    const saida = await baixar(uri);
    // O nome do arquivo NÃO é impresso: ele identifica a pessoa do contrato.
    const destino = join(dirname(caminho), `${basename(caminho, extname(caminho))}.docx`);
    await writeFile(destino, saida);
    console.log(`saida: ${saida.byteLength} bytes`);
    console.log(`tempo total: ${Date.now() - comeco} ms`);
    console.log('gravado ao lado do original, mesmo nome, extensao .docx');
  } finally {
    // A limpeza não pode ENGOLIR o erro da conversão: um throw aqui dentro
    // substituiria o diagnóstico real pelo da rede.
    try {
      console.log(`limpeza: HTTP ${await apagarAsset(auth, assetID)}`);
    } catch {
      console.log('limpeza: falhou (rede) — o asset expira sozinho no provedor');
    }
  }
}

main().catch((erro) => {
  console.error(`falhou — ${erro instanceof Error ? erro.message : String(erro)}`);
  process.exitCode = 1;
});
