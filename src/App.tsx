import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProofWall } from './components/ProofWall';

export default function App() {
  return (
    <main className="bg-black">
      <Hero />
      <HowItWorks />
      <ProofWall />
    </main>
  );
}
