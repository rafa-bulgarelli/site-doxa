/**
 * ─── O FECHO DO ARCO ─────────────────────────────────────────────────────────
 *
 * O pedido do dono, na frase dele: "quando as animações atingem o último estágio
 * — deu tudo certo — TODAS tenham o degradê, aquele gradiente colorido que a
 * gente tem nas demais animações. Muito sucinto, muito simples, muito elegante."
 *
 * ─── OS TRÊS TEMPOS ──────────────────────────────────────────────────────────
 *
 * Também dele, e é a doutrina que esta peça fecha: "são três tempos: 1. aparece
 * a animação. 2. destaca. 3. dá certo — com um brilhozinho." O visto verde já
 * cobria o terceiro tempo, mas sozinho ele JULGA sem COMEMORAR: verde é o
 * veredito, e veredito é uma informação, não uma festa. O degradê entra junto
 * com ele — o mesmo instante, nunca antes — e é o que transforma "está correto"
 * em "deu certo".
 *
 * ─── POR QUE UMA PEÇA SÓ, E COMPARTILHADA ────────────────────────────────────
 *
 * São dezenove cenas. Cada uma desenhando o seu próprio brilhinho de sucesso
 * daria dezenove brilhos parecidos e nenhum igual — que é exatamente como um
 * conjunto de desenhos deixa de parecer o mesmo site, e foi o diagnóstico que
 * criou `pecas.tsx` e `luz.tsx`. Com uma peça, a consistência é por CONSTRUÇÃO,
 * e afinar o gesto depois é mexer em um arquivo.
 *
 * ─── AS QUATRO DECISÕES ──────────────────────────────────────────────────────
 *
 * 1. **A paleta não é nova.** O `arco` de `luz.tsx` é o MESMO gradiente que já
 *    corre na curva do SemCompra, no "60" do Sessenta e nos fios da garantia —
 *    e, antes deles, no efeito Siri da seção de dúvidas. Inventar outro degradê
 *    aqui seria pôr um violeta de outra família no fim de toda cena.
 *
 * 2. **Um gesto, e curto.** Um arco raso que passa POR BAIXO do veredito, como
 *    quem sublinha. Não é um segundo carimbo disputando o olho com o visto: é o
 *    chão que ele ganha. Sobriedade continua a lei — o arco é o tempero do
 *    sucesso, não a festa.
 *
 * 3. **O halo vem de graça — e tem de ser MAGRO.** `TracoDeLuz` desenha o mesmo
 *    caminho três vezes (grosso e quase transparente, médio, fino e cheio), e
 *    sobre preto isso lê como neon sem um `feGaussianBlur`. A primeira versão
 *    desta peça pediu `halo={5}` sobre um traço de 2,2 e caiu na armadilha que o
 *    próprio `TracoDeLuz` documenta: num glifo pequeno o halo FECHA o desenho —
 *    ele encosta nele mesmo, a barriga do arco some e o que fica é uma pílula
 *    colorida com a forma de nada. Era exatamente o "grosso, sem hierarquia"
 *    que o dono já reprovou em outra cena. Traço fino (1,8) e halo curto (2,6)
 *    devolvem a LINHA, que é o que um sublinhado tem de ser.
 *
 * 4. **Quem pediu menos movimento vê o fecho ASSENTE.** Nada de traço pela
 *    metade nem de respiração: o quadro parado é o do fim da história, e nele o
 *    degradê já está posto. É `TracoDeLuz` quem trata isso, pelo `parado`.
 */
import { motion } from 'framer-motion';
import { TracoDeLuz, useTintas } from './luz';

/**
 * O gesto, desenhado na ORIGEM — quem chama o coloca com `x`/`y`.
 *
 * É um arco raso e LARGO de propósito: 68 de vão para 6 de barriga. A curvatura
 * sugere um sorriso sem virar meia-lua, e a proporção é o que mantém o gesto
 * legível como linha — um arco curto e fundo, com o traço e o halo por cima,
 * vira mancha. Aberto para BAIXO porque ele sublinha: para cima viraria taça.
 *
 * ⚠️ A barriga de sete unidades também é estrutural. O gradiente `arco` é
 * horizontal e mora em `objectBoundingBox`: uma linha PERFEITAMENTE reta tem
 * caixa de altura zero, e a regra do SVG para caixa degenerada é não desenhar o
 * elemento. Um sublinhado reto sumiria sem erro, sem console e sem nada — a
 * mesma morte silenciosa do `url(#)` que aponta para gradiente inexistente.
 */
export const ARCO_DO_FECHO = 'M -34 8 Q 0 20 34 8';

interface FechoDoArcoProps {
  /** O centro do veredito que ele sublinha. */
  readonly x: number;
  /**
   * A linha de onde o arco desce.
   *
   * Fica ABAIXO do centro do visto, e não nele: o visto tem halo, e o halo
   * ocupa uns treze pontos para baixo do centro em escala 1. Encostado, o
   * degradê vira sujeira grudada no carimbo em vez de chão dele.
   */
  readonly y: number;
  /** 1 é o tamanho ao lado de um visto de escala 1. Escala traço e halo junto. */
  readonly escala?: number;
  readonly parado: boolean;
}

/**
 * O degradê que diz que deu certo.
 *
 * O `translate`/`scale` mora no grupo de FORA e a animação no de dentro: framer
 * escreve o atributo `transform` do elemento que anima, e um deslocamento no
 * mesmo nó seria apagado no primeiro quadro — a armadilha que a `Marca`, o
 * `Selo` e o `Ruido` já documentam.
 */
export function FechoDoArco({ x, y, escala = 1, parado }: FechoDoArcoProps) {
  const cor = useTintas()('arco');
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <motion.g
        initial={false}
        // A respiração começa DEPOIS de o traço terminar de se desenhar: com as
        // duas ao mesmo tempo, o arco nasce piscando em vez de nascer riscando,
        // e o gesto de fechar a história se perde no meio da entrada.
        animate={parado ? { opacity: 1 } : { opacity: [1, 0.72, 1] }}
        transition={
          parado
            ? { duration: 0 }
            : { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.75 }
        }
      >
        {/*
         * `halo` em 2,6 — a mesma conta dos outros glifos pequenos da pasta (a
         * tesoura do Intacto, a nota do ruído). É dele que vem o "brilhozinho"
         * que o dono pediu, sem uma segunda forma no palco. Ver a decisão 3 do
         * cabeçalho para o que acontece quando este número cresce.
         */}
        <TracoDeLuz
          d={ARCO_DO_FECHO}
          cor={cor}
          largura={1.8}
          halo={2.6}
          parado={parado}
          riscando
          duracao={0.65}
        />
      </motion.g>
    </g>
  );
}
