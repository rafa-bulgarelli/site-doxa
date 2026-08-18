/**
 * ─── MINI-CENA DO PASSO: UM CANAL (ON-2) ─────────────────────────────────────
 *
 * O passo: **uma pessoa centraliza a conversa.**
 *
 * A história em uma frase: três vozes falando ao mesmo tempo são ruído — UMA
 * vira o canal, e aí a conversa anda.
 *
 * O arco: três balões dispersos falam juntos, cinzas e sem hierarquia · um
 * deles ACENDE e os outros dois recuam · do balão aceso sai um traço único, que
 * atravessa o palco de uma vez · o visto verde fecha a linha.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **Ninguém está errado — só está espalhado.** Nada de vermelho: as outras
 *    duas vozes não quebram regra nenhuma, elas apenas deixam de ser o caminho.
 *    Recuar é opacidade, não xis. Vermelho aqui acusaria pessoas do time do
 *    cliente, e não é isso que a regra diz.
 * 2. **O canal se prova ANDANDO.** Um balão aceso parado não conta nada; o que
 *    conta é o traço que sai dele e chega do outro lado. Foi por falta desse
 *    gesto que a primeira leva de cenas foi reprovada com "não faz nada".
 * 3. **O traço é UM, desenhado uma vez.** Nada de ponto correndo em loop na
 *    linha: "fica escaneando" é o diagnóstico que não pode voltar.
 */
import { motion } from 'framer-motion';
import { Barra, Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, TracoDeLuz } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** Todo mundo fala · um vira o canal · a conversa anda · o visto e a pausa. */
const FASES = [1700, 1500, 1600, 3300] as const;
const CANAL = 1;
const ANDA = 2;
const VISTO = 3;

/** A altura em que a conversa corre: o eixo do balão que vira canal. */
const EIXO = 71;

interface BalaoDaVoz {
  readonly x: number;
  readonly y: number;
  readonly largura: number;
  readonly altura: number;
  /** As duas linhas de dentro: é o que faz o balão ler como fala, não caixa. */
  readonly falas: readonly [number, number];
}

/** O do meio é o maior e o mais centrado — ele é quem vira o canal. */
const BALOES: readonly BalaoDaVoz[] = [
  { x: 22, y: 6, largura: 112, altura: 32, falas: [70, 44] },
  { x: 44, y: 48, largura: 134, altura: 46, falas: [92, 62] },
  // O terceiro entra mais à direita: três balões empilhados na mesma margem
  // leem como lista, e o que a primeira fase precisa dizer é DESENCONTRO.
  { x: 112, y: 100, largura: 106, altura: 30, falas: [62, 38] },
];

const CANAL_INDICE = 1;

interface BalaoProps {
  readonly balao: BalaoDaVoz;
  readonly aceso: boolean;
  readonly recuado: boolean;
  readonly parado: boolean;
}

/**
 * Um balão de fala: a caixa, o rabinho e as duas linhas do que se diz.
 *
 * O rabinho é desenhado por cima de um retalho da cor do fundo, e não com um
 * recorte: o `Painel` fecha a borda dele mesmo, e sem o retalho a linha da caixa
 * atravessaria a boca do rabo — o detalhe que faz um balão parecer um adesivo
 * mal colado em vez de um desenho.
 */
function Balao({ balao, aceso, recuado, parado }: BalaoProps) {
  const { x, y, largura, altura, falas } = balao;
  const base = y + altura;
  const cor = aceso ? TRACO_ACESO : TRACO;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: recuado ? 0.22 : 1 }}
      transition={{ duration: tempo(parado, 0.6), ease: EASE }}
    >
      <Painel
        x={x}
        y={y}
        largura={largura}
        altura={altura}
        cor={cor}
        vidro={aceso}
        raio={12}
      />
      <rect x={x + 17} y={base - 1.2} width={19} height={2.4} fill={TINTA.elevado} />
      <path
        d={`M ${x + 16} ${base} l 3 13 l 17 -13`}
        fill={TINTA.elevado}
        stroke={cor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {falas.map((comprimento, indice) => (
        <Barra
          key={comprimento}
          x={x + 16}
          y={y + 11 + indice * 12}
          largura={comprimento}
          altura={6}
          cor={aceso ? TRACO_ACESO : TINTA.apagado}
          parado={parado}
          atraso={indice * 0.1}
        />
      ))}
    </motion.g>
  );
}

/** O traço do canal: sai do balão aceso e chega do outro lado, de uma vez. */
function Conversa({ parado }: { parado: boolean }) {
  return (
    <TracoDeLuz
      d={`M 194 ${EIXO} H 376 m -12 -9 l 12 9 l -12 9`}
      cor={TRACO_ACESO}
      largura={2.4}
      halo={2.6}
      parado={parado}
      riscando
      duracao={0.9}
    />
  );
}

export default function UmCanal() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const escolhido = fase >= CANAL;

  return (
    <MiniPalco fase={fase}>
      {/* O clarão nasce no balão que vira canal e cresce com a conversa: é a
          luz que diz qual dos três tem a vez, sem gastar uma cor com isso. */}
      <Brilho
        x={112}
        y={EIXO}
        raio={escolhido ? 150 : 0}
        tinta="luz"
        aceso={escolhido}
        parado={parado}
        achatar={0.6}
      />
      {BALOES.map((balao, indice) => (
        <Balao
          key={balao.y}
          balao={balao}
          aceso={escolhido && indice === CANAL_INDICE}
          recuado={escolhido && indice !== CANAL_INDICE}
          parado={parado}
        />
      ))}

      {fase >= ANDA && <Conversa parado={parado} />}

      {fase >= VISTO && (
        <g>
          <Brilho x={414} y={EIXO} raio={46} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={414} y={EIXO} cor={TINTA.protege} escala={1} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
