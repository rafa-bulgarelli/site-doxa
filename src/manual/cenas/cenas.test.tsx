/**
 * ─── AS CENAS DESENHAM? ──────────────────────────────────────────────────────
 *
 * `renderToStaticMarkup`, o mesmo caminho de `publico/telas.test.tsx`: sem DOM,
 * sem jsdom, sem dependência nova. Não é teste de desenho — ninguém afirma um
 * traço de SVG em asserção. É a prova das três coisas que, quebradas, custam
 * caro e não aparecem em lugar nenhum:
 *
 * 1. **A cena renderiza.** Ela abre um capítulo do manual, então um índice
 *    fora do array durante o loop derruba a página inteira do cliente, não só
 *    a ilustração.
 * 2. **A cena é `aria-hidden`.** É o contrato de `contrato.tsx`: o desenho é
 *    decorativo, e quem fala com leitor de tela é o texto do capítulo.
 * 3. **A cena serve quem pediu MENOS movimento.** Esse caminho só existe em
 *    runtime — sem este teste, ninguém o executa antes do cliente.
 *
 * Por que trocar `useReducedMotion`: em Node não há `matchMedia`, e framer
 * responde `false` para sempre. O `importActual` mantém o `motion` de verdade —
 * substituída é só a resposta da preferência.
 */
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentType } from 'react';

const preferencia = vi.hoisted(() => ({ reduzido: false }));

vi.mock('framer-motion', async () => {
  const real = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...real, useReducedMotion: () => preferencia.reduzido };
});

import CenaOnboarding from './CenaOnboarding';
import CenaVoz from './CenaVoz';
import CenaClone from './CenaClone';
import CenaGarantia from './CenaGarantia';
import { cenaDaSecao } from './contrato';

interface CenaDoTeste {
  readonly slug: string;
  readonly Cena: ComponentType;
}

const CENAS: readonly CenaDoTeste[] = [
  { slug: 'onboarding', Cena: CenaOnboarding },
  { slug: 'voz', Cena: CenaVoz },
  { slug: 'clone', Cena: CenaClone },
  { slug: 'garantia', Cena: CenaGarantia },
];

/** O verde de `TINTA.protege` — só o quadro que ENSINA carrega essa marca. */
const VERDE = '#34D399';

function desenhar(Cena: ComponentType): string {
  return renderToStaticMarkup(<Cena />);
}

describe('as cenas do manual', () => {
  for (const { slug, Cena } of CENAS) {
    it(`a cena de ${slug} desenha um SVG e nasce escondida do leitor`, () => {
      const html = desenhar(Cena);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('<svg');
      expect(html).toContain('viewBox=');
    });
  }

  it('o contrato entrega exatamente as quatro cenas, e nada além', () => {
    for (const { slug, Cena } of CENAS) {
      expect(cenaDaSecao(slug)).toBe(Cena);
    }
    // `termos` é documento, não capítulo: não tem — nem deve ter — ilustração.
    expect(cenaDaSecao('termos')).toBeNull();
    expect(cenaDaSecao('secao-de-uma-versao-antiga')).toBeNull();
  });
});

describe('as cenas com movimento reduzido', () => {
  for (const { slug, Cena } of CENAS) {
    it(`a cena de ${slug} vira desenho parado, e não tela vazia`, () => {
      const primeiroQuadro = desenhar(Cena);
      preferencia.reduzido = true;
      try {
        const html = desenhar(Cena);
        expect(html).toContain('aria-hidden="true"');
        // O quadro parado é o do FIM da história, o que ensina — parar na fase
        // 0 entregaria uma moldura vazia, pior do que não ter cena nenhuma. O
        // verde do "assim é certo" só existe lá, então ele é a prova do quadro.
        expect(html).toContain(VERDE);
        // E é OUTRO quadro: se a preferência não mudasse nada, a cena teria
        // nascido na fase 0 do mesmo jeito e ninguém perceberia.
        expect(html).not.toBe(primeiroQuadro);
      } finally {
        preferencia.reduzido = false;
      }
    });
  }
});
