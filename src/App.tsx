import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProofWall } from './components/ProofWall';
import { Features } from './components/Features';

export default function App() {
  return (
    <main className="bg-black">
      <Hero />
      <HowItWorks />
      <ProofWall />
      {/* PENDENTE-DONO: template leftover describing a Berlin production house,
          in English, off assets hosted on someone else's account. It renders
          below the real page until the owner says to drop it. */}
      <Features />
    </main>
  );
}
