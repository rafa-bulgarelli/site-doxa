import { useEffect, useState } from 'react';

/** Tailwind's `lg`, which is where the site's layouts stop stacking. */
const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Which of the two layouts a section is in.
 *
 * A media query, not a guess from pointer capability: the question being asked
 * is whether things sit side by side or in a column, and that is decided by
 * width alone. A touch laptop is a wide screen and a mouse plugged into a phone
 * is still a column.
 *
 * Worth reaching for only when the two layouts differ in what is *rendered*
 * rather than in how it is styled — a `lg:` class is cheaper and needs no
 * JavaScript. The cases here are the ones where both variants existing at once
 * would break something: a `display: none` node still holds a ref, and a ref to
 * a hidden node measures zero.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isDesktop;
}
