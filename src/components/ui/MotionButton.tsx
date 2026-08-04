import { ArrowRight } from 'lucide-react';

interface MotionButtonProps {
  label: string;
  /** Navigates. Mutually exclusive with `onClick`. */
  href?: string;
  /** Acts in place. Given this, the element renders as a real `<button>`. */
  onClick?: () => void;
  /** `primary` fills with white on hover and flips the label to black. */
  variant?: 'primary' | 'secondary';
}

/**
 * Pill button with a disc on the left that grows to swallow the whole shape on
 * hover, after the reference's motion-button.
 *
 * The reference sizes the pill with a fixed width and centres the label
 * absolutely inside it. Here the label is in normal flow with padding that
 * clears the disc, so the button fits whatever text it is given — the two CTAs
 * differ by more than twenty characters and a fixed width would either clip one
 * or leave the other swimming.
 *
 * Only white at varying alpha, per the brand's monochrome rule: the disc is the
 * light source, the label inverts against it.
 */
export function MotionButton({ label, href, onClick, variant = 'primary' }: MotionButtonProps) {
  const isPrimary = variant === 'primary';
  const className =
    'group relative inline-flex h-14 items-center overflow-hidden rounded-full pl-[4.25rem] pr-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

  const body = (
    <>
      <span
        aria-hidden
        className={`absolute left-1 top-1 h-12 w-12 rounded-full transition-[width] duration-500 ease-out group-hover:w-[calc(100%-0.5rem)] motion-reduce:transition-none ${
          isPrimary ? 'bg-white' : 'bg-white/[0.14]'
        }`}
      />
      <span
        aria-hidden
        className={`absolute left-7 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-0 motion-reduce:transition-none ${
          isPrimary ? 'text-black' : 'text-white'
        }`}
      >
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
      </span>
      <span
        className={`relative whitespace-nowrap text-sm font-medium tracking-tight text-white transition-colors duration-500 motion-reduce:transition-none md:text-base ${
          isPrimary ? 'group-hover:text-black' : ''
        }`}
      >
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }

  return (
    <a href={href} className={className}>
      {body}
    </a>
  );
}
