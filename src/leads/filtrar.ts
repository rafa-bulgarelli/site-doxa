/**
 * ─── A DERIVAÇÃO ─────────────────────────────────────────────────────────────
 *
 * De uma lista de leads e do que a pessoa escolheu na tela, tudo que a Central
 * desenha: contadores, lista filtrada, página e origens disponíveis.
 *
 * Função PURA, sem React e sem DOM — é o que permite provar os contadores e a
 * busca por teste em vez de por clique. Toda regra de negócio da tela mora
 * aqui; os componentes só desenham o que ela devolve.
 */
import { scoreDo } from './score';
import type { Lead } from './tipos';

export type Aba = 'disponiveis' | 'baixados';
export type Ordem = 'recentes' | 'antigos' | 'score';

export interface Escolhas {
  aba: Aba;
  busca: string;
  origem: string;
  ordem: Ordem;
  /** Os cortados ficam escondidos por padrão — ver `desqualificado` em `tipos`. */
  mostrarCortados: boolean;
  pagina: number;
  porPagina: number;
}

/**
 * Sem acento e em minúscula, para a busca não exigir que se digite "Peçanha"
 * com cedilha. `NFD` separa a letra do acento; a faixa combinatória apaga o
 * acento e deixa a letra.
 */
export function simplificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Onde a busca procura. Tudo que o consultor teria na ponta da língua. */
function palheiro(lead: Lead): string {
  return simplificar(
    [
      lead.nome, lead.whatsapp, lead.email, lead.arroba, lead.origem,
      lead.segmento, lead.faturamento,
      lead.investimento, ...(lead.trava ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

export function derivar(leads: readonly Lead[], escolhas: Escolhas) {
  const { aba, busca, origem, ordem, mostrarCortados, pagina, porPagina } = escolhas;

  // Os cortados saem ANTES de qualquer contagem: eles não são fila de trabalho,
  // e um total que os inclui faz o time achar que tem mais lead do que tem.
  const base = mostrarCortados ? leads : leads.filter((l) => !l.desqualificado);

  const disponiveis = base.filter((l) => !l.baixado);
  const baixados = base.filter((l) => l.baixado);
  const daAba = aba === 'baixados' ? baixados : disponiveis;

  const origens = [...new Set(leads.map((l) => l.origem))].sort();

  const alvo = simplificar(busca);
  const filtrados = daAba
    .filter((l) => (origem === 'todas' ? true : l.origem === origem))
    .filter((l) => (alvo.length === 0 ? true : palheiro(l).includes(alvo)))
    .sort((a, b) => {
      if (ordem === 'score') return scoreDo(b).pontos - scoreDo(a).pontos;
      const ta = new Date(a.criado_em).getTime();
      const tb = new Date(b.criado_em).getTime();
      return ordem === 'antigos' ? ta - tb : tb - ta;
    });

  const paginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  // A página é limitada aqui e não no estado: quem apagou a busca depois de
  // estar na página nove precisa ver alguma coisa, não uma lista vazia.
  const atual = Math.min(Math.max(1, pagina), paginas);
  const daPagina = filtrados.slice((atual - 1) * porPagina, atual * porPagina);

  return {
    total: base.length,
    totalDisponiveis: disponiveis.length,
    totalBaixados: baixados.length,
    cortados: leads.length - base.length,
    origens,
    filtrados,
    daPagina,
    pagina: atual,
    paginas,
    comInstagram: daPagina.filter((l) => l.arroba).length,
    comEmail: daPagina.filter((l) => l.email).length,
  };
}
