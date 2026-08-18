/**
 * ─── MINI-CENA: PERGUNTE ANTES (GA-8) ────────────────────────────────────────
 *
 * O item: **na dúvida, pergunte à equipe ANTES de fazer.**
 *
 * A cena tem dois caminhos saindo da MESMA dúvida. Em cima, o de quem pergunta:
 * a mensagem chega à equipe e volta com o visto. Embaixo, o de quem fez sem
 * perguntar: um traço pontilhado que termina num escudo rachado.
 *
 * Os dois ficam na tela ao mesmo tempo no fim, e é isso que a cena tem de dizer.
 * Alternados, virariam duas histórias; juntos, viram uma escolha — que é o que
 * o item de fato é.
 *
 * ─── O QUE MUDOU NA RODADA DO POLIMENTO ──────────────────────────────────────
 *
 * O dono aprovou a ideia e reprovou a composição: "alinhar ao centro, espaçar o
 * ícone da conversa, hierarquia". O desenho antigo tinha os três defeitos ao
 * mesmo tempo — o caminho certo corria colado no topo do palco, o de baixo
 * cabia no rodapé, e o conjunto inteiro ficava acima do centro; o pontilhado
 * parava no ar, 50 unidades antes do escudo; e o glifo da conversa tinha 26 de
 * largura dentro de um selo de 50, encostando na borda dos dois lados.
 *
 * 1. **Centro.** As duas linhas (44 e 110) são simétricas em volta do meio do
 *    palco, e os dois caminhos saem do MESMO ponto — a borda do balão — em vez
 *    de um sair do lado e o outro do rodapé. Uma dúvida, duas saídas.
 * 2. **Respiro.** Balão, conversa e desfecho ficam a ~164 de distância um do
 *    outro, e o selo cresceu para 28 de raio: o glifo agora tem folga em volta,
 *    em vez de encostar na jaula.
 * 3. **Hierarquia.** O caminho certo é o que tem luz: traço cheio, seta, selo
 *    aceso, visto grande com faísca. O errado é pontilhado e cinza do começo ao
 *    fim, e só o desfecho — o escudo rachado — é vermelho. Cor onde ela
 *    significa; o resto é traço.
 *
 * O quadro parado passou a ser o ÚLTIMO (os dois caminhos na tela), e não o do
 * meio: quem pediu menos movimento recebia só metade da escolha.
 */
import { Legenda, Marca, TINTA, TRACO } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz, useTintas } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco, Selo } from './comuns';
import { motion } from 'framer-motion';
import { tempo, useRoteiro } from '../tempo';

const FASES = [1300, 1400, 2200, 2400] as const;
const MENSAGEM = 1;
const VISTO = 2;
const SEM_PERGUNTAR = 3;

/** As duas linhas da escolha, simétricas em volta do meio do palco (75). */
const ALTO = 44;
const BAIXO = 110;

/** As três estações da leitura, da esquerda para a direita. */
const DUVIDA_X = 80;
const DUVIDA_Y = 68;
const CONVERSA_X = 244;
const FIM_X = 406;

/**
 * O balão da dúvida, desenhado na ORIGEM — o `translate` mora no grupo de fora.
 *
 * O rabicho aponta para baixo e para a esquerda, como o de qualquer balão de
 * fala: para a direita, ele brigaria com os dois caminhos que saem dali.
 */
const BALAO =
  'M -28 -28 H 28 A 12 12 0 0 1 40 -16 V 16 A 12 12 0 0 1 28 28 H -6 L -20 42' +
  ' V 28 H -28 A 12 12 0 0 1 -40 16 V -16 A 12 12 0 0 1 -28 -28 Z';

/** O escudo do caminho de baixo — o mesmo desenho da cena da garantia. */
const ESCUDO = 'M 0 -26 L 22 -17 L 22 3 C 22 17 11 26 0 30 C -11 26 -22 17 -22 3 L -22 -17 Z';
const RACHADURA = 'M 1 -24 l -7 12 l 8 6 l -6 13 l 4 7';

/** O balão da dúvida: a caixa, o rabicho e o ponto de interrogação aceso. */
function Duvida({ parado }: { parado: boolean }) {
  const tintas = useTintas();
  return (
    <g>
      <Brilho x={DUVIDA_X} y={DUVIDA_Y} raio={76} tinta="luzQuente" aceso parado={parado} />
      <g transform={`translate(${DUVIDA_X} ${DUVIDA_Y})`}>
        <path d={BALAO} fill={TINTA.elevado} stroke={tintas('arco')} strokeWidth={1.8} />
      </g>
      <Legenda x={DUVIDA_X} y={DUVIDA_Y + 13} corpo={36} tinta="arco">
        ?
      </Legenda>
    </g>
  );
}

/** O caminho de cima: a mensagem chega à equipe e volta com o visto. */
function CaminhoCerto({ fase, parado }: { fase: number; parado: boolean }) {
  const tintas = useTintas();
  const perguntou = fase >= MENSAGEM;
  const respondeu = fase >= VISTO;
  return (
    <g>
      {perguntou && (
        <TracoDeLuz
          d={`M 126 60 C 164 60, 172 ${ALTO}, 208 ${ALTO} m -13 -9 l 13 9 l -13 9`}
          cor={tintas('arco')}
          largura={2}
          halo={2.4}
          parado={parado}
          riscando
          duracao={0.5}
        />
      )}
      <Brilho x={CONVERSA_X} y={ALTO} raio={58} tinta="luzQuente" aceso={perguntou} parado={parado} />
      {/*
       * O glifo encolheu junto com o selo crescendo: 22 de largura dentro de um
       * círculo de 54 deixa 16 de folga de cada lado. Antes eram 26 dentro de
       * 50, e o balão encostava na borda — o "afogado" que o dono nomeou.
       */}
      <Selo
        x={CONVERSA_X}
        y={ALTO}
        glifo="M -11 -8 h 22 v 15 h -14 l -8 7 z"
        cor={perguntou ? ARCO[4] : TINTA.linha}
        raio={27}
        parado={parado}
      />
      {respondeu && (
        <>
          <TracoDeLuz
            d={`M 280 ${ALTO} h 84 m -13 -9 l 13 9 l -13 9`}
            cor={CERTO}
            largura={2}
            halo={2.4}
            parado={parado}
            riscando
            duracao={0.5}
          />
          <Brilho x={FIM_X} y={ALTO} raio={50} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={FIM_X} y={ALTO} cor={TINTA.protege} escala={1.25} parado={parado} />
          {/* Só o caminho de CIMA ganha o degradê. A cena põe os dois desfechos
              lado a lado de propósito, e é o contraste que ensina: quem perguntou
              tem cor, quem não perguntou tem um escudo rachado. */}
          <FechoDoArco x={FIM_X} y={ALTO + 16} escala={1} parado={parado} />
          <Faiscas x={FIM_X} y={ALTO} raio={48} ativo parado={parado} quantidade={8} cores={[CERTO]} />
        </>
      )}
    </g>
  );
}

/** O caminho de baixo: fez sem perguntar, e o escudo racha. */
function CaminhoErrado({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <motion.g
      initial={{ opacity: parado && visivel ? 1 : 0 }}
      animate={{ opacity: visivel ? 1 : 0 }}
      transition={{ duration: tempo(parado, 0.5) }}
    >
      {/* O pontilhado ENCOSTA no escudo: parado no ar, ele lia como um traço
          esquecido no meio do palco em vez de um caminho que dá em algum lugar. */}
      <path
        d={`M 126 84 C 214 84, 236 ${BAIXO}, ${FIM_X - 28} ${BAIXO}`}
        fill="none"
        stroke={TRACO}
        strokeWidth={1.8}
        strokeDasharray="6 6"
      />
      <Brilho x={FIM_X} y={BAIXO} raio={50} tinta="luzQuebra" aceso={visivel} parado={parado} />
      <g transform={`translate(${FIM_X} ${BAIXO}) scale(0.85)`}>
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
  // O quadro parado é o ÚLTIMO: é ele que tem os DOIS caminhos, e a cena existe
  // para mostrar a escolha inteira, não metade dela.
  const { fase, parado } = useRoteiro(FASES, SEM_PERGUNTAR);

  return (
    <MiniPalco fase={fase}>
      <Duvida parado={parado} />
      <CaminhoCerto fase={fase} parado={parado} />
      <CaminhoErrado visivel={fase >= SEM_PERGUNTAR} parado={parado} />
    </MiniPalco>
  );
}
