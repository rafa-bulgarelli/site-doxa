/**
 * ─── MINI-CENA DO PASSO: O SILÊNCIO (VZ-1) ───────────────────────────────────
 *
 * O passo: **grave num lugar silencioso.**
 *
 * A história em uma frase: sem ruído no fundo, o clone aprende só a SUA voz.
 * O microfone já está gravando; a onda entra serrada e cinza, com um serrilhado
 * vermelho POR CIMA dela — o barulho contaminando o mesmo traço da voz, e não um
 * enfeite ao lado. As fontes de ruído calam, o serrilhado morre, e a mesma onda
 * vira regular e acesa. O visto verde fecha.
 *
 * ─── AS DECISÕES QUE ESTA CENA HERDA DA CENA DO CLONE ────────────────────────
 *
 * 1. **Monocromática na base.** A onda é branco e grafite. Vermelho é o ruído
 *    (a quebra) e verde é o veredito — nada mais tem cor. A cena do capítulo da
 *    voz pinta a onda limpa com o arco inteiro; aqui, num slot de faixa acima do
 *    rótulo do passo, o arco viraria confete: são 40px de altura no celular.
 * 2. **O ruído é o MESMO traço da voz, sujo.** Barulho desenhado em outro canto
 *    lê como "tem música tocando ali"; barulho desenhado por cima da onda lê
 *    como "isso entrou na sua gravação", que é o que o passo pede.
 * 3. **Um gesto por fase.** Nada pisca em loop: o que se move é a história.
 *
 * O que a cena NÃO faz de propósito: mexer no timbre. A onda limpa tem a mesma
 * natureza de fala da suja — só sem a sujeira em volta. Clone bom sai de voz
 * natural, não de voz tratada.
 */
import { motion } from 'framer-motion';
import { Marca, TINTA, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA, TracoDeLuz } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** Grava com barulho · o ambiente cala · a onda limpa · o visto e a pausa. */
const FASES = [1700, 1400, 1800, 3400] as const;
const CALANDO = 1;
const LIMPA = 2;
const VISTO = 3;

const EIXO = 84;
const BARRA_X = 104;
const BARRA_PASSO = 15;
const BARRA_LARGURA = 6;
const FIM_DA_ONDA = 365;
const MICROFONE_X = 52;

/** A onda suja: picos sem relação um com o outro — é assim que ruído parece. */
const SUJA = [44, 14, 52, 20, 58, 10, 38, 50, 16, 46, 24, 56, 12, 42, 22, 52, 18, 36] as const;

/** A onda limpa: duas frases de fala, com respiro entre elas. */
const CLARA = [10, 18, 28, 40, 52, 60, 54, 42, 26, 22, 36, 52, 62, 54, 40, 26, 16, 10] as const;

/**
 * O serrilhado do barulho, ponto a ponto.
 *
 * Um caminho gerado por conta é mais barato que dezoito formas: o ruído é UMA
 * linha, e uma linha só ganha halo por três passadas do mesmo `d`.
 */
function serrilhaDoRuido(): string {
  const passo = 9;
  const partes: string[] = [`M ${BARRA_X - 4} ${EIXO}`];
  for (let x = BARRA_X - 4 + passo; x <= FIM_DA_ONDA; x += passo) {
    // A altura alterna e varia: serrilha regular vira zigue-zague decorativo,
    // e zigue-zague decorativo é exatamente o que não conta nada.
    const lado = partes.length % 2 === 0 ? 1 : -1;
    const altura = 4 + ((partes.length * 7) % 6);
    partes.push(`L ${x} ${EIXO + lado * altura}`);
  }
  return partes.join(' ');
}

const SERRILHA = serrilhaDoRuido();

interface FonteProps {
  readonly tipo: 'nota' | 'som';
  readonly x: number;
  readonly y: number;
  readonly visivel: boolean;
  readonly parado: boolean;
}

/**
 * Uma fonte de barulho no ambiente: a música e a conversa do outro cômodo.
 *
 * O `translate` fica no grupo de FORA e a animação no de dentro: framer escreve
 * o atributo `transform` do elemento que anima, e o glifo iria parar na origem
 * do palco no primeiro quadro.
 */
function FonteDeRuido({ tipo, x, y, visivel, parado }: FonteProps) {
  const traco =
    tipo === 'nota'
      ? 'M 0 0 v -18 l 12 -3 v 18'
      : 'M 0 -8 a 9 9 0 0 1 0 16 M 5 -14 a 16 16 0 0 1 0 28';
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        initial={false}
        animate={{ opacity: visivel ? 0.9 : 0, y: visivel ? 0 : -16 }}
        transition={{ duration: tempo(parado, 0.55), ease: EASE }}
      >
        <TracoDeLuz d={traco} cor={QUEBRA} largura={2.2} halo={2.2} parado={parado} />
        {tipo === 'nota' && (
          <>
            <circle cx={-2} cy={0} r={4.5} fill={QUEBRA} />
            <circle cx={10} cy={-3} r={4.5} fill={QUEBRA} />
          </>
        )}
      </motion.g>
    </g>
  );
}

/** O microfone ligado: cápsula, arco e haste — o desenho de "estou ouvindo". */
function Microfone({ parado }: { parado: boolean }) {
  return (
    <g>
      <motion.circle
        cx={MICROFONE_X}
        cy={EIXO}
        r={30}
        fill="none"
        stroke={TINTA.linha}
        strokeWidth={1.5}
        animate={parado ? { opacity: 1 } : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.6, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <rect x={MICROFONE_X - 7} y={EIXO - 26} width={14} height={28} rx={7} fill={TRACO_ACESO} />
      <TracoDeLuz
        d={`M ${MICROFONE_X - 15} ${EIXO - 4} a 15 15 0 0 0 30 0 M ${MICROFONE_X} ${EIXO + 11} v 10`}
        cor={TRACO_ACESO}
        largura={2.1}
        halo={2.2}
        parado={parado}
      />
    </g>
  );
}

/** A onda: cinza e serrada com barulho, branca e ritmada quando o ambiente cala. */
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
           * A onda suja é CINZA, não apagada a ponto de sumir: se ela não for
           * legível debaixo do ruído, a cena vira "linha vermelha em cima de
           * nada" — e o que se transforma na fase seguinte é justamente ela.
           */
          fill={limpa ? TINTA.branco : TINTA.apagado}
          /*
           * `attrY`, e não `y`: para o framer, `y` é sempre DESLOCAMENTO — com
           * `y` a onda inteira nasce colada no topo, porque o atributo do
           * retângulo fica em zero e o translate só entra depois. `attrY` mira o
           * atributo mesmo, que é o que o primeiro desenho já escreve.
           *
           * A barra sobe metade da própria altura porque a onda cresce para os
           * dois lados a partir do eixo, do jeito que um áudio se desenha.
           */
          initial={{ attrY: EIXO - altura / 2, height: altura }}
          animate={{ attrY: EIXO - altura / 2, height: altura }}
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

export default function Silencio() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const barulho = fase < CALANDO;
  const limpa = fase >= LIMPA;

  return (
    <MiniPalco fase={fase}>
      {/* O clarão do fim é BRANCO — a onda limpa ACENDE. O verde fica só no
          visto, que é quem julga. */}
      <Brilho
        x={236}
        y={EIXO}
        raio={210}
        tinta="luz"
        aceso={limpa}
        parado={parado}
        achatar={0.32}
      />
      <Microfone parado={parado} />
      <Onda limpa={limpa} parado={parado} />

      {/* O ruído: as duas fontes no ambiente e o serrilhado que elas deixam em
          cima da voz. Some tudo junto, na fase em que o lugar cala. */}
      <motion.g
        initial={false}
        animate={{ opacity: barulho ? 1 : 0 }}
        transition={{ duration: tempo(parado, 0.6), ease: EASE }}
      >
        <TracoDeLuz d={SERRILHA} cor={QUEBRA} largura={1.6} halo={2} parado={parado} />
      </motion.g>
      <Brilho x={156} y={28} raio={44} tinta="luzQuebra" aceso={barulho} parado={parado} />
      <Brilho x={306} y={26} raio={44} tinta="luzQuebra" aceso={barulho} parado={parado} />
      <FonteDeRuido tipo="nota" x={150} y={34} visivel={barulho} parado={parado} />
      <FonteDeRuido tipo="som" x={300} y={30} visivel={barulho} parado={parado} />

      {fase >= VISTO && (
        <g>
          <Brilho x={420} y={EIXO} raio={46} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={420} y={EIXO} cor={TINTA.protege} escala={1.05} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
