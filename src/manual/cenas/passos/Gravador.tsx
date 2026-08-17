/**
 * ─── MINI-CENA DO PASSO: O GRAVADOR (VZ-3) ───────────────────────────────────
 *
 * O passo: **use o gravador do seu celular — e grave aos poucos.**
 *
 * A história em uma frase: é o gravador que você já tem no bolso, e o material
 * inteiro se junta de trechos CURTOS, um de cada vez.
 *
 * O arco: o gravador do celular está ligado e não há nada gravado · o primeiro
 * trecho cai e recebe o seu visto · o segundo cai · o terceiro fecha o conjunto,
 * e os três acendem juntos. A repetição é o argumento: três caixas iguais
 * chegando uma a uma dizem "não precisa ser de uma vez" melhor do que qualquer
 * frase caberia aqui.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **Cada trecho fecha SOZINHO.** O visto entra junto com o trecho, e não
 *    todos no fim: o que a regra combate é o medo da maratona, e um visto por
 *    pedaço é o desenho de "já valeu, pode parar aqui hoje".
 * 2. **O ponto de gravar é BRANCO.** O vermelho de "REC" é o vermelho do resto
 *    do manual, onde ele significa uma coisa só: isto está errado. Gravar não
 *    está errado — então o ponto é branco, e o vermelho não aparece nesta cena.
 * 3. **Nada de ponteiro correndo.** O celular não anima em loop: o que se move
 *    é a história, um trecho por fase.
 */
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { OndaDeFala, PontoDeGravar } from './comuns';
import { useRoteiro } from '../tempo';

/** O gravador ligado · o primeiro trecho · o segundo · o terceiro e a pausa. */
const FASES = [1400, 1500, 1500, 3400] as const;
const FECHADO = 3;

const CELULAR = { x: 18, y: 22, largura: 64, altura: 106 } as const;
const CARTAO = { y: 44, largura: 100, altura: 62 } as const;
const EIXO = 75;

/** Onde cai cada trecho, e o que se falou em cada um deles. */
const TRECHOS = [
  { x: 104, alturas: [16, 30, 22, 12] },
  { x: 220, alturas: [12, 26, 34, 18] },
  { x: 336, alturas: [20, 14, 28, 24] },
] as const;

/** A ondinha de dentro do celular: a fala correndo enquanto se grava. */
const NO_CELULAR = [14, 26, 18, 30, 20] as const;

/** O gravador nativo: a caixa do celular, a fala correndo e o ponto de gravar. */
function Celular({ parado }: { parado: boolean }) {
  return (
    <g>
      <Painel
        x={CELULAR.x}
        y={CELULAR.y}
        largura={CELULAR.largura}
        altura={CELULAR.altura}
        cor={TRACO_ACESO}
        vidro
        raio={12}
      />
      <rect x={CELULAR.x + 20} y={CELULAR.y + 10} width={24} height={4} rx={2} fill={TRACO} />
      <OndaDeFala
        alturas={NO_CELULAR}
        x={CELULAR.x + 14}
        eixo={CELULAR.y + 46}
        passo={9}
        largura={4}
        cor={TRACO_ACESO}
        parado={parado}
      />
      <PontoDeGravar x={CELULAR.x + CELULAR.largura / 2} y={CELULAR.y + 88} aceso />
    </g>
  );
}

interface TrechoProps {
  readonly x: number;
  readonly alturas: readonly number[];
  readonly gravado: boolean;
  /** O trecho que ACABOU de cair — só ele ganha o clarão verde. */
  readonly novo: boolean;
  readonly parado: boolean;
}

/** Um trecho curto: a caixa, quatro barras de fala e o visto que o fecha. */
function Trecho({ x, alturas, gravado, novo, parado }: TrechoProps) {
  return (
    <g>
      {/* O clarão verde é do trecho da vez, e não dos três: três halos acesos
          ao mesmo tempo viram festa, e festa é o que reprovou a primeira leva.
          O que acende o CONJUNTO no fim é o clarão branco, lá embaixo. */}
      <Brilho x={x + CARTAO.largura / 2} y={EIXO} raio={72} tinta="luzCerta" aceso={novo} parado={parado} />
      <Painel
        x={x}
        y={CARTAO.y}
        largura={CARTAO.largura}
        altura={CARTAO.altura}
        cor={gravado ? TINTA.protege : TRACO}
        // Tracejado enquanto vazio: é a mesma gramática do cartão travado da
        // cena das 24 horas — traço interrompido é o que ainda não existe.
        tracejado={!gravado}
        vidro={gravado}
        raio={10}
      />
      {gravado && (
        <>
          <OndaDeFala
            alturas={alturas}
            x={x + 14}
            eixo={EIXO}
            passo={14}
            cor={TINTA.branco}
            parado={parado}
          />
          <Marca
            tipo="certo"
            x={x + 80}
            y={EIXO}
            cor={TINTA.protege}
            escala={0.62}
            parado={parado}
          />
        </>
      )}
    </g>
  );
}

export default function Gravador() {
  const { fase, parado } = useRoteiro(FASES, FECHADO);

  return (
    <MiniPalco fase={fase}>
      {/* O clarão só abre quando os três estão lá: é o conjunto que fecha, e é
          ele o quadro que fica na cabeça de quem passou os olhos. */}
      <Brilho
        x={286}
        y={EIXO}
        raio={230}
        tinta="luz"
        aceso={fase >= FECHADO}
        parado={parado}
        achatar={0.34}
      />
      <Celular parado={parado} />
      {TRECHOS.map((trecho, indice) => (
        <Trecho
          key={trecho.x}
          x={trecho.x}
          alturas={trecho.alturas}
          // Um trecho por fase, na ordem: o primeiro cai na fase 1, e assim
          // por diante — é a leitura "aos poucos" que a regra pede.
          gravado={fase > indice}
          novo={fase === indice + 1}
          parado={parado}
        />
      ))}
    </MiniPalco>
  );
}
