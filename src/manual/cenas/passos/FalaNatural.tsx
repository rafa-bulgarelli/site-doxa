/**
 * ─── MINI-CENA DO PASSO: A FALA NATURAL (VZ-2) ───────────────────────────────
 *
 * O passo: **fale natural — ler é proibido.**
 *
 * A história em uma frase: fala de conversa, do jeito que sai. Ler é proibido —
 * e a leitura se ouve, porque ela troca os picos e vales de uma conversa por uma
 * cadência de metrônomo.
 *
 * O arco: a fala entra crua, com picos e vales · um roteiro se encosta nela e a
 * onda vira uma cadência repetida, sempre o mesmo compasso · o roteiro é barrado
 * em vermelho e sai · a onda crua volta, acende, e o visto fecha.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **O estrago é mostrado, não afirmado.** Uma folha riscada, sozinha, só diz
 *    "não faça isto". A onda em compasso diz POR QUE: o que o clone precisa
 *    ouvir é a intenção de quem CONVERSA, e ler entrega o oposto — o mesmo
 *    desenho quatro vezes seguidas, sem uma frase mais alta que a outra.
 * 2. **Vermelho só no que é barrado.** O roteiro é a única coisa vermelha da
 *    cena, e só na fase em que ele é recusado. A onda lida não é vermelha: ela
 *    é APAGADA, que é o que ela vira de verdade.
 * 3. **O roteiro entra e SAI.** Ele desliza de fora e volta para fora — o palco
 *    fica limpo para o quadro final, que é o que a pessoa leva embora.
 * 4. **Uma história por cena, e a desta é a LEITURA.** A regra ainda diz para
 *    não passar o áudio por aplicativo nenhum, e a versão anterior desta cena
 *    contava exatamente isso: uma mesa de tratamento achatava a onda. As duas
 *    coisas em quatro fases seriam dois vilões disputando o mesmo palco — a
 *    "festa" que a doutrina proíbe. Ficou a proibição que abre a regra nova, e
 *    o filtro voltará no dia em que tiver uma cena só dele.
 * 5. **A folha é folha, e não mais um cartão.** Proporção de papel (88 por 112),
 *    linhas de texto sem texto — a mesma `Barra` que o resto do manual usa para
 *    dizer "aqui está escrito alguma coisa" sem virar letra de 8px no celular.
 */
import { motion } from 'framer-motion';
import { Barra, Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco } from '../itens/comuns';
import { OndaDeFala } from './comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** A fala crua · a leitura toma conta · a recusa · a onda crua e o visto. */
const FASES = [1600, 1800, 1600, 3400] as const;
const LENDO = 1;
const BARRADA = 2;
const CRUA = 3;

const EIXO = 88;
const ONDA_X = 36;
const ONDA_PASSO = 17;

/** A fala de verdade: picos, vales e respiro — duas frases de uma conversa. */
const NATURAL = [12, 24, 38, 52, 64, 54, 36, 22, 30, 46, 60, 50, 34, 20, 14, 10] as const;

/**
 * A mesma fala LIDA: quatro vezes o mesmo compasso.
 *
 * O motivo de quatro tempos, repetido letra por letra, é o assunto da cena.
 * Quem lê cai na métrica da frase escrita e entrega sempre a mesma curva — e um
 * clone que aprende isso vai falar recitando. Note que a onda não perde altura:
 * ler não deixa a voz fraca, deixa a voz PREVISÍVEL.
 */
const LIDA = [
  16, 42, 28, 40, 16, 42, 28, 40, 16, 42, 28, 40, 16, 42, 28, 40,
] as const;

const FOLHA = { x: 336, y: 20, largura: 88, altura: 112 } as const;
const FOLHA_MEIO_X = FOLHA.x + FOLHA.largura / 2;
const FOLHA_MEIO_Y = FOLHA.y + FOLHA.altura / 2;

/**
 * As linhas do roteiro: onde cada uma começa e até onde ela vai.
 *
 * Comprimentos diferentes, e a última curta — é o desenho de um parágrafo, e é
 * ele que faz o retângulo ler como TEXTO em vez de mais um cartão listrado.
 */
const LINHAS = [60, 52, 58, 46, 56, 30] as const;
const LINHA_X = FOLHA.x + 14;
const PRIMEIRA_LINHA_Y = FOLHA.y + 20;
const VAO_ENTRE_LINHAS = 16;

/**
 * A tinta da onda em cada momento.
 *
 * A onda lida é APAGADA, e não vermelha: ler não suja o áudio, tira a vida dele
 * — e é assim, sem graça, que ele chegaria para o clone.
 */
function corDaOnda(crua: boolean, lida: boolean): string {
  if (crua) return TINTA.branco;
  return lida ? TINTA.apagado : TRACO_ACESO;
}

interface RoteiroProps {
  readonly dentro: boolean;
  readonly recusado: boolean;
  readonly parado: boolean;
}

/**
 * O roteiro: a folha com as linhas de texto que ninguém deveria estar lendo.
 *
 * O deslocamento de entrada vai no `x` do grupo que anima — e o grupo não tem
 * `transform` próprio, justamente porque o framer escreve nesse atributo e
 * apagaria qualquer coisa que estivesse ali.
 */
function Roteiro({ dentro, recusado, parado }: RoteiroProps) {
  const cor = recusado ? QUEBRA : TRACO_ACESO;
  return (
    <motion.g
      initial={false}
      animate={{ x: dentro ? 0 : 64, opacity: dentro ? 1 : 0 }}
      transition={{ duration: tempo(parado, 0.6), ease: EASE }}
    >
      <Painel
        x={FOLHA.x}
        y={FOLHA.y}
        largura={FOLHA.largura}
        altura={FOLHA.altura}
        cor={cor}
        vidro={!recusado}
        raio={8}
      />
      {LINHAS.map((largura, indice) => (
        <Barra
          key={largura}
          x={LINHA_X}
          y={PRIMEIRA_LINHA_Y + indice * VAO_ENTRE_LINHAS}
          largura={largura}
          altura={5}
          // As linhas ficam CINZA mesmo na fase da recusa. Uma folha inteira
          // pintada de vermelho vira um bloco saturado que rouba a cena da voz
          // — que é o assunto —, e é o defeito que a cena do silêncio já
          // documenta. O que é barrado é a LEITURA, e quem diz isso são a
          // moldura e o xis.
          cor={TRACO}
          parado={parado}
        />
      ))}
    </motion.g>
  );
}

export default function FalaNatural() {
  const { fase, parado } = useRoteiro(FASES, CRUA);
  const lida = fase === LENDO;
  const crua = fase >= CRUA;

  return (
    <MiniPalco fase={fase}>
      {/* O clarão do fim é BRANCO, e ele só acende quando a onda volta a ser a
          que saiu da boca da pessoa. */}
      <Brilho x={168} y={EIXO} raio={200} tinta="luz" aceso={crua} parado={parado} achatar={0.34} />
      <OndaDeFala
        alturas={lida ? LIDA : NATURAL}
        x={ONDA_X}
        eixo={EIXO}
        passo={ONDA_PASSO}
        cor={corDaOnda(crua, lida)}
        parado={parado}
      />

      <Brilho
        x={FOLHA_MEIO_X}
        y={FOLHA_MEIO_Y}
        raio={96}
        tinta="luzQuebra"
        aceso={fase === BARRADA}
        parado={parado}
      />
      <Roteiro
        dentro={fase === LENDO || fase === BARRADA}
        recusado={fase === BARRADA}
        parado={parado}
      />
      {fase === BARRADA && (
        <Marca
          tipo="errado"
          x={FOLHA_MEIO_X}
          y={FOLHA_MEIO_Y}
          cor={QUEBRA}
          escala={1.3}
          parado={parado}
        />
      )}

      {crua && (
        <g>
          <Brilho x={394} y={EIXO} raio={48} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={394} y={EIXO} cor={TINTA.protege} escala={1.05} parado={parado} />
          {/* O degradê só na fase em que a onda volta a ser CRUA: na fase do
              compasso a mesma cena está errada, e cor de comemoração ali
              elogiaria justamente o que a regra recusa. */}
          <FechoDoArco x={394} y={EIXO + 14} escala={0.9} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
