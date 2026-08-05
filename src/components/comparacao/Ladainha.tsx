import { useRef, useState } from 'react';
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
const LAMINA = { w: 230, h: 280 };

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
      className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: item.cor }}
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
  const x = useSpring(0, PERSEGUE);
  const y = useSpring(0, PERSEGUE);

  const seguir = (evento: React.MouseEvent) => {
    if (!podeSeguir) return;
    // Escrito em coordenadas de tela porque a lâmina é `fixed`: dentro do
    // painel escuro ela seria cortada pelo `overflow` da seção, e o pedido é que
    // ela ande pela tela inteira.
    x.set(evento.clientX);
    y.set(evento.clientY);
  };

  const apontar = (item: Item) => (evento: React.MouseEvent) => {
    if (!podeSeguir) return;
    // O primeiro frame não pode ter mola: sem isto a lâmina nasce onde estava o
    // último item apontado e atravessa a tela para chegar ao ponteiro.
    if (apontado == null) {
      x.jump(evento.clientX);
      y.jump(evento.clientY);
    }
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
        className="relative z-10 font-serif text-[22px] leading-[1.45] tracking-[-0.01em] md:text-[2.6rem] md:leading-[1.35]"
      >
        {todos.map((item) => {
          const atraso = indice * CASCATA + (item === TEMPO ? 0.2 : 0);
          indice += 1;
          const aceso = apontado === item;
          return (
            <motion.span
              key={item.nome}
              initial={{ opacity: 0 }}
              animate={naTela ? { opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: EASE, delay: atraso }}
              onMouseEnter={apontar(item)}
              className={`mr-[0.35em] inline-block transition-colors duration-300 ${
                podeSeguir ? 'cursor-default' : ''
              } ${
                item === TEMPO
                  ? 'text-[#F4F1E8]'
                  : aceso
                    ? 'text-white'
                    : apontado == null
                      ? 'text-white/45'
                      : 'text-white/20'
              }`}
            >
              {item.nome}
            </motion.span>
          );
        })}
      </p>

      {/* Fora do parágrafo e `fixed`: presa ao fluxo, a lâmina seria recortada
          pelo painel e não poderia acompanhar a mão até a borda da tela.

          ATRÁS do texto, e isto é o que faz o efeito funcionar. Por cima, ela
          tapa justamente a palavra que acabou de acender — o ponteiro está em
          cima da palavra, e a lâmina nasce no ponteiro. Por trás, a palavra fica
          legível sobre ela e as duas coisas acontecem juntas: a linha acende e o
          objeto aparece atrás dela. */}
      <AnimatePresence>
        {apontado != null && podeSeguir && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-0"
            style={{ x, y, width: LAMINA.w, height: LAMINA.h }}
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/* O deslocamento vive aqui dentro para não brigar com o `x`/`y` da
                mola: a lâmina fica centrada na mão sem que a centralização
                precise ser recalculada a cada frame. */}
            <div
              className="h-full w-full shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
              style={{ transform: `translate(-50%, -50%)` }}
            >
              <Lamina item={apontado} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
