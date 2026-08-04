import { Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';

/**
 * Where the playhead sits, and the clock either side of it. Composition only:
 * this depicts the client's voice note, it does not load or play one.
 */
const PROGRESS_PERCENT = 38;
const ELAPSED = '0:21';
const TOTAL = '0:56';

/**
 * Transport row, in the reference's order.
 *
 * Everything but play is marked secondary and drops out below `xl`. Play is
 * what makes the control legible as a player at all; the other four are
 * texture, and texture is the first thing to go when the box shrinks.
 *
 * `xl` rather than `lg` because the full row needs 212px — five 28px controls,
 * their gaps, the padding and the speed badge — and the card is a 21% share of
 * the canvas, which only clears that from about 1280px up. At `lg` it is 198px
 * and the row spills out of its own card.
 */
const TRANSPORT = [
  { Icon: Shuffle, secondary: true },
  { Icon: SkipBack, secondary: true },
  { Icon: Play, secondary: false },
  { Icon: SkipForward, secondary: true },
  { Icon: Repeat, secondary: true },
];

/**
 * The "Voz do cliente" node.
 *
 * Nothing here is interactive, so the whole thing is a depiction and stays out
 * of the accessibility tree — real controls wired to no audio would announce
 * themselves and then do nothing.
 */
export function AudioPlayer() {
  return (
    <div
      aria-hidden
      className="flex flex-col gap-y-1 bg-white/[0.06] px-[11px] py-[17px] backdrop-blur-sm"
    >
      <div className="flex flex-col gap-y-1.5">
        <div className="relative h-1 w-full rounded-full bg-white/20">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white"
            style={{ width: `${PROGRESS_PERCENT}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-white/70">
          <span>{ELAPSED}</span>
          <span>{TOTAL}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="flex w-fit items-center gap-1 rounded-2xl bg-white/[0.06] p-1.5">
          {TRANSPORT.map(({ Icon, secondary }, index) => (
            <span
              key={index}
              className={`h-7 w-7 items-center justify-center rounded-full text-white ${
                secondary ? 'hidden xl:flex' : 'flex'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
          ))}
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[11px] font-semibold tabular-nums text-white">
          1x
        </span>
      </div>
    </div>
  );
}
