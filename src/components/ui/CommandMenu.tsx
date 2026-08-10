import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ─── A PÍLULA QUE VIRA PAINEL ────────────────────────────────────────────────
 *
 * Uma cápsula que carrega título, uma linha de status e um painel que desce no
 * hover, no toque ou no ⌘K. Adaptada da `command-menu` do 21st.dev.
 *
 * A peça é BURRA de propósito: ela não sabe o que é uma seção do site nem o que
 * é um idioma, só desenha grupos de itens selecionáveis. Quem dá sentido a isso
 * é `hero/MenuDoxa.tsx`. É o que permite a linha de idiomas existir sem nenhuma
 * prop de idioma — ela é só uma seção com `grade: true` e um item `ativo`.
 *
 * Ela também NÃO se posiciona. Quem a coloca na tela é o pai, e é ele quem
 * reserva o espaço dela no fluxo — ver o cabeçalho em `Hero.tsx`.
 *
 * ─── O QUE MUDOU DO ORIGINAL, E POR QUÊ ──────────────────────────────────────
 *
 *  1. TAILWIND 3.4, e o original é escrito para o 4. Três classes de lá não
 *     existem aqui e não geram regra NENHUMA — falham em silêncio, que é o pior
 *     modo de falhar num arquivo de estilo:
 *
 *       `duration-400`      → a escala do 3.4 é 75/100/150/200/300/500/700/1000.
 *                             Vira `duration-[400ms]`.
 *       `bg-zinc-900/6`     → a escala de opacidade anda de 5 em 5. Vira
 *                             `/[0.06]`, na forma arbitrária.
 *       `ring` / `outline`  → no 4 valem 1px sozinhos; no 3.4, `ring` é 3px e
 *                             `outline` só declara o ESTILO e deixa a largura no
 *                             `medium` do navegador. Viram `ring-1`/`outline-1`.
 *
 *  2. TOQUE NÃO ENGOLE O CLIQUE. O original dá `preventDefault()` no `touchend`
 *     do contêiner inteiro, e é isso que faz o toque alternar o painel em vez de
 *     rolar a página. Só que `preventDefault` no `touchend` cancela o `click`
 *     que o navegador sintetizaria depois — então o toque num ITEM fechava o
 *     menu e não navegava. No celular este menu é a única navegação do site, o
 *     que tornaria o defeito total. Aqui só o CABEÇALHO alterna; o toque num
 *     item passa reto e vira clique.
 *
 *  3. O PAINEL FECHADO SAI DA ORDEM DE TABULAÇÃO. `grid-rows-[0fr]` com
 *     `overflow-hidden` esconde aos olhos e não ao teclado: sem isto, quem
 *     navega com Tab atravessa dez controles invisíveis no meio do cabeçalho.
 *
 *  4. ESCOLHER FECHA. No original nada fecha o painel porque o demo dá `alert`.
 *     Aqui um item leva a pessoa a outro lugar da página, e o painel tem de sair
 *     da frente — salvo quem pede `mantemAberto`, como a troca de idioma, que
 *     precisa ser vista acontecendo.
 *
 *  5. IDENTIDADE ESTÁVEL, e esta é a correção de um defeito CARO. Ver o bloco
 *     logo abaixo.
 *
 *  6. O SINAL É UM "+", E NÃO A TECLA. O original anuncia `⌘K` numa `kbd`, o que
 *     é a coisa certa numa paleta de comandos e a errada aqui: uma tecla não diz
 *     "isto é um menu", diz "isto é para quem já sabe". Um "+" que gira para "×"
 *     é o convite que funciona igual no cursor e no dedo — e o celular, onde não
 *     há tecla nenhuma para apertar, ficava sem convite algum. O ATALHO continua
 *     ligado; o que saiu foi o anúncio dele.
 *
 *  7. O CONTEÚDO ENTRA DE BORRACHA. Uma mola com passagem do ponto, item a item,
 *     em vez do fade do original.
 */

/**
 * ─── POR QUE `id` EXISTE, SEPARADO DO TEXTO ──────────────────────────────────
 *
 * O original usa o NOME como `key` do React. Aqui isso causava um defeito que
 * parecia mágica negra: clicar numa bandeira FECHAVA o menu.
 *
 * A corrente era esta. Trocar de idioma reescreve todo rótulo do painel —
 * "Seções" vira "Sections", "Início" vira "Home". Com o texto servindo de
 * `key`, o React não vê a mesma lista noutra língua: vê uma lista NOVA. Ele
 * desmonta a antiga inteira e monta outra. O botão que estava debaixo do cursor
 * deixa de existir no meio do clique, o Chrome recalcula quem está sob o
 * ponteiro, não acha nada montado ali e dispara `mouseleave` — que é
 * exatamente o gatilho que fecha esta pílula.
 *
 * Não aparecia em teste com `element.click()`: o clique sintético não move
 * cursor, e sem cursor não há hover para perder. Só apareceu com
 * `Input.dispatchMouseEvent` de verdade, e o sintoma no navegador era
 * `elementFromPoint` devolvendo vazio logo depois do clique.
 *
 * Com `id`, a identidade não fala idioma: o React reconhece os mesmos nove
 * botões, troca só o texto dentro deles, e nada é desmontado. De quebra, o
 * painel parou de reanimar a mola inteira a cada troca de idioma.
 */
export interface ItemDeMenu {
  /** Identidade que NÃO muda com o idioma. É a `key` do React. */
  id: string;
  nome: string;
  icone?: ReactNode;
  /** Desenha o item como escolhido — para o idioma atual, por exemplo. */
  ativo?: boolean;
  /**
   * Deixa o painel aberto depois do clique.
   *
   * Para a escolha que MUDA o próprio painel: fechar na hora esconderia a
   * confirmação de que o clique valeu.
   */
  mantemAberto?: boolean;
  aoEscolher(): void;
}

export interface SecaoDeMenu {
  /** @see ItemDeMenu.id */
  id: string;
  rotulo: string;
  /** Três colunas de fichas em vez de lista. */
  grade?: boolean;
  itens: ItemDeMenu[];
}

interface CommandMenuProps {
  titulo: ReactNode;
  /** O disco à esquerda. */
  avatar?: ReactNode;
  /** A linha de baixo. Mais de uma gira, e para enquanto o painel está aberto. */
  status?: ReactNode[];
  intervaloStatus?: number;
  secoes?: SecaoDeMenu[];
  /** Fecha o painel por baixo de tudo. Costuma ser a ação principal da página. */
  acao?: ReactNode;
  /** Combinada com ⌘ no Apple e Ctrl no resto. Não é anunciada na pílula. */
  tecla?: string;
  /** Rótulo do `<nav>` para quem navega por leitor de tela. */
  rotuloNav: string;
  /** O que o leitor de tela chama o botão de abrir. */
  rotuloAbrir: string;
  /**
   * As duas larguras, como classes `max-w-*`.
   *
   * São props e não valores fixos porque esta peça não sabe onde vive: a
   * largura fechada é a que o PAI reservou no fluxo dele, e as duas têm de bater
   * exatamente ou a pílula não cabe no buraco que a espera.
   */
  larguraFechada: string;
  larguraAberta: string;
  id?: string;
}

/** Deve casar com o `duration-[400ms]` das duas transições de abertura. */
const TRANSICAO = 400;

/**
 * Abaixo disto, nada vem pré-selecionado.
 *
 * Numa tela de toque não existe "onde o cursor está", e abrir com o primeiro
 * item aceso anuncia uma escolha que ninguém fez.
 */
const SEM_CURSOR = 480;

/**
 * ─── A BORRACHA ──────────────────────────────────────────────────────────────
 *
 * `damping` baixo para a `stiffness`: é o que faz a peça PASSAR do lugar e
 * voltar, em vez de frear nele. Sem a passagem não é borracha, é só um fade
 * rápido — e o pedido era o vaivém que o resto do site já faz.
 *
 * O escalonamento é curto de propósito. Doze linhas a 30 ms somam 360 ms até a
 * última entrar, o que ainda cabe dentro dos 400 ms em que o painel abre; mais
 * do que isso e a última chega depois de o painel já estar parado, que é quando
 * a animação deixa de ser entrada e vira espera.
 *
 * Fechando, o escalonamento se inverte e encurta — sair é o movimento que
 * ninguém pediu para ver.
 */
const CONTEUDO: Variants = {
  fechado: { transition: { staggerChildren: 0.012, staggerDirection: -1 } },
  aberto: { transition: { staggerChildren: 0.03, delayChildren: 0.03 } },
};

const LINHA: Variants = {
  fechado: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } },
  aberto: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 520, damping: 17, mass: 0.7 },
  },
};

/** Sem movimento, a mesma coreografia vira aparecer e desaparecer. */
const CONTEUDO_PARADO: Variants = { fechado: {}, aberto: {} };
const LINHA_PARADA: Variants = {
  fechado: { opacity: 0, transition: { duration: 0 } },
  aberto: { opacity: 1, transition: { duration: 0 } },
};

export function CommandMenu({
  titulo,
  avatar,
  status = [],
  intervaloStatus = 4000,
  secoes = [],
  acao,
  tecla = 'k',
  rotuloNav,
  rotuloAbrir,
  larguraFechada,
  larguraAberta,
  id = 'command-menu',
}: CommandMenuProps) {
  const [ehApple, setEhApple] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [selecionado, setSelecionado] = useState(0);
  const [indiceStatus, setIndiceStatus] = useState(0);
  const emTransicao = useRef(false);
  const semMovimento = useReducedMotion();

  const itens = secoes.flatMap((secao) => secao.itens);

  /*
   * Os ouvintes de teclado leem os itens e a seleção por `ref`.
   *
   * Depender de `itens` refazia o efeito a cada renderização, e a linha dele que
   * zera a seleção então brigava com todo hover — o cursor descia um item e a
   * seleção pulava de volta para o topo.
   */
  const itensRef = useRef(itens);
  itensRef.current = itens;
  const selecionadoRef = useRef(selecionado);
  selecionadoRef.current = selecionado;

  /** Onde está o realce que desliza entre os itens, em coordenadas do painel. */
  const [realce, setRealce] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>();
  /** O primeiro realce aparece parado; os seguintes viajam. */
  const [realceViaja, setRealceViaja] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /*
   * As medidas são contra o PAINEL, que é o `offsetParent` tanto dos itens em
   * lista quanto dos da grade. É o que deixa um único elemento viajar de um
   * grupo para o outro, na diagonal, em vez de sumir e reaparecer.
   *
   * `offsetTop` e companhia são medidas de LAYOUT e não enxergam `transform`, o
   * que aqui é sorte boa: os itens chegam montados numa mola que mexe em `y` e
   * em `scale`, e mesmo assim o realce lê a posição final deles desde o
   * primeiro quadro.
   */
  useLayoutEffect(() => {
    if (!aberto || selecionado < 0) {
      setRealceViaja(false);
      return;
    }
    const elemento = itemRefs.current[selecionado];
    if (elemento == null) return;
    setRealce((anterior) => {
      setRealceViaja(anterior !== undefined);
      return {
        top: elemento.offsetTop,
        left: elemento.offsetLeft,
        width: elemento.offsetWidth,
        height: elemento.offsetHeight,
      };
    });
  }, [aberto, selecionado]);

  /*
   * DUAS armadilhas aqui, e as duas dão o mesmo sintoma discreto: um Mac que
   * não responde ao ⌘K, respondendo só ao Ctrl+K.
   *
   * A primeira é o `i` do regex, e ele NÃO é preciosismo. As duas APIs escrevem
   * o mesmo sistema com letras diferentes — `navigator.platform` responde
   * `"MacIntel"` e `userAgentData.platform` responde `"macOS"`, com m minúsculo.
   * Um `/Mac/` sensível a caixa casa com o valor antigo e falha com o novo, de
   * modo que trocar de API sem trocar o regex quebra exatamente o caso que a
   * troca queria melhorar. Medido no Chrome deste Mac: as duas strings acima,
   * lado a lado.
   *
   * A segunda é `||` em vez de `??`: `userAgentData.platform` EXISTE e responde
   * string vazia em alguns Chrome — headless, e navegador com a redução de
   * identificação ligada. Vazio não é nulo, então `??` aceitaria o vazio como
   * resposta boa e nunca consultaria a reserva.
   */
  useEffect(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    setEhApple(/mac|iphone|ipad|ipod/i.test(nav.userAgentData?.platform || navigator.platform));
  }, []);

  /* A linha de status gira, e para com o painel aberto ou a aba escondida. */
  useEffect(() => {
    if (aberto || status.length < 2) return;
    const intervalo = setInterval(() => {
      if (!document.hidden) setIndiceStatus((valor) => (valor + 1) % status.length);
    }, intervaloStatus);
    return () => clearInterval(intervalo);
  }, [aberto, status.length, intervaloStatus]);

  /*
   * O atalho alterna o painel, e a bandeira impede o hover de desfazer isso no
   * quadro seguinte: o painel cresce por baixo do cursor parado, o navegador
   * dispara `mouseenter`, e sem a trava o ⌘K que fechou reabriria sozinho.
   */
  useEffect(() => {
    let relogio: ReturnType<typeof setTimeout>;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key !== tecla || !(ehApple ? evento.metaKey : evento.ctrlKey)) return;
      evento.preventDefault();
      setAberto((valor) => !valor);
      emTransicao.current = true;
      clearTimeout(relogio);
      relogio = setTimeout(() => (emTransicao.current = false), TRANSICAO);
    }

    window.addEventListener('keydown', aoTeclar);
    return () => {
      clearTimeout(relogio);
      window.removeEventListener('keydown', aoTeclar);
    };
  }, [ehApple, tecla]);

  useEffect(() => {
    if (!aberto) return;
    setSelecionado(window.innerWidth < SEM_CURSOR ? -1 : 0);

    function aoTeclar(evento: KeyboardEvent) {
      const total = itensRef.current.length;
      if (total === 0) return;
      const mover = (passo: number) =>
        setSelecionado((valor) => (valor + passo + total) % total);

      switch (evento.key) {
        case 'ArrowUp':
        case 'k':
          evento.preventDefault();
          mover(-1);
          break;
        case 'ArrowDown':
        case 'j':
          evento.preventDefault();
          mover(1);
          break;
        case 'Enter': {
          evento.preventDefault();
          const item = itensRef.current[selecionadoRef.current];
          if (item == null) return;
          item.aoEscolher();
          if (!item.mantemAberto) setAberto(false);
          break;
        }
        case 'Escape':
          evento.preventDefault();
          setAberto(false);
          break;
      }
    }

    function aoClicar(evento: MouseEvent) {
      if (!(evento.target as HTMLElement).closest(`#${id}`)) setAberto(false);
    }

    window.addEventListener('keydown', aoTeclar);
    window.addEventListener('click', aoClicar);
    return () => {
      window.removeEventListener('keydown', aoTeclar);
      window.removeEventListener('click', aoClicar);
    };
  }, [aberto, id]);

  const conteudo = semMovimento ? CONTEUDO_PARADO : CONTEUDO;
  const linha = semMovimento ? LINHA_PARADA : LINHA;
  const estado = aberto ? 'aberto' : 'fechado';

  /** Uma linha da lista: ícone, rótulo e a seta que entra quando ela é a da vez. */
  const desenharLinha = (item: ItemDeMenu) => {
    const indice = itens.indexOf(item);
    const naVez = aberto && selecionado === indice;
    return (
      <motion.button
        key={item.id}
        variants={linha}
        ref={(no: HTMLButtonElement | null) => {
          itemRefs.current[indice] = no;
        }}
        type="button"
        data-item-menu
        tabIndex={aberto ? 0 : -1}
        onMouseEnter={() => setSelecionado(indice)}
        onClick={() => {
          item.aoEscolher();
          if (!item.mantemAberto) setAberto(false);
        }}
        className="relative z-10 flex items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm text-zinc-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
      >
        {item.icone && (
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${
              naVez ? 'bg-zinc-100/10 text-white' : 'text-zinc-500'
            }`}
          >
            {item.icone}
          </span>
        )}
        <span className={`flex-1 transition-colors duration-200 ${naVez ? 'text-white' : ''}`}>
          {item.nome}
        </span>
        {/* A seta é o que diz "isto leva a algum lugar". Ela não pisca: entra
            deslizando junto com o realce, e some do mesmo jeito. */}
        <ChevronRight
          aria-hidden
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-all duration-200 ${
            naVez ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
          }`}
        />
      </motion.button>
    );
  };

  /** Uma ficha da grade: bandeira e nome, e o preenchido é o escolhido. */
  const desenharFicha = (item: ItemDeMenu) => {
    const indice = itens.indexOf(item);
    return (
      <motion.button
        key={item.id}
        variants={linha}
        ref={(no: HTMLButtonElement | null) => {
          itemRefs.current[indice] = no;
        }}
        type="button"
        data-item-menu
        tabIndex={aberto ? 0 : -1}
        onMouseEnter={() => setSelecionado(indice)}
        onClick={() => {
          item.aoEscolher();
          if (!item.mantemAberto) setAberto(false);
        }}
        /* Preenchido, e não contornado: um contorno de 1px marcava o idioma
           atual tão discretamente que ele não se distinguia do hover. */
        className={`relative z-10 flex items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 ${
          item.ativo ? 'bg-zinc-100/[0.14] font-medium text-white' : 'text-zinc-400'
        }`}
      >
        {item.icone}
        <span className="truncate">{item.nome}</span>
      </motion.button>
    );
  };

  return (
    <nav
      id={id}
      aria-label={rotuloNav}
      onMouseEnter={() => !emTransicao.current && setAberto(true)}
      onMouseLeave={() => !emTransicao.current && setAberto(false)}
      onTouchEnd={(evento) => {
        // Só o cabeçalho alterna — ver a nota 2 no topo do arquivo.
        if ((evento.target as HTMLElement).closest('[data-item-menu],[data-acao-menu]')) return;
        evento.preventDefault();
        if (!emTransicao.current) setAberto((valor) => !valor);
      }}
      /* Cinza SÓLIDO, sem véu e sem borda, como o original do 21st.
         `pointer-events-auto` porque o contêiner que posiciona esta peça é
         atravessável de propósito: ele é mais largo que a pílula fechada, para
         ela poder crescer para a esquerda, e sem isso a área vazia dele roubaria
         o clique dos botões do cabeçalho. */
      className={`pointer-events-auto w-full rounded-[1.6rem] bg-zinc-800 text-white transition-[max-width,border-radius,box-shadow] duration-[400ms] ease-out ${
        aberto
          ? `${larguraAberta} rounded-b-[1.4rem] shadow-2xl shadow-black/60`
          : `${larguraFechada} shadow-lg shadow-black/40`
      }`}
    >
      <div className="flex items-center overflow-hidden p-1.5">
        {avatar}
        <div className="flex w-full items-center justify-between whitespace-nowrap pl-2.5 pr-1">
          <div className="flex w-full flex-col gap-px">
            <span className="text-sm font-medium leading-4 tracking-tight">{titulo}</span>
            {status.length > 0 && (
              <span className="relative w-full text-xs leading-4 text-zinc-400">
                {/* Um caractere invisível segura a altura da linha: sem ele a
                    caixa do status tem altura zero, porque o texto de verdade é
                    absoluto — e a pílula encolheria meia linha a cada troca. */}
                <span className="opacity-0" aria-hidden>
                  _
                </span>
                <span
                  key={indiceStatus}
                  className="menu-status absolute inset-0 flex items-center gap-1.5"
                >
                  {status[indiceStatus]}
                </span>
              </span>
            )}
          </div>
          {/* O "+" que vira "×". É o único convite que existe, então ele
              aparece em toda largura — no celular a tecla não fazia sentido e
              a pílula acabava sem nada que dissesse "abre". */}
          <span
            aria-hidden
            className={`ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100/[0.08] text-zinc-300 transition-[transform,background-color] duration-[400ms] ease-out ${
              aberto ? 'rotate-[135deg] bg-zinc-100/[0.14] text-white' : ''
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {/* O nome do controle para quem não vê o "+". A pílula inteira reage a
              hover e a toque, mas nada disso é anunciável — isto é. */}
          <span className="sr-only">{rotuloAbrir}</span>
        </div>
      </div>

      <div
        aria-hidden={!aberto}
        className={`grid transition-all duration-[400ms] ease-out ${
          aberto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <motion.div
            variants={conteudo}
            initial={false}
            animate={estado}
            className="relative flex flex-col gap-1 px-1.5 pb-1.5"
          >
            {/* Um realce para o painel inteiro: ele desliza entre os itens da
                lista e entra na grade de idiomas na diagonal. */}
            {realce && (
              <div
                aria-hidden
                style={{
                  transform: `translate3d(${realce.left}px, ${realce.top}px, 0)`,
                  width: realce.width,
                  height: realce.height,
                }}
                className={`pointer-events-none absolute left-0 top-0 rounded-xl bg-zinc-100/[0.07] ${
                  realceViaja
                    ? 'transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'
                    : 'transition-opacity duration-150'
                } ${aberto && selecionado >= 0 ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            {/* `Fragment` e não uma `div`: os filhos precisam ser filhos DIRETOS
                do contêiner com `variants`, tanto para o escalonamento da mola
                quanto para o `flex` que os empilha. Um `div` no meio quebraria
                as duas coisas de uma vez. */}
            {secoes.map((secao) => (
              <Fragment key={secao.id}>
                {/* Micro-rótulo em caixa alta, não um título. Ele existe para
                    separar dois grupos e sair da frente — a serifa grande que
                    esteve aqui competia com os próprios itens que anunciava. */}
                <motion.span
                  variants={linha}
                  className="px-2.5 pb-0.5 pt-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                >
                  {secao.rotulo}
                </motion.span>
                {secao.grade ? (
                  <motion.div className="grid grid-cols-3 gap-1">
                    {secao.itens.map(desenharFicha)}
                  </motion.div>
                ) : (
                  secao.itens.map(desenharLinha)
                )}
              </Fragment>
            ))}
            {acao && (
              <motion.div variants={linha} className="pt-2">
                {acao}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
