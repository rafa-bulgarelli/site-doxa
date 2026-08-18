/**
 * ─── MINI-CENA: OS SESSENTA (GA-2) ───────────────────────────────────────────
 *
 * O item: **60 vídeos ÚNICOS no período — e cada um deles nas três redes.**
 *
 * As duas leituras erradas do número são divisões: "são vinte em cada rede" e
 * "são sessenta por rede". Nenhuma é o combinado — o MESMO arquivo vai para os
 * três destinos, e o total de arquivos é sessenta. (Uma versão anterior desta
 * cena desenhava 20+20+20, que é a primeira leitura errada em desenho.)
 *
 * Daí as três decisões do quadro:
 *
 * 1. **Nenhum número ao lado das redes.** Número por rede é a divisão escrita.
 *    O que cada rede recebe é uma CÓPIA — o mesmo cartão, do mesmo tamanho e da
 *    mesma cor, três vezes. Cópias iguais leem como distribuição; cópias
 *    diferentes contariam a história de três conteúdos.
 *
 * 2. **O 60 fica na PILHA, no começo do caminho** — onde ele é o que é: o total
 *    de arquivos gravados. Número no FIM, depois das três redes, seria a soma
 *    do que saiu delas, e é exatamente a conta que não se quer.
 *
 * 3. **O 60 continua sendo o clímax.** Ele entra na última fase, com o clarão,
 *    as faíscas e o visto — a cena mostra UMA viagem e só então diz quantas
 *    vezes ela acontece.
 *
 * A cena é decorativa (`aria-hidden`, como todas): quem lê por leitor de tela
 * recebe o texto da regra, que diz isso em palavras.
 *
 * ─── O QUE MUDOU NA RODADA DO POLIMENTO ──────────────────────────────────────
 *
 * 1. **A rede virou o ícone de verdade** (`redes.tsx`), sem o círculo que o
 *    dono chamou de "afogado" duas vezes. Sem a jaula, o glifo ficou 4 unidades
 *    mais à esquerda e a cópia recebida ganhou 19 de folga em vez de 11 — o
 *    ícone e a cópia agora conversam em vez de se empurrarem.
 *
 * 2. **A rede ACENDE por cross-fade**: o glifo apagado e o aceso são o mesmo
 *    desenho, um sobre o outro, e o que anima é a opacidade de cima. Trocar a
 *    cor no atributo pularia de um quadro para o outro.
 *
 * 3. **A cópia CHEGA**: ela entra deslizando da rede para o lado, em vez de
 *    aparecer no lugar. É o gesto que diz "foi publicado ali", e é o que faz as
 *    três leituras acontecerem uma depois da outra, e não todas de uma vez.
 *
 * ⚠️ O teste da GA-2 cobra três coisas deste arquivo: um único `<text>` no
 * quadro que ensina, e que ele seja o `60`; nenhum `20` em fase nenhuma; e pelo
 * menos QUATRO glifos de vídeo pintados em `ARCO[0]` (o original, as três
 * cópias e a pilha). Mexer nisso é reprovar de propósito.
 */
import { Legenda, Marca, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { ARCO, Brilho, Faiscas, TracoDeLuz, useTintas } from '../luz';
import { FechoDoArco } from '../fecho';
import { Cartao, MiniPalco } from './comuns';
import { IconeDaRede, REDES_REAIS } from '../redes';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

const FASES = [1200, 1400, 1600, 2400] as const;
const ESPALHA = 1;
/** A fase em que as três redes acendem recebendo a mesma cópia. */
const CHEGA = 2;
const VISTO = 3;

const REDE_Y = [30, 75, 120] as const;
const REDE_X = 264;
/** O lado da caixa do glifo — o mesmo das outras cenas que falam de rede. */
const REDE_TAMANHO = 34;
/** Onde a cópia recebida encosta: 19 de folga depois do glifo da rede. */
const COPIA_X = 300;

/**
 * O vídeo de origem — e o molde de toda cópia, para que as quatro sejam uma.
 *
 * Ele fica ALTO na caixa de propósito: a faixa embaixo é do 60, e um número de
 * clímax espremido contra a borda inferior lê como legenda de rodapé.
 */
const VIDEO = { x: 36, y: 36, largura: 104, altura: 64 } as const;

/**
 * Os degraus da pilha, do fundo para a frente.
 *
 * Deslocamento para CIMA e para a ESQUERDA: para a direita, os cartões de trás
 * cairiam em cima da saída dos fios e a pilha viraria um nó de traços.
 */
const FANTASMAS = [
  { recuo: 18, opacidade: 0.22 },
  { recuo: 9, opacidade: 0.45 },
] as const;

/** De onde os três fios saem: a borda direita do vídeo, na altura do meio. */
const SAIDA = { x: VIDEO.x + VIDEO.largura, y: VIDEO.y + VIDEO.altura / 2 } as const;

/** Os três fios saindo do mesmo vídeo — um por rede, e nenhum a mais. */
function Fios({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  const tintas = useTintas();
  if (!visivel) return null;
  return (
    <g>
      {REDE_Y.map((cy, indice) => (
        <TracoDeLuz
          key={cy}
          d={`M ${SAIDA.x} ${SAIDA.y} C 196 ${SAIDA.y}, 200 ${cy}, ${REDE_X - 26} ${cy}`}
          cor={tintas('arco')}
          largura={1.8}
          halo={2.6}
          parado={parado}
          riscando
          duracao={0.7}
          atraso={indice * 0.1}
        />
      ))}
    </g>
  );
}

/** O aceso das três redes no instante em que o vídeo chega — atrás dos anéis. */
function Pulsos({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {REDE_Y.map((cy) => (
        <Brilho
          key={cy}
          x={REDE_X}
          y={cy}
          raio={32}
          tinta="luzQuente"
          aceso={visivel}
          parado={parado}
        />
      ))}
    </g>
  );
}

/**
 * A cópia que cada rede recebe — e as três são IGUAIS de propósito.
 *
 * Mesmo desenho, mesma cor e mesma proporção do vídeo da esquerda: é um arquivo
 * só, publicado três vezes.
 */
function Copias({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {REDE_Y.map((cy, indice) => (
        <motion.g
          key={cy}
          // Parada, a cena nasce JÁ no quadro da vez: `initial` tem de olhar
          // `visivel` também, senão a cópia aparece antes de ter chegado.
          //
          // O `x` é o que transforma "apareceu" em "chegou": a cópia sai de
          // cima da rede e desliza para o lado dela. `x` no framer é sempre
          // deslocamento, então o zero é o lugar certo e o -20 é a partida.
          initial={{ opacity: parado && visivel ? 1 : 0, x: parado && visivel ? 0 : -20 }}
          animate={{ opacity: visivel ? 1 : 0, x: visivel ? 0 : -20 }}
          transition={{
            duration: tempo(parado, 0.5),
            ease: EASE,
            delay: tempo(parado, indice * 0.14),
          }}
        >
          <Cartao
            x={COPIA_X}
            y={cy - 14}
            largura={42}
            altura={28}
            cor={ARCO[0]}
            tinta="arco"
            vidro
          />
        </motion.g>
      ))}
    </g>
  );
}

/**
 * As três redes que recebem a cópia — o glifo apagado e o aceso, sobrepostos.
 *
 * Duas passadas do MESMO ícone: a de baixo fica sempre no cinza de traço, a de
 * cima acende por opacidade. É o cross-fade que faz a rede "acender"; trocar a
 * cor no atributo trocaria o desenho entre dois quadros, sem passagem nenhuma.
 */
function Redes({ acesas, parado }: { acesas: boolean; parado: boolean }) {
  return (
    <g>
      {REDES_REAIS.map((rede, indice) => (
        <g key={rede}>
          <IconeDaRede
            rede={rede}
            x={REDE_X}
            y={REDE_Y[indice]}
            tamanho={REDE_TAMANHO}
            cor={TRACO}
            acesa={false}
          />
          <motion.g
            initial={{ opacity: parado && acesas ? 1 : 0 }}
            animate={{ opacity: acesas ? 1 : 0 }}
            transition={{
              duration: tempo(parado, 0.5),
              ease: EASE,
              delay: tempo(parado, indice * 0.1),
            }}
          >
            <IconeDaRede
              rede={rede}
              x={REDE_X}
              y={REDE_Y[indice]}
              tamanho={REDE_TAMANHO}
              cor={TRACO_ACESO}
            />
          </motion.g>
        </g>
      ))}
    </g>
  );
}

/** A pilha atrás do vídeo: a mesma viagem, sessenta vezes. */
function Pilha({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {FANTASMAS.map(({ recuo, opacidade }) => (
        <motion.g
          key={recuo}
          initial={{ opacity: parado && visivel ? opacidade : 0 }}
          animate={{ opacity: visivel ? opacidade : 0 }}
          transition={{ duration: tempo(parado, 0.5) }}
        >
          <Cartao
            x={VIDEO.x - recuo}
            y={VIDEO.y - recuo}
            largura={VIDEO.largura}
            altura={VIDEO.altura}
            cor={ARCO[0]}
            tinta="arco"
          />
        </motion.g>
      ))}
    </g>
  );
}

export default function Sessenta() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const espalhou = fase >= ESPALHA;
  const chegou = fase >= CHEGA;
  const fechou = fase >= VISTO;

  return (
    <MiniPalco fase={fase}>
      <Brilho x={88} y={SAIDA.y} raio={76} tinta="luzQuente" aceso parado={parado} />
      <Pilha visivel={fechou} parado={parado} />
      <Cartao {...VIDEO} cor={ARCO[0]} tinta="arco" vidro />

      <Fios visivel={espalhou} parado={parado} />

      <Pulsos visivel={chegou} parado={parado} />
      <Redes acesas={espalhou} parado={parado} />
      <Copias visivel={chegou} parado={parado} />

      {fechou && (
        <g>
          {/* O 60 subiu 5: em 145 a barriga do zero encostava na borda de baixo
              do palco, e o clímax da cena lia como rodapé cortado. */}
          <Brilho x={88} y={124} raio={52} tinta="luz" aceso parado={parado} />
          <Legenda x={88} y={140} corpo={48} tinta="arco">
            60
          </Legenda>
          <Faiscas x={88} y={72} raio={60} ativo parado={parado} quantidade={9} />
          <Brilho x={412} y={76} raio={44} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={412} y={76} cor={TINTA.protege} escala={0.95} parado={parado} />
          <FechoDoArco x={412} y={88} escala={0.9} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
