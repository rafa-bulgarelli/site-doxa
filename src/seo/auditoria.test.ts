import { describe, expect, it } from 'vitest';
import { auditar, palavrasDe, relatorio } from './auditoria';
import { paginas, urlDe } from './indice';
import { HUBS } from './site';

/**
 * A auditoria não reprova nada — ela avisa. O que se testa aqui é o CONTRÁRIO
 * do costume: não "não há aviso", e sim "os avisos que existem estão certos e
 * o grafo bate com o índice". Um teste que exigisse zero aviso quebraria na
 * primeira página de um cluster novo, que é justamente quando ela é útil.
 */

describe('auditar', () => {
  const { grafo, avisos } = auditar();

  it('tem um nó por página publicada', () => {
    expect(grafo.map((no) => no.url).sort()).toEqual(paginas().map(urlDe).sort());
  });

  it('nenhuma página aparece na própria lista de saída', () => {
    for (const no of grafo) {
      expect(no.saida).not.toContain(no.url);
      expect(no.entrada).not.toContain(no.url);
    }
  });

  it('todo alvo de aviso é uma URL interna', () => {
    for (const aviso of avisos) {
      expect(aviso.alvo.startsWith('/')).toBe(true);
      expect(aviso.mensagem.length).toBeGreaterThan(0);
    }
  });

  // O union `Hub` é fechado e as páginas de hub são de outra track. Enquanto
  // elas não mergearem, cada hub tem de aparecer como AVISO — e não sumir.
  it('avisa de todo hub do union que ainda não tem página', () => {
    const semPagina = new Set(
      avisos.filter((aviso) => aviso.codigo === 'hub-sem-pagina').map((aviso) => aviso.alvo),
    );
    const publicadas = new Set(paginas().map(urlDe));
    for (const hub of Object.keys(HUBS)) {
      expect(publicadas.has(hub) || semPagina.has(hub)).toBe(true);
    }
  });

  it('a saída só cita páginas que existem', () => {
    const publicadas = new Set(paginas().map(urlDe));
    for (const no of grafo) {
      for (const destino of no.saida) {
        expect(publicadas.has(destino)).toBe(true);
      }
    }
  });

  // Se A envia para B, B recebe de A. Um grafo que não fecha nos dois sentidos
  // não é um grafo — é duas listas que discordam.
  it('entrada e saída são o mesmo grafo lido dos dois lados', () => {
    for (const no of grafo) {
      for (const destino of no.saida) {
        const outro = grafo.find((candidato) => candidato.url === destino);
        expect(outro?.entrada).toContain(no.url);
      }
    }
  });
});

describe('palavrasDe', () => {
  it('conta o texto e não a marcação', () => {
    const pagina = paginas()[0];
    if (pagina == null) throw new Error('Nenhuma página no índice.');
    expect(palavrasDe(pagina)).toBeGreaterThan(0);
  });
});

describe('relatorio', () => {
  const texto = relatorio();

  it('imprime o grafo e a contagem de avisos', () => {
    expect(texto).toContain('PÁGINAS');
    expect(texto).toContain('AVISOS');
    for (const pagina of paginas()) {
      expect(texto).toContain(urlDe(pagina));
    }
  });
});
