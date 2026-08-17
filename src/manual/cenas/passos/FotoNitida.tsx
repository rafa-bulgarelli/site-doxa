/**
 * ─── MINI-CENA DO PASSO: A FOTO NÍTIDA (CL-1) ────────────────────────────────
 *
 * O passo: **foto nítida, de frente, em boa luz.**
 *
 * A história em uma frase: a mesma foto, no escuro e fora de foco, ACENDE
 * quando a luz entra pela janela — e aí o traço do rosto firma.
 *
 * O arco: o retrato está escuro e duplicado (é assim que "sem foco" se desenha
 * sem filtro nenhum) · a janela acende e os feixes atravessam · as cópias
 * fantasmas se juntam numa só, branca e firme · o visto verde fecha.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **O borrão é DESENHADO, não filtrado.** `feGaussianBlur` num SVG que anima
 *    em loop custa caro no celular, e o celular é onde o manual é lido. Duas
 *    cópias do mesmo traço, deslocadas de dois pixels e fracas, leem como fora
 *    de foco pela mesma fração do preço.
 * 2. **A luz vem de uma JANELA.** É o que o exemplo da regra manda fazer — "de
 *    dia, DE FRENTE para a janela" —, e uma janela desenha a direção da luz, o
 *    que um clarão solto no palco não faz.
 * 3. **Verde só no fim.** A moldura fica muda enquanto ninguém julgou: borda
 *    verde na primeira fase já daria a resposta que a cena leva três segundos
 *    para construir.
 */
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, TracoDeLuz } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { Rosto } from './comuns';
import { useRoteiro } from '../tempo';

/** O escuro · a luz entra · o traço firma · o visto e a pausa. */
const FASES = [1600, 1500, 1700, 3400] as const;
const LUZ = 1;
const NITIDA = 2;
const VISTO = 3;

const JANELA = { x: 24, y: 40, largura: 60, altura: 64 } as const;
const MOLDURA = { x: 146, y: 14, largura: 184, altura: 122 } as const;
const ROSTO_X = MOLDURA.x + MOLDURA.largura / 2;
const ROSTO_Y = 76;

/** Os três feixes que atravessam da janela até a moldura. */
const FEIXES = ['M 90 56 L 142 42', 'M 90 72 L 142 72', 'M 90 88 L 142 102'] as const;

/** As duas cópias fantasmas do rosto — o desenho de "fora de foco". */
const FANTASMAS = [
  { dx: -2.5, dy: -1.5 },
  { dx: 2.5, dy: 1.5 },
] as const;

/** A janela: a moldura de vidro e a cruz do caixilho, apagada ou acesa. */
function Janela({ acesa, parado }: { acesa: boolean; parado: boolean }) {
  const cor = acesa ? TRACO_ACESO : TINTA.linha;
  const meioX = JANELA.x + JANELA.largura / 2;
  const meioY = JANELA.y + JANELA.altura / 2;
  return (
    <g>
      <Brilho x={meioX} y={meioY} raio={92} tinta="luz" aceso={acesa} parado={parado} />
      <Painel
        x={JANELA.x}
        y={JANELA.y}
        largura={JANELA.largura}
        altura={JANELA.altura}
        cor={cor}
        vidro={acesa}
        raio={8}
      />
      <path
        d={`M ${meioX} ${JANELA.y} v ${JANELA.altura} M ${JANELA.x} ${meioY} h ${JANELA.largura}`}
        stroke={cor}
        strokeWidth={1.5}
      />
    </g>
  );
}

/** Os feixes, riscados um atrás do outro quando a janela acende. */
function Feixes({ parado }: { parado: boolean }) {
  return (
    <g>
      {FEIXES.map((feixe, indice) => (
        <TracoDeLuz
          key={feixe}
          d={feixe}
          cor={TRACO_ACESO}
          largura={1.8}
          halo={2.4}
          parado={parado}
          riscando
          duracao={0.5}
          atraso={indice * 0.12}
        />
      ))}
    </g>
  );
}

/** A borda da foto: muda enquanto ninguém julgou, acesa nítida, verde no fim. */
function bordaDaFoto(fase: number): string {
  if (fase >= VISTO) return TINTA.protege;
  if (fase >= NITIDA) return TRACO_ACESO;
  return TRACO;
}

/** O rosto sai do escuro em dois degraus: apagado, cinza claro, branco. */
function corDoRosto(nitido: boolean, iluminado: boolean): string {
  if (nitido) return TINTA.branco;
  return iluminado ? TRACO_ACESO : TINTA.apagado;
}

interface RetratoProps {
  readonly nitido: boolean;
  readonly iluminado: boolean;
}

/** O rosto na moldura: duplicado e apagado no escuro, único e branco na luz. */
function Retrato({ nitido, iluminado }: RetratoProps) {
  const cor = corDoRosto(nitido, iluminado);
  return (
    <g>
      {!nitido &&
        FANTASMAS.map(({ dx, dy }) => (
          <g key={dx} transform={`translate(${ROSTO_X + dx} ${ROSTO_Y + dy})`} opacity={0.4}>
            <Rosto cor={cor} />
          </g>
        ))}
      <g transform={`translate(${ROSTO_X} ${ROSTO_Y})`}>
        <Rosto cor={cor} brilho={nitido} />
      </g>
    </g>
  );
}

export default function FotoNitida() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const iluminado = fase >= LUZ;
  const nitido = fase >= NITIDA;

  return (
    <MiniPalco fase={fase}>
      <Janela acesa={iluminado} parado={parado} />
      {iluminado && <Feixes parado={parado} />}

      {/* O clarão da foto é BRANCO: acender aqui é LUZ, e o verde fica com o
          carimbo, que é quem julga. */}
      <Brilho
        x={ROSTO_X}
        y={ROSTO_Y}
        raio={128}
        tinta="luz"
        aceso={nitido}
        parado={parado}
        achatar={0.7}
      />
      <Painel
        x={MOLDURA.x}
        y={MOLDURA.y}
        largura={MOLDURA.largura}
        altura={MOLDURA.altura}
        cor={bordaDaFoto(fase)}
        vidro={nitido}
        raio={12}
      />
      <Retrato nitido={nitido} iluminado={iluminado} />

      {fase >= VISTO && (
        <g>
          <Brilho x={404} y={ROSTO_Y} raio={48} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={404} y={ROSTO_Y} cor={TINTA.protege} escala={1.05} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
