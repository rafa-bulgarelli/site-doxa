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
  /** Quanto do corpo natural cabe na linha, de 0 a 1. */
  const [escala, setEscala] = useState(1);

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

  const letras = [...valor];

  return (
    <div
      ref={caixaRef}
      className="relative mt-6 w-full border-b border-white/20 pb-3 font-serif text-[1.9rem] transition-colors focus-within:border-white/70 md:text-[2.5rem]"
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
         * O input de verdade, com o texto transparente.
         *
         * `caret-transparent` não entra aqui: o cursor é a única parte dele que
         * precisa continuar visível, e ele é desenhado na cor do `caret-color`,
         * não na do texto. Assim o traço pisca no lugar certo, sobre as letras
         * que a camada de cima desenhou.
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
          className="relative w-full bg-transparent text-transparent caret-[#F4F1E8] outline-none placeholder:text-white/20"
          style={{ fontSize: 'inherit' }}
        />
      </div>
    </div>
  );
}
