import { useCallback, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { useIdioma } from '../idioma';
import {
  CloneArt,
  OnboardingArt,
  OutputArt,
  type ArtProps,
  type ArtState,
} from './howitworks/StepArt';

/**
 * The reference's own easing, lifted from its stylesheet. A near-instant start
 * that coasts to a stop — which is what makes a panel opening read as it
 * settling into place rather than sliding there.
 */
const EASE_CLASS = 'ease-[cubic-bezier(.45,0,0,1)]';

/**
 * ─── A ENTRADA DA SEÇÃO ──────────────────────────────────────────────────────
 *
 * Pedido do dono: a seção inteira animada na chegada, com "efeito borracha".
 *
 * A borracha é uma MOLA de verdade e não uma curva com overshoot desenhado à
 * mão: o que dá a sensação de peso é a desaceleração ser calculada a partir de
 * massa e atrito, e não interpolada. `damping` 15 contra `stiffness` 110 deixa o
 * painel passar um fio além do lugar e voltar uma vez só — duas voltas seriam um
 * card de borracha, o que é outra coisa (e cansa na segunda visita à página).
 *
 * O que ela move é SÓ transform. Nada aqui toca `flex-grow`, `border-color` ou
 * `box-shadow`, que são as três propriedades com que a fileira já conta a sua
 * própria história — o passo que tem a vez cresce, acende a borda e levanta do
 * preto, em 600ms de CSS. Duas gramáticas de animação no mesmo elemento, se
 * disputassem as mesmas propriedades, brigariam a cada quadro.
 */
const MOLA = { type: 'spring', stiffness: 110, damping: 15, mass: 0.9 } as const;

/** A curva do site para o que é fade puro, onde mola não faz sentido. */
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * O intervalo entre um painel e o seguinte, em segundos.
 *
 * Cem milissegundos é o bastante para o olho ler três chegadas em vez de uma
 * fileira aparecendo — e curto o bastante para o terceiro não estar ainda
 * entrando quando a pessoa já está lendo o primeiro. O escalonamento vale para o
 * MOVIMENTO e não para o fade: os três clareiam juntos, e é isso que impede a
 * entrada de virar uma sequência de três eventos separados.
 */
const PASSO_A_PASSO = 0.1;

interface Step {
  /** Two digits, set beside the name the way the reference numbers its steps. */
  number: string;
  name: string;
  headline: string;
  body: string;
  /** The component, not an element: each card is handed its own turn state. */
  Art: (props: ArtProps) => JSX.Element;
}

/**
 * PENDENTE-DONO: the three steps and what happens inside each are the owner's,
 * from his brief. The wording is mine. Read the sentences as a first pass — the
 * shape of the process is signed off, the phrasing is not.
 */
const STEPS_PT: readonly Step[] = [
  {
    number: '01',
    name: 'Onboarding',
    headline: 'A gente aprende o seu negócio',
    body: 'Uma reunião para preencher o que você faz, quem você quer atingir e o que espera dos vídeos.',
    Art: OnboardingArt,
  },
  {
    number: '02',
    name: 'Criar clones',
    // PENDENTE-DONO: the copy followed the artwork here. The old card was about
    // crossing themes with the market and the wording described that; the step
    // is now the clone being built, so the claim about themes was dropped
    // rather than left standing over a card that no longer shows it.
    headline: 'Uma foto e um áudio viram o seu clone',
    body: 'Você manda uma foto e uma amostra da sua voz. A plataforma monta o clone que vai gravar os vídeos no seu lugar.',
    Art: CloneArt,
  },
  {
    number: '03',
    name: 'Publicação',
    headline: 'O vídeo pronto para postar',
    body: 'Vertical, legendado, no formato do feed. Você recebe e publica no seu perfil.',
    Art: OutputArt,
  },
];

/*
 * Os MESMOS três passos em inglês. `number` e `art` não mudam de idioma — a
 * arte é a mesma máquina — e a ordem é contrato com o giro automático.
 */
const STEPS_EN: readonly Step[] = STEPS_PT.map((step, i) => ({
  ...step,
  ...[
    {
      name: 'Onboarding',
      headline: 'We learn your business',
      body: 'One meeting to map what you do, who you want to reach and what you expect from the videos.',
    },
    {
      name: 'Clone creation',
      headline: 'One photo and one audio clip become your clone',
      body: 'You send a photo and a sample of your voice. The platform builds the clone that will record the videos in your place.',
    },
    {
      name: 'Publishing',
      headline: 'The video, ready to post',
      body: 'Vertical, captioned, in feed format. You receive it and publish it on your profile.',
    },
  ][i],
}));

const STEPS: { pt: readonly Step[]; en: readonly Step[] } = {
  pt: STEPS_PT,
  en: STEPS_EN,
};

const TEXTO_SECAO = {
  pt: {
    titulo: 'Como funciona.',
    subtitulo: 'Três passos, e só o primeiro pede o seu tempo.',
    pausar: 'Pausar',
    retomar: 'Retomar',
  },
  en: {
    titulo: 'How it works.',
    subtitulo: 'Three steps, and only the first one asks for your time.',
    pausar: 'Pause',
    retomar: 'Resume',
  },
} as const;


/**
 * One panel of the row, and the thing that decides when its artwork plays.
 *
 * That decision lives here rather than in the section because it is not the
 * same question on the two layouts. Side by side, the row is a set of panels
 * trading space and the pointer hands the turn around — there is one turn and
 * the section owns it. Stacked, the panels are a column you scroll through:
 * there is no pointer to hand anything to, and no reason for a card three
 * screens down to be running. So each card watches itself and plays while it is
 * the thing on screen, which is what tying the animation to scroll means.
 */
function StepCard({
  step,
  isDesktop,
  /** The visitor pressed pause. Stops the card on either layout. */
  stopped,
  /** Wide layout: this card holds the turn. */
  hasTurn,
  /** Wide layout: where the card sits in the pass. */
  turnState,
  /** Wide layout: the row is off screen or stopped. */
  rowPaused,
  hovered,
  /** Onde o card está na fileira. Só o escalonamento da entrada lê isto. */
  ordem,
  onEnter,
  onLeave,
  onFinish,
}: {
  step: Step;
  isDesktop: boolean;
  stopped: boolean;
  hasTurn: boolean;
  turnState: ArtState;
  rowPaused: boolean;
  hovered: boolean;
  ordem: number;
  onEnter: () => void;
  onLeave: () => void;
  onFinish: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /**
   * Only consulted on the stacked layout. A third of the panel is enough to say
   * the visitor has arrived at it — waiting for a card taller than the viewport
   * to be mostly visible is a threshold a short phone can never reach.
   */
  const inView = useInView(ref, { amount: 0.35 });

  /**
   * A CHEGADA, e por que ela é um observador separado do de cima.
   *
   * `once: true`: a entrada acontece uma vez na vida do card. O `inView` ao lado
   * é o contrário disso de propósito — ele precisa relatar a saída para a
   * animação de dentro pausar —, e reaproveitá-lo aqui faria os três painéis
   * refazerem a entrada a cada rolagem para cima e para baixo. O que impressiona
   * na primeira vez irrita na terceira.
   *
   * Um quinto do card, e não o terço do outro: a entrada tem de disparar ANTES
   * de a pessoa estar lendo o painel, senão ela vê o card já parado e a animação
   * aconteceu para ninguém.
   */
  const entrou = useInView(ref, { amount: 0.2, once: true });
  const parado = useReducedMotion() === true;

  // Stacked, every card is open: there is nothing to retract into, and dimming
  // the card you scrolled to would be dimming the only one on screen.
  const open = isDesktop ? hasTurn : true;
  const state: ArtState = isDesktop ? turnState : inView ? 'running' : 'idle';
  const paused = isDesktop ? rowPaused : stopped || !inView;

  /* O atraso de cada painel. Fora da mola, e não dentro dela, porque ele vale
     só para a chegada — depois disso `y` e `scale` não se mexem mais, e um
     atraso que sobrasse aqui não teria o que atrasar. */
  const atraso = ordem * PASSO_A_PASSO;

  return (
    <motion.div
      ref={ref}
      /* ─── A ENTRADA, E O QUE ELA NÃO PODE TOCAR ───────────────────────────
       *
       * A opacidade saiu das CLASSES e veio para cá, e essa é a única mudança
       * de mecanismo: o card já usava `opacity` para dizer se tem a vez (100%)
       * ou se está esperando (70%), e duas fontes escrevendo a mesma
       * propriedade — a classe e o framer — dariam um painel que nunca chega ao
       * valor de nenhuma das duas. Aqui ela é uma só, e o valor de estado
       * continua idêntico ao que era.
       *
       * O resto da história da fileira ficou onde estava: `flex-grow`,
       * `border-color` e `box-shadow` seguem em transição CSS, e nada nesta
       * animação encosta neles.
       *
       * As transições são POR PROPRIEDADE, e é isso que faz o escalonamento
       * funcionar sem estragar a troca de vez:
       *
       *  - `y` e `scale` são a chegada, em mola, com o atraso do lugar na
       *    fileira. Depois de assentados não se movem de novo.
       *  - `opacity` é fade puro, SEM atraso — na chegada porque os três
       *    clareando juntos leem como uma seção aparecendo, e depois dela
       *    porque é a mesma propriedade que anuncia a troca de vez, e um
       *    atraso ali faria o terceiro card demorar 200ms para acender ao
       *    receber o turno.
       */
      initial={parado ? false : { opacity: 0, y: 56, scale: 0.94 }}
      animate={
        parado
          ? { opacity: open ? 1 : 0.7 }
          : entrou
            ? { opacity: open ? 1 : 0.7, y: 0, scale: 1 }
            : { opacity: 0, y: 56, scale: 0.94 }
      }
      transition={{
        y: { ...MOLA, delay: atraso },
        scale: { ...MOLA, delay: atraso },
        opacity: { duration: 0.6, ease: EASE },
      }}
      // Focus counts as hover: a keyboard tab through the row has to open the
      // panels too, or the artwork inside them never plays for anyone who is
      // not using a mouse. Both are wide-layout only — stacked, the scroll
      // position already says which card the visitor is at.
      onMouseEnter={isDesktop ? onEnter : undefined}
      onMouseLeave={isDesktop ? onLeave : undefined}
      onFocus={isDesktop ? onEnter : undefined}
      onBlur={isDesktop ? onLeave : undefined}
      tabIndex={isDesktop ? 0 : undefined}
      // SEM `aria-expanded` aqui, e não é esquecimento. Ele esteve neste
      // elemento e reprovava "Elements must only use supported ARIA attributes"
      // no Lighthouse: o atributo só é válido em papéis como `button` ou
      // `combobox`, e isto é uma `div` sem `role`. Dar-lhe `role="button"` para
      // calar o aviso seria pior — anunciaria aos leitores de tela um botão que
      // não faz nada ao ser acionado, já que o card não tem `onClick`.
      //
      // A verdade é que aqui não há revelação nenhuma a anunciar: o card
      // fechado continua inteiro no DOM e legível, só com `opacity` em 0,7 e
      // menos `flex`. Nada é escondido, então não há estado expandido/recolhido
      // que uma pessoa usando leitor de tela precise ouvir — é ênfase visual, e
      // ênfase visual não se descreve em ARIA.
      // The open card is told apart by its edge as well as by its size: a
      // brighter border and a lift off the black. The retracted ones come back
      // up from 45% — far enough down to be clearly waiting, but they are still
      // the argument, and at 45% they were reading as switched off rather than
      // as next.
      className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border bg-doxa-surface p-6 pb-8 transition-[flex-grow,border-color,box-shadow] duration-[600ms] md:p-8 md:pb-10 ${EASE_CLASS} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
        open
          ? 'border-white/[0.22] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9),0_0_60px_-30px_rgba(255,255,255,0.35)]'
          : 'border-white/[0.11]'
      }`}
      // Wide layout only, and that is not a nicety. In a column the container
      // has no height to distribute, so a `flex-basis: 0` would leave every
      // panel trying to size itself from nothing.
      style={isDesktop ? { flex: hasTurn ? '2 0 0' : '1 0 0' } : undefined}
    >
      <div className="dot-grid pointer-events-none absolute inset-0" />

      {/* O título e o rodapé do card chegam DEPOIS da moldura, e por pouco: um
          sexto de segundo atrás dela. É a diferença entre um painel que aparece
          com tudo dentro, como um decalque, e um painel que chega e então se
          preenche. Deslocamento curto (14px) de propósito — o movimento grande
          é o do card, e repeti-lo aqui dentro faria a peça inteira parecer
          solta. */}
      <motion.div
        className="relative flex items-baseline gap-3"
        initial={parado ? false : { opacity: 0, y: 14 }}
        animate={parado ? undefined : entrou ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.55, ease: EASE, delay: atraso + 0.16 }}
      >
        <span className="font-serif text-4xl leading-none text-white/40 md:text-5xl">
          {step.number}
        </span>
        <span className="font-serif text-4xl leading-none text-white md:text-5xl">{step.name}</span>
      </motion.div>

      <div className="relative my-8 flex flex-1 items-center">
        <step.Art
          state={state}
          paused={paused}
          hovered={isDesktop && hovered}
          // Stacked, a finished card holds its last frame instead of handing on
          // a turn nobody is watching — the next card starts when it is
          // scrolled to, not when this one is done.
          onFinish={isDesktop ? onFinish : undefined}
        />
      </div>

      <motion.div
        className="relative"
        initial={parado ? false : { opacity: 0, y: 14 }}
        animate={parado ? undefined : entrou ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.55, ease: EASE, delay: atraso + 0.24 }}
      >
        <p className="text-lg font-semibold tracking-tight text-white md:text-xl">
          {step.headline}
        </p>
        <p className="mt-2 max-w-md text-sm text-white/55">{step.body}</p>
      </motion.div>
    </motion.div>
  );
}

/**
 * How the pipeline works, as three panels that trade space.
 *
 * The row plays itself: one card holds the turn, runs its animation, freezes on
 * its last frame and hands the turn on, and after the third the cycle returns
 * to the first. Pointing at a card takes the turn for it — so the same
 * mechanism serves the demo and the visitor. Pointing at the card that already
 * holds the turn does nothing at all: it is a state that is already set, and
 * re-entering a card must not restart the sequence playing inside it.
 *
 * Where the pointer is, is tracked separately and used for one thing only —
 * step three holds its video open while someone is on it. It is genuinely a
 * different question from whose turn it is: the turn stays where the pointer
 * left it, so a card is routinely open with nobody looking at it.
 *
 * The turn is also the layout: the running card is the open one. The reference
 * does this without animating any width: every panel is `flex: 1 0 0`
 * and the open one is `flex: 2 0 0`, so the browser distributes the row and the
 * transition rides on `flex-grow` alone. Animating widths instead would make
 * each panel fight the others for the same pixels and jitter on the way.
 *
 * `min-w-0` is what keeps that honest — without it a panel's content sets a
 * floor under its own width and the shares stop being 2:1:1.
 *
 * The artwork the reference puts in these panels is pre-rendered video, one
 * file per step. Ours is built out of DOM and framer-motion instead: there is
 * no footage of an onboarding call or of a market being searched, and a mock is
 * the honest way to depict a step rather than a filmed claim about one.
 */
export function HowItWorks() {
  const [idioma] = useIdioma();
  const steps = STEPS[idioma];
  const textoSecao = TEXTO_SECAO[idioma];

  const isDesktop = useIsDesktop();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stoppedByVisitor, setStoppedByVisitor] = useState(false);
  /**
   * Which card the pointer is on, which is not the same thing as which card has
   * the turn: the turn stays put after the pointer leaves, so a card can be
   * open without anyone looking at it. Only step three reads this, to keep its
   * video from being cut off mid-watch.
   */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /**
   * The row runs only while it is being looked at.
   *
   * `once: false` is the whole point — this has to report leaving as well as
   * arriving, so the sequence stops on the way out. `amount` is a fraction of
   * the row rather than a pixel margin: a sliver of a 700px panel creeping past
   * the fold is not someone watching it.
   *
   * Kept low deliberately. `amount` is a fraction of the *row*, and the row is
   * three stacked cards on a phone — ask for too much of it and the ratio can
   * never be reached on a short viewport, which would leave the section frozen
   * forever on exactly the devices that can least afford a broken panel.
   */
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { amount: 0.15 });

  /**
   * O cabeçalho tem o seu próprio observador, e com `once`.
   *
   * Metade dele à vista já é a seção chegando — é um bloco baixo, e esperar por
   * mais faria o título entrar quando a pessoa já o tivesse lido. `once` porque
   * uma entrada que se refaz a cada passagem deixa de ser entrada e vira um
   * elemento inquieto no meio da página.
   */
  const cabecalhoRef = useRef<HTMLDivElement>(null);
  const noCabecalho = useInView(cabecalhoRef, { amount: 0.5, once: true });
  const parado = useReducedMotion() === true;

  /**
   * Pausing freezes; it does not reset. No card is unmounted and no phase is
   * cleared, so scrolling away and back resumes on the step the row stopped on
   * rather than starting the pass over — which is what the owner asked for, and
   * also what stops the section from replaying itself at every scroll.
   */
  const paused = stoppedByVisitor || !inView;

  /**
   * One card holds the turn at a time, and the turn is the whole state of the
   * row: the running card is the open one, the rest are retracted. There is no
   * separate notion of "hovered" — pointing at a card hands it the turn.
   *
   * Handing the turn to the card that already holds it is deliberately a no-op.
   * React bails out of a `setState` to the identical value, so leaving a card
   * and coming back does not re-render, does not flip `running`, and therefore
   * does not restart the sequence that is already playing. That is the whole
   * mechanism — there is no token to bump and no restart to suppress.
   */
  const activate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  /**
   * Stable on purpose, and index-free: only the card holding the turn ever
   * calls it, so it can advance from whatever the current turn is. A callback
   * that closed over an index would be a new function on every render and
   * would restart the very timer that is trying to fire it.
   */
  const finishTurn = useCallback(() => {
    setActiveIndex((current) => (current + 1) % steps.length);
  }, []);

  return (
    <section data-secao="Como funciona" className="relative bg-doxa-bg px-5 py-16 md:px-10 md:py-24">
      {/* No grid behind the row, on the owner's call. The panels carry their own
          — that is what tells a card apart from the black around it — and a
          second field behind them flattened the difference: the texture ran
          edge to edge and the cards stopped reading as objects laid on top of
          it. Here the black between the panels is doing work by staying empty. */}
      <div className="relative mx-auto w-full max-w-screen-2xl">
        {/* O cabeçalho chega antes da fileira, e em mola como ela — é a mesma
            física, para as duas coisas lerem como partes de um mesmo objeto
            entrando. O título vem de mais longe (28px) que o subtítulo (18px) e
            que o botão: numa entrada, quanto mais longe uma peça vem, mais
            importante ela parece, e aqui a ordem de importância é essa mesma. */}
        <div
          ref={cabecalhoRef}
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
        >
          <div className="min-w-0">
            <motion.h2
              className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-5xl"
              initial={parado ? false : { opacity: 0, y: 28 }}
              animate={parado ? undefined : noCabecalho ? { opacity: 1, y: 0 } : undefined}
              transition={{ ...MOLA, opacity: { duration: 0.7, ease: EASE } }}
            >
              {textoSecao.titulo}
            </motion.h2>
            <motion.p
              className="mt-4 max-w-xl text-sm text-white/60 md:text-base"
              initial={parado ? false : { opacity: 0, y: 18 }}
              animate={parado ? undefined : noCabecalho ? { opacity: 1, y: 0 } : undefined}
              transition={{
                ...MOLA,
                delay: 0.08,
                opacity: { duration: 0.7, ease: EASE, delay: 0.08 },
              }}
            >
              {textoSecao.subtitulo}
            </motion.p>
          </div>

          {/* Only the visitor's own stop is offered here. Being off screen also
              pauses the row, but that is not a state anyone chose, and a button
              that flipped to "Retomar" on its own as you scrolled past would be
              reporting something the visitor did not do. */}
          <motion.button
            type="button"
            onClick={() => setStoppedByVisitor((current) => !current)}
            aria-pressed={stoppedByVisitor}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[13px] text-white/60 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            initial={parado ? false : { opacity: 0, y: 12 }}
            animate={parado ? undefined : noCabecalho ? { opacity: 1, y: 0 } : undefined}
            transition={{
              ...MOLA,
              delay: 0.16,
              opacity: { duration: 0.7, ease: EASE, delay: 0.16 },
            }}
            /* A mola do toque, e não a do site inteiro: aqui ela é resposta à
               mão e tem de ser curta. Cresce sob o ponteiro e afunda no clique,
               que é o mesmo gesto dos atalhos do FAQ. */
            whileHover={parado ? undefined : { scale: 1.04 }}
            whileTap={parado ? undefined : { scale: 0.96 }}
          >
            {stoppedByVisitor ? (
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <Pause className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            {stoppedByVisitor ? textoSecao.retomar : textoSecao.pausar}
          </motion.button>
        </div>

        {/* No handler on the way out of the row: the turn stays where the
            pointer left it and the cycle carries on from there, rather than
            snapping back to a card the visitor has already moved past. */}
        <div ref={rowRef} className="mt-10 flex flex-col gap-4 md:mt-14 lg:h-[700px] lg:flex-row">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              isDesktop={isDesktop}
              stopped={stoppedByVisitor}
              hasTurn={index === activeIndex}
              // Cards earlier in the pass have had their turn and hold their
              // last frame; later ones have not run yet.
              turnState={
                index === activeIndex ? 'running' : index < activeIndex ? 'done' : 'idle'
              }
              rowPaused={paused}
              hovered={hoveredIndex === index}
              ordem={index}
              onEnter={() => {
                setHoveredIndex(index);
                activate(index);
              }}
              onLeave={() => setHoveredIndex(null)}
              onFinish={finishTurn}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
