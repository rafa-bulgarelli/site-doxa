import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import type { CaseStats } from './cases';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * What the published post did, on the far edge of the card header — so the
 * proof reads as its own column instead of as more of the client's name.
 *
 * The heart is filled because a hairline one at 12px turns to mush; the eye
 * can't be, or its pupil dissolves into the surrounding shape.
 */
function StatRow({ stats }: { stats: CaseStats }) {
  return (
    <span className="ml-auto flex items-center gap-2.5 text-[11px] font-semibold leading-tight text-white">
      <span className="flex items-center gap-1">
        <span className="tabular-nums">{stats.views}</span>
        <Eye className="h-3 w-3" strokeWidth={2.25} aria-hidden />
        <span className="sr-only">visualizações</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="tabular-nums">{stats.likes}</span>
        {/* The one piece of colour the hero allows itself, and it is quoted
            rather than chosen: this is the red a like is, everywhere. */}
        <Heart className="h-3 w-3 fill-current text-[#ff3040]" strokeWidth={0} aria-hidden />
        <span className="sr-only">curtidas</span>
      </span>
    </span>
  );
}

interface CanvasCardProps {
  /** Node name — the top line of the header, like Flora's asset name. */
  label: string;
  /** Descriptor under it — the format or stage, like Flora's model name. */
  meta: string;
  /** What the published post did. Sits opposite the descriptor when present. */
  stats?: CaseStats | null;
  /** Sets the label and the descriptor on one line instead of stacking them. */
  inlineHeader?: boolean;
  /**
   * Identity of what the body is showing. Changing it crossfades the new media
   * over the old instead of cutting. Leave it out on cards whose content does
   * not follow the active case — animating an unchanged body is a lie.
   */
  swapKey?: string | number;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Points at the framed body so connectors anchor to it, not to the header. */
  bodyRef?: RefObject<HTMLDivElement>;
  /**
   * Phase of the idle drift, in seconds. Cards share one keyframe but start at
   * different points, so the canvas breathes instead of pulsing in lockstep.
   */
  driftDelay?: number;
  /** Makes the node draggable around the canvas. */
  draggable?: boolean;
  /** Bounds for the drag, so a node can't be thrown out of the hero. */
  dragConstraints?: RefObject<Element>;
}

/**
 * One node on the hero canvas: a glass panel holding a two-line header over a
 * framed body. Nodes are the pipeline made visible — what the client hands over
 * on one side, the finished video on the other.
 *
 * There is no panel around the whole node: the label sits straight on the
 * canvas and only the media itself is framed. One frame per node reads as an
 * asset lying on a surface; two nested frames read as a dialog.
 *
 * Drag lives on the outer element while the idle drift lives on the inner one.
 * Both are transforms, so sharing an element would make them overwrite each
 * other — split across two, they compose.
 */
export function CanvasCard({
  label,
  meta,
  stats = null,
  inlineHeader = false,
  swapKey,
  children,
  className = '',
  delay = 0,
  bodyRef,
  driftDelay = 0,
  draggable = false,
  dragConstraints,
}: CanvasCardProps) {
  const reduceMotion = useReducedMotion();
  const swapControls = useAnimationControls();
  const mounted = useRef(false);

  // The node itself takes the hit when its content is replaced: it drops and
  // settles while the new media crosses in. Driven by controls rather than by a
  // key, because remounting to replay an entrance would tear down the crossfade
  // this is supposed to accompany.
  useEffect(() => {
    if (swapKey === undefined) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (reduceMotion) return;
    swapControls.start({
      y: [10, 0],
      scale: [0.985, 1],
      transition: { duration: 0.5, ease: EASE },
    });
  }, [swapKey, reduceMotion, swapControls]);

  return (
    <motion.div
      className={`relative w-full ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      drag={draggable}
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{ scale: 1.03, zIndex: 40 }}
    >
      <div className="canvas-drift" style={{ animationDelay: `${driftDelay}s` }}>
        {/* Its own element: the drift above it is a CSS keyframe on `transform`,
            and a keyframed property beats an inline one, so a transform written
            here by framer-motion would simply never be applied. */}
        <motion.div animate={swapControls}>
          {inlineHeader ? (
          /* Baseline-aligned, not centred: the label and the descriptor are set
             at different sizes, so aligning their boxes would leave the smaller
             one floating off the line they share. */
            <div className="mb-2 flex items-baseline gap-1.5 px-0.5 text-left">
              <span className="text-[13px] font-semibold leading-tight text-white">{label}</span>
              <span className="text-[11px] font-medium leading-tight text-white/35">-</span>
              <span className="text-[11px] font-medium leading-tight text-white/70">{meta}</span>
              {stats && <StatRow stats={stats} />}
            </div>
          ) : (
            <div className="mb-2 flex flex-col gap-0.5 px-0.5 text-left">
              <span className="text-[13px] font-semibold leading-tight text-white">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium leading-tight text-white/70">{meta}</span>
                {stats && <StatRow stats={stats} />}
              </div>
            </div>
          )}
          <div
            ref={bodyRef}
            className="relative overflow-hidden rounded-xl border border-white/[0.11] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
          >
            {/* `popLayout` takes the outgoing media out of the flow, so the new
                one lands in the same box and the two cross over each other. In
                the default mode both would sit in flow and the card would
                double in height for the length of the transition. */}
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={swapKey ?? 'static'}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
