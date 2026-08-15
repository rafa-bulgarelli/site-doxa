/**
 * ─── CENA: A VOZ ─────────────────────────────────────────────────────────────
 *
 * A lição: **silêncio no ambiente, voz natural, sem filtro.**
 *
 * O celular está gravando. A onda entra serrada e desigual, com barulho
 * rondando em volta — música, TV, conversa. Quando o ambiente cala, o barulho
 * sai de cena e a mesma voz vira uma onda limpa e ritmada. É a diferença que a
 * pessoa vai ouvir no resultado, mostrada antes de a gente pedir qualquer
 * coisa.
 *
 * O que o desenho NÃO faz de propósito: mexer no timbre. A onda limpa continua
 * com a mesma forma de fala, só sem a sujeira em volta — clone bom sai de voz
 * natural, não de voz tratada.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { EASE, tempo, useRoteiro } from './tempo';

/** Grava com barulho · o ambiente cala · a onda limpa · o visto e a pausa. */
const FASES = [1500, 1500, 1800, 2200] as const;
const CALANDO = 1;
const LIMPA = 2;
const VISTO = 3;

const BARRA_X = 170;
const BARRA_PASSO = 15;
const BARRA_LARGURA = 6;
const EIXO = 120;

/** A onda suja: picos que não têm relação um com o outro — isso é ruído. */
const SUJA = [54, 18, 66, 24, 70, 12, 48, 62, 20, 58, 30, 68, 16, 52, 26, 64, 22, 46] as const;

/** A onda limpa: duas frases de fala, com respiro entre elas. */
const CLARA = [10, 16, 26, 38, 48, 54, 50, 40, 28, 26, 36, 48, 56, 50, 38, 26, 16, 10] as const;

/** O celular na mão, gravando: o ponto do botão pulsa enquanto roda. */
function Celular({ parado }: { parado: boolean }) {
  return (
    <g>
      <Painel x={40} y={40} largura={92} altura={160} aceso />
      <rect x={70} y={52} width={32} height={5} rx={2.5} fill={TRACO} />
      <circle cx={86} cy={170} r={14} fill="none" stroke={TRACO_ACESO} strokeWidth={1.5} />
      <motion.circle
        cx={86}
        cy={170}
        r={7}
        fill={TINTA.branco}
        // O raio, e não `scale`: escala em SVG depende da origem do transform,
        // que muda de navegador para navegador — o raio é o mesmo em todos.
        animate={parado ? { opacity: 1 } : { opacity: [1, 0.4, 1], r: [7, 5.4, 7] }}
        transition={{ duration: 1.6, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
      {/* O microfone: cápsula e haste, o desenho universal de "estou ouvindo". */}
      <rect x={80} y={92} width={12} height={26} rx={6} fill={TRACO_ACESO} />
      <path
        d="M 72 114 a 14 14 0 0 0 28 0 M 86 128 v 10"
        fill="none"
        stroke={TRACO_ACESO}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Um glifo de barulho: nota de música ou onda de som saindo de algum lugar. */
function Ruido({
  tipo,
  x,
  y,
  visivel,
  parado,
}: {
  tipo: 'nota' | 'som';
  x: number;
  y: number;
  visivel: boolean;
  parado: boolean;
}) {
  const traco =
    tipo === 'nota'
      ? 'M 0 0 v -22 l 14 -4 v 22'
      : 'M 0 -9 a 11 11 0 0 1 0 18 M 6 -16 a 19 19 0 0 1 0 32';
  // O `translate` fica no grupo de FORA e a animação no de dentro: framer
  // escreve o atributo `transform` do elemento que anima, e um `scale` aqui
  // apagaria o deslocamento — o glifo iria parar no canto do palco.
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        initial={false}
        animate={{ opacity: visivel ? 0.55 : 0 }}
        transition={{ duration: tempo(parado, 0.6), ease: EASE }}
      >
        <path
          d={traco}
          fill="none"
          stroke={TINTA.apagado}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {tipo === 'nota' && (
          <>
            <circle cx={-3} cy={0} r={5} fill={TINTA.apagado} />
            <circle cx={11} cy={-4} r={5} fill={TINTA.apagado} />
          </>
        )}
      </motion.g>
    </g>
  );
}

export default function CenaVoz() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const limpa = fase >= LIMPA;
  const alturas = limpa ? CLARA : SUJA;
  const barulho = fase < CALANDO;

  return (
    <Palco viewBox="0 0 480 240">
      <Celular parado={parado} />

      <Ruido tipo="nota" x={252} y={54} visivel={barulho} parado={parado} />
      <Ruido tipo="som" x={382} y={50} visivel={barulho} parado={parado} />
      <Ruido tipo="nota" x={338} y={200} visivel={barulho} parado={parado} />

      {alturas.map((altura, indice) => (
        <motion.rect
          key={indice}
          x={BARRA_X + indice * BARRA_PASSO}
          width={BARRA_LARGURA}
          rx={BARRA_LARGURA / 2}
          /*
           * `attrY`, e não `y`: para o framer, `y` é sempre DESLOCAMENTO, e a
           * onda inteira nasceu colada no topo até isto ser trocado — o
           * atributo `y` do retângulo ficava em zero e o translate só era
           * aplicado depois, no navegador. `attrY` mira o atributo mesmo, que
           * é o que o primeiro desenho já escreve.
           *
           * A barra sobe metade da própria altura porque a onda cresce para os
           * dois lados a partir do eixo, do jeito que um áudio se desenha.
           */
          initial={{ attrY: EIXO - altura / 2, height: altura, fill: limpa ? TRACO_ACESO : TRACO }}
          animate={{
            attrY: EIXO - altura / 2,
            height: altura,
            fill: limpa ? TRACO_ACESO : TRACO,
          }}
          transition={{
            duration: tempo(parado, 0.55),
            ease: EASE,
            delay: tempo(parado, indice * 0.02),
          }}
        />
      ))}

      {fase === VISTO && <Marca tipo="certo" x={446} y={120} cor={TINTA.protege} parado={parado} />}
    </Palco>
  );
}
