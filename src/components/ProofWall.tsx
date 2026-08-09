import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
  BadgeCheck,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { WALL_REELS, WALL_REELS_MOBILE, type Reel } from './proof/reels';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
import { MotionButton } from './ui/MotionButton';
import { HREF_FORMS } from '../ancoras';
import { TITULO_SECAO } from '../tipografia';
import { useIsDesktop } from '../hooks/useIsDesktop';

/**
 * How far the track steps between one card and the next, along all three axes.
 *
 * The vector is the composition: right, up and away in fixed proportion, so the
 * cards fall on a single receding diagonal rather than a row. Scrolling walks
 * the track backwards along it, which is what turns a list into a fly-through.
 */
const STEP_DESKTOP = { x: 260, y: -26, z: -250 };
const STEP_MOBILE = { x: 146, y: -15, z: -150 };

/**
 * Card sizes, in numbers rather than in classes.
 *
 * The transform subtracts half of each to sit a card on the track's origin, so
 * the dimensions cannot live only in a `w-[220px]` — a Tailwind class and a
 * constant that must agree are two places to change and one to forget.
 *
 * The closing card is landscape where every reel is portrait, and the change of
 * format is the point: it is the one card that is not a video. Given a reel's
 * proportions it read as a reel that had failed to load, and its line had to be
 * broken in two to fit a column 330px wide. Turned on its side it holds the ask
 * on one line, at a size a portrait card could never give it.
 */
const CARD_DESKTOP = { width: 220, height: 391 };
const CARD_MOBILE = { width: 132, height: 235 };
const CTA_DESKTOP = { width: 470, height: 330 };
/**
 * O TAMANHO DE PROJETO do cartão estreito — e ele é um teto, não uma medida.
 *
 * Era medida fixa, e era o defeito que o dono viu num aparelho de 320 por 568:
 * o cartão chegava com 293 de largura numa tela de 320, e 280 de altura num vão
 * que só tinha 193 — passava por cima do título em cima e das duas cifras
 * embaixo. Um número escolhido contra "o telefone mais estreito" só acerta
 * naquele telefone: no de 320 ele espremia, e no de 430 sobrava tela.
 *
 * Agora este par é a proporção e o tamanho MÁXIMO. O que vai para a tela sai de
 * `caberCartao`, que reduz até caber no vão realmente medido, e o miolo encolhe
 * junto na mesma escala — nenhum corpo de texto daqui precisou ser reescrito
 * para o cartão caber, e nenhum vai precisar quando esta caixa mudar.
 *
 * Mais alto do que a largura sugere porque as cifras ocupam duas linhas aqui. O
 * cartão estreito é o único lugar em que o formato deitado cede: cinco números
 * que valem a leitura custam uma segunda fileira, e a fileira custa a altura.
 */
const CTA_MOBILE = { width: 264, height: 252 };

/**
 * O respiro do cartão de fecho até a borda da tela e até a tipografia, em px.
 *
 * A margem lateral é a mesma `px-5` das duas faixas de texto, e é de propósito:
 * assim a borda do cartão cai na mesma goteira do título, e a coluna da seção
 * continua sendo uma só no celular. A folga vertical é menor porque as faixas
 * já trazem o respiro delas no próprio padding — este número só impede que o
 * cartão ENCOSTE nelas, que é diferente de dar espaço a elas.
 */
const MARGEM_CARTAO = 20;
const FOLGA_CARTAO = 12;

/**
 * O cartão de fecho reduzido até caber no que a tela realmente deixou.
 *
 * Reduz e nunca aumenta: o tamanho de projeto é o teto, e um cartão esticado
 * além dele num telefone grande viraria a única peça da parede fora de escala
 * com os reels ao lado. `FOCUS_SCALE` entra na conta porque o que precisa caber
 * não é o cartão parado — é ele no instante em que aterrissa e cresce doze por
 * cento, que é justamente quando o visitante está olhando para ele.
 *
 * A altura sai arredondada a partir da largura, e não das duas contas em
 * paralelo: dois arredondamentos independentes desencontram a proporção em até
 * um pixel, e é essa proporção que faz o miolo escalado preencher a caixa exata.
 */
function caberCartao(base: { width: number; height: number }, largura: number, vao: number) {
  if (largura <= 0 || vao <= 0) return base;
  const naLargura = (largura - 2 * MARGEM_CARTAO) / (1 + FOCUS_SCALE) / base.width;
  const naAltura = (vao - 2 * FOLGA_CARTAO) / (1 + FOCUS_SCALE) / base.height;
  const escala = Math.min(1, naLargura, naAltura);
  const width = Math.round(base.width * escala);
  return { width, height: Math.round(base.height * (width / base.width)) };
}

/**
 * Cards of run-up before the first reel, in card widths.
 *
 * There is no matching run-out. The track used to overshoot the last card,
 * which is what left the screen empty at the bottom of the section — the
 * visitor rode the wall to the end of the scroll and arrived at nothing. It now
 * finishes on the closing card, centred.
 */
const LEAD_IN = 2;

/**
 * Extra track between the last reel and the closing card, in card widths.
 *
 * Not a breath before the ask — a hit target. The closing card is far wider than
 * the 260px the track steps, so at one step's distance the reel behind it lands
 * in front of its left edge, which is where the button is. The pointer went to
 * the button and the browser handed it to the reel: the CTA lost its focus, was
 * shoved along the track, and the button appeared broken because it was never
 * being pointed at.
 *
 * A whole step of clearance, up from half, because the card grew 140px wider
 * when it turned landscape and took its left edge that much closer to the reel
 * behind it.
 */
const CTA_GAP = 1;

/** Scroll height per card, in viewport heights. The wall's whole budget. */
const VH_PER_CARD = 22;

/**
 * How much scroll the closing card keeps the screen for after the run has
 * stopped, in cards.
 *
 * The wall used to arrive and let go in the same frame: the card landed centred
 * on the last pixel of the section, and that pixel is also the one where the
 * page starts pushing the whole thing off the top. The ask was on screen, fully
 * upright, for no scroll at all.
 *
 * This is the pause. The track is parked on the closing card — centred, upright,
 * its button in the middle of the screen — while the section is still pinned, so
 * the visitor keeps scrolling and keeps looking at the ask.
 *
 * Barely off a card and a half, and that is deliberate. The owner asked for a
 * third off the stretch where the card has the screen to itself, and almost all
 * of that third came out of `CLEAR_TO` instead of out of here — the part of the
 * stretch that was spent watching the card travel, rather than the part spent
 * looking at it. The hold now *is* the whole of that stretch, and it is trimmed
 * only by the few pixels needed to land the total on two thirds.
 */
const CTA_HOLD = 1.45;

/**
 * The camera's distance from the stage, and the one number the whole
 * fly-through is measured against. Held here rather than in the `perspective`
 * style alone because `CULL_Z` has to know it.
 */
const PERSPECTIVE = 2000;

/**
 * How near the camera a card may come before it stops being drawn, in pixels.
 *
 * Cards hold a fixed place on the track and the track flies forward through
 * them, so a card the run has already passed keeps travelling toward the
 * viewer — and at the end of the wall the earliest cards are three or four
 * thousand pixels past the lens. That is not merely invisible. A card sitting on
 * the `PERSPECTIVE` plane divides by nearly zero: measured in the browser, the
 * ninth card projected to a box of 75023 x 20193 pixels, and one card crossing
 * the lens takes the hit testing of the entire 3D context down with it. Every
 * reel stopped answering the pointer and the closing card's button could not be
 * clicked — `elementsFromPoint` over the button returned the stage, with no card
 * anywhere in the stack.
 *
 * Half the camera's distance is the cut. A card that far past the viewer is at
 * twice its size and several thousand pixels off the side of the screen, so
 * nothing that could be seen is ever dropped.
 */
const CULL_Z = PERSPECTIVE / 2;

/**
 * How near the attention a card has to be before it stands up, in cards.
 *
 * Under one, so a card's neighbours stay flat while it is the one being read.
 * Not far under: while the parting travels from one card to the next both are
 * part-way up, and too narrow a window drops both of them flat in the middle of
 * that crossing — a blink between every pair of cards.
 */
const FOCUS_WIDTH = 0.85;

/**
 * How far before the end of the run the closing card starts standing up, in
 * cards.
 *
 * It used to share `FOCUS_WIDTH`, which spent the card's whole entrance flat and
 * snapped it upright as the section stopped moving — the ask arrived after the
 * scrolling was over, and by then so was the visitor's attention.
 *
 * Four and a half cards out is the moment the card has finished arriving on
 * screen: it starts rising the instant it is fully in view, is half upright with
 * two cards of run left, and has been standing — and its button reachable — for
 * the last hundred viewport heights of the section. This is the number to move
 * if the ask should come up earlier still; at 7.8 it begins while the card is
 * only a third on screen, which is as early as the geometry allows.
 */
const END_WIDTH = 4.5;

/**
 * Where the wall clears out, in cards before the end of the run.
 *
 * The run used to finish with the last reel still standing off to the left,
 * magnified and rotated, sharing the screen with the ask. Two objects, and the
 * one that had already been read was the larger of them.
 *
 * So the reels leave — the reels alone. The section's title stays: it is the
 * frame around the card, not a rival to it, and what had to clear off was
 * sixteen photographs competing with the one card that asks for something.
 *
 * `CLEAR_TO` is zero — the end of the run exactly — and that is the whole of it.
 * The wall used to finish clearing a card early, which bought a stretch of
 * scroll where the ask was alone on the screen *and still travelling to the
 * middle of it*. Alone and off-centre is the worst frame this section can hold,
 * and it held it on every scroll that stopped in that stretch; a screenshot
 * taken there is what this number was changed for. The last reel now goes as the
 * card lands, so every frame in which the ask has the screen to itself is a
 * frame in which it is dead centre and parked.
 *
 * They stop taking the pointer the moment they start leaving rather than when
 * they finish: a reel at half opacity is on its way out, and it should not be
 * able to claim the attention off a card that is not.
 */
const CLEAR_FROM = 3;
const CLEAR_TO = 0;

/**
 * How sharply the row parts around the attention, in cards.
 *
 * The parting used to be `Math.sign`: a card a hair to the left of the attention
 * was thrown a whole step left and the same card a hair to the right a whole
 * step right, with nothing in between — so every card the attention crossed
 * jumped the full width of the parting in one frame. `tanh` is that shape with
 * the cliff taken out. It still commits to a side within a card, and it passes
 * through zero, which is the part that matters: the card under the pointer is
 * the one card that must not move.
 */
const PUSH_WIDTH = 0.55;

/**
 * What being focused is worth, geometrically.
 *
 * `rotateY` unwinds to zero, and that is the point: a card held at fifty
 * degrees is a texture on a wall, not something anyone can watch. The rest is
 * the room it needs — a step toward the viewer, a touch of scale, and its
 * neighbours moved a fraction of a step along the track in each direction so
 * the card is not being read through the ones beside it.
 *
 * The closing card takes no step at all, and gets `0` for its `lift`. The
 * vanishing point sits at 12% of the stage rather than in the middle of it, so
 * anything the projection brings forward also travels *away from that point*:
 * ninety pixels of lift landed the card twenty-six pixels right of the centre of
 * the screen. Everywhere else on the track that is invisible — a card among
 * cards, on a diagonal, is not being measured against anything. The card the
 * section ends on is, because by then it is alone on the screen and its own
 * edges are the only reference left. It has nothing to step in front of anyway.
 */
const FOCUS_Z = 90;
const FOCUS_SCALE = 0.12;
const FOCUS_PUSH = 0.42;

/** How the pointer's claim on the attention arrives and lets go. */
const HOVER_SPRING = { mass: 0.6, stiffness: 200, damping: 26 };
const HOVER_INSTANT = { stiffness: 1000, damping: 100 };

/**
 * Quantas empresas já publicaram com a Doxa.
 *
 * PENDENTE-DONO: o número é do dono — ele disse "mais de 1500 clientes". Está
 * exato e não como "milhares" de propósito, e era o que a versão anterior deste
 * arquivo já pedia: adjetivo redondo é a forma mais fraca de um número que
 * existe. Uma parede inteira montada para ser conferida não pode abrir com uma
 * estimativa.
 *
 * ATENÇÃO ao verbo que acompanha: "1.500 empresas JÁ VIRALIZARAM" afirma que
 * todas as mil e quinhentas passaram do milhão de views, e é uma afirmação
 * diferente de "1.500 clientes atendidos". O dono ditou a frase nessa forma e
 * ela está escrita nessa forma; se o que ele tem são 1.500 CONTRATOS e não
 * 1.500 viralizações, a linha correta é "1.500 empresas já publicam com a
 * Doxa" — mesma força, sem prometer o resultado de todas.
 */
const CLIENTES = '1.500';

/**
 * Os dois números do alto — a ESCALA da operação, por decisão do dono.
 *
 * A dupla já foi por três lugares diferentes, e vale saber onde ela esteve
 * porque a terceira volta ao território da primeira.
 *
 * Primeiro foi "Milhares de clientes atendidos" e "Centenas de vídeos novos por
 * dia": tamanho de operação, dito em adjetivo. O dono leu como desconexo e
 * estava certo — falavam da Doxa numa seção cujo trabalho é falar do visitante.
 *
 * Depois viraram a promessa e o método, nas palavras do hero: um milhão de views
 * ou o dinheiro de volta, sessenta conteúdos em noventa dias. Em cima da prova
 * publicada, a promessa deixava de ser promessa e virava legenda.
 *
 * Agora são escala de novo, e é o dono quem trocou — mas com a diferença que
 * derrubava a primeira versão: são NÚMEROS, e não "milhares" e "centenas". Dez
 * bilhões de views e novecentos vídeos por dia dizem o tamanho da máquina que
 * está por trás dos reels passando na tela, que é uma coisa que a parede não
 * contava em lugar nenhum.
 *
 * ATENÇÃO, e é o custo desta troca: a GARANTIA saiu daqui. "ou seu dinheiro de
 * volta" estava nesta linha e não está mais. Ela continua no hero e no painel
 * claro da comparação (`GARANTIA`, em `comparacao/config.ts`), então a página
 * não perdeu a promessa — mas esta seção, que é a da prova, deixou de repeti-la
 * ao lado dos números. Se a intenção era somar e não trocar, o lugar de devolver
 * a garantia é aqui.
 *
 * PENDENTE-DONO: os dois números são afirmações públicas e verificáveis por
 * quem quiser conferir — "+10B" é uma ordem de grandeza que muito poucas
 * operações de conteúdo no país sustentam, e "+900 por dia" implica capacidade
 * instalada. São dele para afirmar; ficam registrados aqui como o que são.
 */
const SCALE_CLAIMS = [
  { value: '+10B', label: 'de views orgânicas geradas' },
  { value: '+900', label: 'vídeos gerados por dia' },
];

/**
 * The figures on the empty post.
 *
 * PENDENTE-DONO: numbers on the owner's instruction, and they are the owner's
 * call to make — but they are invented, and they sit in the exact place where
 * every other card on this wall carries a measured one. Worth one look before
 * this ships: the section's whole argument is that its figures are checkable,
 * and a made-up figure formatted like a checkable one is the single thing that
 * can cost it that. Anything that reads them as an example rather than as a
 * result — a caption, a different treatment — protects the fifteen cards behind
 * this one.
 *
 * Broken on purpose, in the wall's own notation: a round number is read as a
 * placeholder, and the figures beside them are quoted off real posts.
 */
const CTA_STATS = {
  views: '1,2M',
  likes: '89,4k',
  comments: '512',
  reposts: '1.043',
  followers: '+8,7k',
};

/**
 * The 0-to-1 ramp, flat at both ends.
 *
 * A card coming up on a straight ramp starts and stops with a corner, and the
 * eye reads the corner rather than the movement. Smoothstep is the same journey
 * with both ends eased, which is the difference between a card that settles and
 * a card that was stopped.
 */
function ease(amount: number) {
  const t = Math.min(1, Math.max(0, amount));
  return t * t * (3 - 2 * t);
}

/**
 * Which side of the attention a card is on, and how far it has committed to it.
 * Odd, smooth, and zero at zero — see `PUSH_WIDTH`.
 */
function side(distance: number) {
  return Math.tanh(distance / PUSH_WIDTH);
}

interface TrackPlacement {
  index: number;
  step: typeof STEP_DESKTOP;
  card: typeof CARD_DESKTOP;
  /** How far toward the camera being focused carries the card — see `FOCUS_Z`. */
  lift: number;
  /** Which card the pointer holds, as a number so it can be travelled to. */
  hoverCentre: MotionValue<number>;
  /** How much of the attention the pointer is holding, 0 to 1. */
  hoverAmount: MotionValue<number>;
  /** How much of it the end of the run is giving the closing card, 0 to 1. */
  endAmount: MotionValue<number>;
  /** Where that claim sits: the closing card's own place on the track. */
  endSlot: number;
  /** Where the run has got to, in cards — how far the camera has flown. */
  track: MotionValue<number>;
}

/**
 * Where a card stands, and how upright it is.
 *
 * Both quantities come off values computed once for the whole section rather
 * than per card. The scroll does not feed the angle directly: a reel passing the
 * middle of the screen used to stand up on its own, which meant sixteen cards
 * re-laying themselves out on every frame of every scroll, and it stuttered.
 * Attention is something asked for — by the pointer, or by reaching the end of
 * the run — and while nobody is asking, the row holds its angle and travels.
 *
 * The two claims are carried separately rather than averaged into one moving
 * centre, and that is the whole of the fix for the hover. Averaged, taking the
 * pointer off a card sent the centre sliding down the track toward the closing
 * card and dragged every card it passed; putting the pointer *on* a card made
 * the centre travel to it, so the card shifted one way before settling back the
 * other. Held apart, a claim fades where it stands and never moves anything on
 * its way out.
 */
function usePlacement({
  index,
  step,
  card,
  lift,
  hoverCentre,
  hoverAmount,
  endAmount,
  endSlot,
  track,
}: TrackPlacement) {
  const inputs = [hoverCentre, hoverAmount, endAmount];

  /**
   * How upright the card is: the stronger of the two claims, and neither one
   * cancels the other.
   *
   * The end's claim used to be scaled by whatever the pointer held, so touching
   * any reel in the last stretch dropped the closing card flat. That is a card
   * folding away in the exact seconds someone is crossing the reel beside it to
   * reach its button. Reaching the end of the run is the closing card's own
   * standing instruction and nothing the pointer does elsewhere revokes it.
   *
   * The end's claim is written by distance like the pointer's, which is what
   * keeps it to the closing card alone: `endAmount` opens three cards out, but
   * the nearest reel is a card and a half away and `FOCUS_WIDTH` is under one.
   */
  const focus = useTransform(inputs, ([centre, hover, end]: number[]) =>
    Math.max(
      hover * ease(1 - Math.abs(index - centre) / FOCUS_WIDTH),
      end * ease(1 - Math.abs(index - endSlot) / FOCUS_WIDTH),
    ),
  );

  /**
   * Where the card stands on the track, in card widths, after both claims have
   * pushed. The pushes add rather than replace one another: dropping the end's
   * parting because the pointer arrived would slide the card the pointer just
   * landed on, and a card that walks out from under the cursor gets a mouse-out
   * it did not earn.
   */
  const slot = useTransform(
    inputs,
    ([centre, hover, end]: number[]) =>
      index + FOCUS_PUSH * (hover * side(index - centre) + end * side(index - endSlot)),
  );

  /**
   * Where the card stands *relative to the camera*, in card widths.
   *
   * The run is subtracted here, on each card, rather than once on the element
   * they all sit in. Flying the container was the cheaper write — one transform
   * per frame instead of a dozen — and it cost the section every pointer event
   * in its second half. The container's own `translateZ` runs to 3875px against
   * a 2000px `perspective`, which puts the cards' *parent* behind the lens; the
   * cards still draw correctly, because the matrices compose before they are
   * projected, but Chrome will not hit-test through an ancestor it cannot map.
   * Measured on the page: the button's box was pixel-identical either way, and
   * `elementsFromPoint` over it returned the stage with the run on the
   * container and the button's own label with the run on the cards.
   */
  const offset = useTransform([slot, track], ([s, t]: number[]) => s - t);

  const transform = useTransform([offset, focus], ([o, f]: number[]) => {
    // Half the card is subtracted on both axes: an absolutely positioned child
    // of the zero-sized track anchors by its own top-left corner, so without it
    // every card hangs down and right of the point it is meant to occupy.
    const x = o * step.x - card.width / 2;
    const y = o * step.y - card.height / 2;
    const z = o * step.z + f * lift;

    return `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-50 * (1 - f)}deg) scale(${1 + f * FOCUS_SCALE})`;
  });

  /**
   * Whether the card is drawn at all — see `CULL_Z`. `display`, not
   * `visibility` or an `opacity` of zero: the point is to take the box out of
   * the 3D rendering context entirely, and a hidden box is still a box the
   * projection has to divide by. Driven off the motion values like everything
   * else here, so passing the lens costs a style write rather than a render.
   */
  const display = useTransform(offset, (o) => (o * step.z > CULL_Z ? 'none' : 'block'));

  return { transform, focus, display };
}

/**
 * One published number off the post, icon then figure, the way a feed sets them.
 *
 * `big` is the closing card's set. On a reel the figures are a caption over
 * somebody's video and they are sized like one — the picture is the argument
 * there. On the card at the end there is no picture, the numbers *are* what the
 * visitor is being shown, and at a feed's ten pixels they read as a footnote to
 * a headline instead of as the reason the headline is there.
 */
function Stat({
  icon: Icon,
  value,
  label,
  liked = false,
  big = false,
}: {
  icon: typeof Eye;
  value: string;
  label: string;
  liked?: boolean;
  big?: boolean;
}) {
  return (
    <span className={`flex items-center ${big ? 'gap-1 lg:gap-1.5' : 'gap-1'}`}>
      <Icon
        className={`shrink-0 ${big ? 'h-3.5 w-3.5 lg:h-4 lg:w-4' : 'h-3 w-3'} ${
          liked ? 'fill-current text-[#ff3040]' : 'text-white/70'
        }`}
        strokeWidth={liked ? 0 : 2}
        aria-hidden
      />
      <span
        className={`font-semibold leading-none tabular-nums text-white ${
          big ? 'text-[15px] lg:text-[16px]' : 'text-[10px]'
        }`}
      >
        {value}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * The two scale figures, as a fragment rather than as a row.
 *
 * They are set twice — top right on the wide layout, along the floor on the
 * narrow one — and the only thing that differs is the box they are in. A
 * fragment leaves that box to whichever of the two is on screen; a component
 * that carried its own would need the same two sets of flex classes passed into
 * it, which is the wrapper it was trying not to be.
 */
/**
 * A largura do palco e o VÃO que sobra entre as duas faixas de tipografia.
 *
 * Medido, e não estimado a partir de constantes de padding. As duas faixas são
 * texto do dono — o título e as duas cifras —, e texto do dono muda: uma palavra
 * a mais no título quebra uma linha nova no telefone estreito e come mais vinte
 * e cinco pixels do meio da tela. Um número escrito à mão aqui estaria errado no
 * commit seguinte, e erraria em silêncio, que é a pior forma: o sintoma não é um
 * erro, é o cartão passando por cima da frase.
 *
 * Em `useLayoutEffect` para a conta acontecer ANTES da pintura. Num efeito
 * comum, o primeiro quadro sairia com o cartão no tamanho de projeto e o
 * seguinte com ele reduzido, e o visitante veria a peça principal da seção dar
 * um pulo ao aparecer.
 */
function useVaoLivre(
  palcoRef: RefObject<HTMLElement>,
  topoRef: RefObject<HTMLElement>,
  rodapeRef: RefObject<HTMLElement>,
) {
  const [medida, setMedida] = useState({ largura: 0, vao: 0 });

  useLayoutEffect(() => {
    const palco = palcoRef.current;
    if (palco == null) return;

    const medir = () => {
      // As faixas escondidas por breakpoint medem zero sozinhas — a de baixo é
      // `lg:hidden` e a coluna de cifras do topo é `hidden lg:flex`, então a
      // mesma conta serve para os dois layouts sem perguntar em qual estamos.
      const topo = topoRef.current?.getBoundingClientRect().height ?? 0;
      const rodape = rodapeRef.current?.getBoundingClientRect().height ?? 0;
      const largura = palco.clientWidth;
      const vao = Math.max(0, palco.clientHeight - topo - rodape);
      // Só troca o objeto quando o número muda: um objeto novo a cada medida
      // redesenharia a parede inteira a cada quadro de uma rotação de tela.
      setMedida((m) => (m.largura === largura && m.vao === vao ? m : { largura, vao }));
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(palco);
    if (topoRef.current != null) observador.observe(topoRef.current);
    if (rodapeRef.current != null) observador.observe(rodapeRef.current);
    return () => observador.disconnect();
  }, [palcoRef, topoRef, rodapeRef]);

  return medida;
}

function ScaleClaims() {
  return (
    <>
      {SCALE_CLAIMS.map(({ value, label }) => (
        <div key={label} className="flex flex-col gap-1">
          {/* Um degrau abaixo até 640px, e é dieta com destinatário.

              No telefone estreito estas duas cifras e o título ocupavam dois
              terços da altura da tela, e o terço que sobrava era o vão em que o
              cartão de fecho tem de caber. A 30px, "60 vídeos virais" quebra em
              duas linhas dentro de uma coluna de 134px e cobra sessenta pixels
              do meio da tela por um número que continua legível a 22. */}
          <span className="font-serif text-[1.4rem] leading-none text-white sm:text-3xl lg:text-[2.6rem]">
            {value}
          </span>
          <span className="text-[13px] leading-snug text-white/60 lg:text-[15px]">{label}</span>
        </div>
      ))}
    </>
  );
}

/** The blue tick, at the size a feed sets it. */
function Verified() {
  return <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-[#3897f0] text-black" strokeWidth={2} />;
}

/**
 * One published reel, standing in the 3D track.
 *
 * The poster is the card. The video is mounted only on the reel under the
 * pointer — nothing plays on the way past, so scrolling the wall costs no
 * fetches at all, and the poster is the frame the file opens on anyway.
 */
function ReelCard({
  reel,
  playing,
  soundOn,
  fade,
  onEnter,
  onToggleSound,
  ...placement
}: TrackPlacement & {
  reel: Reel;
  /** Hovered *and* on screen. Geometry does not need the viewport; audio does. */
  playing: boolean;
  soundOn: boolean;
  /** How much of the wall is left, 0 to 1 — see `CLEAR_FROM`. */
  fade: MotionValue<number>;
  onEnter: () => void;
  onToggleSound: () => void;
}) {
  const { transform, focus, display } = usePlacement(placement);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Off the moment it starts leaving, not when it has finished — see `CLEAR_FROM`. */
  const catches = useTransform(fade, (f) => (f > 0.99 ? 'auto' : 'none'));

  /**
   * Playback is driven here rather than by `autoPlay` and a `muted` prop.
   *
   * `muted` is the one attribute React is famously loose about, and a browser
   * refuses to start a video that asks for sound before it has been asked for
   * one — so the mute is set on the element and `play()` called after it, every
   * time the reel or the sound choice changes.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !soundOn;
    void video.play().catch(() => undefined);
  }, [playing, soundOn]);

  /**
   * How dark the reel sits while it is not the one being watched.
   *
   * A veil whose opacity moves, not a `filter: brightness()` on the image.
   * Filters are not composited: animating one repaints the whole picture every
   * frame. Opacity is a compositor property — painted once, then only faded.
   */
  const dim = useTransform(focus, [0, 1], [0.45, 0]);

  return (
    <motion.div
      onMouseEnter={onEnter}
      // `rounded-xl` and the hairline border are the hero's media frame — the
      // same object in a different room: a client's file lying on the canvas.
      className="group absolute overflow-hidden rounded-xl border border-white/[0.14] bg-doxa-raised shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]"
      style={{
        width: placement.card.width,
        height: placement.card.height,
        transform,
        display,
        opacity: fade,
        pointerEvents: catches,
        transformStyle: 'preserve-3d',
      }}
    >
      <img
        src={reel.posterUrl}
        alt=""
        aria-hidden
        loading="lazy"
        className="h-full w-full object-cover"
      />

      {/* The veil, and the ring that brightens the edge as the reel comes up.
          Both are separate elements fading rather than properties of the card
          being repainted — the same reason, twice. */}
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl border border-white/45"
        style={{ opacity: focus }}
      />

      {/* Over the poster, not instead of it: the video fades in on the frame it
          was going to start on anyway, so there is no black gap while it
          buffers and nothing moves when it arrives. */}
      {playing && reel.videoUrl && (
        <motion.video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          playsInline
          preload="auto"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25" />

      {/* Only on the reel that is actually playing — a mute button on a still
          frame controls nothing. The treatment is the hero's: the visitor has
          met this button already. */}
      {playing && reel.videoUrl && (
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Desligar o som do vídeo' : 'Ativar som do vídeo'}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-black/50 text-white opacity-80 backdrop-blur-sm transition hover:bg-black/70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {soundOn ? (
            <Volume2 className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <VolumeX className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      )}

      {/* Set in the native-app stack, and the tick and the red heart are the
          platform's colours rather than ours. The brand is monochrome
          everywhere it speaks for itself; this block is a picture of somebody
          else's interface, which is the one exemption. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 font-ui">
        <span className="flex items-center gap-1 text-[12px] font-semibold text-white">
          <span className="truncate">{reel.handle}</span>
          {reel.verified && <Verified />}
        </span>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {reel.views && <Stat icon={Eye} value={reel.views} label="visualizações" />}
          {reel.likes && <Stat icon={Heart} value={reel.likes} label="curtidas" liked />}
          {reel.comments && <Stat icon={MessageCircle} value={reel.comments} label="comentários" />}
          {reel.reposts && <Stat icon={Repeat2} value={reel.reposts} label="reposts" />}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * The last card on the track, and the one the run ends standing on.
 *
 * The section used to overshoot into empty space — the visitor rode the wall to
 * the bottom of the scroll and found a blank screen still pinned to the
 * viewport. It now finishes here, and this is the one card the scroll is still
 * allowed to raise: arriving at the end of the proof is exactly the moment to
 * ask, and a wall that spends its whole argument and then asks for nothing has
 * wasted it.
 *
 * Built as an empty post rather than as a panel of copy. Every card before it is
 * somebody's published reel with their handle and their numbers on it; this one
 * carries the same two things over a profile that does not exist yet, which says
 * what it is for without a sentence explaining it.
 *
 * Landscape, centred, and lit from underneath — the three things that stop it
 * being a reel with the video missing. It is the only card on the track that is
 * not a photograph, and by the time it arrives it is also the only card left on
 * screen, so it can afford to be composed rather than to blend in.
 */
function ClosingCard({
  onEnter,
  base,
  ...placement
}: TrackPlacement & {
  onEnter: () => void;
  /** O tamanho em que o miolo foi desenhado. `card` é o que coube na tela. */
  base: { width: number; height: number };
}) {
  const { transform, focus, display } = usePlacement(placement);
  /*
   * O miolo inteiro numa escala só, em vez de um corpo de texto por breakpoint.
   *
   * O cartão encolhe para caber no vão da tela, e tudo que está dentro dele tem
   * de encolher junto — senão o que sobra é o pior dos dois mundos: a caixa
   * ajustada e o conteúdo transbordando por baixo do `overflow-hidden`, que
   * corta o botão sem avisar. Reescrever oito medidas de tipo em `vw` seria a
   * outra saída, e ela custaria a proporção: estas medidas foram afinadas juntas
   * — o vão do arroba, a fileira de cifras em duas linhas, a manchete de 34px, o
   * disco de 56 do botão —, e afinar cada uma por conta própria desmancha o que
   * as fez funcionar. Uma escala mantém a composição idêntica em qualquer
   * telefone; só o tamanho dela muda.
   *
   * No desktop dá exatamente 1: `card` e `base` são o mesmo objeto lá, e a
   * conta devolve o cartão que sempre existiu.
   */
  const escala = placement.card.width / base.width;

  return (
    <motion.div
      onMouseEnter={onEnter}
      // Opaque, and the only opaque thing in the run. Everything else is a
      // photograph; this is a surface, and a surface you can see the dot grid
      // through reads as a reel that failed to load.
      //
      // A raked gradient rather than the flat grey it used to be. One value
      // across a card this size is a slab: nothing on it catches, and the eye
      // reads the whole rectangle as a hole in the page. Lit off the top-left
      // corner and falling to near-black at the bottom-right, with a hairline of
      // white on the top edge — the light has a direction, and the shape reads
      // as an object under it.
      className="absolute overflow-hidden rounded-2xl border border-white/[0.14] bg-[linear-gradient(148deg,#242424_0%,#1a1a1a_38%,#101010_72%,#0b0b0b_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_40px_90px_-30px_rgba(0,0,0,0.95)]"
      style={{
        width: placement.card.width,
        height: placement.card.height,
        transform,
        display,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Two lights, both white at alpha like every other light on the page:
          one over the figures, one under the ask. They are what the card is
          composed around — the eye lands on the numbers, crosses the dark band
          the headline sits in, and finishes on the button. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(55%_100%_at_50%_-15%,rgba(255,255,255,0.11),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(70%_100%_at_50%_118%,rgba(255,255,255,0.17),transparent_70%)]" />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-white/45"
        style={{ opacity: focus }}
      />

      {/* Three parts on one axis, and the spare room is spent by the middle one
          rather than split into three gaps by `justify-between`. That was the
          card reading as strange: a header, a headline and a button each
          hanging in space with nothing holding them to anything. */}
      <div
        className="relative flex flex-col items-center p-4 text-center lg:p-6"
        style={{
          width: base.width,
          height: base.height,
          transform: `scale(${escala})`,
          transformOrigin: 'top left',
        }}
      >
        {/* O vão entre o arroba e os números é maior do que o ritmo do cartão, a
            pedido do dono: são duas coisas de natureza diferente — quem postou
            e o que o post fez —, e coladas no mesmo passo do resto elas liam
            como uma linha só de cabeçalho. */}
        <div className="flex w-full flex-col items-center gap-3 font-ui lg:gap-4">
          <span className="flex items-center gap-1 text-[12px] font-semibold text-white/70">
            @suaempresa
            <Verified />
          </span>
          {/* The five figures, at nearly twice a reel's size. The followers come
              last: the four before them are what one post did, and that is what
              it left behind.

              One line on the wide card, two on the narrow one — and the break
              is placed rather than left to `flex-wrap`, which would have filled
              the first line and dropped whatever was left onto the second. On a
              320px screen that is four and an orphan. Two and three is a shape;
              it is also what lets the figures be fifteen pixels there instead
              of the twelve it takes to crush all five into one line, and being
              read is the entire job of this row.

              Fifteen pixels between them on the wide card, set as a number
              rather than as a step on the scale: the owner asked for that gap,
              and `gap-x-4` would be sixteen. */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:gap-x-[15px]">
            <Stat big icon={Eye} value={CTA_STATS.views} label="visualizações" />
            <Stat big icon={Heart} value={CTA_STATS.likes} label="curtidas" liked />
            <span aria-hidden className="w-full lg:hidden" />
            <Stat big icon={MessageCircle} value={CTA_STATS.comments} label="comentários" />
            <Stat big icon={Repeat2} value={CTA_STATS.reposts} label="reposts" />
            <Stat big icon={UserPlus} value={CTA_STATS.followers} label="seguidores" />
          </div>
        </div>

        {/* Fades in from nothing at both ends, so it reads as a seam in the
            surface rather than as a line drawn on it. What it divides is the
            post's figures from the page's ask — the two halves of what this
            card is, and without it they were two blocks floating in the same
            dark rectangle. */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/[0.16] to-transparent lg:mt-5" />

        {/* PENDENTE-DONO: wording mine.

            One line, which is the whole reason the card turned landscape — a
            hard break through the middle of four words reads as type that did
            not fit. `my-auto` centres it in whatever is left over, so the two
            gaps come out equal without either being a number that has to be
            re-tuned when the card or the type changes. */}
        <p className="my-auto whitespace-nowrap font-serif text-[34px] leading-none tracking-[-0.03em] text-white lg:text-[58px]">
          E a próxima é a sua.
        </p>

        <MotionButton label="Quero viralizar" href={HREF_FORMS} />
      </div>
    </motion.div>
  );
}

/**
 * The proof wall: every published reel, flown through on the scroll.
 *
 * Adapted from a full-page showcase, and the adaptation is the substance of it.
 * The original owns the document — a fifty-thousand-pixel spacer with a fixed
 * viewport pinned over it, which is a page, not a section. Dropped into a
 * landing page it would swallow everything below it.
 *
 * Here the scroll is the section's own passage instead: a tall block with a
 * sticky screen inside it, driven by `scrollYProgress` between its own start
 * and end. The wall pins, plays out, unpins, and the page carries on. Being
 * bounded also removes the reason for the duplicated buffer the original loops
 * through — the track is walked once, so there are half as many cards.
 */
export function ProofWall() {
  const sectionRef = useRef<HTMLElement>(null);
  /**
   * The pinned screen, not the section. The section is several viewports tall
   * and scrolls; the glow and the in-view test both belong to the sticky child,
   * so measuring against the section would offset them by however far the page
   * had travelled.
   */
  const stickyRef = useRef<HTMLDivElement>(null);
  /** As duas faixas de tipografia que fecham o vão em que o cartão aterrissa. */
  const topoRef = useRef<HTMLDivElement>(null);
  const rodapeRef = useRef<HTMLDivElement>(null);
  // Medido aqui em cima porque o tamanho do cartão sai desta conta, e ele é
  // decidido antes do desenho — não depois, num efeito que corrige.
  const { largura, vao } = useVaoLivre(stickyRef, topoRef, rodapeRef);
  const isDesktop = useIsDesktop();
  const still = useReducedMotion() ?? false;

  /**
   * The cards this layout flies through. Half as many on a phone, and it is the
   * length of the section that is being halved — see `WALL_TARGET_MOBILE`.
   *
   * Everything downstream is measured off `wall.length`, so the shorter list
   * shortens the track, the section and the scroll on its own.
   */
  const wall = isDesktop ? WALL_REELS : WALL_REELS_MOBILE;

  /** Where the closing card sits: after every reel, plus its own clearance. */
  const endSlot = wall.length + CTA_GAP;

  /** The section's own height: the run-up, the run, the last card, the hold. */
  const sectionVh = (LEAD_IN + endSlot + 1 + CTA_HOLD) * VH_PER_CARD;

  /**
   * Where in the section's progress the run finishes and the hold begins.
   *
   * Taken against the section's height *minus the viewport it is pinned to*,
   * because that difference is the only part of it `scrollYProgress` measures:
   * the sticky child stops travelling once its parent's bottom edge arrives, so
   * dividing the hold by the raw height would leave it short by a screen.
   */
  const scrollableVh = sectionVh - 100;
  const arrive = (scrollableVh - CTA_HOLD * VH_PER_CARD) / scrollableVh;

  const { scrollYProgress } = useScroll({
    target: sectionRef as RefObject<HTMLElement>,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });

  /**
   * Which card is at the centre of the screen, as a continuous number. It
   * starts before the first reel so the wall arrives rather than cutting in,
   * and ends exactly on the closing card.
   *
   * The run is spent by `arrive` rather than by the end of the section, and
   * `useTransform` clamps past its input range — so the last stretch of scroll
   * leaves the track sitting on `endSlot` instead of pushing past it. That
   * clamp is the hold: nothing else has to know about it, because everything
   * downstream is written off `track`.
   */
  const track = useTransform(smooth, [0, arrive], [-LEAD_IN, endSlot]);

  const step = isDesktop ? STEP_DESKTOP : STEP_MOBILE;
  const card = isDesktop ? CARD_DESKTOP : CARD_MOBILE;
  /*
   * O cartão de fecho é o único que se ajusta à tela, e SÓ no layout estreito.
   *
   * `isDesktop` devolve `CTA_DESKTOP` intocado de propósito: no layout largo o
   * vão sempre coube, o dono não pediu nada ali, e uma medida que "por via das
   * dúvidas" também roda no desktop é uma mudança de desktop disfarçada de
   * segurança. Os reels não entram nesta conta — eles atravessam a tela e saem,
   * e é só o cartão que PARA no meio dela, entre as duas faixas de texto.
   */
  const ctaBase = isDesktop ? CTA_DESKTOP : CTA_MOBILE;
  const ctaCard = isDesktop ? CTA_DESKTOP : caberCartao(CTA_MOBILE, largura, vao);

  const hoverCentre = useSpring(endSlot, still ? HOVER_INSTANT : HOVER_SPRING);
  const hoverAmount = useSpring(0, still ? HOVER_INSTANT : HOVER_SPRING);

  /**
   * The second claim on the attention: reaching the end of the run, which
   * raises the closing card and nothing else — the CTA is the only card the
   * scroll still lifts, because arriving there is the moment the section has
   * been building toward. A reel crossing the middle no longer counts: that was
   * every card re-laying itself out on every frame, and it stuttered.
   *
   * It opens `END_WIDTH` cards early instead of at the finish line, so the card
   * comes up over the last stretch of the scroll rather than at the end of it.
   */
  const endAmount = useTransform(track, (t) => ease(1 - Math.abs(endSlot - t) / END_WIDTH));

  /**
   * How much of the wall is left: the reels and the copy over them, on their way
   * out so the ask finishes alone on the screen. See `CLEAR_FROM`.
   */
  const wallFade = useTransform(track, [endSlot - CLEAR_FROM, endSlot - CLEAR_TO], [1, 0]);

  /** Which reel has the pointer, and so the only one with a video mounted. */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const claimFocus = (slot: number) => {
    if (!isDesktop) return;
    // Arriving from nothing, the attention appears where the cursor is instead
    // of sweeping across the whole track to get there. Moving between cards
    // does travel — that is the parting following the pointer. Either way the
    // centre lands on the card before its strength grows, so the card the
    // pointer is on rises where it stands rather than being pushed first.
    if (hoverAmount.get() < 0.01) hoverCentre.jump(slot);
    else hoverCentre.set(slot);
    hoverAmount.set(1);
    setHoveredIndex(slot);
  };

  const releaseFocus = () => {
    hoverAmount.set(0);
    setHoveredIndex(null);
  };

  /**
   * One sound switch for the wall, not one per card. Having asked for sound,
   * nobody wants to ask again on the next reel — and the first click is also
   * the gesture the browser needs before any later reel may play aloud.
   */
  const [soundOn, setSoundOn] = useState(false);

  /**
   * Nothing plays while the wall is off screen. With sound switched on that
   * stops being a matter of decode budget: a section this tall spends most of
   * the page somewhere else, and audio from a place the visitor has already
   * scrolled past is the worst thing it could do.
   */
  const inView = useInView(stickyRef, { amount: 0.4 });

  const placement = { step, hoverCentre, hoverAmount, endAmount, endSlot, track };

  return (
    <section
      ref={sectionRef}
      data-secao="Prova"
      className="relative bg-doxa-bg"
      // Sized by the content: every card gets the same share of scroll, plus
      // the run-up and the hold at the end. Adding files lengthens the section
      // instead of making it faster.
      style={{ height: `${sectionVh}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        onMouseLeave={releaseFocus}
      >
        <div className="dot-grid pointer-events-none absolute inset-0" />
        {/* The same grid the hero lights under the cursor, on the same pair of
            layers — a resting grid with a brighter copy revealed through a mask
            parked on the pointer. */}
        <DotGridSpotlight containerRef={stickyRef} />

        {/* The page's column, and everything in the section lives inside it.
            The hero canvas and the pipeline row are both capped at this width
            and centred; pinning this section to the viewport edge instead would
            line it up with the two above only by coincidence, at exactly the
            one window width where the cap does not bind. */}
        <div className="absolute inset-0 mx-auto w-full max-w-screen-2xl">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: '12% 50%' }}
          >
            {/* The origin the cards are placed around, and nothing else: it
                establishes the 3D context and never moves. Flying it was what
                broke the pointer in the back half of the section — see the note
                on `offset` in `usePlacement`. */}
            <div className="relative h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
              {wall.map((reel, index) => (
                <ReelCard
                  key={`${reel.handle}-${index}`}
                  {...placement}
                  card={card}
                  lift={FOCUS_Z}
                  index={index}
                  reel={reel}
                  playing={index === hoveredIndex && inView}
                  soundOn={soundOn}
                  fade={wallFade}
                  onEnter={() => claimFocus(index)}
                  onToggleSound={() => setSoundOn((current) => !current)}
                />
              ))}

              <ClosingCard
                {...placement}
                card={ctaCard}
                base={ctaBase}
                // Dead centre when the run stops, and that costs it the step
                // toward the camera — see `FOCUS_Z`.
                lift={0}
                index={endSlot}
                onEnter={() => claimFocus(endSlot)}
              />
            </div>
          </div>

          {/* Absolute black at the top and bottom, clear across the middle sixty
              per cent, running at a hundred and eighty degrees. The band the
              cards travel through is the only part left open, so the run fades
              out of the dark and back into it rather than being cut off by the
              edge of the screen. The axis also falls where the type is, which
              is what gives the copy something to sit on. */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(180deg, #000 0%, transparent 20%, transparent 80%, #000 100%)',
            }}
          />

          {/* The copy lives in the top band, which is the part of the gradient
              that is opaque. It used to be spread top and bottom, and the reels
              flew straight over the figures on the way past — the middle and
              the floor of this section are the road, and type cannot live on
              the road.

              Baseline-aligned, not top-aligned: the headline is two lines of
              serif and the figures are one line of it, so aligning their boxes
              would leave the figures floating level with the first line of a
              title they are meant to sit under.

              It stays when the reels leave. What had to clear off the screen
              was the wall — sixteen photographs competing with the one card
              that asks for something. The section's own title is the frame
              around that card, not a rival to it.

              On the narrow layout the figures are not in here at all. Two
              blocks of type side by side need a row to be side by side in, and
              at 320px there is none: they stacked under the title, the pile ran
              four hundred pixels down a five-hundred-and-sixty pixel screen,
              and the reels flew through the middle of it. They go to the floor
              instead — see the block below. */}
          <div
            ref={topoRef}
            /* `py-8` até 640px, `py-12` daí para cima — o valor antigo continua
               valendo em tudo que não é telefone estreito. Os 32 pixels que esta
               faixa devolve vão inteiros para o vão do cartão, e numa tela de
               568 de altura eles são a diferença entre o cartão caber e o cartão
               ser reduzido para caber.

               `md:pt-14` no lugar do `md:py-24`, a pedido do dono: mais ar
               entre a tipografia e o cartão de fecho. O espaço tinha de sair
               DAQUI, e não de baixar o cartão — ele pousa no centro do palco 3D,
               que é a origem em torno da qual os dezesseis reels são colocados;
               mover a origem é mover a trajetória inteira do voo, e já foi o que
               quebrou o ponteiro na metade de trás desta seção uma vez (a nota
               sobre `offset` em `usePlacement` conta a história).

               Com a faixa 40px mais alta, o vão entre o pé do título e o topo do
               cartão passa de 63 para 103 pixels numa tela de 940 — e o `pb-24`
               fica onde estava porque ele não é visível: a faixa é transparente
               e `pointer-events-none`, então o que se vê é onde o TEXTO termina,
               não onde a caixa dele acaba. */
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 px-5 py-8 sm:py-12 md:px-10 md:pb-24 md:pt-14"
          >
            {/* O número primeiro, e a promessa do hero no passado.

                "A prova já está publicada" descrevia a seção; esta frase
                entrega o argumento. E o argumento é uma vírgula: o hero promete
                um milhão de views, e aqui a mesma frase aparece conjugada como
                coisa que já aconteceu — mil e quinhentas vezes, com os vídeos
                passando na tela enquanto se lê.

                A contagem de `REELS` saiu daqui. Ela dizia quantos reels a
                parede mostra, o que era honesto e útil quando o título falava
                da parede; ao lado de "1.500", um "(3)" em versalete lê como a
                letra miúda desmentindo a manchete. O número de arquivos que
                temos não é o número de clientes que atendemos, e só um dos dois
                é assunto desta seção. */}
            {/* 1,7rem só até 640px. A 36px, a segunda linha ("viralizaram com a
                Doxa.") não cabe nos 280px úteis de um telefone de 320 e quebra
                sozinha numa terceira — três linhas de manchete comendo o vão do
                cartão embaixo, por uma quebra que ninguém pediu. A 27px ela cabe
                inteira, e o título volta a ter as duas linhas que o `<br>`
                escreveu. Acima de 640 nada muda. */}
            <h2 className={`font-serif ${TITULO_SECAO} font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl md:text-6xl`}>
              {CLIENTES} empresas já
              <br />
              viralizaram com a Doxa.
            </h2>

            <div className="hidden flex-wrap justify-end gap-x-10 gap-y-4 text-right lg:flex">
              <ScaleClaims />
            </div>
          </div>

          {/* The floor of the narrow layout, and the other half of the same
              decision. The two bands of opaque black in the gradient are the
              only places type can live in this section; the top one holds the
              title and this is the bottom one, which was going spare. With the
              figures down here the whole middle of the screen is the road
              again, which is where the fly-through belongs.

              Split at `lg` rather than at `md` because this is a question about
              which layout the cards are in, and that is what `useIsDesktop`
              answers — two breakpoints deciding one thing is one of them being
              wrong at some width. */}
          <div
            ref={rodapeRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-between gap-x-3 px-5 pb-8 sm:pb-12 lg:hidden"
          >
            <ScaleClaims />
          </div>
        </div>
      </div>
    </section>
  );
}
