/**
 * ─── CENA: O ONBOARDING ──────────────────────────────────────────────────────
 *
 * A lição: **resposta completa vira roteiro bom.**
 *
 * Uma pergunta acende no alto. A resposta de uma palavra entra e fica ali,
 * curta e apagada — não é erro, é pouco. Aí a mesma resposta ganha contexto: as
 * três linhas se preenchem em cor e o campo acende por baixo. Fecha com o visto
 * verde. Ninguém precisa ler nada para entender que o campo quer mais texto: a
 * diferença entre uma barrinha cinza e três linhas acesas diz sozinha.
 *
 * ─── A ÚNICA FAÍSCA DESTA CENA É VERDE ───────────────────────────────────────
 *
 * Houve um punhado de partículas do arco subindo do campo no instante em que as
 * linhas completavam. O dono olhou e cortou: "não é cor nenhuma, não é
 * elegante". O diagnóstico é o da doutrina — ali a cor não julgava nada, era
 * confete em cima de um campo que já tinha acabado de acender sozinho, e duas
 * comemorações seguidas (a do campo e a do visto) tiram o peso da que importa.
 * A faísca sobrou onde ela SIGNIFICA: em volta do visto, verde, dizendo
 * "aprovado".
 *
 * Por que barra e não frase: frase dentro do desenho vira letra de 8px no
 * celular — ilegível, e ainda ficaria em português para o leitor em inglês.
 *
 * A cor é o arco Siri (`luz.tsx`), e ela entra JUNTO com o conteúdo bom: a
 * resposta pobre é cinza, a resposta completa é colorida. Não é enfeite
 * distribuído por igual — é recompensa.
 */
import { motion } from 'framer-motion';
import { Barra, Legenda, Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import type { Tinta } from './luz';
import { Brilho, Faiscas, Poeira } from './luz';
import { EASE, tempo, useRoteiro } from './tempo';

/**
 * O roteiro, em milissegundos: a pergunta chega, a resposta curta senta, a
 * resposta boa preenche, e o visto segura o quadro antes de recomeçar.
 */
const FASES = [1400, 1700, 2000, 2600] as const;
const CURTA = 1;
const COMPLETA = 2;
const VISTO = 3;

/** A largura de cada uma das três linhas da resposta, por fase. */
const LINHAS: readonly (readonly number[])[] = [
  [0, 0, 0],
  [72, 0, 0],
  [412, 372, 268],
  [412, 372, 268],
];

/** Uma tinta por linha: o arco não cabe numa barra só, então ele se reparte. */
const TINTAS: readonly Tinta[] = ['quente', 'arco', 'frio'];

const ESQUERDA = 68;
const ALTURAS = [122, 150, 178] as const;

/** A pergunta: um marcador e duas linhas, do jeito que um formulário pergunta. */
function Pergunta({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho x={90} y={50} raio={90} tinta="luzQuente" aceso parado={parado} achatar={0.55} />
      <Painel x={40} y={22} largura={480} altura={54} tinta="arco" vidro />
      <motion.circle
        cx={70}
        cy={49}
        r={9}
        fill="none"
        stroke={TRACO_ACESO}
        strokeWidth={1.6}
        animate={parado ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <Barra x={94} y={41} largura={236} cor={TRACO_ACESO} parado={parado} />
      <Barra x={94} y={55} largura={148} parado={parado} atraso={0.08} />
      <Legenda x={496} y={57} corpo={26} tinta="arco">
        ?
      </Legenda>
    </g>
  );
}

/** O cursor piscando no fim do que já foi escrito. */
function Cursor({ x, y, parado }: { x: number; y: number; parado: boolean }) {
  if (parado) return null;
  return (
    <motion.rect
      x={x}
      y={y - 5}
      width={2.5}
      height={18}
      rx={1.25}
      fill={TINTA.branco}
      animate={{ opacity: [1, 0.1, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/** A borda do campo conta o julgamento: apagada, acesa em arco, verde no fim. */
function tintaDoCampo(fase: number): Tinta | undefined {
  if (fase >= VISTO) return 'certo';
  if (fase >= COMPLETA) return 'arco';
  return undefined;
}

/** As três linhas da resposta — cinza enquanto pobres, acesas quando completas. */
function Resposta({ fase, parado }: { fase: number; parado: boolean }) {
  const larguras = LINHAS[fase];
  const rica = fase >= COMPLETA;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: fase === CURTA ? 0.45 : 1 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      {ALTURAS.map((y, indice) => (
        <Barra
          key={y}
          x={ESQUERDA}
          y={y}
          altura={8}
          largura={larguras[indice]}
          cor={TRACO}
          tinta={rica ? TINTAS[indice] : undefined}
          parado={parado}
          atraso={indice * 0.14}
        />
      ))}
    </motion.g>
  );
}

/** O campo da resposta: o clarão por baixo, a moldura e as três linhas. */
function Campo({ fase, parado }: { fase: number; parado: boolean }) {
  return (
    <g>
      <Brilho
        x={280}
        y={152}
        raio={210}
        tinta="luz"
        aceso={fase >= COMPLETA}
        parado={parado}
        achatar={0.42}
      />
      <Painel
        x={40}
        y={92}
        largura={480}
        altura={118}
        tinta={tintaDoCampo(fase)}
        tracejado={fase === CURTA}
        vidro={fase >= COMPLETA}
      />
      {/* A resposta curta não some nem é riscada: ela fica FRACA. É assim que
          ela chega para a equipe — dá para usar, só não dá para render. */}
      <Resposta fase={fase} parado={parado} />
      {/* Aqui NÃO entra faísca: o campo completo se anuncia pelo clarão e pelas
          três linhas em cor. Ver o cabeçalho. */}
    </g>
  );
}

/** O carimbo do fim: o visto verde aceso, com as faíscas da mesma cor. */
function Fecho({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho x={478} y={182} raio={62} tinta="luzCerta" aceso parado={parado} />
      <Marca tipo="certo" x={478} y={182} cor={TINTA.protege} escala={1.2} parado={parado} />
      <Faiscas
        x={478}
        y={182}
        raio={54}
        ativo
        parado={parado}
        quantidade={7}
        cores={[TINTA.protege]}
      />
    </g>
  );
}

export default function CenaOnboarding() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const larguras = LINHAS[fase];
  const escrevendo = fase === CURTA || fase === COMPLETA;
  // O cursor senta no fim da última linha que já tem conteúdo.
  const ultima = larguras.reduce((maior, valor, indice) => (valor > 0 ? indice : maior), 0);

  return (
    <Palco viewBox="0 0 560 240" fase={fase}>
      <Poeira x={60} largura={440} base={228} parado={parado} />
      <Pergunta parado={parado} />
      <Campo fase={fase} parado={parado} />

      {escrevendo && (
        <Cursor x={ESQUERDA + larguras[ultima] + 10} y={ALTURAS[ultima]} parado={parado} />
      )}

      {fase === VISTO && <Fecho parado={parado} />}
    </Palco>
  );
}
