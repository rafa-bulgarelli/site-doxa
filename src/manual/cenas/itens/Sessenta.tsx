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
 */
import { Legenda, Marca, TINTA } from '../pecas';
import { ARCO, Brilho, Faiscas, TracoDeLuz, useTintas } from '../luz';
import { Cartao, MiniPalco, Sinal, TRES_REDES } from './comuns';
import { motion } from 'framer-motion';
import { tempo, useRoteiro } from '../tempo';

const FASES = [1200, 1400, 1600, 2400] as const;
const ESPALHA = 1;
/** A fase em que as três redes acendem recebendo a mesma cópia. */
const CHEGA = 2;
const VISTO = 3;

const REDE_Y = [30, 75, 120] as const;
const REDE_X = 268;
/** Onde a cópia recebida encosta: logo depois do anel da rede. */
const COPIA_X = 296;

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
          d={`M ${SAIDA.x} ${SAIDA.y} C 196 ${SAIDA.y}, 200 ${cy}, ${REDE_X - 22} ${cy}`}
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
          initial={{ opacity: parado && visivel ? 1 : 0 }}
          animate={{ opacity: visivel ? 1 : 0 }}
          transition={{ duration: tempo(parado, 0.4), delay: tempo(parado, indice * 0.12) }}
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
      {TRES_REDES.map((rede, indice) => (
        <Sinal
          key={rede}
          rede={rede}
          cx={REDE_X}
          cy={REDE_Y[indice]}
          raio={19}
          cor={espalhou ? ARCO[indice + 2] : TINTA.linha}
        />
      ))}
      <Copias visivel={chegou} parado={parado} />

      {fechou && (
        <g>
          <Brilho x={88} y={128} raio={52} tinta="luz" aceso parado={parado} />
          <Legenda x={88} y={145} corpo={48} tinta="arco">
            60
          </Legenda>
          <Faiscas x={88} y={72} raio={60} ativo parado={parado} quantidade={9} />
          <Brilho x={412} y={76} raio={44} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={412} y={76} cor={TINTA.protege} escala={0.95} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
