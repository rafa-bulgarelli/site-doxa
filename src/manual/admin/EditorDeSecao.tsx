/**
 * ─── UMA SEÇÃO NO EDITOR ─────────────────────────────────────────────────────
 *
 * O cabeçalho da seção e as regras dela. O SLUG não se digita: ele nasce do
 * título e é o endereço da seção dentro da versão (o par versão+slug é único no
 * banco). Deixar alguém digitá-lo à mão só criaria a chance de escrever
 * "Operação" com acento num campo que o `check` recusa.
 */
import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { apagarSecao, criarRegra, salvarRegra, salvarSecao } from './dados';
import { proximaOrdem, proximoCodigo, trocarOrdem } from './conteudo';
import { EditorDeRegra } from './EditorDeRegra';
import {
  APAGADO,
  BOTAO_BORDA,
  BOTAO_PRIMARIO,
  CampoLongo,
  CampoTexto,
  Etiqueta,
  ROTULO,
} from './pecas';
import { mensagemDe } from './usarAdmin';
import type { FerramentasDoEditor } from './conteudo';
import type { RegraLinha, SecaoLinha } from '../tipos';

export function EditorDeSecao({
  secao,
  regras,
  primeira,
  ultima,
  aoMover,
  ferramentas,
}: {
  secao: SecaoLinha;
  /** Só as regras DESTA seção, já na ordem. */
  regras: RegraLinha[];
  primeira: boolean;
  ultima: boolean;
  aoMover: (direcao: -1 | 1) => void;
  ferramentas: FerramentasDoEditor;
}) {
  const [titulo, setTitulo] = useState(secao.titulo);
  const [descricao, setDescricao] = useState(secao.descricao);
  const [ocupado, setOcupado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const sujo = titulo !== secao.titulo || descricao !== secao.descricao;

  const executar = async (acao: () => Promise<void>) => {
    setOcupado(true);
    try {
      await acao();
      await ferramentas.aoRecarregar();
    } catch (problema) {
      ferramentas.aoErro(mensagemDe(problema));
    } finally {
      setOcupado(false);
      setConfirmando(false);
    }
  };

  const salvar = () => void executar(() => salvarSecao(secao.id, { titulo, descricao }));

  const apagar = () => void executar(() => apagarSecao(secao.id));

  const novaRegra = () =>
    void executar(() =>
      criarRegra({
        secao_id: secao.id,
        codigo: proximoCodigo(regras),
        titulo: 'Regra nova',
        // O `check` do banco cobra pelo menos dois caracteres em `instrucao`;
        // um texto de exemplo é melhor do que um erro no primeiro clique.
        instrucao: 'Escreva aqui o que fazer, em uma frase.',
        porque: '',
        exemplo: '',
        severidade: 'normal',
        obrigatoria: true,
        ordem: proximaOrdem(regras),
      }),
    );

  const moverRegra = (id: string, direcao: -1 | 1) =>
    void executar(async () => {
      for (const nova of trocarOrdem(regras, id, direcao)) {
        // Em série: são duas linhas trocando de lugar, e o banco precisa ver
        // as duas — disparar em paralelo só economizaria milissegundos.
        await salvarRegra(nova.id, { ordem: nova.ordem });
      }
    });

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Etiqueta>{secao.slug}</Etiqueta>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => aoMover(-1)}
            disabled={primeira || ocupado}
            aria-label="Subir a seção"
            className={`${BOTAO_BORDA} px-3`}
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => aoMover(1)}
            disabled={ultima || ocupado}
            aria-label="Descer a seção"
            className={`${BOTAO_BORDA} px-3`}
          >
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <CampoTexto rotulo="Título da seção" valor={titulo} aoMudar={setTitulo} />
        <CampoLongo
          rotulo="Abertura"
          valor={descricao}
          aoMudar={setDescricao}
          dica="O contexto antes da primeira regra"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {confirmando ? (
            <>
              <span className="text-[13px]" style={{ color: APAGADO }}>
                A seção e as {regras.length} regras dela somem.
              </span>
              <button
                type="button"
                onClick={apagar}
                disabled={ocupado}
                className="inline-flex items-center gap-2 rounded-full border border-[#E0453F]/50 px-4 py-2 text-[13px] font-semibold text-[#E0453F] transition-colors hover:bg-[#E0453F]/10 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                Apagar mesmo
              </button>
              <button type="button" onClick={() => setConfirmando(false)} className={BOTAO_BORDA}>
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirmando(true)} className={BOTAO_BORDA}>
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              Apagar seção
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={salvar}
          disabled={!sujo || ocupado}
          className={BOTAO_PRIMARIO}
        >
          {ocupado ? 'Salvando…' : sujo ? 'Salvar seção' : 'Salvo'}
        </button>
      </div>

      <ul className="mt-5 space-y-3">
        {regras.map((regra, indice) => (
          <EditorDeRegra
            key={regra.id}
            regra={regra}
            primeira={indice === 0}
            ultima={indice === regras.length - 1}
            aoMover={(direcao) => moverRegra(regra.id, direcao)}
            ferramentas={ferramentas}
          />
        ))}
      </ul>

      <button type="button" onClick={novaRegra} disabled={ocupado} className={`mt-4 ${BOTAO_BORDA}`}>
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        Regra nova
      </button>
    </section>
  );
}

/** A mesma seção, só de leitura — o que se vê de uma versão publicada. */
export function SecaoLida({ secao, regras }: { secao: SecaoLinha; regras: RegraLinha[] }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-6">
      <Etiqueta>{secao.slug}</Etiqueta>
      <h3 className="mt-3 font-serif text-[1.5rem] leading-tight text-white">{secao.titulo}</h3>
      {secao.descricao.length > 0 && (
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-white/55">
          {secao.descricao}
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {regras.map((regra) => (
          <li key={regra.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[12px] text-white/45">{regra.codigo}</span>
              <span className="text-[15px] text-white">{regra.titulo}</span>
              {regra.severidade === 'critica' && (
                <span className={ROTULO} style={{ color: APAGADO }}>
                  Crítica
                </span>
              )}
              {!regra.obrigatoria && <span className={ROTULO}>Informativa</span>}
            </div>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-white/70">
              {regra.instrucao}
            </p>
            {regra.porque.length > 0 && (
              <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-white/45">
                Por quê: {regra.porque}
              </p>
            )}
            {regra.exemplo.length > 0 && (
              <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-white/45">
                Exemplo: {regra.exemplo}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
