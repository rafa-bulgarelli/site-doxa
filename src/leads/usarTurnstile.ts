/**
 * ─── O TURNSTILE, do lado do navegador ───────────────────────────────────────
 *
 * Carrega o widget da Cloudflare e entrega o token que o `/api/lead` vai
 * conferir. Invisível para quase todo mundo: no modo "managed" a Cloudflare
 * resolve sozinha na maioria das visitas e só mostra um desafio quando
 * desconfia.
 *
 * ─── AS TRÊS DECISÕES QUE IMPORTAM ───────────────────────────────────────────
 *
 * 1. O SCRIPT SÓ CHEGA QUANDO O FORMULÁRIO É USADO. Ele são 70 kB de terceiro,
 *    e a página de vendas não pode pagar isso na primeira dobra por causa de um
 *    formulário que a maioria dos visitantes nem abre. Carrega no primeiro
 *    toque, e a essa altura sobram oito passos de folga antes do envio.
 *
 * 2. SEM CHAVE, O HOOK NÃO EXISTE. Se `VITE_TURNSTILE_SITE_KEY` não estiver
 *    definida, nada é carregado e o token é `null` — que é exatamente o que o
 *    endpoint espera quando a camada está desligada. O formulário funciona
 *    igual, com três camadas em vez de quatro.
 *
 * 3. O TOKEN É DE USO ÚNICO E EXPIRA. A Cloudflare invalida depois de cinco
 *    minutos, e o nosso formulário tem nove passos — dá para alguém demorar
 *    mais do que isso. Por isso o widget é renovado quando expira, e o envio
 *    pede o token do momento em vez de guardar o primeiro que apareceu.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const CHAVE = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export const temTurnstile = Boolean(CHAVE);

interface ApiTurnstile {
  render: (
    alvo: HTMLElement,
    opcoes: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      appearance?: 'always' | 'execute' | 'interaction-only';
      theme?: 'auto' | 'light' | 'dark';
      size?: 'normal' | 'flexible' | 'compact';
    },
  ) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: ApiTurnstile;
  }
}

let carregando: Promise<void> | null = null;

/** Baixa o script uma vez só, por mais que o hook seja montado. */
function carregarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  carregando ??= new Promise<void>((resolver, rejeitar) => {
    const tag = document.createElement('script');
    tag.src = SCRIPT;
    tag.async = true;
    tag.onload = () => resolver();
    tag.onerror = () => {
      // Deixa tentar de novo numa próxima montagem: bloqueador de anúncio e
      // rede instável são os dois motivos comuns, e os dois são temporários.
      carregando = null;
      rejeitar(new Error('turnstile'));
    };
    document.head.appendChild(tag);
  });
  return carregando;
}

/**
 * O widget e o token.
 *
 * `ancorar` é uma ref de callback: prenda-a numa `div` vazia dentro do
 * formulário. `token()` devolve o que houver no momento do envio — nunca uma
 * cópia guardada, porque o token de cinco minutos atrás já não vale.
 */
export function usarTurnstile(ligado: boolean) {
  const [token, setToken] = useState<string | null>(null);
  const caixa = useRef<HTMLDivElement | null>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!CHAVE || !ligado || caixa.current == null || widget.current != null) return;
    let vivo = true;

    void carregarScript()
      .then(() => {
        if (!vivo || !window.turnstile || caixa.current == null) return;
        widget.current = window.turnstile.render(caixa.current, {
          sitekey: CHAVE,
          callback: (t) => setToken(t),
          // Expirou: some com o token para o envio não mandar um inválido, e a
          // Cloudflare resolve outro sozinha.
          'expired-callback': () => setToken(null),
          'error-callback': () => setToken(null),
          // `interaction-only`: aparece SÓ se a Cloudflare precisar perguntar
          // alguma coisa. Na maioria das visitas o visitante nunca vê nada.
          appearance: 'interaction-only',
          theme: 'dark',
          size: 'flexible',
        });
      })
      .catch(() => {
        /* Script bloqueado ou rede caída. O token fica `null` e o endpoint
           decide o que fazer — hoje ele deixa passar quando a Cloudflare não
           responde, porque um problema deles não pode virar um lead perdido. */
      });

    return () => {
      vivo = false;
    };
  }, [ligado]);

  const ancorar = useCallback((no: HTMLDivElement | null) => {
    caixa.current = no;
  }, []);

  /*
   * O token guardado num ref, além do estado.
   *
   * O estado desenha; o ref é lido por `esperarToken`, que roda dentro de uma
   * promessa e não enxergaria o estado novo — ela nasceu com o valor de quando
   * foi criada. É a diferença entre esperar de verdade e esperar por um valor
   * que nunca muda.
   */
  const atual = useRef<string | null>(null);
  atual.current = token;

  /**
   * Espera o token até `limite`, e desiste em silêncio.
   *
   * MEDIDO num navegador de verdade: a Cloudflare leva cerca de cinco segundos
   * para resolver sozinha. O formulário tem nove passos e o script começa a
   * carregar no segundo, então na prática o token já está pronto muito antes do
   * envio — este espera existe para o caso raro de alguém atravessar o
   * formulário depressa.
   *
   * Desistir é deliberado: um bloqueador de anúncio que impeça o script da
   * Cloudflare não pode custar o lead de uma pessoa real. Quem chega sem token
   * é julgado pelas outras camadas, com a régua mais dura — ver `/api/lead`.
   */
  const esperarToken = useCallback(async (limite = 6000): Promise<string | null> => {
    if (!temTurnstile) return null;
    const ate = Date.now() + limite;
    while (atual.current == null && Date.now() < ate) {
      await new Promise((r) => setTimeout(r, 150));
    }
    return atual.current;
  }, []);

  return { ancorar, token, esperarToken, ativo: temTurnstile };
}
