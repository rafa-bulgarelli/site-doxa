import { Comparacao } from './components/Comparacao';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProofWall } from './components/ProofWall';

/**
 * As seis seções do site, na ordem que o dono desenhou:
 * hero · como funciona · prova · comparação (CTA) · FAQ · rodapé.
 *
 * As duas últimas ainda não existem. O FAQ vai nascer da seção `SemCom`, que
 * está de STAND BY fora daqui: ela continua no repositório, inteira, e saiu da
 * página por decisão do dono — 640vh de linha do tempo presa ao scroll, logo
 * antes do pedido, transformava em passageiro justamente quem devia estar
 * decidindo. A `Comparacao` ocupa o lugar dela com o mesmo argumento e sem
 * sequestrar o scroll.
 */
export default function App() {
  return (
    <main className="bg-black">
      <Hero />
      <HowItWorks />
      <ProofWall />
      <Comparacao />
    </main>
  );
}
