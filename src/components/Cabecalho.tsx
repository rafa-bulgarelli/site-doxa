import { useEffect, useState } from 'react';
import { MenuDoxa } from './cabecalho/MenuDoxa';
// Bitmap wordmark — the only form the owner has. Card 002 wants this vectorised
// and signed off before it counts as official; until then this is the asset.
import wordmarkUrl from '../../brand/doxa-wordmark-white-96.avif';

/**
 * ─── O CABEÇALHO ─────────────────────────────────────────────────────────────
 *
 * O logo à esquerda, a pílula do menu à direita, e nada mais.
 *
 * ─── POR QUE ELE SAIU DO HERO ────────────────────────────────────────────────
 *
 * Ele morava dentro da `<section>` da primeira dobra, e ali estava certo
 * enquanto era um cabeçalho de seção. Fixo, deixou de ser: agora ele acompanha a
 * página inteira, e uma peça que sobrevoa a prova, a comparação e o FAQ não pode
 * ser filha do hero. Mora ao lado do `<main>` e do `Rolador`, que é onde estão
 * as outras coisas que flutuam sobre tudo.
 *
 * Fora do `<main>` também porque o `<main>` é a camada de cima do reveal do
 * rodapé. Dentro dele, o cabeçalho sumiria junto com a página no fim da
 * rolagem — e no fim da rolagem é justamente onde alguém pode querer voltar.
 *
 * `z-50` fica ACIMA do `<main>` (10) e ABAIXO do `Rolador` (60): a barra é a
 * única coisa do site que passa por cima de tudo, e ela mora na borda direita,
 * onde cruzaria com o menu se a ordem fosse outra.
 */

/**
 * Quanto o dedo precisa andar para a decisão valer.
 *
 * Sem isto, o tremor de um trackpad — três pixels para baixo, dois para cima —
 * faria o cabeçalho piscar dentro e fora da tela. Oito pixels é menos do que
 * qualquer rolagem intencional e mais do que qualquer ruído.
 *
 * O acumulado NÃO é zerado quando o movimento é pequeno demais: quem rola
 * devagar soma dois pixels de cada vez até cruzar o limiar, em vez de nunca
 * cruzar.
 */
const LIMIAR = 8;

/**
 * Perto do topo o cabeçalho está sempre visível.
 *
 * Não é cortesia: no primeiro pixel de rolagem para baixo, escondê-lo tiraria da
 * tela a única navegação do site enquanto a pessoa ainda está lendo a promessa
 * da dobra. E o quique elástico do iOS devolve `scrollY` NEGATIVO, que sem esta
 * guarda leria como "subindo" e depois como "descendo" em dois quadros.
 */
const TOPO = 24;

/**
 * O cabeçalho aparece quando se sobe e some quando se desce.
 *
 * `travado` é a saída de emergência: com o painel do menu aberto, esconder o
 * cabeçalho levaria embora o que a pessoa está usando. Acontece de verdade no
 * celular — o painel ocupa meia tela, e um dedo que role um pixel enquanto ele
 * está aberto veria a coisa inteira sair voando para cima.
 */
function useVisivel(travado: boolean) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (travado) {
      setVisivel(true);
      return;
    }

    let ultimo = window.scrollY;
    let quadro = 0;

    const avaliar = () => {
      quadro = 0;
      const y = window.scrollY;
      if (y <= TOPO) {
        setVisivel(true);
        ultimo = y;
        return;
      }
      const passo = y - ultimo;
      // Sem atualizar `ultimo`: é isso que deixa o movimento lento acumular.
      if (Math.abs(passo) < LIMIAR) return;
      setVisivel(passo < 0);
      ultimo = y;
    };

    /* Um quadro por rajada. `scroll` dispara dezenas de vezes por segundo e
       cada disparo lê `scrollY`, que força o navegador a calcular layout —
       agrupar na animação é o que impede a leitura de brigar com o desenho. */
    const aoRolar = () => {
      if (quadro === 0) quadro = window.requestAnimationFrame(avaliar);
    };

    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => {
      window.removeEventListener('scroll', aoRolar);
      if (quadro !== 0) window.cancelAnimationFrame(quadro);
    };
  }, [travado]);

  return visivel;
}

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  const visivel = useVisivel(menuAberto);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 transition-transform duration-300 ease-out motion-reduce:transition-none md:px-10 md:py-7 ${
        visivel ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <a href="#" className="shrink-0">
        <img src={wordmarkUrl} alt="Doxa" className="h-6 w-auto md:h-7" width={364} height={96} />
      </a>

      {/* ─── O BURACO E A PEÇA ──────────────────────────────────────────────
          Duas caixas para uma pílula, e as duas são necessárias.

          A de fora é o BURACO: ela tem o tamanho da pílula FECHADA e é a única
          coisa que existe no fluxo do cabeçalho. É ela que reserva o espaço.

          A de dentro está fora do fluxo, ancorada à direita, e é mais larga que
          o buraco de propósito — é o espaço para onde a pílula cresce quando
          abre. Crescer no fluxo mexeria no cabeçalho a cada passada de cursor, e
          um cabeçalho que se reorganiza sozinho no hover é um cabeçalho
          quebrado.

          `pointer-events-none` nela, e `auto` de volta na pílula: essa caixa
          larga cobre um pedaço do topo, e sem isso a área vazia dela engoliria o
          clique do que estivesse embaixo.

          A largura aqui e a que a `MenuDoxa` passa ao componente são a mesma
          medida escrita em dois lugares — `w-28` de um lado, `max-w-28` do
          outro. Divergindo, a pílula não cabe no buraco e o cabeçalho ganha um
          degrau. De onde saiu o número está em `MenuDoxa.tsx`.

          A altura é 44: 32 do "+" mais 6 de recuo em cima e embaixo. Somada aos
          recuos verticais daqui, ela é a ALTURA DO CABEÇALHO — e é essa conta
          que o `Hero` repete como recuo de topo, já que a peça saiu do fluxo
          dele. Mexer numa exige mexer na outra. */}
      <div className="relative h-11 w-28 shrink-0">
        <div className="pointer-events-none absolute right-0 top-0 flex w-[21rem] max-w-[calc(100vw-2.5rem)] justify-end">
          <MenuDoxa aoAlternar={setMenuAberto} />
        </div>
      </div>
    </header>
  );
}
