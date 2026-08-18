/**
 * ─── A PORTARIA ──────────────────────────────────────────────────────────────
 *
 * Todo corpo que chega vira um `PedidoPublico` ou um `PedidoAdmin` AQUI, ou não
 * vira nada. Depois desta função, o resto do servidor trabalha com o tipo do
 * contrato e não precisa desconfiar de mais nada.
 *
 * O `switch` sem `default` seria a brecha: uma ação desconhecida cairia adiante
 * como um objeto qualquer. Ele existe, e recusa.
 */
import type { PedidoAdmin, PedidoPublico } from '../tipos';
import { ErroHttp } from './http';
import { pareceToken } from './token';
import {
  dataOpcional,
  exigirBooleano,
  exigirEmail,
  exigirInteiro,
  exigirTexto,
  exigirUuid,
  exigirUuids,
  objetoDe,
  textoOpcional,
} from './validar';

/** Um manual com mais de 400 regras obrigatórias não é um manual — é um susto. */
const MAXIMO_DE_REGRAS = 400;
/** Nenhuma versão tem 500 seções; o teto só impede um número absurdo virar consulta. */
const MAXIMO_DE_SECOES = 500;

function exigirToken(valor: unknown): string {
  if (!pareceToken(valor)) throw new ErroHttp(400, 'token_invalido');
  return valor;
}

export function lerPedidoPublico(corpo: unknown): PedidoPublico {
  const bruto = objetoDe(corpo);
  switch (bruto.acao) {
    case 'abrir':
      return { acao: 'abrir', token: exigirToken(bruto.token) };
    case 'progresso':
      return {
        acao: 'progresso',
        token: exigirToken(bruto.token),
        secao_ordem: exigirInteiro(bruto.secao_ordem, 'secao_ordem', 0, MAXIMO_DE_SECOES),
        regras_marcadas: exigirUuids(bruto.regras_marcadas, 'regras_marcadas', MAXIMO_DE_REGRAS),
        nome_informado: textoOpcional(bruto.nome_informado, 'nome_informado', 160),
      };
    case 'concluir':
      return {
        acao: 'concluir',
        token: exigirToken(bruto.token),
        nome: textoOpcional(bruto.nome, 'nome', 160),
        regras_marcadas: exigirUuids(bruto.regras_marcadas, 'regras_marcadas', MAXIMO_DE_REGRAS),
        declaracao_confirmada: exigirBooleano(bruto.declaracao_confirmada, 'declaracao_confirmada'),
      };
    case 'baixar':
      return { acao: 'baixar', token: exigirToken(bruto.token) };
    default:
      throw new ErroHttp(400, 'acao_invalida');
  }
}

/**
 * O link de cadastro na plataforma, na régua EXATA do `check` da coluna: http
 * ou https, até 500 caracteres. Sem o `i` no padrão de propósito — o `~` do
 * Postgres é sensível a maiúsculas, e um 'HTTPS://' que passasse por aqui
 * viraria um 500 do banco em vez deste 400 que o CX consegue ler.
 */
function inviteOpcional(valor: unknown): string | undefined {
  if (valor == null) return undefined;
  if (typeof valor !== 'string') {
    throw new ErroHttp(400, 'campo_invalido', 'invite_plataforma nao e texto');
  }
  const limpo = valor.trim();
  if (limpo.length === 0) return undefined;
  if (limpo.length > 500 || !/^https?:\/\//.test(limpo)) {
    throw new ErroHttp(400, 'campo_invalido', 'invite_plataforma nao e link ate 500');
  }
  return limpo;
}

export function lerPedidoAdmin(corpo: unknown): PedidoAdmin {
  const bruto = objetoDe(corpo);
  switch (bruto.acao) {
    case 'convite_criar':
      return {
        acao: 'convite_criar',
        email: exigirEmail(bruto.email, 'email'),
        empresa: exigirTexto(bruto.empresa, 'empresa', 2, 160),
        nome_cliente: textoOpcional(bruto.nome_cliente, 'nome_cliente', 160),
        expira_em: dataOpcional(bruto.expira_em, 'expira_em'),
        invite_plataforma: inviteOpcional(bruto.invite_plataforma),
      };
    case 'convite_revogar':
      return { acao: 'convite_revogar', convite_id: exigirUuid(bruto.convite_id, 'convite_id') };
    case 'convite_regenerar':
      return { acao: 'convite_regenerar', convite_id: exigirUuid(bruto.convite_id, 'convite_id') };
    case 'convite_excluir':
      return { acao: 'convite_excluir', convite_id: exigirUuid(bruto.convite_id, 'convite_id') };
    case 'pdf_baixar':
      return { acao: 'pdf_baixar', aceite_id: exigirUuid(bruto.aceite_id, 'aceite_id') };
    case 'versao_rascunho':
      return { acao: 'versao_rascunho', origem_id: exigirUuid(bruto.origem_id, 'origem_id') };
    case 'versao_publicar':
      return { acao: 'versao_publicar', versao_id: exigirUuid(bruto.versao_id, 'versao_id') };
    default:
      throw new ErroHttp(400, 'acao_invalida');
  }
}
