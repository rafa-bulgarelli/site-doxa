/**
 * ─── AS PEÇAS DO MANUAL ──────────────────────────────────────────────────────
 *
 * O vocabulário visual do fluxo, num lugar só: a casca preta, os botões, o
 * trilho, o quadro de recado e a revelação progressiva. Nenhuma peça daqui sabe
 * o que é um convite — elas só desenham.
 *
 * Três regras que valem para todas e não são gosto:
 *  · alvo de toque de 48px, porque isto é lido no celular, em pé, com uma mão
 *    só — erro de clique num fluxo de aceite é o cliente marcando o que não
 *    queria;
 *  · foco visível SEMPRE (`focus-visible:ring`), porque o teclado é o caminho de
 *    quem usa leitor de tela e o anel é a única pista que essa pessoa tem;
 *  · corpo de 17px para cima e NADA abaixo de 14px. O dono foi literal: "sem
 *    letra miúda". Texto contratual em corpo pequeno é o padrão que faz as
 *    pessoas rolarem sem ler, e este manual existe para ser lido.
 *
 * A paleta é a do site: preto, `doxa-surface`, `doxa-line`, branco em opacidade.
 * A ÚNICA cor autorizada aqui é funcional e mora na lista da garantia (verde
 * protege, vermelho quebra) — decisão do dono para esta tela, não licença para
 * colorir o resto.
 */
import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import wordmarkUrl from '../../../brand/doxa-wordmark-white-96.avif';

/** A curva de entrada da landing. O manual se move como o site, não como um form. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** A moldura de toda tela do fluxo: fundo preto, logo no topo, coluna estreita. */
export function Casca({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-doxa-bg text-white">
      <header className="border-b border-doxa-line/80 px-5 py-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <img src={wordmarkUrl} alt="Doxa" className="h-5 w-auto" width={364} height={96} />
          <span className="text-[14px] uppercase tracking-[0.18em] text-white/35">Manual</span>
        </div>
      </header>
      <div className="mx-auto w-full max-w-2xl px-5 pb-28 pt-10">{children}</div>
    </main>
  );
}

/** A entrada suave de um bloco. Mesmo gesto das seções da landing. */
export function Entrada({ children, atraso = 0 }: { children: ReactNode; atraso?: number }) {
  const semMovimento = useReducedMotion() === true;
  return (
    <motion.div
      initial={semMovimento ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: semMovimento ? 0 : atraso }}
    >
      {children}
    </motion.div>
  );
}

export function Titulo({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-serif text-[34px] leading-[1.08] text-white sm:text-[46px]">{children}</h1>
  );
}

/** O título de um bloco dentro da tela — grande, mas abaixo do `Titulo`. */
export function Subtitulo({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-[26px] leading-[1.15] text-white sm:text-[30px]">{children}</h2>
  );
}

/** Metadado, e SÓ metadado: "Capítulo 2 de 4", "Registro", "E-mail". */
export function Rotulo({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14px] uppercase tracking-[0.16em] text-doxa-muted">{children}</p>
  );
}

/** Corpo de leitura. Nunca `doxa-muted`: isto é conteúdo, não etiqueta. */
export function Linha({ children }: { children: ReactNode }) {
  return <p className="text-[17px] leading-[1.7] text-white/75">{children}</p>;
}

const BASE_DO_BOTAO =
  'inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 ' +
  'text-[17px] transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-doxa-bg ' +
  'disabled:cursor-not-allowed';

export function Botao({
  children,
  onClick,
  desabilitado = false,
  tipo = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  desabilitado?: boolean;
  tipo?: 'button' | 'submit';
}) {
  return (
    <button
      type={tipo === 'submit' ? 'submit' : 'button'}
      onClick={onClick}
      disabled={desabilitado}
      className={`${BASE_DO_BOTAO} bg-white text-black hover:bg-white/90 disabled:bg-white/15 disabled:text-white/40`}
    >
      {children}
    </button>
  );
}

export function BotaoDiscreto({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${BASE_DO_BOTAO} border border-white/[0.14] text-white/80 hover:bg-white/[0.06] hover:text-white`}
    >
      {children}
    </button>
  );
}

/**
 * O trilho de progresso.
 *
 * É `aria-hidden` porque o número já está dito em texto ao lado — um leitor de
 * tela anunciando "barra de progresso 40%" logo depois de "capítulo 2 de 4" diz
 * a mesma coisa duas vezes.
 */
export function Trilho({ fracao }: { fracao: number }) {
  const largura = Math.round(Math.min(Math.max(fracao, 0), 1) * 100);
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.08]" aria-hidden>
      <div
        className="h-full rounded-full bg-white/70 transition-[width] duration-500 motion-reduce:transition-none"
        style={{ width: `${largura}%` }}
      />
    </div>
  );
}

/** Um quadro de recado: aviso de privacidade, alerta da garantia, erro do envio. */
export function Quadro({
  children,
  tom = 'calmo',
}: {
  children: ReactNode;
  tom?: 'calmo' | 'atencao';
}) {
  const borda = tom === 'atencao' ? 'border-white/25' : 'border-doxa-line';
  return (
    <div
      className={`rounded-2xl border ${borda} bg-doxa-surface p-5 text-[17px] leading-[1.65] text-white/70`}
    >
      {children}
    </div>
  );
}

/**
 * A revelação progressiva — o "por quê" a um toque de distância.
 *
 * É a peça que faz a tela caber: o título e a instrução ficam sempre visíveis, e
 * o porquê e o exemplo só aparecem para quem quer. Trinta parágrafos abertos de
 * uma vez é exatamente a tela que ninguém lê.
 */
export function Revelacao({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const semMovimento = useReducedMotion() === true;
  const idDoCorpo = useId();

  return (
    <div>
      <button
        type="button"
        onClick={() => setAberto((estava) => !estava)}
        aria-expanded={aberto}
        aria-controls={idDoCorpo}
        className="inline-flex min-h-[44px] items-center gap-2 text-[16px] text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-doxa-surface"
      >
        <span className="underline decoration-white/25 underline-offset-4">{rotulo}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: aberto ? 180 : 0 }}
          transition={{ duration: semMovimento ? 0 : 0.3, ease: EASE }}
          className="text-[14px] leading-none"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id={idDoCorpo}
            key="corpo"
            initial={semMovimento ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: semMovimento ? 0 : 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * A caixa de aceite da declaração final.
 *
 * O rótulo INTEIRO é o alvo, não o quadradinho: é o gesto que decide o registro,
 * feito com o polegar, e errar nele marca o que o cliente não quis marcar.
 */
export function CaixaDeAceite({
  marcada,
  aoAlternar,
  children,
}: {
  marcada: boolean;
  aoAlternar: (valor: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
        marcada
          ? 'border-emerald-400/40 bg-emerald-400/[0.06] text-white'
          : 'border-white/[0.14] text-white/75 hover:bg-white/[0.04]'
      }`}
    >
      <input
        type="checkbox"
        checked={marcada}
        onChange={(evento) => aoAlternar(evento.target.checked)}
        className="h-6 w-6 shrink-0 cursor-pointer accent-emerald-400"
      />
      <span className="text-[17px] leading-[1.5]">{children}</span>
    </label>
  );
}

/**
 * O download do comprovante, em dois tempos.
 *
 * Com a URL na mão é um `<a>` de verdade, não um botão que abre janela: a URL
 * é assinada e some em minutos, então quando ela chegou o gesto do cliente tem
 * que ir direto ao arquivo. Sem ela, um botão pede uma nova — e SÓ DEPOIS
 * vira `<a>`. `window.open` depois de um `await` morre no bloqueador de
 * pop-up do celular, que é exatamente onde este fluxo é usado.
 */
export function BaixarPdf({
  url,
  pedindo,
  erro,
  aoPedir,
}: {
  url?: string;
  pedindo: boolean;
  erro?: string;
  aoPedir: () => void;
}) {
  return (
    <div className="space-y-3">
      {url == null ? (
        <Botao onClick={aoPedir} desabilitado={pedindo}>
          {pedindo ? 'Preparando o PDF…' : 'Baixar meu comprovante em PDF'}
        </Botao>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={`${BASE_DO_BOTAO} bg-white text-black hover:bg-white/90`}
        >
          Baixar meu comprovante em PDF
        </a>
      )}
      {erro != null && (
        <p className="text-center text-[16px] text-white/70" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Um par rótulo/valor dos dados travados da identificação. */
export function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="border-t border-doxa-line py-4 first:border-t-0 first:pt-0">
      <Rotulo>{rotulo}</Rotulo>
      <p className="mt-1.5 break-words text-[17px] text-white">{valor}</p>
    </div>
  );
}
