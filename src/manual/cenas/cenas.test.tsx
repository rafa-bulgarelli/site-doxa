/**
 * ─── AS CENAS DESENHAM? ──────────────────────────────────────────────────────
 *
 * `renderToStaticMarkup`, o mesmo caminho de `publico/telas.test.tsx`: sem DOM,
 * sem jsdom, sem dependência nova. Não é teste de desenho — ninguém afirma um
 * traço de SVG em asserção. É a prova das coisas que, quebradas, custam caro e
 * não aparecem em lugar nenhum:
 *
 * 1. **A cena renderiza.** Ela abre um capítulo (ou uma etapa de item), então
 *    um índice fora do array durante o loop derruba a página inteira do
 *    cliente, não só a ilustração.
 * 2. **A cena é `aria-hidden`.** É o contrato de `contrato.tsx`: o desenho é
 *    decorativo, e quem fala com leitor de tela é o texto do capítulo.
 * 3. **A cena serve quem pediu MENOS movimento.** Esse caminho só existe em
 *    runtime — sem este teste, ninguém o executa antes do cliente.
 * 4. **Toda tinta que a cena PEDE, a cena DEFINE.** Desde que a cor entrou, um
 *    `url(#arco)` apontando para um gradiente que não existe pinta a forma de
 *    preto no preto: some sem erro, sem console, sem nada. O teste casa cada
 *    referência com o `id` correspondente no mesmo desenho.
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
import Meta from './itens/Meta';
import Sessenta from './itens/Sessenta';
import Relogio from './itens/Relogio';
import Semana from './itens/Semana';
import Intacto from './itens/Intacto';
import SemImpulso from './itens/SemImpulso';
import SemCompra from './itens/SemCompra';
import PergunteAntes from './itens/PergunteAntes';
import ExemplosDeFotos from './ExemplosDeFotos';
import { cenaDaSecao, cenaDoItem } from './contrato';

interface CenaDoTeste {
  /** O slug da seção, ou o código da regra no caso das mini-cenas. */
  readonly chave: string;
  readonly Cena: ComponentType;
}

const CAPITULOS: readonly CenaDoTeste[] = [
  { chave: 'onboarding', Cena: CenaOnboarding },
  { chave: 'voz', Cena: CenaVoz },
  { chave: 'clone', Cena: CenaClone },
  { chave: 'garantia', Cena: CenaGarantia },
];

const ITENS: readonly CenaDoTeste[] = [
  { chave: 'GA-1', Cena: Meta },
  { chave: 'GA-2', Cena: Sessenta },
  { chave: 'GA-3', Cena: Relogio },
  { chave: 'GA-4', Cena: Semana },
  { chave: 'GA-5', Cena: Intacto },
  { chave: 'GA-6', Cena: SemImpulso },
  { chave: 'GA-7', Cena: SemCompra },
  { chave: 'GA-8', Cena: PergunteAntes },
];

const TODAS = [...CAPITULOS, ...ITENS];

function desenhar(Cena: ComponentType): string {
  return renderToStaticMarkup(<Cena />);
}

/** A fase em cartaz, lida do `data-fase` que o palco escreve na moldura. */
function faseDe(html: string): number {
  const achado = /data-fase="(\d+)"/.exec(html);
  if (achado == null) throw new Error('a cena não escreveu data-fase na moldura');
  return Number(achado[1]);
}

/** Toda tinta pedida por `url(#...)` neste desenho. */
function tintasPedidas(html: string): readonly string[] {
  return [...html.matchAll(/url\(#([^)]+)\)/g)].map((achado) => achado[1]);
}

describe('as cenas do manual', () => {
  for (const { chave, Cena } of TODAS) {
    it(`a cena de ${chave} desenha um SVG e nasce escondida do leitor`, () => {
      const html = desenhar(Cena);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('<svg');
      expect(html).toContain('viewBox=');
    });

    it(`a cena de ${chave} define toda tinta que pede, e tem cor no quadro que ensina`, () => {
      // O quadro conferido é o PARADO — o do fim da história. É lá que a cor
      // tem de estar: a fase 0 de algumas cenas é cinza de propósito (a semana
      // por fazer, as fotos antes do veredito), e cobrar cor dela seria cobrar
      // que a cena não tenha começo.
      preferencia.reduzido = true;
      try {
        const html = desenhar(Cena);
        const pedidas = tintasPedidas(html);
        expect(pedidas.length).toBeGreaterThan(0);
        for (const tinta of pedidas) {
          expect(html).toContain(`id="${tinta}"`);
        }
      } finally {
        preferencia.reduzido = false;
      }
    });
  }

  it('duas cenas na mesma página não dividem o mesmo id de gradiente', () => {
    // O caso real: o fluxo mostra a etapa de um item logo abaixo da cena do
    // capítulo. Com id fixo, a segunda pintaria com a paleta da primeira — e
    // sumiria de vez quando a primeira desmontasse.
    const html = renderToStaticMarkup(
      <>
        <CenaVoz />
        <Meta />
      </>,
    );
    const ids = [...html.matchAll(/id="(cena[^"-]+)-arco"/g)].map((achado) => achado[1]);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('o contrato entrega as quatro cenas de capítulo, e nada além', () => {
    for (const { chave, Cena } of CAPITULOS) {
      expect(cenaDaSecao(chave)).toBe(Cena);
    }
    // `termos` é documento, não capítulo: não tem — nem deve ter — ilustração.
    expect(cenaDaSecao('termos')).toBeNull();
    expect(cenaDaSecao('secao-de-uma-versao-antiga')).toBeNull();
  });

  it('o contrato entrega uma mini-cena para cada um dos oito itens', () => {
    for (const { chave, Cena } of ITENS) {
      expect(cenaDoItem(chave)).toBe(Cena);
    }
    expect(cenaDoItem('GA-99')).toBeNull();
  });
});

describe('as cenas com movimento reduzido', () => {
  for (const { chave, Cena } of TODAS) {
    it(`a cena de ${chave} vira desenho parado, e não tela vazia`, () => {
      const primeiroQuadro = desenhar(Cena);
      expect(faseDe(primeiroQuadro)).toBe(0);
      preferencia.reduzido = true;
      try {
        const html = desenhar(Cena);
        expect(html).toContain('aria-hidden="true"');
        // O quadro parado é o do FIM da história, o que ensina — parar na fase
        // 0 entregaria uma moldura vazia, pior do que não ter cena nenhuma.
        expect(faseDe(html)).toBeGreaterThan(0);
      } finally {
        preferencia.reduzido = false;
      }
    });
  }
});

describe('o quadro de exemplos de foto', () => {
  const html = renderToStaticMarkup(<ExemplosDeFotos />);

  it('mostra os dois grupos, com o veredito escrito em palavra', () => {
    expect(html).toContain('Assim serve');
    expect(html).toContain('Assim não serve');
  });

  it('dá um motivo de uma palavra a cada exemplo que não serve', () => {
    for (const motivo of ['Escura', 'Óculos', 'Filtro', 'Longe', 'Borrada']) {
      expect(html).toContain(motivo);
    }
    for (const virtude of ['De frente', 'Boa luz', 'Sorrindo', 'Fundo limpo']) {
      expect(html).toContain(virtude);
    }
  });

  it('esconde os DESENHOS do leitor de tela, e só eles', () => {
    // Este quadro não é uma cena: os rótulos são a informação, e um
    // `aria-hidden` no bloco inteiro entregaria uma tela muda a quem mais
    // precisa da lista. Cada `aria-hidden` do markup tem de estar num `<svg>`.
    const escondidos = [...html.matchAll(/<(\w+)[^>]*aria-hidden/g)].map((achado) => achado[1]);
    expect(escondidos.length).toBeGreaterThan(0);
    expect(new Set(escondidos)).toEqual(new Set(['svg']));
  });

  it('escreve o rótulo em corpo legível — nada de letra de 12px', () => {
    expect(html).toContain('text-[16px]');
  });
});
