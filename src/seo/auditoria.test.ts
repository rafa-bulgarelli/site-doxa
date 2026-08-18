import { describe, expect, it } from 'vitest';
import { FAIXA_DE_PALAVRAS, auditar, normalizarPergunta, palavrasDe, relatorio } from './auditoria';
import { paginas, urlDe } from './indice';
import { HUBS } from './site';
import type { Tipo } from './tipos';

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

describe('a faixa de palavras', () => {
  const { grafo, avisos } = auditar();
  const foraDaFaixa = new Set(
    avisos.filter((aviso) => aviso.codigo === 'palavras-fora-da-faixa').map((aviso) => aviso.alvo),
  );

  it('tem uma faixa coerente para todo tipo de página', () => {
    for (const [tipo, faixa] of Object.entries(FAIXA_DE_PALAVRAS)) {
      expect(faixa.minimo, `faixa de ${tipo}`).toBeGreaterThan(0);
      expect(faixa.maximo, `faixa de ${tipo}`).toBeGreaterThan(faixa.minimo);
    }
  });

  // Nos DOIS sentidos: avisar do que está dentro da faixa é ruído, e calar
  // sobre o que está fora é o defeito que a faixa existe para pegar.
  it('avisa exatamente das páginas cujo corpo está fora da faixa do tipo', () => {
    for (const no of grafo) {
      const faixa = FAIXA_DE_PALAVRAS[no.tipo];
      const dentro = no.palavras >= faixa.minimo && no.palavras <= faixa.maximo;
      expect(
        foraDaFaixa.has(no.url),
        `${no.url}: ${no.palavras} palavras, faixa ${faixa.minimo}–${faixa.maximo}`,
      ).toBe(!dentro);
    }
  });

  it('a mensagem diz o número medido e a faixa cobrada', () => {
    for (const aviso of avisos) {
      if (aviso.codigo !== 'palavras-fora-da-faixa') continue;
      const no = grafo.find((candidato) => candidato.url === aviso.alvo);
      if (no == null) throw new Error(`aviso sobre ${aviso.alvo}, que não está no grafo.`);
      const faixa = FAIXA_DE_PALAVRAS[no.tipo];
      expect(aviso.mensagem).toContain(`${no.palavras} palavras`);
      expect(aviso.mensagem).toContain(`${faixa.minimo}–${faixa.maximo}`);
    }
  });

  // A contagem é a do CORPO. Se ela passasse a medir o `<main>` renderizado,
  // toda página ganharia as palavras fixas do cabeçalho, do breadcrumb e do
  // rodapé, e a faixa mediria o layout.
  it('mede o corpo, e é o mesmo número que `palavrasDe` devolve', () => {
    for (const pagina of paginas()) {
      const no = grafo.find((candidato) => candidato.url === urlDe(pagina));
      expect(no?.palavras).toBe(palavrasDe(pagina));
    }
  });
});

describe('normalizarPergunta', () => {
  it('ignora caixa, acento, espaço sobrando e pontuação final', () => {
    expect(normalizarPergunta('  Quanto CUSTA?  ')).toBe(normalizarPergunta('Quanto custa'));
    expect(normalizarPergunta('Vocês gravam vídeo?')).toBe(
      normalizarPergunta('voces  gravam video'),
    );
  });

  it('não confunde duas perguntas diferentes', () => {
    expect(normalizarPergunta('Quanto custa?')).not.toBe(normalizarPergunta('Quanto demora?'));
  });
});

describe('o aviso de FAQ repetida', () => {
  const avisos = auditar().avisos;

  /** As perguntas do corpus, normalizadas, e em que páginas cada uma está. */
  function porPergunta(): Map<string, string[]> {
    const mapa = new Map<string, string[]>();
    for (const pagina of paginas()) {
      for (const bloco of pagina.corpo) {
        if (bloco.tipo !== 'faq') continue;
        for (const item of bloco.itens) {
          const chave = normalizarPergunta(item.pergunta);
          mapa.set(chave, [...(mapa.get(chave) ?? []), urlDe(pagina)]);
        }
      }
    }
    return mapa;
  }

  it('avisa toda página que carrega uma pergunta repetida, e só elas', () => {
    const esperado = new Set<string>();
    for (const urls of porPergunta().values()) {
      if (urls.length < 2) continue;
      for (const url of urls) esperado.add(url);
    }
    const acusadas = new Set(
      avisos.filter((aviso) => aviso.codigo === 'faq-repetida').map((aviso) => aviso.alvo),
    );
    expect([...acusadas].sort()).toEqual([...esperado].sort());
  });

  it('cada aviso cita a pergunta e as outras páginas em que ela está', () => {
    for (const aviso of avisos) {
      if (aviso.codigo !== 'faq-repetida') continue;
      expect(aviso.mensagem).toContain('a pergunta "');
      expect(aviso.mensagem).not.toContain(`${aviso.alvo},`);
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

  // O relatório é o que o gestor lê entre rodadas: um código de aviso que sai
  // do `auditar()` e não aparece no texto é um defeito que ninguém vê.
  it('imprime todo código de aviso que a auditoria emitiu', () => {
    for (const aviso of auditar().avisos) {
      expect(texto).toContain(`[${aviso.codigo}] ${aviso.alvo}`);
    }
  });

  it('conhece a faixa de todo tipo publicado', () => {
    for (const pagina of paginas()) {
      const tipo: Tipo = pagina.tipo;
      expect(FAIXA_DE_PALAVRAS[tipo]).toBeDefined();
    }
  });
});
