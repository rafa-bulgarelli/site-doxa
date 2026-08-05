import { useEffect, useRef } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { PECAS } from './config';

/**
 * Gravidade, em pixels por segundo ao quadrado.
 *
 * Não é a da Terra convertida — é a que faz uma peça de 40px atravessar um
 * palco de 180px num tempo que o olho lê como queda. Física de tela é uma
 * questão de proporção de tela, e a única aferição que vale é olhar.
 */
const G = 2300;

/** Quanto de velocidade sobrevive a uma batida. Abaixo de 0,3 as peças morrem no chão; acima de 0,6 elas nunca param. */
const QUIQUE = 0.46;

/** Atrito do chão e do ar. O do chão é o que faz a pilha assentar em vez de deslizar para sempre. */
const ATRITO_CHAO = 0.82;
const ATRITO_AR = 0.995;

/**
 * Velocidade abaixo da qual o corpo é considerado parado, em px/s.
 *
 * Existe para o laço poder dormir. Sem isto, sete corpos continuam sendo
 * integrados sessenta vezes por segundo para sempre, e esta seção fica no fim
 * de uma página que a pessoa ainda vai ler inteira.
 */
const SONO = 4;

/** O passo máximo de um frame. Aba em segundo plano devolve `delta` de segundos, e um corpo com dt grande atravessa a parede. */
const PASSO_MAX = 1 / 30;

/**
 * Folga entre a caixa da física e a borda do palco, em pixels.
 *
 * A colisão trata os corpos como caixas alinhadas aos eixos, mas eles são
 * desenhados girados — e uma pastilha inclinada três graus tem os cantos alguns
 * pixels fora da própria caixa. Sem esta folga, a peça descansa com a quina
 * cortada pelo `overflow-hidden` do palco.
 */
const FOLGA = 7;

/** Quando a primeira peça é solta, e de quanto em quanto vem a seguinte, em segundos. */
const ENTRADA = 0.15;
const INTERVALO = 0.13;

/**
 * A cor de cada peça.
 *
 * PENDENTE-DONO: o `tailwind.config.js` diz que a Doxa é monocromática e que
 * cor só entra por asset. Estas sete são a exceção pedida pelo dono, e a razão
 * é defensável: cada peça é um FORNECEDOR, gente de fora, e a página já abre
 * essa exceção para o azul e o vermelho do Instagram na parede de prova. Cor
 * aqui é o que diz "isto não é a Doxa" sem precisar escrever.
 *
 * Opacas e foscas, com tinta escura por cima — o card do lado é creme, e sete
 * pastilhas fluorescentes ao lado dele viraria festa junina.
 */
const CORES = [
  '#E2542C',
  '#EFC04A',
  '#4E9E6A',
  '#3C7FA8',
  '#EDE9DC',
  '#A9569F',
  '#CF4747',
];

interface Corpo {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vrot: number;
}

/**
 * As sete contratações, como blocos que caem, batem e podem ser jogados.
 *
 * O dono pediu física, e física de verdade: as peças caem quando a seção entra
 * na tela, empilham uma sobre a outra, reagem ao ponteiro e podem ser pegas e
 * arremessadas. É um solver escrito à mão em vez de uma biblioteca — a `matter`
 * são vinte e oito quilobytes comprimidos, mais de um quarto do bundle atual,
 * para decorar uma seção. O que está aqui são setenta linhas de integração e
 * separação de caixas.
 *
 * A colisão ignora a rotação: os corpos são caixas alinhadas aos eixos e a
 * inclinação é só desenho. É a trapaça clássica, e ela se sustenta porque as
 * peças giram pouco — a olho, ninguém confere o canto de uma pastilha girada
 * três graus.
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
  const naTela = useInView(palcoRef, { amount: 0.4, once: true });

  /** Mede o palco e as peças, e põe cada uma acima do teto esperando a queda. */
  useEffect(() => {
    const palco = palcoRef.current;
    if (palco == null) return;

    const medir = () => {
      caixa.current = { w: palco.clientWidth, h: palco.clientHeight };
      corpos.current = PECAS.map((_, i) => {
        const no = nosRef.current[i];
        const w = no?.offsetWidth ?? 120;
        const h = no?.offsetHeight ?? 38;
        const vao = Math.max(0, caixa.current.w - w - FOLGA * 2);
        return {
          // Espalhadas na largura em vez de empilhadas numa coluna: sete peças
          // caindo do mesmo x viram uma torre, e torre não é pilha.
          x: FOLGA + vao * ((i + 0.5) / PECAS.length),
          y: -h - 24,
          vx: 0,
          vy: 0,
          w,
          h,
          rot: (i % 2 === 0 ? -1 : 1) * (2 + (i % 3)),
          vrot: 0,
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
    if (lista.length === 0 || LARG === 0) return;
    if (!naTela) return;

    // Nada se mexe e ninguém está segurando nada: não há o que integrar. O laço
    // continua rodando, mas custa uma comparação por frame em vez de setenta.
    if (dormindo.current && preso.current == null) return;

    const dt = Math.min(delta / 1000, PASSO_MAX);
    if (dt <= 0) return;

    relogio.current += dt;
    const agarrado = preso.current;

    for (let i = 0; i < lista.length; i += 1) {
      const c = lista[i];

      // Uma de cada vez, e é isto que o dono chamou de "carregando a seção":
      // sete peças soltas no mesmo frame caem como um bloco só e assentam numa
      // torre. Escalonadas, elas se acomodam umas sobre as outras à medida que
      // chegam, que é como um monte se forma de verdade.
      if (relogio.current < ENTRADA + i * INTERVALO) {
        const no = nosRef.current[i];
        if (no != null) no.style.opacity = '0';
        continue;
      }
      const no = nosRef.current[i];
      if (no != null && no.style.opacity !== '1') no.style.opacity = '1';

      if (agarrado != null && agarrado.i === i) {
        // A peça segurada não cai: ela persegue o ponteiro, e a velocidade com
        // que ela o persegue é a velocidade com que vai sair da mão. É o que
        // transforma arrastar em arremessar.
        const alvoX = agarrado.px - agarrado.dx;
        const alvoY = agarrado.py - agarrado.dy;
        c.vx = (alvoX - c.x) / dt;
        c.vy = (alvoY - c.y) / dt;
        c.x = alvoX;
        c.y = alvoY;
        c.vrot = c.vx * 0.02;
      } else {
        c.vy += G * dt;
        c.vx *= ATRITO_AR;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
      }

      c.rot += c.vrot * dt;
      c.vrot *= 0.96;

      // Paredes e chão do card. O teto fica aberto — é por onde elas entram, e
      // uma peça arremessada para cima que bate num teto invisível denuncia a
      // caixa.
      if (c.x < FOLGA) {
        c.x = FOLGA;
        c.vx = -c.vx * QUIQUE;
        c.vrot += c.vy * 0.01;
      }
      if (c.x + c.w > LARG - FOLGA) {
        c.x = LARG - FOLGA - c.w;
        c.vx = -c.vx * QUIQUE;
        c.vrot -= c.vy * 0.01;
      }
      if (c.y + c.h > ALT - FOLGA) {
        c.y = ALT - FOLGA - c.h;
        c.vy = -c.vy * QUIQUE;
        c.vx *= ATRITO_CHAO;
        c.vrot *= 0.7;
        // A inclinação volta ao repouso quando ela para: peça deitada torta no
        // chão é peça quebrada, peça com três graus é peça largada.
        c.rot += (0 - c.rot) * 0.08;
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
            if (!segurandoA) a.vx = media * QUIQUE + sinal * 20;
            if (!segurandoB) b.vx = media * QUIQUE - sinal * 20;
          } else {
            const sinal = a.y < b.y ? -1 : 1;
            a.y += sinal * sobraY * pesoA;
            b.y -= sinal * sobraY * pesoB;
            const media = (a.vy + b.vy) / 2;
            if (!segurandoA) a.vy = media * QUIQUE;
            if (!segurandoB) b.vy = media * QUIQUE;
            // Um empurrãozinho lateral junto: separar só na vertical faz sete
            // peças virarem uma torre, porque nada nunca as tira de cima umas
            // das outras. Com ele o monte se espalha e assenta em fileiras.
            const desvio = (a.x + a.w / 2 - (b.x + b.w / 2)) || (i % 2 ? 1 : -1);
            const lado = Math.sign(desvio) * 26;
            if (!segurandoA) a.vx += lado;
            if (!segurandoB) b.vx -= lado;
            const giro = desvio * 0.02;
            a.vrot += giro;
            b.vrot -= giro;
          }
        }
      }
    }

    // O ponteiro cutuca. Não é colisão — é um empurrão suave de quem passa
    // perto, e é o que faz o monte parecer vivo sem que ninguém precise clicar.
    const p = ponteiro.current;
    if (p != null && agarrado == null) {
      for (const c of lista) {
        const cx = c.x + c.w / 2;
        const cy = c.y + c.h / 2;
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 0.5) {
          const forca = (1 - dist / 90) * 620;
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
        no.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${c.rot.toFixed(2)}deg)`;
      }
      if (Math.abs(c.vx) > SONO || Math.abs(c.vy) > SONO || c.y + c.h < ALT - FOLGA - 1) {
        mexendo = true;
      }
    }
    dormindo.current = !mexendo;
  });

  /** Acorda o laço — todo gesto que injeta energia precisa chamar isto. */
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
    if (preso.current != null) {
      const c = corpos.current[preso.current.i];
      // Um arremesso guardado inteiro atira a peça para fora da tela na
      // primeira sacudida; oitenta por cento ainda é um arremesso.
      if (c != null) {
        c.vx *= 0.8;
        c.vy *= 0.8;
      }
      evento.currentTarget.releasePointerCapture?.(evento.pointerId);
      preso.current = null;
      acordar();
    }
  };

  return (
    <div
      ref={palcoRef}
      className="relative h-full min-h-[15rem] w-full touch-pan-y select-none overflow-hidden md:min-h-[13rem]"
      onPointerMove={mover}
      onPointerLeave={() => {
        ponteiro.current = null;
      }}
    >
      {PECAS.map(({ nome }, i) => (
        <div
          key={nome}
          ref={(el) => {
            nosRef.current[i] = el;
          }}
          onPointerDown={pegar(i)}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          style={{
            background: CORES[i % CORES.length],
            opacity: 0,
            // `will-change` porque estes sete são os únicos elementos da página
            // com transform reescrito a cada frame.
            willChange: 'transform',
          }}
          className={`absolute left-0 top-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[#0B0B0B] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] ${
            isDesktop && !parado ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          {nome}
        </div>
      ))}
    </div>
  );
}
