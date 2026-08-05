import { useEffect, useRef } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { PECAS, type Forma } from './config';

/** Gravidade, em pixels por segundo ao quadrado. */
const G = 2600;

/**
 * Quanto de velocidade sobrevive a uma batida.
 *
 * Baixo de propósito. O dono pediu física fiel — "caiu ali, ficou ali" — e uma
 * peça que quica três vezes antes de assentar parece de borracha.
 */
const QUIQUE = 0.18;

const ATRITO_CHAO = 0.7;
const ATRITO_AR = 0.995;

/**
 * A mola que segura cada peça no lugar dela, e o quanto ela amortece.
 *
 * É o coração da versão harmônica. Em repouso as peças NÃO caem soltas: elas
 * moram num arranjo desenhado à mão e voltam para ele quando empurradas. Um
 * monte livre de oito corpos nunca fica arrumado — não cabe uma fileira, sobra
 * meia, e o resultado é o que o dono viu e recusou. Só quem é arrastado se
 * solta de vez.
 */
const MOLA = 150;
const AMORTECE = 0.82;

/** Velocidade abaixo da qual o corpo é considerado parado, em px/s. */
const SONO = 4;

/** O passo máximo de um frame. Aba em segundo plano devolve `delta` grande, e um corpo com dt grande atravessa a parede. */
const PASSO_MAX = 1 / 30;

/** Folga entre a caixa da física e a borda do palco, em pixels. */
const FOLGA = 6;

/** Quando a primeira peça é solta, e de quanto em quanto vem a seguinte, em segundos. */
const ENTRADA = 0.15;
const INTERVALO = 0.11;

/**
 * A tela onde o arranjo foi desenhado, em pixels, e onde cada peça mora nela
 * pelo CENTRO.
 *
 * Em pixels, e não em frações do palco, e essa é a diferença que importa. Em
 * frações, o mesmo arranjo vira coisas diferentes em cada proporção de tela: num
 * palco largo ele se esparrama numa fileira com uma peça órfã lá em cima.
 * Desenhado numa tela fixa e depois encolhido para caber, o conjunto é sempre o
 * mesmo conjunto — em qualquer largura, e no telefone também.
 *
 * Duas fileiras em zigue-zague, com as peças se tocando de leve. Formas
 * recortadas que se encaixam leem como um grupo; separadas por ar, leem como
 * oito coisas soltas.
 */
const TELA = { w: 880, h: 340 };

const ARRANJO = [
  { x: 70, y: 225 }, // Video maker
  { x: 660, y: 100 }, // Roteirista
  { x: 210, y: 235 }, // Editor de vídeo
  { x: 260, y: 100 }, // Horas de estúdio
  { x: 560, y: 230 }, // Gravar conteúdo
  { x: 480, y: 100 }, // Agência de marketing
  { x: 720, y: 235 }, // Tráfego pago
  { x: 380, y: 215 }, // O seu tempo
];

/**
 * O recorte de cada forma, e quanto da caixa da física ela ocupa.
 *
 * A colisão é caixa contra caixa — exata para o quadrado, aproximada para o
 * resto. `solidez` é a fração do lado que a caixa ocupa: quanto mais recortada
 * a forma, menos dela é sólida, e mais as peças se aninham como o olho espera.
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
  /** Onde a peça mora enquanto ninguém a arrancar de lá. */
  alvoX: number;
  alvoY: number;
  /** Metade da diferença entre o lado desenhado e a caixa, para centrar. */
  folgaDesenho: number;
  /** Já chegou ao lugar dela? Antes disso, cai. */
  pousou: boolean;
  /** Foi arrancada do lugar? Depois disso, obedece só à gravidade. */
  solta: boolean;
}

/**
 * As oito peças: um arranjo desenhado, com física de verdade por baixo.
 *
 * Duas leis, e a segunda só vale depois que alguém encosta. Em repouso, cada
 * peça é presa ao lugar dela por uma mola: o ponteiro empurra, ela cede e volta.
 * Arrastada, ela se solta de vez — e aí é gravidade, parede, chão e colisão com
 * as vizinhas, que continuam firmes como obstáculos.
 *
 * É a resposta a duas exigências que pareciam brigar: o dono quer física, e quer
 * que fique harmônico. Um monte livre resolve a primeira e perde a segunda. Um
 * arranjo que só se desfaz quando alguém desfaz resolve as duas.
 *
 * Não há rotação nenhuma. A versão anterior girava os corpos e a velocidade
 * angular acumulava a cada quique até marcar cinco mil graus — era o rodopio que
 * o dono viu na tela. Corpo sem ângulo não tem como enlouquecer.
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
  const naTela = useInView(palcoRef, { amount: 0.3, once: true });

  /** Mede o palco, calcula onde cada peça mora e a põe acima do teto. */
  useEffect(() => {
    const palco = palcoRef.current;
    if (palco == null) return;

    const medir = () => {
      const w = palco.clientWidth;
      const h = palco.clientHeight;
      caixa.current = { w, h };

      // O arranjo inteiro encolhe junto para caber — nunca cresce, para as peças
      // não ficarem gigantes numa tela larga. As peças escalam com ele: um
      // conjunto que muda de proporção internamente não é mais o conjunto que
      // foi desenhado.
      const escala = Math.min(1, (w - FOLGA * 2) / TELA.w, (h - FOLGA * 2) / TELA.h);
      const sobraX = (w - TELA.w * escala) / 2;
      const sobraY = (h - TELA.h * escala) / 2;

      corpos.current = PECAS.map(({ lado, forma, destaque }, i) => {
        const desenho = lado * escala;
        const caixaLado = desenho * RECORTE[forma].solidez;
        const folgaDesenho = (desenho - caixaLado) / 2;
        const borda = FOLGA + folgaDesenho;
        const posicao = ARRANJO[i] ?? { x: TELA.w / 2, y: TELA.h / 2 };
        const limiteX = Math.max(borda, w - borda - caixaLado);
        const limiteY = Math.max(borda, h - borda - caixaLado);
        const alvoX = Math.min(Math.max(sobraX + posicao.x * escala - caixaLado / 2, borda), limiteX);
        const alvoY = Math.min(Math.max(sobraY + posicao.y * escala - caixaLado / 2, borda), limiteY);

        const no = nosRef.current[i];
        if (no != null) {
          no.style.width = `${desenho.toFixed(1)}px`;
          no.style.height = `${desenho.toFixed(1)}px`;
          no.style.fontSize = `${((destaque === true ? 15 : 12) * escala).toFixed(1)}px`;
        }

        return {
          x: alvoX,
          y: -desenho - 24,
          vx: 0,
          vy: 0,
          w: caixaLado,
          h: caixaLado,
          alvoX,
          alvoY,
          folgaDesenho,
          pousou: false,
          solta: false,
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
    const p = ponteiro.current;

    for (let i = 0; i < lista.length; i += 1) {
      const c = lista[i];
      const no = nosRef.current[i];

      // Uma de cada vez. Oito peças soltas no mesmo frame chegam como um bloco
      // só; escalonadas, o arranjo se escreve na tela peça por peça.
      if (relogio.current < ENTRADA + i * INTERVALO) {
        if (no != null) no.style.opacity = '0';
        continue;
      }
      if (no != null && no.style.opacity !== '1') no.style.opacity = '1';

      if (agarrado != null && agarrado.i === i) {
        // A peça segurada persegue o ponteiro, e a velocidade com que o persegue
        // é a velocidade com que vai sair da mão. É o que transforma arrastar em
        // arremessar.
        const destinoX = agarrado.px - agarrado.dx;
        const destinoY = agarrado.py - agarrado.dy;
        c.vx = (destinoX - c.x) / dt;
        c.vy = (destinoY - c.y) / dt;
        c.x = destinoX;
        c.y = destinoY;
        c.solta = true;
        c.pousou = true;
      } else if (!c.pousou) {
        // A chegada: cai até o lugar dela e para. Um pouso, não um quique.
        c.vy += G * dt;
        c.y += c.vy * dt;
        if (c.y >= c.alvoY) {
          c.y = c.alvoY;
          c.vy = 0;
          c.pousou = true;
        }
      } else if (c.solta) {
        c.vy += G * dt;
        c.vx *= ATRITO_AR;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
      } else {
        // Presa ao arranjo. A mola devolve, o amortecimento impede que ela fique
        // tremendo, e o empurrão do ponteiro entra como força — a peça cede e
        // volta, sem sair do lugar.
        if (p != null && !parado) {
          const dx = c.x + c.w / 2 - p.x;
          const dy = c.y + c.h / 2 - p.y;
          const dist = Math.hypot(dx, dy);
          const alcance = c.w * 0.95;
          if (dist < alcance && dist > 0.5) {
            const forca = (1 - dist / alcance) * 1600;
            c.vx += (dx / dist) * forca * dt;
            c.vy += (dy / dist) * forca * dt;
            dormindo.current = false;
          }
        }
        c.vx += (c.alvoX - c.x) * MOLA * dt;
        c.vy += (c.alvoY - c.y) * MOLA * dt;
        c.vx *= AMORTECE;
        c.vy *= AMORTECE;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
      }

      // Paredes e chão. O limite é medido contra o DESENHO, não contra a caixa
      // da física: a caixa é menor de propósito, para as formas recortadas se
      // aninharem, e uma estrela que encosta na parede pela caixa fica com as
      // pontas cortadas pelo `overflow-hidden` do palco.
      const borda = FOLGA + c.folgaDesenho;
      if (c.x < borda) {
        c.x = borda;
        c.vx = -c.vx * QUIQUE;
      }
      if (c.x + c.w > LARG - borda) {
        c.x = LARG - borda - c.w;
        c.vx = -c.vx * QUIQUE;
      }
      if (c.solta && c.y + c.h > ALT - borda) {
        c.y = ALT - borda - c.h;
        c.vy = -c.vy * QUIQUE;
        c.vx *= ATRITO_CHAO;
      }
    }

    // Separação: só entra em cena depois que alguém solta uma peça. Quem está no
    // arranjo não se empurra — o arranjo já foi resolvido no desenho, e resolver
    // de novo por colisão desfaria justamente o que ele tem de bom.
    for (let passada = 0; passada < 2; passada += 1) {
      for (let i = 0; i < lista.length; i += 1) {
        for (let j = i + 1; j < lista.length; j += 1) {
          const a = lista[i];
          const b = lista[j];
          if (!a.solta && !b.solta) continue;
          const sobraX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const sobraY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (sobraX <= 0 || sobraY <= 0) continue;

          // Peça presa é obstáculo: empurra e não é empurrada. Quem está na mão,
          // idem — a mão é mais forte que a física.
          const fixaA = !a.solta || agarrado?.i === i;
          const fixaB = !b.solta || agarrado?.i === j;
          if (fixaA && fixaB) continue;
          const pesoA = fixaA ? 0 : fixaB ? 1 : 0.5;
          const pesoB = fixaB ? 0 : fixaA ? 1 : 0.5;

          if (sobraX < sobraY) {
            const sinal = a.x < b.x ? -1 : 1;
            a.x += sinal * sobraX * pesoA;
            b.x -= sinal * sobraX * pesoB;
            if (!fixaA) a.vx *= QUIQUE;
            if (!fixaB) b.vx *= QUIQUE;
          } else {
            const sinal = a.y < b.y ? -1 : 1;
            a.y += sinal * sobraY * pesoA;
            b.y -= sinal * sobraY * pesoB;
            if (!fixaA) a.vy *= QUIQUE;
            if (!fixaB) b.vy *= QUIQUE;
          }
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
      if (!c.pousou || Math.abs(c.vx) > SONO || Math.abs(c.vy) > SONO) mexendo = true;
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
    }
    acordar();
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
      className="relative h-full min-h-[15rem] w-full touch-pan-y select-none overflow-hidden"
      onPointerMove={mover}
      onPointerLeave={() => {
        ponteiro.current = null;
        acordar();
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
              destaque === true ? 'font-bold tracking-tight' : 'font-semibold'
            } ${isDesktop && !parado ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            <span className="pointer-events-none whitespace-pre-line px-2">{nome}</span>
          </div>
        );
      })}
    </div>
  );
}
