import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * ─── A PÍLULA QUE VIRA PAINEL ────────────────────────────────────────────────
 *
 * Uma cápsula que carrega título, uma linha de status que gira, e um painel que
 * desce no hover, no toque ou no ⌘K. Adaptada da `command-menu` do 21st.dev.
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
 *     navega com Tab atravessa nove botões invisíveis no meio do cabeçalho.
 *
 *  4. ESCOLHER FECHA. No original nada fecha o painel porque o demo dá `alert`.
 *     Aqui um item leva a pessoa a outro lugar da página, e o painel tem de sair
 *     da frente — salvo quem pede `mantemAberto`, como a troca de idioma, que
 *     precisa ser vista acontecendo.
 */

export interface ItemDeMenu {
  nome: string;
  icone?: ReactNode;
  /** Desenha um contorno — para o que já está escolhido, como o idioma atual. */
  ativo?: boolean;
  /** Centra o rótulo. É o que as seções em grade usam. */
  centrado?: boolean;
  /**
   * Deixa o painel aberto depois do clique.
   *
   * Para a escolha que MUDA o próprio painel: fechar na hora esconderia o
   * contorno mudando de lugar, que é a única confirmação de que o clique valeu.
   */
  mantemAberto?: boolean;
  aoEscolher(): void;
}

export interface SecaoDeMenu {
  rotulo: string;
  /** Três colunas em vez de lista. */
  grade?: boolean;
  itens: ItemDeMenu[];
}

interface CommandMenuProps {
  titulo: ReactNode;
  /** O quadrado à esquerda. */
  avatar?: ReactNode;
  /** Giram um de cada vez, e param enquanto o painel está aberto. */
  status?: ReactNode[];
  intervaloStatus?: number;
  secoes?: SecaoDeMenu[];
  /** Combinada com ⌘ no Apple e Ctrl no resto. */
  tecla?: string;
  /** Rótulo do `<nav>` para quem navega por leitor de tela. */
  rotuloNav: string;
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

export function CommandMenu({
  titulo,
  avatar,
  status = [],
  intervaloStatus = 4000,
  secoes = [],
  tecla = 'k',
  rotuloNav,
  larguraFechada,
  larguraAberta,
  id = 'command-menu',
}: CommandMenuProps) {
  const [ehApple, setEhApple] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [selecionado, setSelecionado] = useState(0);
  const [indiceStatus, setIndiceStatus] = useState(0);
  const emTransicao = useRef(false);

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
   * `userAgentData.platform` primeiro: `navigator.platform` está depreciado e
   * congelado — num Mac com Apple Silicon ele ainda responde `MacIntel`, e há
   * navegador que o mente de propósito. O antigo fica de reserva porque o novo
   * não existe no Safari nem no Firefox, que é justamente metade do Mac.
   *
   * DUAS armadilhas aqui, e as duas dão o mesmo sintoma discreto: um Mac lendo
   * "Ctrl K" na pílula.
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

  return (
    <nav
      id={id}
      aria-label={rotuloNav}
      onMouseEnter={() => !emTransicao.current && setAberto(true)}
      onMouseLeave={() => !emTransicao.current && setAberto(false)}
      onTouchEnd={(evento) => {
        // Só o cabeçalho alterna — ver a nota 2 no topo do arquivo.
        if ((evento.target as HTMLElement).closest('[data-item-menu]')) return;
        evento.preventDefault();
        if (!emTransicao.current) setAberto((valor) => !valor);
      }}
      /* `pointer-events-auto` porque o contêiner que posiciona esta peça é
         atravessável de propósito: ele é mais largo que a pílula fechada, para
         ela poder crescer para a esquerda, e sem isso a área vazia dele roubaria
         o clique dos botões do cabeçalho. */
      className={`pointer-events-auto w-full rounded-[1.35rem] bg-doxa-surface/80 text-white ring-1 ring-white/[0.11] backdrop-blur-xl transition-[max-width,border-radius,box-shadow] duration-[400ms] ease-out ${
        aberto
          ? `${larguraAberta} rounded-b-2xl shadow-2xl shadow-black/60`
          : `${larguraFechada} shadow-lg shadow-black/40`
      }`}
    >
      <div className="flex items-center overflow-hidden p-1.5">
        {avatar}
        <div className="flex w-full items-center justify-between whitespace-nowrap pl-2 pr-1.5">
          <div className="flex w-full flex-col">
            <span className="text-sm font-medium leading-5">{titulo}</span>
            {status.length > 0 && (
              <span className="relative w-full text-xs leading-4 text-white/50">
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
          {/* Escondida no celular: não há ⌘ nem Ctrl para apertar num telefone,
              e a tecla anunciada seria uma promessa sem teclado. */}
          <kbd className="ml-auto hidden items-center gap-0.5 rounded-md bg-white/[0.08] p-1 font-sans text-xs text-white/50 md:flex">
            <span className={ehApple ? 'text-sm leading-none' : 'leading-none'}>
              {ehApple ? '⌘' : 'Ctrl'}
            </span>
            {tecla.toUpperCase()}
          </kbd>
        </div>
      </div>

      <div
        aria-hidden={!aberto}
        className={`grid transition-all duration-[400ms] ease-out ${
          aberto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="relative flex flex-col gap-1.5 p-1.5 pt-0">
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
                className={`pointer-events-none absolute left-0 top-0 rounded-lg bg-white/[0.08] ${
                  realceViaja
                    ? 'transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'
                    : 'transition-opacity duration-150'
                } ${aberto && selecionado >= 0 ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            {secoes.map((secao) => (
              <div key={secao.rotulo} className="contents">
                <hr className="-mx-1.5 border-white/[0.08]" />
                <span className="pl-2 pt-1 text-xs text-white/40">{secao.rotulo}</span>
                <div className={secao.grade ? 'grid grid-cols-3 gap-1.5' : 'contents'}>
                  {secao.itens.map((item) => {
                    const indice = itens.indexOf(item);
                    return (
                      <button
                        key={item.nome}
                        ref={(no) => {
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
                        className={`relative z-10 flex items-center gap-2 rounded-lg p-2 text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                          item.centrado ? 'justify-center' : ''
                        } ${item.ativo ? 'text-white outline outline-1 outline-white/20' : ''}`}
                      >
                        {item.icone}
                        {item.nome}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
