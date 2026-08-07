import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import wordmarkUrl from '../../brand/doxa-wordmark-white.png';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
import { BordaViva } from './comparacao/BordaViva';
import { FioConvite } from './comparacao/FioConvite';
import { Formulario } from './comparacao/Formulario';
import { FATIA_FECHO, Ladainha, useContagem } from './comparacao/Ladainha';
import { ProvaRotativa } from './comparacao/ProvaRotativa';
import { useIsDesktop } from '../hooks/useIsDesktop';
import {
  CONVITE,
  CUSTO_ATE,
  CUSTO_DE,
  CUSTO_UNIDADE,
  FALTA,
  FATURA,
  GARANTIA,
  NO_AR,
  PARADO,
  PERGUNTA,
  SEM_GARANTIA,
  TROCA_ANTES,
  TROCA_DEPOIS,
} from './comparacao/config';

/** A cor do papel — a única superfície clara da página. */
const PAPEL = '#F4F1E8';

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
      className="inline-flex w-fit items-center gap-2.5 rounded-full border py-2 pl-3 pr-4"
      style={{ borderColor: `${cor}59`, background: `${cor}14` }}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
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
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: cor, boxShadow: `0 0 10px ${cor}, 0 0 3px ${cor}` }}
        />
      </span>

      {/* Caixa normal, a pedido do dono: em versalete o prefixo competia com o
          logo ao lado, e os dois juntos liam como duas marcas. */}
      <span className={`text-[13px] tracking-tight ${escuro ? 'text-black/60' : 'text-white/60'}`}>
        {prefixo}
      </span>
      {/* A arte é branca sobre transparente — no painel creme ela vira tinta com
          um `invert`, que é exato para um PNG de um só tom. Card 002 quer isto
          vetorizado; enquanto for bitmap, é assim que se consegue as duas cores
          a partir de um arquivo. */}
      <img
        src={wordmarkUrl}
        alt="Doxa"
        className={`h-[15px] w-auto ${escuro ? 'invert' : ''}`}
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
function Contador({ ate, naTela }: { ate: number; naTela: boolean }) {
  const parado = useReducedMotion() === true;
  // Zero, sempre — exceto para quem pediu menos movimento. A versão anterior
  // testava `!naTela` aqui, e `naTela` é falso no primeiro render por
  // construção: o valor nascia já no total e a contagem nunca acontecia.
  const bruto = useMotionValue(parado ? ate : 0);
  const texto = useTransform(bruto, (v) => Math.round(v).toLocaleString('pt-BR'));

  useEffect(() => {
    if (!naTela || parado) return;
    const controle = animate(bruto, ate, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controle.stop();
  }, [naTela, parado, ate, bruto]);

  return <motion.span className="tabular-nums">{texto}</motion.span>;
}

export function Comparacao() {
  const escuroRef = useRef<HTMLDivElement>(null);
  const claroRef = useRef<HTMLDivElement>(null);
  /** As três peças do fio: a caixa em que ele mora e as duas pontas. */
  const gradeRef = useRef<HTMLDivElement>(null);
  const faltaRef = useRef<HTMLDivElement>(null);
  const cartaoRef = useRef<HTMLDivElement>(null);
  const parado = useReducedMotion() === true;
  const isDesktop = useIsDesktop();
  const contaNaTela = useInView(escuroRef, { amount: 0.4, once: true });
  /**
   * Quando o painel claro chega — o que dispara o risco sobre o custo antigo.
   *
   * Riscar é um GESTO, e um gesto que já aconteceu não é um gesto: com o traço
   * pronto, o par vira só duas linhas de texto, uma delas cortada. Feito na
   * frente de quem lê, é alguém cancelando a conta.
   */
  const conviteNaTela = useInView(claroRef, { amount: 0.25, once: true });

  // Os mesmos limites da referência: começa a girar quando o topo do painel
  // encosta no fim da tela e termina quando esse topo chega a um quarto dela.
  const { scrollYProgress } = useScroll({
    target: claroRef,
    offset: ['start end', 'start 25%'],
  });

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
  const fechoOpacity = useTransform(contagem, [FATIA_FECHO, 1], [0, 1]);
  const fechoY = useTransform(contagem, [FATIA_FECHO, 1], [10, 0]);
  const giro = useTransform(scrollYProgress, [0, 1], [GIRO, 0]);

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

        <div className="relative mx-auto flex h-full w-full max-w-screen-2xl flex-col">
          <Selo prefixo="Sem" />

          {/* A pergunta à esquerda, a CONTA à direita — foi para cá que o número
              subiu, e não é arrumação: no rodapé ele ficava embaixo do painel
              claro, que entra girado e cobre o terço de baixo da tela. O valor é
              o clímax da coluna e não podia estar na parte que some. */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <h2 className="font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-white md:text-6xl">
              {PERGUNTA[0]}
              <br />
              {PERGUNTA[1]}
            </h2>

            {/* A pílula da recorrência saiu a pedido do dono, e o valor cresceu
                para ocupar o peso que ela dividia. O `/mês` sozinho já diz que
                é recorrente, e um número desacompanhado bate mais forte do que
                um número com uma legenda ao lado pedindo atenção. */}
            <span className="font-serif text-[2.6rem] leading-none text-white md:text-[4.6rem]">
              R$ <Contador ate={CUSTO_DE} naTela={contaNaTela} /> a{' '}
              <Contador ate={CUSTO_ATE} naTela={contaNaTela} />
              {/* O `/mês` em destaque, a pedido do dono, e o argumento é dele:
                  no fim do dia o que dói não é o valor, é a recorrência dele.
                  Um custo alto se engole uma vez; um custo alto TODO MÊS, sem
                  resultado garantido, é o que faz a pergunta do título doer. */}
              <span className="ml-1 align-baseline text-3xl text-white/75 md:text-[3.2rem]">
                {CUSTO_UNIDADE}
              </span>
            </span>
          </div>

          {/* A ladainha desceu de corpo e a frase abaixo dela subiu, e essa
              troca é a hierarquia inteira. Antes, pergunta, conta e lista tinham
              o mesmo peso e o olho não sabia onde pousar — foi o que o dono leu
              como "sem destaque". A lista é PROVA, não manchete: em corpo médio
              e apagada, ela sustenta o argumento sem disputar com ele.

              O resto da tela fica vazio de propósito: o painel claro entra
              girado por baixo e come o terço inferior. */}
          {/* O cabeçalho da fatura, e é o que faz o bloco abaixo ler como
              documento em vez de como um texto grande.

              O "25 itens" que ficava na ponta direita saiu, por ordem do dono, e
              a contagem não faz falta: ela era um TOTAL antecipado, e agora que
              a lista se escreve conforme a pessoa rola, dizer de antemão quantas
              linhas vêm é entregar o fim do argumento no começo dele. Quem quer
              o número conta as linhas — e contá-las é exatamente o efeito que a
              seção quer. */}
          <div
            className={`${RESPIRO} flex items-baseline justify-between gap-6 border-t border-white/[0.09] pt-7 md:pt-10`}
          >
            <span className="text-[12px] tracking-[0.06em] text-white/35">{FATURA}</span>
          </div>

          <div className={RESPIRO}>
            {/* A lista recebe a régua pronta: o painel onde ela mora é `sticky`,
                e um elemento grudado não se move em relação à janela — um
                `useScroll` apontado para ele devolveria um progresso travado no
                mesmo número durante toda a leitura. Por isso o alvo é a seção, e
                por isso a medida é feita aqui em cima. */}
            <Ladainha progresso={contagem} />
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
            <span className="text-[#F4F1E8]/60">{SEM_GARANTIA[0]}</span>{' '}
            <span className="texto-aceso text-white">{SEM_GARANTIA[1]}</span>
          </motion.p>
        </div>
      </div>

      {/* Fôlego para o painel escuro. Sem isto, o claro começa a subir no
          primeiro pixel de rolagem — o topo dele já está encostado no fim da
          tela quando a seção chega — e a ladainha some antes de alguém ler. São
          quase meia tela em que o preto fica parado e legível, e só depois a
          carta começa a virar.

          Era sessenta centésimos e o dono cortou vinte por cento: o painel
          escuro já se lê de uma vez, e o que sobrava de rolagem parada antes da
          virada era espera, não leitura.

          O valor é calibrado pelo que se VÊ, não pelo que ele mede. O painel
          claro gira em torno do canto inferior esquerdo, e trinta graus baixam a
          aresta de cima dele em cerca de doze centésimos da altura da tela — um
          deslocamento que se soma a este vão e adianta a primeira aparição.
          37,5vh menos esse desconto dão os 450 pixels que o dono pediu numa
          tela de 940, e ficam proporcionais em qualquer outra altura. */}
      <div className="h-[37.5vh]" aria-hidden />

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
        className="relative z-10 flex min-h-screen origin-bottom-left flex-col px-5 py-10 [justify-content:safe_center] md:px-10 md:pb-24 md:pt-14"
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
          <h2 className="mt-8 font-serif text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-[#0B0B0B] md:text-[4.4rem] lg:whitespace-nowrap lg:text-[clamp(2.8rem,calc(6.13vw_-_4.9px),5.8rem)]">
            {CONVITE[0]}
            {/* A quebra só existe onde a frase não cabe numa linha. No
                desktop ela sai, e o espaço que a substitui tem de ser
                explícito — o JSX come o espaço em branco entre linhas. */}
            <br className="lg:hidden" />{' '}
            <span className="texto-aceso-tinta">{CONVITE[1]}</span>
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
          ref={gradeRef}
          className="relative mx-auto mt-10 grid w-full max-w-screen-2xl grid-cols-1 gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-[1fr_minmax(32rem,44%)] lg:items-start"
        >
          {/* O fio primeiro no DOM, e as duas colunas `relative` depois dele.
              Ordem de pintura em CSS não é ordem de irmãos: um elemento
              POSICIONADO pinta por cima de qualquer irmão estático, mesmo o que
              vem antes dele no documento. Sem o `relative` nas colunas, o fio
              passaria por cima do texto que o originou. Posicionadas, as três
              caixas voltam a se resolver pela ordem do documento — o fio embaixo,
              o argumento e o cartão em cima.

              Desktop apenas: empilhado, as duas pontas ficam uma embaixo da
              outra e o fio seria um laço em volta do próprio argumento. */}
          {isDesktop && (
            <FioConvite containerRef={gradeRef} deRef={faltaRef} paraRef={cartaoRef} />
          )}

          <div className="relative flex flex-col">
            {/* A garantia saiu do selo lateral e virou a maior coisa depois do
                convite: ela é a resposta direta ao "nenhuma garantia de
                viralizar" que fecha o painel escuro. Como resposta, ela precisa
                do mesmo porte da pergunta. Com a manchete promovida à faixa,
                ela abre a coluna — e é a segunda voz da seção, não a terceira. */}
            <p className="font-serif text-[1.9rem] leading-[1.08] tracking-[-0.02em] text-[#0B0B0B] md:text-[2.7rem]">
              {GARANTIA[0]}
              <br />
              {/* A segunda linha era a apagada do par, e é ela que carrega a
                  garantia — o número impressiona, "ou seu dinheiro de volta" é
                  o que faz alguém acreditar nele. Em tinta cheia e com o brilho
                  em preto, ela passa a ser a linha mais pesada da coluna. */}
              <span className="texto-aceso-tinta text-[#0B0B0B]">{GARANTIA[1]}</span>
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
              <span className="relative inline-block font-serif text-[1.5rem] leading-tight text-black/35 md:text-[1.9rem]">
                R$ {CUSTO_DE.toLocaleString('pt-BR')} a {CUSTO_ATE.toLocaleString('pt-BR')}
                {CUSTO_UNIDADE} em {TROCA_ANTES}
                {/* Dois pixels, e não um `line-through`: o risco é um gesto e
                    precisa ser desenhado da esquerda para a direita. Decoração
                    de texto não anima. */}
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 origin-left bg-black/45"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: parado || conviteNaTela ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                />
              </span>

              <p className="mt-2 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#0B0B0B] md:text-[2.4rem]">
                {TROCA_DEPOIS}
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
              ref={faltaRef}
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
              <BordaViva alvoRef={faltaRef} trecho="falta" raio={16} moldura={false} />

              {/* A frase inteira acesa, em dois degraus. Nenhuma das metades é
                  apagada — apagada, a primeira dizia que o que falta é pouca
                  coisa —, mas elas não brilham igual: creme com brilho fraco na
                  que pergunta, branco cheio com brilho forte na resposta. Duas
                  coisas brilhando no mesmo passo não são duas ênfases.

                  `relative` para ficar ACIMA do contorno: um irmão posicionado
                  pinta por cima de um estático, e sem isto a auréola do sinal
                  passaria na frente da frase a cada volta. */}
              <p className="texto-aceso-fraco relative font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-[#F4F1E8] md:text-[2rem]">
                {FALTA[0]}{' '}
                <span className="texto-aceso text-white">{FALTA[1]}</span>
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
          {/* `id="pedido"` mora AQUI, no formulário, e não na seção inteira.

              Ele estava faltando: o "Falar com o consultor" do FAQ e agora o
              fecho do rodapé apontam os dois para `#pedido`, e nenhum elemento
              da página tinha esse id — os dois botões não levavam a lugar
              nenhum. Na seção, o salto pararia no topo dela e a pessoa ainda
              teria de procurar o formulário no meio de uma tabela de custos;
              no formulário, ela cai no campo que veio preencher. */}
          <div id="pedido" className="relative flex flex-col scroll-mt-24 lg:items-end">
            <Formulario cartaoRef={cartaoRef} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
