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
 *
 * ─── OS DOIS CONSERTOS QUE O DONO PEDIU ──────────────────────────────────────
 *
 * 1. **O círculo saiu.** Havia um anel de raio 30 pulsando em volta do
 *    microfone, para dizer "ligado". O dono olhou e nomeou o defeito: o círculo
 *    estava ENFORCANDO o microfone. Respiro é ausência de jaula, não jaula
 *    maior — então o anel não virou raio 40, ele deixou de existir. Quem diz
 *    que a gravação está correndo é a ONDA, que é o assunto da cena; o
 *    microfone só ganha um pouco mais de corpo para segurar o lado esquerdo
 *    sozinho, e acende de cinza para branco quando o lugar cala.
 *
 * 2. **O ruído passou a ORNAR com a onda.** A serrilha vermelha era um
 *    zigue-zague de amplitude fixa cortando o meio do desenho: um rabisco por
 *    cima, sem relação nenhuma com o que estava embaixo. Agora ela é derivada da
 *    PRÓPRIA onda suja — sobe onde a barra é alta, desce onde a barra é baixa —
 *    e corre no topo dela, não atravessada. Três camadas legíveis, cada uma no
 *    seu lugar: o microfone (branco), a voz (cinza) e o barulho grudado nela
 *    (vermelho), com as duas fontes de ruído acima, na mesma cor de quem as
 *    causou.
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
 * O serrilhado do barulho, ponto a ponto — tirado da onda que ele suja.
 *
 * Cada pico cai em cima de uma barra e sobe com ELA: barra alta, pico alto. O
 * vale fica entre duas barras, perto do eixo. É o que faz a linha vermelha
 * "ornar" com o cinza embaixo em vez de ser um rabisco atravessado — e é
 * também o que a torna legível como "isto está grudado na sua voz".
 *
 * Um caminho gerado por conta é mais barato que dezoito formas: o ruído é UMA
 * linha, e uma linha só ganha halo por três passadas do mesmo `d`.
 */
function serrilhaDoRuido(): string {
  const topo = (altura: number): number => EIXO - altura / 2;
  const meio = BARRA_LARGURA / 2;
  const partes: string[] = [`M ${BARRA_X - 6} ${topo(SUJA[0]) + 7}`];
  SUJA.forEach((altura, indice) => {
    const x = BARRA_X + indice * BARRA_PASSO + meio;
    // O dente sobe 4 acima do topo da barra e desce 6 abaixo da média entre
    // esta barra e a seguinte: a serrilha fica COLADA no contorno da onda, com
    // dente pequeno. Dente grande vira cordilheira e rouba a cena da voz — que
    // é o assunto —, e foi por isso que a versão anterior não ornava.
    const seguinte = SUJA[indice + 1] ?? altura;
    partes.push(`L ${x} ${topo(altura) - 4 - ((indice * 5) % 3)}`);
    partes.push(`L ${x + BARRA_PASSO / 2} ${(topo(altura) + topo(seguinte)) / 2 + 6}`);
  });
  partes.push(`L ${FIM_DA_ONDA + 4} ${topo(SUJA[SUJA.length - 1]) + 7}`);
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

/**
 * O microfone ligado: cápsula, arco e haste — o desenho de "estou ouvindo".
 *
 * Solto, sem anel nenhum em volta (era o círculo que enforcava), e um pouco
 * maior do que era: sem a jaula, é o próprio corpo do glifo que tem de segurar
 * o lado esquerdo do palco. Ele acende junto com a onda — cinza claro enquanto
 * há barulho, branco quando o lugar cala.
 */
function Microfone({ limpa, parado }: { limpa: boolean; parado: boolean }) {
  const cor = limpa ? TINTA.branco : TRACO_ACESO;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      <rect x={MICROFONE_X - 8} y={EIXO - 30} width={16} height={32} rx={8} fill={cor} />
      <TracoDeLuz
        d={`M ${MICROFONE_X - 17} ${EIXO - 5} a 17 17 0 0 0 34 0 M ${MICROFONE_X} ${EIXO + 12} v 12`}
        cor={cor}
        largura={2.2}
        halo={2.2}
        parado={parado}
      />
    </motion.g>
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
      <Microfone limpa={limpa} parado={parado} />
      <Onda limpa={limpa} parado={parado} />

      {/* O ruído: as duas fontes no ambiente e o serrilhado que elas deixam em
          cima da voz. Some tudo junto, na fase em que o lugar cala. */}
      <motion.g
        initial={false}
        // Nem a opacidade cheia: em vermelho saturado sobre preto, 1.0 num
        // traço que cruza o palco inteiro rouba a cena da VOZ, que é o assunto.
        animate={{ opacity: barulho ? 0.85 : 0 }}
        transition={{ duration: tempo(parado, 0.6), ease: EASE }}
      >
        {/* Mais fina que o microfone e que a haste da nota: o barulho é o que
            SUJA a cena, não o que a comanda. Hierarquia é peso de traço. */}
        <TracoDeLuz d={SERRILHA} cor={QUEBRA} largura={1.5} halo={2.6} parado={parado} />
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
