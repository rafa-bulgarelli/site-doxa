import { Fragment, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { ITENS, TEMPO, type Item } from './config';
import { Icone } from './icones';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * De quanto em quanto tempo entra o próximo item, em segundos.
 *
 * Vinte e cinco itens a trinta e cinco milésimos dão pouco menos de um segundo:
 * rápido o bastante para ninguém esperar, lento o bastante para a conta parecer
 * que está sendo somada na frente da pessoa. É a diferença entre uma lista que
 * aparece e uma lista que se ACUMULA — e o acúmulo é o argumento inteiro.
 */
const CASCATA = 0.035;

/** Tamanho da lâmina que segue o ponteiro, em pixels. */
const LAMINA = { w: 236, h: 322 };

/**
 * Quanto a lâmina se afasta do ponteiro, em pixels.
 *
 * Ela voltou a ficar POR CIMA do texto, opaca, a pedido do dono — atrás, os
 * dizeres da ladainha cruzavam por cima dela e o cartão parecia translúcido. Por
 * cima e centrada no cursor, porém, ela tapa a palavra que acabou de acender.
 * Deslocada de lado, as duas coisas convivem: o cartão sólido e a palavra
 * legível ao lado dele.
 *
 * O lado é escolhido pela metade da tela em que a mão está, senão a lâmina sai
 * pela borda direita justamente nos itens do fim da lista.
 */
const AFASTA = 28;

/**
 * Como a lâmina persegue o ponteiro.
 *
 * Mola, e não posição direta. Seguir o cursor exatamente faz a imagem parecer
 * grudada nele — um cursor grande, não um objeto. Com atraso e um resto de
 * inércia ela parece uma coisa carregada pela mão, que é o que dá a sensação de
 * peso. Os dois eixos com a mesma mola, senão o movimento entorta na diagonal.
 */
const PERSEGUE = { stiffness: 220, damping: 26, mass: 0.6 };

/**
 * A lâmina: o que aparece sob o ponteiro quando um item é apontado.
 *
 * PENDENTE-DONO: hoje é ícone sobre cor, porque não existem vinte e cinco fotos
 * no repositório — as de `public/media/` são reels de cliente e não têm relação
 * com "uma câmera" ou "um roteirista". A estrutura já espera a foto: quando o
 * campo `imagem` do item existir, ela entra aqui e o resto continua igual.
 */
function Lamina({ item }: { item: Item }) {
  return (
    <div className="flex h-full w-full flex-col gap-2.5">
      {/* O nome em cima do cartão, a pedido do dono.

          Sem ele, a lâmina depende de a pessoa manter o olho na palavra que
          acendeu enquanto olha para um cartão que apareceu em outro lugar da
          tela — duas coisas ao mesmo tempo, e é justamente por isso que o
          cartão anda deslocado do ponteiro. Com a legenda em cima, o objeto se
          apresenta e a ligação com a lista deixa de exigir trabalho.

          Cápsula escura e não texto solto: a lâmina passeia por cima da
          ladainha, e um rótulo sem fundo ficaria por cima de outras palavras. */}
      <span className="w-fit shrink-0 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-[13px] leading-none text-white backdrop-blur-sm">
        {item.nome}
      </span>

      <div
        className="flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/25"
        style={{
          background: item.cor,
          // O brilho é da cor da própria lâmina: uma sombra preta debaixo de um
          // cartão colorido só o afunda no fundo preto. Assim ele acende o que
          // está em volta, que é o que o dono pediu.
          boxShadow: `0 30px 90px -25px ${item.cor}, 0 0 60px -10px ${item.cor}66`,
        }}
      >
        {item.imagem == null ? (
          <span className="text-[#0B0B0B]/80">
            <Icone nome={item.icone} className="h-16 w-16" />
          </span>
        ) : (
          <img src={item.imagem} alt="" aria-hidden className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}

/**
 * A conta do jeito antigo, escrita como uma ladainha — e ilustrada no ponteiro.
 *
 * Corrida e em corpo grande, com o artigo na frente de cada item: uma coisa
 * depois da outra depois da outra, que é como a conta chega no fim do mês. Uma
 * ficha técnica em colunas organiza um inventário e lê como catálogo de
 * fornecedor; isto aqui dói em quem paga, que era o pedido.
 *
 * Apontar um item acende a palavra e traz uma lâmina que entra crescendo e segue
 * a mão. Só no desktop: no telefone não há ponteiro para seguir, e uma imagem
 * presa ao dedo em cima do texto seria uma imagem tapando o texto.
 */
export function Ladainha() {
  const ref = useRef<HTMLParagraphElement>(null);
  const naTela = useInView(ref, { amount: 0.2, once: true });
  const isDesktop = useIsDesktop();
  const parado = useReducedMotion() === true;
  const podeSeguir = isDesktop && !parado;

  const [apontado, setApontado] = useState<Item | null>(null);
  const [aEsquerda, setAEsquerda] = useState(false);
  const x = useSpring(0, PERSEGUE);
  const y = useSpring(0, PERSEGUE);

  const seguir = (evento: React.MouseEvent) => {
    if (!podeSeguir) return;
    // Escrito em coordenadas de tela porque a lâmina é `fixed`: dentro do
    // painel escuro ela seria cortada pelo `overflow` da seção, e o pedido é que
    // ela ande pela tela inteira.
    x.set(evento.clientX);
    y.set(evento.clientY);
    setAEsquerda(evento.clientX > window.innerWidth * 0.6);
  };

  const apontar = (item: Item) => (evento: React.MouseEvent) => {
    if (!podeSeguir) return;
    // O primeiro frame não pode ter mola: sem isto a lâmina nasce onde estava o
    // último item apontado e atravessa a tela para chegar ao ponteiro.
    if (apontado == null) {
      x.jump(evento.clientX);
      y.jump(evento.clientY);
    }
    setAEsquerda(evento.clientX > window.innerWidth * 0.6);
    setApontado(item);
  };


  return (
    <>
      {/* Os handlers vivem no parágrafo, que voltou a ser a caixa de TUDO que
          se aponta.

          Eles moraram num envelope por um tempo, e por um motivo real: o tempo
          era um bloco irmão, fora do parágrafo, e sair da conta por ele nunca
          disparava o `mouseleave` — a lâmina ficava travada na tela depois de o
          ponteiro já ter ido embora. Com o tempo de volta para dentro da conta,
          o envelope não guarda mais nada que o parágrafo não guarde. */}
      <p
        ref={ref}
        onMouseMove={seguir}
        onMouseLeave={() => setApontado(null)}
        // Justificado, na SANS, e com o vão horizontal igual ao vertical.
        //
        // `word-spacing` de 0,75em com `line-height` 1,75 é a conta que o dono
        // pediu: entrelinha de 1,75 deixa 0,75em de respiro entre as linhas, e
        // é exatamente o espaço que separa um item do seguinte na mesma linha.
        // A justificação ainda estica esses vãos, mas partindo de um vão largo a
        // variação vira uma fração pequena dele — o bloco fica uniforme sem
        // deixar de encostar nas duas margens.
        //
        // O vão vale só ENTRE os itens. `word-spacing` é herdado e cai sobre
        // todo espaço, inclusive os de dentro de cada frase: na primeira
        // tentativa "Um video maker." virou três palavras soltas com o mesmo vão
        // que separa um item do outro, e a lista deixou de ter itens. Cada item
        // devolve o vão ao normal e é `nowrap`, o que também tira de dentro dele
        // os pontos onde a justificação poderia esticar.
        //
        // É a mudança que mais transformou o painel. Com tudo em Instrument
        // Serif, o olho lia "grande, médio, pequeno": um só tom em três
        // tamanhos, que é o que fazia a seção parecer simples demais. Com duas
        // famílias ele passa a ler "manchete" e "documento" — o título e o valor
        // continuam serifados, e a conta vira letra de fatura.
        className="relative z-10 text-justify text-[17px] leading-[1.75] text-white/45 [word-spacing:0.55em] md:text-[1.4rem] md:[word-spacing:0.7em] lg:text-[1.55rem] lg:leading-[1.75] lg:[word-spacing:0.75em]"
      >
        {ITENS.map((item, i) => {
          const atraso = i * CASCATA;
          const aceso = apontado === item;
          return (
            // O espaço é um nó de texto de verdade, e não uma margem: a
            // justificação estica os ESPAÇOS entre as caixas, e uma margem fixa
            // não é espaço nenhum. Com `mr-[0.35em]` as linhas continuavam
            // terminando onde queriam.
            <Fragment key={item.nome}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={naTela ? { opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: EASE, delay: atraso }}
              onMouseEnter={apontar(item)}
              className={`inline-block whitespace-nowrap [word-spacing:normal] transition-colors duration-300 ${
                podeSeguir ? 'cursor-default' : ''
              } ${
                aceso ? 'text-white' : apontado == null ? 'text-white/45' : 'text-white/20'
              }`}
            >
              <span className="mr-[0.45em] text-[0.6em] tabular-nums text-white/25">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.nome}
            </motion.span>{' '}
            </Fragment>
          );
        })}

        {/* ── O TEMPO, na LINHA DELE — a pedido do dono, e é a segunda vez que
            este pedaço muda de lugar.

            Ele já foi bloco solto embaixo da conta; voltou para a fila como item
            vinte e seis; e agora desce de novo, em destaque. Vale registrar as
            duas leituras, porque as duas são verdadeiras e a escolha é do dono:
            na fila, o tempo é mais uma linha da fatura e a conta termina cobrando
            algo que não estava escrita na nota; embaixo e sozinho, ele deixa de
            ser item e vira o TOTAL — a linha que fecha a soma.

            O que NÃO se repete é o defeito que tirou ele daqui da primeira vez.
            Como bloco irmão, fora do parágrafo, sair da conta por cima dele
            nunca disparava o `mouseleave` do parágrafo, e a lâmina que segue o
            ponteiro ficava travada na tela depois de a mão já ter ido embora.
            Por isso ele continua DENTRO do `<p>`: um `span` em `display: block`
            ganha a linha inteira sem sair do envelope que escuta o mouse — e
            um `<div>` aqui seria conteúdo de bloco dentro de parágrafo, que é
            HTML inválido mesmo o React aceitando montar.

            O filete em cima é o que faz a leitura de total: vinte e cinco itens,
            uma linha, e embaixo dela a única coisa que a lista não sabe cobrar.
            Sem ele, o tempo lê como um comentário solto sobre a conta — que foi
            exatamente a razão de ele ter voltado para a fila da outra vez.

            O gatilho é o próprio texto, e é a mesma razão dos outros itens: numa
            caixa de largura inteira, a lâmina apareceria com o ponteiro a mil
            pixels da palavra, em qualquer ponto vazio da linha. Daí o
            `w-fit`. */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={naTela ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: ITENS.length * CASCATA + 0.2 }}
          onMouseEnter={apontar(TEMPO)}
          className={`mt-7 block w-fit border-t border-white/[0.12] pt-7 [word-spacing:normal] font-serif text-[2rem] leading-none text-[#F4F1E8] md:mt-9 md:pt-9 md:text-[3rem] ${
            podeSeguir ? 'cursor-default' : ''
          }`}
        >
          {TEMPO.nome}
        </motion.span>
      </p>

      {/* Fora do parágrafo e `fixed`: presa ao fluxo, a lâmina seria recortada
          pelo painel e não poderia acompanhar a mão até a borda da tela. */}
      <AnimatePresence>
        {apontado != null && podeSeguir && (
          <motion.div
            /*
             * A chave é o ITEM, e é ela que faz o salto acontecer em todo
             * hover. Sem chave, apontar outro item trocava só o conteúdo de um
             * elemento que continuava montado — e `initial` só roda quando algo
             * entra em cena. O efeito acontecia uma vez, na primeira lâmina da
             * sessão, e nunca mais.
             */
            key={apontado.nome}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-40"
            style={{ x, y, width: LAMINA.w, height: LAMINA.h }}
            /*
             * A lâmina não CHEGA: ela salta para o lugar.
             *
             * Antes era uma curva de tempo — 0,72 até 1 em quatro décimos — e o
             * dono leu como um cartão "vindo do além", que é exatamente o que
             * uma escala uniforme parece: um objeto viajando de longe, na mesma
             * velocidade o caminho inteiro.
             *
             * Agora são duas molas com atritos diferentes. A escala parte de
             * bem menor e passa DO PONTO antes de assentar — é o que dá o
             * estalo de coisa que aparece em vez de coisa que se aproxima. A
             * rotação tem amortecimento mais baixo de propósito: ela cruza o
             * zero mais de uma vez, tomba para um lado, volta menos para o
             * outro, e para. É a borracha que o dono pediu, e vem da física do
             * movimento em vez de uma lista de quadros escrita à mão — uma
             * mola não repete o mesmo balanço duas vezes, e por isso não vira
             * um tique.
             *
             * A opacidade fica FORA das molas, numa curva curta de tempo: presa
             * a uma mola elástica, ela também passaria do ponto, e "mais de cem
             * por cento opaco" não existe — o que se vê é a lâmina piscando no
             * fim do salto.
             */
            initial={parado ? { opacity: 0 } : { opacity: 0, scale: 0.42, rotate: -7 }}
            animate={parado ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.84, transition: { duration: 0.22, ease: 'easeIn' } }}
            transition={
              parado
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 0.16, ease: 'easeOut' },
                    scale: { type: 'spring', stiffness: 470, damping: 13, mass: 0.75 },
                    rotate: { type: 'spring', stiffness: 300, damping: 8.5, mass: 0.6 },
                  }
            }
          >
            {/* O deslocamento vive aqui dentro para não brigar com o `x`/`y` da
                mola: a lâmina fica ao lado da mão sem que a posição precise ser
                recalculada a cada frame. */}
            <div
              className="h-full w-full transition-transform duration-300"
              style={{
                transform: aEsquerda
                  ? `translate(calc(-100% - ${AFASTA}px), -50%)`
                  : `translate(${AFASTA}px, -50%)`,
              }}
            >
              <Lamina item={apontado} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
