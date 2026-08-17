/**
 * ─── MINI-CENA DO PASSO: O CONTEXTO (ON-1) ───────────────────────────────────
 *
 * O passo: **responda com contexto, não com uma palavra.**
 *
 * A história em uma frase: uma palavra é POUCO — a mesma resposta, contada com
 * contexto, acende o campo inteiro e fecha em verde.
 *
 * O arco tem três atos e uma pausa: a pergunta espera · uma palavrinha senta no
 * campo e não preenche nada · a resposta cresce em três linhas acesas · o visto
 * fecha. É a lição do capítulo do onboarding em miniatura, e ela é contada por
 * TAMANHO: a diferença entre uma barrinha de sessenta pixels e três linhas
 * cheias diz sozinha o que meia página de texto diria.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **A resposta curta não é ERRADA, é pouca.** Nada de vermelho aqui: ela não
 *    quebra regra nenhuma, só não serve de matéria-prima. O jeito de dizer isso
 *    sem xingar quem respondeu é deixá-la FRACA — o mesmo gesto da cena grande
 *    do capítulo.
 * 2. **Monocromática, como os pilotos.** A cena grande do capítulo pinta as três
 *    linhas com o arco inteiro de cor, e lá isso cabe: são 560 × 240 e a cena é
 *    a abertura do capítulo. Aqui é uma tira de 40px de altura no celular, e
 *    três barras em degradê lado a lado leem como festa — que é o xingamento do
 *    dono para cor sem função. O que acende a resposta boa é LUZ: as linhas
 *    ficam brancas, o campo ganha vidro e o clarão abre atrás. Verde entra só no
 *    visto, que é quem aprova.
 * 3. **Nada de frase escrita.** Texto dentro de um palco de 480 × 150 vira letra
 *    de 8px no celular, e ainda ficaria em português para quem lê em inglês. A
 *    barra diz tudo: resposta curta é barra curta.
 */
import { Barra, Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

/** A pergunta espera · a palavra senta · a resposta cresce · o visto e a pausa. */
const FASES = [1300, 1700, 1900, 3400] as const;
const CURTA = 1;
const COMPLETA = 2;
const VISTO = 3;

/** A largura de cada uma das três linhas da resposta, por fase. */
const LINHAS: readonly (readonly number[])[] = [
  [0, 0, 0],
  [56, 0, 0],
  [352, 300, 208],
  [352, 300, 208],
];

const ESQUERDA = 44;
const ALTURAS = [74, 96, 118] as const;
const CAMPO = { x: 24, y: 54, largura: 424, altura: 82 } as const;

/** A pergunta: o marcador e duas linhas, do jeito que um formulário pergunta. */
function Pergunta({ parado }: { parado: boolean }) {
  return (
    <g>
      <Painel
        x={CAMPO.x}
        y={12}
        largura={CAMPO.largura}
        altura={32}
        cor={TRACO_ACESO}
        vidro
        raio={10}
      />
      <motion.circle
        cx={44}
        cy={28}
        r={6}
        fill="none"
        stroke={TRACO_ACESO}
        strokeWidth={1.5}
        animate={parado ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <Barra x={60} y={24} largura={186} altura={5} cor={TRACO_ACESO} parado={parado} />
      <Barra x={256} y={24} largura={96} altura={5} parado={parado} atraso={0.08} />
    </g>
  );
}

/**
 * A borda do campo conta o julgamento: muda, acesa, verde no fim.
 *
 * Muda nas duas primeiras fases de propósito — uma borda acesa na fase da
 * palavrinha já estaria elogiando o que a cena vai mostrar como pouco.
 */
function bordaDoCampo(fase: number): string {
  if (fase >= VISTO) return TINTA.protege;
  if (fase >= COMPLETA) return TRACO_ACESO;
  return TRACO;
}

/** As três linhas da resposta — fracas enquanto pobres, acesas quando completas. */
function Resposta({ fase, parado }: { fase: number; parado: boolean }) {
  const larguras = LINHAS[fase];
  const rica = fase >= COMPLETA;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: fase === CURTA ? 0.45 : 1 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      {ALTURAS.map((y, indice) => (
        <Barra
          key={y}
          x={ESQUERDA}
          y={y}
          altura={7}
          largura={larguras[indice]}
          cor={rica ? TINTA.branco : TINTA.apagado}
          parado={parado}
          atraso={indice * 0.14}
        />
      ))}
    </motion.g>
  );
}

export default function Contexto() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const completa = fase >= COMPLETA;

  return (
    <MiniPalco fase={fase}>
      {/* O clarão do campo é BRANCO: "acender" aqui é luz. O verde fica com a
          borda e o visto — que são quem de fato aprova. */}
      <Brilho x={236} y={96} raio={210} tinta="luz" aceso={completa} parado={parado} achatar={0.38} />
      <Pergunta parado={parado} />
      <Painel
        x={CAMPO.x}
        y={CAMPO.y}
        largura={CAMPO.largura}
        altura={CAMPO.altura}
        cor={bordaDoCampo(fase)}
        tracejado={fase === CURTA}
        vidro={completa}
        raio={10}
      />
      <Resposta fase={fase} parado={parado} />

      {fase >= VISTO && (
        <g>
          <Brilho x={418} y={118} raio={44} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={418} y={118} cor={TINTA.protege} escala={0.9} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
