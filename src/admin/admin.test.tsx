/**
 * ─── O PAINEL, PROVADO ───────────────────────────────────────────────────────
 *
 * Duas coisas quebram em silêncio numa tela que só aponta caminhos:
 *
 *  1. um cartão apontando para rota que o `App` não conhece. Ninguém vê erro —
 *     o `vercel.json` reescreve tudo para o `index.html`, o `switch` do `App`
 *     não casa com nada e o time cai na PÁGINA DE VENDAS, achando que o painel
 *     está com defeito. Por isso cada destino é conferido contra as constantes
 *     de rota dos módulos de verdade, e não contra uma cópia da string;
 *  2. o portão sumir. Sem sessão a tela precisa ser a porta, com um campo de
 *     senha — nunca o menu de ferramentas.
 *
 * As telas saem por `renderToStaticMarkup`, o padrão do repo: sem DOM, sem
 * jsdom, sem dependência nova. Efeito não roda aqui, e não faz falta: o que se
 * prova é o que a pessoa vê no primeiro desenho.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FERRAMENTAS, Painel } from './Painel';
import { Portao } from './Portao';
import { ROTA_BASE as ROTA_DO_CONVERSOR } from '../conversor/config';
import { ROTA_BASE as ROTA_DO_MANUAL } from '../manual/config';

const nada = () => undefined;

function desenhar(no: Parameters<typeof renderToStaticMarkup>[0]): string {
  return renderToStaticMarkup(no);
}

/**
 * As rotas que o `App` sabe atender, e nada mais.
 *
 * `/leads` é comparado por igualdade porque é uma tela só; o manual e o
 * conversor aceitam caminho embaixo, que é como o `App` os reconhece.
 */
function rotaExiste(destino: string): boolean {
  if (destino === '/leads') return true;
  for (const base of [ROTA_DO_MANUAL, ROTA_DO_CONVERSOR]) {
    if (destino === base || destino.startsWith(`${base}/`)) return true;
  }
  return false;
}

describe('o portão do painel', () => {
  const html = desenhar(<Portao aoEntrar={nada} />);

  it('sem sessão, quem chega vê a porta — e ela diz de que porta se trata', () => {
    expect(html).toContain('Painel DOXA.');
    expect(html).toContain('A área interna do time');
    expect(html).toContain('type="password"');
  });

  it('a porta não vaza nenhuma ferramenta antes da senha', () => {
    for (const ferramenta of FERRAMENTAS) {
      expect(html).not.toContain(`href="${ferramenta.destino}"`);
    }
  });
});

describe('o painel depois da senha', () => {
  const html = desenhar(<Painel aoSair={nada} />);

  it('mostra as três ferramentas do time, cada uma com o seu destino', () => {
    expect(html).toContain('Central de Leads');
    expect(html).toContain('href="/leads"');
    expect(html).toContain('Manual do cliente');
    expect(html).toContain(`href="${ROTA_DO_MANUAL}/admin"`);
    expect(html).toContain('Conversor PDF ↔ Word');
    expect(html).toContain(`href="${ROTA_DO_CONVERSOR}"`);
  });

  it('leva também aos atalhos de dentro do manual', () => {
    expect(html).toContain(`href="${ROTA_DO_MANUAL}/admin/previa"`);
    expect(html).toContain(`href="${ROTA_DO_MANUAL}/admin/convites"`);
  });

  it('oferece a saída, que apaga a sessão das quatro áreas', () => {
    expect(html).toContain('aria-label="Sair do painel"');
  });
});

describe('os destinos', () => {
  it('nenhum cartão aponta para rota que o App não atende', () => {
    for (const ferramenta of FERRAMENTAS) {
      expect(rotaExiste(ferramenta.destino), ferramenta.destino).toBe(true);
      for (const atalho of ferramenta.atalhos) {
        expect(rotaExiste(atalho.destino), atalho.destino).toBe(true);
      }
    }
  });

  it('a área do time no manual mora DENTRO do manual, e não em /admin', () => {
    // O `ehAdmin` do `App` casa por igualdade justamente por isto: um teste de
    // prefixo roubaria `/manual-doxa/admin` para o painel, e o time cairia no
    // menu toda vez que abrisse os convites.
    const manual = FERRAMENTAS.find((uma) => uma.nome === 'Manual do cliente');
    if (manual == null) throw new Error('o painel precisa levar ao manual');
    expect(manual.destino.startsWith(`${ROTA_DO_MANUAL}/`)).toBe(true);
    expect(manual.destino).not.toBe('/admin');
  });

  it('o painel não aponta para si mesmo', () => {
    for (const ferramenta of FERRAMENTAS) {
      expect(ferramenta.destino).not.toBe('/admin');
    }
  });
});
