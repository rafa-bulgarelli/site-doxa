/**
 * ─── MINI-CENA: OS SESSENTA (GA-2) ───────────────────────────────────────────
 *
 * O item: **60 vídeos no período — 20 em cada uma das três redes.**
 *
 * Um vídeo entra. Ele se multiplica pelos três destinos, cada rede recebe vinte,
 * e a conta fecha em sessenta. A cena existe para matar a leitura errada mais
 * comum ("são 60 por rede?"): o 20 aparece TRÊS vezes antes de o 60 aparecer uma.
 */
import { Legenda, Marca, TINTA } from '../pecas';
import { ARCO, Brilho, Faiscas, TracoDeLuz, useTintas } from '../luz';
import { Cartao, MiniPalco, Sinal, TRES_REDES } from './comuns';
import { motion } from 'framer-motion';
import { tempo, useRoteiro } from '../tempo';

const FASES = [1200, 1400, 1600, 2400] as const;
const ESPALHA = 1;
const VINTES = 2;
const VISTO = 3;

const REDE_Y = [30, 75, 120] as const;
const REDE_X = 268;

/** Os três fios saindo do mesmo vídeo — um por rede, e nenhum a mais. */
function Fios({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  const tintas = useTintas();
  if (!visivel) return null;
  return (
    <g>
      {REDE_Y.map((cy, indice) => (
        <TracoDeLuz
          key={cy}
          d={`M 140 76 C 196 76, 200 ${cy}, ${REDE_X - 22} ${cy}`}
          cor={tintas('arco')}
          largura={1.8}
          halo={2.6}
          parado={parado}
          riscando
          duracao={0.7}
          atraso={indice * 0.1}
        />
      ))}
    </g>
  );
}

/** O vinte de cada rede: o número que faz a conta do sessenta fechar. */
function Vintes({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {REDE_Y.map((cy, indice) => (
        <motion.g
          key={cy}
          initial={{ opacity: parado ? 1 : 0 }}
          animate={{ opacity: visivel ? 1 : 0 }}
          transition={{ duration: tempo(parado, 0.4), delay: tempo(parado, indice * 0.12) }}
        >
          <Legenda x={318} y={cy + 8} corpo={26} cor={ARCO[indice + 2]}>
            20
          </Legenda>
        </motion.g>
      ))}
    </g>
  );
}

export default function Sessenta() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const espalhou = fase >= ESPALHA;

  return (
    <MiniPalco fase={fase}>
      <Brilho x={88} y={76} raio={78} tinta="luzQuente" aceso parado={parado} />
      <Cartao x={36} y={44} largura={104} altura={64} cor={ARCO[0]} tinta="arco" vidro />

      <Fios visivel={espalhou} parado={parado} />

      {TRES_REDES.map((rede, indice) => (
        <Sinal
          key={rede}
          rede={rede}
          cx={REDE_X}
          cy={REDE_Y[indice]}
          raio={19}
          cor={espalhou ? ARCO[indice + 2] : TINTA.linha}
        />
      ))}

      <Vintes visivel={fase >= VINTES} parado={parado} />

      <Brilho x={404} y={72} raio={80} tinta="luz" aceso={fase >= VISTO} parado={parado} />
      {fase >= VISTO && (
        <g>
          <Legenda x={404} y={92} corpo={58} tinta="arco">
            60
          </Legenda>
          <Faiscas x={404} y={72} raio={70} ativo parado={parado} quantidade={9} />
          <Marca tipo="certo" x={404} y={130} cor={TINTA.protege} escala={0.8} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
