/**
 * ─── A LUZ DAS CENAS ─────────────────────────────────────────────────────────
 *
 * O dono olhou a primeira leva de cenas e disse a frase que virou este arquivo:
 * "a animação tá horrível — deixa ela bem bonita, bem chamativa". O diagnóstico
 * era simples: desenho cinza sobre fundo preto não impressiona ninguém. Faltava
 * LUZ.
 *
 * A cor não foi inventada aqui. Ela é a mesma do efeito Siri da seção de
 * dúvidas — `components/faq/cores.ts`, o arco do âmbar ao verde-água que já
 * corre no anel do campo e no brilho do convite. Importar em vez de repetir é o
 * que mantém o site com UMA paleta: mexeu lá, mexe aqui junto, e as cenas nunca
 * ficam com um violeta de outra família.
 *
 * ─── TRÊS DECISÕES QUE VALEM PARA TODAS AS CENAS ─────────────────────────────
 *
 * 1. **Gradiente no traço, não fundo colorido.** O palco continua preto
 *    (`doxa-surface`): a cor vem NAS FORMAS e na luz que elas soltam. Fundo
 *    chapado colorido é o que separa "ilustração do site" de clipart.
 *
 * 2. **Brilho por camadas de traço, não por filtro.** `feGaussianBlur` num SVG
 *    que anima em loop custa caro no celular — e o celular é onde o manual é
 *    lido. O mesmo caminho desenhado três vezes (grosso e quase transparente,
 *    médio, fino e cheio) dá o halo por uma fração do preço, e sem depender de
 *    suporte a filtro nenhum.
 *
 * 3. **`id` de gradiente é GLOBAL no documento.** Duas cenas na mesma página com
 *    `id="arco"` fazem a segunda pintar com o gradiente da primeira — ou com
 *    nada, se a primeira desmontar. Por isso o `id` nasce de `useId()` e viaja
 *    por contexto: cada palco tem a sua paleta, e ninguém precisa lembrar disso
 *    ao escrever uma cena nova.
 */
import { createContext, useContext, useId } from 'react';
import { motion } from 'framer-motion';
import { CORES } from '../../components/faq/cores';

/** O arco Siri, do quente ao frio — a assinatura de cor das cenas. */
export const ARCO = CORES;

/**
 * A cor do arco na fração pedida — 0 é o âmbar, 1 é o verde-água.
 *
 * Serve para pintar uma FILA de formas (as barras de uma onda, os dias de uma
 * semana) com o arco inteiro sem gradiente nenhum: cada forma recebe uma cor
 * chapada, e é a fila que desenha o degradê. Um `linearGradient` por forma
 * pintaria o arco inteiro dentro de sete pixels e sairia marrom.
 */
export function corDoArco(fracao: number): string {
  const limite = Math.min(1, Math.max(0, fracao));
  return ARCO[Math.round(limite * (ARCO.length - 1))];
}

/** O verde do que mantém o direito e o vermelho do que o perde. */
export const CERTO = '#34D399';
export const QUEBRA = '#F87171';

/**
 * As tintas que uma cena pode pedir.
 *
 * Nomes de significado, não de cor: quem escreve a cena pede `certo`, e quem
 * mexe na paleta decide que verde é esse em um lugar só.
 */
export type Tinta =
  | 'arco'
  | 'arcoVertical'
  | 'quente'
  | 'frio'
  | 'certo'
  | 'errado'
  | 'vidro'
  | 'luz'
  | 'luzQuente'
  | 'luzCerta'
  | 'luzQuebra';

const ContextoDaCena = createContext<string | null>(null);

/**
 * O tradutor de tinta em referência, para o desenho que está no palco.
 *
 * Devolve uma FUNÇÃO, e não uma cor: uma peça costuma escolher a tinta pelo
 * estado ("aceso pinta com o arco, apagado com a linha"), e um hook não pode ser
 * chamado dentro de um `if`.
 *
 * Lança fora de `<Palco>` de propósito: o modo silencioso de errar isto é
 * `stroke="url(#arco)"` apontando para um gradiente que não existe, o que pinta
 * a forma de PRETO no preto — some sem um erro no console.
 */
export function useTintas(): (nome: Tinta) => string {
  const id = useContext(ContextoDaCena);
  if (id == null) {
    throw new Error('useTintas() só funciona dentro de <Palco>: a paleta mora no palco.');
  }
  return (nome) => `url(#${id}-${nome})`;
}

/**
 * O prefixo desta cena, sem os dois-pontos que o React usa em `useId`.
 *
 * `:r3:` é `id` válido em HTML, mas um `url(#:r3:)` dentro do SVG é o tipo de
 * coisa que um navegador aceita e o próximo engasga. Tirar os dois-pontos custa
 * uma linha e não custa nada depois.
 */
export function useIdDaCena(): string {
  return `cena${useId().replace(/:/g, '')}`;
}

export const ProvedorDaCena = ContextoDaCena.Provider;

/* ─── A PALETA ─────────────────────────────────────────────────────────────── */

/** Os gradientes de linha: o arco inteiro e os dois meios-arcos. */
function TintasDeArco({ id }: { id: string }) {
  const passo = 100 / (ARCO.length - 1);
  return (
    <>
      <linearGradient id={`${id}-arco`} x1="0" y1="0" x2="1" y2="0">
        {ARCO.map((cor, indice) => (
          <stop key={cor} offset={`${indice * passo}%`} stopColor={cor} />
        ))}
      </linearGradient>
      <linearGradient id={`${id}-arcoVertical`} x1="0" y1="0" x2="0" y2="1">
        {ARCO.map((cor, indice) => (
          <stop key={cor} offset={`${indice * passo}%`} stopColor={cor} />
        ))}
      </linearGradient>
      <linearGradient id={`${id}-quente`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={ARCO[0]} />
        <stop offset="100%" stopColor={ARCO[2]} />
      </linearGradient>
      <linearGradient id={`${id}-frio`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={ARCO[4]} />
        <stop offset="100%" stopColor={ARCO[5]} />
      </linearGradient>
    </>
  );
}

/** Os gradientes de julgamento e o vidro que preenche um painel aceso. */
function TintasDeVeredito({ id }: { id: string }) {
  return (
    <>
      <linearGradient id={`${id}-certo`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={CERTO} />
        <stop offset="100%" stopColor={ARCO[5]} />
      </linearGradient>
      <linearGradient id={`${id}-errado`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={QUEBRA} />
        <stop offset="100%" stopColor={ARCO[2]} />
      </linearGradient>
      <linearGradient id={`${id}-vidro`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.08} />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.02} />
      </linearGradient>
    </>
  );
}

interface HaloProps {
  readonly id: string;
  readonly nome: string;
  readonly cor: string;
  readonly forca: number;
}

/** Um clarão: cheio no centro, nada na borda — é assim que luz cai. */
function TintaDeLuz({ id, nome, cor, forca }: HaloProps) {
  return (
    <radialGradient id={`${id}-${nome}`}>
      <stop offset="0%" stopColor={cor} stopOpacity={forca} />
      <stop offset="55%" stopColor={cor} stopOpacity={forca * 0.35} />
      <stop offset="100%" stopColor={cor} stopOpacity={0} />
    </radialGradient>
  );
}

/** Tudo que o palco precisa ter em `defs` para as cenas pedirem por nome. */
export function Paleta({ id }: { id: string }) {
  return (
    <defs>
      <TintasDeArco id={id} />
      <TintasDeVeredito id={id} />
      <TintaDeLuz id={id} nome="luz" cor="#FFFFFF" forca={0.3} />
      <TintaDeLuz id={id} nome="luzQuente" cor={ARCO[1]} forca={0.55} />
      <TintaDeLuz id={id} nome="luzCerta" cor={CERTO} forca={0.5} />
      <TintaDeLuz id={id} nome="luzQuebra" cor={QUEBRA} forca={0.5} />
    </defs>
  );
}

/* ─── AS PEÇAS DE LUZ ──────────────────────────────────────────────────────── */

interface BrilhoProps {
  readonly x: number;
  readonly y: number;
  readonly raio: number;
  /** Qual clarão: o branco, o quente, o do certo ou o da quebra. */
  readonly tinta: Extract<Tinta, 'luz' | 'luzQuente' | 'luzCerta' | 'luzQuebra'>;
  readonly aceso: boolean;
  readonly parado: boolean;
  /** Achatamento: 1 é redondo, 0.4 é a mancha larga sob uma onda. */
  readonly achatar?: number;
}

/**
 * A mancha de luz atrás de uma forma.
 *
 * Ela pulsa devagar quando acesa — respiração, não pisca-pisca. O pulso é o que
 * separa "tem um degradê ali" de "aquilo está LIGADO".
 */
export function Brilho({ x, y, raio, tinta, aceso, parado, achatar = 1 }: BrilhoProps) {
  const cor = useTintas()(tinta);
  const alvo = aceso ? 1 : 0;
  return (
    <motion.ellipse
      cx={x}
      cy={y}
      rx={raio}
      ry={raio * achatar}
      fill={cor}
      initial={{ opacity: alvo }}
      animate={parado || !aceso ? { opacity: alvo } : { opacity: [0.65, 1, 0.65] }}
      transition={
        parado || !aceso
          ? { duration: 0.5 }
          : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
      }
    />
  );
}

interface TracoDeLuzProps {
  readonly d: string;
  readonly cor: string;
  readonly largura?: number;
  readonly parado: boolean;
  /** Quando verdadeiro, o traço se DESENHA em vez de aparecer pronto. */
  readonly riscando?: boolean;
  readonly duracao?: number;
  readonly atraso?: number;
  readonly tracejado?: string;
  /**
   * Quantas vezes o halo é mais grosso que o traço.
   *
   * Quatro é o padrão e serve para linha longa. Num glifo pequeno — a ponta de
   * uma seta, a onda de som de dois arcos — quatro vezes a espessura FECHA o
   * desenho: o halo encosta nele mesmo e o que sobra é uma mancha de cor com a
   * forma de nada. Aí o valor cai para perto de dois.
   */
  readonly halo?: number;
}

/**
 * Um caminho que brilha: três passadas do mesmo `d`.
 *
 * A de fora é quatro vezes mais grossa e quase invisível; a do meio segura a
 * cor; a de dentro é o traço de verdade. Sobre preto isso lê como neon — e é a
 * mesma conta que o `.texto-aceso-siri` faz com duas `drop-shadow`.
 */
export function TracoDeLuz({
  d,
  cor,
  largura = 2.5,
  parado,
  riscando = false,
  duracao = 0.8,
  atraso = 0,
  tracejado,
  halo = 4,
}: TracoDeLuzProps) {
  const comum = {
    d,
    fill: 'none',
    stroke: cor,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: tracejado,
  } as const;
  const risco = riscando && !parado;
  const animacao = {
    initial: { pathLength: risco ? 0 : 1, opacity: risco ? 0 : 1 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: risco ? duracao : 0, delay: risco ? atraso : 0 },
  };
  return (
    <g>
      <motion.path {...comum} {...animacao} strokeWidth={largura * halo} opacity={0.1} />
      <motion.path
        {...comum}
        {...animacao}
        strokeWidth={largura * (1 + (halo - 1) / 2)}
        opacity={0.28}
      />
      <motion.path {...comum} {...animacao} strokeWidth={largura} />
    </g>
  );
}

/** O ângulo de ouro: espalha N pontos em volta sem dois caírem no mesmo raio. */
const ANGULO_OURO = 2.399963;

interface FaiscasProps {
  readonly x: number;
  readonly y: number;
  /** Até onde a faísca viaja antes de apagar. */
  readonly raio: number;
  readonly quantidade?: number;
  readonly ativo: boolean;
  readonly parado: boolean;
  readonly cores?: readonly string[];
  readonly duracao?: number;
}

/**
 * As faíscas de um acerto.
 *
 * Só existem quando a cena está EM MOVIMENTO: quem pediu menos movimento recebe
 * o desenho final limpo, e faísca parada no meio do voo é sujeira, não enfeite.
 */
export function Faiscas({
  x,
  y,
  raio,
  quantidade = 9,
  ativo,
  parado,
  cores = ARCO,
  duracao = 1.6,
}: FaiscasProps) {
  if (parado || !ativo) return null;
  return (
    <g>
      {Array.from({ length: quantidade }, (_, indice) => {
        const angulo = indice * ANGULO_OURO;
        const distancia = raio * (0.55 + ((indice * 7) % 5) / 10);
        return (
          <motion.circle
            key={indice}
            r={2.4}
            fill={cores[indice % cores.length]}
            initial={{ cx: x, cy: y, opacity: 0 }}
            animate={{
              cx: [x, x + Math.cos(angulo) * distancia],
              cy: [y, y + Math.sin(angulo) * distancia],
              opacity: [0, 0.95, 0],
            }}
            transition={{
              duration: duracao,
              repeat: Infinity,
              delay: indice * 0.13,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </g>
  );
}

interface PoeiraProps {
  readonly x: number;
  readonly largura: number;
  readonly base: number;
  readonly quantidade?: number;
  readonly parado: boolean;
  readonly cores?: readonly string[];
}

/**
 * A poeira que sobe no fundo do palco — o ambiente, não o assunto.
 *
 * É o que faz a cena parecer viva mesmo no quadro em que nada acontece. Fica
 * discreta de propósito: 0.5 de opacidade num ponto de 1.6 de raio.
 */
export function Poeira({ x, largura, base, quantidade = 7, parado, cores = ARCO }: PoeiraProps) {
  if (parado) return null;
  return (
    <g>
      {Array.from({ length: quantidade }, (_, indice) => {
        const px = x + ((indice * 37) % largura);
        const subida = 26 + ((indice * 13) % 22);
        return (
          <motion.circle
            key={indice}
            cx={px}
            r={1.6}
            fill={cores[indice % cores.length]}
            initial={{ cy: base, opacity: 0 }}
            animate={{ cy: [base, base - subida], opacity: [0, 0.5, 0] }}
            transition={{
              duration: 4 + (indice % 3),
              repeat: Infinity,
              delay: indice * 0.7,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </g>
  );
}
