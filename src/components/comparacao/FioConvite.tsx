import { useLayoutEffect, useState, type RefObject } from 'react';

interface FioConviteProps {
  /** A caixa em que o fio é desenhado; as duas pontas são medidas dentro dela. */
  containerRef: RefObject<HTMLElement>;
  /** De onde o fio sai: o fim da frase, na coluna do argumento. */
  deRef: RefObject<HTMLElement>;
  /** Onde ele chega: a borda esquerda do cartão do pedido. */
  paraRef: RefObject<HTMLElement>;
}

/** Puxão mínimo nas alças da curva, para um salto curto ainda curvar. */
const CURVA_MINIMA = 50;

/**
 * Onde um elemento está dentro do container, em coordenadas de layout.
 *
 * Soma a cadeia de `offsetParent` em vez de ler `offsetLeft` uma vez só: as duas
 * pontas moram dentro de colunas posicionadas, e `offsetLeft` é relativo ao
 * ancestral posicionado MAIS PRÓXIMO — que é a coluna, não a grade. Medido de um
 * nível só, o fio nasceria deslocado pela distância entre as duas caixas.
 *
 * O container precisa estar nessa cadeia, ou seja, precisa ser posicionado. Se
 * não estiver, o laço sobe até o documento e devolve coordenadas de página.
 */
function posicao(elemento: HTMLElement, container: HTMLElement) {
  let x = 0;
  let y = 0;
  let no: HTMLElement | null = elemento;
  while (no != null && no !== container) {
    x += no.offsetLeft;
    y += no.offsetTop;
    no = no.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * O fio que liga a frase ao cartão — a mesma gramática do hero, em tinta.
 *
 * No hero, duas entradas (uma foto, uma voz) correm por um fio até o vídeo
 * pronto: é ali que a página diz o que a máquina faz. Aqui a última entrada que
 * falta é a PESSOA, e o fio diz isso sem precisar de mais uma frase — o
 * argumento sai do texto e termina dentro do formulário. É o mesmo desenho
 * fechando o mesmo argumento na outra ponta da página.
 *
 * Preto sobre creme, com auréola preta. O sinal branco do hero é luz num quarto
 * escuro; sobre papel, luz não se vê — o que se vê é tinta. Só a cor muda: o
 * traço, a cadência e o "sinal não faz ease" são os do hero, senão seriam dois
 * sinais diferentes contando a mesma história.
 *
 * Medido por `offsetLeft`/`offsetTop`, e não por `getBoundingClientRect` como no
 * hero. O painel claro ENTRA GIRADO: a caixa que o rect devolve para um elemento
 * rotacionado é o retângulo que o envolve, não o elemento, e o fio nasceria
 * torto e se endireitando durante a virada. Coordenadas de layout ignoram
 * `transform` — o fio é desenhado onde as coisas estão, não onde a animação as
 * está mostrando.
 *
 * Sem laço de animação: aqui nada é arrastável e nada flutua. Um `ResizeObserver`
 * nas duas pontas cobre tudo que pode mover as âncoras — o passo do formulário
 * trocando de altura, a fonte carregando, a janela mudando de tamanho.
 *
 * Ele desce quando as colunas empilham, e sobe atrás do conteúdo delas: o SVG é
 * irmão ESTÁTICO das duas colunas posicionadas, então elas pintam por cima. No
 * telefone isso importa mais do que no desktop — o caminho de descida passa por
 * trás da prova rotativa, e é passando por trás que ele lê como cabo em vez de
 * risco em cima do texto.
 */
export function FioConvite({ containerRef, deRef, paraRef }: FioConviteProps) {
  const [caixa, setCaixa] = useState({ largura: 0, altura: 0 });
  const [traco, setTraco] = useState('');

  useLayoutEffect(() => {
    const container = containerRef.current;
    const de = deRef.current;
    const para = paraRef.current;
    if (!container || !de || !para) return;

    const medir = () => {
      setCaixa({ largura: container.offsetWidth, altura: container.offsetHeight });

      /*
       * Do meio da frase ao MEIO do cartão, e as duas pontas centradas nos
       * próprios objetos é o que faz o fio ler como ligação entre eles.
       *
       * Chegou a entrar mais abaixo, para a curva não passar por trás do custo
       * riscado. A copy encurtou desde então e o bloco subiu: o desvio deixou de
       * ser necessário e virou um fio entrando torto num cartão. Se o
       * cruzamento voltar, o conserto é mexer no LAYOUT — descer a frase ou
       * subir o cartão —, não em desalinhar a chegada.
       */
      const origem = posicao(de, container);
      const destino = posicao(para, container);

      /*
       * ─── DUAS GEOMETRIAS, E QUEM ESCOLHE É O LAYOUT ────────────────────────
       *
       * O fio só sabia sair pela DIREITA da frase e entrar pela ESQUERDA do
       * cartão — a única geometria que existe quando as duas colunas estão lado
       * a lado. Nas telas em que elas empilham, o componente simplesmente não
       * era desenhado, e o dono pediu a ligação lá também.
       *
       * O teste não é a largura da janela: é onde as duas pontas realmente
       * caíram. Se o cartão começa ABAIXO do fim da frase, as colunas
       * empilharam, e o fio desce — do pé da frase ao topo do cartão, pelo
       * meio de cada um. Um `matchMedia` aqui seria uma segunda opinião sobre o
       * que o `grid` já decidiu, e as duas divergiriam na largura exata da
       * virada.
       *
       * As alças da curva viram junto com o eixo: na horizontal elas empurram em
       * x, na vertical em y. É a mesma curva, girada — e é por isso que o
       * `CURVA_MINIMA` serve para as duas sem número novo.
       */
      const empilhado = destino.y >= origem.y + de.offsetHeight;

      if (empilhado) {
        const x1 = origem.x + de.offsetWidth / 2;
        const y1 = origem.y + de.offsetHeight;
        const x2 = destino.x + para.offsetWidth / 2;
        const y2 = destino.y;
        if (y2 <= y1) {
          setTraco('');
          return;
        }
        const alca = Math.max((y2 - y1) * 0.5, CURVA_MINIMA);
        setTraco(`M ${x1} ${y1} C ${x1} ${y1 + alca}, ${x2} ${y2 - alca}, ${x2} ${y2}`);
        return;
      }

      const x1 = origem.x + de.offsetWidth;
      const y1 = origem.y + de.offsetHeight / 2;
      const x2 = destino.x;
      const y2 = destino.y + para.offsetHeight / 2;

      // Lado a lado, uma ponta tem de estar à direita da outra. Medida
      // invertida aqui é layout em trânsito — melhor nenhum fio do que um laço.
      if (x2 <= x1) {
        setTraco('');
        return;
      }

      const alca = Math.max((x2 - x1) * 0.5, CURVA_MINIMA);
      setTraco(`M ${x1} ${y1} C ${x1 + alca} ${y1}, ${x2 - alca} ${y2}, ${x2} ${y2}`);
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(container);
    observador.observe(de);
    observador.observe(para);
    return () => observador.disconnect();
  }, [containerRef, deRef, paraRef]);

  if (!traco || !caixa.largura) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${caixa.largura} ${caixa.altura}`}
      fill="none"
      aria-hidden="true"
    >
      {/* O fio em repouso, que se desenha da frase até o cartão. */}
      <path
        d={traco}
        stroke="rgba(11,11,11,0.2)"
        strokeWidth={2}
        style={{ animation: 'connector-in 1.2s 0.9s ease-out both' }}
      />

      {/*
       * O sinal: um traço com auréola, e é o mesmo do hero em tinta.
       *
       * Divide o ciclo de sete segundos com a borda do cartão — este trecho
       * ocupa o primeiro quarto, e a borda só começa depois que ele termina. É
       * o que garante um par de linhas por vez, sem um temporizador vigiando o
       * outro.
       */}
      <path
        d={traco}
        pathLength={1}
        className="pulso pulso-fio"
        stroke="rgba(11,11,11,0.92)"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
    </svg>
  );
}
