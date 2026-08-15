/**
 * ─── O CONTRATO DAS CENAS ────────────────────────────────────────────────────
 *
 * Cada capítulo do manual tem uma cena — a ilustração animada que explica
 * fazendo, antes de o texto falar. O fluxo público NÃO conhece cena nenhuma
 * pelo nome: ele pergunta `cenaDaSecao(slug)` e renderiza o que vier, então
 * capítulo sem cena (o caso de toda versão antiga do manual) simplesmente não
 * tem ilustração, sem erro e sem buraco.
 *
 * Os slugs são os do seed v2 (`supabase/manual-seed-v2.sql`) — o banco é quem
 * manda no vocabulário, e a seção `termos` fica de fora de propósito: termos
 * de uso são documento, não capítulo.
 *
 * Toda cena é decorativa por definição (`aria-hidden` no seu raiz): o conteúdo
 * que o leitor de tela precisa está no texto do capítulo, não no desenho.
 */
import type { ComponentType } from 'react';
import CenaOnboarding from './CenaOnboarding';
import CenaVoz from './CenaVoz';
import CenaClone from './CenaClone';
import CenaGarantia from './CenaGarantia';

/** Uma cena não recebe nada: ela conta a própria história em loop discreto. */
export type Cena = ComponentType;

const CENAS: Record<string, Cena> = {
  onboarding: CenaOnboarding,
  voz: CenaVoz,
  clone: CenaClone,
  garantia: CenaGarantia,
};

export function cenaDaSecao(slug: string): Cena | null {
  return CENAS[slug] ?? null;
}
