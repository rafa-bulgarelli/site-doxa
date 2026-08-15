/**
 * ─── CENA: O CLONE ───────────────────────────────────────────────────────────
 *
 * A lição: **foto nítida, de frente — e o clone é uma aproximação.**
 *
 * Duas fotos entram juntas. A escura, de óculos e meio de lado, é descartada e
 * apaga; a clara e frontal acende em verde e sobe para a máquina. Do outro lado
 * o clone se forma: o mesmo rosto, redesenhado em luz, com a varredura passando
 * e as faíscas montando o desenho.
 *
 * A cena responde a pergunta que sempre volta ("essa serve?") antes de o cliente
 * mandar a que não serve.
 *
 * O detalhe que carrega o resto do capítulo: o rosto do clone é desenhado em
 * TRACEJADO, e é a única figura da cena assim. Traço interrompido é o jeito de
 * dizer, sem uma linha de texto, que aquilo é uma aproximação de você — não uma
 * cópia. Prometer semelhança perfeita aqui custa caro depois.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, Palco, TINTA, TRACO_ACESO } from './pecas';
import type { Tinta } from './luz';
import { Brilho, Faiscas, Poeira, QUEBRA, TracoDeLuz, useTintas } from './luz';
import { EASE, tempo, useRoteiro } from './tempo';

/** As duas chegam · a ruim cai · a boa passa · o clone se forma e segura. */
const FASES = [1500, 1700, 1700, 2800] as const;
const RECUSA = 1;
const ACEITE = 2;
const CLONE = 3;

/** As passadas que dão halo a um traço: larga e fraca, média, cheia. */
const COM_BRILHO = [
  { largura: 11, opacidade: 0.1 },
  { largura: 5.5, opacidade: 0.28 },
  { largura: 2.6, opacidade: 1 },
] as const;
const SEM_BRILHO = [{ largura: 2.6, opacidade: 1 }] as const;

interface RostoProps {
  readonly cor: string;
  readonly oculos: boolean;
  readonly tracejado: boolean;
  readonly brilho?: boolean;
}

/** Cabeça, ombros e — só na foto que não serve — os óculos. */
function Rosto({ cor, oculos, tracejado, brilho = false }: RostoProps) {
  const risca = tracejado ? '8 7' : undefined;
  const camadas = brilho ? COM_BRILHO : SEM_BRILHO;
  return (
    <g fill="none" stroke={cor} strokeLinecap="round">
      {camadas.map(({ largura, opacidade }) => (
        <g key={largura} strokeWidth={largura} opacity={opacidade}>
          <circle cx={0} cy={-16} r={28} strokeDasharray={risca} />
          <path d="M -43 56 a 43 39 0 0 1 86 0" strokeDasharray={risca} />
          {oculos && (
            <>
              <circle cx={-12} cy={-18} r={10} />
              <circle cx={12} cy={-18} r={10} />
              <path d="M -2 -18 h 4" />
            </>
          )}
        </g>
      ))}
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

/**
 * A borda diz o veredito: o arco enquanto a foto está sendo olhada, verde ou
 * vermelha depois. O arco aqui não é elogio — é a foto EM ANÁLISE.
 */
function tintaDaFoto(julgada: boolean, serve: boolean): Tinta {
  if (!julgada) return 'arco';
  return serve ? 'certo' : 'errado';
}

/** Uma das duas fotos enviadas, com o veredito quando ele chega. */
function Foto({ x, serve, julgada, parado }: FotoProps) {
  const recusada = julgada && !serve;
  const aprovada = julgada && serve;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: recusada ? 0.32 : 1 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      {aprovada && <Brilho x={x + 62} y={120} raio={96} tinta="luzCerta" aceso parado={parado} />}
      <Painel
        x={x}
        y={44}
        largura={124}
        altura={152}
        tinta={tintaDaFoto(julgada, serve)}
        vidro={aprovada}
        tracejado={recusada}
      />
      <g transform={`translate(${x + 62} 116)`}>
        <Rosto
          cor={serve ? TRACO_ACESO : TINTA.apagado}
          oculos={!serve}
          tracejado={false}
          brilho={aprovada}
        />
      </g>
      {julgada && (
        <Marca
          tipo={serve ? 'certo' : 'errado'}
          x={x + 100}
          y={182}
          escala={0.9}
          cor={serve ? TINTA.protege : QUEBRA}
          parado={parado}
        />
      )}
    </motion.g>
  );
}

/** A esteira: a foto boa virando dado, ponto a ponto, até a máquina. */
function Esteira({ parado }: { parado: boolean }) {
  const tintas = useTintas();
  return (
    <g>
      <TracoDeLuz
        d="M 296 120 h 34 m -12 -9 l 12 9 l -12 9"
        cor={tintas('arco')}
        largura={2.6}
        halo={2.4}
        parado={parado}
        riscando
        duracao={0.6}
      />
      {!parado && (
        <motion.circle
          r={3.2}
          cy={120}
          fill={tintas('arco')}
          initial={{ cx: 296, opacity: 0 }}
          animate={{ cx: [296, 330], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </g>
  );
}

/** O clone: o mesmo rosto, redesenhado em luz — e a varredura que o monta. */
function Clone({ parado }: { parado: boolean }) {
  const tintas = useTintas();
  return (
    <motion.g
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.6), ease: EASE }}
    >
      <Brilho x={434} y={120} raio={118} tinta="luz" aceso parado={parado} />
      <Painel x={346} y={30} largura={176} altura={180} tinta="arcoVertical" vidro />
      <g transform="translate(434 124)">
        <Rosto cor={tintas('arcoVertical')} oculos={false} tracejado brilho />
      </g>
      <Faiscas x={434} y={120} raio={86} ativo parado={parado} quantidade={10} duracao={2.2} />
      {!parado && (
        <motion.rect
          x={347}
          width={174}
          height={2.5}
          fill={tintas('arco')}
          initial={{ y: 34 }}
          animate={{ y: [34, 204, 34] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.g>
  );
}

export default function CenaClone() {
  const { fase, parado } = useRoteiro(FASES, CLONE);

  return (
    <Palco viewBox="0 0 560 240" fase={fase}>
      <Poeira x={40} largura={260} base={232} parado={parado} />
      <Foto x={24} serve={false} julgada={fase >= RECUSA} parado={parado} />
      <Foto x={164} serve julgada={fase >= ACEITE} parado={parado} />

      {/* A esteira só existe quando há para onde ir: a foto boa virando clone. */}
      {fase >= CLONE && <Esteira parado={parado} />}
      {fase >= CLONE && <Clone parado={parado} />}
    </Palco>
  );
}
