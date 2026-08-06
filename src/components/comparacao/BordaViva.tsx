import { useLayoutEffect, useState, type RefObject } from 'react';

interface BordaVivaProps {
  /** O cartão cuja borda o sinal percorre. */
  alvoRef: RefObject<HTMLElement>;
  /** O visitante parou o sinal. Congela onde está, em vez de sumir. */
  pausado: boolean;
}

/** O mesmo raio do `rounded-3xl` do cartão, em pixels. */
const RAIO = 24;

/** A espessura do sinal, em pixels. */
const TRACO = 3;

/**
 * Quanto o contorno entra para dentro da caixa, em pixels.
 *
 * Metade do traço, e é o que faz o sinal aparecer inteiro. O cartão é
 * `overflow-hidden`: um caminho desenhado na borda exata tem metade da
 * espessura pendurada para FORA dela, e essa metade é recortada. O que sobrava
 * era um traço com o dobro da espessura declarada de um lado só, a ponta
 * redonda serrada ao meio pelo recorte e o brilho decepado junto — engordar o
 * traço só engordava a parte invisível. Recuado, o sinal fica todo dentro do
 * corte, com a ponta redonda inteira e a auréola livre para sangrar para o
 * miolo, que é onde ela ilumina alguma coisa.
 */
const RECUO = TRACO / 2;

/**
 * Metade do contorno do cartão, do meio da borda esquerda ao meio da direita.
 *
 * `topo` sobe pela esquerda, cruza o topo e desce pela direita; o outro faz o
 * caminho de baixo. Escritos como dois caminhos, e não como um retângulo só,
 * porque é isso que permite os dois sinais partirem do MESMO ponto em direções
 * opostas — num `<rect>` os dois dariam a volta no mesmo sentido, um atrás do
 * outro, e a bifurcação viraria uma fila.
 *
 * Os cantos são arcos de um quarto de volta com o raio do `rounded-3xl`. Um
 * contorno de cantos retos sobre uma caixa arredondada corta os quatro cantos
 * pelo lado de fora, e é a única coisa que denuncia um traçado desenhado à mão
 * por cima de um elemento.
 */
function meiaVolta(largura: number, altura: number, topo: boolean) {
  // As quatro paredes, já recuadas para dentro do corte do cartão.
  const esq = RECUO;
  const dir = largura - RECUO;
  const cima = RECUO;
  const baixo = altura - RECUO;
  const meio = altura / 2;
  // O raio encolhe junto com o recuo, senão o arco deixa de ser concêntrico com
  // o canto do cartão e o contorno abre uma fresta em cada esquina.
  const r = Math.min(RAIO - RECUO, (dir - esq) / 2, (baixo - cima) / 2);
  if (topo) {
    return [
      `M ${esq} ${meio}`,
      `L ${esq} ${cima + r}`,
      `A ${r} ${r} 0 0 1 ${esq + r} ${cima}`,
      `L ${dir - r} ${cima}`,
      `A ${r} ${r} 0 0 1 ${dir} ${cima + r}`,
      `L ${dir} ${meio}`,
    ].join(' ');
  }
  return [
    `M ${esq} ${meio}`,
    `L ${esq} ${baixo - r}`,
    `A ${r} ${r} 0 0 0 ${esq + r} ${baixo}`,
    `L ${dir - r} ${baixo}`,
    `A ${r} ${r} 0 0 0 ${dir} ${baixo - r}`,
    `L ${dir} ${meio}`,
  ].join(' ');
}

/**
 * O sinal que chega pelo fio, se abre em dois e contorna o cartão.
 *
 * É a continuação de `FioConvite`, não um efeito à parte: o fio vem do
 * argumento e morre na borda esquerda do cartão, e o que acontecia com o sinal
 * depois disso era nada. Aqui ele se divide no ponto exato em que chega, os dois
 * ramos correm o contorno em sentidos opostos, se reencontram no meio da borda
 * direita e apagam juntos. A pessoa não precisa reparar em nada disso — o que
 * ela vê é que o cartão está LIGADO na frase, e que a energia veio de lá.
 *
 * Desenhado em cima do cartão e por baixo do conteúdo, com o brilho sangrando
 * para dentro: é isso que ilumina o miolo sem lavar o texto por cima dele.
 *
 * Medido, e não desenhado em porcentagens: o cartão muda de altura a cada passo
 * do formulário (o passo do pagamento é bem mais alto que uma pergunta), e um
 * contorno em `%` acompanharia a caixa esticando os cantos — o raio deixaria de
 * ser um raio e viraria uma elipse.
 */
export function BordaViva({ alvoRef, pausado }: BordaVivaProps) {
  const [caixa, setCaixa] = useState({ largura: 0, altura: 0 });

  useLayoutEffect(() => {
    const alvo = alvoRef.current;
    if (!alvo) return;

    const medir = () => setCaixa({ largura: alvo.offsetWidth, altura: alvo.offsetHeight });
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [alvoRef]);

  if (!caixa.largura || !caixa.altura) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${caixa.largura} ${caixa.altura}`}
      fill="none"
      aria-hidden="true"
    >
      {[true, false].map((topo) => {
        const d = meiaVolta(caixa.largura, caixa.altura, topo);
        return (
          <g key={topo ? 'topo' : 'base'}>
            {/*
             * O contorno em repouso, e ele é a correção de um defeito real: sem
             * uma borda desenhada o tempo todo, o único traço no perímetro era o
             * pulso — e quando ele saía do caminho, o cartão ficava sem nada ali.
             * A caixa não mudava de tamanho, mas o OLHO lê um contorno que some
             * como a caixa se mexendo. Um fio fraco permanente é a moldura sobre
             * a qual o sinal corre.
             */}
            <path d={d} stroke="rgba(255,255,255,0.13)" strokeWidth={1} />

            {/*
             * O sinal, em um traço só com auréola larga — o vocabulário do
             * hero. As quatro camadas de rastro foram tentadas e cortadas pelo
             * dono: empilhadas, liam como riscos sobrepostos em vez de uma
             * coisa em movimento.
             */}
            <path
              d={d}
              pathLength={1}
              className="pulso pulso-borda"
              stroke="#FFFFFF"
              strokeWidth={TRACO}
              strokeLinecap="round"
              style={{ animationPlayState: pausado ? 'paused' : 'running' }}
            />
          </g>
        );
      })}
    </svg>
  );
}
