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
  const medidorRef = useRef<HTMLSpanElement>(null);
  const medidorCursorRef = useRef<HTMLSpanElement>(null);
  /** Quanto do corpo natural cabe na linha, de 0 a 1. */
  const [escala, setEscala] = useState(1);
  /** Em que caractere o cursor está, e onde isso cai em pixels. */
  const [cursor, setCursor] = useState(0);
  const [cursorX, setCursorX] = useState(0);

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
   */
  useLayoutEffect(() => {
    const medidor = medidorCursorRef.current;
    if (medidor != null) setCursorX(medidor.scrollWidth * escala);
  }, [valor, cursor, escala]);

  const letras = [...valor];

  return (
    <div
      ref={caixaRef}
      className="campo-vivo relative mt-6 w-full border-b border-white/20 pb-3 font-serif text-[1.9rem] transition-colors focus-within:border-white/70 md:text-[2.5rem]"
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

      <div style={{ fontSize: `${escala * 100}%` }}>
        {/* A camada visível. `aria-hidden` porque o texto verdadeiro é o do
            input logo abaixo — sem isso, um leitor de tela anuncia o mesmo
            conteúdo duas vezes. */}
        {/* `inset-0` mais `items-center`, e o alinhamento vertical é o motivo:
            um `<input>` centraliza o próprio texto na altura da caixa, um `div`
            encosta o dele no topo da linha. Empilhados sem isso, as letras
            desenhadas ficam alguns pixels acima das que o cursor percorre — e é
            o bastante para o traço parecer estar no lugar errado. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center whitespace-pre text-[#F4F1E8]"
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
          className="caret-vivo pointer-events-none absolute top-1/2 h-[0.95em] w-[2px] -translate-y-1/2 rounded-full bg-[#F4F1E8]"
          style={{ left: 0 }}
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
          className="relative w-full bg-transparent text-transparent caret-transparent outline-none placeholder:text-white/20"
          style={{ fontSize: 'inherit' }}
        />
      </div>
    </div>
  );
}
