import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Heart,
  ImageIcon,
  Info,
  Loader2,
  MessageCircle,
  Mic,
  MousePointer2,
  Repeat2,
  Send,
  Store,
  Target,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CASES } from '../hero/cases';

/** The case whose real files stand in for the pipeline's output. */
const SHOWCASE = CASES[1];

/**
 * Where a card sits in the section's cycle.
 *
 * `running` is the card whose turn it is: it plays from the top. `done` is a
 * card that already had its turn in this pass and holds its last frame until
 * the cycle comes back around. `idle` has not run yet.
 */
export type ArtState = 'idle' | 'running' | 'done';

export interface ArtProps {
  state: ArtState;
  /**
   * The section is off screen, or the visitor stopped it.
   *
   * Distinct from reduced motion: `paused` freezes the card exactly where it
   * stands and changes nothing about what is on screen, so scrolling away and
   * back resumes rather than restarts. Reduced motion is a different question —
   * it decides which single frame the card shows and never animates at all.
   */
  paused: boolean;
  /** The pointer is on this card. Only step three does anything with it. */
  hovered: boolean;
  /** Called once when this card's turn is over. */
  onFinish?: () => void;
}

/** Holds a CSS loop on the frame it is standing on. */
const HOLD_CLASS = '[animation-play-state:paused]';

/** The read head: what says a thing is being looked at right now. */
function ScanLine({ paused }: { paused: boolean }) {
  return (
    <span
      className={`step-scan pointer-events-none absolute inset-x-0 h-px bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] ${
        paused ? HOLD_CLASS : ''
      }`}
    />
  );
}

/**
 * The machine reporting on itself: one line per thing it is doing, each wearing
 * the mark for where it is — a dot before, a spinner during, a tick after.
 *
 * Shared by the two cards that show work happening, so a step completing looks
 * the same in both. Which mark a line wears is read off `built` and never
 * stored: a restart moves the count and every line follows it in the same
 * render, so nothing can be left mid-fade from a run that is already over.
 */
function BuildList({
  steps,
  /** How many lines are ticked off. Below zero, nothing has started. */
  built,
  still,
  paused,
}: {
  steps: readonly string[];
  built: number;
  still: boolean;
  paused: boolean;
}) {
  return (
    <div className="relative flex flex-col gap-2">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
            {built > index ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Check className="h-3.5 w-3.5 text-[#22c55e]" strokeWidth={3} />
              </motion.span>
            ) : built === index && !still ? (
              <Loader2
                className={`h-3.5 w-3.5 animate-spin text-white/60 ${paused ? HOLD_CLASS : ''}`}
                strokeWidth={2.5}
              />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            )}
          </span>

          <span
            className={`text-[12px] leading-snug transition-colors duration-300 ${
              built >= index ? 'text-white/75' : 'text-white/40'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** The questions the onboarding call goes through, in the owner's order. */
const QUESTIONS = [
  { icon: Store, label: 'O que o seu negócio faz?', hint: 'Produto, serviço, ticket médio' },
  {
    icon: Users,
    label: 'Qual é o público que você quer atingir?',
    hint: 'Idade, região, plataforma',
  },
  {
    icon: Target,
    label: 'O que você quer que aconteça quando alguém começa a acompanhar?',
    hint: 'Comprar, chamar no direct, indicar',
  },
];

/**
 * The sequence, in milliseconds per phase: one dwell per question, a beat on
 * the button, then the confirmation. The last entry is how long the check holds
 * before the card hands the cycle to the next one.
 */
const PHASES = [1600, 1600, 1600, 950, 2200];
const BUTTON_PHASE = QUESTIONS.length;
const CHECK_PHASE = QUESTIONS.length + 1;

/**
 * One row of the panel. The active one carries the highlight and the cursor,
 * both of which travel on `layoutId` — framer measures where the element was
 * and where it now is and tweens the gap, so nothing here has to know a row's
 * height or the offsets between them. That matters because these questions are
 * long enough to wrap, and a wrapped row is taller than its neighbours.
 */
function Row({
  icon: Icon,
  label,
  hint,
  active,
  still,
}: {
  icon: typeof Store;
  label: string;
  hint: string;
  active: boolean;
  still: boolean;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-xl px-2.5 py-3">
      {active && (
        <motion.div
          layoutId="onboarding-highlight"
          className="absolute inset-0 rounded-xl bg-white/[0.09]"
          transition={TRAVEL}
        />
      )}

      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white/80">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>

      <span className="relative flex min-w-0 flex-1 flex-col">
        <span className="text-[13px] font-medium leading-snug text-white">{label}</span>
        {/* The hint belongs to whichever row is under the cursor, the way a
            command palette only describes the item you are about to pick. */}
        <span
          className={`grid transition-[grid-template-rows,opacity] duration-300 ${
            active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <span className="overflow-hidden text-[11px] leading-snug text-white/40">
            <span className="block pt-0.5">{hint}</span>
          </span>
        </span>
      </span>

      {active && !still && <Cursor />}
    </div>
  );
}

/** The pointer that walks the panel. Parked at the right edge of whatever it
    is pointing at, so it never covers the label it is reading. */
function Cursor() {
  return (
    <motion.span
      layoutId="onboarding-cursor"
      className="pointer-events-none absolute right-6 top-1/2 z-10"
      transition={TRAVEL}
    >
      <MousePointer2
        className="h-6 w-6 fill-white text-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
        strokeWidth={1.5}
      />
    </motion.span>
  );
}

const TRAVEL = { duration: 0.4, ease: [0.45, 0, 0, 1] as const };

/** Small grey caption that opens a group of rows, as in the reference. */
function GroupLabel({ children, spaced = false }: { children: React.ReactNode; spaced?: boolean }) {
  return (
    <span className={`block px-2.5 pb-1 text-[11px] text-white/35 ${spaced ? 'pt-5' : 'pt-1'}`}>
      {children}
    </span>
  );
}

/**
 * The confirmation a card ends its turn on.
 *
 * Shared by every step that has one, on purpose: the same disc, the same tick,
 * the same beats. A step finishing is one event the pipeline performs, so it
 * has to look identical wherever it happens — three different flourishes would
 * read as three unrelated widgets that happen to sit in a row.
 *
 * It replaces the panel outright instead of swapping inside it.
 *
 * It used to live in an `AnimatePresence mode="wait"`, and that is what broke
 * it: `wait` holds the incoming child unmounted until the outgoing one finishes
 * exiting, and the outgoing panels carry `layoutId` elements whose layout
 * animation never settles once the card around them starts resizing. The exit
 * never completed, so the check never mounted — the panel just sat there empty,
 * which is exactly what the owner was seeing.
 *
 * A plain conditional has no such handshake. React unmounts one and mounts the
 * other, and `initial`/`animate` on the incoming element is enough to animate
 * it in. Nothing has to agree with anything for the tick to appear.
 */
function StepDone({ label }: { label: string }) {
  return (
    // Spacing does the grouping: a wide gap under the disc, then the two lines
    // held tight to each other. An even gap between all three made them read as
    // a list of three unrelated things rather than a mark with a caption.
    <div className="flex w-full flex-col items-center justify-center px-4 py-14 text-center">
      <span className="relative flex h-20 w-20 items-center justify-center">
        {/* Two rings thrown off the disc as it lands. One would read as a
            decoration parked behind the tick; two, staggered, read as the
            impact of something arriving. They play once — this is the moment
            the step completes, not a state that keeps announcing itself. */}
        {[0, 0.28].map((delay) => (
          <motion.span
            key={delay}
            className="absolute inset-0 rounded-full border border-[#22c55e]"
            initial={{ scale: 0.7, opacity: 0.7 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.4, delay: 0.2 + delay, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* A halo that blooms wide and settles back, so the green lifts off the
            black instead of sitting flat on it. */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#22c55e]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.9, 1.55], opacity: [0, 0.3, 0.14] }}
          transition={{ duration: 1.1, times: [0, 0.45, 1], ease: 'easeOut' }}
          style={{ filter: 'blur(18px)' }}
        />

        {/* The disc arrives on a spring, then the tick is drawn inside it. Two
            beats rather than one is what keeps it sober: a check that pops in
            whole reads as a stamp, one that draws reads as a decision being
            taken. The overshoot is what gives it the weight of a thing landing
            rather than a thing fading up. */}
        <motion.span
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#22c55e] shadow-[0_0_50px_-6px_rgba(34,197,94,0.85)]"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 15, mass: 0.8 }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10"
            fill="none"
            stroke="black"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <motion.path
              d="M5 12.5 10 17.5 19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.span>
      </span>

      <motion.p
        className="mt-7 max-w-[15rem] text-lg font-semibold leading-tight tracking-tight text-white"
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {label}
      </motion.p>
      <motion.p
        className="mt-2 text-[12px] leading-none text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.75 }}
      >
        abrindo o próximo passo…
      </motion.p>
    </div>
  );
}

/**
 * Step one: the onboarding call, as the panel it fills.
 *
 * Built as a command palette rather than a form because that is what the
 * reference's first card is, and because a palette shows the questions as a
 * list to be worked through — which is what the call actually is.
 *
 * Nothing here answers anything. Putting sentences about a fictional business
 * in the rows would invent a customer; the card only has to show what gets
 * asked, and the cursor walking the list to a button is what says the call has
 * an end.
 *
 * The card plays only on its turn. When the turn ends it freezes on the check
 * — the section retracts it and moves on, and this panel keeps showing its last
 * frame until the cycle comes back. Hovering restarts it, which the section
 * signals by handing the turn back.
 */
export function OnboardingArt({ state, paused, onFinish }: ArtProps) {
  const still = useReducedMotion() ?? false;
  const [phase, setPhase] = useState(0);
  const running = state === 'running';

  // Back to the top whenever this card is handed the turn. Re-entering a card
  // that already holds it never gets here: the section does not re-render for
  // it, so `running` does not change and this does not fire.
  useEffect(() => {
    if (running) setPhase(0);
  }, [running]);

  /**
   * A pause drops the timer and leaves `phase` alone, so resuming picks the
   * sequence back up on the step it stopped on. The phase it was in restarts
   * its own clock, which costs at most a beat and rewinds nothing on screen:
   * every mark in the panel is derived from `phase`, and `phase` did not move.
   */
  useEffect(() => {
    if (!running || still || paused) return;
    const id = setTimeout(() => {
      if (phase === CHECK_PHASE) onFinish?.();
      else setPhase((current) => current + 1);
    }, PHASES[phase]);
    return () => clearTimeout(id);
  }, [phase, running, still, paused, onFinish]);

  // Frozen on the check between turns: `done` means the turn is over, and the
  // last frame is the confirmation it ended on.
  const done = state === 'done' || phase >= CHECK_PHASE;
  if (done) return <StepDone label="Perfil do negócio pronto" />;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] p-3 backdrop-blur-sm">
      <GroupLabel>Doxa Scan 🚀</GroupLabel>

      <div className="flex flex-col">
        {QUESTIONS.map(({ icon, label, hint }, index) => (
          <Row
            key={label}
            icon={icon}
            label={label}
            hint={hint}
            active={index === phase}
            still={still}
          />
        ))}
      </div>

      <GroupLabel spaced>Depois disso</GroupLabel>

      <div className="relative flex items-center justify-end px-2.5 pb-4 pt-2">
        {/* A real button, not a picture of one: the loop demonstrates the
            click, and anyone who would rather not wait can just take it. */}
        <motion.button
          type="button"
          onClick={() => setPhase(CHECK_PHASE)}
          whileTap={{ scale: 0.94 }}
          className="relative flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          // The press itself: a quick squeeze on the beat the cursor lands, so
          // the click reads as an action and not as a cut.
          animate={phase === BUTTON_PHASE && !still ? { scale: [1, 0.96, 1] } : { scale: 1 }}
          transition={{ duration: 0.45, times: [0, 0.5, 1], delay: 0.4 }}
        >
          Salvar
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>
        {phase === BUTTON_PHASE && !still && <Cursor />}
      </div>

      <div className="flex items-center gap-1.5 border-t border-white/[0.07] px-2.5 py-2 text-[11px] text-white/25">
        <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
        Uma reunião, uma vez só
      </div>
    </div>
  );
}

/**
 * One bar of the voice note's waveform. The stagger is a per-bar delay on one
 * shared keyframe rather than a keyframe each — same trick `canvas-drift` uses
 * on the hero cards.
 */
function Bar({ height, index, paused }: { height: number; index: number; paused: boolean }) {
  return (
    <span
      className={`step-wave w-[3px] rounded-full bg-white/70 ${paused ? HOLD_CLASS : ''}`}
      style={{ height, animationDelay: `${index * 0.06}s` }}
    />
  );
}

const BARS = [9, 18, 12, 22, 14];

/**
 * The two things the client hands over, in the order the panel asks for them.
 *
 * The hint is an instruction, not a filename: inventing `rafael.jpg · 2,4 MB`
 * would dress the mock as a real upload of a real person's file. What the card
 * has to say is what you are expected to send, and that is true regardless of
 * who is looking at it.
 */
const UPLOADS = [
  { icon: ImageIcon, label: 'a sua foto', hint: 'uma foto de frente, com luz no rosto' },
  { icon: Mic, label: 'a sua voz', hint: 'um áudio curto, falando qualquer coisa' },
];

/**
 * What the platform reports while it assembles the clone.
 *
 * Ticked off on a schedule rather than on real progress, which is the honest
 * reading of a mock: the card depicts the work, it does not measure it. A bar
 * claiming a percentage would be a number about a job that is not running.
 */
const BUILD_STEPS = [
  'lendo os traços do rosto',
  'clonando o timbre da voz',
  'sincronizando fala e boca',
];

/**
 * The clone card's sequence, in milliseconds: one phase per upload, one per
 * line of the build, then the confirmation it ends on.
 *
 * The build lines are phases like any other rather than delays inside one long
 * phase, so a single clock drives the whole panel — the same shape step one
 * has. A second schedule running inside the first is what makes a restart
 * mid-sequence leave marks behind: there would be a spinner whose fade-out
 * belongs to a run that no longer exists.
 */
const CLONE_PHASES = [2000, 2000, 900, 900, 900, 1000, 2200];
const BUILD_START = UPLOADS.length;
/**
 * The beat that holds the finished list before the confirmation replaces it.
 *
 * Without it the last line never gets its tick at all: the phase that completes
 * it is the phase that swaps the whole panel, so the eye goes from a spinner
 * straight to the green check and never sees the work land. A second of the
 * list standing complete is what makes the check read as the consequence of it.
 */
const CLONE_SETTLE_PHASE = BUILD_START + BUILD_STEPS.length;
const CLONE_CHECK_PHASE = CLONE_SETTLE_PHASE + 1;

/** Where an upload row is in its own little life. */
type UploadStatus = 'waiting' | 'sending' | 'ready';

/**
 * One file being handed over: the thumbnail of what it is, what to send, and a
 * track that fills while it goes up.
 *
 * The photo tile carries the real thumbnail and the voice tile a waveform, so
 * the row says which of the two inputs it is without reading the label — and
 * during the build both come alive at once, which is what shows the clone being
 * made out of them rather than out of nothing.
 */
function UploadRow({
  icon: Icon,
  label,
  hint,
  status,
  scanning,
  photoUrl,
  still,
  paused,
}: {
  icon: typeof ImageIcon;
  label: string;
  hint: string;
  status: UploadStatus;
  /** The build is reading this tile — the scan line sweeps across it. */
  scanning: boolean;
  photoUrl: string | null;
  still: boolean;
  paused: boolean;
}) {
  const sent = status === 'ready';

  return (
    <div className="relative flex items-center gap-3 rounded-xl px-2.5 py-2.5">
      {status === 'sending' && (
        <motion.div
          layoutId="clone-highlight"
          className="absolute inset-0 rounded-xl bg-white/[0.09]"
          transition={TRAVEL}
        />
      )}

      <span
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-colors duration-500 ${
          sent ? 'border-white/20 bg-white/[0.08]' : 'border-dashed border-white/15 bg-white/[0.03]'
        }`}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            aria-hidden
            className={`h-full w-full object-cover transition-[opacity,filter] duration-700 ${
              sent ? 'opacity-100 grayscale-0' : 'opacity-30 grayscale'
            }`}
          />
        ) : sent ? (
          <span className="flex h-6 items-center gap-[3px]">
            {BARS.map((height, index) => (
              <Bar key={index} height={height} index={index} paused={paused} />
            ))}
          </span>
        ) : (
          <Icon className="h-4 w-4 text-white/30" strokeWidth={1.75} />
        )}

        {/* Only while the build is actually reading this tile — a scan line
            that never stops would say the machine is always working, which is
            the opposite of a step that completes. */}
        {scanning && !still && <ScanLine paused={paused} />}
      </span>

      <span className="relative flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium leading-snug text-white">{label}</span>
          {sent ? (
            <motion.span
              className="flex shrink-0 items-center gap-1 text-[10px] text-[#22c55e]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
          ) : (
            <span className="shrink-0 text-[10px] text-white/30">
              {status === 'sending' ? 'enviando…' : 'aguardando'}
            </span>
          )}
        </span>

        <span className="text-[11px] leading-snug text-white/40">{hint}</span>

        {/* Three states, one of which is a running animation.
            `sending` swaps in an element carrying the fill keyframe, and adding
            that class is what starts it from empty — every time, including the
            second pass. A single element easing a `width` prop cannot do that:
            once it has reached full it has nowhere to animate from, and the row
            would come back already loaded on every replay. */}
        <span className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
          {status === 'sending' ? (
            <span
              className={`step-fill block h-full w-full rounded-full bg-white/75 ${
                paused ? HOLD_CLASS : ''
              }`}
            />
          ) : (
            <span
              className={`block h-full rounded-full bg-white/75 ${
                status === 'ready' ? 'w-full' : 'w-0'
              }`}
            />
          )}
        </span>
      </span>
    </div>
  );
}

/**
 * Step two: the clone being made.
 *
 * Card one's mechanism with a different subject — a panel that walks itself
 * through a short sequence and ends on the same green check — because the row
 * is one machine with three stations, not three widgets that happen to sit next
 * to each other. The sequence is the client's side of the job in full: send a
 * photo, send a voice note, watch it get assembled. It is short because that is
 * the claim being made about it.
 */
export function CloneArt({ state, paused, onFinish }: ArtProps) {
  const still = useReducedMotion() ?? false;
  const [phase, setPhase] = useState(0);
  const running = state === 'running';

  // Back to the top whenever this card is handed the turn. Re-entering a card
  // that already holds it never gets here: the section does not re-render for
  // it, so `running` does not change and this does not fire.
  useEffect(() => {
    if (running) setPhase(0);
  }, [running]);

  useEffect(() => {
    if (!running || still || paused) return;
    const id = setTimeout(() => {
      if (phase === CLONE_CHECK_PHASE) onFinish?.();
      else setPhase((current) => current + 1);
    }, CLONE_PHASES[phase]);
    return () => clearTimeout(id);
  }, [phase, running, still, paused, onFinish]);

  // Frozen on the check between turns, exactly as step one is.
  const done = state === 'done' || phase >= CLONE_CHECK_PHASE;
  if (done) return <StepDone label="Clone pronto" />;

  /**
   * What the panel is showing, which is not always what `phase` says.
   *
   * A card that has not been handed the turn yet shows nothing started — `-1`,
   * before the first row. Reading `phase` directly here is what had the first
   * row sitting at "enviando…" from page load: the panel is mounted for the
   * whole section, so by the time the turn actually arrived its progress bar
   * had long since filled and the upload was over before it began.
   *
   * With motion off it jumps the other way, to the frame the card would have
   * ended on — both files in, the clone assembled.
   */
  const shown = still ? BUILD_START : running ? phase : -1;
  /** How many build lines are ticked off; below zero, the build has not begun. */
  const built = still ? BUILD_STEPS.length : shown - BUILD_START;
  const building = built >= 0;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] p-3 backdrop-blur-sm">
      <GroupLabel>Doxa Clone 🧬</GroupLabel>

      <div className="flex flex-col">
        {UPLOADS.map(({ icon, label, hint }, index) => (
          <UploadRow
            key={label}
            icon={icon}
            label={label}
            hint={hint}
            status={shown > index ? 'ready' : shown === index ? 'sending' : 'waiting'}
            // Stops on the settled beat, not when the panel swaps: a read head
            // still sweeping over a finished list would say the machine never
            // stopped, and the whole point of that beat is that it did.
            scanning={building && built < BUILD_STEPS.length}
            // The photo row shows the real face the pipeline works from; the
            // voice row has no thumbnail to show, so it gets the waveform.
            photoUrl={index === 0 ? SHOWCASE.photoUrl : null}
            still={still}
            paused={paused}
          />
        ))}
      </div>

      <GroupLabel spaced>Montando o seu clone</GroupLabel>

      <div className="relative rounded-xl px-2.5 py-2.5">
        {building && (
          <motion.div
            layoutId="clone-highlight"
            className="absolute inset-0 rounded-xl bg-white/[0.09]"
            transition={TRAVEL}
          />
        )}

        <div
          className={`relative transition-opacity duration-500 ${
            building ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <BuildList steps={BUILD_STEPS} built={built} still={still} paused={paused} />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1.5 border-t border-white/[0.07] px-2.5 py-2 text-[11px] text-white/25">
        <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
        Uma foto e um áudio, uma vez só
      </div>
    </div>
  );
}

/**
 * What the render reports while the video is being made.
 *
 * PENDENTE-DONO: a plausible reading of the stages, not a spec of them. If the
 * real pipeline names its passes differently, these are the strings to change.
 */
const RENDER_STEPS = [
  'montando as cenas',
  'gerando a locução com a sua voz',
  'legendando e cortando em 9:16',
];

/**
 * Step three's sequence, in milliseconds: one phase per line of the render, the
 * same beat as step two with the list standing finished, then the reveal.
 *
 * The reveal is the longest phase in the section because it is the only artwork
 * here that is not a depiction — it is the client's published video, and the
 * card exists to give it time to actually play.
 */
const RENDER_PHASES = [900, 900, 900, 1000, 15000];
const RENDER_SETTLE_PHASE = RENDER_STEPS.length;
const REVEAL_PHASE = RENDER_SETTLE_PHASE + 1;

/**
 * One count off the published post, icon then number, the way a feed sets them.
 */
function Engagement({
  icon: Icon,
  value,
  label,
  liked = false,
}: {
  icon: typeof Heart;
  value: string;
  label: string;
  liked?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5" title={label}>
      <Icon
        className={`h-[19px] w-[19px] ${liked ? 'fill-current text-[#ff3040]' : 'text-white/80'}`}
        strokeWidth={liked ? 0 : 2}
        aria-hidden
      />
      <span className="text-base font-semibold leading-none tabular-nums text-white">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Step three: the video being rendered, and then the video.
 *
 * Steps one and two end on a confirmation because what they produce is not a
 * thing you can look at — a filled-in profile, a clone. This one produces a
 * file, so a green tick would be a worse ending than the file itself: the card
 * hands over the actual published video instead of a symbol standing for it.
 *
 * That is also why the `<video>` is mounted at the reveal rather than with the
 * card. Left mounted, `autoPlay` overrides `preload="none"` and the browser
 * pulls several megabytes on page load for a panel three screens down. Here it
 * is fetched when the card is about to show it, over a poster that is already
 * on screen — so the wait is covered, and a visitor who never scrolls this far
 * never pays for it.
 */
export function OutputArt({ state, paused, hovered, onFinish }: ArtProps) {
  const still = useReducedMotion() ?? false;
  const [phase, setPhase] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // Survives the card's own restarts on purpose: having switched the sound on,
  // nobody wants to switch it on again every time the row comes back around.
  const [soundOn, setSoundOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const running = state === 'running';

  useEffect(() => {
    if (!running) return;
    setPhase(0);
    setLoaded(false);
  }, [running]);

  /**
   * The reveal is the one phase a pointer can hold open.
   *
   * It is also the only frame in the section that is worth stopping on — the
   * others are depictions that make their point in a beat, this one is a video
   * someone may actually be watching, and cutting away from it on a timer is
   * the one thing the cycle must not do. Left alone it still moves on: fifteen
   * seconds is the whole clip and then some.
   */
  const held = phase === REVEAL_PHASE && hovered;

  useEffect(() => {
    if (!running || still || paused || held) return;
    const id = setTimeout(() => {
      if (phase === REVEAL_PHASE) onFinish?.();
      else setPhase((current) => current + 1);
    }, RENDER_PHASES[phase]);
    return () => clearTimeout(id);
  }, [phase, running, still, paused, held, onFinish]);

  /**
   * The reveal belongs to this card's turn and ends with it.
   *
   * Steps one and two hold their last frame between turns, and this one used to
   * as well — but their last frame is a still check, and this one is a video.
   * A retracted card left playing is not a frozen frame, it is a second thing
   * moving while another card is trying to be watched. Handing the turn on puts
   * this panel back to the top of its own sequence, which is also what stops
   * the decode and drops the file.
   */
  const revealed = still || (running && phase >= REVEAL_PHASE);

  /**
   * The video obeys the same pause as everything else in the section, which is
   * the one place where that rule buys real money rather than polish: a paused
   * `<video>` stops decoding frames, so a card left off screen costs nothing.
   * Driving playback from here rather than from `autoPlay` is also what keeps
   * reduced motion honest — the poster stands still instead of playing itself.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Set on the element, not left to the prop: React's handling of `muted` on
    // a video is the one attribute it is famously loose about, and a mute that
    // silently fails to apply is the kind of bug a visitor hears rather than
    // sees.
    video.muted = !soundOn;
    if (paused || still) video.pause();
    else void video.play().catch(() => undefined);
  }, [paused, still, revealed, soundOn]);

  if (revealed) {
    return (
      <motion.div
        className="flex w-full flex-col items-stretch gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.07] p-4 backdrop-blur-sm lg:flex-row lg:gap-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="relative w-full max-w-[218px] shrink-0 self-center overflow-hidden rounded-xl border border-white/[0.11] lg:w-[45%] lg:self-start"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {SHOWCASE.videoUrl ? (
            <video
              ref={videoRef}
              src={SHOWCASE.videoUrl}
              poster={SHOWCASE.posterUrl ?? undefined}
              className="aspect-[9/16] w-full object-cover"
              muted={!soundOn}
              loop
              playsInline
              preload="auto"
              aria-hidden
              onLoadedData={() => setLoaded(true)}
            />
          ) : (
            <div className="aspect-[9/16] w-full bg-white/[0.04]" />
          )}

          {/* Sound is the visitor's to switch on and stays off until they do —
              a browser would refuse to autoplay it aloud anyway, and a card
              three screens down that starts talking on its own is a worse
              surprise than a silent one. */}
          {SHOWCASE.videoUrl && (
            <button
              type="button"
              onClick={() => setSoundOn((current) => !current)}
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Desligar o som do vídeo' : 'Ligar o som do vídeo'}
              className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
            >
              {soundOn ? (
                <Volume2 className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <VolumeX className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
          )}

          {/* The poster is already showing underneath, so this only names what
              the still frame is. It clears itself on the first decoded frame;
              if the file never arrives it stays, which is the truth. */}
          {SHOWCASE.videoUrl && !loaded && (
            <span className="absolute inset-x-0 top-0 flex items-center justify-center gap-1 bg-black/65 py-1 text-[9px] text-white/70 backdrop-blur-sm">
              <Loader2 className={`h-2.5 w-2.5 ${still ? '' : 'animate-spin'}`} strokeWidth={2.5} />
              carregando
            </span>
          )}
        </motion.div>

        {/* Three groups spread down the column rather than a block of copy at
            the top and everything else pinned to the floor. The column is as
            tall as the reel beside it, which is a lot of room for four short
            lines — distributing them is what stops the middle of the card from
            reading as a hole someone forgot to fill. */}
        <motion.div
          className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-0.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-lg font-semibold leading-tight tracking-tight text-white">
              {SHOWCASE.outputLabel}
            </p>
            {SHOWCASE.handle && (
              <p className="mt-1 text-[13px] leading-none text-white/50">{SHOWCASE.handle}</p>
            )}
          </div>

          {SHOWCASE.stats && (
            // Boxed, and set in the native-app stack rather than ours: this
            // block is a picture of somebody else's interface, and our own type
            // on it would read as us reporting the numbers instead of the
            // platform doing it. The views figure carries the weight — it is
            // the number the whole section is an argument for.
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 font-ui">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold leading-none tabular-nums text-white">
                  {SHOWCASE.stats.views}
                </span>
                <span className="text-[11px] leading-none text-white/45">visualizações</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/[0.07] pt-3">
                <Engagement icon={Heart} value={SHOWCASE.stats.likes} label="curtidas" liked />
                {SHOWCASE.stats.comments && (
                  <Engagement
                    icon={MessageCircle}
                    value={SHOWCASE.stats.comments}
                    label="comentários"
                  />
                )}
                {SHOWCASE.stats.reposts && (
                  <Engagement icon={Repeat2} value={SHOWCASE.stats.reposts} label="reposts" />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] leading-snug text-white/40">
              vertical, legendado, no formato do feed
            </p>
            <motion.span
              className="flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-black"
              animate={still || paused ? {} : { scale: [1, 1.04, 1] }}
              transition={
                still || paused ? {} : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Send className="h-3 w-3" strokeWidth={2.5} />
              publicar
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /**
   * Same rule as step two: a card that has not been handed the turn has not
   * started. Reading `phase` here left an idle card sitting with a spinner
   * turning on its first line, claiming a render that nobody had asked for.
   */
  const shown = running ? phase : -1;
  /** The render's own progress: one notch per line, plus the settled beat. */
  const progress =
    shown < 0 ? 0 : ((Math.min(shown, RENDER_STEPS.length) + 1) / (RENDER_STEPS.length + 1)) * 100;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] p-3 backdrop-blur-sm">
      <GroupLabel>Doxa Render 🎬</GroupLabel>

      <div className="flex items-center gap-3 px-2.5 py-2.5">
        {/* The poster of the very video this card is about to hand over, held
            back to a shadow of itself. The frame being made is the frame that
            arrives — a generic placeholder would break that. */}
        <span className="relative w-[62px] shrink-0 overflow-hidden rounded-lg border border-white/15">
          {SHOWCASE.posterUrl ? (
            <img
              src={SHOWCASE.posterUrl}
              alt=""
              aria-hidden
              className="aspect-[9/16] w-full object-cover opacity-20 grayscale"
            />
          ) : (
            <span className="block aspect-[9/16] w-full bg-white/[0.04]" />
          )}
          {!still && shown >= 0 && shown < RENDER_SETTLE_PHASE && <ScanLine paused={paused} />}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium leading-snug text-white">
              gerando o vídeo
            </span>
            <span className="shrink-0 text-[10px] text-white/30">9:16</span>
          </span>
          <span className="text-[11px] leading-snug text-white/40">
            com o clone que você acabou de montar
          </span>
          <span className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
            <motion.span
              className="block h-full rounded-full bg-white/75"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: still ? 0 : 0.6, ease: [0.45, 0, 0, 1] }}
            />
          </span>
        </span>
      </div>

      <GroupLabel spaced>Na esteira</GroupLabel>

      <div className="px-2.5 py-2.5">
        <BuildList steps={RENDER_STEPS} built={shown} still={still} paused={paused} />
      </div>

      <div className="mt-1 flex items-center gap-1.5 border-t border-white/[0.07] px-2.5 py-2 text-[11px] text-white/25">
        <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
        Você não precisa fazer nada aqui
      </div>
    </div>
  );
}
