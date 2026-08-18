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
 * ─── A COR, E DE ONDE ELA VEM ────────────────────────────────────────────────
 *
 * O dono viu o fluxo v2 no ar e disse: "tá muito cinza, sem vida... se baseia no
 * nosso site, traz cor, pode usar os degradês e efeito Siri do FAQ/formulário".
 * Então a cor daqui é IMPORTADA, nunca inventada: a fita de `faq/cores.ts` (a
 * mesma dos pontos do FAQ, do anel do campo e do `texto-aceso-siri`) e as
 * classes globais `.anel-siri` / `.anel-luz`, que já moram no `index.css`.
 * Nenhuma paleta nova nasce neste arquivo — uma sétima cor aqui seria a marca
 * dizendo duas coisas diferentes na mesma tela.
 *
 * O verde e o vermelho continuam sendo GRAMÁTICA, não enfeite: verde é o que
 * protege a garantia, vermelho é o que a quebra. O resto da tela segue preto,
 * `doxa-surface`, `doxa-line` e branco em opacidade.
 */
import { useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CORES } from '../../components/faq/cores';
import wordmarkUrl from '../../../brand/doxa-wordmark-white-96.avif';

/** A curva de entrada da landing. O manual se move como o site, não como um form. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * As cores do anel, entregues ao CSS — o mesmo contrato do campo do FAQ.
 *
 * A primeira volta no fim porque um `conic-gradient` não fecha sozinho: sem
 * repetir o tom inicial, a emenda entre o último e o primeiro apareceria como
 * uma costura dando voltas na borda.
 */
export const ANEL_SIRI: CSSProperties = {
  ['--anel-siri-cores' as string]: [...CORES, CORES[0]].join(', '),
};

/** A fita da marca em linha, para preencher trilho e fio de luz. */
const FITA = `linear-gradient(90deg, ${CORES.join(', ')})`;

/** A moldura de toda tela do fluxo: fundo preto, logo no topo, coluna estreita. */
export function Casca({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-doxa-bg text-white">
      <header className="border-b border-doxa-line/80 px-5 py-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <img src={wordmarkUrl} alt="Doxa" className="h-5 w-auto" width={364} height={96} />
          {/* Serifa e caixa de frase, como todo letreiro do fluxo: caixa alta
              com tracking largo era a roupa antiga, e o dono pediu a troca em
              cada lugar que tinha título em maiúsculas. */}
          <span className="font-serif text-[15px] text-white/35">Manual</span>
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

/**
 * Metadado, e SÓ metadado: "Capítulo 2 de 4", "Registro", "E-mail".
 *
 * Era caixa alta com `tracking` largo. O dono foi literal: "em todo lugar que
 * tiver um título com letras maiúsculas, troca para fonte com serifa e só a
 * primeira letra maiúscula". Então a caixa alta saiu daqui — e sai de toda a
 * tela junto, porque este `Rotulo` é quem veste quase todos os letreiros do
 * fluxo. O texto não mudou uma letra: quem estava em maiúsculas estava assim
 * por causa da CLASSE, e é a classe que foi embora.
 *
 * 15px porque a serifa em 14px, com a mesma cor apagada, fica fina demais no
 * celular — a troca de fonte pede um ponto a mais para respirar.
 */
export function Rotulo({ children }: { children: ReactNode }) {
  return <p className="font-serif text-[15px] text-doxa-muted">{children}</p>;
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

/**
 * O botão que leva adiante.
 *
 * `aceso` põe nele o anel da Siri — o mesmo `conic-gradient` de um pixel do
 * campo do FAQ. Ele é para o gesto que FECHA alguma coisa (confirmar o aceite,
 * concluir), e não para todo botão do fluxo: um anel em cada tela deixa de
 * significar "é aqui" e vira papel de parede. Travado, o anel some junto — luz
 * num botão que não responde é promessa falsa.
 */
export function Botao({
  children,
  onClick,
  desabilitado = false,
  tipo = 'button',
  aceso = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  desabilitado?: boolean;
  tipo?: 'button' | 'submit';
  aceso?: boolean;
}) {
  const comAnel = aceso && !desabilitado;
  return (
    <button
      type={tipo === 'submit' ? 'submit' : 'button'}
      onClick={onClick}
      disabled={desabilitado}
      /* `relative` porque o anel é um `::before` em `inset: -1px`, e
         `border-radius: inherit` o faz copiar o raio da pílula. */
      className={`${BASE_DO_BOTAO} bg-white text-black hover:bg-white/90 disabled:bg-white/15 disabled:text-white/40 ${
        comAnel ? 'anel-siri anel-siri-isca relative' : ''
      }`}
      style={comAnel ? ANEL_SIRI : undefined}
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
      {/* O preenchido é a FITA da marca, não um cinza claro: o que já foi
          andado é a única coisa desta tela que merece cor o tempo todo. O
          fundo do trilho continua branco a 8% — sem contraste atrás, a fita
          não teria o que medir. */}
      <div
        className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
        style={{ width: `${largura}%`, backgroundImage: FITA }}
      />
    </div>
  );
}

/**
 * A trilha de itens: um ponto por item obrigatório do capítulo.
 *
 * É o mapa que a etapa única não dá. Sozinha na tela, uma regra por vez esconde
 * o tamanho do caminho — e um fluxo de aceite que não diz quanto falta é o mais
 * rápido de abandonar. Ponto aceso na cor da fita = confirmado; o da vez ganha
 * um anel branco; os que vêm depois são contorno.
 *
 * `aria-hidden` porque o texto ao lado já diz "Item 3 de 8": um leitor de tela
 * anunciando oito pontos diria a mesma coisa oito vezes.
 */
export function TrilhaDeItens({
  total,
  atual,
  confirmados,
}: {
  total: number;
  /** 1-based, como está escrito na tela. 0 = nenhum item em foco (a intro). */
  atual: number;
  confirmados: readonly boolean[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-hidden>
      {Array.from({ length: total }, (_, indice) => {
        const feito = confirmados[indice] === true;
        const agora = indice + 1 === atual;
        return (
          <span
            key={indice}
            className={`h-2.5 w-2.5 rounded-full border transition-colors ${
              agora ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-doxa-bg' : ''
            } ${feito ? 'border-transparent' : 'border-white/25'}`}
            style={feito ? { backgroundColor: CORES[indice % CORES.length] } : undefined}
          />
        );
      })}
    </div>
  );
}

/** Um fio de luz da marca — a assinatura de cor no topo de um cartão-momento. */
export function Fio({ cor }: { cor?: string }) {
  return (
    <span
      aria-hidden
      className="block h-[2px] w-14 rounded-full"
      style={{ backgroundImage: cor == null ? FITA : undefined, backgroundColor: cor }}
    />
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
 *
 * Por marcar, ela carrega o anel da Siri com a isca — é o único gesto que falta
 * na tela, e o pulso espaçado é o que o mostra a quem chegou rolando. Marcada,
 * o anel sai e entra o verde: a luz diz "é aqui", o verde diz "está feito", e
 * as duas coisas na mesma caixa ao mesmo tempo seriam duas afirmações brigando.
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
      style={marcada ? undefined : ANEL_SIRI}
      className={`relative flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
        marcada
          ? 'border-emerald-400/40 bg-emerald-400/[0.06] text-white'
          : 'anel-siri anel-siri-isca border-white/[0.14] text-white/75 hover:bg-white/[0.04]'
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

/**
 * ─── O PASSO SEGUINTE AO COMPROVANTE ─────────────────────────────────────────
 *
 * O cadastro na plataforma da DOXA, na tela final do aceite.
 *
 * Duas decisões que não são gosto:
 *
 *  · **Sem link, não existe botão.** Nem placeholder, nem espaço morto, nem
 *    botão desabilitado: o convite da plataforma é opcional no cadastro do
 *    cliente, e um botão que não leva a lugar nenhum é a pior primeira
 *    impressão possível do produto que a pessoa acabou de aceitar. Uma URL em
 *    branco (`''`) conta como ausente — o admin pode ter salvo um campo vazio.
 *  · **Contorno, e não branco cheio.** O PDF é a ação DESTE momento — é o
 *    comprovante que a pessoa veio buscar, e ela ainda pode não ter baixado.
 *    O cadastro é o passo seguinte, então vem logo abaixo, com presença
 *    (borda mais clara, fundo levemente aceso, texto em branco pleno) mas sem
 *    disputar: dois botões brancos empilhados fazem o olho decidir no cara ou
 *    coroa. Sem anel da Siri de propósito — a tela de conclusão já gasta a
 *    ÚNICA fita acesa do fluxo na frase "Está registrado.", e uma segunda luz
 *    aqui transformaria o momento em papel de parede.
 *
 * `target="_blank"`: sair da aba do comprovante levaria embora o botão de
 * baixar o PDF, cuja URL assinada morre em minutos.
 */
export function CadastroOficial({ url }: { url?: string | null }) {
  if (url == null || url.trim().length === 0) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${BASE_DO_BOTAO} border border-white/25 bg-white/[0.06] text-white hover:bg-white/[0.12]`}
    >
      Faça seu cadastro oficial na DOXA
    </a>
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
