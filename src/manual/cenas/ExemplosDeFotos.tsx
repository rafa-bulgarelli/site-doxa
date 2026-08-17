/**
 * ─── QUE FOTO SERVE, QUE FOTO NÃO SERVE ──────────────────────────────────────
 *
 * O quadro mais mastigado do manual, e o que economiza mais ida e volta: a
 * pergunta "essa serve?" chega TODA semana, e ela chega porque a instrução em
 * texto ("foto nítida, de frente, com boa luz") não descreve nenhuma foto que a
 * pessoa tenha na mão. Uma FOTO ao lado da palavra descreve.
 *
 * Quatro decisões que este arquivo carrega:
 *
 * 1. **A regra que os doze cartões ensinam é uma só**: a foto do clone é a
 *    pessoa SENTADA, como quem grava, com a boca em posição de fala e sem
 *    sorriso congelado. Por isso "De pé" e "De pé, sorrindo" estão na coluna
 *    vermelha mesmo sendo fotos boas — boas para outra coisa.
 *
 * 2. **O motivo é o rótulo, e o rótulo é curto.** "Boa luz", "Reflexo",
 *    "Longe". Frase explicando por que a foto de longe não serve é frase que
 *    ninguém lê num quadro de doze cartões — e a palavra basta para a pessoa
 *    olhar a própria foto e decidir.
 *
 * 3. **A fonte da verdade são os arquivos de `public` → `manual` → `fotos`,** e o
 *    caminho de cada um está escrito por extenso aqui embaixo. Nada de montar
 *    `src` por template: caminho montado quebra em silêncio (imagem some, nada
 *    no console) e o build não avisa.
 *
 * 4. **Aqui o texto NÃO é decorativo.** As cenas do manual são `aria-hidden`
 *    inteiras; este quadro não é uma cena. Rótulos, títulos dos grupos e o
 *    `alt` de cada foto são a informação — quem usa leitor de tela ouve a foto
 *    descrita E o veredito. Escondidos ficam só os SELOS, que são desenho.
 *
 * ─── E POR QUE OS DOZE NÃO NASCEM NA TELA ────────────────────────────────────
 *
 * Doze fotos abertas de uma vez são uma parede: quem chega rola por elas como
 * quem rola por um banco de imagens, e nenhuma é olhada. Agora existe um
 * convite ("ver os exemplos"), e os cartões ENTRAM um a um — primeiro os seis
 * que servem, depois os seis que não servem. O escalonamento é o que faz o olho
 * pousar em cada foto por um instante, que é justamente o que se pede que a
 * pessoa faça com a foto dela.
 *
 * A ordem da entrada é a ordem da GRADE, e isso é decisão, não descuido: um
 * atraso que pula de um canto para o outro do quadro lê como pisca-pisca, e
 * reordenar os cartões para "revelar numa ordem melhor" mudaria as posições de
 * um quadro que já foi aprovado como está.
 *
 * `useReducedMotion` entrega os doze de uma vez, sem entrada nenhuma — quem
 * pediu menos movimento continua recebendo o quadro inteiro, e não um quadro
 * que aparece em conta-gotas.
 */
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { EASE } from './tempo';

interface Exemplo {
  /** O caminho literal do asset — escrito à mão, um por cartão. */
  readonly src: string;
  /** O rótulo do cartão: uma palavra, ou duas quando a segunda é inevitável. */
  readonly rotulo: string;
  /** A foto descrita E julgada, para quem não vê a imagem. */
  readonly alt: string;
  readonly largura: number;
  readonly altura: number;
}

const SERVE: readonly Exemplo[] = [
  {
    src: '/manual/fotos/serve-de-frente.avif',
    rotulo: 'De frente',
    alt: 'Homem sentado de frente para a câmera, com o rosto inteiro no quadro — serve',
    largura: 450,
    altura: 800,
  },
  {
    src: '/manual/fotos/serve-cenario-real.avif',
    rotulo: 'Cenário real',
    alt: 'Homem sentado no estúdio em que grava, com microfone e painel ao fundo — serve',
    largura: 450,
    altura: 800,
  },
  {
    src: '/manual/fotos/serve-boa-luz.avif',
    rotulo: 'Boa luz',
    alt: 'Homem com o rosto bem iluminado, sem sombra cobrindo os olhos — serve',
    largura: 450,
    altura: 800,
  },
  {
    src: '/manual/fotos/serve-natural.avif',
    rotulo: 'Natural',
    alt: 'Homem sentado na poltrona com expressão natural, sem pose — serve',
    largura: 450,
    altura: 800,
  },
  {
    src: '/manual/fotos/serve-boca-em-fala.avif',
    rotulo: 'Boca em fala',
    alt: 'Mulher sentada diante do microfone, com a boca aberta em posição de fala — serve',
    largura: 469,
    altura: 800,
  },
  {
    src: '/manual/fotos/serve-sentado.avif',
    rotulo: 'Sentado',
    alt: 'Homem sentado como quem vai gravar, enquadrado do peito para cima — serve',
    largura: 450,
    altura: 800,
  },
];

const NAO_SERVE: readonly Exemplo[] = [
  {
    src: '/manual/fotos/nao-serve-maos-no-rosto.avif',
    rotulo: 'Mãos no rosto',
    alt: 'Homem com as mãos apoiadas no queixo, tapando parte do rosto — não serve',
    largura: 533,
    altura: 800,
  },
  {
    src: '/manual/fotos/nao-serve-bracos-cruzados.avif',
    rotulo: 'Braços cruzados',
    alt: 'Homem em pé com os braços cruzados na frente do corpo — não serve',
    largura: 533,
    altura: 800,
  },
  {
    src: '/manual/fotos/nao-serve-de-pe.avif',
    rotulo: 'De pé',
    alt: 'Homem de pé, de corpo inteiro, fora da posição de quem grava sentado — não serve',
    largura: 533,
    altura: 800,
  },
  {
    src: '/manual/fotos/nao-serve-longe.avif',
    rotulo: 'Longe',
    alt: 'Homem em pé no fundo do cômodo, com o rosto pequeno no quadro — não serve',
    largura: 600,
    altura: 800,
  },
  {
    src: '/manual/fotos/nao-serve-reflexo.avif',
    rotulo: 'Reflexo',
    alt: 'Homem de óculos com o reflexo da luz nas lentes cobrindo os olhos — não serve',
    largura: 533,
    altura: 800,
  },
  {
    src: '/manual/fotos/nao-serve-de-pe-sorrindo.avif',
    rotulo: 'De pé, sorrindo',
    alt: 'Mulher em pé, com sorriso aberto e posado para retrato — não serve',
    largura: 534,
    altura: 800,
  },
];

const VERDE = '#34D399';
const VERMELHO = '#F87171';

/**
 * O intervalo entre um cartão e o próximo, em segundos.
 *
 * Doze cartões a 0,09 fecham a revelação em pouco mais de um segundo e meio
 * contando a transição do último. Mais lento que isso e o quadro vira espera;
 * mais rápido e os doze aparecem juntos, que é o que se está tentando evitar.
 */
const PASSO = 0.09;

/* ─── O CARTÃO E OS DOIS GRUPOS ────────────────────────────────────────────── */

/** O selo do veredito: o visto verde ou o xis vermelho, sempre com a palavra. */
function Selo({ serve }: { serve: boolean }) {
  const cor = serve ? VERDE : VERMELHO;
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0" focusable="false">
      <circle cx={12} cy={12} r={11} fill="none" stroke={cor} strokeWidth={1.6} />
      <path
        d={serve ? 'M 7 12.5 l 3.4 3.4 L 17 8.6' : 'M 8 8 l 8 8 M 16 8 l -8 8'}
        fill="none"
        stroke={cor}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface CartaoProps {
  readonly exemplo: Exemplo;
  readonly serve: boolean;
  /** A posição do cartão na revelação inteira — 0 a 11, não 0 a 5. */
  readonly ordem: number;
  readonly animar: boolean;
}

function Cartao({ exemplo, serve, ordem, animar }: CartaoProps) {
  // Sem animação, o `motion.li` desenha um `<li>` limpo, sem estilo inline: é o
  // mesmo cartão de antes, e não uma cópia dele parada no fim da transição.
  const entrada: MotionProps = animar
    ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: EASE, delay: ordem * PASSO },
      }
    : {};
  return (
    <motion.li
      {...entrada}
      className="overflow-hidden rounded-2xl border border-doxa-line bg-doxa-surface"
    >
      {/* A moldura manda no formato; `object-cover` absorve as proporções
          diferentes das fotos sem esticar ninguém. */}
      <div className="aspect-[4/5] w-full bg-doxa-raised">
        <img
          src={exemplo.src}
          alt={exemplo.alt}
          width={exemplo.largura}
          height={exemplo.altura}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center gap-2 px-3 py-3">
        <Selo serve={serve} />
        <span className="text-[16px] leading-tight text-white/80">{exemplo.rotulo}</span>
      </div>
    </motion.li>
  );
}

interface GrupoProps {
  readonly titulo: string;
  readonly serve: boolean;
  readonly exemplos: readonly Exemplo[];
  /** Quantos cartões já entraram antes deste grupo. */
  readonly inicio: number;
  readonly animar: boolean;
}

function Grupo({ titulo, serve, exemplos, inicio, animar }: GrupoProps) {
  return (
    <section>
      <h4 className="flex items-center gap-2 text-[17px] font-medium text-white/85">
        <Selo serve={serve} />
        {titulo}
      </h4>
      {/* Seis cartões por grupo: 2×3 no celular, 3×2 a partir do `sm`. Três
          colunas no celular deixariam o rosto pequeno demais para julgar a luz,
          que é justamente o que se pede para olhar. */}
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {exemplos.map((exemplo, indice) => (
          <Cartao
            key={exemplo.src}
            exemplo={exemplo}
            serve={serve}
            ordem={inicio + indice}
            animar={animar}
          />
        ))}
      </ul>
    </section>
  );
}

/**
 * Os doze cartões, sem estado nenhum — é este pedaço que o teste desenha.
 *
 * Ele existe separado do componente de fora por um motivo prático: o teste roda
 * em `renderToStaticMarkup`, onde não há clique. Sem um miolo exportado, provar
 * que os doze `alt` continuam de pé exigiria um DOM e uma dependência nova.
 */
export function Quadro() {
  const animar = !(useReducedMotion() ?? false);
  return (
    <div className="space-y-8">
      <Grupo titulo="Assim serve" serve exemplos={SERVE} inicio={0} animar={animar} />
      <Grupo
        titulo="Assim não serve"
        serve={false}
        exemplos={NAO_SERVE}
        inicio={SERVE.length}
        animar={animar}
      />
    </div>
  );
}

/* ─── O CONVITE E O GUIA ───────────────────────────────────────────────────── */

// O desenho do botão secundário de `publico/pecas`, repetido de propósito:
// `cenas/` não importa de `publico/` (é a direção de import do módulo), e uma
// peça compartilhada só para esta classe custaria mais do que a repetição.
const BOTAO_SECUNDARIO =
  'inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full ' +
  'border border-white/[0.14] px-6 text-[17px] text-white/80 transition-colors ' +
  'hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-doxa-bg';

/** O botão branco e cheio: o elemento mais claro — e mais alto — da seção. */
const BOTAO_DO_GUIA =
  'inline-flex min-h-[64px] w-full items-center justify-center gap-3 rounded-full ' +
  'bg-white px-6 text-[18px] font-medium text-black transition-colors hover:bg-white/90 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-doxa-bg';

/** O convite que abre o quadro — nada aparece antes de alguém pedir. */
function Convite({ aoAbrir }: { aoAbrir: () => void }) {
  return (
    <button type="button" onClick={aoAbrir} className={BOTAO_SECUNDARIO}>
      Ver os 12 exemplos de fotos
    </button>
  );
}

/**
 * O guia completo, e o elemento de maior destaque da seção.
 *
 * Ele é o que resolve a dúvida INTEIRA — os doze cartões respondem "essa
 * serve?", o guia responde "como tiro uma que sirva". Discreto no rodapé, como
 * era antes, ele quase não era clicado.
 */
function GuiaEmPdf() {
  return (
    <a href="/manual/guia-de-fotos.pdf" target="_blank" rel="noreferrer" className={BOTAO_DO_GUIA}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 shrink-0" focusable="false">
        <path
          d="M 12 4 v 11 m 0 0 l -4 -4 m 4 4 l 4 -4 M 5 19 h 14"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-left">
        Baixe nosso guia de fotos
        <span className="block text-[15px] font-normal text-black/60">
          como tirar as suas melhores fotos
        </span>
      </span>
    </a>
  );
}

export default function ExemplosDeFotos() {
  const [revelado, setRevelado] = useState(false);
  // Nada de `focus()` no quadro recém-aberto: foco na montagem é o que faz a
  // página rolar sozinha neste site (as seções são `lazy`), e o quadro já nasce
  // exatamente onde o botão estava.
  return (
    <div className="space-y-6">
      {revelado ? <Quadro /> : <Convite aoAbrir={() => setRevelado(true)} />}
      <GuiaEmPdf />
    </div>
  );
}
