import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { animate, motion, useMotionValue, useReducedMotion, wrap } from 'framer-motion';
import { useIsDesktop } from '../../hooks/useIsDesktop';

/**
 * Quantas cópias do mosaico existem, e por que exatamente quatro.
 *
 * Duas na horizontal e duas na vertical. O truque do infinito é só isto: o
 * conteúdo é desenhado duas vezes em cada eixo, e quando o arrasto passa da
 * METADE do bloco inteiro, a posição volta ao zero. Como o que está no zero é
 * idêntico ao que estava na metade, não há emenda para ver — o campo nunca
 * acaba porque ele nunca começou.
 *
 * Menos de duas cópias por eixo e a volta ao zero seria um salto visível. Mais
 * de duas é desenho jogado fora: nenhuma tela mostra mais do que uma cópia e
 * meia de cada vez.
 */
const COPIAS = 4;

/** Velocidade da deriva, em pixels por segundo. Lenta: é respiração, não viagem. */
const DERIVA = 14;

/**
 * Quanto o eixo vertical anda em relação ao horizontal.
 *
 * Menor que um, e nunca igual: com os dois na mesma velocidade a deriva é uma
 * reta de 45 graus, e uma reta o olho decora em dois segundos. Em proporções
 * que não se dividem, a trajetória leva muito tempo para repetir o mesmo ponto.
 */
const DIAGONAL = 0.38;

/**
 * Quanto o impulso do arremesso leva para se gastar, em milissegundos.
 *
 * Casado com o `dragTransition` lá embaixo — é o tempo que o campo leva
 * desacelerando depois que a mão solta. Religar a deriva antes disso mataria o
 * arremesso no meio.
 */
const MOMENTO = 900;

interface ArrastoInfinitoProps {
  children: ReactNode;
  /** Classes da grade interna — quem chama decide colunas, vãos e recuos. */
  className?: string;
  /**
   * Se a deriva pode correr.
   *
   * Existe porque o rodapé virou `fixed`: ele está montado e "na tela" desde o
   * primeiro pixel da página, escondido atrás dela. Sem esta chave, o campo
   * estaria derivando — e, com vídeo dentro, tocando — durante a rolagem
   * inteira, atrás de uma parede preta que ninguém atravessa. Quem sabe se o
   * rodapé foi revelado é quem o desenha, não este componente.
   */
  ativo?: boolean;
}

/**
 * O campo que se arrasta e não acaba.
 *
 * ─── O QUE FOI MUDADO DA REFERÊNCIA, E POR QUÊ ───────────────────────────────
 *
 * O componente que o dono trouxe é feito para ser uma PÁGINA inteira, e três
 * coisas dele machucariam esta, que é uma página de seis seções onde este campo
 * é a última:
 *
 *  1. Ele instalava um `wheel` no `window` e movia a grade a cada evento de
 *     roda, em qualquer lugar do documento. Aqui isso roubaria a rolagem da
 *     página inteira assim que o rodapé montasse — e, como o rodapé é o fim, não
 *     haveria como sair dele. O sequestro saiu por completo: a roda rola a
 *     página, e o campo só responde ao arrasto.
 *
 *  2. Ele ocupava `h-dvh` com `overflow-hidden`. Uma tela cheia que prende, no
 *     exato ponto em que a página quer que a pessoa preencha o formulário. Aqui
 *     a altura é dada por quem chama, e a rolagem nunca é tocada.
 *
 *  3. Arrasto nos dois eixos no telefone briga com a rolagem — e este
 *     repositório já decidiu isso uma vez, no hero: "drag on a touch screen
 *     competes [with scroll]". Abaixo de `lg` o campo não se arrasta.
 *
 * E uma coisa foi ACRESCENTADA, a pedido do dono: o campo anda sozinho. Na
 * referência ele fica imóvel até alguém puxar, e um mural imóvel de palavras não
 * se distingue de um fundo — ninguém tenta arrastar um fundo. A deriva é o que
 * anuncia que ali existe um objeto, e no telefone, onde não há arrasto, ela é a
 * única coisa que existe.
 *
 * E as dependências: nenhuma nova. A referência importa de `motion/react`, que é
 * o pacote NOVO da Motion — instalá-lo poria um segundo motor de animação no
 * bundle ao lado do `framer-motion` que o site inteiro já usa. Os quatro
 * utilitários de que ela precisa (`wrap`, `animate`, `useMotionValue`, `motion`)
 * existem no que já está aqui. `class-variance-authority` e `cn` também ficaram
 * de fora: eram três pacotes para escolher entre três strings.
 */
export function ArrastoInfinito({ children, className = '', ativo = true }: ArrastoInfinitoProps) {
  const gradeRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const desktop = useIsDesktop();
  const parado = useReducedMotion() === true;

  /** Metade do bloco, que é onde a volta acontece. */
  const [meia, setMeia] = useState({ x: 0, y: 0 });

  /*
   * A medida é OBSERVADA, e não tirada uma vez.
   *
   * A referência mede com um `getBoundingClientRect()` dentro de um `useEffect`
   * que roda na montagem e nunca mais. Aqui isso quebraria de duas maneiras: a
   * fonte serifada do mosaico chega depois da primeira pintura e muda a largura
   * de cada ladrilho, e a janela redimensiona. Com a metade velha, a volta
   * passa a acontecer no lugar errado — e o que se vê é o campo SALTANDO no
   * meio do arrasto, que é justamente o defeito que o infinito existe para não
   * ter.
   */
  useLayoutEffect(() => {
    const grade = gradeRef.current;
    if (grade == null) return;

    const medir = () => setMeia({ x: grade.offsetWidth / 2, y: grade.offsetHeight / 2 });
    const olho = new ResizeObserver(medir);
    olho.observe(grade);
    medir();
    return () => olho.disconnect();
  }, []);

  /*
   * A volta.
   *
   * `wrap` dobra o valor de volta para dentro da faixa `[-metade, 0]` a cada
   * mudança. Durante o arrasto o framer continua escrevendo a posição crua
   * (origem mais deslocamento) e este ouvinte a dobra logo em seguida — como
   * `-metade` e `0` desenham exatamente a mesma coisa, a dobra é invisível e o
   * arrasto segue contínuo para quem está puxando.
   */
  useEffect(() => {
    if (meia.x === 0 || meia.y === 0) return;
    const soltaX = x.on('change', (valor) => x.set(wrap(-meia.x, 0, valor)));
    const soltaY = y.on('change', (valor) => y.set(wrap(-meia.y, 0, valor)));
    return () => {
      soltaX();
      soltaY();
    };
  }, [x, y, meia]);

  /*
   * ─── A DERIVA, E COMO ELA CONVIVE COM O ARRASTO ────────────────────────────
   *
   * O campo anda sozinho, devagar e na diagonal. Parado, um mural de palavras é
   * indistinguível de uma imagem de fundo — e ninguém tenta arrastar um fundo.
   * O movimento é o que anuncia que aquilo é um objeto, e é mais honesto do que
   * um rótulo escrito "arraste".
   *
   * A dificuldade é que a deriva e o arrasto escrevem no MESMO valor. Rodando
   * os dois ao mesmo tempo, cada quadro tem dois donos e o campo treme. Então
   * eles se revezam: a mão encosta, a deriva para; a mão solta, o impulso do
   * arremesso corre sozinho, e só quando ele acaba a deriva volta a assumir.
   *
   * O relógio depois de soltar existe por causa do impulso. Religar a deriva no
   * `onDragEnd` mataria o arremesso no berço — o `dragTransition` ainda está
   * desacelerando o campo naquele instante, e uma animação nova sobre o mesmo
   * valor a substitui. `MOMENTO` é o tempo que esse impulso leva para se gastar.
   *
   * Em `x` e `y` com períodos diferentes de propósito: iguais, o campo desliza
   * numa reta de 45 graus e o olho pega o padrão. Diferentes, a trajetória
   * demora a se repetir e a deriva parece só uma coisa flutuando.
   */
  const derivaX = useRef<ReturnType<typeof animate> | null>(null);
  const derivaY = useRef<ReturnType<typeof animate> | null>(null);
  const religar = useRef<number | undefined>(undefined);

  const pararDeriva = useCallback(() => {
    window.clearTimeout(religar.current);
    derivaX.current?.stop();
    derivaY.current?.stop();
  }, []);

  const soltarDeriva = useCallback(() => {
    pararDeriva();
    if (!ativo || parado || meia.x === 0 || meia.y === 0) return;

    /* `repeat: loop` volta ao valor inicial a cada volta, e é justamente o que
       se quer: o fim do percurso é uma metade adiante, que desenha exatamente a
       mesma coisa que o começo. O salto de volta existe e é invisível. */
    derivaX.current = animate(x, x.get() - meia.x, {
      duration: meia.x / DERIVA,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
    derivaY.current = animate(y, y.get() - meia.y, {
      duration: meia.y / (DERIVA * DIAGONAL),
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
  }, [pararDeriva, ativo, parado, x, y, meia]);

  useEffect(() => {
    soltarDeriva();
    return pararDeriva;
  }, [soltarDeriva, pararDeriva]);

  return (
    <motion.div
      ref={gradeRef}
      /* `w-fit h-fit` porque o bloco tem de ter o tamanho do CONTEÚDO, e não o
         do pai: é a largura dele que dá a metade onde a volta acontece. Numa
         caixa esticada pelo pai, a conta do infinito seria feita sobre a tela e
         não sobre o mosaico. */
      className={`grid h-fit w-fit grid-cols-2 will-change-transform ${
        desktop ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      style={{ x, y }}
      /* `parado` NÃO entra aqui. `prefers-reduced-motion` é um pedido para a
         página parar de se mexer sozinha, não para tirar da pessoa uma coisa
         que só acontece quando ela puxa. O que a preferência desliga é a
         deriva, lá em cima — o movimento que acontece sem ninguém pedir. */
      drag={desktop}
      onDragStart={pararDeriva}
      onDragEnd={() => {
        window.clearTimeout(religar.current);
        religar.current = window.setTimeout(soltarDeriva, MOMENTO);
      }}
      dragMomentum
      /* Atrito longo e força baixa: o campo continua indo depois que a mão
         solta e vai parando, como um objeto pesado deslizando. `bounce` zerado
         porque não há parede nenhuma para bater — o campo é infinito, e uma
         volta elástica anunciaria um limite que não existe. */
      dragTransition={{ power: 0.28, timeConstant: 220, bounceStiffness: 0, restDelta: 0 }}
    >
      {/* As quatro cópias. As classes de grade (colunas, vãos, recuos) moram
          AQUI e não no bloco de fora: é cada cópia que é um mosaico, e o bloco
          de fora é só o 2×2 que as arruma. */}
      {Array.from({ length: COPIAS }).map((_, indice) => (
        <div key={indice} className={className}>
          {children}
        </div>
      ))}
    </motion.div>
  );
}
