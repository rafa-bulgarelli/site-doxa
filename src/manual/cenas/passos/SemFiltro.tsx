/**
 * ─── MINI-CENA DO PASSO: SEM FILTRO (CL-2) ───────────────────────────────────
 *
 * O passo: **sem filtro, sem óculos escuros.**
 *
 * A história em uma frase: os dois escondem exatamente o rosto que o clone
 * precisa ver — então os dois saem, e o que fica é você.
 *
 * O arco: o retrato chega de óculos escuros e com o brilho de filtro por cima ·
 * os DOIS ficam vermelhos e a moldura leva o xis · os dois deslizam para fora
 * de cena · o rosto limpo acende e o visto verde fecha.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **O vermelho marca os CULPADOS, não a pessoa.** Quem fica vermelho são os
 *    óculos e as estrelinhas do filtro; o rosto continua no cinza dele. A cena
 *    recusa dois acessórios, e não quem mandou a foto — a diferença cabe numa
 *    escolha de qual forma recebe a cor.
 * 2. **Eles SAEM, e o quadro fica limpo.** Apagar os dois no lugar seria o
 *    mesmo desenho de "sumiu"; deslizando para fora, a cena mostra o gesto que
 *    a regra pede — tirar. E o palco fica com o quadro final, que é o que quem
 *    passa os olhos leva embora.
 * 3. **O filtro é DESENHADO, não aplicado.** Duas estrelinhas sobre o rosto são
 *    o ícone universal de "melhorar/embelezar" em qualquer app de câmera —
 *    custam dois `path` e não custam um `feGaussianBlur` em loop no celular.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { Rosto } from './comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** Com os dois · a recusa · eles saem · o rosto limpo e o visto. */
const FASES = [1700, 1700, 1500, 3400] as const;
const RECUSA = 1;
const LIMPO = 2;
const VISTO = 3;

const MOLDURA = { x: 70, y: 12, largura: 176, altura: 126 } as const;
const ROSTO_X = MOLDURA.x + MOLDURA.largura / 2;
const ROSTO_Y = 76;
/** O lugar do veredito: o xis e o visto ocupam o MESMO ponto, em fases diferentes. */
const VEREDITO_X = 380;

/** A estrelinha de quatro pontas — o ícone de "embelezar" de qualquer câmera. */
const ESTRELA = 'M 0 -8 L 2.2 -2.2 L 8 0 L 2.2 2.2 L 0 8 L -2.2 2.2 L -8 0 L -2.2 -2.2 Z';

/** Onde o filtro brilha por cima do rosto. */
const ESTRELAS = [
  { x: 108, y: 34, escala: 1 },
  { x: 208, y: 52, escala: 0.72 },
  { x: 196, y: 112, escala: 0.86 },
] as const;

/**
 * Os óculos escuros: duas lentes largas, a ponte e as hastes.
 *
 * Lente RETANGULAR, e não dois aros redondos: dois círculos na altura dos olhos
 * dentro de uma cabeça redonda leem como OLHOS — a cena inteira vira uma
 * carinha, e o acessório que ela precisa recusar desaparece como acessório.
 */
function Oculos({ cor }: { cor: string }) {
  return (
    <g transform={`translate(${ROSTO_X} ${ROSTO_Y})`} stroke={cor} strokeWidth={1.8}>
      <rect x={-19} y={-20} width={16} height={11} rx={3.5} fill={cor} fillOpacity={0.4} />
      <rect x={3} y={-20} width={16} height={11} rx={3.5} fill={cor} fillOpacity={0.4} />
      <path d="M -3 -17 h 6 M -19 -18 l -4 -2 M 19 -18 l 4 -2" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** O brilho de filtro: as estrelinhas espalhadas sobre o retrato. */
function Filtro({ cor }: { cor: string }) {
  return (
    <g fill={cor}>
      {ESTRELAS.map(({ x, y, escala }) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${escala})`}>
          <path d={ESTRELA} />
        </g>
      ))}
    </g>
  );
}

interface AcessoriosProps {
  readonly recusados: boolean;
  readonly saiu: boolean;
  readonly parado: boolean;
}

/**
 * Os dois que precisam sair, num grupo só — porque saem juntos.
 *
 * O deslocamento da saída vai no `x` do grupo que anima, e o grupo não tem
 * `transform` próprio: framer escreve nesse atributo, e um `translate` aqui
 * seria apagado no primeiro quadro. Quem posiciona são os filhos.
 */
function Acessorios({ recusados, saiu, parado }: AcessoriosProps) {
  const cor = recusados ? QUEBRA : TINTA.apagado;
  return (
    <motion.g
      initial={false}
      animate={{ x: saiu ? 54 : 0, opacity: saiu ? 0 : 1 }}
      transition={{ duration: tempo(parado, 0.7), ease: EASE }}
    >
      <Oculos cor={cor} />
      <Filtro cor={cor} />
    </motion.g>
  );
}

interface VereditoProps {
  readonly tipo: 'certo' | 'errado';
  readonly parado: boolean;
}

/**
 * O carimbo do julgamento, sempre no MESMO ponto do palco.
 *
 * O xis da recusa e o visto da aprovação ocupam o mesmo lugar de propósito: é o
 * lado do palco reservado a "o que a equipe achou disto", e mudar o ponto entre
 * uma fase e outra faria a cena parecer duas cenas coladas.
 */
function Veredito({ tipo, parado }: VereditoProps) {
  const certo = tipo === 'certo';
  return (
    <g>
      <Brilho
        x={VEREDITO_X}
        y={ROSTO_Y}
        raio={certo ? 50 : 54}
        tinta={certo ? 'luzCerta' : 'luzQuebra'}
        aceso
        parado={parado}
      />
      <Marca
        tipo={tipo}
        x={VEREDITO_X}
        y={ROSTO_Y}
        cor={certo ? TINTA.protege : QUEBRA}
        escala={1.1}
        parado={parado}
      />
    </g>
  );
}

/** A borda da foto: muda, vermelha na recusa, acesa limpa, verde no fim. */
function bordaDaFoto(fase: number): string {
  if (fase >= VISTO) return TINTA.protege;
  if (fase >= LIMPO) return TRACO_ACESO;
  return fase === RECUSA ? QUEBRA : TRACO;
}

export default function SemFiltro() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const limpo = fase >= LIMPO;

  return (
    <MiniPalco fase={fase}>
      {/* O clarão do fim é BRANCO — o rosto limpo ACENDE. O verde fica só no
          visto, e o vermelho, só no que foi recusado. */}
      <Brilho
        x={ROSTO_X}
        y={ROSTO_Y}
        raio={126}
        tinta="luz"
        aceso={limpo}
        parado={parado}
        achatar={0.72}
      />
      <Painel
        x={MOLDURA.x}
        y={MOLDURA.y}
        largura={MOLDURA.largura}
        altura={MOLDURA.altura}
        cor={bordaDaFoto(fase)}
        vidro={limpo}
        raio={12}
      />
      <g transform={`translate(${ROSTO_X} ${ROSTO_Y})`}>
        <Rosto cor={limpo ? TINTA.branco : TINTA.apagado} brilho={limpo} />
      </g>
      <Acessorios recusados={fase === RECUSA} saiu={limpo} parado={parado} />

      {fase === RECUSA && <Veredito tipo="errado" parado={parado} />}
      {fase >= VISTO && <Veredito tipo="certo" parado={parado} />}
    </MiniPalco>
  );
}
