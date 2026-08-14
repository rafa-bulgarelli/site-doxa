/**
 * ─── AS VERSÕES DO MANUAL ────────────────────────────────────────────────────
 *
 * A vigente em destaque e o histórico embaixo. Uma versão publicada é imutável
 * (o trigger recusa qualquer edição, venha de quem vier) — o único jeito de
 * mudar o manual é DUPLICAR como rascunho, editar e publicar.
 *
 * Não há "excluir versão" aqui: rascunho a menos é o único apagar que o banco
 * aceita, e ele mora dentro do editor, onde a pessoa está vendo o que apaga.
 */
import { useState } from 'react';
import { BookOpen, Copy, Pencil } from 'lucide-react';
import { dataCompleta } from '../../leads/central/pecas';
import { criarRascunho } from './dados';
import { Aviso, BOTAO_BORDA, BOTAO_PRIMARIO, Erro, Esqueleto, Etiqueta } from './pecas';
import { mensagemDe } from './usarAdmin';
import type { EstadoDoPainel } from './usarAdmin';
import type { StatusDaVersao, VersaoLinha } from '../tipos';

const ROTULO_DO_STATUS: Record<StatusDaVersao, string> = {
  rascunho: 'Rascunho',
  publicada: 'Vigente',
  arquivada: 'Arquivada',
};

function quantosConvites(painel: EstadoDoPainel, versaoId: string): number {
  return painel.convites.filter((convite) => convite.versao_id === versaoId).length;
}

export function Versoes({
  painel,
  ir,
}: {
  painel: EstadoDoPainel;
  ir: (destino: string) => void;
}) {
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const duplicar = async (origem: VersaoLinha) => {
    setOcupado(origem.id);
    setErro(null);
    try {
      const nova = await criarRascunho(origem.id);
      await painel.recarregar();
      ir(`/manual/${nova.versao_id}`);
    } catch (problema) {
      setErro(mensagemDe(problema));
    } finally {
      setOcupado(null);
    }
  };

  if (painel.carga === 'carregando') return <Esqueleto linhas={4} />;

  if (painel.versoes.length === 0) {
    return (
      <Aviso
        titulo="Nenhuma versão ainda."
        corpo="O manual começa por uma versão publicada — ela é aplicada no SQL, junto do esquema, e depois se duplica como rascunho para evoluir."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Erro mensagem={erro} />

      {painel.versoes.map((versao) => {
        const vigente = versao.status === 'publicada';
        const rascunho = versao.status === 'rascunho';
        return (
          <section
            key={versao.id}
            className={`rounded-2xl border p-5 sm:p-6 ${
              vigente ? 'border-white/[0.18] bg-white/[0.05]' : 'border-white/[0.08] bg-white/[0.015]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Etiqueta>v{versao.numero}</Etiqueta>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                    {ROTULO_DO_STATUS[versao.status]}
                  </span>
                </div>
                <p className="mt-2 font-serif text-[1.5rem] leading-tight text-white">
                  {versao.titulo}
                </p>
                <p className="mt-2 text-[13px] text-white/40">
                  criada em {dataCompleta(versao.criado_em)}
                  {versao.publicado_em != null && ` · publicada em ${dataCompleta(versao.publicado_em)}`}
                  {` · ${quantosConvites(painel, versao.id)} convites`}
                </p>
                {versao.hash_conteudo != null && (
                  <p className="mt-2 break-all font-mono text-[11px] text-white/25">
                    {versao.hash_conteudo}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => ir(`/manual/${versao.id}`)}
                  className={rascunho ? BOTAO_PRIMARIO : BOTAO_BORDA}
                >
                  {rascunho ? (
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  {rascunho ? 'Editar rascunho' : 'Ver conteúdo'}
                </button>
                <button
                  type="button"
                  onClick={() => void duplicar(versao)}
                  disabled={ocupado === versao.id}
                  className={BOTAO_BORDA}
                >
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  {ocupado === versao.id ? 'Duplicando…' : 'Duplicar como rascunho'}
                </button>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
