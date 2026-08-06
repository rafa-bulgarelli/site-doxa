import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CampoVivoProps {
  id: string;
  valor: string;
  exemplo: string;
  tipo: 'tel' | 'text';
  autoComplete: string;
  invalido: boolean;
  descritoPor?: string;
  campoRef: RefObject<HTMLInputElement>;
  aoDigitar: (valor: string) => void;
  aoTeclar: (evento: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Quanto o caractere cai de cima antes de assentar, em pixels.
 *
 * Curto de propósito. A letra tem de chegar junto com a tecla — uma queda longa
 * atrasa o que a pessoa acabou de digitar, e digitação com atraso é a única
 * forma de animação que atrapalha em vez de agradar.
 */
const QUEDA = 16;

/**
 * A folga entre a linha de base e o filete, em `em`.
 *
 * Em `em` e não em pixels porque o filete tem de acompanhar o corpo quando o
 * campo encolhe. Funda o bastante para a perna do "g" e a cauda do "ç" passarem
 * sem encostar no fio, e não mais do que isso — o filete é a linha do caderno,
 * e num caderno a linha fica embaixo da palavra, não dois dedos abaixo dela.
 */
const FOLGA_FILETE = 0.34;

/**
 * O respiro entre a última letra e o cursor, em `em`.
 *
 * A largura do texto medido é onde o próximo caractere COMEÇA, e um traço
 * plantado ali encosta na letra anterior — em serifa de contraste alto, com a
 * perna do "j" ou a cauda do "y", ele lê como parte do desenho da letra em vez
 * de como cursor. O afastamento é o mesmo que um tipógrafo daria: pequeno o
 * bastante para o traço continuar dizendo onde se escreve, grande o bastante
 * para ser outra coisa.
 */
const RESPIRO_CURSOR = 0.1;

/**
 * O campo em que cada letra entra caindo, e que se reduz em vez de cortar.
 *
 * Um `<input>` não sabe animar o próprio conteúdo: o texto dele é desenhado pelo
 * navegador e não existe como elemento. A saída é a de sempre nesse caso — o
 * input continua sendo o input, com foco, teclado, seleção, autocomplete e
 * corretor, e só o TEXTO dele fica invisível; por cima, no mesmo lugar e na
 * mesma fonte, uma camada desenha letra por letra. Quem digita não percebe a
 * troca, e quem usa leitor de tela continua com um campo de formulário de
 * verdade.
 *
 * A queda de cada letra é uma mola de atrito baixo: ela vem de cima, PASSA do
 * lugar, sobe um pouco menos e para. É o mesmo movimento da lâmina da ladainha,
 * na vertical — a página inteira usa a mesma física para dizer "isto acabou de
 * chegar".
 *
 * E o campo não deixa a letra ser cortada. Quando o texto fica maior do que a
 * linha, o corpo inteiro encolhe até caber, em vez de o começo da frase sumir
 * pela esquerda como faz um input comum. Num campo em que se digita um número de
 * telefone, ver o DDD sair da tela é perder a única referência do que já foi
 * escrito.
 */
export function CampoVivo({
  id,
  valor,
  exemplo,
  tipo,
  autoComplete,
  invalido,
  descritoPor,
  campoRef,
  aoDigitar,
  aoTeclar,
}: CampoVivoProps) {
  const parado = useReducedMotion() === true;
  const caixaRef = useRef<HTMLDivElement>(null);
  const corpoRef = useRef<HTMLDivElement>(null);
  const medidorRef = useRef<HTMLSpanElement>(null);
  const medidorCursorRef = useRef<HTMLSpanElement>(null);
  const baseRef = useRef<HTMLSpanElement>(null);
  /** Quanto do corpo natural cabe na linha, de 0 a 1. */
  const [escala, setEscala] = useState(1);
  /** Em que caractere o cursor está, e onde isso cai em pixels. */
  const [cursor, setCursor] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  /** Onde fica a linha de base do texto, em pixels a partir do topo da caixa. */
  const [baseY, setBaseY] = useState(0);
  /** Quanta entrelinha sobra ABAIXO da linha de base, em pixels. */
  const [sobra, setSobra] = useState(0);

  /**
   * Onde o cursor está no texto.
   *
   * `onSelect` cobre tudo que o move — digitar, apagar, setas, clique, arrastar
   * seleção —, que é por que ele é o único ouvinte aqui. Ler `selectionStart`
   * direto do elemento em vez de deduzir do valor é o que mantém o traço certo
   * quando alguém edita no meio da frase.
   */
  const sincronizarCursor = () => {
    const campo = campoRef.current;
    if (campo != null) setCursor(campo.selectionStart ?? campo.value.length);
  };

  useLayoutEffect(() => {
    const caixa = caixaRef.current;
    const medidor = medidorRef.current;
    if (!caixa || !medidor) return;

    const medir = () => {
      const disponivel = caixa.clientWidth;
      // O medidor vive fora da caixa reduzida e sempre no corpo cheio: medido
      // dentro dela, cada redução mudaria a própria medida e o campo entraria
      // num laço de encolhimento.
      const natural = medidor.scrollWidth;
      if (!disponivel || !natural) return;
      // Um fio de folga para a última letra não encostar na borda enquanto se
      // digita — sem ele, a escala fica oscilando no limite exato.
      setEscala(Math.min(1, (disponivel - 2) / natural));
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(caixa);
    return () => observador.disconnect();
  }, [valor]);

  /*
   * Onde desenhar o cursor, em pixels.
   *
   * Medido no corpo CHEIO e multiplicado pela escala, e não medido já reduzido:
   * o medidor tem de ficar fora da caixa que encolhe, senão o valor que ele
   * devolve depende do valor que ele mesmo produziu no quadro anterior.
   *
   * O respiro entra AQUI, dentro do número que a mola persegue, e não como
   * margem no traço: como margem ele apareceria de um quadro para o outro na
   * primeira tecla, enquanto o resto do movimento é mola. E não existe no campo
   * vazio — ali não há letra anterior de que se afastar, e o cursor tem de
   * nascer exatamente onde a primeira letra vai cair.
   */
  useLayoutEffect(() => {
    const medidor = medidorCursorRef.current;
    const corpo = corpoRef.current;
    if (medidor == null || corpo == null) return;
    const largura = medidor.scrollWidth * escala;
    // O `em` do corpo já vem reduzido pela escala: o respiro encolhe junto.
    const em = parseFloat(getComputedStyle(corpo).fontSize);
    setCursorX(cursor > 0 ? largura + RESPIRO_CURSOR * em : 0);
  }, [valor, cursor, escala]);

  /*
   * Onde está a linha de base do texto — MEDIDA, e não calculada.
   *
   * Centrar o cursor na altura da caixa parecia certo e não é: a caixa de uma
   * linha é maior que a letra, e o glifo não fica no meio dela — ele se assenta
   * na linha de base, com o vão da entrelinha dividido acima e abaixo. Um
   * cursor centrado na caixa nasce alguns pixels abaixo do texto, que foi
   * exatamente o que o dono viu.
   *
   * O truque é o marcador: um `inline-block` de altura zero alinha a própria
   * borda inferior com a linha de base da linha em que está. O `offsetTop` dele
   * É a linha de base, sem precisar saber nada sobre as métricas da fonte — o
   * que também significa que isto continua certo se a fonte mudar.
   *
   * E ele só funciona DENTRO DE UMA LINHA. Num container `flex` o marcador
   * deixa de ser caixa inline e vira item de flex: `align-items: center` o
   * centra, e o `offsetTop` passa a devolver metade da altura da caixa em vez
   * da linha de base — uns treze pixels acima dela, que foi o cursor alto que o
   * dono viu. Por isso a camada das letras é bloco comum, e não flex.
   *
   * A sobra é a mesma medida pela outra ponta: o que existe de entrelinha
   * embaixo da linha de base. É com ela que o filete sobe até o texto.
   */
  useLayoutEffect(() => {
    const marcador = baseRef.current;
    const corpo = corpoRef.current;
    if (marcador == null || corpo == null) return;
    setBaseY(marcador.offsetTop);
    setSobra(corpo.clientHeight - marcador.offsetTop);
  }, [escala, valor]);

  const letras = [...valor];

  return (
    <div
      ref={caixaRef}
      className="campo-vivo relative mt-6 w-full border-b border-white/20 font-serif text-[1.9rem] transition-colors focus-within:border-white/70 md:text-[2.5rem]"
    >
      {/* O medidor: o mesmo texto, no corpo cheio, sem ocupar espaço nem ser
          lido. É dele que sai a largura natural com que a escala é calculada. */}
      <span
        ref={medidorRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre"
      >
        {valor}
      </span>
      {/* O mesmo texto até onde o cursor está: a largura dele É a posição do
          traço. Dois medidores e não um, porque as duas perguntas são
          diferentes — um mede a frase inteira para saber se cabe, o outro mede
          um pedaço dela para saber onde parar. */}
      <span
        ref={medidorCursorRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre"
      >
        {valor.slice(0, cursor)}
      </span>

      {/*
       * `relative`, e é o que ancora o cursor e as letras na caixa CERTA — a do
       * input, que é exatamente onde o texto está.
       *
       * A margem negativa é o filete subindo. Uma caixa de uma linha é bem mais
       * alta que a letra, e a sobra fica embaixo da linha de base: um `border-b`
       * no pé dela pousa nessa entrelinha morta, longe do que foi escrito. Então
       * o corpo devolve a sobra MEDIDA e desce só a folga que se quer — o fio
       * passa a ficar a uma distância fixa do texto, e não da caixa.
       */}
      <div
        ref={corpoRef}
        className="relative"
        style={{
          fontSize: `${escala * 100}%`,
          marginBottom: `calc(${FOLGA_FILETE}em - ${sobra}px)`,
        }}
      >
        {/* A camada visível. `aria-hidden` porque o texto verdadeiro é o do
            input logo abaixo — sem isso, um leitor de tela anuncia o mesmo
            conteúdo duas vezes. */}
        {/* Bloco comum, e não flex: as letras são `inline-block`, e é a linha
            que as põe na mesma linha de base do input — a mesma entrelinha, o
            mesmo corpo, o mesmo lugar. Um `flex items-center` empilhava igual e
            custava caro por fora: dentro dele o marcador da base deixa de ser
            caixa inline e passa a ser item centrado, e a medida do cursor sai
            errada. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 whitespace-pre text-[#F4F1E8]"
          style={{ fontSize: 'inherit' }}
        >
          {letras.map((letra, i) => (
            <motion.span
              /*
               * A chave é posição + letra. Só a posição faria o React reusar o
               * mesmo elemento quando a letra daquela casa muda, e a animação
               * não rodaria; só a letra colidiria entre repetidas ("aa" tem
               * duas chaves iguais e o React reclama, além de perder uma das
               * animações).
               */
              key={`${i}-${letra}`}
              initial={parado ? false : { y: -QUEDA, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={
                parado
                  ? { duration: 0 }
                  : // Atrito baixo: a letra passa do lugar, volta menos e para.
                    { type: 'spring', stiffness: 620, damping: 12, mass: 0.55 }
              }
              className="inline-block"
            >
              {letra}
            </motion.span>
          ))}
          {/* O marcador da linha de base. Sem largura, sem altura, sem tinta:
              existe só para ser medido. */}
          <span ref={baseRef} aria-hidden className="inline-block h-0 w-0" />
        </div>

        {/*
         * O cursor, desenhado por nós e movido por mola.
         *
         * O nativo salta de uma posição para a outra, e ao lado de letras que
         * chegam com mola ele é a única coisa dura na caixa. Com atrito alto a
         * mola não balança — ela apenas alcança —, que é o que se quer de um
         * cursor: suave, mas sem inércia visível atrás do que já foi digitado.
         */}
        <motion.span
          aria-hidden
          /* Pouco mais alto que uma maiúscula e bem menos que a linha inteira.
             Em `em`, então ele encolhe junto quando o campo se reduz. */
          className="caret-vivo pointer-events-none absolute left-0 h-[0.84em] w-[2px] rounded-full bg-[#F4F1E8]"
          /* Pendurado na linha de base: sobe 0,72em (pouco mais que uma
             maiúscula) e desce 0,12em abaixo dela, que é onde um cursor de
             editor de texto termina. */
          style={{ top: baseY, marginTop: '-0.72em' }}
          animate={{ x: cursorX }}
          transition={
            parado
              ? { duration: 0 }
              : { type: 'spring', stiffness: 900, damping: 52, mass: 0.5 }
          }
        />

        {/*
         * O input de verdade: texto transparente E cursor transparente.
         *
         * O cursor nativo tem de sair junto, senão ficam dois — o dele saltando
         * e o nosso deslizando, na mesma linha, com meio caractere de distância
         * um do outro. Ele continua sendo quem guarda a posição da seleção; só
         * não é mais quem a desenha.
         *
         * `block` de propósito. Um input é `inline-block`, e como caixa inline
         * ele é pendurado pela própria linha de base dentro de uma linha do
         * corpo — a caixa que sai dali é a da LINHA, que não tem obrigação de
         * medir o mesmo que a do input. Como bloco, a caixa do corpo é a caixa
         * do input, e é isso que faz a camada desenhada por cima cair exatamente
         * onde o texto de verdade está, em vez de por perto.
         */}
        <input
          id={id}
          ref={campoRef}
          type={tipo}
          inputMode={tipo === 'tel' ? 'tel' : 'text'}
          autoComplete={autoComplete}
          value={valor}
          placeholder={exemplo}
          aria-invalid={invalido}
          aria-describedby={descritoPor}
          onChange={(evento) => aoDigitar(evento.target.value)}
          onKeyDown={aoTeclar}
          onSelect={sincronizarCursor}
          className="relative block w-full bg-transparent text-transparent caret-transparent outline-none placeholder:text-white/20"
          style={{ fontSize: 'inherit' }}
        />
      </div>
    </div>
  );
}
