import { motion } from 'framer-motion';

interface RevelaProps {
  texto: string;
  /** Quanto esperar antes da primeira palavra, em segundos. */
  atraso?: number;
  parado: boolean;
}

/** Quanto tempo separa uma palavra da seguinte, em segundos. */
const CADENCIA = 0.016;

/**
 * O texto chegando palavra por palavra.
 *
 * PALAVRA, e não letra: um typewriter letra a letra num parágrafo de trinta
 * palavras leva quatro segundos, e quatro segundos para ler uma frase que já
 * está pronta é a interface cobrando pedágio. Por palavra, o mesmo parágrafo se
 * revela em meio segundo — rápido o bastante para não atrasar quem lê, devagar
 * o bastante para o olho ver que a frase se MONTOU.
 *
 * E é mola, não curva de tempo. É a mesma física das letras que caem no campo
 * do formulário e do fio que corre pelas bordas: a página inteira diz "isto
 * acabou de chegar" com o mesmo movimento, e uma seção que dissesse isso com
 * uma animação diferente seria uma seção de outro site.
 *
 * Cada palavra leva o próprio espaço dentro do `inline-block`. Fora dele, o
 * espaço entre duas caixas em linha some quando o JSX é compilado, e o
 * parágrafo aparece com as palavras coladas.
 */
export function Revela({ texto, atraso = 0, parado }: RevelaProps) {
  if (parado) return <>{texto}</>;

  return (
    <>
      {texto.split(' ').map((palavra, i) => (
        <motion.span
          // A posição basta como chave: as palavras de um parágrafo escrito não
          // mudam de lugar, e nenhuma delas entra ou sai depois de montada.
          key={`${i}-${palavra}`}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 32,
            mass: 0.5,
            delay: atraso + i * CADENCIA,
          }}
        >
          {palavra}{' '}
        </motion.span>
      ))}
    </>
  );
}
