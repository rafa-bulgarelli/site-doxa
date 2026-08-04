import { ImageOff, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CASES } from './cases';

interface CaseSwitcherProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

/** How long each case holds before the deck advances on its own. */
const HOLD_MS = 10000;

/**
 * Picks which client case the canvas is showing, as a stack of their photos.
 *
 * The thumbs overlap at rest and fan out to even spacing on hover, so the
 * control reads as a deck rather than a toolbar. A dealt deck stacks front to
 * back — the first case covers the second, the second covers the third — which
 * is the opposite of what the DOM gives for free, where each sibling paints
 * over the one before it. Hence an explicit descending stacking order, with the
 * active thumb lifted above the whole deck.
 *
 * The order of the row itself stays fixed: reordering to float the active one
 * to the front would make the whole control jump on every click.
 *
 * The deck also advances by itself every few seconds. Anything that moves on
 * its own owes the viewer a way to stop it, which is what the pause button is —
 * not a nicety, the reason the autoplay is allowed to exist at all.
 */
export function CaseSwitcher({ activeIndex, onSelect }: CaseSwitcherProps) {
  const [paused, setPaused] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);

  // Declared before the ticking effect so it runs first on an index change:
  // whichever case we just landed on gets the full hold, whether the deck
  // advanced itself or the visitor picked from it.
  useEffect(() => {
    elapsedRef.current = 0;
    if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
  }, [activeIndex]);

  useEffect(() => {
    if (paused) return;

    let frame = 0;
    let previous = performance.now();

    /**
     * One clock drives both the bar and the advance, so what the bar shows is
     * the timer itself rather than a second animation running alongside it —
     * and pausing keeps the elapsed time instead of silently rewinding it.
     *
     * The width is written straight to the element: at 60fps, holding it in
     * state would re-render the switcher on every frame for a value nothing
     * else reads.
     */
    const tick = (now: number) => {
      elapsedRef.current += now - previous;
      previous = now;

      if (elapsedRef.current >= HOLD_MS) {
        onSelect((activeIndex + 1) % CASES.length);
        return;
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${elapsedRef.current / HOLD_MS})`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, activeIndex, onSelect]);

  return (
    /* The deck sets the width and the controls stretch to it, so the timer is
       always exactly as wide as the row it belongs to — including while the
       deck is fanning out on hover, since the bar takes whatever the button
       leaves and the deck's margins are what animate. */
    <div className="flex flex-col gap-2.5">
      <div className="group flex w-fit items-center">
        {CASES.map((heroCase, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={heroCase.name + index}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={isActive}
              aria-label={`Ver o case ${heroCase.name}`}
              /* The deck recedes away from whichever thumb is active: stacking
                 order falls with distance from it, and the active one sits one
                 step above the whole deck. A fixed order counted from the first
                 thumb would leave the far end of the row covering the near end
                 once the active card moved down the deck.

                 Only neighbours overlap, so two thumbs at equal distance never
                 meet and the tie between them cannot be seen. */
              style={{
                zIndex: isActive
                  ? CASES.length + 1
                  : CASES.length - Math.abs(index - activeIndex),
              }}
              className={`relative shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none ${
                isActive
                  ? 'h-14 w-14 border-white opacity-100'
                  : 'h-12 w-12 border-white/20 opacity-60 hover:opacity-90'
              } ${index === 0 ? '' : 'ml-2 lg:-ml-6 lg:group-hover:ml-2'}`}
            >
              {heroCase.photoUrl ? (
                <img
                  src={heroCase.photoUrl}
                  alt=""
                  className="pointer-events-none h-full w-full select-none object-cover"
                  draggable={false}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-doxa-raised">
                  <ImageOff className="h-4 w-4 text-white/30" strokeWidth={1.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {/* Timing feedback, not information: the bar says nothing the countdown
            and the button do not already say out loud. */}
        <div aria-hidden className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
          <div
            ref={barRef}
            className="h-full w-full origin-left rounded-full bg-white"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? 'Retomar a troca automática' : 'Pausar a troca automática'}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-white/70 transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {paused ? (
            <Play className="h-3 w-3 fill-current" strokeWidth={0} />
          ) : (
            <Pause className="h-3 w-3 fill-current" strokeWidth={0} />
          )}
        </button>
      </div>
    </div>
  );
}
