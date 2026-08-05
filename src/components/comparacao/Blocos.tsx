import { useEffect, useRef } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { PECAS, type Forma } from './config';

/**
 * Gravidade, em pixels por segundo ao quadrado.
 *
 * Não é a da Terra convertida — é a que faz uma peça atravessar um palco de
 * trezentos pixels num tempo que o olho lê como queda. Física de tela é uma
 * questão de proporção de tela, e a única aferição que vale é olhar.
 */
const G = 2600;

/**
 * Quanto de velocidade sobrevive a uma batida.
 *
 * Baixo de propósito. O dono pediu física fiel — "caiu ali, ficou ali" — e uma
 * peça que quica três vezes antes de assentar parece de borracha. Isto aqui é
 * um saco de coisas pesadas caindo dentro de uma caixa.
 */
const QUIQUE = 0.18;

/** Atrito do chão e do ar. O do chão é o que faz a pilha assentar em vez de deslizar para sempre. */
const ATRITO_CHAO = 0.7;
const ATRITO_AR = 0.995;

/**
 * Velocidade abaixo da qual o corpo é considerado parado, em px/s.
 *
 * Existe para o laço poder dormir. Sem isto, oito corpos continuam sendo
 * integrados sessenta vezes por segundo para sempre, e esta seção fica no fim
 * de uma página que a pessoa ainda vai ler inteira.
 */
const SONO = 5;

/** O passo máximo de um frame. Aba em segundo plano devolve `delta` de segundos, e um corpo com dt grande atravessa a parede. */
const PASSO_MAX = 1 / 30;

/** Folga entre a caixa da física e a borda do palco, em pixels. */
const FOLGA = 6;

/** Quando a primeira peça é solta, e de quanto em quanto vem a seguinte, em segundos. */
const ENTRADA = 0.15;
const INTERVALO = 0.12;

/**
 * A ordem de queda, do corpo mais pesado para o mais leve.
 *
 * É o que faz o monte parecer arrumado sem ninguém ter arrumado nada. Soltas na
 * ordem da lista, as peças grandes chegam por último e ficam empoleiradas em
 * cima das pequenas, com buracos embaixo — foi o que o dono viu e chamou de
 * desarmônico. Grandes primeiro é como qualquer monte se forma no mundo: o que
 * é pesado vai para o fundo e o resto se acomoda em volta.
 *
 * O lugar de largada alterna do meio para fora, para o monte crescer a partir
 * do centro em vez de encostar numa parede e subir por ela.
 */
const QUEDA = PECAS.map((peca, i) => ({ i, lado: peca.lado }))
  .sort((a, b) => b.lado - a.lado)
  .map(({ i }, ordem) => ({ i, ordem, faixa: ordem % 2 === 0 ? 0.5 - ordem * 0.07 : 0.5 + ordem * 0.07 }));

/**
 * O recorte de cada forma, e quanto da caixa da física ela ocupa.
 *
 * A colisão é caixa contra caixa — exata para o quadrado, aproximada para o
 * resto. Sem encolher, uma estrela empilha pelos cantos vazios do retângulo que
 * a contém e fica flutuando vinte pixels acima da vizinha. `solidez` é a fração
 * do lado que a caixa ocupa: quanto mais recortada a forma, menos dela é
 * sólida, e mais as peças se aninham como o olho espera.
 */
const RECORTE: Record<Forma, { clip?: string; raio?: string; solidez: number }> = {
  circulo: { raio: '9999px', solidez: 0.9 },
  quadrado: { raio: '18px', solidez: 1 },
  pentagono: {
    clip: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    solidez: 0.86,
  },
  estrela: {
    clip: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    solidez: 0.68,
  },
  hexagono: {
    clip: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    solidez: 0.88,
  },
  losango: { clip: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', solidez: 0.74 },
  asterisco: {
    // Seis braços com a cintura grossa — é assim que um asterisco se lê num
    // tamanho em que ainda cabe uma palavra dentro dele.
    clip: 'polygon(42% 0%, 58% 0%, 58% 34%, 87% 17%, 95% 31%, 66% 48%, 95% 65%, 87% 79%, 58% 62%, 58% 100%, 42% 100%, 42% 62%, 13% 79%, 5% 65%, 34% 48%, 5% 31%, 13% 17%, 42% 34%)',
    solidez: 0.62,
  },
};

interface Corpo {
  /** Canto da CAIXA da física. O desenho é maior que ela e fica centrado nela. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  /** Metade da diferença entre o lado desenhado e a caixa, para centrar. */
  folgaDesenho: number;
  /** Posição na fila de queda — ver `QUEDA`. */
  ordem: number;
}

/**
 * As oito peças, como corpos que caem, batem e param.
 *
 * O dono pediu física fiel, e a palavra dele foi essa: bateu ali, ficou ali. Não
 * há rotação nenhuma — nem de repouso, nem de impacto. A versão anterior girava
 * os corpos, e a velocidade angular acumulava a cada quique contra a parede até
 * marcar cinco mil graus: era o rodopio que ele viu na tela. Um corpo sem ângulo
 * não tem como enlouquecer, e a colisão caixa contra caixa passa a ser exata em
 * vez de aproximada.
 *
 * É um solver escrito à mão em vez de biblioteca: a `matter` são vinte e oito
 * quilobytes comprimidos, mais de um quarto do bundle, para decorar uma seção.
 */
export function Blocos() {
  const palcoRef = useRef<HTMLDivElement>(null);
  const nosRef = useRef<(HTMLDivElement | null)[]>([]);
  const corpos = useRef<Corpo[]>([]);
  const caixa = useRef({ w: 0, h: 0 });
  const preso = useRef<{ i: number; dx: number; dy: number; px: number; py: number } | null>(null);
  const ponteiro = useRef<{ x: number; y: number } | null>(null);
  const dormindo = useRef(true);
  /** Segundos desde que a seção entrou na tela — é o relógio da entrada. */
  const relogio = useRef(0);

  const isDesktop = useIsDesktop();
  const parado = useReducedMotion() === true;
  const naTela = useInView(palcoRef, { amount: 0.35, once: true });

  /** Mede o palco e põe cada peça acima do teto, esperando a vez de cair. */
  useEffect(() => {
    const palco = palcoRef.current;
    if (palco == null) return;

    const medir = () => {
      caixa.current = { w: palco.clientWidth, h: palco.clientHeight };
      corpos.current = PECAS.map(({ lado, forma }, i) => {
        const w = lado * RECORTE[forma].solidez;
        const folgaDesenho = (lado - w) / 2;
        const borda = FOLGA + folgaDesenho;
        const vao = Math.max(0, caixa.current.w - w - borda * 2);
        const queda = QUEDA.find((q) => q.i === i);
        return {
          x: borda + vao * Math.min(0.98, Math.max(0.02, queda?.faixa ?? 0.5)),
          y: -w - 24,
          vx: 0,
          vy: 0,
          w,
          h: w,
          folgaDesenho,
          ordem: queda?.ordem ?? i,
        };
      });
      relogio.current = 0;
      dormindo.current = false;
    };

    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(palco);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const lista = corpos.current;
    const { w: LARG, h: ALT } = caixa.current;
    if (lista.length === 0 || LARG === 0 || !naTela) return;
    if (dormindo.current && preso.current == null) return;

    const dt = Math.min(delta / 1000, PASSO_MAX);
    if (dt <= 0) return;

    relogio.current += dt;
    const agarrado = preso.current;

    for (let i = 0; i < lista.length; i += 1) {
      const c = lista[i];
      const no = nosRef.current[i];

      // Uma de cada vez: oito peças soltas no mesmo frame caem como um bloco só
      // e assentam numa torre. Escalonadas, elas se acomodam umas sobre as
      // outras à medida que chegam, que é como um monte se forma de verdade.
      if (relogio.current < ENTRADA + c.ordem * INTERVALO) {
        if (no != null) no.style.opacity = '0';
        continue;
      }
      if (no != null && no.style.opacity !== '1') no.style.opacity = '1';

      if (agarrado != null && agarrado.i === i) {
        // A peça segurada não cai: ela persegue o ponteiro, e a velocidade com
        // que o persegue é a velocidade com que vai sair da mão. É o que
        // transforma arrastar em arremessar.
        const alvoX = agarrado.px - agarrado.dx;
        const alvoY = agarrado.py - agarrado.dy;
        c.vx = (alvoX - c.x) / dt;
        c.vy = (alvoY - c.y) / dt;
        c.x = alvoX;
        c.y = alvoY;
      } else {
        c.vy += G * dt;
        c.vx *= ATRITO_AR;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
      }

      // Paredes e chão. O limite é medido contra o DESENHO, não contra a caixa
      // da física: a caixa é menor de propósito, para as formas recortadas se
      // aninharem, e uma estrela que encosta na parede pela caixa fica com as
      // pontas do lado de fora — cortadas pelo `overflow-hidden` do palco.
      //
      // O teto fica aberto: é por onde elas entram, e uma peça arremessada para
      // cima que bate num teto invisível denuncia a caixa.
      const borda = FOLGA + c.folgaDesenho;
      if (c.x < borda) {
        c.x = borda;
        c.vx = -c.vx * QUIQUE;
      }
      if (c.x + c.w > LARG - borda) {
        c.x = LARG - borda - c.w;
        c.vx = -c.vx * QUIQUE;
      }
      if (c.y + c.h > ALT - borda) {
        c.y = ALT - borda - c.h;
        c.vy = -c.vy * QUIQUE;
        c.vx *= ATRITO_CHAO;
      }
    }

    // Separação entre pares. Duas passadas: uma só deixa a pilha atravessando
    // nas quinas, três não melhoram nada que se veja.
    for (let passada = 0; passada < 2; passada += 1) {
      for (let i = 0; i < lista.length; i += 1) {
        for (let j = i + 1; j < lista.length; j += 1) {
          const a = lista[i];
          const b = lista[j];
          const sobraX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const sobraY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (sobraX <= 0 || sobraY <= 0) continue;

          const segurandoA = agarrado?.i === i;
          const segurandoB = agarrado?.i === j;
          // Quem está na mão não é empurrado — a mão é mais forte que a física.
          const pesoA = segurandoA ? 0 : segurandoB ? 1 : 0.5;
          const pesoB = segurandoB ? 0 : segurandoA ? 1 : 0.5;

          if (sobraX < sobraY) {
            const sinal = a.x < b.x ? -1 : 1;
            a.x += sinal * sobraX * pesoA;
            b.x -= sinal * sobraX * pesoB;
            const media = (a.vx + b.vx) / 2;
            if (!segurandoA) a.vx = media * QUIQUE;
            if (!segurandoB) b.vx = media * QUIQUE;
          } else {
            const sinal = a.y < b.y ? -1 : 1;
            a.y += sinal * sobraY * pesoA;
            b.y -= sinal * sobraY * pesoB;
            const media = (a.vy + b.vy) / 2;
            if (!segurandoA) a.vy = media * QUIQUE;
            if (!segurandoB) b.vy = media * QUIQUE;
            // Um empurrão lateral junto: separar só na vertical faz oito peças
            // virarem uma torre, porque nada nunca as tira de cima umas das
            // outras. Com ele o monte se espalha e assenta em fileiras.
            const desvio = a.x + a.w / 2 - (b.x + b.w / 2) || (i % 2 ? 1 : -1);
            const empurrao = Math.sign(desvio) * 22;
            if (!segurandoA) a.vx += empurrao;
            if (!segurandoB) b.vx -= empurrao;
          }
        }
      }
    }

    // O ponteiro cutuca. Não é colisão — é um empurrão de quem passa perto, e é
    // o que faz o monte parecer vivo sem que ninguém precise clicar.
    const p = ponteiro.current;
    if (p != null && agarrado == null && !parado) {
      for (const c of lista) {
        const dx = c.x + c.w / 2 - p.x;
        const dy = c.y + c.h / 2 - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0.5) {
          const forca = (1 - dist / 110) * 560;
          c.vx += (dx / dist) * forca * dt;
          c.vy += (dy / dist) * forca * dt;
          dormindo.current = false;
        }
      }
    }

    // Escreve, e decide se ainda vale continuar acordado.
    let mexendo = false;
    for (let i = 0; i < lista.length; i += 1) {
      const c = lista[i];
      const no = nosRef.current[i];
      if (no != null) {
        const x = c.x - c.folgaDesenho;
        const y = c.y - c.folgaDesenho;
        no.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
      if (Math.abs(c.vx) > SONO || Math.abs(c.vy) > SONO || c.y + c.h < ALT - FOLGA - c.folgaDesenho - 1) {
        mexendo = true;
      }
    }
    dormindo.current = !mexendo;
  });

  const acordar = () => {
    dormindo.current = false;
  };

  const pegar = (i: number) => (evento: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop || parado) return;
    const palco = palcoRef.current;
    const c = corpos.current[i];
    if (palco == null || c == null) return;
    const caixaPalco = palco.getBoundingClientRect();
    const px = evento.clientX - caixaPalco.left;
    const py = evento.clientY - caixaPalco.top;
    preso.current = { i, dx: px - c.x, dy: py - c.y, px, py };
    evento.currentTarget.setPointerCapture(evento.pointerId);
    acordar();
  };

  const mover = (evento: React.PointerEvent<HTMLDivElement>) => {
    const palco = palcoRef.current;
    if (palco == null) return;
    const caixaPalco = palco.getBoundingClientRect();
    const x = evento.clientX - caixaPalco.left;
    const y = evento.clientY - caixaPalco.top;
    ponteiro.current = { x, y };
    if (preso.current != null) {
      preso.current.px = x;
      preso.current.py = y;
      acordar();
    }
  };

  const soltar = (evento: React.PointerEvent<HTMLDivElement>) => {
    if (preso.current == null) return;
    const c = corpos.current[preso.current.i];
    // Um arremesso guardado inteiro atira a peça para fora na primeira
    // sacudida; oitenta por cento ainda é um arremesso.
    if (c != null) {
      c.vx *= 0.8;
      c.vy *= 0.8;
    }
    evento.currentTarget.releasePointerCapture?.(evento.pointerId);
    preso.current = null;
    acordar();
  };

  return (
    <div
      ref={palcoRef}
      className="relative h-full min-h-[19rem] w-full touch-pan-y select-none overflow-hidden"
      onPointerMove={mover}
      onPointerLeave={() => {
        ponteiro.current = null;
      }}
    >
      {PECAS.map(({ nome, forma, cor, lado, destaque }, i) => {
        const { clip, raio } = RECORTE[forma];
        return (
          <div
            key={nome}
            ref={(el) => {
              nosRef.current[i] = el;
            }}
            onPointerDown={pegar(i)}
            onPointerUp={soltar}
            onPointerCancel={soltar}
            style={{
              width: lado,
              height: lado,
              background: cor,
              clipPath: clip,
              borderRadius: raio,
              opacity: 0,
              // `will-change` porque estas oito são os únicos elementos da
              // página com transform reescrito a cada frame.
              willChange: 'transform',
            }}
            className={`absolute left-0 top-0 flex items-center justify-center text-center leading-[1.15] text-[#0B0B0B] ${
              destaque ? 'text-[15px] font-bold tracking-tight' : 'text-[12px] font-semibold'
            } ${isDesktop && !parado ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            <span className="pointer-events-none whitespace-pre-line px-2">{nome}</span>
          </div>
        );
      })}
    </div>
  );
}
