/**
 * ─── OS TESTES DA CENTRAL ────────────────────────────────────────────────────
 *
 * Cobrem o que quebra em silêncio: a régua do score, a derivação da tela
 * (contadores, busca, abas, páginas) e a montagem do CSV.
 *
 * NÃO cobrem o desenho. Um teste que afirma que um botão tem a classe
 * `rounded-full` não prova nada e quebra a cada ajuste de estilo — a validação
 * visual desta página foi feita no navegador, que é onde ela existe.
 */
import { describe, expect, it } from 'vitest';
import { derivar, simplificar } from './filtrar';
import { montarCsv } from './csv';
import { eixosDo, estrelasDe, pontosDe, scoreDo } from './score';
import type { Lead, LeadNovo } from './tipos';

const base: LeadNovo = {
  caminho: 'empresa',
  nome: 'Fulano',
  whatsapp: '(11) 90000-0000',
  email: null,
  arroba: null,
  investimento: null,
  desqualificado: false,
  origem: 'Formulário do site',
  segmento: null,
  faturamento: null,
  objetivo: null,
  trava: null,
  aparece: null,
};

function lead(extra: Partial<Lead> = {}): Lead {
  return {
    ...base,
    id: Math.random().toString(36).slice(2),
    criado_em: new Date().toISOString(),
    baixado: false,
    baixado_em: null,
    ...extra,
  };
}

const escolhas = {
  aba: 'disponiveis' as const,
  busca: '',
  origem: 'todas',
  ordem: 'recentes' as const,
  mostrarCortados: false,
  pagina: 1,
  porPagina: 10,
};

describe('score', () => {
  it('quem pulou a ficha inteira pontua pouco, mas nunca zero estrelas', () => {
    const { pontos, estrelas } = scoreDo(base);
    expect(pontos).toBeLessThan(20);
    expect(estrelas).toBe(1);
  });

  it('a verba vem do investimento, e não do faturamento, quando os dois existem', () => {
    const alto = eixosDo({ ...base, investimento: 'Mais de R$ 5.000', faturamento: 'Até R$ 20 mil' });
    const baixo = eixosDo({ ...base, investimento: 'R$ 1.000 a R$ 1.500', faturamento: 'Mais de R$ 200 mil' });
    expect(alto.verba).toBe(10);
    expect(baixo.verba).toBe(3);
  });

  it('sem investimento declarado, o faturamento assume a verba', () => {
    expect(eixosDo({ ...base, faturamento: 'Mais de R$ 200 mil' }).verba).toBe(10);
  });

  it('a dor é a maior trava, mais um ponto por trava extra', () => {
    const uma = eixosDo({ ...base, trava: ['Não sei o que falar'] });
    const duas = eixosDo({ ...base, trava: ['Não sei o que falar', 'Já paguei agência e não deu certo'] });
    expect(uma.dor).toBe(6);
    // A maior é 10, mais uma extra = 11, limitado a 10.
    expect(duas.dor).toBe(10);
  });

  it('a intenção sobe com o que a pessoa se deu ao trabalho de responder', () => {
    const cru = eixosDo(base);
    const completo = eixosDo({
      ...base,
      email: 'a@b.com',
      arroba: '@x',
      segmento: 'Advocacia',
      faturamento: 'R$ 20 a 50 mil',
      objetivo: 'Vender mais',
      trava: ['Não tenho tempo'],
      aparece: 'Apareço',
    });
    expect(cru.intencao).toBe(0);
    expect(completo.intencao).toBe(10);
  });

  it('todo eixo fica entre 0 e 10, com qualquer combinação', () => {
    const extremos = [
      base,
      { ...base, trava: ['Já paguei agência e não deu certo', 'Não tenho tempo', 'Não tenho equipe'] },
      { ...base, investimento: 'Mais de R$ 5.000', segmento: 'Advocacia', aparece: 'Apareço' },
      { ...base, segmento: 'Coisa que não está na tabela', objetivo: 'Outro objetivo qualquer' },
    ];
    for (const caso of extremos) {
      for (const valor of Object.values(eixosDo(caso))) {
        expect(valor).toBeGreaterThanOrEqual(0);
        expect(valor).toBeLessThanOrEqual(10);
      }
    }
  });

  it('as estrelas acompanham os pontos e nunca passam de 5', () => {
    expect(estrelasDe(0)).toBe(1);
    expect(estrelasDe(100)).toBe(5);
    expect(estrelasDe(pontosDe(eixosDo(base)))).toBeGreaterThanOrEqual(1);
  });
});

describe('derivação da tela', () => {
  it('separa as abas e conta cada uma', () => {
    const leads = [lead(), lead(), lead({ baixado: true, baixado_em: new Date().toISOString() })];
    const visao = derivar(leads, escolhas);
    expect(visao.total).toBe(3);
    expect(visao.totalDisponiveis).toBe(2);
    expect(visao.totalBaixados).toBe(1);
    expect(visao.daPagina).toHaveLength(2);
  });

  it('esconde os cortados dos totais até alguém pedir', () => {
    const leads = [lead(), lead({ desqualificado: true })];
    expect(derivar(leads, escolhas).total).toBe(1);
    expect(derivar(leads, escolhas).cortados).toBe(1);
    expect(derivar(leads, { ...escolhas, mostrarCortados: true }).total).toBe(2);
  });

  it('a busca ignora acento, caixa e procura em todo campo útil', () => {
    const leads = [
      lead({ nome: 'Rodrigo Peçanha' }),
      lead({ nome: 'Outro', email: 'contato@advocacia.com' }),
      lead({ nome: 'Terceiro', trava: ['Não tenho equipe'] }),
    ];
    expect(derivar(leads, { ...escolhas, busca: 'pecanha' }).filtrados).toHaveLength(1);
    expect(derivar(leads, { ...escolhas, busca: 'ADVOCACIA' }).filtrados).toHaveLength(1);
    expect(derivar(leads, { ...escolhas, busca: 'equipe' }).filtrados).toHaveLength(1);
    expect(derivar(leads, { ...escolhas, busca: 'zzz' }).filtrados).toHaveLength(0);
  });

  it('filtra por origem e lista as origens que existem', () => {
    const leads = [lead({ origem: 'Campanha Meta' }), lead(), lead()];
    expect(derivar(leads, escolhas).origens).toEqual(['Campanha Meta', 'Formulário do site']);
    expect(derivar(leads, { ...escolhas, origem: 'Campanha Meta' }).filtrados).toHaveLength(1);
  });

  it('ordena por score quando pedido', () => {
    const fraco = lead({ nome: 'Fraco' });
    const forte = lead({
      nome: 'Forte',
      investimento: 'Mais de R$ 5.000',
      segmento: 'Advocacia',
      objetivo: 'Vender mais',
      trava: ['Já paguei agência e não deu certo'],
      aparece: 'Apareço',
      arroba: '@forte',
      email: 'forte@x.com',
      faturamento: 'Mais de R$ 200 mil',
    });
    const visao = derivar([fraco, forte], { ...escolhas, ordem: 'score' });
    expect(visao.daPagina[0].nome).toBe('Forte');
  });

  it('pagina, e a página fora da faixa cai na última existente', () => {
    const leads = Array.from({ length: 25 }, () => lead());
    expect(derivar(leads, escolhas).paginas).toBe(3);
    expect(derivar(leads, { ...escolhas, pagina: 3 }).daPagina).toHaveLength(5);
    // Página 99 num filtro de 3 páginas: mostra a 3, e não uma tela vazia.
    expect(derivar(leads, { ...escolhas, pagina: 99 }).pagina).toBe(3);
  });

  it('lista vazia não quebra nem devolve página zero', () => {
    const visao = derivar([], escolhas);
    expect(visao.daPagina).toHaveLength(0);
    expect(visao.paginas).toBe(1);
    expect(visao.pagina).toBe(1);
  });

  it('simplificar tira acento e caixa', () => {
    expect(simplificar('  ÁÉÎÕÜ ção ')).toBe('aeiou cao');
  });
});

describe('csv', () => {
  it('escapa vírgula e aspas sem deslocar coluna', () => {
    const texto = montarCsv([lead({ nome: 'Silva, José "Zé"' })]);
    expect(texto).toContain('"Silva, José ""Zé"""');
    expect(texto.split('\n')).toHaveLength(2);
  });

  it('neutraliza fórmula: o @ do Instagram não pode virar função no Excel', () => {
    const texto = montarCsv([lead({ arroba: '@empresa' })]);
    expect(texto).toContain("'@empresa");
    const perigoso = montarCsv([lead({ nome: '=CMD()' })]);
    expect(perigoso).toContain("'=CMD()");
  });

  it('começa com BOM, senão o Excel brasileiro come os acentos', () => {
    expect(montarCsv([])).toMatch(/^﻿/);
  });

  it('leva o score junto, para a planilha poder ordenar por ele', () => {
    const texto = montarCsv([lead({ investimento: 'Mais de R$ 5.000' })]);
    const colunas = texto.split('\n')[0].split(',');
    expect(colunas).toContain('Score');
    expect(colunas).toContain('Estrelas');
  });
});
