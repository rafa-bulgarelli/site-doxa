/**
 * ─── O DETALHE DO CONVITE ────────────────────────────────────────────────────
 *
 * Tudo que se sabe sobre um convite: a ficha, onde o cliente parou, o que ele
 * aceitou item por item, o hash do conteúdo, a linha do tempo e o PDF.
 *
 * O PDF NÃO tem endereço fixo: o bucket é privado e a URL sai assinada da API,
 * com validade de minutos. Por isso o botão pede uma nova a cada clique em vez
 * de guardar um link que envelheceria na tela.
 */
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Clock, Download, FileCheck } from 'lucide-react';
import { dataCompleta, quandoFoi } from '../../leads/central/pecas';
import {
  baixarPdf,
  buscarAceiteDoConvite,
  buscarConvite,
  buscarProgresso,
  excluirConvite,
  listarEventos,
  listarItensDoAceite,
  registrarEvento,
} from './dados';
import { podeExcluir, situacaoDo } from './filtrar';
import {
  APAGADO,
  Aviso,
  BOTAO_BORDA,
  BOTAO_PRIMARIO,
  Campo,
  Erro,
  Esqueleto,
  Etiqueta,
  ExcluirEmDoisTempos,
  ROTULO,
  Selo,
  TITULO_DE_BLOCO,
} from './pecas';
import { mensagemDe } from './usarAdmin';
import type { EstadoDoPainel } from './usarAdmin';
import type {
  AceiteItemLinha,
  AceiteLinha,
  ConviteLinha,
  EventoLinha,
  Progresso,
} from '../tipos';

/** O que a tela precisa buscar por convite — nada disso está na lista. */
interface Ficha {
  convite: ConviteLinha | null;
  aceite: AceiteLinha | null;
  itens: AceiteItemLinha[];
  eventos: EventoLinha[];
  progresso: Progresso | null;
}

const FICHA_VAZIA: Ficha = { convite: null, aceite: null, itens: [], eventos: [], progresso: null };

const ROTULO_DO_EVENTO: Record<string, string> = {
  convite_criado: 'Convite criado',
  link_copiado: 'Link copiado pela equipe',
  convite_aberto: 'Cliente abriu o link',
  progresso_salvo: 'Cliente avançou no manual',
  aceite_concluido: 'Cliente concluiu o aceite',
  pdf_gerado: 'PDF gerado',
  pdf_baixado: 'PDF baixado',
  convite_revogado: 'Convite revogado',
  convite_regenerado: 'Convite regenerado',
  exportacao_csv: 'Exportação de CSV',
};

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
      <h2 className={TITULO_DE_BLOCO}>{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ConviteDetalhe({
  id,
  painel,
  ir,
}: {
  id: string;
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
}) {
  const [ficha, setFicha] = useState<Ficha>(FICHA_VAZIA);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [pedindoPdf, setPedindoPdf] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [convites, aceites, eventos, progressos] = await Promise.all([
        buscarConvite(id),
        buscarAceiteDoConvite(id),
        listarEventos(id),
        buscarProgresso(id),
      ]);
      const aceite = aceites[0] ?? null;
      // Os itens dependem do aceite: sem ele não há o que buscar, e pedir uma
      // lista com `aceite_id=eq.undefined` devolveria 400.
      const itens = aceite == null ? [] : await listarItensDoAceite(aceite.id);
      setFicha({
        convite: convites[0] ?? null,
        aceite,
        itens,
        eventos,
        progresso: progressos[0] ?? null,
      });
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const pedirPdf = async () => {
    if (ficha.aceite == null || pedindoPdf) return;
    setPedindoPdf(true);
    setErro(null);
    try {
      const { pdf_url } = await baixarPdf(ficha.aceite.id);
      // Aba nova e não `location`: perder o painel de vista para ver um PDF
      // custa recarregar a lista inteira na volta.
      window.open(pdf_url, '_blank', 'noopener,noreferrer');
      await registrarEvento('pdf_baixado', id, { aceite_id: ficha.aceite.id }).catch(
        () => undefined,
      );
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setPedindoPdf(false);
    }
  };

  /**
   * Apaga o convite e SAI da tela.
   *
   * Ficar aqui depois de excluir mostraria a ficha de uma linha que não existe
   * mais, com botões que só teriam 404 a oferecer. A lista recarrega antes da
   * navegação para não voltar com o convite apagado ainda desenhado.
   */
  const excluir = async () => {
    if (excluindo) return;
    setExcluindo(true);
    setErro(null);
    try {
      await excluirConvite(id);
      await painel.recarregar();
      ir('/convites');
    } catch (problema) {
      setErro(mensagemDe(problema));
      setExcluindo(false);
      setConfirmandoExclusao(false);
    }
  };

  const versao = painel.versoes.find((v) => v.id === ficha.convite?.versao_id) ?? null;

  if (carregando) return <Esqueleto linhas={6} />;

  if (ficha.convite == null) {
    return (
      <Aviso
        titulo="Convite não encontrado."
        corpo={erro ?? 'O endereço aponta para um convite que não existe mais nesta conta.'}
        acao={{ rotulo: 'Voltar para a lista', aoClicar: () => ir('/convites') }}
      />
    );
  }

  const { convite, aceite, itens, eventos, progresso } = ficha;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => ir('/convites')} className={BOTAO_BORDA}>
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Todos os convites
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {aceite != null && (
            <button
              type="button"
              onClick={() => void pedirPdf()}
              disabled={pedindoPdf}
              className={BOTAO_PRIMARIO}
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
              {pedindoPdf ? 'Assinando o endereço…' : 'Baixar o PDF do aceite'}
            </button>
          )}
          {/* Concluído não aparece aqui: a prova não se apaga. */}
          {podeExcluir(convite) && (
            <ExcluirEmDoisTempos
              confirmando={confirmandoExclusao}
              ocupado={excluindo}
              rotulo="Excluir convite"
              aoPedir={() => setConfirmandoExclusao(true)}
              aoConfirmar={() => void excluir()}
              aoDesistir={() => setConfirmandoExclusao(false)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-[2rem] leading-none tracking-[-0.02em] text-white">
          {convite.empresa}
        </h1>
        <Selo situacao={situacaoDo(convite, Date.now())} />
        {versao != null && <Etiqueta>v{versao.numero}</Etiqueta>}
      </div>

      <Erro mensagem={erro} />

      <Bloco titulo="A ficha">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo rotulo="E-mail" valor={convite.email} />
          <Campo rotulo="Quem assina" valor={convite.nome_cliente ?? undefined} />
          <Campo rotulo="Criado em" valor={dataCompleta(convite.criado_em)} />
          <Campo
            rotulo="Vence em"
            valor={convite.expira_em == null ? 'sem prazo' : dataCompleta(convite.expira_em)}
          />
          <Campo
            rotulo="Aberto em"
            valor={convite.aberto_em == null ? undefined : dataCompleta(convite.aberto_em)}
          />
          <Campo
            rotulo="Concluído em"
            valor={convite.concluido_em == null ? undefined : dataCompleta(convite.concluido_em)}
          />
          {convite.revogado_em != null && (
            <Campo rotulo="Revogado em" valor={dataCompleta(convite.revogado_em)} />
          )}
          <Campo
            rotulo="Invite da plataforma"
            valor={convite.invite_plataforma ?? undefined}
            largo
          />
          {convite.regenerado_de != null && (
            <Campo rotulo="Regenerado de" valor={convite.regenerado_de} largo />
          )}
        </div>
      </Bloco>

      {aceite == null && progresso != null && (
        <Bloco titulo="Onde o cliente parou">
          <p className="text-[15px] leading-relaxed text-white/70">
            Parou na seção {progresso.secao_ordem + 1}, com{' '}
            <span className="tabular-nums text-white">{progresso.regras_marcadas.length}</span>{' '}
            {progresso.regras_marcadas.length === 1 ? 'regra marcada' : 'regras marcadas'}.
            {progresso.nome_informado != null && ` Informou o nome ${progresso.nome_informado}.`}
          </p>
          <p className="mt-2 text-[13px] text-white/40">
            Progresso NÃO é aceite: ele existe só para o cliente retomar pelo mesmo link.
          </p>
        </Bloco>
      )}

      {aceite != null && (
        <Bloco titulo="A prova">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="Nome no aceite" valor={aceite.nome} />
            <Campo rotulo="Aceito em" valor={dataCompleta(aceite.aceito_em)} />
            <Campo rotulo="Hash do conteúdo" valor={aceite.conteudo_sha256} largo />
            <Campo rotulo="Hash do PDF" valor={aceite.pdf_sha256 ?? undefined} largo />
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-white/40">
            O hash é o conteúdo exato que o cliente viu. Se ele bater com o da versão, nada mudou
            depois do aceite — é isso que faz do registro uma prova.
          </p>
        </Bloco>
      )}

      {itens.length > 0 && (
        <Bloco titulo={`O que foi aceito — ${itens.length} regras`}>
          <ul className="space-y-2">
            {itens.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-white/45">{item.codigo}</span>
                  <span className="text-[15px] text-white">{item.titulo}</span>
                  {item.severidade === 'critica' && (
                    <span className={ROTULO} style={{ color: APAGADO }}>
                      Crítica
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/50">{item.instrucao}</p>
              </li>
            ))}
          </ul>
        </Bloco>
      )}

      <Bloco titulo="Linha do tempo">
        {eventos.length === 0 ? (
          <p className="text-[14px] text-white/40">Nenhum evento registrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {eventos.map((evento) => (
              <li key={evento.id} className="flex items-start gap-3">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25" strokeWidth={2} />
                <div className="min-w-0">
                  <p className="text-[14px] text-white/80">
                    {ROTULO_DO_EVENTO[evento.tipo] ?? evento.tipo}
                  </p>
                  <p className="text-[12px] text-white/35">
                    {evento.ator} · {dataCompleta(evento.criado_em)} · {quandoFoi(evento.criado_em)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      {aceite == null && convite.status === 'concluido' && (
        <p className="flex items-center gap-2 text-[13px]" style={{ color: APAGADO }}>
          <FileCheck className="h-3.5 w-3.5" strokeWidth={2} />
          O convite está concluído mas o aceite não foi encontrado — avise quem cuida do banco.
        </p>
      )}
    </div>
  );
}
