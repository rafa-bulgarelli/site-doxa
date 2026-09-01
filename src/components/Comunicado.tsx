import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HREF_FORMS } from '../ancoras';
import { MotionButton } from './ui/MotionButton';
import { CHAVE_COMUNICADO, COPY, TOTAL_DE_PEDIDOS } from './comunicado/config';

/**
 * ─── O COMUNICADO ────────────────────────────────────────────────────────────
 *
 * O aviso de que o formulário passou dos mil pedidos, por cima da página.
 *
 * Ele é CREME de propósito. Preto e creme são o vocabulário do site inteiro, e
 * o creme é a cor da resposta — o painel que vence a comparação, o formulário.
 * Um aviso sobre "estamos respondendo" pintado na cor da resposta é o site
 * usando a própria gramática; escuro, ele seria só mais uma camada de página, e
 * colorido seria a única mancha de cor fora do menu, o que a paleta proíbe.
 *
 * O que ele NÃO faz, de propósito:
 *
 *  - Não abre no primeiro pixel. Quem chega vê o hero — a promessa é o site, o
 *    aviso é um recado. A espera mora no `App`, que só baixa este chunk quando
 *    for a hora (`ESPERA_MS`), e nunca para quem já o dispensou.
 *  - Não volta. Fechou — em qualquer uma das quatro saídas: botão, ×, véu,
 *    Esc —, a marca fica no `localStorage` e o aviso não existe mais para
 *    aquele navegador. Recado dado duas vezes é propaganda.
 *  - Não prende o visitante. O véu fecha no clique, Esc fecha, e o único foco
 *    tomado é com `preventScroll` — um `focus()` cru na montagem rola a página
 *    sozinha, e este repositório já pagou caro por isso (ver CLAUDE.md).
 */
export function Comunicado({ aoFechar }: { aoFechar: () => void }) {
  const parado = useReducedMotion() === true;
  const cartaoRef = useRef<HTMLDivElement>(null);

  const fechar = () => {
    try {
      localStorage.setItem(CHAVE_COMUNICADO, new Date().toISOString());
    } catch {
      // Navegação privada com storage bloqueado: o aviso volta na próxima
      // visita, que é o comportamento certo quando não há onde lembrar.
    }
    aoFechar();
  };

  useEffect(() => {
    // O foco vai para o CARTÃO, não para um botão: com ele no diálogo, o Esc e
    // o Tab já operam o aviso, e nenhum controle nasce aceso como se tivesse
    // sido apontado. `preventScroll` é obrigatório — sem ele o navegador rola
    // até o elemento focado e a página "anda sozinha" logo depois do load.
    cartaoRef.current?.focus({ preventScroll: true });

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        fechar();
        return;
      }
      // A prisão do Tab. `aria-modal` PROMETE que só o diálogo existe; sem
      // isto o foco vazava para a página de trás do véu, com o scroll travado
      // — um leitor de tela andando por controles invisíveis (finding do
      // collector no gate do card 019). A lista de focáveis é consultada no
      // teclar, não guardada: o cartão é estático, mas uma lista viva não
      // apodrece se ele um dia deixar de ser.
      if (e.key === 'Tab') {
        const raiz = cartaoRef.current;
        if (raiz == null) return;
        const focaveis = raiz.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focaveis.length === 0) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        const ativo = document.activeElement;
        if (e.shiftKey) {
          // Do primeiro controle — ou do próprio cartão, onde o foco nasce —
          // para trás: dá a volta para o último.
          if (ativo === primeiro || ativo === raiz || !raiz.contains(ativo)) {
            e.preventDefault();
            ultimo.focus();
          }
        } else if (ativo === ultimo || !raiz.contains(ativo)) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    window.addEventListener('keydown', aoTeclar);

    // A página para de rolar enquanto o aviso está de pé: o véu diz "isto está
    // na frente", e uma página que continua deslizando atrás dele desmente.
    const rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = rolagemAnterior;
    };
    // `fechar` é estável no que importa (aoFechar vem do App e não muda);
    // remontar o efeito por causa dele só faria o foco piscar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={fechar}
      role="presentation"
    >
      <motion.div
        ref={cartaoRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comunicado-titulo"
        tabIndex={-1}
        className="w-full max-w-lg rounded-3xl bg-[#F4F1E8] p-7 text-[#0B0B0B] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] ring-1 ring-black/10 focus-visible:outline-none sm:p-10"
        initial={parado ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          {/* O ponto que pulsa é TINTA, não verde: fora do menu o site é
              monocromático, e "ao vivo" aqui se diz com movimento, não com cor. */}
          <p className="flex items-center gap-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-black/60">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/40 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
            </span>
            {COPY.selo}
          </p>
          <button
            type="button"
            onClick={fechar}
            aria-label={COPY.fechar}
            className="-m-2 rounded-full p-2 text-black/40 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <h2
          id="comunicado-titulo"
          className="mt-6 font-serif text-[2.4rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]"
        >
          {COPY.tituloAntes} <Contador ate={TOTAL_DE_PEDIDOS} parado={parado} />{' '}
          {COPY.tituloDepois}
        </h2>

        <p className="mt-5 text-[0.95rem] leading-relaxed text-black/70">{COPY.corpo}</p>

        <p className="mt-4 border-l-2 border-black/15 pl-4 text-[0.95rem] font-medium leading-relaxed">
          {COPY.garantia}
        </p>

        <div className="mt-8">
          <MotionButton label={COPY.botao} onClick={fechar} variant="inverse" fullWidth />
        </div>

        <p className="mt-5 text-center text-sm text-black/60">
          {COPY.conviteAntes}{' '}
          {/* Âncora de verdade, não botão: quem clica está navegando para o
              formulário, e o aviso sai da frente no mesmo gesto. */}
          <a
            href={HREF_FORMS}
            onClick={fechar}
            className="font-medium text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
          >
            {COPY.conviteLink}
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * O número do título, subindo de zero — o mesmo gesto do painel da comparação:
 * num cartão cujo argumento é um número, ver o número SUBIR é o argumento
 * chegando. Acontece uma vez e para; quem pediu menos movimento nasce no total.
 *
 * Formatado em pt-BR a cada quadro ("1.000", não "1000"): o separador de
 * milhar precisa existir durante a contagem, senão a linha dança quando o
 * quarto dígito chega.
 */
function Contador({ ate, parado }: { ate: number; parado: boolean }) {
  const bruto = useMotionValue(parado ? ate : 0);
  const texto = useTransform(bruto, (v) => Math.round(v).toLocaleString('pt-BR'));

  useEffect(() => {
    if (parado) return;
    const controle = animate(bruto, ate, {
      duration: 1.2,
      // O cartão leva 0,5 s para pousar; o número espera o pouso para subir —
      // dois movimentos ao mesmo tempo contariam a mesma história duas vezes.
      delay: 0.45,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controle.stop();
  }, [parado, ate, bruto]);

  return <motion.span className="tabular-nums">{texto}</motion.span>;
}
