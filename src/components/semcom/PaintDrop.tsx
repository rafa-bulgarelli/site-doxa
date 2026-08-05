import { useEffect, useRef } from 'react';
import { useAnimationFrame, useReducedMotion, type MotionValue } from 'framer-motion';

const TAU = Math.PI * 2;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Mapeia `p` do intervalo [a, b] para [0, 1]. */
function range(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a));
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rampa 0→1 com as duas pontas amaciadas. */
const suave = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * A cor do papel — o destino de tudo que acontece aqui.
 *
 * A camada que vira a seção do avesso usa `mix-blend-mode: difference`, então o
 * que ela pinta é |fundo − COR| pixel a pixel. Com branco puro seria um invert
 * matemático, e o invert do osso da marca (#DEDBC8) é #212437: um azul-marinho.
 * Puxando a cor para um branco quente, o mesmo osso cai em (22,22,32) — preto,
 * para qualquer olho — e o preto do fundo sobe exatamente para este valor.
 */
export const PAPEL = '#F4F1E8';

/**
 * Pontos do contorno.
 *
 * O corpo não é um `<circle>` com `border-radius` animado: é um caminho fechado
 * redesenhado a cada frame a partir de um raio modulado por senos. É o que
 * permite que ele seja círculo, oval, bolha torta e gota sem trocar de forma —
 * a forma é uma função contínua do tempo, e não uma lista de estados.
 *
 * Quarenta e quatro pontos: abaixo de trinta a borda deixa de parecer líquida
 * nos raios grandes do fim, acima de sessenta paga-se por precisão que a tela
 * não mostra.
 */
const PONTOS = 44;

/** Gotas que saltam no impacto. Sete: ímpar, para o respingo não ficar simétrico. */
const GOTAS = 7;

/**
 * O raio de repouso do corpo, em fração do menor lado da tela.
 *
 * Grande. A primeira versão usava 0,075 e o resultado foi a crítica do dono: uma
 * bolinha no meio de uma tela preta é um vazio com um ponto dentro, não uma cena.
 * Em 0,15 o corpo tem quase um terço da altura da tela e a travessia passa a ter
 * um protagonista do tamanho da coisa que ela está anunciando.
 */
const RAIO = 0.15;

/**
 * A paleta, como um giro de matiz em vez de uma lista de cores.
 *
 * O dono pediu vermelho, verde, azul, ciano, magenta e roxo com passagem suave
 * entre eles. Uma lista de paradas exigiria interpolar entre cores que não são
 * vizinhas no círculo — é assim que se produz cinza no meio do caminho. Girando
 * o matiz, toda cor intermediária é uma cor da paleta, e nunca há um corte.
 *
 * ATENÇÃO — isto é a única cor com matiz do site. O `tailwind.config.js` diz que
 * a Doxa é estritamente monocromática e que cor só entra por asset. Esta seção
 * é a exceção pedida pelo dono, e vale saber que ela é uma exceção: se o resto
 * do site ganhar cor, esta transição deixa de ser um evento e vira decoração.
 */
const MATIZ_INICIO = 288;
const MATIZ_GIRO = 430;

/** O matiz do papel, para onde a cor se esvai no fim. */
const MATIZ_PAPEL = 45;

/**
 * As falas da travessia, e o ponto em que cada uma entra.
 *
 * PENDENTE-DONO: texto meu. A estrutura é que importa e é ela que amarra na
 * seção: duas coisas e o que existe entre elas — porque o que vem logo depois da
 * poça são exatamente dois caminhos desenhados lado a lado, e a terceira frase
 * faz a pergunta que as nove etapas respondem.
 *
 * Elas se ACUMULAM, e essa é a resposta para a tela vazia. Trocando uma pela
 * outra no mesmo lugar, há sempre uma linha de texto em cento e vinte alturas de
 * tela de rolagem — que foi exatamente a crítica do dono. Empilhando, a tela se
 * enche à medida que se rola, o bloco cresce junto com a gota, e no fim existe um
 * parágrafo inteiro para a tinta cobrir.
 *
 * A primeira tem entrada NEGATIVA, e é de propósito: a janela dela fecha em
 * zero, então no primeiro pixel da seção ela já está inteira na tela, junto com
 * a gota. As duas abrem a cena — o dono pediu exatamente isso, e um `de: 0`
 * deixaria a frase começando a aparecer quando ela já devia estar lida.
 */
const FALAS = [
  { texto: 'Uma ideia sua.', de: -0.08 },
  { texto: 'Um vídeo publicado.', de: 0.3 },
  { texto: 'Entre as duas, o caminho.', de: 0.58 },
] as const;

/** Onde as falas saem: sob a poça, que é quem apaga a história para contar a próxima. */
const FALAS_DE = 0.84;
const FALAS_ATE = 0.91;

interface Medida {
  w: number;
  h: number;
}

/**
 * Um contorno fechado, macio, a partir de pontos.
 *
 * Catmull-Rom convertido para cúbicas de Bézier: cada ponto vira um nó por onde
 * a curva passa, com as alças tiradas da direção dos vizinhos. É o que dá a
 * borda de líquido — uma polilinha nos mesmos pontos teria quarenta e quatro
 * quinas, e quina nenhuma é molhada.
 */
function contorno(pontos: number[][]) {
  const n = pontos.length;
  let d = `M ${pontos[0][0].toFixed(1)} ${pontos[0][1].toFixed(1)}`;

  for (let i = 0; i < n; i += 1) {
    const p0 = pontos[(i - 1 + n) % n];
    const p1 = pontos[i];
    const p2 = pontos[(i + 1) % n];
    const p3 = pontos[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  return `${d} Z`;
}

/**
 * O corpo, num instante.
 *
 * `torto` é quanto o raio ondula — três senos de frequências que não são
 * múltiplas entre si, para que o contorno não feche num padrão reconhecível.
 *
 * `bico` faz a gota, e faz nos dois eixos: estica o topo para cima E aperta a
 * largura dele. Só esticar não produz gota nenhuma — produz uma cápsula, porque
 * o alongamento vira um único vértice no ápice e a spline o arredonda. O
 * afunilamento é que dá a ponta, porque está distribuído por uma dúzia de
 * pontos, e é justamente isso que uma curva macia sabe desenhar.
 */
function corpo(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  torto: number,
  bico: number,
  fase: number,
) {
  const pontos: number[][] = [];

  for (let i = 0; i < PONTOS; i += 1) {
    const a = (i / PONTOS) * TAU;
    const onda =
      0.55 * Math.sin(3 * a + fase * 1.7) +
      0.3 * Math.sin(5 * a - fase * 1.1) +
      0.15 * Math.sin(7 * a + fase * 0.63);
    // `-sin(a)` é 1 no topo do círculo e 0 nos lados; ao quadrado, o efeito
    // morre antes de chegar na cintura da gota.
    const topo = Math.max(0, -Math.sin(a)) ** 2;
    const k = 1 + torto * onda;
    const estica = bico * topo;
    pontos.push([
      cx + Math.cos(a) * rx * k * (1 - 0.74 * estica),
      cy + Math.sin(a) * ry * k * (1 + 1.15 * estica),
    ]);
  }

  return contorno(pontos);
}

interface PaintDropProps {
  /** O progresso da seção inteira, 0 a 1. */
  progress: MotionValue<number>;
  /** Que fatia da seção pertence à travessia — o resto é o conteúdo. */
  until: number;
}

/**
 * A travessia: uma gota de tinta que atravessa a tela e vira o fundo claro.
 *
 * O roteiro é do dono, e a leitura dele é que a troca de cor da página é um
 * acontecimento, não um corte. Um corpo branco abre a cena com a primeira frase,
 * anda pela tela num caminho que não se repete, ganha cor, se alonga em gota,
 * cai, espirra, e a poça cresce até ser o papel em que a seção está escrita —
 * apagando, no caminho, o parágrafo que se escreveu enquanto ela andava.
 *
 * Duas camadas fazem a virada. A de baixo é o papel em `difference`, que inverte
 * a seção por trás da tinta; a de cima é a tinta. Enquanto a poça não cobre a
 * tela, a de baixo está apagada e não existe; quando cobre, ela acende escondida
 * atrás da tinta, e a tinta se apaga em cima de uma cor igual à dela. O visitante
 * nunca vê a troca — vê a poça, e depois a seção clara.
 *
 * Imperativo, como o resto da pasta: são quarenta e quatro pontos, sete gotas,
 * um brilho e dois gradientes reescritos a cada frame, e passar isso por estado
 * do React redesenharia a árvore sessenta vezes por segundo à toa.
 */
export function PaintDrop({ progress, until }: PaintDropProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const papelRef = useRef<HTMLDivElement>(null);
  const gooRef = useRef<SVGGElement>(null);
  const massaRef = useRef<SVGPathElement>(null);
  const brilhoRef = useRef<SVGCircleElement>(null);
  const gotasRef = useRef<(SVGCircleElement | null)[]>([]);
  const stopsRef = useRef<(SVGStopElement | null)[]>([]);
  const brilhoStopRef = useRef<SVGStopElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  const falasRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const medida = useRef<Medida>({ w: 0, h: 0 });
  /** Em qual das duas pontas a cena já foi deixada parada — ver o guarda no laço. */
  const repouso = useRef<'antes' | 'depois' | null>(null);

  const reduced = useReducedMotion();

  /**
   * O tamanho vem do elemento, não de `100vw`/`100vh`.
   *
   * O caminho é desenhado em pixels e o `viewBox` acompanha, porque a alternativa
   * — uma caixa quadrada esticada com `preserveAspectRatio="none"` — achataria o
   * círculo em toda tela que não fosse quadrada, e um círculo achatado é a única
   * forma que esta animação não pode ter no primeiro frame.
   */
  useEffect(() => {
    const svg = svgRef.current;
    if (svg == null) return;

    const medir = () => {
      medida.current = { w: svg.clientWidth, h: svg.clientHeight };
      svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
      repouso.current = null;
    };

    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame(() => {
    const { w, h } = medida.current;
    const massa = massaRef.current;
    const papel = papelRef.current;
    const svg = svgRef.current;
    if (w === 0 || h === 0 || massa == null || papel == null || svg == null) return;

    const u = range(progress.get(), 0, until);

    /**
     * Depois da travessia não há nada para desenhar, e o custo de não desenhar
     * precisa ser zero: a seção tem mais quinhentas alturas de tela pela frente.
     *
     * O estado final é ESCRITO aqui, e não herdado do último frame desenhado.
     * Um salto de rolagem — âncora, restauração de posição, roda de mouse rápida
     * — pode pular de dentro da travessia para depois dela sem passar pelos
     * valores do meio, e sair sem escrever nada deixaria congelado o que estava
     * na tela no instante do salto. Foi assim que as três frases apareceram
     * escritas por cima do conteúdo da seção.
     */
    if (u >= 1) {
      if (repouso.current === 'depois') return;
      repouso.current = 'depois';
      svg.style.opacity = '0';
      papel.style.opacity = '1';
      falasRef.current.forEach((fala) => {
        if (fala != null) fala.style.opacity = '0';
      });
      return;
    }

    /**
     * Antes dela o corpo já está na tela — o dono pediu que ele abrisse a cena,
     * e a seção passa vários segundos entrando por baixo antes de o progresso
     * sair do zero. Desenhar o repouso UMA vez e sair resolve as duas coisas: a
     * gota está lá desde o primeiro pixel da seção, e o `useAnimationFrame`, que
     * roda em todo frame do documento, não monta quarenta e quatro pontos de
     * Bézier enquanto o visitante lê o hero.
     */
    if (u <= 0) {
      if (repouso.current === 'antes') return;
      repouso.current = 'antes';
    } else {
      repouso.current = null;
    }

    svg.style.opacity = `${1 - suave(range(u, 0.97, 1))}`;

    const menor = Math.min(w, h);

    // ── Ato 1: o corpo anda. Dois senos por eixo, com frequências que não são
    // múltiplas, então o caminho não fecha um padrão dentro da travessia.
    const passeio = suave(range(u, 0.06, 0.44));
    let cx = w * (0.5 + 0.27 * Math.sin(TAU * 1.15 * u + 0.6) + 0.1 * Math.sin(TAU * 2.6 * u + 2.1));
    let cy = h * (0.48 + 0.17 * Math.sin(TAU * 0.85 * u + 1.9) + 0.06 * Math.sin(TAU * 2.15 * u));
    cx = lerp(w * 0.62, cx, passeio);
    cy = lerp(h * 0.4, cy, passeio);

    // ── Ato 2: junta-se no alto e vira gota.
    const virar = suave(range(u, 0.42, 0.58));
    cx = lerp(cx, w * 0.5, virar);
    cy = lerp(cy, h * 0.17, virar);

    // ── Ato 3: cai. `t²` porque queda é aceleração — a mesma queda linear
    // pareceria um elevador.
    const queda = range(u, 0.56, 0.74);
    cy += queda * queda * (h * 0.45);

    // ── Ato 4: bate. O impacto é um pulso, não uma rampa — a poça se esparrama
    // no toque e volta, que é o que um líquido faz contra o chão.
    const impacto = Math.sin(range(u, 0.71, 0.85) * Math.PI) ** 1.4;
    const espirro = range(u, 0.73, 0.9);

    // ── Ato 5: a poça cresce até engolir a tela. O raio final é a meia diagonal,
    // que é o que cobre os quatro cantos de qualquer proporção. Termina antes do
    // fim: a inversão acende atrás dela, e acender atrás de uma poça que ainda
    // não cobriu os cantos deixa os cantos meio invertidos — cinza.
    const encher = suave(range(u, 0.86, 0.95));
    const alvo = Math.hypot(w, h) * 0.56;

    // Respira ao longo do passeio: é o "para frente e para trás" do roteiro,
    // feito por escala, que é como profundidade se lê numa tela.
    const base = menor * RAIO * (1 + 0.2 * Math.sin(TAU * 1.7 * u + 0.4));

    let rx = lerp(base, alvo, encher);
    let ry = rx;

    /**
     * Que já pousou. Tanto o alongamento da queda quanto o bico da gota morrem
     * aqui, e nenhum dos dois pode morrer no `impacto`: ele é um pulso, volta a
     * zero, e devolveria ao charco a forma de gota bicuda no meio da enchente —
     * que foi exatamente o que apareceu na primeira vez que isto rodou.
     */
    const pousou = suave(range(u, 0.72, 0.82));
    const alongar = queda * (1 - pousou);

    // A gota se estica na queda, se esparrama na batida e relaxa depois.
    rx *= 1 - alongar * 0.22 + impacto * 1.15;
    ry *= 1 + alongar * 0.5 - impacto * 0.62;

    const torto = 0.055 + 0.16 * passeio * (1 - virar) + 0.1 * impacto;
    const bico = virar * (1 - pousou);
    const fase = u * 26;

    massa.setAttribute('d', corpo(cx, cy, rx, ry, torto * (1 - encher), bico, fase));

    // O halo. Sem ele o preto em volta do corpo é só preto, e foi essa a
    // reclamação: a cena inteira cabia num círculo. O brilho não desenha nada —
    // ele acende o vazio, que é o que o vazio precisava.
    if (brilhoRef.current != null) {
      brilhoRef.current.setAttribute('cx', `${cx.toFixed(1)}`);
      brilhoRef.current.setAttribute('cy', `${cy.toFixed(1)}`);
      brilhoRef.current.setAttribute('r', `${(Math.max(rx, ry) * 3.4).toFixed(1)}`);
      brilhoRef.current.setAttribute('opacity', `${(1 - encher).toFixed(3)}`);
    }

    // O filtro só existe durante o espirro: ele é um borrão de tela cheia com
    // uma matriz por cima, e deixá-lo ligado nos outros 90% da travessia é pagar
    // por um efeito que não está acontecendo.
    if (gooRef.current != null) {
      gooRef.current.setAttribute(
        'filter',
        espirro > 0 && espirro < 1 && reduced !== true ? 'url(#pd-goo)' : 'none',
      );
    }

    // As gotas saem em leque para cima e a gravidade as traz de volta: o `s`
    // linear leva para fora, o `s²` puxa para baixo, e as duas juntas são a
    // parábola. Saem com força de sobra — respingo tímido lê como erro de
    // renderização, não como respingo.
    gotasRef.current.forEach((gota, i) => {
      if (gota == null) return;
      if (espirro <= 0 || espirro >= 1 || reduced === true) {
        gota.setAttribute('r', '0');
        return;
      }
      const a = (-0.5 - 0.46 + (0.92 * i) / (GOTAS - 1)) * Math.PI;
      const forca = menor * (0.34 + 0.16 * Math.sin(i * 2.7));
      const s = espirro;
      gota.setAttribute('cx', `${(cx + Math.cos(a) * forca * s * 1.5).toFixed(1)}`);
      gota.setAttribute(
        'cy',
        `${(cy + Math.sin(a) * forca * s * 1.7 + forca * 2.6 * s * s).toFixed(1)}`,
      );
      gota.setAttribute(
        'r',
        `${Math.max(0, menor * 0.055 * (1 - s * s) * (0.55 + 0.45 * Math.sin(i * 1.9))).toFixed(1)}`,
      );
    });

    // ── A cor. Branca ao abrir, saturada no meio, papel no fim: o giro de matiz
    // atravessa a paleta inteira e pousa exatamente no tom do papel. `sair`
    // termina antes de a poça fechar a tela, então no frame em que ela cobre
    // tudo a tinta já é o papel — é por isso que a troca de camadas não tem
    // costura visível.
    const entrar = suave(range(u, 0.06, 0.28));
    const sair = suave(range(u, 0.8, 0.92));
    const matiz = lerp(MATIZ_INICIO + MATIZ_GIRO * u, MATIZ_PAPEL + 360 * 2, sair);
    const sat = lerp(lerp(0, 88, entrar), 30, sair);
    const luz = lerp(lerp(100, 57, entrar), 93, sair);

    stopsRef.current.forEach((stop, i) => {
      if (stop == null) return;
      const desvio = i === 0 ? 0 : 52 * (1 - sair);
      stop.setAttribute(
        'stop-color',
        `hsl(${(matiz + desvio) % 360} ${sat.toFixed(1)}% ${(luz + (i === 0 ? 0 : -6 * (1 - sair))).toFixed(1)}%)`,
      );
    });
    if (brilhoStopRef.current != null) {
      brilhoStopRef.current.setAttribute(
        'stop-color',
        `hsl(${matiz % 360} ${Math.max(sat, 40).toFixed(1)}% ${luz.toFixed(1)}%)`,
      );
    }

    // O gradiente gira junto, para que a luz na tinta não fique presa a um lado.
    if (gradRef.current != null) {
      const g = TAU * 0.7 * u + 1.1;
      gradRef.current.setAttribute('x1', `${0.5 - 0.5 * Math.cos(g)}`);
      gradRef.current.setAttribute('y1', `${0.5 - 0.5 * Math.sin(g)}`);
      gradRef.current.setAttribute('x2', `${0.5 + 0.5 * Math.cos(g)}`);
      gradRef.current.setAttribute('y2', `${0.5 + 0.5 * Math.sin(g)}`);
    }

    // As falas entram uma a uma e ficam. Saem todas juntas, sob a poça.
    const somem = suave(range(u, FALAS_DE, FALAS_ATE));
    falasRef.current.forEach((fala, i) => {
      if (fala == null) return;
      const entra = suave(range(u, FALAS[i].de, FALAS[i].de + 0.08));
      fala.style.opacity = `${entra * (1 - somem)}`;
      fala.style.transform = `translateY(${((1 - entra) * 28).toFixed(1)}px)`;
    });

    // ── A troca. O papel acende atrás da tinta só depois que a poça já cobriu a
    // tela, e a tinta se apaga por cima dele — as duas coisas acontecem sob uma
    // cor que já é a mesma nas duas camadas.
    papel.style.opacity = `${suave(range(u, 0.955, 0.978))}`;
  });

  return (
    <>
      {/* Abaixo da tinta e acima do conteúdo: é ele que inverte a seção. */}
      <div
        ref={papelRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 mix-blend-difference"
        style={{ background: PAPEL, opacity: 0 }}
      />

      <svg
        ref={svgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 h-full w-full"
      >
        <defs>
          <linearGradient ref={gradRef} id="pd-grad" x1="0" y1="0" x2="1" y2="1">
            <stop
              ref={(el) => {
                stopsRef.current[0] = el;
              }}
              offset="0%"
              stopColor="#FFFFFF"
            />
            <stop
              ref={(el) => {
                stopsRef.current[1] = el;
              }}
              offset="100%"
              stopColor="#FFFFFF"
            />
          </linearGradient>

          <radialGradient id="pd-brilho">
            <stop ref={brilhoStopRef} offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* O gooey clássico: borra tudo junto e depois joga o alfa para os
              extremos com a matriz. Formas que se aproximam derretem uma na
              outra em vez de se sobrepor, que é a diferença entre respingo e
              confete. */}
          <filter id="pd-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="borrado" />
            <feColorMatrix
              in="borrado"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
            />
          </filter>
        </defs>

        {/* Fora do grupo do filtro: o borrão do gooey é caro e o halo já é um
            borrão — passá-lo pelo filtro seria pagar duas vezes pelo mesmo. */}
        <circle ref={brilhoRef} r={0} fill="url(#pd-brilho)" />

        <g ref={gooRef}>
          <path ref={massaRef} d="" fill="url(#pd-grad)" />
          {Array.from({ length: GOTAS }, (_, i) => (
            <circle
              key={i}
              ref={(el) => {
                gotasRef.current[i] = el;
              }}
              r={0}
              fill="url(#pd-grad)"
            />
          ))}
        </g>
      </svg>

      {/* Na frente da tinta: atrás dela, a gota estaciona em cima das palavras no
          meio do passeio e come metade da frase. Na frente, ela passa por trás do
          texto e as duas coisas continuam legíveis.

          Alinhado à mesma coluna do conteúdo da seção — as frases começam onde
          "Sem Doxa" vai começar quando a tinta secar. */}
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center">
        <div className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
          <div className="flex flex-col gap-1 md:gap-2">
            {FALAS.map(({ texto }, i) => (
              <p
                key={texto}
                ref={(el) => {
                  falasRef.current[i] = el;
                }}
                className="font-serif text-3xl leading-[1.02] tracking-[-0.03em] text-primary opacity-0 md:text-6xl lg:text-8xl"
              >
                {texto}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
