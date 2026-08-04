import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';

const CARD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const ICON_STORYBOARD =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85';
const ICON_CRITIQUES =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85';
const ICON_IMMERSION =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85';

const CREAM = '#E1E0CC';
const CARD_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealCardProps {
  index: number;
  children: ReactNode;
  className?: string;
}

/** Wraps a grid cell so it scales and fades in, staggered by its position. */
function RevealCard({ index, children, className = '' }: RevealCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden rounded-2xl ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.15, ease: CARD_EASE }}
    >
      {children}
    </motion.div>
  );
}

interface FeatureCardProps {
  index: number;
  icon: string;
  number: string;
  title: string;
  items: string[];
}

function FeatureCard({ index, icon, number, title, items }: FeatureCardProps) {
  return (
    <RevealCard index={index} className="flex h-full flex-col bg-[#212121] p-5 md:p-6">
      <img
        src={icon}
        alt=""
        className="h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12"
        loading="lazy"
      />

      <h3 className="mt-6 text-lg md:text-xl" style={{ color: CREAM }}>
        {title}{' '}
        <span className="text-primary/40">({number})</span>
      </h3>

      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-xs text-gray-400 md:text-sm">{item}</span>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="group mt-auto flex items-center gap-1.5 pt-6 text-xs text-primary md:text-sm"
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5" />
      </a>
    </RevealCard>
  );
}

export function Features() {
  return (
    <section className="relative min-h-screen bg-black px-4 py-20 md:px-6 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
        <WordsPullUpMultiStyle
          className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
          segments={[
            {
              text: 'Studio-grade workflows for visionary creators.',
              className: 'text-primary',
            },
            {
              text: 'Built for pure vision. Powered by art.',
              className: 'text-gray-500',
            },
          ]}
        />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
          <RevealCard index={0} className="relative min-h-[320px] lg:min-h-0">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={CARD_VIDEO}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p
              className="absolute bottom-0 left-0 right-0 p-5 text-lg md:p-6 md:text-xl"
              style={{ color: CREAM }}
            >
              Your creative canvas.
            </p>
          </RevealCard>

          <FeatureCard
            index={1}
            icon={ICON_STORYBOARD}
            number="01"
            title="Project Storyboard."
            items={[
              'Frame-by-frame shot planning',
              'Drag-and-drop sequence reordering',
              'Version history on every board',
              'Shareable links for your client',
            ]}
          />

          <FeatureCard
            index={2}
            icon={ICON_CRITIQUES}
            number="02"
            title="Smart Critiques."
            items={[
              'AI analysis of pacing and composition',
              'Creative notes written in your voice',
              'Integrations with the tools you already use',
            ]}
          />

          <FeatureCard
            index={3}
            icon={ICON_IMMERSION}
            number="03"
            title="Immersion Capsule."
            items={[
              'Notification silencing while you cut',
              'Ambient soundscapes tuned per session',
              'Schedule syncing across your collective',
            ]}
          />
        </div>
      </div>
    </section>
  );
}
