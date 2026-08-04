import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVAL_MS = 2200;

interface WordRotatorProps {
  /** Cycled in order. Every entry must be literal owner content, never filler. */
  words: readonly string[];
  className?: string;
}

/**
 * The one moving word in the headline, mirroring Flora's rotator.
 *
 * Only the visual layer rotates: assistive tech gets the full list at once, so
 * a screen reader hears all three platforms instead of whichever one happened
 * to be on screen. That also keeps the claim honest — the guarantee counts the
 * three platforms together, not one at a time.
 */
export function WordRotator({ words, className = '' }: WordRotatorProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [words.length]);

  // The longest word reserves the track width so the rest of the line never
  // reflows mid-rotation; the animated copy is laid over that spacer.
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
  const offset = reduceMotion ? 0 : '0.9em';

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span
        aria-hidden="true"
        className={`relative inline-grid overflow-hidden align-bottom ${className}`}
      >
        <span className="invisible col-start-1 row-start-1">{widest}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            /* The box is as wide as the longest word, so a short one has slack
               to sit in. It takes that slack on the right: the word has to hug
               the "no" in front of it, and centring would float it away from
               the clause it belongs to. */
            className="col-start-1 row-start-1 whitespace-nowrap text-left"
            initial={{ y: offset, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduceMotion ? 0 : `-${offset}`, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
