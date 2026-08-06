import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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

/** Velocidade da deriva no celular, em pixels por segundo. */
const DERIVA = 14;

interface ArrastoInfinitoProps {
  children: ReactNode;
  /** Classes da grade interna — quem chama decide colunas, vãos e recuos. */
  className?: string;
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
 *     competes [with scroll]". Abaixo de `lg` o campo não se arrasta; ele deriva
 *     sozinho, devagar, para não ler como uma coisa morta.
 *
 * E as dependências: nenhuma nova. A referência importa de `motion/react`, que é
 * o pacote NOVO da Motion — instalá-lo poria um segundo motor de animação no
 * bundle ao lado do `framer-motion` que o site inteiro já usa. Os quatro
 * utilitários de que ela precisa (`wrap`, `animate`, `useMotionValue`, `motion`)
 * existem no que já está aqui. `class-variance-authority` e `cn` também ficaram
 * de fora: eram três pacotes para escolher entre três strings.
 */
export function ArrastoInfinito({ children, className = '' }: ArrastoInfinitoProps) {
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
   * A deriva de quem não pode arrastar.
   *
   * No telefone o campo não aceita arrasto — ele roubaria a rolagem —, e um
   * mural parado de palavras é indistinguível de uma imagem de fundo. Andando
   * devagar para a esquerda, ele diz que está vivo sem pedir nada de ninguém.
   * `linear` e sem repetição de mola: é deriva, não gesto.
   */
  useEffect(() => {
    if (desktop || parado || meia.x === 0) return;
    const controle = animate(x, x.get() - meia.x, {
      duration: meia.x / DERIVA,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controle.stop();
  }, [desktop, parado, x, meia]);

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
