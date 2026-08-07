import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import wordmarkUrl from '../../brand/doxa-wordmark-white.png';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { ArrastoInfinito } from './rodape/ArrastoInfinito';
import { Custo } from './rodape/Custo';
import { Peca, usePalco } from './rodape/Peca';
import { ATALHOS, EXPOSTAS, FECHO, PECAS } from './rodape/config';
import { MotionButton } from './ui/MotionButton';

const EASE = [0.16, 1, 0.3, 1] as const;

/** O ano do rodapé, lido do relógio: um número escrito à mão envelhece sozinho. */
const ANO = new Date().getFullYear();

/**
 * Quantos vídeos tocam ao mesmo tempo num telefone.
 *
 * Seis é o número do dono para a tela grande, e lá ele é o que cabe em cena. No
 * telefone o campo mostra duas peças de cada vez e a rede quase sempre é a da
 * rua — seis arquivos disputando a mesma banda entregam seis vídeos travando,
 * que é pior do que dois rodando limpo e quatro stills.
 */
const EXPOSTAS_MOBILE = 2;

/**
 * Quanto do trecho de revelação precisa estar à vista para o campo acordar.
 *
 * Cedo de propósito: é este o instante em que a deriva começa e os primeiros
 * vídeos pedem vaga, e um vídeo precisa de algum tempo entre o pedido e o
 * primeiro quadro. Acordando com um sexto do rodapé à mostra, o campo já está
 * vivo quando a pessoa termina de revelá-lo.
 */
const ACORDA = 0.15;

/**
 * E quanto para o FECHO entrar.
 *
 * Ele mora no meio da tela, e é a última coisa que o reveal descobre. Animado
 * junto com o despertar do campo, ele teria feito a sua entrada inteira atrás
 * da página — e o que a pessoa veria ao chegar seria um texto já parado.
 */
const FECHO_A_VISTA = 0.55;

/**
 * O RODAPÉ — o campo infinito, agora em vídeo, e o último pedido.
 *
 * ─── ELE É FIXO, E A PÁGINA O DESCOBRE ───────────────────────────────────────
 *
 * Pedido do dono, e o que ele compra é a última transição da página: o rodapé
 * não CHEGA rolando com o resto, ele já estava ali embaixo o tempo todo e o
 * site é que desliza para fora da frente dele. É a diferença entre virar a
 * última página e levantar a folha de cima.
 *
 * A mecânica é a mais simples que existe e não custa um único ouvinte de
 * rolagem:
 *
 *  1. o rodapé é `fixed` no pé da janela, com a altura dela;
 *  2. a página inteira (`<main>`, em `App.tsx`) é opaca e vem POR CIMA dele;
 *  3. depois do `<main>` há um trecho vazio da altura de uma tela — o marco
 *     daqui embaixo. Rolar por esse trecho é o que empurra a página para fora
 *     e revela o rodapé, um pixel por pixel de rolagem.
 *
 * O `<main>` precisa de `z-10` para isso, e o marco precisa ser TRANSPARENTE:
 * é justamente a ausência de fundo nele que deixa o rodapé aparecer por trás.
 *
 * O preço, e é o que a chave `ativo` paga: o rodapé está montado e "na tela"
 * desde o primeiro pixel do site, escondido atrás dele. Sem alguém dizendo
 * quando ele foi revelado, o campo estaria derivando e os vídeos tocando
 * durante a rolagem inteira, atrás de uma parede preta.
 *
 * ─── O CAMPO É DE VÍDEO, e não mais de frases ────────────────────────────────
 *
 * Também pedido do dono. O argumento que colocou texto ali continua verdadeiro
 * e virou uma dívida em vez de uma decisão — são três clientes, e três peças
 * distintas denunciam o loop. O que se ganha em troca é a página fechando com a
 * COISA que ela vende, em movimento, em vez de com uma repetição das frases que
 * a pessoa leu duas telas acima.
 *
 * Trinta lugares por cópia, cento e vinte no documento, e no máximo SEIS
 * tocando. `rodape/Peca.tsx` explica por que o vídeo é um recurso com teto — em
 * resumo, o infinito desenha o mosaico quatro vezes, e cento e vinte vídeos
 * seriam um rodapé que derruba a aba. O resto é still, que é a mesma imagem
 * repetida e custa quase nada.
 *
 * ─── E UM EM CADA QUATRO NÃO É VÍDEO ─────────────────────────────────────────
 *
 * Também pedido do dono: no lugar de algumas imagens, a comparação de não ter a
 * Doxa. Esses lugares carregam uma das contratações que ela substitui — o video
 * maker, o roteirista, a agência —, com a cor que o item já tem na ladainha da
 * comparação. O campo passa a alternar o que a página ENTREGA com o que ela
 * SUBSTITUI, que são as duas metades da mesma troca.
 *
 * O número de cada cartão ainda não existe, e não foi inventado: ver
 * `CUSTO_POR_ITEM` em `comparacao/config.ts`. Sem a linha do item, o cartão
 * aparece com o nome e sem preço.
 *
 * ─── O DESENCONTRO VOLTOU, e agora ele tem razão de ser ─────────────────────
 *
 * Ele já existiu aqui e foi removido: com catorze textos de alturas diferentes,
 * o desencontro servia para quebrar a leitura de tabela, e em retângulos
 * idênticos ele lia como grade desalinhada. O que mudou é a densidade — trinta
 * peças coladas em dez colunas formam linhas horizontais fortes, e são elas que
 * fazem o campo parecer uma planilha. Meio passo nas colunas pares quebra a
 * linha sem desalinhar nada, porque agora TODAS as pares descem o mesmo tanto.
 *
 * ─── COMO O PEDIDO SOBREVIVE AO BRINQUEDO ────────────────────────────────────
 *
 *  1. O campo NÃO rouba a rolagem — nenhum `wheel` global, nunca.
 *  2. Ele nasce atrás de um véu preto: o que está aceso na tela é o pedido, e o
 *     mosaico é a textura em volta dele.
 *  3. O botão é a única coisa clicável ali dentro: a camada do fecho é
 *     `pointer-events-none` inteira, com o botão reabrindo o clique só para si
 *     — assim o arrasto continua funcionando POR BAIXO do texto.
 */
export function Rodape() {
  const marcoRef = useRef<HTMLDivElement>(null);
  const revelado = useInView(marcoRef, { amount: ACORDA });
  const noFecho = useInView(marcoRef, { amount: FECHO_A_VISTA, once: true });
  const parado = useReducedMotion() === true;
  const desktop = useIsDesktop();
  const palco = usePalco(desktop ? EXPOSTAS : EXPOSTAS_MOBILE);

  return (
    <>
      {/* O MARCO: o trecho de rolagem que revela o rodapé. Uma tela de altura,
          sem fundo nenhum — o que se vê atravessando ele é o rodapé fixo lá
          atrás. É também o que o `useInView` observa: a fração dele que está à
          vista é, ao pixel, a fração do rodapé que foi revelada. */}
      <div ref={marcoRef} aria-hidden className="h-[100svh]" />

      <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[100svh] flex-col bg-black">
        <div className="relative min-h-0 flex-1">
          {/* ─── O CAMPO ────────────────────────────────────────────────────
           *
           * `aria-hidden` no mosaico e SÓ nele: cada peça daqui é um reel que a
           * parede de prova já apresentou com nome e números, e ela aparece
           * quatro vezes por causa das cópias do infinito. Um leitor de tela
           * atravessando cinquenta e seis molduras antes de chegar ao botão é
           * pior do que não ter campo nenhum. O fecho, que é o que importa,
           * está FORA desta camada — antes ele estava dentro, e era um pedido
           * de contato invisível para quem lê a página com os ouvidos.
           */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <ArrastoInfinito
              ativo={revelado}
              /* A grade uniforme: dez colunas de largura FIXA por três linhas,
                 todas ocupadas, com as colunas pares descendo meio passo
                 (`rodape/config.ts` explica o desenho e o número dez).

                 ─── O RECUO É METADE DO VÃO, e isso não é gosto ─────────────

                 É a condição para o infinito não ter emenda. O bloco se repete
                 lado a lado e um em cima do outro; para o ritmo atravessar a
                 junção, a altura do bloco tem de ser um múltiplo exato do passo
                 (peça + vão), e o mesmo na largura. Com recuo igual a meio vão,
                 o bloco mede exatamente `linhas × passo` — meio vão em cima,
                 meio embaixo, e a soma dos dois na emenda dá um vão inteiro,
                 idêntico aos de dentro. Com `p-8` e `gap-y-4`, como estava
                 aqui, a emenda tinha 64px onde as peças de dentro tinham 32.

                 ─── E O BLOCO TEM DE SER MAIOR QUE A JANELA ────────────────

                 2260 × 1088 no desktop. A volta do infinito acontece a um bloco
                 de distância: mais estreito que a tela, e o fim da deriva traz
                 uma faixa vazia para dentro do quadro. O mosaico anterior media
                 1248 × 843 numa janela de 1507 × 851 — a falha já estava aqui,
                 escondida pelo vazio que o próprio X desenhava.

                 `--desloca` é o meio passo das colunas pares, e vale o mesmo
                 que o vão. Mora aqui, e não na peça, porque muda com o
                 breakpoint e `style` não tem media query. */
              className="grid grid-cols-[repeat(10,8rem)] grid-rows-[repeat(3,auto)] gap-[24px] p-[12px] [--desloca:24px] md:grid-cols-[repeat(10,11rem)] md:gap-[50px] md:p-[25px] md:[--desloca:50px]"
            >
              {/* Vídeo ou cartão de custo, na mesma célula e com a mesma
                  moldura. O que a página entrega ao lado do que ela substitui —
                  `rodape/config.ts` escolhe quais lugares são de cada tipo. */}
              {PECAS.map((peca, indice) =>
                peca.tipo === 'reel' ? (
                  <Peca
                    key={indice}
                    reel={peca.reel}
                    lugar={peca.lugar}
                    palco={palco}
                    ativo={revelado}
                  />
                ) : (
                  <Custo key={indice} item={peca.item} custo={peca.custo} lugar={peca.lugar} />
                ),
              )}
            </ArrastoInfinito>

            {/* O véu, e os dois esfumaçados. O véu tira o mosaico da frente do
                pedido — mais denso do que era, porque agora o que está atrás
                dele tem imagem e movimento em vez de texto cinza. Os
                esfumaçados dissolvem o campo no preto em cima e na barra de
                serviço embaixo, para ele não ter borda dura. */}
            <div className="pointer-events-none absolute inset-0 bg-black/65" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* ─── O FECHO ─────────────────────────────────────────────────── */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            <motion.div
              initial={parado ? undefined : { opacity: 0, y: 20 }}
              animate={noFecho ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h2 className="font-serif text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-[#F4F1E8] md:text-[4.4rem]">
                {FECHO.titulo}
                <span className="block text-white/45">{FECHO.linha}</span>
              </h2>

              <p className="mx-auto mt-5 max-w-md text-[15px] text-white/50">{FECHO.publico}</p>

              {/* O único ponto clicável do campo. `pointer-events-auto` devolve
                  o clique a ele e a mais nada: em volta, a mão continua
                  arrastando o mosaico. */}
              <div className="pointer-events-auto mt-9 flex justify-center">
                <MotionButton label={FECHO.acao} href={FECHO.destino} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── A BARRA DE SERVIÇO ───────────────────────────────────────────
         *
         * Quieta de propósito, e FORA do campo. Quem chega no rodapé procurando
         * um link não quer brincar com nada para achá-lo — e um link dentro de
         * uma superfície que se arrasta é um link que foge da mão.
         *
         * `shrink-0`: ela é a única parte do rodapé com altura própria, e o
         * campo acima é que se ajusta ao que sobra da tela.
         */}
        <div className="shrink-0 border-t border-white/[0.08] px-5 py-8 md:px-10">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <img
              src={wordmarkUrl}
              alt="Doxa"
              className="h-5 w-auto md:h-6"
              width={657}
              height={173}
            />

            <nav className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {ATALHOS.map((atalho) => (
                <a
                  key={atalho.destino}
                  href={atalho.destino}
                  className="text-[13px] text-white/45 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  {atalho.rotulo}
                </a>
              ))}
            </nav>

            <p className="text-[13px] text-white/25">© {ANO} Doxa</p>
          </div>
        </div>
      </footer>
    </>
  );
}
