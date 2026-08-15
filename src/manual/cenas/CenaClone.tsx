/**
 * ─── CENA: O CLONE ───────────────────────────────────────────────────────────
 *
 * A lição: **foto nítida, de frente — e o clone é uma aproximação.**
 *
 * Duas fotos entram juntas. A escura, de óculos e meio de lado, é descartada;
 * a clara e frontal é aceita e vira o rosto do clone. A cena responde a
 * pergunta que sempre volta ("essa serve?") antes de o cliente mandar a que
 * não serve.
 *
 * O detalhe que carrega o resto do capítulo: o rosto do clone é desenhado em
 * TRACEJADO, e é a única figura da cena assim. Traço interrompido é o jeito de
 * dizer, sem uma linha de texto, que aquilo é uma aproximação de você — não
 * uma cópia. Prometer semelhança perfeita aqui custa caro depois.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { EASE, tempo, useRoteiro } from './tempo';

/** As duas chegam · a ruim cai · a boa passa · o clone se forma e segura. */
const FASES = [1400, 1600, 1700, 2600] as const;
const RECUSA = 1;
const ACEITE = 2;
const CLONE = 3;

const RECUSADO = 'rgba(255,255,255,0.7)';

/** Cabeça, ombros e — só na foto que não serve — os óculos. */
function Rosto({ cor, oculos, tracejado }: { cor: string; oculos: boolean; tracejado: boolean }) {
  const risca = tracejado ? '7 6' : undefined;
  return (
    <g fill="none" stroke={cor} strokeWidth={2.5} strokeLinecap="round">
      <circle cx={0} cy={-14} r={26} strokeDasharray={risca} />
      <path d="M -40 52 a 40 36 0 0 1 80 0" strokeDasharray={risca} />
      {oculos && (
        <g stroke={cor} strokeWidth={2.5}>
          <circle cx={-11} cy={-16} r={9} />
          <circle cx={11} cy={-16} r={9} />
          <path d="M -2 -16 h 4" />
        </g>
      )}
    </g>
  );
}

interface FotoProps {
  readonly x: number;
  readonly serve: boolean;
  /** Enquanto falso, a foto ainda não recebeu veredito nenhum. */
  readonly julgada: boolean;
  readonly parado: boolean;
}

/** Uma das duas fotos enviadas, com o veredito quando ele chega. */
function Foto({ x, serve, julgada, parado }: FotoProps) {
  const recusada = julgada && !serve;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: recusada ? 0.35 : 1 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      <Painel
        x={x}
        y={48}
        largura={112}
        altura={144}
        aceso={julgada && serve}
        tracejado={recusada}
      />
      <g transform={`translate(${x + 56} 118)`}>
        <Rosto cor={serve ? TRACO_ACESO : TINTA.apagado} oculos={!serve} tracejado={false} />
      </g>
      {julgada && (
        <Marca
          tipo={serve ? 'certo' : 'errado'}
          x={x + 92}
          y={178}
          escala={0.85}
          cor={serve ? TINTA.protege : RECUSADO}
          parado={parado}
        />
      )}
    </motion.g>
  );
}

/** O clone: o mesmo rosto, redesenhado — e a varredura que o está montando. */
function Clone({ parado }: { parado: boolean }) {
  return (
    <motion.g
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.6), ease: EASE }}
    >
      <Painel x={308} y={36} largura={150} altura={168} aceso />
      <g transform="translate(383 122)">
        <Rosto cor={TINTA.branco} oculos={false} tracejado />
      </g>
      {!parado && (
        <motion.rect
          x={309}
          width={148}
          height={2}
          fill={TRACO_ACESO}
          initial={{ y: 40 }}
          animate={{ y: [40, 198, 40] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.g>
  );
}

export default function CenaClone() {
  const { fase, parado } = useRoteiro(FASES, CLONE);

  return (
    <Palco viewBox="0 0 480 240">
      <Foto x={22} serve={false} julgada={fase >= RECUSA} parado={parado} />
      <Foto x={152} serve julgada={fase >= ACEITE} parado={parado} />

      {/* A seta só existe quando há para onde ir: a foto boa virando clone. */}
      {fase >= CLONE && (
        <motion.path
          d="M 274 120 h 22 m -8 -8 l 8 8 l -8 8"
          fill="none"
          stroke={TRACO}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: parado ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: tempo(parado, 0.4), ease: EASE }}
        />
      )}

      {fase >= CLONE && <Clone parado={parado} />}
    </Palco>
  );
}
