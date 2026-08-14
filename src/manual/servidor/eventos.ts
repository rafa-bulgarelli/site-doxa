/**
 * ─── A LINHA DO TEMPO ────────────────────────────────────────────────────────
 *
 * Cada coisa que acontece com um convite vira uma linha em `manual_eventos`, e
 * essa tabela só entra (o trigger `manual_so_entra` recusa update e delete).
 *
 * A regra que organiza este arquivo: registrar evento NUNCA derruba o fluxo.
 * Se o `insert` da auditoria falhar depois de o aceite ter sido gravado, o
 * cliente não pode ver um erro — o que valia já valeu. A falha vai para o log,
 * onde alguém a conserta, e a resposta segue.
 *
 * `aceite_concluido` não está aqui de propósito: quem grava é a própria função
 * `manual_concluir`, na mesma transação do aceite. Um evento de conclusão que
 * pudesse faltar não serviria de prova.
 */
import { inserirMudo } from './banco';

export type TipoDeEvento =
  | 'convite_criado'
  | 'convite_aberto'
  | 'progresso_salvo'
  | 'convite_revogado'
  | 'convite_regenerado'
  | 'pdf_gerado'
  | 'pdf_baixado';

export interface Evento {
  convite_id: string | null;
  /** Quem agiu. 'cliente' = o dono do link; 'equipe' = alguém com sessão. */
  ator: 'cliente' | 'equipe';
  /** O id do perfil, quando foi a equipe. O cliente não tem id. */
  ator_id?: string | null;
  tipo: TipoDeEvento;
  detalhes?: Record<string, unknown>;
}

export async function registrarEvento(evento: Evento): Promise<void> {
  try {
    await inserirMudo('manual_eventos', {
      convite_id: evento.convite_id,
      ator: evento.ator,
      ator_id: evento.ator_id ?? null,
      tipo: evento.tipo,
      detalhes: evento.detalhes ?? {},
    });
  } catch (erro) {
    // Auditoria não é fluxo. Ver o cabeçalho: a resposta ao cliente segue.
    console.error('manual: evento nao registrado', evento.tipo, erro);
  }
}
