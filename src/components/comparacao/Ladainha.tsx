import { Fragment, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { ITENS, TEMPO, type Item } from './config';
import { Icone } from './icones';

/**
 * ─── QUANTA ROLAGEM A CONTA CUSTA ────────────────────────────────────────────
 *
 * Dois terços de tela, e o número já esteve errado nas duas pontas.
 *
 * Na primeira versão o percurso abria em `start end` — quando a seção começava a
 * entrar por baixo. Somava certo e não servia para nada: o trecho inteiro passa
 * com a ladainha ainda abaixo da dobra, e quando a pessoa olhava para a lista
 * ela já estava toda acesa. A animação existia e ninguém via.
 *
 * Na segunda abria em `start start`, com a lista à vista, mas terminava em um
 * terço de tela — e o dono achou apressado, com razão: vinte e cinco itens em
 * trezentos pixels de rolagem entram quase juntos, e o que se lê é uma lista
 * aparecendo, não uma conta sendo somada.
 *
 * A terceira tentou ganhar tempo abrindo ANTES do grude, em `start 30%`, com a
 * seção ocupando setenta por cento da tela. Funcionava, e o dono recusou por um
 * motivo que é dele decidir: a conta só deve começar a ser somada quando a seção
 * for a tela INTEIRA. Enquanto sobra página em volta, o painel ainda está
 * chegando, e uma animação que começa durante a chegada compete com ela.
 *
 * Então a abertura volta a `start start` — o instante exato em que o topo da
 * seção encosta no topo da janela e o painel escuro ocupa 100% da altura.
 *
 * ─── E O FIM PRECISOU DE ESPAÇO NOVO ─────────────────────────────────────────
 *
 * O dono pediu dois terços a mais de rolagem, e o número sozinho não daria: o
 * fim do percurso tinha um teto geométrico. O painel claro sobe por cima do
 * escuro assim que o vão entre os dois passa, e as últimas linhas da coluna — o
 * total e o soco — são as PRIMEIRAS que ele cobre. Esticar só este número faria
 * o fecho acender debaixo do papel.
 *
 * O que abriu espaço foi o vão da seção, em `Comparacao.tsx`, que passou de
 * 37,5% para 100% de tela. Isso muda a seção inteira e é uma decisão que valia
 * ser tomada: aquele vão foi cortado um dia porque "o que sobrava de rolagem
 * parada antes da virada era espera, não leitura" — e era verdade, quando a
 * ladainha já estava escrita ao chegar. Agora ela se ESCREVE ali, e o mesmo
 * trecho deixou de ser espera.
 *
 * Com a seção em três telas, `26%` dão cerca de oitenta por cento de tela de
 * rolagem para as vinte e cinco linhas — os dois terços a mais que ele pediu —,
 * e o soco ainda fecha antes de o papel começar a subir. É por isso que as
 * fatias abaixo terminam antes do fim do percurso, e não nele.
 *
 * ─── A CONTA É SOMADA PELA ROLAGEM, E NÃO POR UM RELÓGIO ─────────────────────
 *
 * Pedido do dono, e ele troca a natureza da animação: os vinte e cinco itens
 * entravam em cascata de tempo assim que a seção aparecia — um relógio de
 * trinta e cinco milésimos por item, correndo sozinho — e agora entram
 * conforme a página anda. Quem rola devagar vê a fatura sendo somada devagar;
 * quem para, a conta para com ele.
 *
 * O que se ganha é a coisa que o argumento desta seção precisa: o acúmulo deixa
 * de ser uma animação que a pessoa ASSISTE e passa a ser uma que ela CAUSA. É
 * ela quem está somando, e o tamanho da lista vira consequência de continuar
 * descendo.
 *
 * ─── POR QUE O ALVO É A SEÇÃO, E NÃO ESTE PARÁGRAFO ──────────────────────────
 *
 * A ladainha mora dentro do painel escuro, que é `sticky`. Um elemento grudado
 * NÃO se move em relação à janela enquanto gruda — o retângulo dele fica parado
 * no topo, e `useScroll` apontado para ele devolveria um progresso travado no
 * mesmo número durante toda a leitura. O que se move é a seção inteira, e é ela
 * que o componente recebe de fora.
 */
const ABRE = 'start start';
const FECHA = '26% start';

/**
 * O percurso da contagem, medido na SEÇÃO e entregue a quem precisar dele.
 *
 * Mora aqui, com a documentação do que ele significa, mas é chamado de fora: a
 * lista e a frase que a fecha são irmãs no `Comparacao`, e as duas precisam da
 * MESMA régua. Dois `useScroll` com os mesmos limites dariam o mesmo número hoje
 * e divergiriam no dia em que alguém ajustasse um deles — e o sintoma seria a
 * frase final entrando no meio da lista.
 */
export function useContagem(secaoRef: RefObject<HTMLElement>) {
  return useScroll({ target: secaoRef, offset: [ABRE, FECHA] }).scrollYProgress;
}

/**
 * Quanto do percurso cada item leva para acender, e onde o último começa.
 *
 * Os itens são distribuídos nos primeiros 85% do percurso e cada um acende ao
 * longo de 15% dele. As duas janelas se SOBREPÕEM de propósito: com fatias
 * disjuntas, um item só começaria a aparecer depois de o anterior estar cheio, e
 * a lista subiria em degraus. Sobrepostas, há sempre três ou quatro palavras a
 * meio caminho, que é o que faz a conta parecer escrita à mão em vez de
 * carimbada.
 */
const ESPALHA = 0.6;
const ACENDE = 0.15;

/**
 * O mesmo acender, encurtado para a janela do telefone.
 *
 * 15% do percurso são pouco mais de SEIS itens a meio caminho ao mesmo tempo —
 * e no desktop isso é a graça: a lista inteira está à vista, e a franja de
 * palavras chegando lê como escrita à mão. Na janela estreita cabem cinco
 * linhas. Uma franja de seis itens é MAIOR do que a janela: tudo que estava na
 * tela era texto a meio fade, e o dono leu exatamente assim — "as palavras estão
 * todas pretas, só ficam legíveis quando chego no fim da seção". Não estava
 * quebrado; estava calibrado para uma janela dez vezes maior.
 *
 * 4% é pouco mais de UM item de franja. A conta continua se escrevendo, mas o
 * que está escrito já se lê.
 */
const ACENDE_ESTREITO = 0.04;

/**
 * O mínimo do freio, para os quatro pontos do deslize nunca empatarem.
 *
 * `useTransform` precisa de entradas estritamente crescentes; antes da primeira
 * medida a janela mede zero e o freio calculado daria zero, empatando com o
 * ponto de partida.
 */
const FREIO_MINIMO = 0.01;

/**
 * Onde entram as duas linhas que FECHAM a conta, depois dos vinte e cinco itens.
 *
 * O total ("meses") em 66%, a frase da garantia em 77%, e a ordem entre eles é o
 * argumento: primeiro a soma acaba, depois o tempo que ela custa, e só então a
 * frase que diz que nada disso garante nada. Invertido, o soco chega antes de a
 * conta estar somada e bate no vazio.
 *
 * As duas terminam ANTES do fim do percurso — o soco fecha em 92% —, e a folga
 * que sobra é de propósito: é o painel claro subindo, e ele cobre o pé da coluna
 * primeiro. Uma frase que acende debaixo do papel não acende para ninguém.
 *
 * O fecho mora em `Comparacao.tsx` — é um parágrafo irmão desta lista, fora do
 * componente —, e por isso a fatia dele é exportada em vez de aplicada aqui.
 */
const FATIA_TOTAL = 0.66;

/**
 * Onde a CONTA acende, e ela é a linha do meio de uma cascata de três.
 *
 * Só existe no telefone: é lá que o valor entrou para DENTRO da lista, a pedido
 * do dono, como a linha que fecha a nota. No desktop a conta mora ao lado do
 * título e está de pé desde o primeiro quadro.
 *
 * A ordem é 60 · 62 · 66 · 77, e ela é o argumento inteiro da coluna em quatro
 * tempos: o último item entra, a conta responde a pergunta do alto, o tempo é
 * cobrado por cima do valor já dito, e só então o soco (que nada disso garante
 * nada). Cada uma entra quando a anterior terminou — nenhuma disputa a atenção
 * da outra, e é por isso que os números são estes e não quatro valores redondos.
 */
export const FATIA_CONTA = 0.62;
export const FATIA_TOTAL_PUBLICA = FATIA_TOTAL;
export const FATIA_FECHO = 0.77;

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
 * Uma palavra da fatura, com a própria fatia do percurso.
 *
 * Componente, e não um pedaço de JSX dentro do `map`, porque cada item precisa
 * do SEU `useTransform` — e hook nenhum pode nascer dentro de um laço: a ordem
 * das chamadas mudaria junto com o tamanho da lista, que é exatamente o que as
 * regras dos hooks proíbem. Com um componente por item, cada um tem a sua lista
 * de hooks, estável e do tamanho um.
 *
 * A opacidade vai em `style` e a COR continua em classe. As duas convivem no
 * mesmo elemento porque são propriedades diferentes: a rolagem escreve o quanto
 * a palavra existe, o ponteiro escreve o quanto ela está acesa, e nenhuma das
 * duas apaga a outra.
 */
function Palavra({
  progresso,
  fatia,
  acende,
  parado,
  numero,
  nome,
  className,
  aoApontar,
}: {
  progresso: MotionValue<number>;
  /** Onde no percurso esta palavra acende, de 0 a 1. */
  fatia: number;
  /** Quanto do percurso ela leva acendendo. Depende do tamanho da janela. */
  acende: number;
  /** A pessoa pediu menos movimento: a palavra nasce pronta. */
  parado: boolean;
  numero?: string;
  nome: string;
  className: string;
  aoApontar: (evento: React.MouseEvent) => void;
}) {
  const opacity = useTransform(progresso, [fatia, fatia + acende], [0, 1]);
  /*
   * ─── O QUE NÃO SE VÊ NÃO SE APONTA ───────────────────────────────────────
   *
   * O dono viu a lâmina aparecendo sobre um item que ainda estava invisível: a
   * palavra tinha `opacity: 0` e continuava recebendo o ponteiro, porque
   * opacidade zero não tira nada do caminho do mouse — só apaga o pixel.
   *
   * Aqui o próprio valor que apaga a palavra também fecha a porta dela. Em
   * `pointerEvents` derivado da opacidade, e não numa condição dentro do
   * handler: a condição resolveria o sintoma (a lâmina não abriria) e deixaria
   * o resto — o cursor viraria ponteiro sobre o nada, a palavra invisível
   * continuaria capturando o `mouseleave` das vizinhas, e o item de baixo, que
   * está visível, não receberia o hover que era para ser dele.
   *
   * O corte é em 60% e não em zero: entre 0 e 60 a palavra é um fantasma
   * chegando, e apontar um fantasma acende a lâmina de uma coisa que a pessoa
   * ainda não consegue ler.
   */
  const eventos = useTransform(opacity, (v) => (v > 0.6 ? 'auto' : 'none'));
  /* Seis pixels de subida junto com o fade. Sem eles a lista pisca para dentro
     da tela; com eles, cada item CHEGA — e é o que faz vinte e cinco linhas
     lerem como uma conta sendo escrita em vez de um texto que estava lá o tempo
     todo com a luz apagada. Em `transform`, que não empurra o texto ao lado nem
     obriga o navegador a refazer a justificação a cada quadro. */
  const y = useTransform(progresso, [fatia, fatia + acende], [6, 0]);

  return (
    <motion.span
      style={parado ? undefined : { opacity, y, pointerEvents: eventos }}
      onMouseEnter={aoApontar}
      className={className}
    >
      {numero != null && (
        <span className="mr-[0.45em] text-[0.6em] tabular-nums text-white/25">{numero}</span>
      )}
      {nome}
    </motion.span>
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
export function Ladainha({
  progresso,
  janelaRef,
  cauda,
}: {
  progresso: MotionValue<number>;
  /**
   * A caixa em que a lista corre, e ela é de quem MEDE — o painel escuro.
   *
   * Vem de fora porque a altura dela é o que sobrou da coluna depois do selo,
   * do título, da conta e do fecho, e quem sabe essa conta é o `flex` do painel.
   * Medida daqui de dentro, a lista teria de adivinhar o próprio lugar.
   */
  janelaRef: RefObject<HTMLDivElement>;
  /**
   * O que entra na fila DEPOIS dos vinte e cinco itens e antes do total.
   *
   * Vem de fora porque é a conta, e a conta é do painel: o contador, o valor e a
   * régua de revelação dela já moram lá, e trazer os três para cá só para
   * desenhá-los num lugar diferente seria mudar de dono um estado que não é
   * desta lista. Aqui ela só ocupa a posição que o dono pediu.
   */
  cauda?: ReactNode;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isDesktop = useIsDesktop();
  const parado = useReducedMotion() === true;
  const podeSeguir = isDesktop && !parado;
  // A franja de palavras a meio caminho tem de caber na janela em que ela
  // aparece — e as duas janelas não têm nada a ver uma com a outra.
  const acende = isDesktop ? ACENDE : ACENDE_ESTREITO;


  const [apontado, setApontado] = useState<Item | null>(null);
  const [aEsquerda, setAEsquerda] = useState(false);
  const x = useSpring(0, PERSEGUE);
  const y = useSpring(0, PERSEGUE);

  /*
   * ─── A CONTA CORRE DENTRO DA JANELA, e isso é só do telefone ───────────────
   *
   * O painel escuro é `sticky` e tem exatamente uma tela de altura. No desktop a
   * lista inteira cabe nela e não há assunto. Num aparelho de 320 por 568 ela
   * mede 684 pixels e começa a 404 do topo: dos vinte e cinco itens, o dono via
   * uns cinco. Os outros vinte existiam, estavam escritos, acendiam na hora
   * certa — embaixo da dobra de um painel que não rola, porque é isso que
   * `sticky` faz. A conta que a seção inteira foi construída para somar era
   * somada onde ninguém olhava.
   *
   * A saída NÃO é encolher o corpo até caber: vinte e cinco itens em cento e
   * oitenta pixels dariam letra de sete pixels, e uma lista que não se lê prova
   * menos ainda do que uma lista que não se vê. A saída é a lista CORRER: a
   * janela fica parada no vão que sobrou do painel e o texto sobe dentro dela,
   * puxado pela mesma régua que acende as palavras. O painel continua grudado,
   * a composição continua a mesma, e a fatura se escreve passando — que é mais
   * perto do que a seção sempre quis dizer do que uma lista parada.
   *
   * O casamento das duas réguas é o que faz funcionar, e ele não é acidental: o
   * item que está acendendo está SEMPRE dentro da janela. As palavras acendem
   * de 0 a `ESPALHA` e o total em `FATIA_TOTAL`; o deslize corre de 0 a
   * `FATIA_TOTAL` também, então quando a última palavra acende o texto ainda não
   * chegou ao fim do curso, e quando o total acende ele está no pé da janela —
   * que é exatamente onde um total tem de estar.
   *
   * Vale para quem pediu menos movimento também, e de propósito: isto não é
   * enfeite, é a única forma de o conteúdo ser alcançável. O que se move aqui
   * anda na velocidade do dedo de quem rola, e não sozinho.
   */
  const [corrida, setCorrida] = useState({ freio: FREIO_MINIMO, alvo: 0, fim: 0 });

  useLayoutEffect(() => {
    const janela = janelaRef.current;
    const lista = ref.current;
    if (janela == null || lista == null) return;

    const medir = () => {
      // `scrollHeight` da lista e não `getBoundingClientRect`: o deslize é um
      // `transform`, e o retângulo desenhado já viria deslocado pelo próprio
      // valor que estamos tentando calcular — a medida se perseguiria.
      const altura = janela.clientHeight;
      const fim = Math.max(0, lista.scrollHeight - altura);
      /*
       * Onde os ITENS acabam, que não é onde a lista acaba.
       *
       * O último filho do parágrafo é o total, e ele tem filete, respiro e corpo
       * de manchete — quase noventa pixels que não fazem parte da fatura. O
       * percurso dos itens tem de terminar no fim dos itens, senão a lista ainda
       * está correndo quando a última linha já acendeu. `offsetTop` é relativo
       * ao parágrafo porque ele é `relative`, então é ele o `offsetParent`.
       */
      /*
       * O marcador vence o último filho, e a diferença apareceu com a conta.
       *
       * A cauda deixou de ser só o total: no telefone a conta entra antes dele,
       * e medir pelo ÚLTIMO filho passaria a contar a conta como se ela fosse
       * item de fatura — a lista correria além do vigésimo quinto antes de ele
       * acender. `data-cauda` marca onde os itens acabam de verdade.
       *
       * `offsetParent` é o teste de que o marcador está visível: no desktop a
       * conta é `display: none`, e um elemento escondido devolve `offsetTop`
       * zero — o que zeraria a conta inteira em silêncio.
       */
      const marcado = lista.querySelector('[data-cauda]');
      const inicioDaCauda =
        marcado instanceof HTMLElement && marcado.offsetParent != null
          ? marcado
          : lista.lastElementChild;
      const fimDosItens =
        inicioDaCauda instanceof HTMLElement ? inicioDaCauda.offsetTop : lista.scrollHeight;
      const alvo = Math.min(fim, Math.max(0, fimDosItens - altura));
      // O FREIO: a lista não anda enquanto a janela não estiver cheia. Sem ele,
      // o texto começa a subir com três linhas escritas e a pessoa persegue uma
      // conta que foge dela antes de existir.
      const freio =
        fimDosItens > 0
          ? Math.min(ESPALHA * 0.98, Math.max(FREIO_MINIMO, ESPALHA * (altura / fimDosItens)))
          : FREIO_MINIMO;
      setCorrida((atual) =>
        Math.abs(atual.fim - fim) < 1 &&
        Math.abs(atual.alvo - alvo) < 1 &&
        Math.abs(atual.freio - freio) < 0.005
          ? atual
          : { freio, alvo, fim },
      );
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(janela);
    observador.observe(lista);
    return () => observador.disconnect();
  }, [janelaRef]);

  /*
   * O deslize em três trechos, e cada dobra tem um porquê.
   *
   * `0 → freio`: parado. A janela está se enchendo, e nada precisa correr.
   * `freio → ESPALHA`: a lista sobe com a FRENTE DA ESCRITA colada na borda de
   *   baixo — as linhas acesas ficam acima dela, legíveis, e a próxima chega por
   *   baixo. É este trecho que estava errado: um deslize linear de 0 a
   *   `FATIA_TOTAL` subia mais rápido do que a escrita, e o que sobrava na
   *   janela eram só as linhas ainda apagadas. A conta corria na frente da
   *   própria soma.
   * `ESPALHA → FATIA_TOTAL`: os itens acabaram e o que falta subir é o total,
   *   que chega ao pé da janela exatamente quando acende.
   *
   * No layout largo os três números dão zero — a lista cabe, `fim` e `alvo` são
   * zero, e isto é uma translação de zero pixel do começo ao fim.
   */
  const deslize = useTransform(
    progresso,
    [0, corrida.freio, ESPALHA, FATIA_TOTAL],
    [0, 0, -corrida.alvo, -corrida.fim],
  );

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
      <motion.p
        ref={ref}
        // O deslize da conta dentro da janela. Zero no desktop, onde `excedente`
        // é zero porque a lista cabe — o `style` existe nos dois layouts e só
        // tem efeito num deles, que é melhor do que dois caminhos de render.
        style={{ y: deslize }}
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
          const aceso = apontado === item;
          return (
            // O espaço é um nó de texto de verdade, e não uma margem: a
            // justificação estica os ESPAÇOS entre as caixas, e uma margem fixa
            // não é espaço nenhum. Com `mr-[0.35em]` as linhas continuavam
            // terminando onde queriam.
            <Fragment key={item.nome}>
              <Palavra
                progresso={progresso}
                acende={acende}
                parado={parado}
                fatia={(i / ITENS.length) * ESPALHA}
                numero={String(i + 1).padStart(2, '0')}
                nome={item.nome}
                aoApontar={apontar(item)}
                /*
                 * BRANCO CHEIO no telefone, a pedido do dono, e ali é a única
                 * cor que faz sentido.
                 *
                 * Os 45% existem para o desktop, onde a lista inteira está à
                 * vista: apagada, ela é PROVA que sustenta o argumento sem
                 * disputar com o título, e o branco fica reservado para o item
                 * sob o ponteiro. No telefone não há ponteiro — `podeSeguir` é
                 * falso —, então o estado aceso nunca acontece e os 45% deixam
                 * de ser um degrau de hierarquia para virar simplesmente uma
                 * lista cinza. Pior: ela corre dentro de uma janela de cinco
                 * linhas, sobre preto, num aparelho que pode estar no sol.
                 *
                 * Os três estados continuam inteiros onde eles significam algo.
                 */
                className={`inline-block whitespace-nowrap [word-spacing:normal] transition-colors duration-300 ${
                  podeSeguir ? 'cursor-default' : ''
                } ${
                  !isDesktop
                    ? 'text-white'
                    : aceso
                      ? 'text-white'
                      : apontado == null
                        ? 'text-white/45'
                        : 'text-white/20'
                }`}
              />{' '}
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
        {/* O total acende DEPOIS do último item, na ponta do percurso: ele é a
            linha que fecha a soma, e uma soma que se fecha antes da última
            parcela não fecha nada. */}
        {cauda}

        {/* O FILETE do total sai no telefone, a pedido do dono.
 
            Ele existe para fazer a leitura de "total": vinte e cinco itens, uma
            linha, e embaixo dela a única coisa que a lista não sabe cobrar. Só
            que agora quem responde a pergunta é a CONTA, que entra logo acima —
            e com ela ali, o filete deixa de separar a soma do seu fecho e passa
            a cortar o meio de um par que se lê junto. O respiro sozinho já
            separa, e separa sem desenhar nada. */}
        <Palavra
          progresso={progresso}
          acende={acende}
          parado={parado}
          fatia={FATIA_TOTAL}
          nome={TEMPO.nome}
          aoApontar={apontar(TEMPO)}
          className={`mt-7 block w-fit pt-0 [word-spacing:normal] font-serif text-[2rem] leading-none text-[#F4F1E8] sm:border-t sm:border-white/[0.12] sm:pt-7 md:mt-9 md:pt-9 md:text-[3rem] ${
            podeSeguir ? 'cursor-default' : ''
          }`}
        />
      </motion.p>

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
