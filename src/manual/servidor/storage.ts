/**
 * ─── O BUCKET DOS COMPROVANTES ───────────────────────────────────────────────
 *
 * `manual-pdfs` é PRIVADO e não tem uma política em `storage.objects` — nem a
 * conta do time lê por URL direta. Todo download do mundo sai daqui, como URL
 * assinada de minutos.
 *
 * O prazo curto é o ponto: um link de comprovante que valesse para sempre
 * viraria o próprio arquivo público no instante em que alguém o encaminhasse.
 */
import { BUCKET_PDFS } from '../config';
import { ambiente } from './banco';
import { ErroHttp } from './http';

/** Tempo de vida da URL assinada. Dá para clicar e baixar; não dá para colecionar. */
export const SEGUNDOS_DA_URL = 10 * 60;

function cabecalhos(): Record<string, string> {
  const { servico } = ambiente();
  return { apikey: servico, Authorization: `Bearer ${servico}` };
}

/** O caminho do comprovante de um aceite. Um aceite, um arquivo, para sempre. */
export function caminhoDoPdf(aceiteId: string): string {
  return `aceites/${aceiteId}.pdf`;
}

export async function subirPdf(caminho: string, bytes: Uint8Array<ArrayBuffer>): Promise<void> {
  const { url } = ambiente();
  const resposta = await fetch(`${url}/storage/v1/object/${BUCKET_PDFS}/${caminho}`, {
    method: 'POST',
    headers: {
      ...cabecalhos(),
      'Content-Type': 'application/pdf',
      // Regerar o mesmo aceite tem de sobrescrever: o conteúdo sai do snapshot
      // e é sempre o mesmo arquivo, então recusar por "já existe" só deixaria
      // uma retentativa presa para sempre.
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!resposta.ok) {
    console.error('manual/storage: upload recusado', resposta.status, await resposta.text());
    throw new ErroHttp(502, 'pdf_nao_subiu');
  }
}

export async function urlAssinada(caminho: string, segundos = SEGUNDOS_DA_URL): Promise<string> {
  const { url } = ambiente();
  const resposta = await fetch(`${url}/storage/v1/object/sign/${BUCKET_PDFS}/${caminho}`, {
    method: 'POST',
    headers: { ...cabecalhos(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: segundos }),
  });
  if (!resposta.ok) {
    console.error('manual/storage: assinatura recusada', resposta.status, await resposta.text());
    throw new ErroHttp(502, 'pdf_sem_url');
  }
  const dados = (await resposta.json()) as { signedURL?: unknown; signedUrl?: unknown };
  // A API do Storage já respondeu `signedURL` e `signedUrl` em versões
  // diferentes; aceitar as duas custa uma linha e evita um dia perdido.
  const assinada = typeof dados.signedURL === 'string' ? dados.signedURL : dados.signedUrl;
  if (typeof assinada !== 'string' || assinada.length === 0) {
    throw new ErroHttp(502, 'pdf_sem_url', 'resposta de assinatura sem signedURL');
  }
  const relativa = assinada.startsWith('/') ? assinada : `/${assinada}`;
  return `${url}/storage/v1${relativa}`;
}
