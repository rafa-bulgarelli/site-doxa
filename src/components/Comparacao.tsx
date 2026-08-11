import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usarNaTela } from '../hooks/usarNaTela';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import wordmarkUrl from '../../brand/doxa-wordmark-white-96.avif';
import { ANCORA_FORMS } from '../ancoras';
import { MANCHETE, TITULO_SECAO } from '../tipografia';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
import { BordaViva } from './comparacao/BordaViva';
import { FioConvite } from './comparacao/FioConvite';
import { useIdioma } from '../idioma';
import { Formulario } from './comparacao/Formulario';
import {
  FATIA_CONTA,
  FATIA_FECHO,
  FATIA_TOTAL_PUBLICA,
  Ladainha,
  useContagem,
} from './comparacao/Ladainha';
import { ProvaRotativa } from './comparacao/ProvaRotativa';
import {
  CONVITE,
  CUSTO_ATE,
  CUSTO_DE,
  CUSTO_UNIDADE,
  FALTA,
  GARANTIA,
  NO_AR,
  PARADO,
  PERGUNTA,
  PERGUNTA_ESTREITA,
  SEM_GARANTIA,
  TROCA_ANTES,
  TROCA_DEPOIS,
} from './comparacao/config';

/** A cor do papel — a única superfície clara da página. */
const PAPEL = '#F4F1E8';

/**
 * O locale dos números e os conectores da conta riscada.
 *
 * "R$ 8.000 a 10.500/mês em uma agência" tem QUATRO peças que mudam de idioma:
 * o separador de milhar, o "a" do intervalo, o "/mês" e o "em". Traduzir só as
 * palavras deixaria "R$ 8.000 to 10.500" — número brasileiro em frase inglesa,
 * que lê como oito ponto zero zero zero. O R$ fica: o custo é brasileiro e a
 * moeda é um fato, não uma tradução.
 */
const CONTA_IDIOMA = {
  pt: { locale: 'pt-BR', intervalo: 'a', em: 'em' },
  en: { locale: 'en-US', intervalo: 'to', em: 'on' },
} as const;

/**
 * O respiro entre os blocos do painel escuro, e ele é UM só.
 *
 * O dono pediu que o vão embaixo do cabeçalho fosse exatamente igual ao do
 * rótulo da fatura. Em vez de acertar dois números na mão e vê-los divergirem
 * na próxima mexida, o valor mora aqui e é usado nos três lugares: entre o
 * cabeçalho e o fio, entre o fio e o rótulo, e entre o rótulo e a conta. Um
 * ritmo, não três coincidências.
 */
const RESPIRO = 'mt-7 md:mt-10';

/**
 * O ângulo com que o painel claro entra, em graus.
 *
 * Trinta, pivotando no canto inferior esquerdo: é a carta sendo virada sobre a
 * mesa. Menos que isso não se lê como gesto; mais que isso deixa o texto do
 * painel ilegível por tempo demais no meio do caminho.
 */
const GIRO = 30;

/**
 * A coluna estreita — o mesmo ponto em que `sm:` vira a chave no resto desta
 * seção.
 *
 * Não é o `lg` do `useIsDesktop`: quem decide aqui é a JANELA da fatura, e ela
 * existe só abaixo de 640 (`sm:flex-initial`). Dois pontos de corte para uma
 * decisão só é um deles estando errado em alguma largura.
 */
const COLUNA_ESTREITA = '(max-width: 639px)';

/**
 * Quanto a coluna escura SOBE antes de o papel chegar, em alturas de tela.
 *
 * O defeito, medido em 390 por 844: o fecho — "E ainda assim, nenhuma garantia
 * de viralizar." — vive entre 87% e 95% da tela, encostado na borda de baixo, e
 * o papel branco começa a comê-lo poucos pixels de rolagem depois de ele
 * acender. A frase mais alta da coluna aparecia no pior lugar possível e no pior
 * momento possível.
 *
 * Um quarto de tela levava o fecho dos 87% para os 62% — a marca que o dono
 * desenhou de verde, logo abaixo do vigésimo quinto item. Visto na tela, ele
 * pediu mais vinte por cento: a frase PASSA da marca e assenta perto da metade
 * da altura, com o papel ainda inteiro fora do quadro.
 *
 * Quarenta e cinco é o total, e ele não anda sozinho — a régua da subida cresceu
 * junto, e tem de crescer. A distância é percorrida num trecho de rolagem fixo:
 * subir mais no mesmo trecho é subir MAIS RÁPIDO, e passar da velocidade do dedo
 * é exatamente o que faz uma coluna deixar de acompanhar a mão e começar a fugir
 * dela. O dono pediu rolagem mais lenta uma mensagem antes; um número mudado
 * sozinho aqui teria desfeito aquilo em silêncio, no trecho mais visível da
 * seção.
 *
 * Sobe a COLUNA, e não só a frase: mover uma peça sozinha abriria um buraco no
 * meio de uma composição que foi afinada junta, e a janela da fatura ficaria
 * pendurada. Subindo tudo, a leitura é a que o dono descreveu — a seção rola —,
 * e o preço é o título saindo por cima. É preço e não perda: quando o fecho
 * acende, a pergunta já esteve em pé por duas telas de rolagem, e o que ela
 * cede é lugar para a resposta dela.
 */
const SUBIDA = 45;

/**
 * O logo no lugar da palavra: "Sem [DOXA]" e "Com [DOXA]", com o ponto de
 * estado na frente.
 *
 * O ponto pulsa como um LED: um núcleo sólido e um anel que cresce e some. No
 * lado escuro ele é vermelho e a seção inteira lê como sistema parado; no claro
 * é verde, e a mesma marca aparece ligada. É a virada de preto para creme dita
 * uma segunda vez, num objeto de oito pixels.
 */
function Selo({ prefixo, escuro = false }: { prefixo: string; escuro?: boolean }) {
  const cor = escuro ? NO_AR : PARADO;
  const [selo, setSelo] = useState<HTMLSpanElement | null>(null);
  const seloNaTela = usarNaTela(selo);

  return (
    /*
     * A pílula é o enfeite que o dono pediu, e ela faz trabalho além de
     * enfeitar: solto na página, o par ponto-mais-logo era um item de texto com
     * uma bolinha na frente. Fechado numa cápsula com a borda e o fundo tingidos
     * pela própria cor, vira um SELO — um objeto que declara um estado, que é o
     * que ele sempre quis ser.
     *
     * A cor entra em três intensidades e nenhuma delas é chapada: um fio de
     * borda, uma névoa de fundo e o ponto cheio. É o que deixa o vermelho e o
     * verde presentes sem que a seção vire colorida — o olho lê "há uma cor
     * aqui" e continua lendo preto e creme.
     */
    <span
      ref={setSelo}
      /* Fora da tela, os dois anéis param. A seção é alta — quatro telas —, e o
         freio de seção do `App` só desliga o que está longe da SEÇÃO INTEIRA;
         um selo no topo dela continua pulsando com o visitante lá no
         formulário, no pé. `fora-da-tela` é a mesma regra do `index.css`,
         aplicada na peça em vez de no bloco. */
      /* METADE do tamanho até 640px, a pedido do dono. Cada medida do selo
         caiu pela metade — respiro, vãos, ponto, corpo e altura do logo —, e
         não só o corpo do texto: encolher a letra dentro de uma cápsula do
         mesmo tamanho não faz a cápsula diminuir, faz ela ficar folgada. O par
         "Sem"/"Com" encolhe junto porque é um par: os dois painéis se leem em
         comparação, e um selo maior que o outro vira diferença de importância.
         `sm:` devolve tudo de 640 para cima. */
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border py-1 pl-1.5 pr-2 sm:gap-2.5 sm:py-2 sm:pl-3 sm:pr-4 ${
        seloNaTela ? '' : 'fora-da-tela'
      }`}
      style={{ borderColor: `${cor}59`, background: `${cor}14` }}
    >
      <span className="relative flex h-1 w-1 shrink-0 sm:h-2 sm:w-2" aria-hidden>
        {/* Dois anéis, e o segundo sai com meio ciclo de atraso: um anel só
            expande, some, e deixa um vão de silêncio antes do próximo — o que
            se vê é um piscar intermitente. Defasados, sempre há um anel
            nascendo enquanto o outro apaga, e a leitura passa de "pisca" para
            "está transmitindo". */}
        {/* Os dois anéis são CSS puro, e o motivo está em `.selo-anel`: em JS
            eles rodavam na thread principal, junto com o giro do painel e o
            facho do ponteiro, e engasgavam. `transform` e `opacity` em CSS
            sobem para o compositor e ficam lisos por construção. */}
        {['selo-anel', 'selo-anel selo-anel-tardio'].map((classe) => (
          <span
            key={classe}
            className={`absolute inline-flex h-full w-full rounded-full ${classe}`}
            style={{ background: cor }}
          />
        ))}
        {/* O núcleo tem brilho próprio na cor: sem ele o ponto é um adesivo
            colorido, com ele é uma luz acesa. */}
        <span
          className="relative inline-flex h-1 w-1 rounded-full sm:h-2 sm:w-2"
          style={{ background: cor, boxShadow: `0 0 10px ${cor}, 0 0 3px ${cor}` }}
        />
      </span>

      {/* Caixa normal, a pedido do dono: em versalete o prefixo competia com o
          logo ao lado, e os dois juntos liam como duas marcas. */}
      <span
        className={`text-[7px] tracking-tight sm:text-[13px] ${escuro ? 'text-black/60' : 'text-white/60'}`}
      >
        {prefixo}
      </span>
      {/* A arte é branca sobre transparente — no painel creme ela vira tinta com
          um `invert`, que é exato para um PNG de um só tom. Card 002 quer isto
          vetorizado; enquanto for bitmap, é assim que se consegue as duas cores
          a partir de um arquivo. */}
      <img
        src={wordmarkUrl}
        alt="Doxa"
        className={`h-[8px] w-auto sm:h-[15px] ${escuro ? 'invert' : ''}`}
      />
    </span>
  );
}

/**
 * Sem Doxa / Com Doxa — dois painéis, e o CTA da página.
 *
 * O painel preto pergunta e fica parado enquanto o creme sobe girado e cobre
 * ele. A virada É a resposta: a pergunta é feita no escuro e respondida quando a
 * página fica clara. Preto e creme já são o vocabulário do site — o creme é a
 * única superfície clara da página inteira, e é onde mora o pedido.
 *
 * O scroll só é usado no giro, e o giro dura uma tela. Assim que o painel claro
 * assenta, ele para e o scroll volta a ser do visitante: esta é a seção onde se
 * decide, e decidir exige poder parar, reler e voltar o olho. Prender o scroll no
 * instante da decisão é o único lugar da página onde isso custa dinheiro — foi
 * por isso que a versão de cinco painéis presos ao scroll ficou de fora.
 *
 * Feito com `useScroll` e `useTransform`, que já estão no bundle. A referência
 * que o dono trouxe usava GSAP com ScrollTrigger: quarenta quilobytes
 * comprimidos e um segundo runtime de animação no projeto para sempre, para um
 * efeito que a ProofWall já produz com as mesmas duas linhas.
 */
/**
 * O valor subindo de zero ao total quando a seção chega.
 *
 * Não é enfeite: num painel cujo clímax é um número, ver o número SUBIR é o
 * argumento chegando. E não compete com nada, porque acontece uma vez só e para.
 *
 * Formatado em pt-BR a cada quadro em vez de guardado como string: o separador
 * de milhar tem de existir durante a contagem, senão o valor pisca de quatro
 * para cinco caracteres no meio do caminho e a linha inteira dança.
 */
function Contador({
  ate,
  naTela,
  locale: localeDoContador = 'pt-BR',
}: {
  ate: number;
  naTela: boolean;
  locale?: string;
}) {
  const parado = useReducedMotion() === true;
  // Zero, sempre — exceto para quem pediu menos movimento. A versão anterior
  // testava `!naTela` aqui, e `naTela` é falso no primeiro render por
  // construção: o valor nascia já no total e a contagem nunca acontecia.
  const bruto = useMotionValue(parado ? ate : 0);
  const texto = useTransform(bruto, (v) => Math.round(v).toLocaleString(localeDoContador));

  useEffect(() => {
    if (!naTela || parado) return;
    const controle = animate(bruto, ate, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controle.stop();
  }, [naTela, parado, ate, bruto]);

  return <motion.span className="tabular-nums">{texto}</motion.span>;
}

/**
 * Um pedaço de texto com o risco desenhado por cima.
 *
 * Dois pixels de barra absoluta, e não `line-through`: o risco é um GESTO e
 * precisa ser traçado da esquerda para a direita quando o painel chega.
 * Decoração de texto não anima.
 *
 * E é por isso que ele passou a ser por PEDAÇO. Uma barra só, esticada sobre a
 * frase inteira, funciona enquanto a frase couber numa linha — no desktop cabe.
 * No telefone a frase quebra em duas, e `top: 50%` de uma caixa de duas linhas é
 * o vão ENTRE elas: o dono via um traço no meio da frase sem cortar nada, que é
 * a única coisa que um risco não pode ser. Com um risco por pedaço, cada linha
 * ganha o seu, e o gesto continua sendo um gesto.
 */
function Riscado({
  children,
  className,
  ativo,
  parado,
  atraso,
}: {
  children: ReactNode;
  className: string;
  /** O painel chegou: é a hora de riscar. */
  ativo: boolean;
  parado: boolean;
  /** Segundos de espera. Os pedaços entram em ordem, como uma caneta passando. */
  atraso: number;
}) {
  return (
    <span className={`relative ${className}`}>
      {children}
      <motion.span
        aria-hidden
        className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 origin-left bg-black/45"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: parado || ativo ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: atraso }}
      />
    </span>
  );
}

/**
 * A conta do jeito antigo, e ela vive em DOIS lugares que nunca aparecem juntos.
 *
 * Até 640px ela é o ÚLTIMO elemento da coluna, grande, como resposta à pergunta
 * do alto — pedido do dono. De 640 para cima continua onde sempre esteve, ao
 * lado do título. As duas instâncias são a mesma função de propósito: são o
 * mesmo número, e dois trechos de JSX com `CUSTO_DE` dentro divergiriam no dia
 * em que alguém mexesse num só. A que não é a vez fica em `display: none`, então
 * o leitor de tela lê o valor uma vez.
 */
function Conta({
  naTela,
  className,
  unidade,
}: {
  naTela: boolean;
  className: string;
  /** O `/mês`, que tem corpo próprio em cada um dos dois lugares. */
  unidade: string;
}) {
  const [idioma] = useIdioma();
  return (
    <span className={className}>
      R$ <Contador ate={CUSTO_DE} naTela={naTela} locale={CONTA_IDIOMA[idioma].locale} />{' '}
      {CONTA_IDIOMA[idioma].intervalo}{' '}
      <Contador ate={CUSTO_ATE} naTela={naTela} locale={CONTA_IDIOMA[idioma].locale} />
      {/* O `/mês` em destaque, a pedido do dono, e o argumento é dele: no fim
          do dia o que dói não é o valor, é a recorrência dele. Um custo alto se
          engole uma vez; um custo alto TODO MÊS, sem resultado garantido, é o
          que faz a pergunta do título doer. */}
      <span className={`align-baseline text-white/75 ${unidade}`}>{CUSTO_UNIDADE[idioma]}</span>
    </span>
  );
}

/** Se a seção está no layout de uma coluna só. Ver `COLUNA_ESTREITA`. */
function useColunaEstreita() {
  const [estreita, setEstreita] = useState(() => window.matchMedia(COLUNA_ESTREITA).matches);

  useEffect(() => {
    const consulta = window.matchMedia(COLUNA_ESTREITA);
    const atualizar = () => setEstreita(consulta.matches);
    atualizar();
    consulta.addEventListener('change', atualizar);
    return () => consulta.removeEventListener('change', atualizar);
  }, []);

  return estreita;
}

export function Comparacao() {
  const [idioma] = useIdioma();

  const escuroRef = useRef<HTMLDivElement>(null);
  const claroRef = useRef<HTMLDivElement>(null);
  /**
   * As três peças do fio: a caixa em que ele mora e as duas pontas.
   *
   * NÓS, e não `ref`, pela armadilha que está documentada em `FioConvite` e no
   * `CLAUDE.md` — com `ref`, o fio e as duas bordas vivas não existiam no site
   * publicado. O cartão do pedido é preso lá dentro do `Formulario`, que avisa
   * por `aoPrenderCartao`: quem o desenha é quem sabe quando ele chegou.
   */
  const [grade, setGrade] = useState<HTMLDivElement | null>(null);
  const [falta, setFalta] = useState<HTMLDivElement | null>(null);
  const [cartao, setCartao] = useState<HTMLDivElement | null>(null);
  const parado = useReducedMotion() === true;
  const contaNaTela = useInView(escuroRef, { amount: 0.4, once: true });
  /**
   * Quando o painel claro chega — o que dispara o risco sobre o custo antigo.
   *
   * Riscar é um GESTO, e um gesto que já aconteceu não é um gesto: com o traço
   * pronto, o par vira só duas linhas de texto, uma delas cortada. Feito na
   * frente de quem lê, é alguém cancelando a conta.
   */
  const conviteNaTela = useInView(claroRef, { amount: 0.25, once: true });

  /*
   * ─── UMA RÉGUA SÓ PARA A CHEGADA DO PAPEL ───────────────────────────────────
   *
   * Havia duas: uma para o GIRO (`start end` → `start 25%`) e outra para a
   * SUBIDA da coluna (`start 170%` → `start 112%`). Mediam o MESMO elemento, e
   * cada `useScroll` com alvo remede esse alvo a cada quadro de rolagem —
   * subindo a cadeia de `offsetTop` e lendo `scrollHeight` do documento, o que
   * obriga o navegador a refazer o layout parado, na hora.
   *
   * MEDIDO no telefone, rolando pela entrada do papel: 1320 leituras que forçam
   * layout em três gestos, ~440 por gesto, com a pilha apontando para o
   * `measure` do framer-motion. Duas réguas mediam duas vezes a mesma coisa.
   *
   * ─── POR QUE ISTO É EXATO, E NÃO UMA APROXIMAÇÃO ────────────────────────────
   *
   * As duas réguas usavam o mesmo `start` do mesmo elemento: as duas são função
   * LINEAR de uma única grandeza, a distância entre o topo do papel e a janela.
   * A altura do painel não entra na conta (só entraria se algum limite usasse
   * `end`), e por isso uma régua larga com dois remapeamentos devolve os mesmos
   * números que as duas devolviam — não parecidos, os mesmos.
   *
   * A régua vai de `start 170%` a `start 25%` — 145% de tela — e cada uso
   * recorta a sua faixa:
   *
   *   giro    começava em 100% e terminava em 25%  →  (170-100)/145 = 0,4828 a 1
   *   subida  começava em 170% e terminava em 112% →  0 a (170-112)/145 = 0,40
   *
   * `useTransform` trava nas pontas por padrão, que é o mesmo que `useScroll`
   * fazia fora dos seus limites.
   *
   * QUEM MEXER NUM DOS LIMITES refaz as duas frações aqui, e confere com o
   * `transform` real em algumas alturas de rolagem — foi assim que esta troca
   * foi validada, matriz por matriz, contra o site publicado.
   */
  const { scrollYProgress: reguaDoPapel } = useScroll({
    target: claroRef,
    offset: ['start 170%', 'start 25%'],
  });

  // Os mesmos limites da referência: começa a girar quando o topo do painel
  // encosta no fim da tela e termina quando esse topo chega a um quarto dela.
  const scrollYProgress = useTransform(reguaDoPapel, [0.4827586206896552, 1], [0, 1]);

  /**
   * A APROXIMAÇÃO do papel, que é a régua da subida — ver `SUBIDA`.
   *
   * Medida contra o painel claro e não contra a seção, e é o ponto todo: o que
   * a subida precisa vencer é a CHEGADA DELE, e só ele sabe onde está. Contra a
   * seção, o mesmo número acertaria numa altura de tela e erraria na seguinte,
   * porque a seção tem alturas fixas somadas a um painel que cresce com o
   * conteúdo.
   *
   * Termina em 112% — o topo do papel a doze por cento de tela abaixo da dobra
   * — e não em 100%: o painel entra GIRADO trinta graus sobre o canto inferior
   * esquerdo, e a aresta de cima dele aparece cerca de doze centésimos de tela
   * antes do que a caixa reta sugere. A subida acaba no quadro anterior ao
   * primeiro pixel de papel.
   *
   * Começa em 170%, logo depois de a lista estacionar e um pouco antes de o
   * fecho acender: a frase sobe enquanto aparece, em vez de aparecer e depois
   * se mudar de lugar. São 58% de tela de rolagem para 45% de subida — 0,78 do
   * dedo, mais devagar do que a mão, que é o que distingue uma coluna subindo
   * de uma coluna fugindo.
   *
   * Essa PROPORÇÃO é o que se preserva quando a distância muda, e não os
   * números. A régua já foi 33% para 25% de subida (0,76 do dedo) e 38% para os
   * mesmos 25% (0,66), quando o dono pediu tudo mais devagar. Ao subir a
   * distância para 45, manter os 38% teria dado 1,18 — a coluna passaria a
   * andar mais que a mão. Quem mexer em `SUBIDA` mexe aqui na mesma linha.
   *
   * Ela precisa de ajuste próprio porque é medida em TELAS, contra a
   * aproximação do papel, e não em fração da seção: ela não pega carona no
   * fôlego quando ele cresce.
   */
  const chegadaDoPapel = useTransform(reguaDoPapel, [0, 0.4], [0, 1]);
  const estreita = useColunaEstreita();
  const subida = useTransform(chegadaDoPapel, [0, 1], ['0vh', `-${SUBIDA}vh`]);

  /** O envelope da seção, emprestado à ladainha para ela medir a rolagem. */
  const secaoRef = useRef<HTMLElement>(null);

  /*
   * A régua da contagem, uma só para a lista e para a frase que a fecha.
   *
   * As duas são irmãs aqui dentro e precisam do MESMO percurso — dois
   * `useScroll` com os mesmos limites dariam o mesmo número hoje e divergiriam
   * no dia em que alguém ajustasse um deles, com a frase final entrando no meio
   * da lista. `Ladainha.tsx` guarda os limites e o porquê deles.
   */
  const contagem = useContagem(secaoRef);
  /**
   * A caixa em que a ladainha corre no telefone. Ver o bloco que a monta.
   *
   * Estado, e não `ref`, porque quem precisa dela é um filho: a lista mede a
   * própria pista e o React só prende a `ref` desta caixa DEPOIS de rodar os
   * efeitos de dentro. Com `ref`, o filho acordava com `null` na mão, desistia,
   * e nunca mais era acordado — a lista ficava congelada e a conta serrada na
   * borda. Um nó em estado chega numa renderização, e renderização o filho vê.
   * A nota inteira está em `Ladainha`, na prop `janela`.
   */
  const [janelaLadainha, setJanelaLadainha] = useState<HTMLDivElement | null>(null);
  /*
   * A revelação da conta, e o gatilho do contador junto com ela.
   *
   * A régua vai de `FATIA_CONTA` até o total: a conta termina de entrar no quadro
   * exato em que "E o seu tempo." começa, logo abaixo dela. É o que faz a cauda
   * ser lida como duas linhas de um fecho e não como duas coisas piscando.
   *
   * `contaAcesa` existe porque o contador e a revelação precisavam ser o MESMO
   * evento. Preso ao `contaNaTela` do painel, o número subia de zero a dez mil e
   * quinhentos enquanto ainda estava invisível — a contagem inteira acontecia
   * atrás de uma opacidade zero, e o que aparecia depois era um número parado.
   * Aqui ele começa a subir quando a conta começa a aparecer.
   */
  const contaOpacity = useTransform(contagem, [FATIA_CONTA, FATIA_TOTAL_PUBLICA], [0, 1]);
  const contaY = useTransform(contagem, [FATIA_CONTA, FATIA_TOTAL_PUBLICA], [10, 0]);
  const [contaAcesa, setContaAcesa] = useState(false);
  useMotionValueEvent(contagem, 'change', (valor) => {
    if (valor >= FATIA_CONTA) setContaAcesa(true);
  });
  const fechoOpacity = useTransform(contagem, [FATIA_FECHO, 1], [0, 1]);
  const fechoY = useTransform(contagem, [FATIA_FECHO, 1], [10, 0]);
  const giro = useTransform(scrollYProgress, [0, 1], [GIRO, 0]);

  /*
   * O papel ganha camada própria ENQUANTO gira, e só enquanto gira.
   *
   * Girar um elemento do tamanho da tela obriga o navegador a recompor a área
   * inteira a cada quadro. Com `will-change: transform` ele passa a ser uma
   * textura que a GPU roda, em vez de um desenho refeito — MEDIDO na entrada do
   * papel, o pior quadro caiu de 41ms para 27ms.
   *
   * E SAI quando o giro acaba, o que não é economia de memória e sim de
   * desenho: uma camada permanente do tamanho da tela custa memória de vídeo o
   * tempo todo e desliga a suavização por subpixel do texto que ela carrega —
   * e o que ela carrega é o formulário, que é justamente onde alguém vai LER e
   * digitar. A promoção dura os poucos quadros em que serve.
   *
   * A margem de 0,30 é para a camada existir um pouco ANTES do primeiro grau de
   * giro: promover custa um desenho, e esse desenho tem de acontecer antes do
   * movimento começar, não no primeiro quadro dele.
   */
  const [girando, setGirando] = useState(false);
  useMotionValueEvent(reguaDoPapel, 'change', (valor) => {
    const dentro = valor > 0.3 && valor < 1;
    setGirando((antes) => (antes === dentro ? antes : dentro));
  });

  return (
    // `overflow-x-clip` e não `overflow-hidden`: `hidden` cria um contexto de
    // rolagem e o `sticky` do painel escuro para de grudar. `clip` corta o canto
    // que o painel girado joga para fora sem criar contexto nenhum.
    <section
      ref={secaoRef}
      data-secao="Quanto custa"
      className="relative overflow-x-clip bg-doxa-bg"
    >
      {/* ── Painel escuro: a pergunta e a conta. */}
      <div
        ref={escuroRef}
        className="sticky top-0 flex h-screen flex-col px-5 pb-10 pt-16 md:px-10 md:pb-14 md:pt-24"
      >
        {/* Sem grade aqui, a pedido do dono, e o painel ganha com isso: a
            ladainha é um bloco de texto justificado que ocupa metade da tela, e
            pontos atrás dela disputam com as vinte e cinco linhas que a pessoa
            precisa ler. É também o único painel escuro cuja atração já é o
            texto — nos outros a grade preenche o vazio em volta do conteúdo,
            aqui não há vazio. */}

        {/* A coluna inteira sobe no fim, e só no telefone — ver `SUBIDA`.
            No layout largo a coluna cabe na tela com folga e o papel nunca
            chegou perto do fecho: `y` fica em zero e esta é a mesma `div` de
            sempre. */}
        <motion.div
          style={estreita ? { y: subida } : undefined}
          className="relative mx-auto flex h-full w-full max-w-screen-2xl flex-col"
        >
          <Selo prefixo="Sem" />

          {/* A pergunta à esquerda, a CONTA à direita — foi para cá que o número
              subiu, e não é arrumação: no rodapé ele ficava embaixo do painel
              claro, que entra girado e cobre o terço de baixo da tela. O valor é
              o clímax da coluna e não podia estar na parte que some. */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            {/* 1,75rem só até 640px, e o número é o que faz a primeira linha
                caber inteira.

                A 36px, "Quanto custa não ter a Doxa" não entra nos 280 pixels
                úteis de um telefone de 320 e quebra sozinha depois do "a" — o
                título chegava em três linhas com a palavra Doxa órfã na segunda,
                que foi o que o dono leu. A 28px a linha cabe, o `<br>` volta a
                ser a única quebra que existe, e o título recupera as duas linhas
                que ele foi escrito para ter. De 640px para cima nada muda. */}
            {/* 2,25rem no telefone — 1,25x sobre os 1,8 anteriores, a pedido
                do dono, e o número vive em `TITULO_SECAO` porque a comparação é
                o único consumidor dele.

                A 36px a primeira linha de `PERGUNTA` mede 321 pixels nos 280
                úteis e quebraria depois do "a", com "Doxa" órfã. Daí
                `PERGUNTA_ESTREITA`: as mesmas palavras, com a dobra escrita
                depois de "ter" — duas linhas de 238 e 261, e o artigo fica com o
                substantivo. Duas e não três de propósito: a terceira custaria 37
                pixels da janela em que a fatura corre logo abaixo. */}
            <h2
              className={`font-serif ${TITULO_SECAO} font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl md:text-6xl`}
            >
              <span className="sm:hidden">
                {PERGUNTA_ESTREITA[idioma][0]}
                <br />
                {PERGUNTA_ESTREITA[idioma][1]}
              </span>
              <span className="hidden sm:inline">
                {PERGUNTA[idioma][0]}
                <br />
                {PERGUNTA[idioma][1]}
              </span>
            </h2>

            {/* A pílula da recorrência saiu a pedido do dono, e o valor cresceu
                para ocupar o peso que ela dividia. O `/mês` sozinho já diz que
                é recorrente, e um número desacompanhado bate mais forte do que
                um número com uma legenda ao lado pedindo atenção. */}
            {/* ESCONDIDA no telefone, e é uma mudança de ordem, não de peso: a
                conta desceu para o pé da coluna, onde ela responde a pergunta em
                vez de dividir a linha com ela. O bloco continua aqui, intacto,
                de 640px para cima — no desktop a coluna inteira cabe na tela e a
                pergunta e a resposta lado a lado são uma frase só.

                Os 48 pixels que ela devolve ao cabeçalho (o próprio corpo e o
                `gap-y-6` que ela obrigava) voltam para a janela da lista, que é
                quem estava pagando a conta desta seção no telefone. */}
            <Conta
              naTela={contaNaTela}
              className="hidden whitespace-nowrap font-serif leading-none text-white sm:block sm:whitespace-normal sm:text-[2.6rem] md:text-[4.6rem]"
              unidade="ml-1 sm:text-3xl md:text-[3.2rem]"
            />
          </div>

          {/* A ladainha desceu de corpo e a frase abaixo dela subiu, e essa
              troca é a hierarquia inteira. Antes, pergunta, conta e lista tinham
              o mesmo peso e o olho não sabia onde pousar — foi o que o dono leu
              como "sem destaque". A lista é PROVA, não manchete: em corpo médio
              e apagada, ela sustenta o argumento sem disputar com ele.

              O resto da tela fica vazio de propósito: o painel claro entra
              girado por baixo e come o terço inferior. */}
          {/* O CABEÇALHO DA FATURA saiu inteiro, em duas ordens do dono: o
              "25 itens" primeiro, o rótulo "Para fazer sozinho, você precisa de"
              depois. Sobrou o filete, que migrou para cá — e ele sozinho faz o
              trabalho que os dois faziam.

              Vale registrar o que se perde e por que não faz falta. O rótulo
              anunciava a lista, e a contagem antecipava o tamanho dela; as duas
              coisas explicavam de antemão um bloco que agora se EXPLICA
              sozinho, escrevendo-se conforme a pessoa rola. Um título em cima de
              uma conta que está sendo somada na frente de quem lê é legenda de
              museu — e o filete separa tão bem quanto, sem falar nada. */}
          {/* `flex-1 min-h-0` até 640px, e é ele que cria a JANELA da conta.

              O painel é `sticky` e tem uma tela de altura exata. No telefone os
              vinte e cinco itens medem 684 pixels num vão de menos de duzentos:
              o dono via cinco e os outros vinte acendiam embaixo da dobra de um
              painel que, por ser grudado, nunca rola até eles. Com `flex-1`, este
              bloco passa a valer exatamente o que sobrou da coluna depois do
              selo, do título, da conta e do fecho — e é dentro dele que a lista
              corre, puxada pela mesma régua que a acende.

              `min-h-0` não é enfeite: um filho de flex se recusa a encolher
              abaixo do próprio conteúdo por padrão, e sem isto a caixa cresceria
              para os 684 pixels da lista e empurraria o fecho para fora da tela
              — trocaria um corte por outro.

              `sm:flex-initial` devolve o comportamento padrão de 640px para
              cima, onde a lista sempre coube e nada disto precisa existir.

              E `pt-0` até 640px, a pedido do dono. Com os 28 pixels de respiro,
              a linha cinza ficava 28 acima da BORDA DE CORTE da janela: via-se
              o filete, uma faixa preta, e só então a lista começando no meio de
              uma linha de texto — e o que aquilo parece é uma tarja cobrindo a
              conta, não uma lista correndo. Sem o respiro, o filete É a borda de
              corte: o texto sai de baixo dele, que é o que ele sempre quis
              dizer. Os 28 pixels ainda voltam para a janela como altura. */}
          <div
            className={`${RESPIRO} flex min-h-0 flex-1 flex-col border-t border-white/[0.09] pt-0 sm:flex-initial sm:pt-7 md:pt-10`}
          >
            {/* A janela é uma caixa só, sem padding: assim `clientHeight` dela é
                exatamente o espaço que a lista tem para correr, e a medida não
                precisa descontar o `pt-7` do pai. */}
            <div
              ref={setJanelaLadainha}
              className="min-h-0 flex-1 overflow-hidden sm:flex-initial sm:overflow-visible"
            >
              {/* A lista recebe a régua pronta: o painel onde ela mora é
                  `sticky`, e um elemento grudado não se move em relação à janela
                  — um `useScroll` apontado para ele devolveria um progresso
                  travado no mesmo número durante toda a leitura. Por isso o alvo
                  é a seção, e por isso a medida é feita aqui em cima. */}
              <Ladainha
                progresso={contagem}
                janela={janelaLadainha}
              cauda={
                /* ─── A RESPOSTA, dentro da própria fatura ───────────────────
                 *
                 * Terceira posição do valor em três rodadas, e esta é a que o
                 * argumento pedia desde o começo: ele entra DEPOIS do vigésimo
                 * quinto item e ANTES de "E o seu tempo.". Vinte e cinco linhas,
                 * o quanto elas somam, e então a única que não se compra. É a
                 * última linha da nota, no lugar onde uma nota a escreve.
                 *
                 * Fora da lista ele já foi duas coisas erradas: no pé da coluna,
                 * um número solto depois de um ponto final; e antes disso, no
                 * cabeçalho, disputando a linha com a pergunta.
                 *
                 * `data-cauda` não é enfeite de teste: é por ele que a lista
                 * sabe onde os ITENS acabam. Ver a nota no `useLayoutEffect` da
                 * Ladainha.
                 *
                 * Só no telefone. No desktop este nó existe em `display: none` e
                 * a conta continua ao lado do título, que é onde a coluna
                 * inteira cabendo na tela a coloca. */
                <motion.span
                  data-cauda
                  style={parado ? undefined : { opacity: contaOpacity, y: contaY }}
                  className="mt-7 block sm:hidden"
                >
                  <Conta
                    naTela={contaAcesa}
                    className="block whitespace-nowrap font-serif text-[2.2rem] leading-none text-white texto-aceso"
                    unidade="ml-1 text-[1.2rem]"
                  />
                </motion.span>
              }
              />
            </div>
          </div>

          {/* O soco, em texto puro.

              Foi selo por uma rodada, espelhando o da garantia no painel claro,
              e o dono recusou: a caixa cinza no meio do preto lia como aviso de
              sistema, e o escudo cortado como ícone de erro. A frase não precisa
              de moldura — ela é a única coisa em branco cheio depois do título,
              e isso já a torna a segunda voz mais alta da tela. */}

          {/* As duas metades acesas em degraus, como no cartão do outro painel:
              creme fechado na que prepara, branco com brilho na que bate. A
              primeira estava em cinza 40% e lia como rodapé de uma frase que é
              o clímax da coluna. */}
          {/* O soco entra na ÚLTIMA fatia do percurso, depois de os vinte e
              cinco itens e o total já estarem na tela. A ordem é o argumento:
              primeiro a conta fecha, e só então a frase diz que nada daquilo
              garante nada. Chegando antes, ela bate no vazio.

              Sobe dez pixels e não seis como as palavras da lista — ela é a
              frase mais alta da coluna, e um deslocamento igual ao de um item de
              fatura a faria chegar como mais uma linha. */}
          <motion.p
            style={parado ? undefined : { opacity: fechoOpacity, y: fechoY }}
            className={`${RESPIRO} font-serif text-3xl leading-[1.1] tracking-[-0.02em] md:text-[3.6rem]`}
          >
            <span className="text-[#F4F1E8]/60">{SEM_GARANTIA[idioma][0]}</span>{' '}
            <span className="texto-aceso text-white">{SEM_GARANTIA[idioma][1]}</span>
          </motion.p>

        </motion.div>
      </div>

      {/* ── O FÔLEGO DO PAINEL ESCURO, e por que ele DOBROU ─────────────────
       *
       * Sem este vão, o claro começa a subir no primeiro pixel de rolagem — o
       * topo dele já está encostado no fim da tela quando a seção chega — e a
       * ladainha some antes de alguém ler.
       *
       * O número já foi 60% de tela, foi cortado para 37,5% e agora vai a 100%,
       * e as três decisões são a mesma discussão em três momentos: quanto tempo
       * o preto fica parado antes de a carta virar.
       *
       * O corte para 37,5% tinha um argumento que era verdadeiro na época — "o
       * painel escuro já se lê de uma vez, e o que sobra de rolagem parada antes
       * da virada é espera, não leitura". Ele valia porque a ladainha estava
       * inteira escrita quando a seção chegava: parar ali era esperar por nada.
       *
       * O que mudou foi a lista passar a se ESCREVER com a rolagem. O mesmo
       * trecho deixou de ser espera e virou o lugar onde a conta é somada — e o
       * dono pediu dois terços a mais dela. Uma tela cheia é o que dá esse
       * espaço com o soco ainda fechando antes de o papel aparecer.
       *
       * A calibragem antiga continua valendo como aviso para quem for mexer: o
       * painel claro gira em torno do canto inferior esquerdo, e trinta graus
       * baixam a aresta de cima dele em cerca de doze centésimos da altura da
       * tela. O papel aparece um pouco ANTES do que este número sugere. */}
      {/* 130vh no telefone, a pedido do dono: o trecho escuro inteiro — a tela
          grudada mais este fôlego — vai de 200vh para 230vh, que são os quinze
          por cento de rolagem a mais que ele pediu. O que se ganha é dedo, não
          conteúdo: a mesma fatura, a mesma conta e o mesmo fecho, atravessados
          mais devagar.

          Tudo que é medido em FRAÇÃO DA SEÇÃO desacelera junto e de graça — a
          régua da ladainha é uma delas —, e é por isso que o ajuste dela ao
          lado é de um ponto e meio, e não de quinze por cento.

          `sm:h-screen` porque o pedido é do telefone. No layout largo a coluna
          cabe na tela com folga, o dono não reclamou de lá, e uma seção que
          fica meia tela mais longa no desktop "por via das dúvidas" é uma
          mudança de desktop disfarçada de segurança. */}
      <div className="h-[130vh] sm:h-screen" aria-hidden />

      {/* ─── `#forms`: A MARCA DO SALTO, e por que ela é uma caixa VAZIA ──────
       *
       * Este é o destino de toda CTA de conversão do site. Ele é um traço de
       * altura zero encostado no topo do painel claro — e não o `id` do painel —
       * porque o alvo de um salto precisa de uma caixa que o navegador consiga
       * MEDIR na hora do clique.
       *
       * O painel tem `rotate`, e o salto de fragmento (como `scrollIntoView`)
       * calcula o destino a partir do retângulo TRANSFORMADO do alvo, uma vez
       * só, no instante em que é chamado. Nesse instante o painel está sempre
       * girado: todo botão que aponta para cá mora ACIMA dele, e o giro só zera
       * quando o papel já subiu quase até o topo da janela. O retângulo lido é o
       * da caixa torta, a conta sai errada, e a rolagem suave ainda persegue um
       * alvo que se endireita no caminho — a pessoa aterrissa no meio do papel.
       *
       * `transform` não mexe em LAYOUT. Esta caixa é estática, então o topo dela
       * é o topo do painel em repouso — o mesmo número antes, durante e depois
       * do giro. Sem altura, sem margem e sem pintura, ela não desloca nada: o
       * que ela faz é dar ao navegador a coordenada certa.
       *
       * Alinhado por aqui, o painel de `min-h-screen` abre exatamente na borda
       * de cima da janela e ocupa a tela inteira — a manchete, a garantia e o
       * formulário na mesma tela. E o giro já terminou quando ela chega: ele
       * zera com o topo do painel a um quarto da tela, que é ANTES deste ponto.
       *
       * `scroll-mt-0` é declarado de propósito: o dono pediu a seção ocupando
       * 100% da tela, e qualquer recuo herdado aqui viraria uma faixa da seção
       * anterior aparecendo em cima do papel. */}
      <div id={ANCORA_FORMS} aria-hidden className="h-0 scroll-mt-0" />

      {/* ── Painel claro: o convite. Sobe girado, assenta, e para. */}
      <motion.div
        ref={claroRef}
        style={{ rotate: parado ? 0 : giro, background: PAPEL }}
        /* Coluna flex centrada, e é o que substituiu três `min-h` calculados na
           mão. A faixa do título e a grade ocupam o que precisam, e a sobra da
           tela é dividida entre o topo e o pé — em vez de a grade esticar para
           comer tudo e abrir um vão entre a manchete e o argumento. O painel
           continua tendo uma tela de altura sem ninguém subtrair padding e
           altura de manchete de `100vh`.

           Dividida, mas NÃO ao meio: o pé tem 96px de recuo contra 56 do topo,
           e é o que sobe o bloco inteiro uns quarenta pixels. É centragem
           óptica — o olho lê o meio geométrico como baixo, e um bloco centrado
           na régua parece afundado na caixa. A diferença é constante, então a
           correção vale igual em qualquer altura de tela.

           `safe center` e não `center`: numa tela baixa, em que o conteúdo não
           cabe, a centragem comum estoura para os DOIS lados e come o recuo do
           topo — em 1280x800 o selo subia 28px para dentro da margem. Com
           `safe`, a centragem desiste e vira início quando não há espaço, e o
           que sobra transborda só pelo pé, onde há rolagem para resolver. */
        className={`relative z-10 flex min-h-screen origin-bottom-left flex-col px-5 py-10 [justify-content:safe_center] md:px-10 md:pb-24 md:pt-14 ${
          girando ? '[will-change:transform]' : ''
        }`}
      >
        {/* A textura atravessa a virada. Aqui ela é a mesma grade em tinta, e o
            facho é o mesmo facho com o sinal trocado: no preto os pontos
            acendem sob a mão, no papel eles escurecem. É o que impede o painel
            claro de ler como outra página — ele é a mesma página, de manhã.

            Debaixo do clarão do topo, e não por cima: o gradiente branco é o que
            dá volume ao papel, e a grade passando na frente dele viraria uma
            tela de pontos com uma luz atrás. */}
        <div className="dot-grid-tinta pointer-events-none absolute inset-0" />
        <DotGridSpotlight containerRef={claroRef} className="is-tinta" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.85),transparent_70%)]" />

        {/* Duas colunas: o argumento à esquerda, o pedido à direita. A copy
            responde ponto a ponto o painel escuro — lá a conta não tinha
            garantia nenhuma, aqui a garantia é a maior coisa da tela — e o
            formulário fica do lado em que o olho termina de ler.

            O pedido é um cartão PRETO sobre o papel, e é o que fecha o arco da
            página: ela é preta, o creme é a exceção que responde, e a marca
            volta a ser preta no instante do compromisso. Ler à esquerda e
            decidir à direita passa a ser também uma travessia de claro para
            escuro — que é a mesma virada da seção, feita em quarenta
            centímetros de tela em vez de em uma rolagem inteira. */}
        {/* A coluna do pedido vale 40% da tela e é medida em POR CENTO, não em
            `1fr` nem num `max-w`: o cartão é o único elemento clicável da página
            e tem de crescer junto com o monitor, em vez de congelar numa largura
            e deixar o papel em volta engordar sozinho. O piso de 30rem é o que
            impede a coluna de espremer o formulário quando a janela é estreita e
            as colunas ainda estão lado a lado. */}
        {/* ── A FAIXA: o selo e a manchete, na largura inteira do papel.

            A manchete morava na coluna do argumento e era ali que a seção
            apertava. Uma frase desse porte numa coluna de 703px só cabe
            quebrada, e quebrada ela ocupa a largura toda nas duas linhas — o
            texto encosta nas duas bordas, não sobra respiro, e a coisa mais
            importante da tela passa a ler como parágrafo. Em cima, numa linha
            só, ela vira o que é: o título da seção. E a coluna que ela deixou
            é justamente o ar que faltava embaixo.

            Hierarquia por TAMANHO, de cima para baixo e sem empate: manchete
            (~75px) · garantia (43px) · a troca (38px) · o cartão do falta
            (32px) · a prova (15px). Cada degrau é grande o bastante para o olho
            saber, sem ler, o que vem primeiro. */}
        <div className="relative mx-auto w-full max-w-screen-2xl">
          <Selo prefixo="Com" escuro />

          {/* ── O CORPO DO TÍTULO É UMA CONTA, e ela está aqui.

              Medida na página de verdade, a frase inteira ocupa 15 vezes o
              corpo. Em 1370px de papel útil isso dá 91px de corpo máximo —
              dentro da coluna de 703px daria 47px. Não é preferência: manchete
              em uma linha e coluna estreita são incompatíveis, e quem cede é a
              coluna.

              O `clamp` é 92% do máximo que cabe: `(100vw - 80px de padding) /
              15 × 0,92`. A folga é margem contra a diferença de rasterização de
              cada máquina, e é também o respiro óptico da direita — uma
              manchete que encosta exatamente nas duas margens lê como texto
              justificado, não como título. O teto de 5,8rem é onde o
              `max-w-screen-2xl` para de crescer, e abaixo de `lg` nada disso
              vale: ali a frase quebra em duas, como sempre quebrou.

              Em `lg:` e não numa classe própria no CSS, e isso é specificity:
              as utilities do Tailwind saem DEPOIS do CSS escrito à mão, e entre
              dois seletores de uma classe só quem vem por último ganha. Uma
              `.titulo-convite` em `min-width: 1024px` perderia para o
              `md:text-[4.4rem]` deste elemento e a manchete estouraria a faixa
              a 1024px. Em `lg:`, é o próprio Tailwind que garante a ordem.

              `nowrap` é o cinto de segurança: se a copy crescer e a conta não
              for refeita, é melhor a frase vazar e ser vista na hora do que
              quebrar sozinha e deixar "viraliza." pendurada — quebra sozinha
              parece de propósito. */}
          <h2 className={`mt-8 font-serif ${MANCHETE} leading-[0.95] tracking-[-0.03em] text-[#0B0B0B] md:text-[4.4rem] lg:whitespace-nowrap lg:text-[clamp(2.8rem,calc(6.13vw_-_4.9px),5.8rem)]`}>
            {CONVITE[idioma][0]}
            {/* A quebra só existe onde a frase não cabe numa linha. No
                desktop ela sai, e o espaço que a substitui tem de ser
                explícito — o JSX come o espaço em branco entre linhas.

                E ela sai no TELEFONE também, a pedido do dono. Ali as duas
                frases já quebram sozinhas, então a quebra forçada não estava
                separando linha de linha: estava separando dois BLOCOS de duas
                linhas cada, com o segundo começando numa linha nova só pela
                metade. Sem ela, as duas correm como a frase única que são — de
                quatro linhas para três, e a virada de uma para a outra acontece
                no meio de uma linha, que é onde uma vírgula de sentido cai
                quando ninguém força nada. */}
            <br className="hidden sm:inline lg:hidden" />{' '}
            <span className="texto-aceso-tinta">{CONVITE[idioma][1]}</span>
          </h2>
        </div>

        {/* `items-start` e não `items-center`, e é o que põe as duas colunas
            começando na MESMA linha: a garantia e a borda de cima do cartão do
            pedido. Centradas, cada uma flutuava no meio da própria faixa e a
            altura em que cada bloco caía era um acidente da altura do vizinho.

            E a grade não estica mais (`flex-1` saiu): esticada, ela empurrava o
            argumento para o meio da tela e abria um vão de 143px entre a
            manchete e a primeira frase. Agora são 48px, e a sobra da tela vai
            para as pontas, dividida pelo `justify-center` do painel. */}
        <div
          ref={setGrade}
          className="relative mx-auto mt-10 grid w-full max-w-screen-2xl grid-cols-1 gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-[1fr_minmax(32rem,44%)] lg:items-start"
        >
          {/* O fio primeiro no DOM, e as duas colunas `relative` depois dele.
              Ordem de pintura em CSS não é ordem de irmãos: um elemento
              POSICIONADO pinta por cima de qualquer irmão estático, mesmo o que
              vem antes dele no documento. Sem o `relative` nas colunas, o fio
              passaria por cima do texto que o originou. Posicionadas, as três
              caixas voltam a se resolver pela ordem do documento — o fio embaixo,
              o argumento e o cartão em cima.

              E ele deixou de ser só do desktop, a pedido do dono: empilhado,
              as duas pontas ficam uma embaixo da outra, e o `FioConvite` agora
              tem a geometria vertical para esse caso — desce do pé da frase ao
              topo do cartão em vez de tentar sair pela direita e voltar. Quem
              escolhe qual das duas curvas usar é a POSIÇÃO medida das pontas, e
              não a largura da janela: o `grid` já decidiu se empilhou, e um
              segundo teste discordaria dele na largura exata da virada. */}
          <FioConvite container={grade} de={falta} para={cartao} />

          <div className="relative flex flex-col">
            {/* A garantia saiu do selo lateral e virou a maior coisa depois do
                convite: ela é a resposta direta ao "nenhuma garantia de
                viralizar" que fecha o painel escuro. Como resposta, ela precisa
                do mesmo porte da pergunta. Com a manchete promovida à faixa,
                ela abre a coluna — e é a segunda voz da seção, não a terceira. */}
            <p className="font-serif text-[1.9rem] leading-[1.08] tracking-[-0.02em] text-[#0B0B0B] md:text-[2.7rem]">
              {GARANTIA[idioma][0]}
              <br />
              {/* A segunda linha era a apagada do par, e é ela que carrega a
                  garantia — o número impressiona, "ou seu dinheiro de volta" é
                  o que faz alguém acreditar nele. Em tinta cheia e com o brilho
                  em preto, ela passa a ser a linha mais pesada da coluna. */}
              <span className="texto-aceso-tinta text-[#0B0B0B]">{GARANTIA[idioma][1]}</span>
            </p>

            {/* ── A troca, e ela é o argumento do painel escuro sendo cancelado.
                Em cima, a conta que a seção acabou de somar — os MESMOS números
                do outro painel, lidos do mesmo lugar, porque num comparativo
                dois valores para o mesmo custo é o fim da credibilidade. O
                traço passa por cima quando o painel chega. Embaixo, o que entra
                no lugar: não um preço, o esforço. */}
            {/* O ritmo abriu junto com o espaço. Os blocos desta coluna ficavam
                a 32px um do outro porque não havia mais para dar — com a
                manchete fora, o vão vira 48 e cada bloco passa a ser lido como
                uma unidade, e não como o parágrafo seguinte. Ar entre coisas é
                o que diz que elas são coisas diferentes. */}
            <div className="mt-8 lg:mt-12">
              {/* ── O MESMO RISCO EM DUAS MONTAGENS.

                  Até 640px a frase vira dois pedaços empilhados, cada um com o
                  seu risco: o valor numa linha, o que se paga por ele na outra.
                  Os dois cabem inteiros nos 280 pixels úteis de um telefone de
                  320 — 166 e 230 —, então nenhum risco volta a cair num vão.

                  De 640 para cima é uma linha só e um risco só, exatamente como
                  era: ali a frase cabe, e dois riscos vizinhos deixariam uma
                  falha visível no espaço entre eles.

                  O segundo pedaço entra 0,25s depois do primeiro. Não é enfeite:
                  são dois traços da MESMA caneta, e traços simultâneos leriam
                  como duas riscas de duas mãos. */}
              <span className="block font-serif text-[1.5rem] leading-tight text-black/35 sm:hidden">
                <Riscado
                  className="inline-block"
                  ativo={conviteNaTela}
                  parado={parado}
                  atraso={0.35}
                >
                  R$ {CUSTO_DE.toLocaleString(CONTA_IDIOMA[idioma].locale)}{' '}
                  {CONTA_IDIOMA[idioma].intervalo}{' '}
                  {CUSTO_ATE.toLocaleString(CONTA_IDIOMA[idioma].locale)}
                  {CUSTO_UNIDADE[idioma]}
                </Riscado>
                <br />
                <Riscado
                  className="mt-1 inline-block"
                  ativo={conviteNaTela}
                  parado={parado}
                  atraso={0.6}
                >
                  {CONTA_IDIOMA[idioma].em} {TROCA_ANTES[idioma]}
                </Riscado>
              </span>

              <Riscado
                className="hidden font-serif text-[1.5rem] leading-tight text-black/35 sm:inline-block md:text-[1.9rem]"
                ativo={conviteNaTela}
                parado={parado}
                atraso={0.35}
              >
                R$ {CUSTO_DE.toLocaleString(CONTA_IDIOMA[idioma].locale)}{' '}
                {CONTA_IDIOMA[idioma].intervalo}{' '}
                {CUSTO_ATE.toLocaleString(CONTA_IDIOMA[idioma].locale)}
                {CUSTO_UNIDADE[idioma]} {CONTA_IDIOMA[idioma].em} {TROCA_ANTES[idioma]}
              </Riscado>

              <p className="mt-2 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#0B0B0B] md:text-[2.4rem]">
                {TROCA_DEPOIS[idioma]}
              </p>
            </div>

            {/* ── A ponta do fio, e ela é um cartão preto como o do outro lado.
                Dois objetos escuros no papel, ligados por um fio com sinal
                correndo dentro: é o desenho do hero — duas entradas e uma saída
                — dito de novo no fim da página, com a pessoa no lugar da
                entrada que falta. Ninguém precisa reparar nisso para funcionar;
                é a página rimando consigo mesma.

                `w-fit`: o cartão tem a largura da frase. Esticado na coluna, o
                fio sairia de uma borda a meio metro do texto e a ligação
                deixaria de ser entre as duas COISAS. */}
            {/* O halo branco é o mesmo do painel que tem a vez em "Como
                funciona": a sombra preta assenta o cartão no papel, a branca o
                acende. Duas sombras, dois trabalhos. */}
            {/* `relative`, e é o que faz o contorno vivo caber aqui dentro: o
                SVG é desenhado em `inset-0` desta caixa. */}
            <div
              ref={setFalta}
              className="relative mt-8 w-fit rounded-2xl border border-white/[0.14] bg-doxa-surface px-7 py-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.5),0_0_70px_-25px_rgba(255,255,255,0.35)] lg:mt-12"
            >
              {/* ── ONDE O SINAL NASCE.

                  O percurso inteiro começa neste cartão, a pedido do dono: a
                  borda branca acende aqui, se abre em dois, os ramos correm o
                  contorno separados, se reencontram na borda direita — que é o
                  ponto exato de onde o fio sai — e daí a energia atravessa o
                  papel em tinta até o cartão do pedido, onde a mesma coisa
                  acontece de novo. É o argumento virando pedido, desenhado.

                  `moldura` desligada: este cartão já tem uma borda branca de
                  verdade, e um segundo fio a um pixel e meio dela não lê como
                  contorno mais forte, lê como contorno mal desenhado. Raio 16
                  porque a caixa é `rounded-2xl`, e não `rounded-3xl` como a do
                  pedido — o arco tem de ser concêntrico com o canto que ele
                  acompanha, senão sobra uma fresta em cada esquina. */}
              <BordaViva alvo={falta} trecho="falta" raio={16} moldura={false} />

              {/* A frase inteira acesa, em dois degraus. Nenhuma das metades é
                  apagada — apagada, a primeira dizia que o que falta é pouca
                  coisa —, mas elas não brilham igual: creme com brilho fraco na
                  que pergunta, branco cheio com brilho forte na resposta. Duas
                  coisas brilhando no mesmo passo não são duas ênfases.

                  `relative` para ficar ACIMA do contorno: um irmão posicionado
                  pinta por cima de um estático, e sem isto a auréola do sinal
                  passaria na frente da frase a cada volta. */}
              <p className="texto-aceso-fraco relative font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-[#F4F1E8] md:text-[2rem]">
                {FALTA[idioma][0]}{' '}
                <span className="texto-aceso text-white">{FALTA[idioma][1]}</span>
              </p>
            </div>

            <div className="mt-10 lg:mt-14">
              <ProvaRotativa />
            </div>
          </div>

          {/* O botão de pausa saiu daqui, a pedido do dono, e a fiação dele foi
              junto: um `pausado` que nunca vira `true` é pior do que nenhum —
              três componentes carregando uma prop morta e um estado que ninguém
              escreve. Se a pausa voltar um dia, ela volta inteira. Quem pede
              menos movimento continua atendido por `prefers-reduced-motion`,
              que desliga o sinal na raiz, no CSS. */}
          {/* O `id="pedido"` que morava nesta coluna SAIU, e ele era um id
              DUPLICADO: o cartão do formulário declara o mesmo, e num documento
              com dois iguais só o primeiro existe para
              `getElementById`/`#hash`. Quem ganhava era esta coluna, e a medida
              do FAQ — que pede o pé do CARTÃO — vinha da caixa errada por
              acidente (mesmo valor hoje, porque a coluna só contém o cartão;
              errado no dia em que ela contiver outra coisa).

              O destino dos botões é `#forms`, o painel inteiro, marcado lá em
              cima. O `scroll-mt-24` foi junto: ninguém mais salta para aqui. */}
          <div className="relative flex flex-col lg:items-end">
            <Formulario aoPrenderCartao={setCartao} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
