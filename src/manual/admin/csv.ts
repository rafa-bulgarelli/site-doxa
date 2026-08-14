/**
 * ─── A EXPORTAÇÃO DOS CONVITES ───────────────────────────────────────────────
 *
 * O que o time leva para a planilha: quem recebeu, em que pé está, quando
 * concluiu. NÃO leva o link — o token do convite não existe fora da resposta
 * que o criou, e um CSV com links de aceite seria uma lista de credenciais
 * circulando por e-mail.
 *
 * As proteções de célula são as mesmas de `src/leads/csv.ts`, e estão repetidas
 * porque lá elas não são exportadas — copiar quatro linhas custa menos do que
 * mexer no arquivo da Central, que é de outra área e não se edita daqui.
 */
import { ROTULO_DA_SITUACAO, situacaoDo } from './filtrar';
import type { ConviteLinha, VersaoLinha } from '../tipos';

const COLUNAS = [
  'Empresa',
  'E-mail',
  'Nome do cliente',
  'Situação',
  'Versão',
  'Criado em',
  'Aberto em',
  'Concluído em',
  'Expira em',
  'Revogado em',
] as const;

/**
 * Uma célula segura para planilha.
 *
 *  1. Aspas, vírgulas e quebras de linha vão entre aspas duplas, com as aspas
 *     internas dobradas — sem isso, um nome de empresa com vírgula desloca
 *     todas as colunas seguintes.
 *  2. Célula que COMEÇA com `=`, `+`, `-` ou `@` recebe um apóstrofo na frente:
 *     é a injeção de CSV, e todo e-mail tem `@` no meio (mas basta um colado no
 *     começo para o Excel tratar o texto de um estranho como fórmula).
 */
function celula(valor: unknown): string {
  const texto = valor == null ? '' : String(valor);
  const seguro = /^[=+\-@\t\r]/.test(texto) ? `'${texto}` : texto;
  return /[",;\n\r]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
}

function data(iso: string | null): string {
  if (iso == null) return '';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/** O conteúdo do arquivo, como texto. Separado do download para ser testável. */
export function montarCsvDeConvites(
  convites: readonly ConviteLinha[],
  versoes: readonly VersaoLinha[],
  agora: number,
): string {
  const numeroDaVersao = new Map(versoes.map((v) => [v.id, v.numero]));
  const linhas = convites.map((convite) => {
    const versao = numeroDaVersao.get(convite.versao_id);
    return [
      convite.empresa,
      convite.email,
      convite.nome_cliente ?? '',
      ROTULO_DA_SITUACAO[situacaoDo(convite, agora)],
      versao == null ? '' : `v${versao}`,
      data(convite.criado_em),
      data(convite.aberto_em),
      data(convite.concluido_em),
      data(convite.expira_em),
      data(convite.revogado_em),
    ]
      .map(celula)
      .join(',');
  });

  // BOM na frente: sem ele o Excel em português abre o arquivo em Latin-1 e
  // todo acento vira caractere estranho. São três bytes que decidem se o
  // arquivo é usável.
  return `﻿${COLUNAS.join(',')}\n${linhas.join('\n')}`;
}

export function nomeDoArquivo(quantos: number): string {
  const hoje = new Date().toISOString().slice(0, 10);
  return `convites-manual-${hoje}-${quantos}.csv`;
}

/** Dispara o download no navegador. Só isto toca no DOM. */
export function baixarCsvDeConvites(
  convites: readonly ConviteLinha[],
  versoes: readonly VersaoLinha[],
): void {
  const conteudo = montarCsvDeConvites(convites, versoes, Date.now());
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeDoArquivo(convites.length);
  link.click();
  // Sem isto o blob fica preso na memória da aba até ela fechar.
  URL.revokeObjectURL(url);
}
