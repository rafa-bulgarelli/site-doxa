/**
 * ─── AS RÉGUAS DE ENTRADA ────────────────────────────────────────────────────
 *
 * O que chega de fora é texto até que se prove o contrário. Aqui mora a prova.
 *
 * O `ehUuid` não é frescura de tipagem: todo identificador que vem do cliente
 * acaba dentro de um filtro do PostgREST (`id=eq.<valor>`), e um valor com
 * vírgula ou parêntese ali muda a CONSULTA, não só o resultado. Validar o
 * formato antes de interpolar é o que fecha essa porta.
 */
import { ErroHttp } from './http';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** O mesmo formato do `check` de e-mail em `manual_convites`. */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const HEX_64 = /^[0-9a-f]{64}$/;

export function ehUuid(valor: unknown): valor is string {
  return typeof valor === 'string' && UUID.test(valor);
}

export function ehHex64(valor: unknown): valor is string {
  return typeof valor === 'string' && HEX_64.test(valor);
}

export function exigirUuid(valor: unknown, campo: string): string {
  if (!ehUuid(valor)) throw new ErroHttp(400, 'campo_invalido', `${campo} nao e uuid`);
  return valor;
}

export function exigirTexto(valor: unknown, campo: string, minimo: number, maximo: number): string {
  if (typeof valor !== 'string') throw new ErroHttp(400, 'campo_invalido', `${campo} nao e texto`);
  const limpo = valor.trim();
  if (limpo.length < minimo || limpo.length > maximo) {
    throw new ErroHttp(400, 'campo_invalido', `${campo} fora de ${minimo}..${maximo}`);
  }
  return limpo;
}

/**
 * Ausente e vazio são a mesma coisa aqui: `undefined`. Presente, porém, segue
 * a régua do banco (`between 2 and 160` nos checks de nome): deixar "A" passar
 * daqui só trocaria este 400 explicável por um 500 do Postgres.
 */
export function textoOpcional(valor: unknown, campo: string, maximo: number): string | undefined {
  if (valor == null) return undefined;
  const limpo = exigirTexto(valor, campo, 0, maximo);
  if (limpo.length === 0) return undefined;
  if (limpo.length < 2) throw new ErroHttp(400, 'campo_invalido', `${campo} fora de 2..${maximo}`);
  return limpo;
}

export function exigirEmail(valor: unknown, campo: string): string {
  const texto = exigirTexto(valor, campo, 5, 160);
  if (!EMAIL.test(texto)) throw new ErroHttp(400, 'campo_invalido', `${campo} nao e email`);
  return texto.toLowerCase();
}

export function exigirInteiro(valor: unknown, campo: string, minimo: number, maximo: number): number {
  if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < minimo || valor > maximo) {
    throw new ErroHttp(400, 'campo_invalido', `${campo} nao e inteiro em ${minimo}..${maximo}`);
  }
  return valor;
}

export function exigirBooleano(valor: unknown, campo: string): boolean {
  if (typeof valor !== 'boolean') throw new ErroHttp(400, 'campo_invalido', `${campo} nao e booleano`);
  return valor;
}

/** Uma data ISO que o Postgres aceite — e que não seja `Invalid Date`. */
export function dataOpcional(valor: unknown, campo: string): string | undefined {
  if (valor == null) return undefined;
  if (typeof valor !== 'string') throw new ErroHttp(400, 'campo_invalido', `${campo} nao e data`);
  const quando = new Date(valor);
  if (Number.isNaN(quando.getTime())) {
    throw new ErroHttp(400, 'campo_invalido', `${campo} nao e data`);
  }
  return quando.toISOString();
}

/**
 * A lista de regras marcadas. O teto não é estético: sem ele, um corpo com
 * cem mil "uuid" viraria um `in.(...)` gigante e um insulto ao banco.
 */
export function exigirUuids(valor: unknown, campo: string, maximo: number): string[] {
  if (!Array.isArray(valor)) throw new ErroHttp(400, 'campo_invalido', `${campo} nao e lista`);
  if (valor.length > maximo) throw new ErroHttp(400, 'campo_invalido', `${campo} longa demais`);
  const vistos = new Set<string>();
  for (const item of valor) {
    if (!ehUuid(item)) throw new ErroHttp(400, 'campo_invalido', `${campo} tem item que nao e uuid`);
    vistos.add(item);
  }
  return Array.from(vistos);
}

/** O corpo do POST precisa ser um objeto — lista e número não são pedido. */
export function objetoDe(valor: unknown): Record<string, unknown> {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    throw new ErroHttp(400, 'pedido_invalido');
  }
  // safe: os três checks acima já garantiram objeto não-nulo e não-lista.
  return valor as Record<string, unknown>;
}
