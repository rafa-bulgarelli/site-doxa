/**
 * ─── OS CONVITES ─────────────────────────────────────────────────────────────
 *
 * A lista de trabalho do CX: busca, filtro por situação e por versão, ordem,
 * página, e as ações que existem sobre um convite — revogar, regenerar, excluir
 * e abrir o detalhe.
 *
 * A linha inteira abre o convite, como na Central: mirar num botão pequeno no
 * fim de uma linha larga é o gesto mais caro de uma tabela. O botão continua lá
 * porque é ele que o teclado alcança e o leitor de tela anuncia.
 *
 * REVOGAR e EXCLUIR não são a mesma coisa, e a tela não pode deixar confundir:
 * revogar mata o link e MANTÉM o rastro; excluir apaga a linha e o que pende
 * dela. Por isso cada um pede a própria confirmação, e nunca as duas ao mesmo
 * tempo — duas perguntas vermelhas abertas na mesma linha é o cenário em que se
 * responde a errada.
 */
import { useEffect, useState } from 'react';
import { Ban, Download, Plus, RotateCcw, Search } from 'lucide-react';
import { quandoFoi } from '../../leads/central/pecas';
import { baixarCsvDeConvites } from './csv';
import { excluirConvite, regenerarConvite, registrarEvento, revogarConvite } from './dados';
import {
  ROTULO_DA_SITUACAO,
  SITUACOES,
  derivarConvites,
  podeExcluir,
  situacaoDo,
} from './filtrar';
import { LinkRevelado, NovoConvite } from './NovoConvite';
import {
  Aviso,
  BOTAO_BORDA,
  BOTAO_DESISTIR,
  BOTAO_PERIGO_BORDA,
  BOTAO_PRIMARIO,
  Erro,
  Esqueleto,
  Etiqueta,
  ExcluirEmDoisTempos,
  ROTULO,
  Selo,
} from './pecas';
import { POR_PAGINA, mensagemDe } from './usarAdmin';
import type { EstadoDoPainel } from './usarAdmin';
import type { OrdemDeConvite, Situacao } from './filtrar';
import type { ConviteLinha, VersaoLinha } from '../tipos';

const CAIXA_DE_FILTRO =
  'rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none focus:border-white/30';

/** Qual pergunta está aberta numa linha. Uma de cada vez, e só numa linha. */
type PedidoDeCerteza = 'revogar' | 'excluir';

interface AcoesProps {
  convite: ConviteLinha;
  ocupado: boolean;
  certeza: PedidoDeCerteza | null;
  aoPedirCerteza: (pedido: PedidoDeCerteza) => void;
  aoDesistir: () => void;
  aoRevogar: () => void;
  aoRegenerar: () => void;
  aoExcluir: () => void;
}

/** Revogar, com o "tem certeza?" em dois tempos no mesmo lugar. */
function Revogar({
  ocupado,
  confirmando,
  aoPedir,
  aoDesistir,
  aoRevogar,
}: {
  ocupado: boolean;
  confirmando: boolean;
  aoPedir: () => void;
  aoDesistir: () => void;
  aoRevogar: () => void;
}) {
  if (!confirmando) {
    return (
      <button type="button" onClick={aoPedir} className={BOTAO_BORDA} disabled={ocupado}>
        <Ban className="h-3.5 w-3.5" strokeWidth={2} />
        Revogar
      </button>
    );
  }
  return (
    <>
      <button type="button" onClick={aoRevogar} disabled={ocupado} className={BOTAO_PERIGO_BORDA}>
        <Ban className="h-3.5 w-3.5" strokeWidth={2.5} />
        {ocupado ? 'Revogando…' : 'Revogar mesmo'}
      </button>
      <button type="button" onClick={aoDesistir} disabled={ocupado} className={BOTAO_DESISTIR}>
        Cancelar
      </button>
    </>
  );
}

/** As ações de um convite. Enquanto uma pergunta está aberta, o resto some. */
function Acoes({
  convite,
  ocupado,
  certeza,
  aoPedirCerteza,
  aoDesistir,
  aoRevogar,
  aoRegenerar,
  aoExcluir,
}: AcoesProps) {
  const vivo = convite.status === 'pendente' || convite.status === 'aberto';
  return (
    <div
      className="flex flex-wrap items-center justify-end gap-2"
      /* O clique nas ações não sobe para a linha: sem isto, revogar abriria o
         detalhe por baixo do diálogo de confirmação. */
      onClick={(evento) => evento.stopPropagation()}
    >
      {vivo && certeza !== 'excluir' && (
        <Revogar
          ocupado={ocupado}
          confirmando={certeza === 'revogar'}
          aoPedir={() => aoPedirCerteza('revogar')}
          aoDesistir={aoDesistir}
          aoRevogar={aoRevogar}
        />
      )}
      {convite.status !== 'concluido' && certeza == null && (
        <button type="button" onClick={aoRegenerar} className={BOTAO_BORDA} disabled={ocupado}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Regenerar
        </button>
      )}
      {/* Concluído não tem este botão: ele carrega a prova, e a API recusa. */}
      {podeExcluir(convite) && certeza !== 'revogar' && (
        <ExcluirEmDoisTempos
          confirmando={certeza === 'excluir'}
          ocupado={ocupado}
          aoPedir={() => aoPedirCerteza('excluir')}
          aoConfirmar={aoExcluir}
          aoDesistir={aoDesistir}
        />
      )}
    </div>
  );
}

function numeroDaVersao(versoes: readonly VersaoLinha[], id: string): string {
  const achada = versoes.find((versao) => versao.id === id);
  return achada == null ? '—' : `v${achada.numero}`;
}

export function Convites({
  painel,
  ir,
  situacaoInicial,
}: {
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
  situacaoInicial: Situacao | 'todos';
}) {
  const [busca, setBusca] = useState('');
  const [situacao, setSituacao] = useState<Situacao | 'todos'>(situacaoInicial);
  const [versaoId, setVersaoId] = useState('todas');
  const [ordem, setOrdem] = useState<OrdemDeConvite>('recentes');
  const [pagina, setPagina] = useState(1);
  const [formAberto, setFormAberto] = useState(false);
  const [revelado, setRevelado] = useState<{ link: string; conviteId: string } | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  /* A pergunta aberta guarda o convite E qual gesto — sem o gesto, "sim" numa
     linha responderia a pergunta que a outra linha estava fazendo. */
  const [certeza, setCerteza] = useState<{ id: string; pedido: PedidoDeCerteza } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Qualquer mexida no filtro volta para a primeira página: manter a página
  // sete depois de uma busca que devolve três resultados mostra uma tela vazia
  // que parece defeito.
  useEffect(() => {
    setPagina(1);
  }, [busca, situacao, versaoId, ordem]);

  const agora = Date.now();
  const visao = derivarConvites(
    painel.convites,
    { busca, situacao, versaoId, ordem, pagina, porPagina: POR_PAGINA },
    agora,
  );

  const agir = async (id: string, acao: () => Promise<void>) => {
    setOcupado(id);
    setErro(null);
    try {
      await acao();
      await painel.recarregar();
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setOcupado(null);
      setCerteza(null);
    }
  };

  const revogar = (id: string) => void agir(id, () => revogarConvite(id));

  /* Excluído o convite, a lista recarrega pelo `agir`: deixar a linha apagada
     na tela convidaria o segundo clique num id que não existe mais. */
  const excluir = (id: string) => void agir(id, () => excluirConvite(id));

  const regenerar = (id: string) =>
    void agir(id, async () => {
      const criado = await regenerarConvite(id);
      setRevelado({ link: criado.link, conviteId: criado.convite_id });
    });

  /* As mesmas ações aparecem na tabela e no cartão do telefone. Montar as duas
     à mão era o convite a esquecer um `aoDesistir` num dos lados. */
  const acoesDe = (convite: ConviteLinha): AcoesProps => ({
    convite,
    ocupado: ocupado === convite.id,
    certeza: certeza != null && certeza.id === convite.id ? certeza.pedido : null,
    aoPedirCerteza: (pedido) => setCerteza({ id: convite.id, pedido }),
    aoDesistir: () => setCerteza(null),
    aoRevogar: () => revogar(convite.id),
    aoRegenerar: () => regenerar(convite.id),
    aoExcluir: () => excluir(convite.id),
  });

  const exportar = () => {
    if (visao.filtrados.length === 0) return;
    baixarCsvDeConvites(visao.filtrados, painel.versoes);
    // A exportação vira evento: saber que uma lista de clientes saiu daqui, e
    // quando, é o mínimo de rastro que um dado de terceiro exige.
    void registrarEvento('exportacao_csv', null, { quantos: visao.filtrados.length }).catch(
      () => undefined,
    );
  };

  return (
    <div className="space-y-4">
      {revelado != null && (
        <LinkRevelado
          link={revelado.link}
          conviteId={revelado.conviteId}
          aoFechar={() => setRevelado(null)}
        />
      )}

      {formAberto && (
        <NovoConvite
          vigente={painel.vigente}
          aoFechar={() => setFormAberto(false)}
          aoCriar={(link, conviteId) => {
            setRevelado({ link, conviteId });
            setFormAberto(false);
            void painel.recarregar();
          }}
        />
      )}

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015]">
        <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-6">
          <div>
            <h2 className="text-[17px] font-semibold text-white">Convites</h2>
            <p className="mt-1 text-[13px] tabular-nums text-white/40">
              {visao.filtrados.length} no filtro · {visao.contagem.concluido} concluídos ·{' '}
              {visao.contagem.pendente + visao.contagem.aberto} em aberto
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setFormAberto(true)} className={BOTAO_PRIMARIO}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Convite novo
            </button>
            <button
              type="button"
              onClick={exportar}
              disabled={visao.filtrados.length === 0}
              className={BOTAO_BORDA}
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* ── BUSCA E FILTROS */}
        <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-6">
          <label className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar por empresa, e-mail ou nome…"
              aria-label="Buscar convites"
              className={`${CAIXA_DE_FILTRO} w-full py-2.5 pl-10 pr-3 placeholder:text-white/25`}
            />
          </label>

          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as Situacao | 'todos')}
            aria-label="Filtrar por situação"
            className={CAIXA_DE_FILTRO}
          >
            <option value="todos">Todas as situações</option>
            {SITUACOES.map((chave) => (
              <option key={chave} value={chave}>
                {ROTULO_DA_SITUACAO[chave]}
              </option>
            ))}
          </select>

          <select
            value={versaoId}
            onChange={(evento) => setVersaoId(evento.target.value)}
            aria-label="Filtrar por versão"
            className={CAIXA_DE_FILTRO}
          >
            <option value="todas">Todas as versões</option>
            {painel.versoes.map((versao) => (
              <option key={versao.id} value={versao.id}>
                v{versao.numero} — {versao.titulo}
              </option>
            ))}
          </select>

          <select
            value={ordem}
            onChange={(evento) => setOrdem(evento.target.value as OrdemDeConvite)}
            aria-label="Ordenar"
            className={CAIXA_DE_FILTRO}
          >
            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>
            <option value="empresa">Empresa (A–Z)</option>
          </select>
        </div>

        {erro != null && (
          <div className="px-4 pb-2 sm:px-6">
            <Erro mensagem={erro} />
          </div>
        )}

        {painel.carga === 'carregando' && <Esqueleto />}

        {painel.carga === 'pronto' && visao.filtrados.length === 0 && (
          <Aviso
            titulo={painel.convites.length === 0 ? 'Nenhum convite ainda.' : 'Nada com esse filtro.'}
            corpo={
              painel.convites.length === 0
                ? 'Crie o primeiro convite, copie o link e mande pelo WhatsApp.'
                : 'Nenhum convite bate com a busca. Tente outra palavra ou limpe o filtro.'
            }
            acao={
              painel.convites.length === 0
                ? { rotulo: 'Convite novo', aoClicar: () => setFormAberto(true) }
                : {
                    rotulo: 'Limpar filtros',
                    aoClicar: () => {
                      setBusca('');
                      setSituacao('todos');
                      setVersaoId('todas');
                    },
                  }
            }
          />
        )}

        {painel.carga === 'pronto' && visao.daPagina.length > 0 && (
          <>
            {/* A tabela some no telefone e vira cartões: sete colunas em 390px
                seriam uma barra de rolagem horizontal dentro de outra. */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[980px] text-left">
                <thead>
                  <tr className={ROTULO}>
                    <th className="px-4 py-3 font-normal">Empresa</th>
                    <th className="px-4 py-3 font-normal">Quem assina</th>
                    <th className="px-4 py-3 font-normal">Situação</th>
                    <th className="px-4 py-3 font-normal">Versão</th>
                    <th className="px-4 py-3 font-normal">Criado há</th>
                    <th className="px-4 py-3 text-right font-normal">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visao.daPagina.map((convite) => (
                    <tr
                      key={convite.id}
                      onClick={() => ir(`/convites/${convite.id}`)}
                      className="cursor-pointer border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="max-w-[240px] px-4 py-4">
                        <p className="truncate text-[15px] text-white" title={convite.empresa}>
                          {convite.empresa}
                        </p>
                        <p className="truncate text-[12px] text-white/40">{convite.email}</p>
                      </td>
                      <td className="max-w-[180px] px-4 py-4 text-[14px] text-white/70">
                        {convite.nome_cliente ?? <span className="text-white/25">o cliente diz</span>}
                      </td>
                      <td className="px-4 py-4">
                        <Selo situacao={situacaoDo(convite, agora)} />
                      </td>
                      <td className="px-4 py-4">
                        <Etiqueta>{numeroDaVersao(painel.versoes, convite.versao_id)}</Etiqueta>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[13px] text-white/45">
                        {quandoFoi(convite.criado_em)}
                      </td>
                      <td className="px-4 py-4">
                        <Acoes {...acoesDe(convite)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 p-4 lg:hidden">
              {visao.daPagina.map((convite) => (
                <div
                  key={convite.id}
                  onClick={() => ir(`/convites/${convite.id}`)}
                  className="cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={(evento) => {
                        evento.stopPropagation();
                        ir(`/convites/${convite.id}`);
                      }}
                      className="min-w-0 flex-1 break-words text-left text-[15px] text-white"
                    >
                      {convite.empresa}
                    </button>
                    <Selo situacao={situacaoDo(convite, agora)} />
                  </div>
                  <p className="mt-1 break-words text-[12px] text-white/40">{convite.email}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Etiqueta>{numeroDaVersao(painel.versoes, convite.versao_id)}</Etiqueta>
                    <span className="text-[12px] text-white/40">{quandoFoi(convite.criado_em)}</span>
                  </div>
                  <div className="mt-3">
                    <Acoes {...acoesDe(convite)} />
                  </div>
                </div>
              ))}
            </div>

            {visao.paginas > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] p-4">
                <button
                  type="button"
                  onClick={() => setPagina(visao.pagina - 1)}
                  disabled={visao.pagina <= 1}
                  className={BOTAO_BORDA}
                >
                  Anterior
                </button>
                <span className="text-[13px] tabular-nums text-white/40">
                  {(visao.pagina - 1) * POR_PAGINA + 1}–
                  {Math.min(visao.pagina * POR_PAGINA, visao.filtrados.length)} de{' '}
                  {visao.filtrados.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPagina(visao.pagina + 1)}
                  disabled={visao.pagina >= visao.paginas}
                  className={BOTAO_BORDA}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
