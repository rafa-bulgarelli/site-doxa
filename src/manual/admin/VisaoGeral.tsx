/**
 * ─── A VISÃO GERAL ───────────────────────────────────────────────────────────
 *
 * A primeira tela: quantos convites existem em cada situação, qual versão está
 * vigente e quem concluiu por último.
 *
 * NÃO é um dashboard. Não há gráfico de tendência nem métrica de vaidade — o
 * que está aqui é o que faz alguém agir: um número que se pode CLICAR e cair na
 * lista já filtrada por ele.
 */
import { BookOpen, FileCheck } from 'lucide-react';
import { quandoFoi } from '../../leads/central/pecas';
import { SITUACOES, ROTULO_DA_SITUACAO, contarSituacoes, situacaoDo } from './filtrar';
import { BOTAO_BORDA, Contador, Etiqueta, ROTULO, Selo } from './pecas';
import type { EstadoDoPainel } from './usarAdmin';
import type { Situacao } from './filtrar';
import type { ConviteLinha } from '../tipos';

/** As últimas conclusões, do banco de convites — não precisa dos aceites. */
function concluidosRecentes(convites: readonly ConviteLinha[], quantos: number): ConviteLinha[] {
  return convites
    .filter((convite) => convite.concluido_em != null)
    .sort((a, b) => (b.concluido_em ?? '').localeCompare(a.concluido_em ?? ''))
    .slice(0, quantos);
}

export function VisaoGeral({
  painel,
  ir,
  verConvites,
}: {
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
  /* O filtro viaja por estado e não pela URL: o roteador do manual fatia o
     CAMINHO, e uma query no `pushState` viraria um segmento inventado. */
  verConvites: (situacao: Situacao) => void;
}) {
  const agora = Date.now();
  const contagem = contarSituacoes(painel.convites, agora);
  const recentes = concluidosRecentes(painel.convites, 6);
  const { vigente } = painel;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Contador rotulo="Convites" valor={contagem.total} />
        {SITUACOES.map((situacao) => (
          <button
            key={situacao}
            type="button"
            onClick={() => verConvites(situacao)}
            className="text-left"
            aria-label={`Ver convites ${ROTULO_DA_SITUACAO[situacao].toLowerCase()}`}
          >
            <Contador rotulo={ROTULO_DA_SITUACAO[situacao]} valor={contagem[situacao]} />
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── A VERSÃO VIGENTE */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
          <span className={`inline-flex items-center gap-2 ${ROTULO}`}>
            <BookOpen className="h-3 w-3" strokeWidth={2} />
            Manual vigente
          </span>
          {vigente == null ? (
            <>
              <p className="mt-3 font-serif text-[1.5rem] leading-tight text-white">
                Nenhuma versão publicada.
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/45">
                Enquanto não houver uma versão publicada, não dá para criar convite: o convite
                aponta para a versão que o cliente vai aceitar.
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 font-serif text-[1.6rem] leading-tight text-white">
                {vigente.titulo}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Etiqueta>v{vigente.numero}</Etiqueta>
                {vigente.publicado_em != null && (
                  <span className="text-[13px] text-white/40">
                    publicada {quandoFoi(vigente.publicado_em)}
                  </span>
                )}
              </div>
              {vigente.hash_conteudo != null && (
                <p className="mt-3 break-all font-mono text-[11px] leading-relaxed text-white/30">
                  {vigente.hash_conteudo}
                </p>
              )}
            </>
          )}
          <button type="button" onClick={() => ir('/manual')} className={`mt-5 ${BOTAO_BORDA}`}>
            Ver versões
          </button>
        </section>

        {/* ── AS ÚLTIMAS CONCLUSÕES */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
          <span className={`inline-flex items-center gap-2 ${ROTULO}`}>
            <FileCheck className="h-3 w-3" strokeWidth={2} />
            Últimas conclusões
          </span>
          {recentes.length === 0 ? (
            <p className="mt-3 text-[14px] leading-relaxed text-white/45">
              Ninguém concluiu ainda. Assim que um cliente aceitar o manual, ele aparece aqui com
              o PDF pronto.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {recentes.map((convite) => (
                <li key={convite.id}>
                  <button
                    type="button"
                    onClick={() => ir(`/convites/${convite.id}`)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] text-white">
                        {convite.empresa}
                      </span>
                      <span className="block truncate text-[12px] text-white/40">
                        {convite.nome_cliente ?? convite.email}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-[12px] text-white/35 sm:inline">
                        {convite.concluido_em != null && quandoFoi(convite.concluido_em)}
                      </span>
                      <Selo situacao={situacaoDo(convite, agora)} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
