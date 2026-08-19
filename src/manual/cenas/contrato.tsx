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
import Meta from './itens/Meta';
import Sessenta from './itens/Sessenta';
import Relogio from './itens/Relogio';
import Semana from './itens/Semana';
import Intacto from './itens/Intacto';
import SemImpulso from './itens/SemImpulso';
import SemCompra from './itens/SemCompra';
import PergunteAntes from './itens/PergunteAntes';
import Redes from './passos/Redes';
import Contexto from './passos/Contexto';
import UmCanal from './passos/UmCanal';
import Silencio from './passos/Silencio';
import FalaNatural from './passos/FalaNatural';
import Gravador from './passos/Gravador';
import MesmoEquipamento from './passos/MesmoEquipamento';
import FotoNitida from './passos/FotoNitida';
import SemFiltro from './passos/SemFiltro';
import Aproximacao from './passos/Aproximacao';

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

/**
 * A mini-cena de cada ITEM da garantia — o capítulo virou uma etapa por item,
 * e cada etapa abre com a animação que conta AQUELE item. O vocabulário é o
 * `codigo` da regra no banco (seed v2/v3); código sem cena → etapa sem
 * ilustração, sem erro — o que mantém o fluxo dirigido a dados.
 */
const CENAS_DOS_ITENS: Record<string, Cena> = {
  'GA-1': Meta,
  'GA-2': Sessenta,
  'GA-3': Relogio,
  'GA-4': Semana,
  'GA-5': Intacto,
  'GA-6': SemImpulso,
  'GA-7': SemCompra,
  'GA-8': PergunteAntes,
};

export function cenaDoItem(codigo: string): Cena | null {
  return CENAS_DOS_ITENS[codigo] ?? null;
}

/**
 * A mini-cena de cada PASSO dos capítulos 1–3 — o mesmo desenho dos itens da
 * garantia, estendido: a regra informativa que vira "Passo X de Y" abre com a
 * animação que conta AQUELE passo. Código sem cena → passo sem ilustração,
 * sem erro. `ON-0` é a regra nova do seed v7 (redes sociais primeiro) e `VZ-4`
 * é a regra nova do seed v8 (mesmo equipamento, mesmo lugar).
 */
const CENAS_DOS_PASSOS: Record<string, Cena> = {
  'ON-0': Redes,
  'ON-1': Contexto,
  'ON-2': UmCanal,
  'VZ-1': Silencio,
  'VZ-2': FalaNatural,
  'VZ-3': Gravador,
  'VZ-4': MesmoEquipamento,
  'CL-1': FotoNitida,
  'CL-2': SemFiltro,
  'CL-3': Aproximacao,
};

export function cenaDoPasso(codigo: string): Cena | null {
  return CENAS_DOS_PASSOS[codigo] ?? null;
}
