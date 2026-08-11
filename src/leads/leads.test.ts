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
import { TEMPO_MINIMO, julgarSemRede } from './antibot';
import { montarCsv } from './csv';
import { eixosDo, estrelasDe, pontosDe, scoreDo } from './score';
import { CORTE, FICHA, INVESTIMENTO, OUTRO } from '../components/comparacao/config';
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
  objetivo: null,
  faturamento: null,
  trava: null,
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
  it('toda faixa de investimento tem nota — nenhuma cai no vazio', () => {
    // O teste que teria pego a renomeação das faixas sozinho: se alguém mexer
    // no texto de uma faixa em `config.ts` e esquecer da tabela aqui, a verba
    // do lead vira zero em silêncio.
    for (const faixa of INVESTIMENTO.pt.faixas) {
      const { verba } = eixosDo({ ...base, investimento: faixa });
      expect(verba, `faixa sem nota na régua: ${faixa}`).toBeGreaterThanOrEqual(0);
      if (faixa !== INVESTIMENTO.pt.faixas[CORTE]) expect(verba).toBeGreaterThan(0);
    }
  });

  it('quem pulou a ficha inteira pontua pouco, mas nunca zero estrelas', () => {
    const { pontos, estrelas } = scoreDo(base);
    expect(pontos).toBeLessThan(20);
    expect(estrelas).toBe(1);
  });

  it('a verba vem do investimento, e não do faturamento, quando os dois existem', () => {
    const alto = eixosDo({ ...base, investimento: 'Mais de R$ 5.000', faturamento: 'Até R$ 20 mil' });
    const baixo = eixosDo({ ...base, investimento: 'R$ 1.000 a R$ 2.000', faturamento: 'Mais de R$ 200 mil' });
    expect(alto.verba).toBe(10);
    expect(baixo.verba).toBe(4);
  });

  it('sem investimento declarado, o faturamento assume a verba', () => {
    expect(eixosDo({ ...base, faturamento: 'Mais de R$ 5 milhões' }).verba).toBe(10);
  });

  it('toda faixa de faturamento tem nota — a mesma guarda da de investimento', () => {
    const faixas = FICHA.pt.find((f) => f.chave === 'faturamento')?.opcoes ?? [];
    expect(faixas.length).toBeGreaterThan(0);
    for (const faixa of faixas) {
      const { verba, escala } = eixosDo({ ...base, faturamento: faixa });
      expect(verba, `faixa sem nota: ${faixa}`).toBeGreaterThan(0);
      expect(escala, `faixa sem escala: ${faixa}`).toBeGreaterThan(0);
    }
  });

  it('todo objetivo tem nota — a mesma guarda das duas escadas', () => {
    // `OUTRO.pt` fica de fora de propósito: ele nunca chega ao lead. O que sai do
    // formulário quando alguém o marca é o texto que a pessoa escreveu, e texto
    // livre não tem como estar numa tabela.
    const objetivos = (FICHA.pt.find((f) => f.chave === 'objetivo')?.opcoes ?? []).filter(
      (o) => o !== OUTRO.pt,
    );
    expect(objetivos.length).toBeGreaterThan(0);
    for (const objetivo of objetivos) {
      const { fit } = eixosDo({ ...base, objetivo });
      expect(fit, `objetivo sem nota na régua: ${objetivo}`).toBeGreaterThan(0);
    }
  });

  it('a pergunta nova NÃO rebaixa quem chegou antes dela', () => {
    /*
     * A guarda que importa nesta mudança. Todo lead que já está no banco tem
     * `objetivo: null`, e o `fit` deles não pode mudar por causa de uma pergunta
     * que ninguém teve como responder. Média das fontes PRESENTES, não das
     * possíveis.
     */
    const antigo = eixosDo({ ...base, segmento: 'Advocacia' });
    expect(antigo.fit).toBe(9);

    // E com a resposta nova, as duas fontes contam: (9 + 10) / 2 = 9,5 → 10.
    const novo = eixosDo({ ...base, segmento: 'Advocacia', objetivo: 'Vender mais' });
    expect(novo.fit).toBe(10);

    // Só o objetivo, sem nicho conhecido: lê o que sobrou, sem dividir por dois.
    const soObjetivo = eixosDo({ ...base, objetivo: 'Fazer a marca ser conhecida' });
    expect(soObjetivo.fit).toBe(7);
  });

  it('texto livre em "Outro" não pontua, e também não derruba o nicho', () => {
    const comLivre = eixosDo({ ...base, segmento: 'Advocacia', objetivo: 'Quero abrir uma filial' });
    expect(comLivre.fit).toBe(9);
  });

  it('a dor é a maior trava, mais um ponto por trava extra', () => {
    const uma = eixosDo({ ...base, trava: ['Não sei o que falar'] });
    const duas = eixosDo({ ...base, trava: ['Não sei o que falar', 'Já paguei agência e não deu certo'] });
    expect(uma.dor).toBe(6);
    // A maior é 10, mais uma extra = 11, limitado a 10.
    expect(duas.dor).toBe(10);
  });

  it('a presença é binária: existe perfil para abrir, ou não existe', () => {
    // Ela virou binária quando a pergunta do rosto saiu da ficha. O teste
    // registra a decisão: se alguém devolver nuance ao eixo, ele acusa.
    expect(eixosDo({ ...base, arroba: '@x' }).presenca).toBe(9);
    expect(eixosDo({ ...base, arroba: null }).presenca).toBe(0);
  });

  it('a régua tem seis eixos, e nenhum deles é constante para todo lead', () => {
    // O eixo que valia o mesmo para todo mundo (INTENÇÃO, quando o formulário
    // tinha "Pular") saiu. Este teste impede que outro entre no lugar dele.
    const magro = eixosDo(base);
    const cheio = eixosDo({
      ...base,
      arroba: '@x',
      investimento: 'Mais de R$ 5.000',
      segmento: 'Advocacia',
      faturamento: 'Mais de R$ 5 milhões',
      trava: ['Já paguei agência e não deu certo'],
    });
    const eixos = Object.keys(magro) as (keyof typeof magro)[];
    expect(eixos).toHaveLength(6);
    for (const eixo of eixos) {
      expect(cheio[eixo], `eixo constante: ${eixo}`).toBeGreaterThan(magro[eixo]);
    }
  });

  it('todo eixo fica entre 0 e 10, com qualquer combinação', () => {
    const extremos = [
      base,
      { ...base, trava: ['Já paguei agência e não deu certo', 'Não tenho tempo', 'Não tenho equipe'] },
      { ...base, investimento: 'Mais de R$ 5.000', segmento: 'Advocacia' },
      { ...base, segmento: 'Coisa que não está na tabela', faturamento: 'Faixa inexistente' },
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
      trava: ['Já paguei agência e não deu certo'],
      arroba: '@forte',
      email: 'forte@x.com',
      faturamento: 'Mais de R$ 5 milhões',
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

describe('anti-bot', () => {
  const humano = { armadilha: '', levou: TEMPO_MINIMO + 5000, token: null };

  it('deixa passar quem levou tempo e não tocou na armadilha', () => {
    expect(julgarSemRede(humano)).toEqual({ ok: true });
  });

  it('barra quem preencheu o campo escondido', () => {
    expect(julgarSemRede({ ...humano, armadilha: 'x' }).ok).toBe(false);
    // Espaço em branco não é preenchimento: um autofill desastrado que deixa um
    // espaço no campo não pode custar o lead de uma pessoa real.
    expect(julgarSemRede({ ...humano, armadilha: '   ' }).ok).toBe(true);
  });

  it('barra quem respondeu nove perguntas rápido demais', () => {
    expect(julgarSemRede({ ...humano, levou: 200 }).ok).toBe(false);
    expect(julgarSemRede({ ...humano, levou: TEMPO_MINIMO - 1 }).ok).toBe(false);
    expect(julgarSemRede({ ...humano, levou: TEMPO_MINIMO }).ok).toBe(true);
  });

  it('barra tempo impossível — sem número, negativo ou infinito', () => {
    for (const levou of [NaN, -1, Infinity, undefined as unknown as number]) {
      expect(julgarSemRede({ ...humano, levou }).ok, `passou com ${levou}`).toBe(false);
    }
  });
});
