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
  /** Se já saiu do topo. É o que acende o vidro. */
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    let ultimo = window.scrollY;
    let quadro = 0;

    const avaliar = () => {
      quadro = 0;
      const y = window.scrollY;
      setRolou(y > TOPO);
      // O vidro acompanha a rolagem mesmo com o painel aberto; só a fuga é
      // travada. Daí a saída ficar DEPOIS de `setRolou` e não antes.
      if (travado) return;
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

    if (travado) setVisivel(true);
    avaliar();

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

  return { visivel, rolou };
}

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { visivel, rolou } = useVisivel(menuAberto);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 py-5 transition-transform duration-300 ease-out motion-reduce:transition-none md:px-10 md:py-7 ${
        visivel ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* ─── O VIDRO ────────────────────────────────────────────────────────
          A faixa INTEIRA do cabeçalho, sempre. Quatro camadas.

          Ele já foi mascarado, dissolvendo na metade da altura para não cortar
          o hero com uma tarja — e por isso não cobria a faixa toda. O dono
          pediu a seção inteira, então a máscara saiu e o corte reto ganhou o
          único remédio que não é esconder: uma linha de luz no pé (a quarta
          camada), que transforma a borda em aresta de vidro em vez de fim
          abrupto de retângulo.

          1. O BORRÃO com saturação. `backdrop-blur` sozinho deixa o que passa
             por baixo cinzento, porque desfocar mistura pixels vizinhos e puxa
             tudo para a média. Devolver saturação é o que faz o vídeo atrás do
             vidro continuar parecendo vídeo em vez de fumaça.

          2. O TINTO BASE, a 25%. É o vidro EXISTINDO no topo da página, onde
             não há nada rolando por baixo: sobre o preto do hero ele não
             escurece nada (preto sobre preto), e o que se vê é o borrão comendo
             o pontilhado e a luz da camada 3. Presente, e sem virar barra.

          3. O TINTO DE ROLAGEM, que soma até 55%. Aqui não é estética, é
             legibilidade, e o número saiu de MEDIÇÃO. Sobre o painel creme da
             comparação, este tinto é a única coisa entre o logo BRANCO e um
             fundo quase branco. Lido no Chrome, o pixel atrás do logo: 40% dá
             2,97:1 de contraste (ilegível), 50% dá 4,00 (ainda abaixo do
             mínimo), 55% passa.

             Passa com folga MAIOR do que a que este comentário já registrou.
             Ele dizia 4,66, e dizia a verdade da época: a máscara desbotava o
             vidro a partir de 45% da altura, e 45% de 100px é exatamente a
             linha do logo — a medição atravessava um fade parcial. Sem máscara,
             o mesmo 55% lê 6,02:1. O tinto não mudou; o que mudou foi ele
             chegar inteiro onde o logo está.

             As duas camadas se COMPÕEM, não se substituem: 25% por baixo e 40%
             por cima dão 1 − 0,75 × 0,60 = 0,55. É por isso que o segundo valor
             é 40 e não 55.

          4. AS DUAS LUZES. Uma lâmina de branco a 6% descendo do topo — a borda
             de vidro pegando luz — e uma linha de 1px no pé, que só acende com
             a rolagem. No topo da página ela não existe de propósito: é ela que
             viraria a tarja atravessando a primeira dobra. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/25 backdrop-blur-lg backdrop-saturate-150" />
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out ${
            rolou ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" />
        {/* Gradiente e não `border-b`: a linha morre nas pontas em vez de bater
            nas bordas da tela, que é o que a faz parecer luz e não moldura. */}
        <div
          className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent transition-opacity duration-500 ease-out ${
            rolou ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* ─── A MESMA COLUNA DAS SEÇÕES ──────────────────────────────────────
          O logo e o menu param onde o conteúdo das seções para, e não onde a
          janela acaba.

          O recuo sozinho não fazia isso. `px-10` cola as duas pontas na borda
          da tela, enquanto toda seção do site põe o conteúdo numa caixa
          `max-w-screen-2xl` CENTRADA dentro do mesmo recuo. Até 1616 px de
          janela as duas contas dão o mesmo número — 1536 + 80 de recuo é
          exatamente onde a caixa para de crescer — e por isso o desalinho não
          aparece num monitor comum. Acima disso ele abre: medido no Chrome, o
          cabeçalho ficava 152 px fora a 1920 e 472 px fora a 2560.

          O VIDRO fica FORA desta caixa, de propósito. Ele é a faixa, e faixa
          vai de borda a borda; capado junto com o conteúdo, viraria um cartão
          flutuando no meio do topo. */}
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between">
        <a href="#" className="shrink-0">
          <img src={wordmarkUrl} alt="Doxa" className="h-6 w-auto md:h-7" width={364} height={96} />
        </a>

        {/* ─── O BURACO E A PEÇA ────────────────────────────────────────────
            Duas caixas para uma pílula, e as duas são necessárias.

            A de fora é o BURACO: ela tem o tamanho da pílula FECHADA e é a
            única coisa que existe no fluxo do cabeçalho. É ela que reserva o
            espaço.

            A de dentro está fora do fluxo, ancorada à direita, e é mais larga
            que o buraco de propósito — é o espaço para onde a pílula cresce
            quando abre. Crescer no fluxo mexeria no cabeçalho a cada passada de
            cursor, e um cabeçalho que se reorganiza sozinho no hover é um
            cabeçalho quebrado.

            `pointer-events-none` nela, e `auto` de volta na pílula: essa caixa
            larga cobre um pedaço do topo, e sem isso a área vazia dela
            engoliria o clique do que estivesse embaixo.

            A largura aqui e a que a `MenuDoxa` passa ao componente são a mesma
            medida escrita em dois lugares — `w-28` de um lado, `max-w-28` do
            outro. Divergindo, a pílula não cabe no buraco e o cabeçalho ganha
            um degrau. De onde saiu o número está em `MenuDoxa.tsx`.

            A altura é 44: 32 do "+" mais 6 de recuo em cima e embaixo. Somada
            aos recuos verticais do `<header>`, ela é a ALTURA DO CABEÇALHO — e
            é essa conta que o `Hero` repete como recuo de topo, já que a peça
            saiu do fluxo dele. Mexer numa exige mexer na outra. */}
        <div className="relative h-11 w-28 shrink-0">
          <div className="pointer-events-none absolute right-0 top-0 flex w-[21rem] max-w-[calc(100vw-2.5rem)] justify-end">
            <MenuDoxa aoAlternar={setMenuAberto} />
          </div>
        </div>
      </div>
    </header>
  );
}
