/**
 * ─── O TOKEN DO CONVITE ──────────────────────────────────────────────────────
 *
 * O token é a credencial do cliente: quem tem o link entra, e não existe senha
 * nem cadastro. Duas consequências desenham este arquivo.
 *
 * A primeira: ele precisa ser IMPOSSÍVEL de adivinhar. São 32 bytes de
 * `crypto.getRandomValues` — 256 bits, a mesma ordem de grandeza de uma chave
 * de criptografia. Um contador, um timestamp ou um `Math.random` aqui seriam um
 * convite para varrer a base de convites alheios.
 *
 * A segunda: ele NUNCA é gravado. O banco guarda só o SHA-256 em hexadecimal
 * (`manual_convites.token_hash`), e é por ele que se busca. Quem vazar o dump
 * do banco não abre convite nenhum — tem o hash, e hash não volta.
 *
 * base64url (e não base64) porque o token vive dentro de uma URL: `+` e `/`
 * teriam de ser escapados, e `=` de preenchimento vira ruído no link que o CX
 * cola no WhatsApp.
 */
import { sha256Hex } from './hash';

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BYTES_DO_TOKEN = 32;

/** 32 bytes viram 43 caracteres — sem preenchimento, sem caractere a escapar. */
function base64url(bytes: Uint8Array): string {
  let saida = '';
  const total = bytes.length;
  for (let i = 0; i < total; i += 3) {
    const restam = total - i;
    const a = bytes[i];
    const b = restam > 1 ? bytes[i + 1] : 0;
    const c = restam > 2 ? bytes[i + 2] : 0;
    saida += ALFABETO[a >> 2];
    saida += ALFABETO[((a & 0x03) << 4) | (b >> 4)];
    if (restam > 1) saida += ALFABETO[((b & 0x0f) << 2) | (c >> 6)];
    if (restam > 2) saida += ALFABETO[c & 0x3f];
  }
  return saida;
}

export function gerarToken(): string {
  const bytes = new Uint8Array(BYTES_DO_TOKEN);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

/** O que vai para `token_hash`. O token cru não passa daqui para dentro. */
export function hashDoToken(token: string): Promise<string> {
  return sha256Hex(token);
}

/**
 * Descarta o que nem parece token antes de gastar um SHA-256 e uma ida ao
 * banco. O teto de 200 é folga: nenhum token nosso passa de 43.
 */
export function pareceToken(valor: unknown): valor is string {
  return typeof valor === 'string' && /^[A-Za-z0-9_-]{22,200}$/.test(valor);
}
