/**
 * ─── AS PEÇAS DO MANUAL ──────────────────────────────────────────────────────
 *
 * O vocabulário visual do fluxo, num lugar só: a casca preta, os botões, o
 * trilho de progresso, o quadro de aviso. Nenhuma peça daqui sabe o que é um
 * convite — elas só desenham.
 *
 * Duas regras que valem para todas e não são gosto:
 *  · alvo de toque de 48px de altura, porque isto é lido no celular, em pé, com
 *    uma mão só — botão de 32px no polegar é erro de clique, e erro de clique
 *    num fluxo de aceite é o cliente marcando o que não queria;
 *  · foco visível SEMPRE (`focus-visible:ring`), porque o teclado é o caminho de
 *    quem usa leitor de tela e o anel é a única pista que essa pessoa tem.
 *
 * A paleta é a do site: preto, `doxa-surface`, `doxa-line`, branco em opacidade.
 * Nada colorido — a exceção do repo são as bandeiras do menu, que não vêm aqui.
 */
import type { ReactNode } from 'react';
import wordmarkUrl from '../../../brand/doxa-wordmark-white-96.avif';

/** A moldura de toda tela do fluxo: fundo preto, logo no topo, coluna estreita. */
export function Casca({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-doxa-bg text-white">
      <header className="border-b border-doxa-line/80 px-5 py-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <img src={wordmarkUrl} alt="Doxa" className="h-5 w-auto" width={364} height={96} />
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">Manual</span>
        </div>
      </header>
      <div className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">{children}</div>
    </main>
  );
}

export function Titulo({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-serif text-[30px] leading-[1.12] text-white sm:text-[38px]">{children}</h1>
  );
}

export function Linha({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.65] text-white/60">{children}</p>;
}

const BASE_DO_BOTAO =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-6 ' +
  'text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
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
 * tela anunciando "barra de progresso 40%" logo depois de "4 de 10 regras" diz
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
    <div className={`rounded-2xl border ${borda} bg-doxa-surface p-4 text-[14px] leading-[1.6] text-white/65`}>
      {children}
    </div>
  );
}

/**
 * A caixa de aceite — a mesma no fim de cada regra e embaixo da declaração.
 *
 * O rótulo INTEIRO é o alvo, não o quadradinho de 16px: é o gesto que mais se
 * repete no fluxo, feito com o polegar, e errar nele marca a regra errada.
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
      className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        marcada
          ? 'border-white/35 bg-white/[0.06] text-white'
          : 'border-white/[0.12] text-white/70 hover:bg-white/[0.04]'
      }`}
    >
      <input
        type="checkbox"
        checked={marcada}
        onChange={(evento) => aoAlternar(evento.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-white"
      />
      <span className="text-[15px]">{children}</span>
    </label>
  );
}

/** O selo da regra crítica: descumprir pode invalidar a garantia. */
export function SeloCritica() {
  return (
    <span className="inline-flex items-center rounded-full border border-white/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/75">
      Crítica
    </span>
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
        <p className="text-center text-[14px] text-white/70" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Um par rótulo/valor dos dados travados da identificação. */
export function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="border-t border-doxa-line py-3 first:border-t-0 first:pt-0">
      <p className="text-[11px] uppercase tracking-[0.16em] text-doxa-muted">{rotulo}</p>
      <p className="mt-1 break-words text-[15px] text-white">{valor}</p>
    </div>
  );
}
