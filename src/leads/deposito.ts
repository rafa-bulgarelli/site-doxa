/**
 * ─── A FACHADA ───────────────────────────────────────────────────────────────
 *
 * O único ponto do sistema que sabe QUAL porta está aberta. Todo o resto — o
 * formulário da landing e a Central inteira — importa daqui.
 *
 * É o que torna a troca do banco uma linha: quando as variáveis de ambiente
 * existirem, `escolher()` devolve a porta do Supabase em vez da simulada, e
 * nenhum componente muda de lugar.
 *
 * Aqui também mora a FILA DO NAVEGADOR, e ela é do formulário, não do painel:
 * um lead que falha por rede não pode simplesmente sumir. Ele fica guardado e
 * vai junto na próxima tentativa.
 */
import { TEMPO_MINIMO } from './antibot';
import { portaSimulada } from './dados/simulado';
import { portaSupabase } from './dados/supabase';
import type { PortaDeLeads } from './dados/porta';
import type { ProvaDeHumano } from './antibot';
import type { Lead, LeadNovo } from './tipos';

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const CHAVE = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Se o banco de verdade está configurado. A Central avisa na tela quando não. */
export const temBanco = Boolean(URL_BASE && CHAVE);

let porta: PortaDeLeads | null = null;

/**
 * A porta, criada na primeira vez que alguém precisa dela.
 *
 * Preguiçosa de propósito: a porta simulada lê a URL para escolher o cenário, e
 * ler a URL no topo do módulo aconteceria antes de a página existir em qualquer
 * ambiente que pré-renderize.
 */
export function portaDeLeads(): PortaDeLeads {
  porta ??= temBanco ? portaSupabase(URL_BASE!, CHAVE!) : portaSimulada();
  return porta;
}

/* ─── O QUE O FORMULÁRIO USA ───────────────────────────────────────────────── */

const FILA = 'doxa.leads.fila';

function leFila(): LeadNovo[] {
  try {
    return JSON.parse(localStorage.getItem(FILA) ?? '[]') as LeadNovo[];
  } catch {
    // Modo anônimo, cota estourada, JSON corrompido: em todos, a resposta certa
    // é "não há fila" — nunca uma exceção que derruba o formulário.
    return [];
  }
}

function gravaFila(fila: LeadNovo[]) {
  try {
    localStorage.setItem(FILA, JSON.stringify(fila));
  } catch {
    /* Sem espaço ou sem permissão. Não há nada melhor a fazer daqui, e o
       formulário não pode quebrar por causa disso. */
  }
}

/** Tenta mandar de novo o que ficou preso no navegador. */
export async function escoarFila(): Promise<void> {
  const fila = leFila();
  if (fila.length === 0) return;
  const presos: LeadNovo[] = [];
  for (const lead of fila) {
    // Em série e não em paralelo: são poucos, e uma rajada de POSTs numa rede
    // que acabou de voltar é a melhor forma de falhar de novo.
    try {
      /*
       * O que ficou preso vai com uma prova SINTÉTICA, e ela é honesta.
       *
       * O lead na fila já foi julgado uma vez, quando a pessoa apertou o botão
       * — o que falhou depois disso foi a rede. Exigir uma prova nova aqui
       * seria pedir um captcha a quem já não está na frente da tela, e o
       * resultado seria perder o lead para sempre.
       */
      await portaDeLeads().gravar(lead, { armadilha: '', levou: TEMPO_MINIMO, token: null });
    } catch {
      presos.push(lead);
    }
  }
  gravaFila(presos);
}

/**
 * Grava o lead, e nunca deixa cair.
 *
 * Tenta escoar o que ficou para trás antes: quem perdeu a rede no meio do
 * formulário costuma recuperá-la antes de fechar a aba, e a segunda gravação (a
 * da ficha completa) é a chance de levar as duas.
 */
export async function gravarLead(lead: LeadNovo, prova: ProvaDeHumano): Promise<void> {
  await escoarFila();
  try {
    await portaDeLeads().gravar(lead, prova);
  } catch {
    gravaFila([...leFila(), lead]);
  }
}

/* ─── O QUE A CENTRAL USA ──────────────────────────────────────────────────── */

export const entrar = (senha: string) => portaDeLeads().entrar(senha);
export const sessaoAtiva = () => portaDeLeads().sessaoAtiva();
export const sair = () => portaDeLeads().sair();
export const listarLeads = (): Promise<Lead[]> => portaDeLeads().listar();
export const marcarBaixados = (ids: string[]) => portaDeLeads().marcarBaixados(ids);
