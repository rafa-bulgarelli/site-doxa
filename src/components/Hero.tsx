import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CanvasCard } from './hero/CanvasCard';
import { ClientPhoto, ViralVideo } from './hero/MediaFrame';
import { CASES } from './hero/cases';
import { CaseSwitcher } from './hero/CaseSwitcher';
import { AudioPlayer } from './hero/AudioPlayer';
import { ConnectorLines } from './hero/ConnectorLines';
import { WordRotator } from './hero/WordRotator';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
import { MotionButton } from './ui/MotionButton';
import { HREF_FORMS } from '../ancoras';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { TOOLS } from './tools';

/**
 * The three platforms the guarantee counts together. Literal owner content —
 * the cumulative total spans all three, so all three must appear.
 */
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube Shorts'] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function FadeUp({
  children,
  delay,
  className = '',
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const isDesktop = useIsDesktop();
  const [caseIndex, setCaseIndex] = useState(0);
  const activeCase = CASES[caseIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Stable identity: ConnectorLines re-measures whenever this array changes.
  const inputRefs = useMemo(() => [photoRef, voiceRef], []);

  return (
    <section
      ref={sectionRef}
      data-secao="Início"
      /* O recuo de topo é o BURACO DO CABEÇALHO, que agora é `fixed` e saiu do
         fluxo (ver `Cabecalho.tsx`). Sem ele, o canvas subiria por baixo do
         logo. A conta é a de lá: 44 da pílula mais os recuos verticais — 20+20
         no telefone, 28+28 do `md` para cima. Mexer numa exige mexer na outra. */
      className="relative flex min-h-dvh flex-col overflow-hidden bg-doxa-bg pt-[5.25rem] md:pt-[6.25rem]"
    >
      <div className="dot-grid pointer-events-none absolute inset-0" />
      {/* Tracks the cursor across the whole hero, not just the canvas column. */}
      <DotGridSpotlight containerRef={sectionRef} />
      {/* Monochrome lighting, not colour: the only "accent" the brand allows. */}
      <div className="hero-glow pointer-events-none absolute inset-0" />

      {/* Hands the fold over to the section below: transparent at the top of
          the band, absolute black at the floor, in a straight vertical ramp.

          A real layer of black rather than a mask on the grid, because the
          bottom of the hero is not only dots — `hero-glow` lifts the floor with
          a white bloom, and masking the dots would leave that bloom sitting in
          what is supposed to be pure black. Painting over both is the only way
          the ramp actually ends where it says it does.

          It sits after the lighting and before the header, the canvas and the
          logo row, all of which are positioned or stacked above it — so it
          darkens the backdrop and nothing that has to stay readable.

          Desktop only. On a phone the fold is a tall scroll rather than a
          composed frame, and half its height painted black takes the grid out
          of the part of the page the visitor is actually reading.

          The stop is held at 70%: the band keeps its height, so the hand-over
          still lands on absolute black at the floor, but nothing darkens until
          the last third of it. Ramping across the whole band was laying a haze
          over the middle of the fold, where the canvas and the logo row are. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-b from-transparent from-70% to-black lg:block" />

      {/* Capped, not full-bleed: the nodes are positioned against this box, so
          without a ceiling they ride the viewport edge and the canvas pulls
          itself apart on a wide screen — two inputs and an output stop reading
          as one machine once a metre of black separates them.

          The cap is the only fixed width in here. Everything inside is a share
          of it, so the canvas grows continuously up to the ceiling instead of
          freezing early and leaving a band of screen where things stop
          tracking the window. */}
      <div
        ref={canvasRef}
        className="relative mx-auto flex w-full max-w-screen-2xl flex-1 items-center px-5 py-10 md:px-10"
      >
        <ConnectorLines containerRef={canvasRef} fromRefs={inputRefs} toRef={outputRef} />

        {/* Rendered, not just hidden. A `display: none` node still holds its
            ref, and a ref to a hidden node measures zero — so keeping both
            arrangements mounted would leave the wires anchored to whichever
            set of anchors happened to bind last, all of them at the origin. */}
        {isDesktop && (
          <>
            {/* Input nodes — what the client hands over. Draggable: the canvas
                is the product metaphor, so the nodes have to feel like
                objects. */}
            <div className="absolute left-10 top-[11%] w-[21%]">
              <CanvasCard
                label="Foto do cliente"
                meta={activeCase.name}
                inlineHeader={activeCase.inlineHeader}
                swapKey={caseIndex}
                delay={0.35}
                driftDelay={0}
                bodyRef={photoRef}
                draggable
                dragConstraints={canvasRef}
              >
                <ClientPhoto
                  ratio="aspect-square"
                  src={activeCase.photoUrl}
                  midSrc={activeCase.photoMidUrl}
                />
              </CanvasCard>
            </div>

            <div className="absolute bottom-[11%] left-10 w-[21%]">
              <CanvasCard
                label="Voz do cliente"
                meta="Áudio"
                inlineHeader={activeCase.inlineHeader}
                delay={0.5}
                driftDelay={-3.5}
                bodyRef={voiceRef}
                draggable
                dragConstraints={canvasRef}
              >
                <AudioPlayer />
              </CanvasCard>
            </div>

            {/* Output node — the finished vertical video. */}
            <div className="absolute right-10 top-1/2 w-[19%] -translate-y-1/2">
              <CanvasCard
                label={activeCase.outputLabel}
                meta={activeCase.handle ?? activeCase.name}
                stats={activeCase.stats}
                inlineHeader={activeCase.inlineHeader}
                swapKey={caseIndex}
                delay={0.65}
                driftDelay={-6}
                bodyRef={outputRef}
                draggable
                dragConstraints={canvasRef}
              >
                <ViralVideo
                  ratio="aspect-[9/16]"
                  src={activeCase.videoUrl}
                  poster={activeCase.posterUrl}
                />
              </CanvasCard>
            </div>
          </>
        )}

        {/* Centre column. */}
        <div className="relative z-20 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          {/* Sits behind the copy inside the same stacking context, so it hides
              the grid without also hiding the text. */}
          {/* Held back on a phone: there the copy already owns the screen and
              the veil has nothing to clear, so at full strength it just paints
              out the grid the fold is built on. */}
          <div className="hero-copy-veil pointer-events-none absolute -inset-x-32 -inset-y-20 -z-10 opacity-50 lg:opacity-100" />

          {/* The phone size is set by the second line, not the first.
              "Ou seu dinheiro de volta." is 8.42em wide in Instrument Serif
              Italic at this tracking, against 6.70em for the roman line above
              it — so the size at which the headline reads as two lines rather
              than three is the one the *italic* fits on. On the narrowest
              phone that is 10.4vw; 10vw is that ceiling with enough margin
              that the wider serif fallback doesn't wrap it before the webfont
              lands. */}
          <h1 className="font-serif text-[10vw] font-normal leading-[1.1] tracking-[-0.02em] text-white sm:text-6xl md:text-[4.25rem]">
            Um milhão de views.
            <br />
            <em className="italic">Ou seu dinheiro de volta.</em>
          </h1>

          {/* The one moving element in the headline block — Flora's rotator,
              carrying the owner's literal platform list instead of ad copy. */}
          <FadeUp delay={0.45}>
            <p className="mt-6 flex flex-wrap items-baseline justify-center gap-x-2 text-sm text-white/70 md:text-base">
              <span>60 conteúdos · 90 dias ·</span>
              {/* The clause and the platform it names are one unit: broken
                  apart, a line ends on "no" and the next opens on a word that
                  is still rotating. Its own non-wrapping flex box is what keeps
                  the break in front of the clause instead of inside it. */}
              <span className="flex items-baseline gap-x-2">
                <span>views somadas no</span>
                <WordRotator words={PLATFORMS} className="font-medium text-white" />
              </span>
            </p>
          </FadeUp>

          {/* Single journey: the owner cut the agency CTA from this fold.

              The stacked pipeline lives inside this row rather than beside it,
              which is the only way to get the phone order the owner asked for
              — button, then cards, then the deck. Ordering siblings can't do
              it: the cards would have to be in this flex container to be
              interleaved with its children at all. Column until `lg` for the
              same reason; from there the cards are gone and the button and the
              deck close back into a row. */}
          <FadeUp delay={0.7} className="w-full">
            {/* `justify-center` is not redundant with the column's own
                centring: this row is `w-full` so the cards can use the width,
                which means it is wider than the button and the deck put
                together and has to centre them itself. */}
            {/* One step of the scale between every action on a phone. The row
                keeps the tighter horizontal gap from `lg`, where the button
                and the deck sit side by side and 24px would read as a gulf. */}
            <div className="mt-6 flex flex-col items-center gap-6 lg:mt-9 lg:flex-row lg:items-start lg:justify-center lg:gap-3">
              <MotionButton label="Quero viralizar" href={HREF_FORMS} />

              {/* The canvas below the desktop breakpoint, in its two forms.

                  On a phone it is the canvas turned ninety degrees. It used to
                  drop the inputs entirely and keep only the video, on the
                  reasoning that a pipeline needs room to show both ends and the
                  wire between them. That was the wrong axis: a phone has no
                  width to spare but all the height in the world. Set the two
                  inputs across the top and the output below them, and the wires
                  fall instead of reaching — same machine, same argument, read
                  top to bottom.

                  A tablet in portrait is not that. 672px of column is enough to
                  run the machine the way the desktop runs it, so from `md` the
                  inputs bank up on the left and the output sits opposite them,
                  and the argument goes back to reading left to right. Stacked,
                  the same three cards were an 877px tower that no longer fit
                  the fold they are supposed to be part of.

                  All of it in classes, with no second branch in here: the wires
                  pick their axis from the measured geometry rather than from a
                  breakpoint, so turning the layout is enough to turn them.

                  Not draggable in either form. Drag on a touch screen competes
                  with the scroll that is the only way through the page, and it
                  would lose that fight in the worst way: by winning
                  sometimes. */}
              {!isDesktop && (
                <div className="mx-auto mt-4 w-full max-w-[310px] md:mt-6 md:flex md:max-w-none md:items-center md:justify-between">
                  {/* Across the top on a phone, down the left on a tablet. */}
                  <div className="flex items-start gap-4 md:w-[30%] md:flex-col md:gap-10">
                    {/* Stacked headers on both inputs regardless of the case's
                        own preference: the inline form sets label and client on
                        one line, and neither half of a phone nor a third of
                        this column is one line. */}
                    <div className="w-1/2 md:w-full">
                      <CanvasCard
                        label="Foto do cliente"
                        meta={activeCase.name}
                        swapKey={caseIndex}
                        delay={0.8}
                        driftDelay={0}
                        bodyRef={photoRef}
                      >
                        <ClientPhoto
                          ratio="aspect-square"
                          src={activeCase.photoUrl}
                          midSrc={activeCase.photoMidUrl}
                        />
                      </CanvasCard>
                    </div>

                    <div className="w-1/2 md:w-full">
                      <CanvasCard
                        label="Voz do cliente"
                        meta="Áudio"
                        delay={0.9}
                        driftDelay={-3.5}
                        bodyRef={voiceRef}
                      >
                        <AudioPlayer />
                      </CanvasCard>
                    </div>
                  </div>

                  {/* The span the wires curve through — the drop on a phone,
                      the reach on a tablet. Close it and the two of them leave
                      and land in the same breath, which reads as a bracket
                      rather than as flow. On a tablet `justify-between` opens
                      it: the two banks take 57% of the column between them and
                      the rest is the gap the wires need. */}
                  <div className="mx-auto mt-16 w-[70%] max-w-[210px] md:mx-0 md:mt-0 md:w-[27%] md:max-w-none">
                    <CanvasCard
                      label={activeCase.outputLabel}
                      meta={activeCase.handle ?? activeCase.name}
                      stats={activeCase.stats}
                      swapKey={caseIndex}
                      delay={1}
                      driftDelay={-6}
                      bodyRef={outputRef}
                    >
                      <ViralVideo
                        ratio="aspect-[9/16]"
                        src={activeCase.videoUrl}
                        poster={activeCase.posterUrl}
                      />
                    </CanvasCard>
                  </div>
                </div>
              )}

              <CaseSwitcher activeIndex={caseIndex} onSelect={setCaseIndex} />
            </div>
          </FadeUp>
        </div>
      </div>

      <FadeUp
        delay={1.1}
        className="relative z-20 flex flex-col items-center gap-4 px-5 pb-12 md:pb-16"
      >
        {/* Its own element rather than another item in the row: as a sibling of
            the marks it would inherit their 64px gap and stop reading as a
            label for them. */}
        <span className="text-sm text-white/40">parceiros:</span>

        {/* Mark and name together. The marks are symbols, not wordmarks — five
            bare glyphs would ask the visitor to recognise every vendor from an
            abstract shape, which is a test the row does not need to set.

            No hover state on any of it: these are not links, and lighting up
            under the cursor would promise a click that does not exist. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-16">
          {TOOLS.map(({ name, logoUrl }) => (
            <span key={name} className="flex items-center gap-2 text-white">
              <img
                src={logoUrl}
                alt=""
                aria-hidden
                className="h-[18px] w-[18px] shrink-0 object-contain md:h-5 md:w-5"
              />
              <span className="text-sm font-semibold tracking-tight md:text-base">{name}</span>
            </span>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
