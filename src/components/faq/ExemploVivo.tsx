import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Quanto o caractere cai de cima antes de assentar, em pixels.
 *
 * O mesmo número do campo do formulário (`comparacao/CampoVivo.tsx`), e a mesma
 * razão: curto, para a letra chegar junto com a batida. Aqui ninguém está
 * digitando, mas o gesto imitado é o de digitação — se a letra demora, o campo
 * deixa de parecer alguém escrevendo e passa a parecer um texto aparecendo.
 */
const QUEDA = 14;

/** A mola da queda: atrito baixo, a letra passa do lugar e volta menos. */
const CHEGADA = { type: 'spring', stiffness: 620, damping: 12, mass: 0.55 } as const;

/**
 * A BORRACHA: como a letra sai.
 *
 * Ela não cai de volta nem desliza — some ONDE ESTÁ, desbotando e borrando ao
 * mesmo tempo, que é o que o traço apagado faz no papel. E é rápida: apagar é a
 * parte chata do ciclo, e o `useExemploVivo` já apaga de duas em duas letras
 * justamente para não fazer ninguém assistir a isso.
 *
 * O efeito depende de as letras que saem CONTINUAREM no fluxo enquanto somem —
 * é o `AnimatePresence` que garante isso. O cursor, que é medido pelo texto já
 * sem elas, corre para a esquerda por cima das que estão desaparecendo: é a
 * borracha passando, e não o texto encolhendo.
 */
const BORRACHA = { opacity: 0, scale: 0.86, y: 3, filter: 'blur(2.5px)' } as const;
const SAIDA = { duration: 0.16, ease: 'easeIn' } as const;

/**
 * A mola do cursor: atrito ALTO.
 *
 * A mesma do formulário, e o motivo é o mesmo: com atrito alto ela não balança,
 * apenas alcança. É o que se quer de um cursor — suave, e sem inércia visível
 * atrás do que já foi escrito.
 */
const PONTEIRO = { type: 'spring', stiffness: 900, damping: 52, mass: 0.5 } as const;

/**
 * O respiro entre a última letra e o cursor, em `em`.
 *
 * O mesmo do formulário. A largura medida é onde o PRÓXIMO caractere começa, e
 * um traço plantado ali encosta no anterior — em serifa, com a cauda do "ç" ou
 * a perna do "q", ele lê como parte do desenho da letra em vez de como cursor.
 * Em `em` e não em pixels porque o corpo muda no telefone.
 *
 * Não existe no texto vazio: ali não há letra de que se afastar, e o cursor tem
 * de nascer exatamente onde a primeira letra vai cair.
 */
const RESPIRO_CURSOR = 0.15;

/**
 * O texto que se escreve sozinho na pastilha, letra por letra, com cursor.
 *
 * ─── É O MESMO GESTO DO CAMPO DO FORMULÁRIO ──────────────────────────────────
 *
 * Pedido do dono, e a página ganha com a repetição: `comparacao/CampoVivo.tsx`
 * é o campo em que a pessoa digita de verdade, e ele desenha cada letra caindo
 * com mola e um cursor que desliza atrás delas. Aqui embaixo o campo escreve
 * SOZINHO — e escrevendo com a mesma física, ele demonstra o objeto que existe
 * duas seções acima em vez de imitar um terminal genérico.
 *
 * ─── O CURSOR É MEDIDO, e não posicionado no fluxo ───────────────────────────
 *
 * Um traço escrito depois da última letra andaria aos saltos: ele estaria numa
 * casa nova a cada caractere, e caixa de texto não interpola posição de glifo.
 * Então ele é absoluto, e o `x` dele vem de um medidor invisível que carrega o
 * mesmo texto na mesma fonte — a largura DELE é onde o cursor tem de estar. É a
 * mola que faz o resto.
 *
 * ─── E A LINHA DE BASE É MEDIDA TAMBÉM ───────────────────────────────────────
 *
 * Centrar o cursor na altura da caixa erra: a caixa de uma linha é mais alta
 * que a letra, e o glifo não fica no meio dela — assenta na linha de base, com
 * a entrelinha dividida em cima e embaixo. O marcador de altura zero resolve
 * sem precisar saber nada das métricas da fonte: um `inline-block` vazio alinha
 * a própria borda de baixo com a linha de base da linha em que está, então o
 * `offsetTop` dele É a linha de base.
 *
 * O marcador só funciona dentro de uma LINHA: num container `flex` ele vira
 * item de flex, o `align-items` o centra, e a medida sai errada. Por isso esta
 * camada é bloco comum — quem centra a pastilha na vertical é o pai.
 */
export function ExemploVivo({ texto }: { texto: string }) {
  const medidorRef = useRef<HTMLSpanElement>(null);
  const baseRef = useRef<HTMLSpanElement>(null);
  const [cursorX, setCursorX] = useState(0);
  const [baseY, setBaseY] = useState(0);

  useLayoutEffect(() => {
    const medidor = medidorRef.current;
    const marcador = baseRef.current;
    if (medidor != null) {
      const largura = medidor.scrollWidth;
      const em = parseFloat(getComputedStyle(medidor).fontSize);
      setCursorX(largura > 0 ? largura + RESPIRO_CURSOR * em : 0);
    }
    if (marcador != null) setBaseY(marcador.offsetTop);
  }, [texto]);

  return (
    <span className="relative block whitespace-pre">
      {/* O medidor: o mesmo texto, invisível e fora do fluxo. A largura dele é a
          posição do cursor. Ele carrega o texto SEM as letras que estão saindo,
          que é justamente o que faz o cursor passar por cima delas. */}
      <span
        ref={medidorRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0"
      >
        {texto}
      </span>

      <AnimatePresence initial={false}>
        {[...texto].map((letra, i) => (
          <motion.span
            /* Posição + letra. Só a posição faria o React reusar o elemento
               quando a letra daquela casa muda, e a animação não rodaria; só a
               letra colidiria entre repetidas. */
            key={`${i}-${letra}`}
            className="inline-block"
            initial={{ y: -QUEDA, opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            /* A transição da SAÍDA mora dentro da variante de saída, e não na
               prop `transition`. Escrita fora, ela vale para os dois sentidos —
               e a mola da chegada, aplicada ao `opacity` indo a zero, leva a
               vida inteira para assentar. O framer só desmonta a letra quando a
               última propriedade termina, então as letras da frase velha ainda
               estavam no fluxo quando a nova começava a ser escrita: as duas se
               intercalavam e o texto dançava na virada. */
            exit={{ ...BORRACHA, transition: SAIDA }}
            transition={CHEGADA}
          >
            {letra}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* O marcador da linha de base: sem largura, sem altura, sem tinta. */}
      <span ref={baseRef} aria-hidden className="inline-block h-0 w-0" />

      {/* O cursor. Pendurado na linha de base, como o do formulário: sobe pouco
          mais que uma maiúscula e desce um fio abaixo dela. O piscar continua
          sendo o do CSS — ele anima `opacity`, e a mola anima `transform`, então
          os dois convivem no mesmo elemento sem se atropelar. */}
      <motion.span
        aria-hidden
        className="cursor-exemplo pointer-events-none absolute left-0 h-[0.84em] w-[2px] rounded-full bg-current"
        style={{ top: baseY, marginTop: '-0.72em' }}
        animate={{ x: cursorX }}
        transition={PONTEIRO}
      />
    </span>
  );
}
