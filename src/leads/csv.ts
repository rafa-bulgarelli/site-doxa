/**
 * ─── A EXPORTAÇÃO ────────────────────────────────────────────────────────────
 *
 * O CSV é o que o time leva para o WhatsApp e para a planilha, e é ele que
 * define o que "baixado" significa nesta Central: o lead sai num arquivo, e a
 * partir daí ele está na mão de alguém.
 */
import { scoreDo } from './score';
import type { Lead } from './tipos';

const COLUNAS = [
  'Nome', 'WhatsApp', 'E-mail', 'Instagram', 'Caminho', 'Investimento', 'Origem',
  'Nicho', 'Objetivo', 'Faturamento', 'Travas', 'Score', 'Estrelas',
  'Criado em', 'Baixado', 'Desqualificado',
] as const;

/**
 * Uma célula segura para planilha.
 *
 * Duas coisas acontecem aqui, e a segunda é de segurança:
 *
 *  1. Aspas e quebras de linha vão entre aspas duplas, com as aspas internas
 *     dobradas — é o que o formato manda, e sem isso um lead que escreveu vírgula
 *     numa resposta desloca todas as colunas seguintes.
 *
 *  2. Célula que COMEÇA com `=`, `+`, `-` ou `@` recebe um apóstrofo na frente.
 *     Sem isso, o Excel interpreta o texto de um estranho como FÓRMULA — é a
 *     injeção de CSV, e o nosso campo de Instagram começa com `@` em todo lead.
 */
function celula(valor: unknown): string {
  const texto = valor == null ? '' : String(valor);
  const seguro = /^[=+\-@\t\r]/.test(texto) ? `'${texto}` : texto;
  return /[",;\n\r]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
}

const data = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** O conteúdo do arquivo, como texto. Separado do download para poder ser testado. */
export function montarCsv(leads: readonly Lead[]): string {
  const linhas = leads.map((lead) => {
    const { pontos, estrelas } = scoreDo(lead);
    return [
      lead.nome, lead.whatsapp, lead.email, lead.arroba,
      lead.caminho === 'agencia' ? 'Agência licenciada' : 'Empresa',
      lead.investimento, lead.origem, lead.segmento, lead.objetivo, lead.faturamento,
      lead.trava?.join(' | '), pontos, estrelas,
      data(lead.criado_em), lead.baixado ? 'sim' : 'não', lead.desqualificado ? 'sim' : 'não',
    ].map(celula).join(',');
  });

  /*
   * BOM na frente do arquivo.
   *
   * Sem ele o Excel em português abre o CSV em Latin-1 e todo acento vira
   * caractere estranho — "João" vira "JoÃ£o" na primeira coluna do primeiro
   * lead. São três bytes que decidem se o arquivo é usável.
   */
  return `﻿${COLUNAS.join(',')}\n${linhas.join('\n')}`;
}

export function nomeDoArquivo(quantos: number): string {
  const hoje = new Date().toISOString().slice(0, 10);
  return `leads-doxa-${hoje}-${quantos}.csv`;
}

/** Dispara o download no navegador. Só isto toca no DOM. */
export function baixarCsv(leads: readonly Lead[]): void {
  const blob = new Blob([montarCsv(leads)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeDoArquivo(leads.length);
  link.click();
  // Sem isto o blob fica preso na memória da aba até ela fechar, e uma sessão
  // de trabalho com dez exportações segura dez cópias da lista.
  URL.revokeObjectURL(url);
}
