import { useCallback, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
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
const STEPS: readonly Step[] = [
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

  // Stacked, every card is open: there is nothing to retract into, and dimming
  // the card you scrolled to would be dimming the only one on screen.
  const open = isDesktop ? hasTurn : true;
  const state: ArtState = isDesktop ? turnState : inView ? 'running' : 'idle';
  const paused = isDesktop ? rowPaused : stopped || !inView;

  return (
    <div
      ref={ref}
      // Focus counts as hover: a keyboard tab through the row has to open the
      // panels too, or the artwork inside them never plays for anyone who is
      // not using a mouse. Both are wide-layout only — stacked, the scroll
      // position already says which card the visitor is at.
      onMouseEnter={isDesktop ? onEnter : undefined}
      onMouseLeave={isDesktop ? onLeave : undefined}
      onFocus={isDesktop ? onEnter : undefined}
      onBlur={isDesktop ? onLeave : undefined}
      tabIndex={isDesktop ? 0 : undefined}
      aria-expanded={isDesktop ? open : undefined}
      // The open card is told apart by its edge as well as by its size: a
      // brighter border and a lift off the black. The retracted ones come back
      // up from 45% — far enough down to be clearly waiting, but they are still
      // the argument, and at 45% they were reading as switched off rather than
      // as next.
      className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border bg-doxa-surface p-6 pb-8 transition-[flex-grow,opacity,border-color,box-shadow] duration-[600ms] md:p-8 md:pb-10 ${EASE_CLASS} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
        open
          ? 'border-white/[0.22] opacity-100 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9),0_0_60px_-30px_rgba(255,255,255,0.35)]'
          : 'border-white/[0.11] opacity-70'
      }`}
      // Wide layout only, and that is not a nicety. In a column the container
      // has no height to distribute, so a `flex-basis: 0` would leave every
      // panel trying to size itself from nothing.
      style={isDesktop ? { flex: hasTurn ? '2 0 0' : '1 0 0' } : undefined}
    >
      <div className="dot-grid pointer-events-none absolute inset-0" />

      <div className="relative flex items-baseline gap-3">
        <span className="font-serif text-4xl leading-none text-white/40 md:text-5xl">
          {step.number}
        </span>
        <span className="font-serif text-4xl leading-none text-white md:text-5xl">{step.name}</span>
      </div>

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

      <div className="relative">
        <p className="text-lg font-semibold tracking-tight text-white md:text-xl">
          {step.headline}
        </p>
        <p className="mt-2 max-w-md text-sm text-white/55">{step.body}</p>
      </div>
    </div>
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
  /** The whole section, so the pointer light tracks the copy as well as the row. */
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { amount: 0.15 });

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
    setActiveIndex((current) => (current + 1) % STEPS.length);
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-doxa-bg px-5 py-16 md:px-10 md:py-24">
      {/* The dotted field the whole page is built on, and the light that follows
          the pointer across it. Every other section already had both; this one
          was the gap in the surface — three lit cards floating on flat black,
          with the texture starting again above and below them. */}
      <div className="dot-grid pointer-events-none absolute inset-0" />
      <DotGridSpotlight containerRef={sectionRef} />

      <div className="relative mx-auto w-full max-w-screen-2xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
              Como funciona.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60 md:text-base">
              Três passos, e só o primeiro pede o seu tempo.
            </p>
          </div>

          {/* Only the visitor's own stop is offered here. Being off screen also
              pauses the row, but that is not a state anyone chose, and a button
              that flipped to "Retomar" on its own as you scrolled past would be
              reporting something the visitor did not do. */}
          <button
            type="button"
            onClick={() => setStoppedByVisitor((current) => !current)}
            aria-pressed={stoppedByVisitor}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[13px] text-white/60 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            {stoppedByVisitor ? (
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <Pause className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            {stoppedByVisitor ? 'Retomar' : 'Pausar'}
          </button>
        </div>

        {/* No handler on the way out of the row: the turn stays where the
            pointer left it and the cycle carries on from there, rather than
            snapping back to a card the visitor has already moved past. */}
        <div ref={rowRef} className="mt-10 flex flex-col gap-4 md:mt-14 lg:h-[700px] lg:flex-row">
          {STEPS.map((step, index) => (
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
