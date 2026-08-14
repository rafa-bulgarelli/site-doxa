/**
 * ─── DO ACEITE AO ARQUIVO ────────────────────────────────────────────────────
 *
 * Uma função só, chamada de três lugares (o `concluir` do cliente, o `baixar`
 * do cliente e o `pdf_baixar` da equipe), e sempre com a mesma promessa: no fim
 * existe um PDF no bucket e uma URL assinada para ele.
 *
 * Se o par `pdf_caminho`/`pdf_sha256` já está preenchido, ela só assina — o
 * arquivo é o mesmo, e regerar seria trocar a prova por uma cópia. Se não está,
 * gera AGORA. É isso que faz o "o PDF falhou depois do aceite" ser um
 * contratempo e não uma perda: o aceite valeu, e o botão de baixar termina o
 * serviço.
 *
 * ─── A CORRIDA QUE O TRIGGER NÃO PERDOA ──────────────────────────────────────
 *
 * `manual_travar_aceite` deixa o par do PDF sair de null para valor UMA vez.
 * Dois cliques simultâneos no botão de baixar gerariam dois arquivos e dois
 * updates — o segundo bateria no trigger e explodiria na cara do cliente. Por
 * isso o `update` filtra por `pdf_caminho=is.null` e trata ZERO LINHAS como
 * resultado normal: quem chegou depois relê o aceite e assina o que o primeiro
 * gravou.
 */
import type { AceiteItemLinha, AceiteLinha } from '../tipos';
import { atualizar, consultar, primeira } from './banco';
import { registrarEvento } from './eventos';
import { sha256Hex } from './hash';
import { ErroHttp } from './http';
import { gerarPdf, type ItemDoComprovante } from './pdf';
import { caminhoDoPdf, subirPdf, urlAssinada } from './storage';

export interface Comprovante {
  url: string;
  sha256: string;
}

interface VersaoDoAceite {
  numero: number;
  titulo: string;
}

function paraItem(linha: AceiteItemLinha): ItemDoComprovante {
  return {
    codigo: linha.codigo,
    titulo: linha.titulo,
    instrucao: linha.instrucao,
    porque: linha.porque,
    exemplo: linha.exemplo,
    severidade: linha.severidade,
  };
}

async function aceiteDe(aceiteId: string): Promise<AceiteLinha> {
  const aceite = await primeira<AceiteLinha>(`manual_aceites?id=eq.${aceiteId}&select=*`);
  if (aceite == null) throw new ErroHttp(404, 'aceite_inexistente');
  return aceite;
}

async function montarBytes(aceite: AceiteLinha): Promise<Uint8Array<ArrayBuffer>> {
  const itens = await consultar<AceiteItemLinha>(
    `manual_aceite_itens?aceite_id=eq.${aceite.id}&select=*&order=codigo.asc`,
  );
  const versao = await primeira<VersaoDoAceite>(
    `manual_versoes?id=eq.${aceite.versao_id}&select=numero,titulo`,
  );
  return gerarPdf({
    aceite_id: aceite.id,
    nome: aceite.nome,
    empresa: aceite.empresa,
    email: aceite.email,
    aceito_em: aceite.aceito_em,
    declaracao: aceite.declaracao,
    conteudo_sha256: aceite.conteudo_sha256,
    versao_numero: versao?.numero ?? 0,
    versao_titulo: versao?.titulo ?? 'Manual do Cliente',
    itens: itens.map(paraItem),
  });
}

export async function garantirPdf(
  aceiteId: string,
  ator: 'cliente' | 'equipe',
  atorId: string | null = null,
): Promise<Comprovante> {
  const aceite = await aceiteDe(aceiteId);
  if (aceite.pdf_caminho != null && aceite.pdf_sha256 != null) {
    return { url: await urlAssinada(aceite.pdf_caminho), sha256: aceite.pdf_sha256 };
  }

  const bytes = await montarBytes(aceite);
  const sha256 = await sha256Hex(bytes);
  const caminho = caminhoDoPdf(aceite.id);
  await subirPdf(caminho, bytes);

  const gravadas = await atualizar<AceiteLinha>(
    'manual_aceites',
    `id=eq.${aceite.id}&pdf_caminho=is.null`,
    { pdf_caminho: caminho, pdf_sha256: sha256 },
  );
  if (gravadas.length === 0) {
    // Outra chamada chegou primeiro. O par dela é o que vale.
    const atual = await aceiteDe(aceite.id);
    if (atual.pdf_caminho == null || atual.pdf_sha256 == null) {
      throw new ErroHttp(502, 'pdf_nao_gravou');
    }
    return { url: await urlAssinada(atual.pdf_caminho), sha256: atual.pdf_sha256 };
  }

  await registrarEvento({
    convite_id: aceite.convite_id,
    ator,
    ator_id: atorId,
    tipo: 'pdf_gerado',
    detalhes: { aceite_id: aceite.id, pdf_sha256: sha256 },
  });
  return { url: await urlAssinada(caminho), sha256 };
}
