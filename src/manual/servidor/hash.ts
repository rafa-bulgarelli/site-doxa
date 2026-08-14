/**
 * SHA-256 em hexadecimal, o único formato de hash que este módulo conhece — é o
 * que o banco espera em `token_hash`, `conteudo_sha256` e `pdf_sha256`, todos
 * com `check (length(...) = 64)`.
 */

/**
 * Aceita texto (codificado em UTF-8) ou os bytes já prontos.
 *
 * `Uint8Array<ArrayBuffer>` e não `Uint8Array` porque `crypto.subtle` recusa um
 * buffer que POSSA ser compartilhado — e o `Uint8Array` genérico admite
 * `SharedArrayBuffer` no tipo. Quem tem bytes de outra origem copia antes.
 */
export async function sha256Hex(dados: string | Uint8Array<ArrayBuffer>): Promise<string> {
  const bytes = typeof dados === 'string' ? new TextEncoder().encode(dados) : dados;
  const digerido = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digerido))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
