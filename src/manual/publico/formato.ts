/**
 * ─── COMO O CLIENTE LÊ UMA DATA ──────────────────────────────────────────────
 *
 * O banco fala ISO com fuso; a tela fala português.
 *
 * O fuso é FIXO em São Paulo, e não o do navegador. Duas razões: o comprovante
 * precisa dizer a mesma hora que o PDF arquivado pela DOXA — dois carimbos
 * diferentes para o mesmo aceite é a pergunta que ninguém quer receber meses
 * depois —, e assim a formatação vira função pura, testável sem depender do
 * `TZ` de quem roda a suíte.
 */
const FUSO = 'America/Sao_Paulo';

function valida(iso: string): Date | undefined {
  const quando = new Date(iso);
  return Number.isNaN(quando.getTime()) ? undefined : quando;
}

/** `14/08/2026, 09:31` — o carimbo do aceite. Data inválida devolve o original. */
export function dataEHora(iso: string): string {
  const quando = valida(iso);
  if (quando == null) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(quando);
}

/** `14 de agosto de 2026` — para o prazo do convite, onde a hora não ajuda. */
export function dataLonga(iso: string): string {
  const quando = valida(iso);
  if (quando == null) return iso;
  return new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, dateStyle: 'long' }).format(quando);
}
