/**
 * The client cases the hero canvas cycles through.
 *
 * Every field is nullable because a case gets filled as the owner hands the
 * pieces over, and a half-filled case has to degrade rather than invent: a
 * missing file renders as a pending frame, missing numbers drop the stat row,
 * a missing handle falls back to the client name. Nothing here may be guessed —
 * a made-up figure under a real client's name is fabricated proof.
 */
/**
 * What the published post did, on the output card's header.
 *
 * Stored as the strings they render as, in the owner's own shorthand. These are
 * quoted numbers, not a computation: a formatter here would only invite
 * rounding a figure the owner did not say.
 */
export interface CaseStats {
  views: string;
  likes: string;
  /**
   * The rest of the engagement row, nullable on the same terms as everything
   * else here: a case gets them when the owner hands them over, and a card that
   * has not been given a comment count renders without one rather than
   * inventing a plausible-looking number under a real client's post.
   */
  comments: string | null;
  reposts: string | null;
}

export interface HeroCase {
  /** Shown as the card's second line, so the active case is always readable. */
  name: string;
  /**
   * Where the case was published. The output card credits this instead of the
   * client name — the post lives on their account, not on ours. Null until the
   * owner supplies it, and the name stands in.
   */
  handle: string | null;
  photoUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  /**
   * The output card's label. Per-case because what the pipeline produced is
   * not the same job every time — a retailer's SKU video and an influencer's
   * reel are different deliverables, and one label for both would undersell
   * whichever it did not describe.
   */
  outputLabel: string;
  /** Null until the owner hands over this case's numbers. */
  stats: CaseStats | null;
  /**
   * Sets this case's card headers on a single line instead of stacking the
   * descriptor under the label. Per-case on the owner's call, so it travels
   * with the case rather than being derived from what the case happens to
   * carry — a case that later gains numbers should not silently relayout.
   */
  inlineHeader: boolean;
}

export const CASES: readonly HeroCase[] = [
  {
    name: 'Magalu',
    handle: null,
    photoUrl: '/media/magalu-foto.avif',
    videoUrl: '/media/magalu-video.mp4',
    posterUrl: '/media/magalu-poster.avif',
    outputLabel: 'Vídeo de SKU/Produto',
    stats: null,
    inlineHeader: true,
  },
  {
    name: 'Core',
    handle: '@corealquimias',
    photoUrl: '/media/core-foto.avif',
    videoUrl: '/media/core-video.mp4',
    posterUrl: '/media/core-poster.avif',
    outputLabel: 'Vídeo viral',
    // PENDENTE-DONO: sharpened from '+3M' / '+170k' on the owner's word. These
    // are the figures he gave for this post; they render wherever the case is
    // credited, so the two places that quote them cannot disagree.
    stats: { views: '3,4M', likes: '170k', comments: '3k', reposts: '1.300' },
    inlineHeader: false,
  },
  {
    name: 'Uninova',
    handle: '@uninovamotos',
    photoUrl: '/media/uninova-foto.avif',
    videoUrl: '/media/uninova-video.mp4',
    posterUrl: '/media/uninova-poster.avif',
    outputLabel: 'Vídeo viral',
    stats: { views: '+2,5M', likes: '+111k', comments: null, reposts: null },
    inlineHeader: false,
  },
];
