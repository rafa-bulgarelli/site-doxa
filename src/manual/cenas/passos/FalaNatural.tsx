/**
 * ─── MINI-CENA DO PASSO: A FALA NATURAL (VZ-2) ───────────────────────────────
 *
 * O passo: **fale natural, envie cru.**
 *
 * A história em uma frase: a fala do jeito que sai é a que serve — o aplicativo
 * de "melhorar áudio" não acrescenta nada, ele ACHATA.
 *
 * O arco: a fala entra crua, com picos e vales · uma mesa de tratamento se
 * encosta nela e a onda vira uma cerca, todas as barras do mesmo tamanho · a
 * mesa é barrada em vermelho e sai · a onda crua acende e o visto fecha.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **O estrago é mostrado, não afirmado.** Um app riscado, sozinho, só diz
 *    "não use isto". A onda achatada diz POR QUE: o que o clone precisa ouvir é
 *    a diferença entre os picos, e é exatamente ela que o tratamento come.
 * 2. **Vermelho só no que é barrado.** A mesa de controles é a única coisa
 *    vermelha da cena, e só na fase em que ela é recusada. A onda tratada não é
 *    vermelha: ela é APAGADA, que é o que ela vira de verdade.
 * 3. **A mesa entra e SAI.** Ela desliza de fora e volta para fora — o palco
 *    fica limpo para o quadro final, que é o que a pessoa leva embora.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco } from '../itens/comuns';
import { OndaDeFala } from './comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** A fala crua · o tratamento achata · a recusa · a onda crua e o visto. */
const FASES = [1600, 1800, 1600, 3400] as const;
const TRATADA = 1;
const BARRADA = 2;
const CRUA = 3;

const EIXO = 88;
const ONDA_X = 36;
const ONDA_PASSO = 17;

/** A fala de verdade: picos, vales e respiro — duas frases de uma conversa. */
const NATURAL = [12, 24, 38, 52, 64, 54, 36, 22, 30, 46, 60, 50, 34, 20, 14, 10] as const;

/**
 * A mesma fala depois do "melhorar áudio": uma cerca.
 *
 * Os números quase iguais são o assunto da cena. Um compressor de app iguala o
 * alto e o baixo, e o que sobra é uma fileira sem intenção nenhuma — é isso que
 * o clone aprende quando o áudio chega tratado.
 */
const ACHATADA = [32, 34, 33, 35, 34, 33, 35, 34, 33, 34, 35, 33, 34, 35, 33, 34] as const;

const MESA = { x: 312, y: 30, largura: 142, altura: 80 } as const;
const MESA_MEIO_X = MESA.x + MESA.largura / 2;
const MESA_MEIO_Y = MESA.y + MESA.altura / 2;

/** As duas réguas da mesa: onde cada trilho corre e onde o botão está parado. */
const TRILHOS = [
  { y: 58, botao: 400 },
  { y: 86, botao: 356 },
] as const;

/**
 * A tinta da onda em cada momento.
 *
 * A onda tratada é APAGADA, e não vermelha: o tratamento não suja o áudio, ele
 * tira a vida dele — e é assim, sem graça, que ele chegaria para o clone.
 */
function corDaOnda(crua: boolean, achatada: boolean): string {
  if (crua) return TINTA.branco;
  return achatada ? TINTA.apagado : TRACO_ACESO;
}

interface MesaProps {
  readonly dentro: boolean;
  readonly recusada: boolean;
  readonly parado: boolean;
}

/**
 * A mesa de tratamento: dois trilhos com botão, o desenho de qualquer app de
 * "melhorar áudio".
 *
 * O deslocamento de entrada vai no `x` do grupo que anima — e o grupo não tem
 * `transform` próprio, justamente porque o framer escreve nesse atributo e
 * apagaria qualquer coisa que estivesse ali.
 */
function Mesa({ dentro, recusada, parado }: MesaProps) {
  const cor = recusada ? QUEBRA : TRACO_ACESO;
  return (
    <motion.g
      initial={false}
      animate={{ x: dentro ? 0 : 64, opacity: dentro ? 1 : 0 }}
      transition={{ duration: tempo(parado, 0.6), ease: EASE }}
    >
      <Painel
        x={MESA.x}
        y={MESA.y}
        largura={MESA.largura}
        altura={MESA.altura}
        cor={cor}
        vidro={!recusada}
        raio={12}
      />
      {TRILHOS.map(({ y, botao }) => (
        <g key={y}>
          <rect x={MESA.x + 16} y={y - 2} width={MESA.largura - 32} height={4} rx={2} fill={cor} opacity={0.4} />
          <circle cx={botao} cy={y} r={7} fill={TINTA.elevado} stroke={cor} strokeWidth={2} />
        </g>
      ))}
    </motion.g>
  );
}

export default function FalaNatural() {
  const { fase, parado } = useRoteiro(FASES, CRUA);
  const achatada = fase === TRATADA;
  const crua = fase >= CRUA;

  return (
    <MiniPalco fase={fase}>
      {/* O clarão do fim é BRANCO, e ele só acende quando a onda volta a ser a
          que saiu da boca da pessoa. */}
      <Brilho x={168} y={EIXO} raio={200} tinta="luz" aceso={crua} parado={parado} achatar={0.34} />
      <OndaDeFala
        alturas={achatada ? ACHATADA : NATURAL}
        x={ONDA_X}
        eixo={EIXO}
        passo={ONDA_PASSO}
        cor={corDaOnda(crua, achatada)}
        parado={parado}
      />

      <Brilho
        x={MESA_MEIO_X}
        y={MESA_MEIO_Y}
        raio={96}
        tinta="luzQuebra"
        aceso={fase === BARRADA}
        parado={parado}
      />
      <Mesa dentro={fase === TRATADA || fase === BARRADA} recusada={fase === BARRADA} parado={parado} />
      {fase === BARRADA && (
        <Marca
          tipo="errado"
          x={MESA_MEIO_X}
          y={MESA_MEIO_Y}
          cor={QUEBRA}
          escala={1.25}
          parado={parado}
        />
      )}

      {crua && (
        <g>
          <Brilho x={394} y={EIXO} raio={48} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={394} y={EIXO} cor={TINTA.protege} escala={1.05} parado={parado} />
          {/* O degradê só na fase em que a onda volta a ser CRUA: na fase da
              cerca a mesma cena está errada, e cor de comemoração ali elogiaria
              justamente o que a regra recusa. */}
          <FechoDoArco x={394} y={EIXO + 14} escala={0.9} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
