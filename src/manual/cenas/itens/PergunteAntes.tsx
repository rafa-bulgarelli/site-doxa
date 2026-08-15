/**
 * ─── MINI-CENA: PERGUNTE ANTES (GA-8) ────────────────────────────────────────
 *
 * O item: **na dúvida, pergunte à equipe ANTES de fazer.**
 *
 * A cena tem dois caminhos saindo da mesma dúvida. Em cima, o caminho de quem
 * pergunta: a mensagem chega à equipe e volta com o visto. Embaixo, o de quem
 * fez sem perguntar: um traço pontilhado que termina num escudo rachado.
 *
 * Os dois ficam na tela ao mesmo tempo no fim, e é isso que a cena tem de dizer.
 * Alternados, virariam duas histórias; juntos, viram uma escolha — que é o que
 * o item de fato é.
 */
import { Legenda, Marca, TINTA, TRACO } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz, useTintas } from '../luz';
import { MiniPalco, Selo } from './comuns';
import { motion } from 'framer-motion';
import { tempo, useRoteiro } from '../tempo';

const FASES = [1300, 1400, 2200, 2400] as const;
const MENSAGEM = 1;
const VISTO = 2;
const SEM_PERGUNTAR = 3;

const ALTO = 56;
const BAIXO = 118;

/** O escudo pequeno do caminho de baixo — o mesmo desenho da cena da garantia. */
const ESCUDO = 'M 0 -26 L 22 -17 L 22 3 C 22 17 11 26 0 30 C -11 26 -22 17 -22 3 L -22 -17 Z';
const RACHADURA = 'M 1 -24 l -7 12 l 8 6 l -6 13 l 4 7';

/** O balão da dúvida: a caixa, o rabicho e o ponto de interrogação aceso. */
function Duvida({ parado }: { parado: boolean }) {
  const tintas = useTintas();
  return (
    <g>
      <Brilho x={64} y={ALTO} raio={72} tinta="luzQuente" aceso parado={parado} />
      <path
        d="M 22 26 h 84 a 12 12 0 0 1 12 12 v 30 a 12 12 0 0 1 -12 12 h -30 l -14 14 v -14 h -40 a 12 12 0 0 1 -12 -12 v -30 a 12 12 0 0 1 12 -12 z"
        fill={TINTA.elevado}
        stroke={tintas('arco')}
        strokeWidth={1.8}
      />
      <Legenda x={64} y={66} corpo={36} tinta="arco">
        ?
      </Legenda>
    </g>
  );
}

/** O caminho de cima: a mensagem chega à equipe e volta com o visto. */
function CaminhoCerto({ fase, parado }: { fase: number; parado: boolean }) {
  const tintas = useTintas();
  const respondeu = fase >= VISTO;
  return (
    <g>
      {fase >= MENSAGEM && (
        <TracoDeLuz
          d={`M 130 ${ALTO} h 42 m -13 -9 l 13 9 l -13 9`}
          cor={tintas('arco')}
          largura={2}
          halo={2.4}
          parado={parado}
          riscando
          duracao={0.5}
        />
      )}
      <Brilho x={214} y={ALTO} raio={58} tinta="luzQuente" aceso={fase >= MENSAGEM} parado={parado} />
      <Selo
        x={214}
        y={ALTO}
        glifo="M -13 -9 h 26 v 17 h -17 l -9 8 z"
        cor={fase >= MENSAGEM ? ARCO[4] : TINTA.linha}
        raio={25}
        parado={parado}
      />
      {respondeu && (
        <>
          <TracoDeLuz
            d={`M 252 ${ALTO} h 42 m -13 -9 l 13 9 l -13 9`}
            cor={CERTO}
            largura={2}
            halo={2.4}
            parado={parado}
            riscando
            duracao={0.5}
          />
          <Brilho x={352} y={ALTO} raio={62} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={352} y={ALTO} cor={TINTA.protege} escala={1.3} parado={parado} />
          <Faiscas x={352} y={ALTO} raio={56} ativo parado={parado} quantidade={8} cores={[CERTO]} />
        </>
      )}
    </g>
  );
}

/** O caminho de baixo: fez sem perguntar, e o escudo racha. */
function CaminhoErrado({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: visivel ? 1 : 0 }}
      transition={{ duration: tempo(parado, 0.5) }}
    >
      <path
        d={`M 96 96 C 96 ${BAIXO}, 140 ${BAIXO}, 300 ${BAIXO}`}
        fill="none"
        stroke={TRACO}
        strokeWidth={1.8}
        strokeDasharray="6 6"
      />
      <Brilho x={352} y={BAIXO} raio={58} tinta="luzQuebra" aceso={visivel} parado={parado} />
      <g transform={`translate(352 ${BAIXO})`}>
        <TracoDeLuz d={ESCUDO} cor={QUEBRA} largura={2} halo={2.6} parado={parado} />
        {visivel && (
          <TracoDeLuz
            d={RACHADURA}
            cor={QUEBRA}
            largura={2.4}
            halo={2.4}
            parado={parado}
            riscando
            duracao={0.5}
          />
        )}
      </g>
    </motion.g>
  );
}

export default function PergunteAntes() {
  const { fase, parado } = useRoteiro(FASES, VISTO);

  return (
    <MiniPalco fase={fase}>
      <Duvida parado={parado} />
      <CaminhoCerto fase={fase} parado={parado} />
      <CaminhoErrado visivel={fase >= SEM_PERGUNTAR} parado={parado} />
    </MiniPalco>
  );
}
