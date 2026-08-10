/**
 * ─── A CENTRAL DE LEADS ──────────────────────────────────────────────────────
 *
 * A rota `/leads`. Duas abas — o que ainda não foi baixado e o que já foi —, a
 * tabela, e o detalhe de cada lead.
 *
 * ─── AS DUAS ABAS ────────────────────────────────────────────────────────────
 *
 * A referência é um mercado de leads: "Disponíveis" são as que a agência pode
 * COMPRAR e "Minhas leads" as que ela já pagou. Aqui não se compra nada — todo
 * lead é nosso desde que chegou. O que as abas separam é OUTRA coisa, e ela é a
 * pergunta real do time: o que ainda não saiu daqui, e o que já está na mão de
 * alguém. Um lead vira "baixado" quando sai num CSV.
 *
 * Este componente é `lazy` a partir do `App`: nada dele entra no pacote da
 * landing, e quem nunca abriu `/leads` nunca baixou uma linha disto.
 */
import { useState } from 'react';
import { Download, LogOut, RefreshCw, Search, Users } from 'lucide-react';
import { scoreDo } from './score';
import { sair } from './deposito';
import { POR_PAGINA, usarLeads } from './usarLeads';
import type { Lead } from './tipos';
import { Detalhe } from './central/Detalhe';
import { Chip, Contador, Estrelas, Presenca, quandoFoi } from './central/pecas';

/** Uma linha da tabela no desktop. */
function Linha({ lead, aoAbrir }: { lead: Lead; aoAbrir: () => void }) {
  const { estrelas } = scoreDo(lead);
  return (
    /*
     * A LINHA INTEIRA abre o lead, a pedido do dono.
     *
     * Mirar num botão de oitenta pixels no fim de uma linha de novecentos é o
     * gesto mais caro de uma tabela, e a linha toda já era o alvo que a mão
     * procurava — o `hover` acendendo a linha inteira prometia isso e só o botão
     * cumpria.
     *
     * O botão FICA. Ele não é redundância: é o que um leitor de tela anuncia e o
     * que o teclado alcança com `Tab`. Uma `tr` com `onClick` é invisível para os
     * dois — e `role="button"` numa linha de tabela custaria a semântica da
     * tabela para devolver um foco que o botão já dá de graça.
     *
     * `cursor-pointer` porque a mão precisa saber ANTES de clicar; sem ele, a
     * linha só revela que é clicável depois que já foi clicada.
     */
    <tr
      onClick={aoAbrir}
      className="cursor-pointer border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]">
      <td className="max-w-[220px] px-4 py-4">
        <p className="truncate text-[15px] text-white" title={lead.nome}>
          {lead.nome}
        </p>
        {lead.desqualificado && (
          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/30">
            abaixo da faixa
          </p>
        )}
      </td>
      <td className="px-4 py-4">
        <Chip>{lead.origem}</Chip>
      </td>
      <td className="px-4 py-4">
        <Estrelas quantas={estrelas} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-[13px] text-white/45">
        {quandoFoi(lead.criado_em)}
      </td>
      <td className="px-4 py-4">
        <Presenca tem={Boolean(lead.arroba)} rotulo="Instagram" />
      </td>
      <td className="px-4 py-4">
        <Presenca tem={Boolean(lead.email)} rotulo="e-mail" />
      </td>
      <td className="px-4 py-4 text-right">
        <button
          type="button"
          /* O clique não sobe para a `tr`: sem isto o mesmo gesto abre o
             diálogo duas vezes — uma pelo botão, outra pela linha. */
          onClick={(evento) => {
            evento.stopPropagation();
            aoAbrir();
          }}
          className="rounded-full border border-white/[0.14] px-4 py-2 text-[13px] text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          Visualizar
        </button>
      </td>
    </tr>
  );
}

/** A mesma linha como CARTÃO, no telefone. */
function Cartao({ lead, aoAbrir }: { lead: Lead; aoAbrir: () => void }) {
  const { estrelas } = scoreDo(lead);
  return (
    <button
      type="button"
      onClick={aoAbrir}
      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 break-words text-[15px] text-white">{lead.nome}</p>
        <Estrelas quantas={estrelas} tamanho={13} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip>{lead.origem}</Chip>
        <span className="text-[12px] text-white/40">{quandoFoi(lead.criado_em)}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Presenca tem={Boolean(lead.arroba)} rotulo="Instagram" />
        <Presenca tem={Boolean(lead.email)} rotulo="e-mail" />
      </div>
    </button>
  );
}

/** A moldura de qualquer estado que não seja "tem lista": vazio, erro, carga. */
function Aviso({
  titulo,
  corpo,
  acao,
}: {
  titulo: string;
  corpo: string;
  acao?: { rotulo: string; aoClicar: () => void };
}) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <p className="font-serif text-[1.6rem] leading-tight text-white">{titulo}</p>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/45">{corpo}</p>
      {acao && (
        <button
          type="button"
          onClick={acao.aoClicar}
          className="mt-6 rounded-full border border-white/[0.16] px-5 py-2.5 text-[14px] text-white/85 transition-colors hover:bg-white/[0.08]"
        >
          {acao.rotulo}
        </button>
      )}
    </div>
  );
}

/** O esqueleto da tabela enquanto a lista não chega. */
function Esqueleto() {
  return (
    <div className="space-y-2 p-4" aria-busy="true" aria-label="Carregando leads">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

export function Central({ aoSair }: { aoSair: () => void }) {
  const painel = usarLeads();
  const [aberto, setAberto] = useState<Lead | null>(null);

  const sairDaConta = () => {
    sair();
    aoSair();
  };

  const vazioPorFiltro = painel.carga === 'pronto' && painel.filtrados.length === 0;
  const semNada = vazioPorFiltro && painel.busca === '' && painel.origem === 'todas';

  return (
    <main className="min-h-screen bg-doxa-bg px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* ── CABEÇALHO */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/50">
              <Users className="h-3 w-3" strokeWidth={2} />
              Leads
            </span>
            <h1 className="mt-4 font-serif text-[2.2rem] leading-none tracking-[-0.02em] text-white md:text-[2.8rem]">
              Central de leads
            </h1>
            <p className="mt-2 max-w-xl text-[15px] leading-snug text-white/45">
              Tudo que chegou pelo formulário do site. O que ainda não saiu num CSV fica em
              “A trabalhar”.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void painel.recarregar()}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${painel.carga === 'carregando' ? 'animate-spin' : ''}`}
                strokeWidth={2}
              />
              Atualizar
            </button>
            <button
              type="button"
              onClick={sairDaConta}
              aria-label="Sair da central"
              className="rounded-full border border-white/[0.14] p-2.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── ABAS */}
        <div className="mt-8 inline-flex rounded-full border border-white/[0.1] bg-white/[0.03] p-1">
          {([
            ['disponiveis', 'A trabalhar', painel.totalDisponiveis],
            ['baixados', 'Já baixados', painel.totalBaixados],
          ] as const).map(([chave, rotulo, quantos]) => (
            <button
              key={chave}
              type="button"
              onClick={() => painel.setAba(chave)}
              aria-pressed={painel.aba === chave}
              className={`rounded-full px-5 py-2.5 text-[14px] transition-colors ${
                painel.aba === chave
                  ? 'bg-white text-black'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {rotulo}
              <span className="ml-2 tabular-nums opacity-60">{quantos}</span>
            </button>
          ))}
        </div>

        {/* ── CONTADORES */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Contador rotulo="Total de leads" valor={painel.total} />
          <Contador
            rotulo="A trabalhar"
            valor={painel.totalDisponiveis}
            ativo={painel.aba === 'disponiveis'}
          />
          <Contador
            rotulo="Já baixados"
            valor={painel.totalBaixados}
            ativo={painel.aba === 'baixados'}
          />
        </div>

        {/* ── A TABELA */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.015]">
          <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-6">
            <div>
              <h2 className="text-[17px] font-semibold text-white">
                {painel.aba === 'baixados' ? 'Já baixados' : 'A trabalhar'}
              </h2>
              <p className="mt-1 text-[13px] text-white/40">
                {painel.filtrados.length} no filtro · {painel.comInstagram} com Instagram ·{' '}
                {painel.comEmail} com e-mail nesta página
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void painel.exportar()}
                disabled={painel.filtrados.length === 0 || painel.exportando}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition-opacity disabled:opacity-30"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                {painel.exportando ? 'Exportando…' : 'Exportar CSV'}
              </button>
              <span className="rounded-full border border-white/[0.12] px-3 py-2 text-[12px] tabular-nums text-white/50">
                Página {painel.pagina} de {painel.paginas}
              </span>
            </div>
          </div>

          {/* ── BUSCA E FILTROS */}
          <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-6">
            <label className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={painel.busca}
                onChange={(e) => painel.setBusca(e.target.value)}
                placeholder="Buscar por nome, @, e-mail, WhatsApp…"
                aria-label="Buscar leads"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] py-2.5 pl-10 pr-3 text-[14px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30"
              />
            </label>

            <select
              value={painel.origem}
              onChange={(e) => painel.setOrigem(e.target.value)}
              aria-label="Filtrar por origem"
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none focus:border-white/30"
            >
              <option value="todas">Todas as origens</option>
              {painel.origens.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              value={painel.ordem}
              onChange={(e) => painel.setOrdem(e.target.value as typeof painel.ordem)}
              aria-label="Ordenar"
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none focus:border-white/30"
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
              <option value="score">Maior score</option>
            </select>

            {/* Os cortados existem e não somem: ficam atrás de um interruptor,
                porque são medida de tráfego e não fila de trabalho. */}
            {painel.cortados > 0 && (
              <button
                type="button"
                onClick={() => painel.setMostrarCortados(!painel.mostrarCortados)}
                aria-pressed={painel.mostrarCortados}
                className={`rounded-xl border px-3 py-2.5 text-[13px] transition-colors ${
                  painel.mostrarCortados
                    ? 'border-white/30 bg-white/[0.08] text-white'
                    : 'border-white/[0.1] bg-white/[0.03] text-white/50 hover:text-white'
                }`}
              >
                Abaixo da faixa
                <span className="ml-2 tabular-nums opacity-60">{painel.cortados}</span>
              </button>
            )}
          </div>

          {/* ── OS ESTADOS */}
          {painel.carga === 'carregando' && <Esqueleto />}

          {painel.carga === 'erro' && (
            <Aviso
              titulo="Não deu para carregar."
              corpo="A lista não chegou. Pode ser a rede daqui ou o banco do outro lado."
              acao={{ rotulo: 'Tentar de novo', aoClicar: () => void painel.recarregar() }}
            />
          )}

          {painel.carga === 'sessao' && (
            <Aviso
              titulo="A sessão venceu."
              corpo="Por segurança, a entrada expira. Entre de novo para ver os leads."
              acao={{ rotulo: 'Entrar de novo', aoClicar: sairDaConta }}
            />
          )}

          {painel.carga === 'pronto' && semNada && (
            <Aviso
              titulo={painel.aba === 'baixados' ? 'Nada baixado ainda.' : 'Nenhum lead ainda.'}
              corpo={
                painel.aba === 'baixados'
                  ? 'Assim que você exportar um CSV, os leads exportados aparecem aqui.'
                  : 'Quando alguém terminar o formulário do site, ele aparece nesta lista.'
              }
            />
          )}

          {painel.carga === 'pronto' && vazioPorFiltro && !semNada && (
            <Aviso
              titulo="Nada com esse filtro."
              corpo="Nenhum lead desta aba bate com a busca. Tente outra palavra ou limpe o filtro."
              acao={{
                rotulo: 'Limpar filtros',
                aoClicar: () => {
                  painel.setBusca('');
                  painel.setOrigem('todas');
                },
              }}
            />
          )}

          {painel.carga === 'pronto' && painel.daPagina.length > 0 && (
            <>
              {/* A tabela some no telefone e vira cartões: sete colunas em 390px
                  seriam uma barra de rolagem horizontal dentro de outra. */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[880px] text-left">
                  <thead>
                    <tr className="text-[12px] uppercase tracking-[0.1em] text-white/35">
                      <th className="px-4 py-3 font-normal">Nome</th>
                      <th className="px-4 py-3 font-normal">Origem</th>
                      <th className="px-4 py-3 font-normal">Score</th>
                      <th className="px-4 py-3 font-normal">Criado há</th>
                      <th className="px-4 py-3 font-normal">Instagram</th>
                      <th className="px-4 py-3 font-normal">E-mail</th>
                      <th className="px-4 py-3 text-right font-normal">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {painel.daPagina.map((lead) => (
                      <Linha key={lead.id} lead={lead} aoAbrir={() => setAberto(lead)} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 p-4 lg:hidden">
                {painel.daPagina.map((lead) => (
                  <Cartao key={lead.id} lead={lead} aoAbrir={() => setAberto(lead)} />
                ))}
              </div>

              {painel.paginas > 1 && (
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] p-4">
                  <button
                    type="button"
                    onClick={() => painel.setPagina(painel.pagina - 1)}
                    disabled={painel.pagina <= 1}
                    className="rounded-full border border-white/[0.14] px-4 py-2 text-[13px] text-white/75 transition-opacity disabled:opacity-25"
                  >
                    Anterior
                  </button>
                  <span className="text-[13px] tabular-nums text-white/40">
                    {(painel.pagina - 1) * POR_PAGINA + 1}–
                    {Math.min(painel.pagina * POR_PAGINA, painel.filtrados.length)} de{' '}
                    {painel.filtrados.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => painel.setPagina(painel.pagina + 1)}
                    disabled={painel.pagina >= painel.paginas}
                    className="rounded-full border border-white/[0.14] px-4 py-2 text-[13px] text-white/75 transition-opacity disabled:opacity-25"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {aberto && <Detalhe lead={aberto} aoFechar={() => setAberto(null)} />}
    </main>
  );
}

export default Central;
