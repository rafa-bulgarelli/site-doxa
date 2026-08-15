/**
 * ─── A LISTA QUE PROTEGE A GARANTIA ──────────────────────────────────────────
 *
 * O único lugar do fluxo com checkbox. O dono foi direto: a rotina de postagem
 * tem que ficar claríssima, como uma lista de itens — não como oito telas de
 * texto contratual.
 *
 * Cada item é uma linha só de leitura: número, título forte, a instrução, e o
 * porquê a UM TOQUE (a revelação). O alvo de toque é a linha inteira, com 64px
 * de altura mínima — isto é marcado com o polegar, em pé, e um erro de clique
 * aqui é o cliente confirmando o que não leu.
 *
 * A cor é funcional e existe só aqui, com autorização do dono para esta tela:
 * verde é o item que protege a garantia quando confirmado, vermelho é o aviso
 * de que descumprir quebra. Fora desta lista o manual segue monocromático como
 * o resto do site.
 *
 * As regras informativas do mesmo capítulo (o "o que NÃO quebra") viram nota de
 * alívio: sem caixa, sem cobrança. Quem chegou até aqui leu oito condições
 * seguidas e precisa saber que a rotina tem folga de verdade.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, Revelacao } from './pecas';
import type { Regra } from '../tipos';

/* ─── UM ITEM ──────────────────────────────────────────────────────────────── */

/**
 * O quadrado marcado.
 *
 * O `input` de verdade é `sr-only` (o desenho nativo não dá para estilizar sem
 * gambiarra), então o anel de foco do teclado tem que vir dele para cá pelo
 * `peer` — sem isso quem navega por tabulação não vê onde está, e a caixa some
 * do caminho de quem mais precisa dela.
 */
function Marca({ marcada }: { marcada: boolean }) {
  const semMovimento = useReducedMotion() === true;
  return (
    <span
      aria-hidden
      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-doxa-bg ${
        marcada ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/30 text-transparent'
      }`}
    >
      <motion.span
        initial={false}
        animate={{ scale: marcada ? 1 : 0.4, opacity: marcada ? 1 : 0 }}
        transition={{ duration: semMovimento ? 0 : 0.2, ease: EASE }}
        className="text-[17px] leading-none"
      >
        ✓
      </motion.span>
    </span>
  );
}

function ItemDeAceite({
  regra,
  numero,
  marcada,
  aoAlternar,
}: {
  regra: Regra;
  numero: number;
  marcada: boolean;
  aoAlternar: () => void;
}) {
  const temPorque = regra.porque.trim().length > 0;
  const temExemplo = regra.exemplo.trim().length > 0;
  return (
    <li
      className={`rounded-3xl border transition-colors ${
        marcada ? 'border-emerald-400/35 bg-emerald-400/[0.05]' : 'border-doxa-line bg-doxa-surface'
      }`}
    >
      {/* O rótulo inteiro é o alvo: 64px de altura mínima, sem ilha de 16px. */}
      <label className="flex min-h-[64px] cursor-pointer items-start gap-4 p-5">
        <input
          type="checkbox"
          checked={marcada}
          onChange={aoAlternar}
          className="peer sr-only"
        />
        <Marca marcada={marcada} />
        <span className="min-w-0">
          <span className="block text-[14px] uppercase tracking-[0.16em] text-doxa-muted">
            Item {numero}
          </span>
          <span className="mt-1.5 block text-[19px] font-medium leading-[1.35] text-white">
            {regra.titulo}
          </span>
          <span className="mt-2.5 block text-[17px] leading-[1.7] text-white/75">
            {regra.instrucao}
          </span>
        </span>
      </label>
      {(temPorque || temExemplo) && (
        <div className="px-5 pb-5 pl-[4.5rem]">
          <Revelacao rotulo="Por que isso protege você">
            <div className="space-y-3 border-l border-white/[0.14] pl-4">
              {temPorque && (
                <p className="text-[17px] leading-[1.7] text-white/65">{regra.porque}</p>
              )}
              {temExemplo && (
                <p className="text-[17px] leading-[1.7] text-white/65">
                  <span className="text-white/45">Na prática: </span>
                  {regra.exemplo}
                </p>
              )}
            </div>
          </Revelacao>
        </div>
      )}
    </li>
  );
}

/* ─── A NOTA DE ALÍVIO ─────────────────────────────────────────────────────── */

/** Sem caixa e sem cobrança: é a folga da rotina, não mais uma condição. */
function NotaDeAlivio({ regra }: { regra: Regra }) {
  const temPorque = regra.porque.trim().length > 0;
  return (
    <div className="mt-6 rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.04] p-6">
      <p className="text-[14px] uppercase tracking-[0.16em] text-emerald-300/70">Respire</p>
      <h3 className="mt-2 font-serif text-[24px] leading-[1.2] text-white">{regra.titulo}</h3>
      <p className="mt-3 text-[17px] leading-[1.7] text-white/75">{regra.instrucao}</p>
      {temPorque && <p className="mt-3 text-[17px] leading-[1.7] text-white/55">{regra.porque}</p>}
    </div>
  );
}

/* ─── A LISTA ──────────────────────────────────────────────────────────────── */

export function ListaDeAceites({
  obrigatorias,
  alivios,
  marcadas,
  aoAlternar,
}: {
  obrigatorias: Regra[];
  /** As informativas do mesmo capítulo. Aparecem depois da lista, sem caixa. */
  alivios: Regra[];
  marcadas: readonly string[];
  aoAlternar: (id: string) => void;
}) {
  const feitas = obrigatorias.filter((regra) => marcadas.includes(regra.id)).length;
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-rose-400/25 bg-rose-400/[0.04] px-5 py-4">
        <p className="text-[17px] leading-[1.5] text-white/75">
          Cada item aqui, descumprido, pode quebrar a garantia.
        </p>
        <p className="shrink-0 text-[17px] tabular-nums text-white" role="status">
          <span className={feitas === obrigatorias.length ? 'text-emerald-300' : ''}>{feitas}</span>
          /{obrigatorias.length}
        </p>
      </div>

      <ul className="mt-5 space-y-4">
        {obrigatorias.map((regra, indice) => (
          <ItemDeAceite
            key={regra.id}
            regra={regra}
            numero={indice + 1}
            marcada={marcadas.includes(regra.id)}
            aoAlternar={() => aoAlternar(regra.id)}
          />
        ))}
      </ul>

      {alivios.map((regra) => (
        <NotaDeAlivio key={regra.id} regra={regra} />
      ))}
    </div>
  );
}
