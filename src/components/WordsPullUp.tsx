import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

interface WordsPullUpProps {
  text: string;
  className?: string;
  /** Renders a superscript trademark symbol hanging off the final word. */
  showTrademark?: boolean;
}

/** Splits `text` on spaces and slides each word up as it scrolls into view. */
export function WordsPullUp({ text, className = '', showTrademark = false }: WordsPullUpProps) {
  const words = text.split(' ');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        return (
          <motion.span
            key={`${word}-${index}`}
            className="relative inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
          >
            {word}
            {showTrademark && isLast && (
              // Sobe pro topo: o asterisco desenha alto dentro do glifo, o ™ não —
              // manter top-[0.65em] deixaria o símbolo boiando no meio da palavra.
              <span className="absolute -right-[0.34em] top-[0.06em] text-[0.22em]">™</span>
            )}
            {!isLast && ' '}
          </motion.span>
        );
      })}
    </div>
  );
}

export interface StyledSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: StyledSegment[];
  className?: string;
}

/**
 * Same pull-up animation as `WordsPullUp`, but the source is a list of segments
 * so a single heading can mix type styles (e.g. an italic serif clause).
 */
export function WordsPullUpMultiStyle({ segments, className = '' }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = segments.flatMap((segment) =>
    segment.text
      .split(' ')
      .filter(Boolean)
      .map((word) => ({ word, className: segment.className ?? '' })),
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map(({ word, className: wordClassName }, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={`inline-block ${wordClassName}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
        >
          {word}
          {' '}
        </motion.span>
      ))}
    </div>
  );
}
