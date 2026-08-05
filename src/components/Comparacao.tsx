import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import wordmarkUrl from '../../brand/doxa-wordmark-white.png';
import { MotionButton } from './ui/MotionButton';
import { DotGridSpotlight } from './hero/DotGridSpotlight';
import { Ladainha } from './comparacao/Ladainha';
import {
  CONVITE,
  CUSTO,
  CUSTO_DO_CLIQUE,
  CUSTO_UNIDADE,
  ENVIO,
  GARANTIA,
  PERGUNTA,
  SEM_GARANTIA,
} from './comparacao/config';

/** A cor do papel — a única superfície clara da página. */
const PAPEL = '#F4F1E8';

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
export function Comparacao() {
  const escuroRef = useRef<HTMLDivElement>(null);
  const claroRef = useRef<HTMLDivElement>(null);
  const parado = useReducedMotion() === true;

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
        className="sticky top-0 flex h-screen flex-col px-5 py-10 md:px-10 md:py-14"
      >
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        {/* O mesmo holofote do hero e da parede de prova. Escolhido no lugar de
            um efeito novo de fundo: a interação desta seção JÁ é o ponteiro, e
            uma chuva de meteoros disputaria com a lâmina em vez de ajudá-la.
            Este acende a grade sob a mesma mão que carrega o cartão — reforça o
            gesto em vez de competir com ele, e é vocabulário que a página já
            usa duas vezes. */}
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
              {CUSTO}
              <span className="ml-1 align-baseline text-2xl text-white/40 md:text-4xl">
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
          <div className="mt-8 border-t border-white/[0.09] pt-8">
            <Ladainha />
          </div>

          {/* O soco. É a frase mais importante desta coluna e por isso é a
              maior coisa abaixo do título: vinte e cinco contratações e um custo
              recorrente ainda deixam a pessoa sem o que ela queria. É também a
              dobradiça — a garantia do painel claro responde exatamente a esta
              falta, e sem ela seria só mais uma vantagem numa lista. */}
          <p className="mt-9 font-serif text-3xl leading-[1.08] tracking-[-0.02em] text-white md:mt-10 md:text-[3.2rem]">
            <span className="text-white/40">{SEM_GARANTIA[0]}</span>
            <br />
            {SEM_GARANTIA[1]}
          </p>
        </div>
      </div>

      {/* Fôlego para o painel escuro. Sem isto, o claro começa a subir no
          primeiro pixel de rolagem — o topo dele já está encostado no fim da
          tela quando a seção chega — e a ladainha some antes de alguém ler. São
          seis décimos de tela em que o preto fica parado e legível, e só depois
          a carta começa a virar. */}
      <div className="h-[60vh]" aria-hidden />

      {/* ── Painel claro: o convite. Sobe girado, assenta, e para. */}
      <motion.div
        ref={claroRef}
        style={{ rotate: parado ? 0 : giro, background: PAPEL }}
        className="relative z-10 min-h-screen origin-bottom-left px-5 py-10 md:px-10 md:py-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.85),transparent_70%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-screen-2xl flex-col md:min-h-[calc(100vh-7rem)]">
          <Selo prefixo="Com" escuro />

          <div className="my-auto max-w-4xl py-10">
            <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#0B0B0B] md:text-[5.5rem]">
              {CONVITE}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-snug text-black/60 md:text-2xl">{ENVIO}</p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-t border-black/10 pt-8">
            {/* A garantia como selo, e não como manchete: em corpo de título ela
                disputa com o convite, e o painel fica com duas vozes. Numa caixa,
                com o escudo do lado, ela vira o que é — a letra que tira o risco
                de quem vai clicar. */}
            <div className="flex max-w-xl items-start gap-4 rounded-2xl border border-black/10 bg-black/[0.04] p-5 md:p-6">
              <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-[#0B0B0B]" strokeWidth={1.5} />
              <p className="font-serif text-2xl leading-[1.12] tracking-[-0.02em] text-[#0B0B0B] md:text-[2rem]">
                {GARANTIA[0]}
                <br />
                <span className="text-black/50">{GARANTIA[1]}</span>
              </p>
            </div>

            {/* PENDENTE-DONO: sem destino. Enquanto o dono não define (Calendly,
                WhatsApp ou formulário) o botão não navega, o que é melhor do que
                um `href="#"`, que parece pronto e não é. */}
            <div className="w-full max-w-sm">
              <MotionButton label="Quero viralizar" variant="inverse" fullWidth />
              <p className="mt-3 text-center text-[12px] text-black/40">{CUSTO_DO_CLIQUE}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
