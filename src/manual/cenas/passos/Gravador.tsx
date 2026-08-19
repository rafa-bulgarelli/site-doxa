/**
 * ─── MINI-CENA DO PASSO: O GRAVADOR (VZ-3) ───────────────────────────────────
 *
 * O passo: **grave pelo gravador da plataforma — e baixe cada gravação.**
 *
 * A história em uma frase: o material inteiro se junta de trechos CURTOS,
 * gravados na própria plataforma, e cada um é BAIXADO na hora — o que não foi
 * baixado, a plataforma não guarda para sempre.
 *
 * O arco: o gravador da plataforma está aberto e não há nada gravado · o
 * primeiro trecho cai, recebe o seu visto e é baixado · o segundo cai · o
 * terceiro fecha o conjunto, e os três acendem juntos. A repetição é o
 * argumento: três caixas iguais chegando uma a uma dizem "não precisa ser de
 * uma vez" melhor do que qualquer frase caberia aqui.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **Cada trecho fecha SOZINHO — e sai de lá com você.** O visto entra junto
 *    com o trecho, e a seta de baixar junto com o visto: o que a regra combate
 *    é o medo da maratona E o trecho que se perde por não ter sido salvo. Um
 *    visto e um download por pedaço são o desenho de "já valeu, pode parar aqui
 *    hoje — mas guarde o que gravou".
 * 2. **O ponto de gravar é BRANCO.** O vermelho de "REC" é o vermelho do resto
 *    do manual, onde ele significa uma coisa só: isto está errado. Gravar não
 *    está errado — então o ponto é branco, e o vermelho não aparece nesta cena.
 * 3. **Nada de ponteiro correndo.** O aparelho não anima em loop: o que se move
 *    é a história, um trecho por fase. A faixa de tempo do gravador AVANÇA a
 *    cada trecho, o que é história também — é ela que diz "até bater os 60
 *    minutos" —, e não um enfeite piscando.
 * 4. **A seta de baixar mora ACIMA do cartão.** A faixa de baixo é do fecho do
 *    arco, e enfiar mais um elemento por cartão sem respiro é exatamente o
 *    "MUITO ESPREMIDAS, sem vida" que o dono reprovou aqui uma vez. Em cima há
 *    quarenta e quatro unidades livres, e as três setas alinhadas viram RITMO —
 *    uma por gravação, que é o que a regra pede.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, TracoDeLuz } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco } from '../itens/comuns';
import { OndaDeFala, PontoDeGravar } from './comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** O gravador aberto · o primeiro trecho · o segundo · o terceiro e a pausa. */
const FASES = [1400, 1500, 1500, 3400] as const;
const FECHADO = 3;

const APARELHO = { x: 14, y: 22, largura: 64, altura: 106 } as const;
const CARTAO = { y: 44, largura: 100, altura: 62 } as const;
const EIXO = 75;

/**
 * Onde cai cada trecho, e o que se falou em cada um deles.
 *
 * ─── O CONSERTO QUE O DONO PEDIU AQUI ────────────────────────────────────────
 *
 * O veredito dele, olhando as caixinhas: "MUITO ESPREMIDAS — melhorar o
 * espaçamento entre o item marcado e o próximo. Sem vida." O número era 16: três
 * cartões de 100 de largura separados por dezesseis unidades, num palco de 480.
 * Vizinhos com 16 de vão e 100 de corpo leem como uma tira picotada, e não como
 * três gravações independentes — que é exatamente o argumento da cena ("não
 * precisa ser de uma vez").
 *
 * O vão foi para 26, e o que o pagou foi a margem da direita, que sobrava (44).
 * O aparelho andou quatro para a esquerda para o primeiro cartão não colar nele.
 */
const VAO_ENTRE_TRECHOS = 26;
const PRIMEIRO_TRECHO_X = 100;

/** O x do enésimo cartão — mexer no vão reposiciona os três de uma vez. */
function trechoX(indice: number): number {
  return PRIMEIRO_TRECHO_X + indice * (CARTAO.largura + VAO_ENTRE_TRECHOS);
}

const TRECHOS = [
  { alturas: [16, 30, 22, 12] },
  { alturas: [12, 26, 34, 18] },
  { alturas: [20, 14, 28, 24] },
] as const;

/** O meio da fileira dos três — o clarão e o fecho se penduram nele. */
const FILEIRA_MEIO = (PRIMEIRO_TRECHO_X + trechoX(2) + CARTAO.largura) / 2;

/** A ondinha da tela: a fala correndo enquanto se grava. */
const NA_TELA = [14, 26, 18, 30, 20] as const;

/** A linha do tempo do gravador: o trilho e o quanto dele já correu, por fase. */
const TRILHO = { x: APARELHO.x + 15, y: APARELHO.y + 66, largura: 34 } as const;
const TEMPO_CORRIDO = [7, 16, 25, 34] as const;

/**
 * O glifo de baixar: a seta que desce e a bandeja que a recebe.
 *
 * É o ícone real do gesto, e não uma invenção da casa — o que ele acrescenta à
 * cena é a metade nova da regra: gravou, conferiu, BAIXOU. Desenhado na origem;
 * quem chama o coloca com um `translate` no grupo de fora.
 */
const BAIXAR = 'M 0 -8 v 11 M -5 -1 l 5 4 l 5 -4 M -8 9 h 16';

/**
 * O gravador da plataforma, aberto no aparelho da pessoa.
 *
 * O que se vê é a TELA da plataforma — a onda da fala correndo, a faixa de tempo
 * e o ponto de gravar —, e é ela que a regra manda usar. A moldura continua
 * sendo a de um aparelho porque a plataforma abre no celular também; o que mudou
 * foi o que está DENTRO dela.
 */
function GravadorDaPlataforma({ fase, parado }: { fase: number; parado: boolean }) {
  return (
    <g>
      <Painel
        x={APARELHO.x}
        y={APARELHO.y}
        largura={APARELHO.largura}
        altura={APARELHO.altura}
        cor={TRACO_ACESO}
        vidro
        raio={12}
      />
      <rect x={APARELHO.x + 20} y={APARELHO.y + 10} width={24} height={4} rx={2} fill={TRACO} />
      <OndaDeFala
        alturas={NA_TELA}
        x={APARELHO.x + 14}
        eixo={APARELHO.y + 40}
        passo={9}
        largura={4}
        cor={TRACO_ACESO}
        parado={parado}
      />
      <rect x={TRILHO.x} y={TRILHO.y} width={TRILHO.largura} height={3} rx={1.5} fill={TRACO} />
      <motion.rect
        x={TRILHO.x}
        y={TRILHO.y}
        height={3}
        rx={1.5}
        fill={TINTA.branco}
        // `initial` com o valor da vez: sem ele a faixa nasce zerada e só cresce
        // depois que o framer monta — um piscar de campo vazio a cada visita.
        initial={{ width: TEMPO_CORRIDO[fase] }}
        animate={{ width: TEMPO_CORRIDO[fase] }}
        transition={{ duration: tempo(parado, 0.6), ease: EASE }}
      />
      <PontoDeGravar x={APARELHO.x + APARELHO.largura / 2} y={APARELHO.y + 88} aceso />
    </g>
  );
}

interface TrechoProps {
  readonly x: number;
  readonly alturas: readonly number[];
  readonly gravado: boolean;
  /** O trecho que ACABOU de cair — só ele ganha o clarão verde. */
  readonly novo: boolean;
  readonly parado: boolean;
}

/** Um trecho curto: a caixa, quatro barras de fala e o visto que o fecha. */
function Trecho({ x, alturas, gravado, novo, parado }: TrechoProps) {
  return (
    <g>
      {/* O clarão verde é do trecho da vez, e não dos três: três halos acesos
          ao mesmo tempo viram festa, e festa é o que reprovou a primeira leva.
          O que acende o CONJUNTO no fim é o clarão branco, lá embaixo. */}
      <Brilho x={x + CARTAO.largura / 2} y={EIXO} raio={72} tinta="luzCerta" aceso={novo} parado={parado} />
      <Painel
        x={x}
        y={CARTAO.y}
        largura={CARTAO.largura}
        altura={CARTAO.altura}
        cor={gravado ? TINTA.protege : TRACO}
        // Tracejado enquanto vazio: é a mesma gramática do cartão travado da
        // cena das 24 horas — traço interrompido é o que ainda não existe.
        tracejado={!gravado}
        vidro={gravado}
        raio={10}
      />
      {gravado && (
        <>
          {/* A onda encolheu de 14 para 13 de passo e recuou uma unidade: o
              visto ficava a nove da última barra e a onze da borda direita, e
              "espremido" era dentro do cartão também, não só entre eles. */}
          <OndaDeFala
            alturas={alturas}
            x={x + 13}
            eixo={EIXO}
            passo={13}
            cor={TINTA.branco}
            parado={parado}
          />
          <Marca
            tipo="certo"
            x={x + 78}
            y={EIXO}
            cor={TINTA.protege}
            escala={0.62}
            parado={parado}
          />
        </>
      )}
    </g>
  );
}

/**
 * A gravação baixada: a seta desce para a bandeja acima do cartão.
 *
 * Ela entra descendo — o gesto é o download, e um glifo que aparece pronto não
 * seria gesto nenhum. Branca, e não verde: verde é o veredito do trecho, e o
 * carimbo desse veredito já está lá dentro; baixar é a AÇÃO que a regra pede.
 */
function Baixada({ x, visivel, parado }: { x: number; visivel: boolean; parado: boolean }) {
  return (
    <g transform={`translate(${x} 24)`}>
      <motion.g
        initial={false}
        animate={{ opacity: visivel ? 1 : 0, y: visivel ? 0 : -10 }}
        transition={{ duration: tempo(parado, 0.45), ease: EASE }}
      >
        {/* Traço mais fino que o do visto: baixar é a AÇÃO, o carimbo é o
            VEREDITO — hierarquia é peso de traço, e a seta não pode pesar mais
            que o que ela acompanha. */}
        <TracoDeLuz d={BAIXAR} cor={TINTA.branco} largura={1.8} halo={2.2} parado={parado} />
      </motion.g>
    </g>
  );
}

export default function Gravador() {
  const { fase, parado } = useRoteiro(FASES, FECHADO);

  return (
    <MiniPalco fase={fase}>
      {/* O clarão só abre quando os três estão lá: é o conjunto que fecha, e é
          ele o quadro que fica na cabeça de quem passou os olhos. */}
      <Brilho
        x={FILEIRA_MEIO}
        y={EIXO}
        raio={230}
        tinta="luz"
        aceso={fase >= FECHADO}
        parado={parado}
        achatar={0.34}
      />
      <GravadorDaPlataforma fase={fase} parado={parado} />
      {TRECHOS.map((trecho, indice) => (
        <Trecho
          key={trecho.alturas[0]}
          x={trechoX(indice)}
          alturas={trecho.alturas}
          // Um trecho por fase, na ordem: o primeiro cai na fase 1, e assim
          // por diante — é a leitura "aos poucos" que a regra pede.
          gravado={fase > indice}
          novo={fase === indice + 1}
          parado={parado}
        />
      ))}
      {TRECHOS.map((trecho, indice) => (
        <Baixada
          key={trecho.alturas[0]}
          x={trechoX(indice) + CARTAO.largura / 2}
          visivel={fase > indice}
          parado={parado}
        />
      ))}

      {/*
       * O degradê fecha o CONJUNTO, embaixo do meio da fileira — e não embaixo
       * de um dos três vistos. Cada trecho já tem o seu carimbo; o que a última
       * fase acrescenta é o material inteiro estar gravado e salvo, e é isso que
       * o arco sublinha. Dentro de um cartão de 62 de altura ele não caberia.
       */}
      {fase >= FECHADO && (
        <FechoDoArco x={FILEIRA_MEIO} y={CARTAO.y + CARTAO.altura + 6} escala={1} parado={parado} />
      )}
    </MiniPalco>
  );
}
