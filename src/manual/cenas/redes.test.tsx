/**
 * ─── OS ÍCONES DAS REDES DESENHAM O QUE FOI PEDIDO? ──────────────────────────
 *
 * `renderToStaticMarkup`, o mesmo caminho de `cenas.test.tsx`: sem DOM, sem
 * jsdom, sem dependência nova. Não é teste de beleza — quem julga o desenho é o
 * dono, olhando a folha de comparação. O que se cobra aqui são as quatro coisas
 * que, quebradas, contaminam TRÊS cenas de uma vez e não aparecem em lugar
 * nenhum:
 *
 * 1. **O círculo-jaula não volta.** É o defeito que o dono nomeou duas vezes
 *    ("afogado", "enforcado"). Como o arquivo desenha tudo em `<path>`, a prova
 *    é direta: um `<circle>` no markup já é a jaula de volta.
 * 2. **Cada rede desenha alguma coisa.** Um `d` vazio ou uma rede que caiu do
 *    mapa some em silêncio: SVG sem erro, cena sem ícone, ninguém percebe.
 * 3. **A tinta é a que a cena mandou.** O ícone não tem opinião de cor — quem
 *    decide apagado/aceso é a cena, e é assim que ele orna com o resto.
 * 4. **O que vai ao ar é MONO.** O interruptor de marca nasce desligado. Este
 *    teste é o que segura um `true` esquecido no commit.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';
import { COR_DA_MARCA, IconeDaRede, REDES_REAIS, USAR_COR_DA_MARCA } from './redes';
import type { RedeReal } from './redes';

/** Uma cor que não existe no arquivo: se ela aparece, veio da cena. */
const TINTA_DA_CENA = '#ABCDEF';
/** Outra, para provar que a cor apagada também é respeitada. */
const TINTA_APAGADA = '#123456';

/**
 * O ícone dentro de um `<svg>`, como ele vive.
 *
 * O palco de verdade é um `<svg>`, e um `<g>` solto na raiz é um elemento fora
 * de contexto: renderizar dentro do `<svg>` é o que garante que o markup do
 * teste é o markup que o navegador recebe.
 */
function desenhar(elemento: ReactElement): string {
  return renderToStaticMarkup(<svg viewBox="0 0 100 100">{elemento}</svg>);
}

/** O `transform` do grupo do ícone. */
function transformeDe(html: string): string {
  const achado = /<g transform="([^"]+)"/.exec(html);
  if (achado == null) throw new Error('o ícone não abriu um grupo com transform');
  return achado[1];
}

describe('os ícones reais das redes', () => {
  it('conhece as três redes, e só elas', () => {
    expect([...REDES_REAIS]).toEqual(['youtube', 'tiktok', 'instagram']);
    expect(Object.keys(COR_DA_MARCA).sort()).toEqual(['instagram', 'tiktok', 'youtube']);
  });

  for (const rede of REDES_REAIS) {
    const html = desenhar(<IconeDaRede rede={rede} x={50} y={50} cor={TINTA_DA_CENA} />);

    it(`o ícone de ${rede} é desenhado com <path>, e com mais de um traço`, () => {
      const caminhos = [...html.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((achado) => achado[1]);
      expect(caminhos.length).toBeGreaterThanOrEqual(2);
      for (const d of caminhos) {
        // Um `d` curto demais não desenha nada e não quebra nada: é o modo
        // silencioso de um glifo sumir da cena.
        expect(d.length).toBeGreaterThan(10);
      }
    });

    it(`o ícone de ${rede} não tem círculo em volta — nem círculo nenhum`, () => {
      // O defeito nomeado pelo dono, cobrado na forma mais crua possível. Vale
      // para `<rect>` também: moldura quadrada em volta seria a mesma jaula com
      // outro nome.
      expect(html).not.toContain('<circle');
      expect(html).not.toContain('<rect');
      expect(html).not.toContain('<ellipse');
    });

    it(`o ícone de ${rede} não escreve texto nem pede gradiente ou filtro`, () => {
      // `<text>` no lugar do glifo seria a fonte da máquina de quem abre a
      // página; `url(#...)` seria um id global brigando com as outras cenas.
      expect(html).not.toContain('<text');
      expect(html).not.toContain('url(#');
      expect(html).not.toContain('<defs');
      expect(html).not.toContain('filter=');
    });

    it(`o ícone de ${rede} pinta com a tinta que a cena mandou`, () => {
      expect(html).toContain(`stroke="${TINTA_DA_CENA}"`);
      expect(html).toContain(`fill="${TINTA_DA_CENA}"`);
      expect(html).not.toContain(COR_DA_MARCA[rede]);
    });

    it(`o ícone de ${rede} apagado continua com a cor do estado apagado`, () => {
      const apagado = desenhar(
        <IconeDaRede rede={rede} x={50} y={50} cor={TINTA_APAGADA} acesa={false} />,
      );
      expect(apagado).toContain(`stroke="${TINTA_APAGADA}"`);
      expect(apagado).not.toContain(TINTA_DA_CENA);
    });

    it(`o ícone de ${rede} nasce centrado no ponto que a cena escolheu`, () => {
      // Ícone que ancora pelo canto obriga cada cena a compensar o deslocamento
      // na mão — e é assim que três cenas ficam com três alinhamentos.
      const casado = /^translate\(120 64\) scale\(([\d.]+)\)$/.exec(
        transformeDe(desenhar(<IconeDaRede rede={rede} x={120} y={64} cor={TINTA_DA_CENA} />)),
      );
      if (casado == null) throw new Error('o grupo não centrou o glifo em (120, 64)');
      // A caixa dos glifos tem lado 24: o tamanho padrão é 34 na régua da cena.
      expect(Number(casado[1])).toBeCloseTo(34 / 24, 6);
    });

    it(`o ícone de ${rede} cresce e encolhe pelo tamanho, sem tocar no desenho`, () => {
      const grande = transformeDe(
        desenhar(<IconeDaRede rede={rede} x={0} y={0} tamanho={48} cor={TINTA_DA_CENA} />),
      );
      const casado = /scale\(([\d.]+)\)/.exec(grande);
      if (casado == null) throw new Error('o grupo não escalou o glifo');
      expect(Number(casado[1])).toBeCloseTo(48 / 24, 6);
    });
  }
});

/**
 * ─── A FOLHA DE COMPARAÇÃO MONO × MARCA ──────────────────────────────────────
 *
 * O dono decide a variante olhando. O que o teste garante é que a decisão custe
 * UMA linha: a prop existe para a folha e para cá, o interruptor de módulo é o
 * que vai ao ar, e nenhuma cena participa da escolha.
 */
describe('o interruptor mono × cor-da-marca', () => {
  /** O modo marca, ligado por prop — como a folha de comparação o liga. */
  function comMarca(rede: RedeReal, acesa: boolean): string {
    return renderToStaticMarkup(
      <svg viewBox="0 0 100 100">
        <IconeDaRede rede={rede} x={50} y={50} cor={TINTA_DA_CENA} acesa={acesa} usarCorDaMarca />
      </svg>,
    );
  }

  it('vai ao ar DESLIGADO — o que o cliente vê é monocromático', () => {
    expect(USAR_COR_DA_MARCA).toBe(false);
    for (const rede of REDES_REAIS) {
      const html = renderToStaticMarkup(
        <svg viewBox="0 0 100 100">
          <IconeDaRede rede={rede} x={50} y={50} cor={TINTA_DA_CENA} />
        </svg>,
      );
      expect(html).not.toContain(COR_DA_MARCA[rede]);
    }
  });

  for (const rede of REDES_REAIS) {
    it(`ligado, o ícone aceso de ${rede} veste a cor da marca`, () => {
      const html = comMarca(rede, true);
      expect(html).toContain(COR_DA_MARCA[rede]);
      expect(html).not.toContain(TINTA_DA_CENA);
    });

    it(`ligado, o ícone APAGADO de ${rede} continua mono`, () => {
      // Rede apagada colorida seria cor sem função nenhuma — e cor sem função é
      // o que o dono chamou de "horrível". Aceso é quem tem a vez.
      const html = comMarca(rede, false);
      expect(html).toContain(TINTA_DA_CENA);
      expect(html).not.toContain(COR_DA_MARCA[rede]);
    });
  }

  it('cada rede tem a SUA cor, chapada e sem gradiente', () => {
    const cores = REDES_REAIS.map((rede) => COR_DA_MARCA[rede]);
    expect(new Set(cores).size).toBe(3);
    for (const cor of cores) {
      expect(cor).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});
