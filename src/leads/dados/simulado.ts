/**
 * ─── O BANCO DE MENTIRA ──────────────────────────────────────────────────────
 *
 * A implementação da porta de dados que roda sem Supabase nenhum. Ela existe
 * por duas razões, e as duas continuam valendo depois que o banco de verdade
 * entrar:
 *
 *  1. Permite construir e conferir a Central inteira antes de a conta existir.
 *  2. Permite reproduzir de propósito o que é raro no banco real — lista vazia,
 *     erro de rede, mil leads, texto que estoura a coluna. São exatamente os
 *     estados que só se descobrem quebrados em produção.
 *
 * O CENÁRIO vem da URL: `/leads?cenario=vazio` e afins. Fica na URL e não num
 * botão porque assim ele é compartilhável e reproduzível — mandar o link já é
 * mandar o defeito.
 *
 * Nada aqui vaza para o resto do sistema: quem consome é a fachada em
 * `deposito.ts`, e a Central nunca soube qual das duas implementações respondeu.
 */
import { scoreDo } from '../score';
import type { Lead, LeadNovo } from '../tipos';
import type { PortaDeLeads } from './porta';

export type Cenario = 'normal' | 'vazio' | 'erro' | 'lento' | 'muitos';

export function cenarioDaUrl(): Cenario {
  const alvo = new URLSearchParams(window.location.search).get('cenario');
  const validos: Cenario[] = ['normal', 'vazio', 'erro', 'lento', 'muitos'];
  return validos.includes(alvo as Cenario) ? (alvo as Cenario) : 'normal';
}

/**
 * A senha do modo simulado, e ela NÃO protege nada.
 *
 * O banco de mentira vive no próprio navegador de quem abriu a página: não há
 * dado de ninguém para proteger, e a senha existe só para o portão poder ser
 * exercitado de verdade antes de o Supabase existir. Quando o banco real
 * entrar, esta constante deixa de ser usada — quem valida passa a ser o
 * servidor, contra a conta do time.
 */
export const SENHA_SIMULADA = 'doxa';

/** Onde o modo simulado anota que alguém entrou. */
const CHAVE_SESSAO = 'doxa.leads.sessao.simulada';

/**
 * Onde ficam os leads REAIS gravados enquanto não há banco.
 *
 * Os inventados são gerados a cada carga e não se guardam. Estes são de gente
 * que preencheu o formulário do site nesta máquina — e eles precisam sobreviver
 * ao recarregamento, senão é impossível conferir o caminho inteiro: preencher a
 * ficha na landing, abrir `/leads` e encontrar o lead lá.
 */
const CHAVE_GRAVADOS = 'doxa.leads.gravados.simulados';

function lerGravados(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_GRAVADOS) ?? '[]') as Lead[];
  } catch {
    return [];
  }
}

function guardarGravados(lista: Lead[]) {
  try {
    localStorage.setItem(CHAVE_GRAVADOS, JSON.stringify(lista));
  } catch {
    /* Sem espaço: o modo simulado perde o lead de teste, e só. */
  }
}

const NOMES = [
  'João Vitor Bluhm', 'Kenia Soares da Costa', 'Fábbio Ygor', 'Sergio Aislan Inocêncio',
  'Nayara Fernandes', 'Alessandra Ribeiro do Nascimento Prado', 'Marcão', 'Cristiane Alves',
  'Rodrigo Peçanha', 'Eliane Boaventura', 'Leonardo Kimura', 'Patrícia Sales',
  'Wesley Nunes', 'Bianca Toledo', 'Otávio Mendonça', 'Renata Kruger',
];
const SEGMENTOS = [
  'Advocacia', 'Saúde e estética', 'Imóveis', 'Educação e cursos',
  'Alimentação', 'Varejo e e-commerce', 'Serviços para empresas',
];
const FATURAMENTOS = [
  'Até R$ 50 mil', 'R$ 50 a 200 mil', 'R$ 200 a 500 mil', 'R$ 500 mil a R$ 1 milhão',
  'R$ 1 a 3 milhões', 'R$ 3 a 5 milhões', 'Mais de R$ 5 milhões',
];
const TRAVAS = [
  'Não tenho tempo', 'Não sei o que falar', 'Não gosto de aparecer',
  'Já paguei agência e não deu certo', 'Não tenho equipe',
];
const INVESTIMENTOS = [
  'Abaixo de R$ 1.000', 'R$ 1.000 a R$ 2.000', 'R$ 2.000 a R$ 4.000',
  'R$ 4.000 a R$ 5.000', 'Mais de R$ 5.000',
];

/**
 * Gerador determinístico.
 *
 * `Math.random` faria a lista mudar a cada recarga, e uma tela que muda sozinha
 * é impossível de comparar entre um antes e um depois. Com semente, o
 * quadragésimo lead é sempre o mesmo quadragésimo lead.
 */
function semente(n: number) {
  let x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

const pega = <T,>(lista: readonly T[], n: number) => lista[Math.floor(semente(n) * lista.length)];

/**
 * Um lead inventado, com os casos difíceis plantados de propósito.
 *
 * A cada dez, um vem sem ficha nenhuma (saiu antes de responder); a cada sete,
 * um vem sem @ ; a cada onze, um vem sem e-mail; a cada treze, um é
 * desqualificado; e um deles tem nome comprido o bastante para estourar
 * qualquer coluna que não tenha sido feita para isso.
 */
function inventar(i: number): Lead {
  const semFicha = i % 10 === 3;
  const desqualificado = i % 13 === 5;
  const baixado = i % 3 === 0 && i > 2;
  const criado = new Date(Date.now() - i * 5.5 * 3600_000 - semente(i) * 3600_000);

  const base: LeadNovo = {
    caminho: i % 8 === 4 ? 'agencia' : 'empresa',
    nome: pega(NOMES, i * 3 + 1),
    whatsapp: `(${11 + (i % 80)}) 9${String(80000000 + Math.floor(semente(i * 7) * 19999999))}`,
    email: i % 11 === 6 ? null : `${pega(NOMES, i * 3 + 1).split(' ')[0].toLowerCase()}@empresa.com.br`,
    arroba: i % 7 === 2 ? null : `@${pega(NOMES, i * 3 + 1).split(' ')[0].toLowerCase()}oficial`,
    investimento: desqualificado ? INVESTIMENTOS[0] : pega(INVESTIMENTOS.slice(1), i * 5),
    desqualificado,
    origem: i % 6 === 1 ? 'Campanha Meta' : 'Formulário do site',
    segmento: semFicha ? null : pega(SEGMENTOS, i * 2),
    faturamento: semFicha ? null : pega(FATURAMENTOS, i * 11),
    trava: semFicha ? null : TRAVAS.filter((_, t) => semente(i * 17 + t) > 0.55),
  };

  return {
    ...base,
    id: `sim-${String(i).padStart(4, '0')}`,
    criado_em: criado.toISOString(),
    baixado,
    baixado_em: baixado ? new Date(criado.getTime() + 7200_000).toISOString() : null,
  };
}

/** O texto comprido, plantado no primeiro lead para a tabela ter de aguentar. */
function comExageros(leads: Lead[]): Lead[] {
  if (leads.length === 0) return leads;
  const [primeiro, ...resto] = leads;
  return [
    {
      ...primeiro,
      nome: 'Maria Aparecida do Nascimento Gonçalves de Albuquerque Filha',
      email: 'maria.aparecida.nascimento.goncalves@umdominiobastantelongoparateste.com.br',
      arroba: '@mariaaparecidadonascimentogoncalves',
      segmento: 'Serviços para empresas, com foco em consultoria tributária para indústrias',
      trava: TRAVAS,
    },
    ...resto,
  ];
}

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function portaSimulada(cenario: Cenario = cenarioDaUrl()): PortaDeLeads {
  // O estado vive no módulo: marcar como baixado tem de sobreviver a um
  // re-render, e não pode sobreviver a um recarregamento — senão o cenário
  // deixa de ser reproduzível.
  const quantos = cenario === 'muitos' ? 850 : cenario === 'vazio' ? 0 : 47;
  // No cenário vazio nem os gravados entram: ele existe para exercitar a tela
  // sem lead nenhum, e um lead de teste na máquina o desmontaria.
  const inventados = cenario === 'vazio' ? [] : comExageros(Array.from({ length: quantos }, (_, i) => inventar(i)));
  let leads: Lead[] = cenario === 'vazio' ? [] : [...lerGravados(), ...inventados];

  return {
    modo: 'simulado',

    async entrar(senha) {
      await espera(400);
      if (senha !== SENHA_SIMULADA) return 'Senha incorreta.';
      try {
        localStorage.setItem(CHAVE_SESSAO, String(Date.now() + 12 * 3600_000));
      } catch {
        /* Sem localStorage a sessão dura a aba. Melhor do que não entrar. */
      }
      return null;
    },

    sessaoAtiva() {
      try {
        return Number(localStorage.getItem(CHAVE_SESSAO) ?? 0) > Date.now();
      } catch {
        return false;
      }
    },

    sair() {
      localStorage.removeItem(CHAVE_SESSAO);
    },

    // A prova é ignorada aqui: o modo simulado não tem servidor para julgá-la,
    // e fingir um julgamento no navegador ensinaria a confiar num teste que não
    // existe.
    async gravar(lead) {
      await espera(200);
      const novo: Lead = {
        ...lead,
        id: `real-${Date.now()}`,
        criado_em: new Date().toISOString(),
        baixado: false,
        baixado_em: null,
      };
      /*
       * O lead do formulário SUBSTITUI a versão anterior dele, se houver.
       *
       * O formulário grava duas vezes: uma quando o contato fecha e outra
       * quando a ficha termina. Sem esta troca, quem responde a ficha aparece
       * duas vezes na Central — uma sem contexto e outra com — e o time liga
       * duas vezes para a mesma pessoa. A chave é o WhatsApp, que é o único
       * dado obrigatório e único que existe aqui.
       */
      const gravados = lerGravados().filter((l) => l.whatsapp !== novo.whatsapp);
      guardarGravados([novo, ...gravados]);
      leads = [novo, ...leads.filter((l) => l.whatsapp !== novo.whatsapp)];
    },

    async listar() {
      await espera(cenario === 'lento' ? 3500 : 350);
      if (cenario === 'erro') throw new Error('rede');
      return leads.map((l) => ({ ...l }));
    },

    async marcarBaixados(ids) {
      await espera(250);
      const alvo = new Set(ids);
      const agora = new Date().toISOString();
      const marcar = (l: Lead) =>
        alvo.has(l.id) && !l.baixado ? { ...l, baixado: true, baixado_em: agora } : l;
      leads = leads.map(marcar);
      // Os gravados também: baixar um lead de teste e recarregar tem de manter
      // ele na aba certa, senão o estado da tela vira mentira depois do F5.
      guardarGravados(lerGravados().map(marcar));
    },
  };
}

/** O score do lead simulado, para os testes conferirem a régua com dado real. */
export const scoreSimulado = (i: number) => scoreDo(inventar(i));
