/**
 * ─── CENA: O ONBOARDING ──────────────────────────────────────────────────────
 *
 * A lição: **resposta completa vira roteiro bom.**
 *
 * A cena mostra o que o texto do capítulo pede. Uma pergunta aparece; a
 * resposta de uma palavra entra e fica ali, curta e apagada — não é erro, é
 * pouco. Aí a mesma resposta ganha contexto, preenche o campo inteiro e recebe
 * o visto. Ninguém precisa ler nada para entender que o campo quer mais texto:
 * a diferença entre uma barrinha e três linhas cheias diz sozinha.
 *
 * Por que barra e não frase: frase dentro do desenho vira letra de 8px no
 * celular — ilegível, e ainda ficaria em português para o leitor em inglês.
 */
import { motion } from 'framer-motion';
import { Barra, Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { EASE, tempo, useRoteiro } from './tempo';

/**
 * O roteiro, em milissegundos: a pergunta chega, a resposta curta senta, a
 * resposta boa preenche, e o visto segura o quadro antes de recomeçar.
 */
const FASES = [1300, 1700, 1800, 2400] as const;
const CURTA = 1;
const COMPLETA = 2;
const VISTO = 3;

/** A largura de cada uma das três linhas da resposta, por fase. */
const LINHAS: readonly (readonly number[])[] = [
  [0, 0, 0],
  [64, 0, 0],
  [330, 300, 214],
  [330, 300, 214],
];

const ESQUERDA = 64;
const ALTURAS = [114, 138, 162] as const;

/** A pergunta: um marcador e duas linhas, do jeito que um formulário pergunta. */
function Pergunta({ parado }: { parado: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.4), ease: EASE }}
    >
      <Painel x={36} y={24} largura={408} altura={48} aceso />
      <circle cx={64} cy={48} r={9} fill="none" stroke={TRACO_ACESO} strokeWidth={1.5} />
      <Barra x={84} y={40} largura={214} cor={TRACO_ACESO} parado={parado} />
      <Barra x={84} y={54} largura={132} parado={parado} atraso={0.08} />
    </motion.g>
  );
}

/** O cursor piscando no fim do que já foi escrito. */
function Cursor({ x, y, parado }: { x: number; y: number; parado: boolean }) {
  if (parado) return null;
  return (
    <motion.rect
      x={x}
      y={y - 4}
      width={2}
      height={14}
      fill={TINTA.branco}
      animate={{ opacity: [1, 0.1, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export default function CenaOnboarding() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const larguras = LINHAS[fase];
  const escrevendo = fase === CURTA || fase === COMPLETA;
  // O cursor senta no fim da última linha que já tem conteúdo.
  const ultima = larguras.reduce((maior, valor, indice) => (valor > 0 ? indice : maior), 0);

  return (
    <Palco viewBox="0 0 480 240">
      <Pergunta parado={parado} />

      <Painel
        x={36}
        y={88}
        largura={408}
        altura={108}
        aceso={fase >= COMPLETA}
        tracejado={fase === CURTA}
      />

      {/* A resposta curta não some nem é riscada: ela fica FRACA. É assim que
          ela chega para a equipe — dá para usar, só não dá para render. */}
      <motion.g
        initial={false}
        animate={{ opacity: fase === CURTA ? 0.4 : 1 }}
        transition={{ duration: tempo(parado, 0.5), ease: EASE }}
      >
        {ALTURAS.map((y, indice) => (
          <Barra
            key={y}
            x={ESQUERDA}
            y={y}
            largura={larguras[indice]}
            cor={fase >= COMPLETA ? TRACO_ACESO : TRACO}
            parado={parado}
            atraso={indice * 0.12}
          />
        ))}
      </motion.g>

      {escrevendo && (
        <Cursor x={ESQUERDA + larguras[ultima] + 8} y={ALTURAS[ultima]} parado={parado} />
      )}

      {fase === VISTO && <Marca tipo="certo" x={406} y={168} cor={TINTA.protege} parado={parado} />}
    </Palco>
  );
}
