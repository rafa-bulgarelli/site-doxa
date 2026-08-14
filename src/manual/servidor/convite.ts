/**
 * ─── O ESTADO DO CONVITE ─────────────────────────────────────────────────────
 *
 * 'expirado' NÃO é um status no banco — é uma comparação com o relógio, feita
 * na hora da pergunta (ver o comentário de `expira_em` em `manual.sql`). Um job
 * para carimbar expirados seria uma peça a mais para falhar; a subtração de
 * duas datas não falha.
 *
 * A ordem das perguntas é a regra: revogado e concluído GANHAM de expirado. Um
 * convite concluído ontem e vencido hoje continua concluído — a prova não
 * expira, e mostrar "expirado" a quem já aceitou seria mentir para o cliente.
 */
import type { ConviteAberto, ConviteLinha, EstadoDoConvite } from '../tipos';

function venceu(expiraEm: string | null, agora: Date): boolean {
  if (expiraEm == null) return false;
  const limite = new Date(expiraEm);
  if (Number.isNaN(limite.getTime())) return false;
  return limite.getTime() < agora.getTime();
}

export function estadoDoConvite(convite: ConviteLinha, agora: Date): EstadoDoConvite {
  switch (convite.status) {
    case 'revogado':
      return 'revogado';
    case 'concluido':
      return 'concluido';
    case 'pendente':
    case 'aberto':
      return venceu(convite.expira_em, agora) ? 'expirado' : 'valido';
    default:
      // Status fora da lista do `check` do banco não existe — mas se um dia
      // existir, a resposta segura é não abrir o manual.
      return 'invalido';
  }
}

/** O que o cliente vê preenchido: identidade do convite, e nada além dela. */
export function conviteAbertoDe(convite: ConviteLinha): ConviteAberto {
  return {
    email: convite.email,
    empresa: convite.empresa,
    nome_cliente: convite.nome_cliente,
    expira_em: convite.expira_em,
  };
}
