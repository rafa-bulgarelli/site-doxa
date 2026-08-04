/**
 * The published videos the proof wall surfs through.
 *
 * Every entry is a real post on a real client's profile. Nothing here may be
 * padded: a stock photo standing in for a client's reel is a fabricated case,
 * and this section exists for no other reason than to be checkable. If there
 * are six files, the wall shows six.
 *
 * PENDENTE-DONO: seeded with the three cases the owner has handed over so far.
 * He asked for around fifteen reels across ten clients — the remaining twelve
 * are files this repo does not have yet. Drop them in `public/media/` and add a
 * line each; the section reads the length and sizes itself.
 */
export interface Reel {
  /** The profile it was published on. Shown on the card so the claim is checkable. */
  handle: string;
  /**
   * PENDENTE-DONO: set on every profile on the owner's instruction. Worth one
   * look before this ships — the tick is a statement about someone else's
   * account, made on our page, and it is only ours to make where the platform
   * actually granted it.
   */
  verified: boolean;
  /** The still. Always loaded — it is what the whole wall is built out of. */
  posterUrl: string;
  /**
   * The file, played only on the card at the front of the track. Null renders a
   * poster that never animates, which is the honest state for a case whose
   * video has not been supplied.
   */
  videoUrl: string | null;
  /**
   * What the post did, quoted and never computed. Every figure is nullable on
   * its own: a reel the owner has given views for but not comments renders the
   * views and drops the rest, rather than filling the gap with a likely number.
   */
  views: string | null;
  likes: string | null;
  comments: string | null;
  reposts: string | null;
}

export const REELS: readonly Reel[] = [
  {
    handle: '@corealquimias',
    verified: true,
    posterUrl: '/media/core-poster.jpg',
    videoUrl: '/media/core-video.mp4',
    views: '3,4M',
    likes: '170k',
    comments: '3k',
    reposts: '1.300',
  },
  {
    handle: '@uninovamotos',
    verified: true,
    posterUrl: '/media/uninova-poster.jpg',
    videoUrl: '/media/uninova-video.mp4',
    views: '+2,5M',
    likes: '+111k',
    comments: null,
    reposts: null,
  },
  {
    handle: 'Magalu',
    verified: true,
    posterUrl: '/media/magalu-poster.jpg',
    videoUrl: '/media/magalu-video.mp4',
    views: null,
    likes: null,
    comments: null,
    reposts: null,
  },
];

/** How many cards the wall wants on screen for the fly-through to read as one. */
const WALL_TARGET = 15;

/**
 * The cards the wall actually renders.
 *
 * PENDENTE-DONO: repeats the real reels until the track is dense enough to fly
 * through, on the owner's instruction, standing in for the twelve files this
 * repo does not have yet.
 *
 * The repetition lives here and never touches `REELS`, and that separation is
 * the point. `REELS` is the claim — everything the page states a number about
 * counts it, so the page never says "fifteen" about three. This list is only
 * how many rectangles are drawn. When the real files land in `REELS`, the
 * repetition stops on its own with nothing to undo.
 */
export const WALL_REELS: readonly Reel[] = Array.from(
  { length: Math.max(WALL_TARGET, REELS.length) },
  (_, index) => REELS[index % REELS.length],
);
