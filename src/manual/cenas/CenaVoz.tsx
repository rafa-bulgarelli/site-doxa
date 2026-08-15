/**
 * ─── CENA: A VOZ ─────────────────────────────────────────────────────────────
 *
 * A lição: **silêncio no ambiente, voz natural, sem filtro.**
 *
 * O celular está gravando. A onda entra serrada e cinza, com barulho rondando
 * em volta — música, TV, conversa. Quando o ambiente cala, o barulho sai de cena
 * e a MESMA voz vira uma onda limpa, ritmada e acesa no arco inteiro de cor. É a
 * diferença que a pessoa vai ouvir no resultado, mostrada antes de a gente pedir
 * qualquer coisa.
 *
 * A cor é o argumento: o quadro sujo é cinza, o quadro limpo é o arco Siri
 * correndo pela onda. Ninguém precisa saber o que é ruído para ver qual dos dois
 * é o bom.
 *
 * O que o desenho NÃO faz de propósito: mexer no timbre. A onda limpa continua
 * com a mesma forma de fala, só sem a sujeira em volta — clone bom sai de voz
 * natural, não de voz tratada.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { ARCO, Brilho, Faiscas, Poeira, TracoDeLuz, corDoArco } from './luz';
import { EASE, tempo, useRoteiro } from './tempo';

/** Grava com barulho · o ambiente cala · a onda limpa · o visto e a pausa. */
const FASES = [1600, 1400, 2000, 2400] as const;
const CALANDO = 1;
const LIMPA = 2;
const VISTO = 3;

const BARRA_X = 196;
const BARRA_PASSO = 17;
const BARRA_LARGURA = 7;
const EIXO = 124;

/** A onda suja: picos que não têm relação um com o outro — isso é ruído. */
const SUJA = [54, 18, 66, 24, 70, 12, 48, 62, 20, 58, 30, 68, 16, 52, 26, 64, 22, 46] as const;

/** A onda limpa: duas frases de fala, com respiro entre elas. */
const CLARA = [12, 20, 32, 48, 62, 72, 66, 52, 34, 30, 44, 62, 74, 66, 50, 34, 20, 12] as const;

/** O celular na mão, gravando: o botão pulsa e o anel de luz respira com ele. */
function Celular({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho x={88} y={188} raio={72} tinta="luzQuente" aceso parado={parado} />
      <Painel x={36} y={30} largura={104} altura={180} tinta="arcoVertical" vidro />
      <rect x={70} y={44} width={36} height={5} rx={2.5} fill={TRACO} />
      <motion.circle
        cx={88}
        cy={176}
        r={15}
        fill="none"
        stroke={ARCO[1]}
        strokeWidth={1.8}
        animate={parado ? { opacity: 1 } : { opacity: [0.45, 1, 0.45], r: [15, 17.5, 15] }}
        transition={{ duration: 1.6, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={88}
        cy={176}
        r={7.5}
        fill={ARCO[0]}
        // O raio, e não `scale`: escala em SVG depende da origem do transform,
        // que muda de navegador para navegador — o raio é o mesmo em todos.
        animate={parado ? { opacity: 1 } : { opacity: [1, 0.5, 1], r: [7.5, 5.6, 7.5] }}
        transition={{ duration: 1.6, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
      {/* O microfone: cápsula e haste, o desenho universal de "estou ouvindo". */}
      <rect x={81} y={92} width={14} height={30} rx={7} fill={TRACO_ACESO} />
      <TracoDeLuz
        d="M 72 118 a 16 16 0 0 0 32 0 M 88 134 v 12"
        cor={TRACO_ACESO}
        largura={2.2}
        parado={parado}
      />
    </g>
  );
}

interface RuidoProps {
  readonly tipo: 'nota' | 'som';
  readonly x: number;
  readonly y: number;
  readonly cor: string;
  readonly visivel: boolean;
  readonly parado: boolean;
}

/** Um glifo de barulho: nota de música ou onda de som saindo de algum lugar. */
function Ruido({ tipo, x, y, cor, visivel, parado }: RuidoProps) {
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
        animate={{ opacity: visivel ? 0.85 : 0, y: visivel ? 0 : -14 }}
        transition={{ duration: tempo(parado, 0.6), ease: EASE }}
      >
        <TracoDeLuz d={traco} cor={cor} largura={2.5} halo={2.2} parado={parado} />
        {tipo === 'nota' && (
          <>
            <circle cx={-3} cy={0} r={5.5} fill={cor} />
            <circle cx={11} cy={-4} r={5.5} fill={cor} />
          </>
        )}
      </motion.g>
    </g>
  );
}

/** A onda: cinza e serrada com barulho, acesa e ritmada quando o ambiente cala. */
function Onda({ limpa, parado }: { limpa: boolean; parado: boolean }) {
  const alturas = limpa ? CLARA : SUJA;
  return (
    <g>
      {alturas.map((altura, indice) => (
        <motion.rect
          key={indice}
          x={BARRA_X + indice * BARRA_PASSO}
          width={BARRA_LARGURA}
          rx={BARRA_LARGURA / 2}
          /*
           * `attrY`, e não `y`: para o framer, `y` é sempre DESLOCAMENTO, e a
           * onda inteira nasceu colada no topo até isto ser trocado — o atributo
           * `y` do retângulo ficava em zero e o translate só era aplicado
           * depois, no navegador. `attrY` mira o atributo mesmo, que é o que o
           * primeiro desenho já escreve.
           *
           * A barra sobe metade da própria altura porque a onda cresce para os
           * dois lados a partir do eixo, do jeito que um áudio se desenha.
           */
          initial={{ attrY: EIXO - altura / 2, height: altura }}
          animate={{ attrY: EIXO - altura / 2, height: altura }}
          fill={limpa ? corDoArco(indice / (alturas.length - 1)) : TRACO}
          transition={{
            duration: tempo(parado, 0.55),
            ease: EASE,
            delay: tempo(parado, indice * 0.03),
          }}
        />
      ))}
    </g>
  );
}

export default function CenaVoz() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const limpa = fase >= LIMPA;
  const barulho = fase < CALANDO;

  return (
    <Palco viewBox="0 0 560 240" fase={fase}>
      <Poeira x={200} largura={320} base={230} parado={parado} />
      <Celular parado={parado} />

      <Ruido tipo="nota" x={256} y={48} cor={ARCO[1]} visivel={barulho} parado={parado} />
      <Ruido tipo="som" x={438} y={44} cor={ARCO[2]} visivel={barulho} parado={parado} />
      <Ruido tipo="nota" x={372} y={214} cor={ARCO[3]} visivel={barulho} parado={parado} />

      <Brilho
        x={350}
        y={EIXO}
        raio={190}
        tinta="luz"
        aceso={limpa}
        parado={parado}
        achatar={0.38}
      />
      <Onda limpa={limpa} parado={parado} />

      {fase === VISTO && (
        <g>
          <Brilho x={520} y={EIXO} raio={54} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={520} y={EIXO} cor={TINTA.protege} escala={1.2} parado={parado} />
          <Faiscas x={520} y={EIXO} raio={48} ativo parado={parado} quantidade={7} />
        </g>
      )}
    </Palco>
  );
}
