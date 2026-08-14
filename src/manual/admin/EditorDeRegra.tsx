/**
 * ─── UMA REGRA NO EDITOR ─────────────────────────────────────────────────────
 *
 * A unidade do aceite: o checkbox do cliente marca ISTO. Por isso os quatro
 * campos de texto são todos visíveis ao mesmo tempo, e não escondidos atrás de
 * um "avançado": uma regra sem POR QUE assusta em vez de ensinar, e quem
 * escreve precisa ver o vazio para preenchê-lo.
 *
 * A gravação é explícita — nada é salvo enquanto se digita. Salvar a cada tecla
 * seria um PATCH por letra num banco cujo trigger recusa metade das tentativas
 * (versão publicada), e o resultado seria uma tela piscando erro.
 */
import { useState } from 'react';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { apagarRegra, salvarRegra } from './dados';
import { APAGADO, BOTAO_BORDA, BOTAO_PRIMARIO, CampoLongo, CampoTexto } from './pecas';
import { mensagemDe } from './usarAdmin';
import type { FerramentasDoEditor } from './conteudo';
import type { RegraLinha } from '../tipos';

/** Só o que a tela edita — `id`, `secao_id` e `ordem` não se digitam. */
type CamposDaRegra = Pick<
  RegraLinha,
  'codigo' | 'titulo' | 'instrucao' | 'porque' | 'exemplo' | 'severidade' | 'obrigatoria'
>;

function camposDe(regra: RegraLinha): CamposDaRegra {
  return {
    codigo: regra.codigo,
    titulo: regra.titulo,
    instrucao: regra.instrucao,
    porque: regra.porque,
    exemplo: regra.exemplo,
    severidade: regra.severidade,
    obrigatoria: regra.obrigatoria,
  };
}

function mudou(a: CamposDaRegra, b: CamposDaRegra): boolean {
  return (Object.keys(a) as Array<keyof CamposDaRegra>).some((chave) => a[chave] !== b[chave]);
}

export function EditorDeRegra({
  regra,
  primeira,
  ultima,
  aoMover,
  ferramentas,
}: {
  regra: RegraLinha;
  primeira: boolean;
  ultima: boolean;
  aoMover: (direcao: -1 | 1) => void;
  ferramentas: FerramentasDoEditor;
}) {
  const [campos, setCampos] = useState<CamposDaRegra>(() => camposDe(regra));
  const [salvando, setSalvando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const sujo = mudou(campos, camposDe(regra));
  const mudar = <C extends keyof CamposDaRegra>(chave: C) =>
    (valor: CamposDaRegra[C]) => setCampos((atual) => ({ ...atual, [chave]: valor }));

  const salvar = async () => {
    setSalvando(true);
    try {
      await salvarRegra(regra.id, campos);
      await ferramentas.aoRecarregar();
    } catch (problema) {
      ferramentas.aoErro(mensagemDe(problema));
    } finally {
      setSalvando(false);
    }
  };

  const apagar = async () => {
    setSalvando(true);
    try {
      await apagarRegra(regra.id);
      await ferramentas.aoRecarregar();
    } catch (problema) {
      ferramentas.aoErro(mensagemDe(problema));
    } finally {
      setSalvando(false);
      setConfirmando(false);
    }
  };

  return (
    <li className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <CampoTexto rotulo="Código" valor={campos.codigo} aoMudar={mudar('codigo')} />
        <CampoTexto rotulo="Título" valor={campos.titulo} aoMudar={mudar('titulo')} />
      </div>
      <div className="mt-3 grid gap-3">
        <CampoLongo
          rotulo="A regra, em linguagem clara"
          valor={campos.instrucao}
          aoMudar={mudar('instrucao')}
        />
        <CampoLongo
          rotulo="Por que ela existe"
          valor={campos.porque}
          aoMudar={mudar('porque')}
          dica="Regra sem porquê assusta em vez de ensinar"
        />
        <CampoLongo
          rotulo="Exemplo do jeito certo"
          valor={campos.exemplo}
          aoMudar={mudar('exemplo')}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-[13px] text-white/60">
          <input
            type="checkbox"
            checked={campos.severidade === 'critica'}
            onChange={(evento) => mudar('severidade')(evento.target.checked ? 'critica' : 'normal')}
            className="h-4 w-4 cursor-pointer accent-white"
          />
          Crítica — descumprir pode invalidar a garantia
        </label>
        <label className="flex items-center gap-2 text-[13px] text-white/60">
          <input
            type="checkbox"
            checked={campos.obrigatoria}
            onChange={(evento) => mudar('obrigatoria')(evento.target.checked)}
            className="h-4 w-4 cursor-pointer accent-white"
          />
          Obrigatória — vira checkbox no aceite
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => aoMover(-1)}
            disabled={primeira}
            aria-label="Subir a regra"
            className={`${BOTAO_BORDA} px-3`}
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => aoMover(1)}
            disabled={ultima}
            aria-label="Descer a regra"
            className={`${BOTAO_BORDA} px-3`}
          >
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {confirmando ? (
            <>
              <span className="text-[13px]" style={{ color: APAGADO }}>
                Some do rascunho.
              </span>
              <button
                type="button"
                onClick={() => void apagar()}
                disabled={salvando}
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
              Apagar
            </button>
          )}
          <button
            type="button"
            onClick={() => void salvar()}
            disabled={!sujo || salvando}
            className={BOTAO_PRIMARIO}
          >
            {salvando ? 'Salvando…' : sujo ? 'Salvar regra' : 'Salvo'}
          </button>
        </div>
      </div>
    </li>
  );
}
