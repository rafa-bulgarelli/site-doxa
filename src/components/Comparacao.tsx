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
import { FioConvite } from './comparacao/FioConvite';
import { Formulario } from './comparacao/Formulario';
import { Ladainha } from './comparacao/Ladainha';
import { ProvaRotativa } from './comparacao/ProvaRotativa';
import { useIsDesktop } from '../hooks/useIsDesktop';
import {
  CONVITE,
  CUSTO_ATE,
  CUSTO_DE,
  CUSTO_UNIDADE,
  FALTA,
  FATURA,
  ENVIO,
  GARANTIA,
  PERGUNTA,
  RETORNO,
  SEM_GARANTIA,
  TOTAL_ITENS,
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

/** O logo no lugar da palavra: "Sem [DOXA]" e "Com [DOXA]". */
function Selo({ prefixo, escuro = false }: { prefixo: string; escuro?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      {/* Caixa normal, a pedido do dono: em versalete o prefixo competia com o
          logo ao lado, e os dois juntos liam como duas marcas. */}
      <span className={`text-[13px] tracking-tight ${escuro ? 'text-black/50' : 'text-white/50'}`}>
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
  const giro = useTransform(scrollYProgress, [0, 1], [GIRO, 0]);

  return (
    // `overflow-x-clip` e não `overflow-hidden`: `hidden` cria um contexto de
    // rolagem e o `sticky` do painel escuro para de grudar. `clip` corta o canto
    // que o painel girado joga para fora sem criar contexto nenhum.
    <section className="relative overflow-x-clip bg-doxa-bg">
      {/* ── Painel escuro: a pergunta e a conta. */}
      <div
        ref={escuroRef}
        className="sticky top-0 flex h-screen flex-col px-5 pb-10 pt-16 md:px-10 md:pb-14 md:pt-24"
      >
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <DotGridSpotlight containerRef={escuroRef} />

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
          {/* O cabeçalho da fatura. Devolve a contagem sem precisar de um bloco
              só para ela, e é o que faz o bloco abaixo ler como documento em vez
              de como um texto grande. */}
          <div
            className={`${RESPIRO} flex items-baseline justify-between gap-6 border-t border-white/[0.09] pt-7 md:pt-10`}
          >
            <span className="text-[12px] tracking-[0.06em] text-white/35">{FATURA}</span>
            <span className="text-[11px] tabular-nums tracking-[0.14em] text-white/35">
              {TOTAL_ITENS} itens
            </span>
          </div>

          <div className={RESPIRO}>
            <Ladainha />
          </div>

          {/* O soco, em texto puro.

              Foi selo por uma rodada, espelhando o da garantia no painel claro,
              e o dono recusou: a caixa cinza no meio do preto lia como aviso de
              sistema, e o escudo cortado como ícone de erro. A frase não precisa
              de moldura — ela é a única coisa em branco cheio depois do título,
              e isso já a torna a segunda voz mais alta da tela. */}
          <p className={`${RESPIRO} font-serif text-3xl leading-[1.1] tracking-[-0.02em] text-white md:text-[3.6rem]`}>
            <span className="text-white/40">{SEM_GARANTIA[0]}</span>{' '}
            {SEM_GARANTIA[1]}
          </p>
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
        className="relative z-10 min-h-screen origin-bottom-left px-5 py-10 md:px-10 md:py-14"
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
        <div
          ref={gradeRef}
          className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-screen-2xl grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[1fr_minmax(32rem,44%)] lg:items-center md:min-h-[calc(100vh-7rem)]"
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
            <Selo prefixo="Com" escuro />

            <h2 className="mt-7 font-serif text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-[#0B0B0B] md:text-[4.4rem]">
              {CONVITE}
            </h2>

            {/* A garantia saiu do selo lateral e virou a maior coisa depois do
                convite: ela é a resposta direta ao "nenhuma garantia de
                viralizar" que fecha o painel escuro. Como resposta, ela precisa
                do mesmo porte da pergunta. */}
            <p className="mt-7 font-serif text-[1.9rem] leading-[1.08] tracking-[-0.02em] text-[#0B0B0B] md:text-[2.7rem]">
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
            <div className="mt-8">
              <span className="relative inline-block font-serif text-[1.5rem] leading-tight text-black/35 md:text-[1.9rem]">
                R$ {CUSTO_DE.toLocaleString('pt-BR')} a {CUSTO_ATE.toLocaleString('pt-BR')}
                {CUSTO_UNIDADE}, {TOTAL_ITENS} contratações
                {/* Dois pixels, e não um `line-through`: o risco é um gesto e
                    precisa ser desenhado da esquerda para a direita. Decoração
                    de texto não anima. */}
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-black/45"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: parado || conviteNaTela ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                />
              </span>

              <p className="mt-2 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#0B0B0B] md:text-[2.4rem]">
                {TROCA_DEPOIS}
              </p>
            </div>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-black/55 md:text-base">
              {ENVIO} {RETORNO}
            </p>

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
            <div
              ref={faltaRef}
              className="mt-8 w-fit rounded-2xl border border-white/[0.14] bg-doxa-surface px-7 py-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.5),0_0_70px_-25px_rgba(255,255,255,0.35)]"
            >
              {/* A frase inteira acesa, em dois degraus. Nenhuma das metades é
                  apagada — apagada, a primeira dizia que o que falta é pouca
                  coisa —, mas elas não brilham igual: creme com brilho fraco na
                  que pergunta, branco cheio com brilho forte na resposta. Duas
                  coisas brilhando no mesmo passo não são duas ênfases. */}
              <p className="texto-aceso-fraco font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-[#F4F1E8] md:text-[2rem]">
                {FALTA[0]}{' '}
                <span className="texto-aceso text-white">{FALTA[1]}</span>
              </p>
            </div>

            <div className="mt-10">
              <ProvaRotativa />
            </div>
          </div>

          <div className="relative flex lg:justify-end">
            <Formulario cartaoRef={cartaoRef} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
