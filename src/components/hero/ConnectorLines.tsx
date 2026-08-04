import { useEffect, useRef, useState, type RefObject } from 'react';

interface ConnectorLinesProps {
  containerRef: RefObject<HTMLElement>;
  /** Input nodes; a curve leaves each one toward the output. */
  fromRefs: RefObject<HTMLElement>[];
  /** Output node; every curve lands on it. */
  toRef: RefObject<HTMLElement>;
}

interface Size {
  width: number;
  height: number;
}

const EMPTY: Size = { width: 0, height: 0 };

/** Minimum pull on the bezier handles, so short hops still curve. */
const MIN_BEND = 50;

/** Wire gauge. The pulse rides half a pixel heavier so it reads as light on
 *  the wire rather than as a second wire. */
const WIRE_WIDTH = 2;
const PULSE_WIDTH = 2.5;

/**
 * The curves that turn separate cards into one pipeline: the client's face and
 * voice flowing into the finished video.
 *
 * Geometry is recomputed every frame and written straight onto the `<path>`
 * elements. The cards are draggable and also drift on an idle loop, so anchors
 * move constantly — measuring on mount and resize alone would leave the curves
 * detached from the cards. Going through React state instead would mean a
 * re-render per frame; setting the attribute imperatively costs three rect
 * reads and two writes.
 *
 * Anchors are read from the live DOM rather than guessed as percentages: the
 * cards are max-width capped, so their edges drift away from any fixed
 * percentage as the viewport grows. The viewBox is in real pixels, which also
 * keeps the stroke a true hairline (a stretched viewBox smears it).
 */
export function ConnectorLines({ containerRef, fromRefs, toRef }: ConnectorLinesProps) {
  const [size, setSize] = useState<Size>(EMPTY);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const rect = container.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);

      const container = containerRef.current;
      const target = toRef.current;
      if (!container || !target) return;

      const base = container.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const toX = to.left + to.width / 2;
      const toY = to.top + to.height / 2;

      fromRefs.forEach((ref, index) => {
        const node = ref.current;
        const line = lineRefs.current[index];
        if (!node || !line) return;

        const from = node.getBoundingClientRect();
        // A node that measures nothing is one the layout has taken out, mid
        // swap between the two arrangements. Clearing the path is what stops a
        // wire from hanging in the air, anchored to geometry that is gone.
        if (!from.width || !to.width) {
          line.setAttribute('d', '');
          pulseRefs.current[index]?.setAttribute('d', '');
          return;
        }

        const fromX = from.left + from.width / 2;
        const fromY = from.top + from.height / 2;

        /**
         * Which way the hop actually travels.
         *
         * Side by side the inputs are beside the output and the wire leaves
         * sideways; stacked they are above it and it leaves downward. Reading
         * it off the geometry rather than off a breakpoint means the drag on
         * the wide canvas keeps working too — throw a node above the output and
         * its wire re-routes over the top instead of looping out and back.
         */
        const vertical = Math.abs(toY - fromY) > Math.abs(toX - fromX);

        let startX: number;
        let startY: number;
        let endX: number;
        let endY: number;
        let bendX: number;
        let bendY: number;

        if (vertical) {
          const downward = toY > fromY;
          startX = fromX - base.left;
          startY = (downward ? from.bottom : from.top) - base.top;
          endX = toX - base.left;
          endY = (downward ? to.top : to.bottom) - base.top;
          bendX = 0;
          bendY = Math.max(Math.abs(endY - startY) * 0.5, MIN_BEND) * (downward ? 1 : -1);
        } else {
          // Leave from whichever edge faces the target, so a card dragged past
          // the output still connects from its near side.
          const leftToRight = fromX < toX;
          startX = (leftToRight ? from.right : from.left) - base.left;
          startY = fromY - base.top;
          endX = (leftToRight ? to.left : to.right) - base.left;
          endY = toY - base.top;
          bendX = Math.max(Math.abs(endX - startX) * 0.5, MIN_BEND) * (leftToRight ? 1 : -1);
          bendY = 0;
        }

        const d = `M ${startX} ${startY} C ${startX + bendX} ${startY + bendY}, ${endX - bendX} ${endY - bendY}, ${endX} ${endY}`;

        line.setAttribute('d', d);
        pulseRefs.current[index]?.setAttribute('d', d);
      });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [containerRef, fromRefs, toRef]);

  if (!size.width || !size.height) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${size.width} ${size.height}`}
      fill="none"
      aria-hidden="true"
    >
      {fromRefs.map((_, index) => (
        <g key={index}>
          {/* The resting wire. */}
          <path
            ref={(node) => {
              lineRefs.current[index] = node;
            }}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={WIRE_WIDTH}
            style={{ animation: `connector-in 1.2s ${0.7 + index * 0.15}s ease-out both` }}
          />
          {/* The signal running along it — a short bright dash swept from the
              input toward the output by animating the dash offset. */}
          <path
            ref={(node) => {
              pulseRefs.current[index] = node;
            }}
            className="connector-pulse"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={PULSE_WIDTH}
            strokeLinecap="round"
            style={{ animationDelay: `${1.6 + index * 1.3}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
