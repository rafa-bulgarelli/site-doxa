import { Fragment, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import {
  Aperture,
  AtSign,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  Circle,
  Frame,
  HardDrive,
  Hourglass,
  ImageIcon,
  KeyRound,
  Lightbulb,
  Megaphone,
  Mic,
  MonitorPlay,
  Move,
  Music,
  PenLine,
  Scissors,
  Subtitles,
  Target,
  Timer,
  Users,
  Video,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { ITENS, TEMPO, type Item } from './config';

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
const LAMINA = { w: 236, h: 290 };

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
 * Os ícones usados, e SÓ eles.
 *
 * Nomeados um a um de propósito. A primeira versão fazia `import * as icones` e
 * resolvia pelo nome em tempo de execução: elegante de escrever e catastrófico
 * de entregar — o bundle saltou de 104 para 239 quilobytes comprimidos, porque
 * um namespace inteiro impede o tree-shaking e as mil e quinhentas ilustrações
 * da `lucide` foram junto. Vinte e sete importações explícitas custam vinte e
 * sete ícones.
 */
const CATALOGO: Record<string, LucideIcon> = {
  Aperture,
  AtSign,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  Frame,
  HardDrive,
  Hourglass,
  ImageIcon,
  KeyRound,
  Lightbulb,
  Megaphone,
  Mic,
  MonitorPlay,
  Move,
  Music,
  PenLine,
  Scissors,
  Subtitles,
  Target,
  Timer,
  Users,
  Video,
  Wallet,
  Wrench,
};

/** Resolve o ícone pelo nome do `config`, com um genérico se o nome não existir. */
function Icone({ nome }: { nome: string }) {
  const Desenho = CATALOGO[nome] ?? Circle;
  return <Desenho className="h-16 w-16" strokeWidth={1.25} />;
}

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
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-white/25"
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
          <Icone nome={item.icone} />
        </span>
      ) : (
        <img src={item.imagem} alt="" aria-hidden className="h-full w-full object-cover" />
      )}
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

  const todos = [...ITENS, TEMPO];
  let indice = 0;

  return (
    <>
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
        {todos.map((item, i) => {
          const atraso = indice * CASCATA + (item === TEMPO ? 0.2 : 0);
          indice += 1;
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
                item === TEMPO
                  ? 'font-serif text-[1.25em] text-[#F4F1E8]'
                  : aceso
                    ? 'text-white'
                    : apontado == null
                      ? 'text-white/45'
                      : 'text-white/20'
              }`}
            >
              {/* O tempo não é numerado: ele não está na fatura. Os vinte e
                  cinco se contam; o vigésimo sexto é o que não tem preço. */}
              {item !== TEMPO && (
                <span className="mr-[0.45em] text-[0.6em] tabular-nums text-white/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {item.nome}
            </motion.span>{' '}
            </Fragment>
          );
        })}
      </p>

      {/* Fora do parágrafo e `fixed`: presa ao fluxo, a lâmina seria recortada
          pelo painel e não poderia acompanhar a mão até a borda da tela. */}
      <AnimatePresence>
        {apontado != null && podeSeguir && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-40"
            style={{ x, y, width: LAMINA.w, height: LAMINA.h }}
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.4, ease: EASE }}
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
