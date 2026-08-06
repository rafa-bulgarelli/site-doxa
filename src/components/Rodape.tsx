import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import wordmarkUrl from '../../brand/doxa-wordmark-white.png';
import { ArrastoInfinito } from './rodape/ArrastoInfinito';
import { ATALHOS, FECHO, LADRILHOS, type Ladrilho } from './rodape/config';
import { MotionButton } from './ui/MotionButton';

const EASE = [0.16, 1, 0.3, 1] as const;

/** O ano do rodapé, lido do relógio: um número escrito à mão envelhece sozinho. */
const ANO = new Date().getFullYear();

/**
 * Um ladrilho do mosaico.
 *
 * Quatro formas, e a diferença entre elas é o que impede o campo de virar uma
 * parede de texto uniforme: a marca é peso, o número é tamanho, a frase é voz e
 * o arroba é assinatura. Arrastando, o que muda de tela para tela não é só o
 * conteúdo — é o RITMO, e é isso que dá vontade de continuar puxando.
 *
 * `select-none` em todos: arrastar por cima de texto selecionável faz o
 * navegador marcar as palavras em azul no meio do gesto, e o campo passa a
 * parecer um documento sendo lido em vez de um objeto sendo movido.
 */
function Ladrilho({ ladrilho }: { ladrilho: Ladrilho }) {
  if (ladrilho.tipo === 'marca') {
    return (
      <span className="select-none font-serif text-[2.6rem] uppercase leading-none tracking-[-0.02em] text-[#F4F1E8] md:text-[4.5rem]">
        Doxa
      </span>
    );
  }

  if (ladrilho.tipo === 'numero') {
    return (
      <span className="block select-none">
        <span className="block font-serif text-[2.4rem] leading-none tracking-[-0.03em] text-[#F4F1E8] md:text-[4rem]">
          {ladrilho.valor}
        </span>
        <span className="mt-2 block text-[12px] text-white/40 md:text-[13px]">
          {ladrilho.rotulo}
        </span>
      </span>
    );
  }

  if (ladrilho.tipo === 'arroba') {
    return (
      <span className="select-none text-[13px] tracking-wide text-white/35 md:text-[15px]">
        {ladrilho.texto}
      </span>
    );
  }

  return (
    <span className="block max-w-[13rem] select-none font-serif text-[1.4rem] leading-[1.1] tracking-[-0.02em] text-white/55 md:max-w-[18rem] md:text-[2rem]">
      {ladrilho.texto}
    </span>
  );
}

/**
 * O RODAPÉ — o campo infinito e o último pedido.
 *
 * ─── POR QUE UM CAMPO QUE SE ARRASTA ─────────────────────────────────────────
 *
 * Porque o gesto já é do site: o hero abre com um canvas onde a pessoa arrasta a
 * foto e o áudio que ela vai entregar. O rodapé fecha com o mesmo verbo, agora
 * sem nada para fazer — é o único lugar da página onde mexer não tem
 * consequência nenhuma, e é justamente por isso que ele pode ser um brinquedo.
 *
 * O mosaico é de TEXTO e não de imagem, e a razão é aritmética: o repositório
 * tem três clientes e seis arquivos de imagem. Um infinito construído com seis
 * peças denuncia o loop no primeiro puxão. Com a voz da página não há esse teto,
 * e o rodapé passa a repetir — de graça, e sem baixar um byte — as frases que a
 * pessoa leu ao longo de toda a rolagem.
 *
 * ─── COMO O PEDIDO SOBREVIVE AO BRINQUEDO ────────────────────────────────────
 *
 * Um campo bonito no fim de uma página de venda tem um risco óbvio: a pessoa
 * chega ao formulário e fica brincando com o rodapé. Três coisas evitam isso.
 *
 *  1. O campo NÃO rouba a rolagem. A referência instalava um `wheel` global; se
 *     ele ficasse, o rodapé viraria uma sala sem porta.
 *  2. Ele tem altura limitada e nasce ATRÁS de um véu preto: o que está aceso na
 *     tela é o pedido, e o mosaico é a textura em volta dele.
 *  3. O botão é a única coisa clicável ali dentro. A camada do fecho é
 *     `pointer-events-none` inteira, com o botão reabrindo o clique só para si
 *     — assim o arrasto continua funcionando POR BAIXO do texto, e o texto não
 *     vira um buraco morto no meio do campo.
 */
export function Rodape() {
  const rodapeRef = useRef<HTMLElement>(null);
  const naTela = useInView(rodapeRef, { amount: 0.25, once: true });
  const parado = useReducedMotion() === true;

  return (
    <footer ref={rodapeRef} className="relative bg-black">
      {/* ─── O CAMPO ──────────────────────────────────────────────────────────
       *
       * `aria-hidden` no campo inteiro, e sem culpa: cada frase daqui é uma
       * repetição do que a página já disse em outro lugar, e ela aparece quatro
       * vezes por causa das cópias do infinito. Um leitor de tela atravessando
       * setenta e dois ladrilhos de texto duplicado antes de chegar ao botão é
       * pior do que não ter campo nenhum. O que importa — o pedido e os links —
       * está fora dele.
       */}
      <div
        aria-hidden
        className="relative h-[68vh] min-h-[460px] overflow-hidden md:h-[74vh]"
      >
        <ArrastoInfinito className="grid grid-cols-[repeat(6,auto)] items-start gap-x-14 gap-y-16 p-10 md:gap-x-28 md:gap-y-28 md:p-16">
          {LADRILHOS.map((ladrilho, indice) => (
            <div
              key={indice}
              /* O desencontro vertical dos pares: sem ele as seis colunas
                 formam linhas retas e o mosaico lê como uma tabela. Deslocado,
                 lê como um mural. Em `mt` fixo e não em porcentagem — a altura
                 de um ladrilho de texto depende de quantas linhas a frase
                 quebrou, e uma porcentagem disso desalinha as cópias entre si,
                 que é exatamente onde a emenda do infinito apareceria. */
              className="even:mt-10 md:even:mt-20"
            >
              <Ladrilho ladrilho={ladrilho} />
            </div>
          ))}
        </ArrastoInfinito>

        {/* O véu, e os dois esfumaçados. O véu tira o mosaico da frente do
            pedido; os esfumaçados dissolvem a faixa no preto da página em cima
            e no rodapé de serviço embaixo, para o campo não ter borda dura —
            uma linha reta cortando palavras ao meio anunciaria a caixa. */}
        <div className="pointer-events-none absolute inset-0 bg-black/55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent" />

        {/* ─── O FECHO ─────────────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <motion.div
            initial={parado ? undefined : { opacity: 0, y: 20 }}
            animate={naTela ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="font-serif text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-[#F4F1E8] md:text-[4.4rem]">
              {FECHO.titulo}
              <span className="block text-white/45">{FECHO.linha}</span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-[15px] text-white/50">{FECHO.publico}</p>

            {/* O único ponto clicável do campo. `pointer-events-auto` devolve o
                clique a ele e a mais nada: em volta, a mão continua arrastando
                o mosaico. */}
            <div className="pointer-events-auto mt-9 flex justify-center">
              <MotionButton label={FECHO.acao} href={FECHO.destino} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── A BARRA DE SERVIÇO ───────────────────────────────────────────────
       *
       * Quieta de propósito, e FORA do campo. Quem chega no rodapé procurando um
       * link não quer brincar com nada para achá-lo — e um link dentro de uma
       * superfície que se arrasta é um link que foge da mão.
       *
       * Só entram âncoras que existem de verdade (`rodape/config.ts` explica o
       * porquê, e ele é uma cicatriz: `#pedido` era apontado por dois botões e
       * não existia em elemento nenhum da página).
       */}
      <div className="border-t border-white/[0.08] px-5 py-8 md:px-10">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <img src={wordmarkUrl} alt="Doxa" className="h-5 w-auto md:h-6" width={657} height={173} />

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
  );
}
