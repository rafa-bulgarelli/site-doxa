import { useEffect, useRef, type RefObject } from 'react';

interface DotGridSpotlightProps {
  /** The area the cursor is tracked inside; coordinates are relative to it. */
  containerRef: RefObject<HTMLElement>;
  /**
   * Extra classes on the lit layer, for surfaces that need a different gain —
   * `is-forte` opens it up for the small dark card in the comparison section.
   * The geometry still comes from the shared custom properties, so the lit dots
   * cannot drift off their dim twins.
   */
  className?: string;
}

/**
 * Lights the dots the cursor passes over.
 *
 * The position is written straight onto the element as CSS custom properties
 * that `.dot-grid-glow` reads for its mask. Holding it in React state instead
 * would re-render the hero on every pointer move — a few hundred renders per
 * second of dragging — for something no other component needs to know.
 *
 * Coalesced into one write per frame: pointer events fire faster than the
 * screen refreshes, so anything beyond the last position in a frame is paint
 * work thrown away.
 */
export function DotGridSpotlight({ containerRef, className = '' }: DotGridSpotlightProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    // Touch has no hover: the spot would flash under the finger on every tap
    // and then sit there stranded. Better to leave the grid at rest.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      frame = 0;
      layer.style.setProperty('--spot-x', `${x}px`);
      layer.style.setProperty('--spot-y', `${y}px`);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      layer.style.opacity = '1';
      // Promised only while the mask is actually moving. `will-change` in the
      // stylesheet keeps every one of these layers on its own compositor
      // surface for the whole life of the page, and there are six of them at
      // full viewport size — tens of megabytes of GPU memory held for an effect
      // that is idle until a pointer arrives. Set here and dropped on the way
      // out, the hint costs nothing when nobody is pointing at this section.
      layer.style.willChange = '-webkit-mask-position, mask-position';
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const handleLeave = () => {
      layer.style.opacity = '0';
      layer.style.willChange = '';
    };

    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerleave', handleLeave);
    return () => {
      container.removeEventListener('pointermove', handleMove);
      container.removeEventListener('pointerleave', handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  return (
    <div
      ref={layerRef}
      className={`dot-grid-glow pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
