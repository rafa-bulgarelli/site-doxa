/**
 * A data de conteúdo, escrita por extenso.
 *
 * Sem `Date` e sem `Intl`: `new Date('2026-08-17')` é meia-noite UTC, e num
 * fuso a oeste `getDate()` devolve 16. A data aqui é uma etiqueta editorial,
 * não um instante — quebrá-la em três pedaços de string é o único jeito de ela
 * significar a mesma coisa em qualquer máquina que rode o build.
 */

const MESES: readonly string[] = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function porExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  const nome = MESES[Number(mes) - 1];
  if (ano == null || dia == null || nome == null) {
    throw new Error(`Data de conteúdo fora do formato AAAA-MM-DD: ${iso}`);
  }
  return `${Number(dia)} de ${nome} de ${ano}`;
}
