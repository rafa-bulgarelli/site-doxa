import { useLayoutEffect, useState, type RefObject } from 'react';

interface BordaVivaProps {
  /** O cartão cuja borda o sinal percorre. */
  alvoRef: RefObject<HTMLElement>;
}

/** O mesmo raio do `rounded-3xl` do cartão, em pixels. */
const RAIO = 24;

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
  const r = Math.min(RAIO, largura / 2, altura / 2);
  const meio = altura / 2;
  if (topo) {
    return [
      `M 0 ${meio}`,
      `L 0 ${r}`,
      `A ${r} ${r} 0 0 1 ${r} 0`,
      `L ${largura - r} 0`,
      `A ${r} ${r} 0 0 1 ${largura} ${r}`,
      `L ${largura} ${meio}`,
    ].join(' ');
  }
  return [
    `M 0 ${meio}`,
    `L 0 ${altura - r}`,
    `A ${r} ${r} 0 0 0 ${r} ${altura}`,
    `L ${largura - r} ${altura}`,
    `A ${r} ${r} 0 0 0 ${largura} ${altura - r}`,
    `L ${largura} ${meio}`,
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
export function BordaViva({ alvoRef }: BordaVivaProps) {
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
             * As quatro camadas do rastro, da mais fraca para a cabeça — e a
             * ordem de pintura é o que mantém a cabeça nítida: desenhada por
             * último, ela fica por cima das caudas.
             *
             * A espessura cai junto com a opacidade. Era o que faltava para
             * isto ler como rastro: uma estrela cadente não tem só a cauda mais
             * apagada, tem a cauda mais estreita. Com quatro traços de mesma
             * espessura o que se via eram quatro riscos sobrepostos.
             *
             * `pathLength` normaliza o caminho para 1, e é o que torna o
             * desenho independente do tamanho: o traço passa a ser uma FRAÇÃO
             * do contorno, então os mesmos números servem para o cartão de uma
             * pergunta e para o do pagamento, que é bem mais alto.
             */}
            {(
              [
                ['borda-c4', 1, 'rgba(255,255,255,0.85)'],
                ['borda-c3', 1.3, 'rgba(255,255,255,0.9)'],
                ['borda-c2', 1.7, 'rgba(255,255,255,0.95)'],
                ['borda-c1', 2.2, '#FFFFFF'],
              ] as const
            ).map(([classe, largura, cor]) => (
              <path
                key={classe}
                d={d}
                pathLength={1}
                className={`cadente ${classe}`}
                stroke={cor}
                strokeWidth={largura}
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
