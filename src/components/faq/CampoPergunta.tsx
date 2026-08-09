import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { ExemploVivo } from './ExemploVivo';
import { CORES } from './cores';

/**
 * As cores do campo aceso, entregues ao CSS.
 *
 * A primeira volta no fim: um `conic-gradient` não fecha sozinho, e sem repetir
 * a cor inicial haveria uma emenda dura entre o último e o primeiro tom —
 * girando, ela apareceria como uma costura dando voltas na borda.
 */
const ACESO: CSSProperties = {
  ['--anel-siri-cores' as string]: [...CORES, CORES[0]].join(', '),
};

/**
 * A MOLA — a curva que passa do alvo e volta.
 *
 * É a única coisa que faz um objeto que muda de tamanho parecer ter massa. Uma
 * curva que só desacelera (`ease-out`) entrega o mesmo tamanho final e lê como
 * um valor sendo escrito; esta ultrapassa em ~7% e assenta, que é o que o olho
 * reconhece como algo que se ABRIU. Vale para o campo, para os atalhos e para
 * qualquer coisa desta seção que mude de forma.
 */
export const MOLA = [0.175, 0.885, 0.32, 1.275] as const;
const MOLA_CSS = `cubic-bezier(${MOLA.join(',')})`;

/**
 * Dois regimes para a mesma caixa, e a diferença importa.
 *
 * `MORFO` é abrir e fechar: o gesto tem começo e fim, e a mola cabe. `CRESCE` é
 * a caixa acompanhando o que está sendo digitado — aqui a mola seria um erro,
 * porque cada tecla que quebra linha daria um solavanco no que a pessoa está
 * lendo. Cresce reto e rápido, e some.
 */
const MORFO = `height 400ms ${MOLA_CSS}`;
const CRESCE = 'height 150ms ease-out';

/**
 * A altura do campo fechado — a pastilha.
 *
 * Cinquenta e oito, e os dez a mais são pedido do dono. Ela vale em dois
 * lugares e nos dois é a mesma coisa: a altura da caixa enquanto fechada, e a
 * altura da linha que centra a pergunta de exemplo dentro dela. Aberta, quem
 * manda na altura é o texto (`alturaTexto + ACOES`) — esta constante sai de
 * cena, e é por isso que crescer aqui não mexe no campo em uso.
 */
const FECHADO = 58;

/**
 * O respiro entre o botão e a borda da caixa.
 *
 * É o único número que decide o tamanho do botão, e é de propósito: o botão
 * mede a altura do campo MENOS dois respiros, calculado e não escrito. Foi
 * exatamente essa a falha que o dono viu — `FECHADO` subiu de 48 para 58 e o
 * botão continuou com os 36px que fechavam a conta antiga, sobrando dez pixels
 * de nada embaixo dele. Derivado, ele não tem como ficar para trás de novo.
 */
const RESPIRO = 6;

/**
 * O raio da casca, em número — é o `rounded-3xl` das classes lá embaixo.
 *
 * Escrito aqui porque o botão precisa DELE para acompanhar a borda, e não por
 * gosto de constante: os dois mudam juntos, e a linha existe para dizer isso.
 */
const RAIO = 24;
/** A altura da área de texto: onde ela começa e onde para de crescer. */
const MINIMA = 68;
const MAXIMA = 160;
/** A faixa que a ação ocupa embaixo do texto. */
const ACOES = 48;

/** Quanto a barra leva varrendo o campo, em segundos. */
export const CARGA = 0.5;
/** A espessura da barra, em pixels. */
const ESPESSURA = 3;

/** Milissegundos por letra escrita, por letra apagada, e a pausa na frase pronta. */
const ESCREVE = 42;
const APAGA = 22;
const LE = 1900;

/**
 * A pausa entre apagar a última letra e começar a próxima frase.
 *
 * Ela existe pela BORRACHA. As letras apagadas continuam no fluxo enquanto
 * somem (é o que faz o cursor passar por cima delas em vez de o texto encolher),
 * e sem esta pausa a frase nova começava a ser escrita por cima das que ainda
 * estavam saindo — as duas se intercalavam e o texto dançava na virada.
 *
 * Um fio mais longa que a saída de `ExemploVivo` (160ms), que é o tempo exato
 * de a última letra desaparecer. E o efeito colateral é bem-vindo: uma
 * respiração entre uma pergunta e a seguinte, que antes não existia.
 */
const RESPIRA = 200;

interface CampoPerguntaProps {
  valor: string;
  /** As frases que o campo escreve sozinho enquanto está fechado. */
  exemplos: readonly string[];
  /** Se a pergunta acabou de ser enviada e o campo está lendo — dura `CARGA`. */
  carregando: boolean;
  /**
   * Os atalhos, no andar de baixo da mesma caixa.
   *
   * Entram por `prop` e não são montados aqui dentro porque quem sabe quais
   * ainda não foram usadas é a seção — este componente só sabe que existe um
   * segundo andar e como ele se solda ao primeiro.
   */
  bandeja?: ReactNode;
  aoDigitar: (valor: string) => void;
  aoEnviar: () => void;
  /** O campo abriu — a seção usa isto para se partir em duas. */
  aoAbrir: () => void;
  /** O campo fechou SEM perguntar nada. */
  aoDesistir: () => void;
}

/**
 * O exemplo que se escreve sozinho, uma pergunta depois da outra.
 *
 * Um placeholder parado é uma instrução; um que escreve é uma demonstração. E
 * ele resolve um problema real desta seção: as respostas existem para seis
 * perguntas e mais nada, e ninguém adivinha quais são olhando para uma caixa
 * vazia. Ciclando as perguntas de verdade, o campo passa o tempo inteiro
 * ensinando o que ele sabe responder — que é a diferença entre um campo que
 * parece inteligente e um que parece quebrado.
 *
 * Apaga mais rápido do que escreve, e é assim de propósito: apagar é a parte
 * chata; ninguém precisa vê-la no mesmo ritmo em que leu a frase.
 *
 * Para de vez quando o campo ABRE. Antes ele parava quando alguém digitava, o
 * que era a mesma ideia com o gatilho pior: abrir é o instante em que a pessoa
 * declarou que vai escrever, e é aí que o texto de exemplo deixa de ser
 * demonstração e vira uma coisa se mexendo atrás do cursor.
 */
function useExemploVivo(frases: readonly string[], ativo: boolean) {
  const [indice, setIndice] = useState(0);
  const [escrito, setEscrito] = useState('');
  const [apagando, setApagando] = useState(false);

  useEffect(() => {
    if (!ativo || frases.length === 0) return;
    const frase = frases[indice % frases.length] ?? '';

    if (!apagando && escrito.length < frase.length) {
      const id = window.setTimeout(() => setEscrito(frase.slice(0, escrito.length + 1)), ESCREVE);
      return () => window.clearTimeout(id);
    }
    if (!apagando) {
      const id = window.setTimeout(() => setApagando(true), LE);
      return () => window.clearTimeout(id);
    }
    if (escrito.length > 0) {
      // De dois em dois: apagar letra a letra na mesma cadência de escrever
      // dobra o tempo do ciclo sem acrescentar nada para ler.
      const id = window.setTimeout(() => setEscrito(escrito.slice(0, -2)), APAGA);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setApagando(false);
      setIndice((i) => i + 1);
    }, RESPIRA);
    return () => window.clearTimeout(id);
  }, [ativo, frases, indice, escrito, apagando]);

  return escrito;
}

/**
 * O campo da pergunta: uma pastilha que vira caixa.
 *
 * ─── POR QUE ELE FECHA ───────────────────────────────────────────────────────
 *
 * Antes era uma caixa grande e permanente. Uma caixa grande e vazia num fundo
 * preto pede para ser preenchida e não diz o que aceita; a pastilha pede um
 * CLIQUE, que é um compromisso muito menor, e é ela que carrega o exemplo se
 * escrevendo sozinho. Quem clica já decidiu escrever — e é nesse instante, e
 * não antes, que a caixa de escrever precisa existir.
 *
 * O gesto de enviar é o mesmo de trás para frente: a caixa se fecha de volta na
 * pastilha. Isso substituiu a animação antiga em que o texto enviado subia
 * desfocando — duas partidas ao mesmo tempo eram uma a mais, e o fechamento já
 * conta a mesma história com o objeto inteiro em vez de com uma cópia do texto.
 *
 * ─── DOIS ANDARES, UMA CAIXA ────────────────────────────────────────────────
 *
 * Em cima escreve-se; embaixo, a gaveta com os atalhos, dentro da MESMA borda e
 * separada só por uma costura. Os dois eram objetos distintos e o dono viu o
 * defeito: uma fileira de botões morando perto de um campo não diz que ela é a
 * outra maneira de fazer a mesma coisa. Soldados, dizem.
 *
 * E a gaveta só existe DEPOIS do clique — ela sai de trás do andar de cima
 * quando a caixa abre. É o que devolve à seção parada a pastilha limpa de 48
 * pixels, e é o que dá ao clique uma terceira consequência: a página se parte,
 * a direita se anuncia, e os assuntos saem de dentro da caixa. Três coisas
 * acontecendo por um gesto só, que é o oposto de uma caixa inchando sozinha.
 *
 * ─── O QUE MUDA DE TAMANHO, E COMO ──────────────────────────────────────────
 *
 * Só a ALTURA, e só a do andar de cima. Largura não muda mais: a caixa tem a
 * largura da coluna, que é a mesma dos atalhos — pedido do dono, e ele estava
 * certo, porque duas larguras diferentes empilhadas leem como dois objetos
 * mesmo depois de soldados. A bandeja tem a altura do que carrega e cresce
 * sozinha; a caixa inteira é a soma dos dois.
 *
 * Quem justifica o crescimento é a SEÇÃO: abrir o campo parte a página em duas
 * e a coluna da direita se anuncia. Sem isso, uma caixa que incha sozinha é
 * movimento sem consequência — foi exatamente essa a leitura do dono.
 *
 * A altura é escrita no elemento a cada tecla, e é assim porque não existe
 * `height: auto` que sirva: `scrollHeight` só diz a altura do conteúdo quando a
 * caixa está MENOR do que ele. O truque de medir com `transition: none` e
 * devolver a altura antes de soltar é o que impede a medição de virar uma
 * animação de zero até o tamanho certo, visível a cada letra.
 *
 * Enter envia, Shift+Enter quebra linha. É a convenção de todo campo de conversa
 * e não precisa de legenda; o que precisaria de legenda é o contrário.
 */
export function CampoPergunta({
  valor,
  exemplos,
  carregando,
  bandeja,
  aoDigitar,
  aoEnviar,
  aoAbrir,
  aoDesistir,
}: CampoPerguntaProps) {
  const parado = useReducedMotion() === true;
  const campoRef = useRef<HTMLTextAreaElement>(null);
  const cascaRef = useRef<HTMLDivElement>(null);
  const veuAltoRef = useRef<HTMLDivElement>(null);
  const veuBaixoRef = useRef<HTMLDivElement>(null);

  const gavetaRef = useRef<HTMLDivElement>(null);
  const bandejaRef = useRef<HTMLDivElement>(null);

  const [aberto, setAberto] = useState(false);
  /** Se a mudança de altura é a caixa crescendo com o texto, e não abrindo. */
  const [crescendo, setCrescendo] = useState(false);
  const [alturaTexto, setAlturaTexto] = useState(MINIMA);
  const [alturaBandeja, setAlturaBandeja] = useState(0);
  const [rolando, setRolando] = useState(false);

  const vazio = valor.trim().length === 0;
  const exemplo = useExemploVivo(exemplos, !aberto && !parado);

  /*
   * Os véus de cima e de baixo: o texto se apagando nas duas pontas quando há
   * mais do que cabe. Sem eles, uma frase cortada ao meio pela borda lê como
   * defeito de layout; apagando, lê como texto continuando fora da vista. As
   * opacidades são escritas direto no nó, e não em estado: elas mudam a cada
   * quadro de rolagem, e um `setState` por quadro repinta a seção inteira para
   * mexer em dois números.
   */
  const ajustarVeus = useCallback(() => {
    const campo = campoRef.current;
    if (campo == null) return;
    const { scrollTop, scrollHeight, clientHeight } = campo;
    if (veuAltoRef.current != null) {
      veuAltoRef.current.style.opacity = String(Math.min(scrollTop / 20, 1));
    }
    if (veuBaixoRef.current != null) {
      const abaixo = scrollHeight - clientHeight - scrollTop;
      veuBaixoRef.current.style.opacity = String(Math.min(Math.max(abaixo - 16, 0) / 10, 1));
    }
  }, []);

  const medir = useCallback(() => {
    const campo = campoRef.current;
    if (campo == null) return;
    /* Medir sem que a medição vire animação: a altura só é legível em
       `scrollHeight` com a caixa encolhida, e encolher com `transition` ligada
       desenharia esse encolhimento na tela. Desliga, mede, devolve, força o
       reflow com `offsetHeight` e só então religa. */
    const anterior = campo.style.height;
    campo.style.transition = 'none';
    campo.style.height = '0px';
    const natural = campo.scrollHeight;
    campo.style.height = anterior;
    void campo.offsetHeight;
    campo.style.transition = '';

    const nova = Math.max(MINIMA, Math.min(natural, MAXIMA));
    campo.style.height = `${nova}px`;
    setAlturaTexto(nova);
    setRolando(natural > MAXIMA);
  }, []);

  // No layout e não em `useEffect`: a altura tem de estar certa no quadro em que
  // a letra aparece. Um quadro atrás, o campo dá um salto visível a cada linha.
  useLayoutEffect(medir, [valor, aberto, medir]);
  useEffect(() => {
    const id = window.setTimeout(ajustarVeus, 0);
    return () => window.clearTimeout(id);
  }, [alturaTexto, ajustarVeus]);

  // A largura muda a quebra de linha, e a quebra muda a altura. Sem isto, girar
  // o telefone deixa a caixa com a altura do retrato e o texto por baixo dela.
  useEffect(() => {
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir]);

  // A altura da gaveta é a do que ela carrega, medida e não adivinhada: os
  // atalhos somem conforme são usados e se reembrulham quando a coluna muda de
  // largura — os dois acontecem sem que ninguém redimensione a janela.
  useLayoutEffect(() => {
    const conteudo = bandejaRef.current;
    if (conteudo == null) return;
    const olho = new ResizeObserver(() => setAlturaBandeja(conteudo.offsetHeight));
    olho.observe(conteudo);
    setAlturaBandeja(conteudo.offsetHeight);
    return () => olho.disconnect();
  }, [bandeja]);

  /* Fechada, a gaveta é `inert`: recortada por `overflow-hidden`, ela some da
     vista mas os atalhos continuariam FOCÁVEIS — quem navega por teclado
     tabularia para dentro de botões invisíveis. `inert` os tira da ordem de
     foco e do leitor de tela sem desmontá-los, que é o que permite a gaveta ter
     altura para medir e uma saída para animar. */
  useEffect(() => {
    const gaveta = gavetaRef.current;
    if (gaveta == null) return;
    if (aberto) gaveta.removeAttribute('inert');
    else gaveta.setAttribute('inert', '');
  }, [aberto, bandeja]);

  /* Aberto, o cursor vai para o texto — mas um quadro depois. Focar no mesmo
     quadro em que a caixa começa a crescer faz o navegador rolar a página até
     um elemento que ainda tem a altura antiga, e a seção dá um pulo. */
  useEffect(() => {
    if (!aberto) return;
    const id = window.setTimeout(() => {
      const campo = campoRef.current;
      if (campo == null) return;
      campo.focus();
      campo.setSelectionRange(campo.value.length, campo.value.length);
    }, 50);
    return () => window.clearTimeout(id);
  }, [aberto]);

  const abrir = () => {
    if (aberto) return;
    setCrescendo(false);
    setAberto(true);
    aoAbrir();
  };

  const enviar = () => {
    if (vazio) return;
    setCrescendo(false);
    setAberto(false);
    /* NÃO avisa que fechou. Quem enviou não desistiu: a seção precisa continuar
       partida para receber a resposta que está a caminho, e um aviso de
       fechamento aqui a devolveria à coluna única no exato instante em que a
       pergunta foi feita. */
    aoEnviar();
  };

  const desistir = () => {
    // Volta para a mola antes de fechar: quem digitou e apagou tudo deixou o
    // campo em regime de CRESCE, e fechar naquele regime devolveria a pastilha
    // em 150ms retos — o mesmo gesto de abrir, contado com outra física.
    setCrescendo(false);
    setAberto(false);
    aoDesistir();
  };

  /* Fechar ao perder o foco, e só se não houver nada escrito. `relatedTarget`
     dentro da própria casca não conta: clicar no botão de enviar (ou num
     atalho, que agora mora no andar de baixo da mesma caixa) tira o foco do
     texto, e uma caixa que se fecha no meio do clique é uma caixa que engole a
     pergunta. */
  const aoSair = (evento: React.FocusEvent<HTMLDivElement>) => {
    if (cascaRef.current?.contains(evento.relatedTarget as Node | null) === true) return;
    if (vazio) desistir();
  };

  const transicao = parado ? 'none' : crescendo ? CRESCE : MORFO;

  return (
    <div
      ref={cascaRef}
      onBlur={aoSair}
      style={ACESO}
      /* A ISCA só existe FECHADO. Aberto, a pessoa já está com o cursor dentro
         da caixa e o anel está aceso de verdade pelo `focus-within` — um pulso
         por baixo dele seria a borda piscando durante a digitação. É o mesmo
         raciocínio do exemplo que se escreve sozinho e para no clique: o
         convite serve até o instante em que ele é aceito. */
      className={`anel-siri relative w-full rounded-3xl border border-white/[0.12] bg-doxa-surface focus-within:border-white/30 ${
        aberto ? '' : 'anel-siri-isca'
      }`}
    >
      {/* A luz da Siri: não uma borda colorida, mas uma faixa BORRADA de cor
          encostada na borda por dentro, e o halo dela atravessando para fora.
          Duas voltas em sentidos contrários, só sob a mão ou sob o cursor de
          texto (`.anel-siri`, no index.css).

          Ela rima a CAIXA INTEIRA, os dois andares, e não só o campo de cima —
          é o que prova que a bandeja não é um vizinho: a mesma luz que corre
          pela borda de um corre pela do outro, porque é uma borda só. */}
      <div className="anel-luz" aria-hidden>
        <span className="luz-halo" />
        <span className="luz-borda" />
      </div>

      <div className="dot-grid pointer-events-none absolute inset-0 rounded-3xl opacity-25" />

      {/* ─── O ANDAR DE CIMA: onde se escreve ──────────────────────────────
          O clique em qualquer parte dele cai no texto: um campo de conversa que
          só aceita clique nos poucos pixels da primeira linha é um campo que
          parece quebrado. É este andar que muda de altura — a bandeja embaixo
          tem a altura do que ela carrega, e cresce sozinha. */}
      <div
        onMouseDown={(evento) => {
          if (!aberto || evento.target === campoRef.current) return;
          evento.preventDefault();
          campoRef.current?.focus();
        }}
        style={{ height: aberto ? alturaTexto + ACOES : FECHADO, transition: transicao }}
        className="relative w-full"
      >
        {/* A BARRA DE CARGA: o campo lendo a pergunta que acabou de receber.

            É o único sinal que sobrou, e por decisão do dono: existia também um
            risco atravessando o vão até a coluna das respostas, e ele lia como
            um traço jogado na tela — longe do campo, sem nada o ligando ao
            objeto que recebeu a pergunta. Dentro da caixa, o sinal tem dono.

            Ele corre na base do andar de escrever. Com a gaveta aberta, essa
            base é a costura entre os dois andares, e o que se vê é uma linha que
            JÁ EXISTE acendendo da esquerda para a direita — mais barato de ler
            do que um objeto novo aparecendo. Fechada, é a própria borda de baixo
            da caixa que acende.

            `scaleX` e não `width`: largura é layout, e animar layout obriga o
            navegador a refazer a página a cada quadro. Escala sobe para o
            compositor. O gradiente é o que dá FRENTE à barra — como ele escala
            junto, a ponta continua acesa em qualquer instante da corrida, e o
            que se vê é luz avançando, não bloco crescendo. */}
        <AnimatePresence>
          {carregando && (
            <motion.div
              key="carga"
              aria-hidden
              /* O recorte só arredonda embaixo quando a gaveta está FECHADA:
                 aí a base do campo é a base da caixa, e a barra tem de morrer
                 na curva. Com a gaveta aberta, aquela borda é a costura entre
                 os andares — reta —, e arredondar ali cortaria a barra onde não
                 há canto nenhum. */
              className={`pointer-events-none absolute inset-0 overflow-hidden ${
                aberto && bandeja != null ? '' : 'rounded-b-3xl'
              }`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.16 } }}
            >
              <motion.span
                className="absolute bottom-0 left-0 w-full origin-left rounded-full"
                style={{
                  height: ESPESSURA,
                  background:
                    'linear-gradient(to right, rgba(244,241,232,0), rgba(244,241,232,0.35) 55%, #F4F1E8)',
                  boxShadow: '0 0 14px 3px rgba(244,241,232,0.4)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                /* `linear`, que é a regra do site para sinal: um pulso que
                   acelera e freia lê como objeto sendo arrastado. */
                transition={{ duration: CARGA, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* O texto. Absoluto e sempre montado: desmontá-lo ao fechar perderia o
            que estava escrito e o cursor junto, e o que se quer é que ele
            APAREÇA — some em opacidade e escala, e a caixa por cima o recorta.

            `resize-none` porque a alça do navegador briga com a altura que este
            componente escreve: puxar a alça e digitar devolvia a caixa ao
            tamanho calculado, o que lê como o campo desobedecendo. */}
        <textarea
          ref={campoRef}
          value={valor}
          onChange={(evento) => {
            setCrescendo(true);
            aoDigitar(evento.target.value);
          }}
          onScroll={ajustarVeus}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter' && !evento.shiftKey) {
              evento.preventDefault();
              enviar();
            }
            if (evento.key === 'Escape' && vazio) desistir();
          }}
          rows={1}
          placeholder="Escreva a sua pergunta…"
          aria-label="Escreva a sua pergunta"
          aria-hidden={!aberto}
          tabIndex={aberto ? undefined : -1}
          style={{
            transition: parado
              ? 'none'
              : crescendo
                ? 'height 150ms ease-out'
                : `opacity 300ms ease-out, transform 300ms ease-out, height 400ms ${MOLA_CSS}`,
          }}
          className={`absolute inset-x-0 top-0 z-[1] block w-full resize-none bg-transparent px-5 py-4 pr-14 text-[15px] leading-relaxed text-[#F4F1E8] outline-none placeholder:text-white/30 ${
            rolando ? 'overflow-y-auto' : 'overflow-y-hidden'
          } ${aberto ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-1 scale-95 opacity-0'}`}
        />

        {/* Os véus. Só existem abertos: fechados, seriam duas faixas escuras por
            cima de uma pastilha de 48 pixels. */}
        {aberto && (
          <>
            <div
              ref={veuAltoRef}
              aria-hidden
              className="pointer-events-none absolute left-5 right-14 top-0 z-[2] h-8 rounded-t-3xl bg-gradient-to-b from-doxa-surface via-doxa-surface/90 to-transparent"
              style={{ opacity: 0 }}
            />
            <div
              ref={veuBaixoRef}
              aria-hidden
              className="pointer-events-none absolute left-5 right-14 z-[2] h-8 bg-gradient-to-t from-doxa-surface via-doxa-surface/90 to-transparent"
              style={{ opacity: 0, top: alturaTexto - 32, transition: transicao }}
            />
          </>
        )}

        {/* A pastilha fechada: o exemplo que se escreve sozinho, e ele é o botão
            de abrir. Um `button` de verdade, e não um texto com `onClick`, para
            que teclado e leitor de tela cheguem no campo pelo mesmo caminho que
            a mão. */}
        <button
          type="button"
          onClick={abrir}
          aria-label="Escrever uma pergunta"
          aria-hidden={aberto}
          tabIndex={aberto ? -1 : undefined}
          style={{ transition: parado ? 'none' : `opacity 300ms ease-out, transform 300ms ${MOLA_CSS}` }}
          /* EM SERIFA, a pedido do dono, e um corpo acima dos 15px que tinha:
             é a fonte dos títulos e a do campo do formulário, e a 15 pixels ela
             fica apertada demais para o desenho da letra aparecer — que é a
             única razão de trocar a fonte de um placeholder. */
          className={`absolute inset-x-0 top-0 z-[1] cursor-text overflow-hidden px-5 pr-14 text-left font-serif text-[17px] leading-none text-white/40 outline-none md:text-[19px] ${
            aberto
              ? 'pointer-events-none translate-y-1 scale-105 opacity-0'
              : 'translate-y-0 scale-100 opacity-100'
          }`}
        >
          {/* A altura da pastilha inteira, para o texto sentar no meio dela sem
              depender de um `padding` que teria de ser recalculado à mão se a
              pastilha mudar de corpo. */}
          <span className="flex items-center" style={{ height: FECHADO }}>
            {parado ? (
              <span className="truncate">{exemplos[0]}</span>
            ) : (
              <ExemploVivo texto={exemplo} />
            )}
          </span>
        </button>

        {/* O botão de enviar, branco desde o primeiro olhar.

            Numa seção onde o campo escreve sozinho e nada mais pede clique, o
            único jeito de descobrir que dá para PERGUNTAR é enxergando o botão;
            um contorno apagado no canto de uma caixa preta não é visto. Sólido o
            tempo inteiro, ele é o convite.

            Clicável mesmo vazio: desabilitar um botão sem dizer por quê deixa a
            pessoa clicando num objeto morto. Fechado ele ABRE a caixa, aberto
            ele envia — a mesma seta, porque em ambos os casos ela leva a
            pergunta adiante.

            Preso no TOPO e não no rodapé do andar. Ancorado embaixo, ele descia
            junto com a caixa que cresce, e um botão que muda de lugar enquanto
            a pessoa digita é um alvo que se mexe. Em cima ele fica no mesmo
            pixel da pastilha fechada até a caixa cheia — e é lá que a primeira
            linha do texto está, que é o lugar de onde se envia. */}
        <button
          type="button"
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={aberto ? enviar : abrir}
          aria-label={aberto ? 'Enviar a pergunta' : 'Escrever uma pergunta'}
          className="absolute z-[10] flex items-center justify-center bg-[#F4F1E8] text-[#0B0B0B] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none motion-reduce:hover:scale-100"
          /* Tamanho, posição e RAIO calculados da caixa, a pedido do dono. Em
             classe do Tailwind isto seria `h-9 w-9 top-1.5 rounded-full`,
             números que precisam ser reconferidos toda vez que o campo muda —
             e foi por não terem sido que o botão ficou pequeno no meio de uma
             caixa alta.

             ─── O RAIO É CONCÊNTRICO, e é isso que faz ele ACOMPANHAR ───────

             Deixou de ser círculo: `RAIO - RESPIRO`, que é a regra de dois
             cantos encaixados. Um canto interno afastado do externo por uma
             distância `d` só corre paralelo a ele se o raio dele for o de fora
             MENOS `d` — 24 menos 6 dão 18. Com qualquer outro número as duas
             curvas divergem no meio do arco, e o vão entre elas engorda ou
             afina; é o que fazia o círculo parecer um objeto sobreposto à caixa
             em vez de uma peça encaixada nela.

             Uniforme nos quatro cantos, e não só no de cima: aberto, a caixa
             cresce e o botão fica no topo, longe do canto de baixo. Um raio
             menor embaixo só apareceria nesse estado, e como uma assimetria sem
             causa visível. */
          style={{
            transitionTimingFunction: MOLA_CSS,
            top: RESPIRO,
            right: RESPIRO,
            height: FECHADO - RESPIRO * 2,
            width: FECHADO - RESPIRO * 2,
            borderRadius: RAIO - RESPIRO,
          }}
        >
          {/* A seta cresce junto: 16px dentro de um disco de 36 ocupavam 44% da
              largura dele, e os mesmos 16 num disco de 46 cairiam para 35% — a
              mesma seta, opticamente mais fraca. */}
          <ArrowUp className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>

      {/* ─── O ANDAR DE BAIXO: a bandeja dos atalhos ────────────────────────
       *
       * Soltos embaixo, os atalhos liam como uma fileira de botões que por
       * acaso morava perto do campo — o dono viu isso e a palavra que ele usou
       * foi "desconectados". Dentro da mesma borda, com uma linha separando os
       * dois andares, eles passam a ser o que sempre foram: a outra maneira de
       * fazer a mesma coisa que o campo faz. Quem não quer formular a pergunta
       * toca no assunto; quem quer, escreve em cima. Uma caixa, duas portas.
       *
       * Sem fundo próprio: o que se vê é o `bg-doxa-surface` da caixa inteira
       * atravessando os dois andares. Um fundo aqui, por mais sutil que fosse,
       * desenharia de volta a fronteira que este bloco existe para apagar.
       *
       * `border-t` e não uma `<hr>`: a linha é a costura entre os andares, e
       * costura é propriedade da caixa — não um elemento que alguém pode
       * reposicionar sem perceber que estragou a solda.
       */}
      {bandeja != null && (
        <div
          ref={gavetaRef}
          aria-hidden={!aberto}
          /* A gaveta: altura medida, e nunca `auto`.
             `height: auto` não é animável, e a altura certa aqui não é uma
             constante — os atalhos se reembrulham quando a coluna muda de
             largura, o que acontece na própria abertura da seção. Um
             `ResizeObserver` no conteúdo mantém o número honesto sem ninguém
             ter de lembrar de atualizá-lo. */
          style={{ height: aberto ? alturaBandeja : 0, transition: transicao }}
          className="relative w-full overflow-hidden"
        >
          <div
            ref={bandejaRef}
            /* E ela sai DE TRÁS do campo: começa deslocada uma altura inteira
               para cima, escondida atrás do andar de cima, e desce enquanto a
               gaveta abre. Só a gaveta crescendo entregaria os atalhos parados
               sendo revelados por uma cortina; com o deslize, eles saem de
               algum lugar — que é o mesmo gesto da bandeja de anexos do
               componente que o dono mandou. */
            style={{
              transform: aberto ? 'translateY(0)' : 'translateY(-100%)',
              opacity: aberto ? 1 : 0,
              transition: parado
                ? 'none'
                : `transform 400ms ${MOLA_CSS}, opacity 260ms ease-out`,
            }}
            className="border-t border-white/[0.08] px-3 py-3"
          >
            {bandeja}
          </div>
        </div>
      )}
    </div>
  );
}
