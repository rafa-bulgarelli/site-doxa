/**
 * ─── MINI-CENA DO PASSO: O MESMO EQUIPAMENTO (VZ-4) ──────────────────────────
 *
 * O passo: **mesmo equipamento, mesmo lugar — nos 60 minutos inteiros.**
 *
 * A história em uma frase: o mesmo aparelho, no mesmo lugar, do primeiro ao
 * último minuto — é assim que o timbre não muda.
 *
 * O arco: à esquerda o LUGAR (a moldura é o cômodo, e o aparelho está de pé no
 * chão dele), à direita a faixa dos 60 minutos com o primeiro trecho gravado ·
 * o segundo trecho chega de OUTRO lugar, de outro aparelho, e a onda dele tem
 * outra forma — o timbre saiu diferente, e a cena o barra · o lugar estranho
 * sai e o trecho é regravado onde os outros: as duas ondas voltam a ter o MESMO
 * desenho · o terceiro entra igual aos dois, a faixa fecha e o visto carimba.
 *
 * ─── O QUE DIFERENCIA ESTA CENA DA DO GRAVADOR ───────────────────────────────
 *
 * As duas empilham trechos, e é aí que elas poderiam virar a mesma cena. O
 * argumento, porém, é outro: lá é "AOS POUCOS" — três cartões independentes
 * chegando um a um, cada um com o seu visto. Aqui é "IGUAL do começo ao fim", e
 * o que se repete não é o trecho, é a ORIGEM. Por isso aqui não há cartão
 * nenhum: os trechos são ondas soltas numa faixa contínua, e a prova é a FORMA
 * delas batendo uma com a outra. Três caixinhas iguais de novo teriam contado a
 * história do vizinho.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **A moldura é o LUGAR, não uma jaula do ícone.** O círculo apertado em
 *    volta de um glifo é defeito nomeado duas vezes pelo dono ("enforcando",
 *    "afogado"). O que existe aqui é outra coisa: um cômodo de 96 por 96 com um
 *    aparelho de 32 por 58 de pé no chão — trinta e dois de folga de cada lado.
 *    A moldura carrega SIGNIFICADO (é o lugar de que a regra fala), e é ela que
 *    permite dizer "o outro lugar" sem escrever uma palavra.
 * 2. **O mesmo timbre é o MESMO array.** Os trechos que vieram do lugar certo
 *    desenham `TIMBRE`, letra por letra; o intruso desenha `OUTRO_TIMBRE`. A
 *    igualdade não é sugerida, ela é literal — e é isso que o olho lê quando as
 *    três ondas ficam lado a lado no quadro final.
 * 3. **Vermelho só no que está errado.** O ponto de gravar é BRANCO (gravar não
 *    é erro, e essa é a mesma decisão da cena do gravador). Vermelho aparece em
 *    uma fase só, e em duas coisas que são o mesmo fato: o lugar estranho e a
 *    onda que saiu dele.
 * 4. **Um gesto por fase.** O lugar nunca muda de desenho — é o que se repete —,
 *    então o que se move é sempre uma coisa só: o intruso desce, o intruso sai
 *    e a onda se conserta, o último trecho entra.
 * 5. **A faixa embaixo são os 60 minutos.** Linha apagada é o que falta, linha
 *    acesa é o que já vale — e ela NÃO anda na fase do intruso, porque trecho
 *    gravado em outro lugar não conta para o total. É o detalhe que transforma
 *    a régua em argumento.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA, TracoDeLuz } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco } from '../itens/comuns';
import { OndaDeFala, PontoDeGravar } from './comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/**
 * O lugar e o trecho 1 · o intruso · a correção · o fecho e a pausa.
 *
 * A última é o dobro da primeira: é o quadro que ensina, e ele precisa de tempo
 * de sobra para as três ondas serem comparadas antes de o loop recomeçar.
 */
const FASES = [1500, 1700, 1600, 3600] as const;
const INTRUSO = 1;
const CORRIGIDO = 2;
const FECHOU = 3;

/** A linha da fala: a faixa inteira se pendura nela. */
const EIXO = 92;

/* ─── O LUGAR, À ESQUERDA ──────────────────────────────────────────────────── */

const LUGAR = { x: 14, y: 44, largura: 96, altura: 96 } as const;
const CHAO_Y = 124;
const APARELHO = { x: 45, y: 66, largura: 32, altura: 58 } as const;
const APARELHO_MEIO_X = APARELHO.x + APARELHO.largura / 2;

/* ─── A FAIXA DOS 60 MINUTOS, À DIREITA ────────────────────────────────────── */

const TRECHO_LARGURA = 74;
const VAO_ENTRE_TRECHOS = 18;
const PRIMEIRO_TRECHO_X = 132;
/** O recuo da onda dentro do trecho — sete de folga de cada lado. */
const RECUO_DA_ONDA = 6;
const BARRA_PASSO = 11;
const BARRA_LARGURA = 6;

/** O x do enésimo trecho — mexer no vão reposiciona os três de uma vez. */
function trechoX(indice: number): number {
  return PRIMEIRO_TRECHO_X + indice * (TRECHO_LARGURA + VAO_ENTRE_TRECHOS);
}

/** Em que fase cada trecho entra na faixa. */
const ENTRADA = [0, INTRUSO, FECHOU] as const;

/**
 * O timbre desta voz — a MESMA forma nos três trechos.
 *
 * Picos e vales de conversa, e não uma fileira decorativa: é a mesma gramática
 * de onda das cenas irmãs. O que importa aqui é que o array seja UM só.
 */
const TIMBRE = [18, 34, 52, 40, 26, 14] as const;

/**
 * O trecho que veio de outro lugar: outra forma, com a mesma energia.
 *
 * De propósito NÃO é uma onda achatada — achatada é o desenho de voz tratada, e
 * essa história é a da cena vizinha. Aqui a voz continua viva; o que mudou foi
 * o DESENHO dela, que é como um timbre diferente se parece.
 */
const OUTRO_TIMBRE = [46, 16, 24, 50, 12, 34] as const;

const FAIXA_Y = 128;
const FAIXA_X = 120;
const FAIXA_FIM = trechoX(2) + TRECHO_LARGURA;

/**
 * Até onde os 60 minutos já VALEM, por fase.
 *
 * A fase do intruso repete o número da anterior: o trecho existe, mas foi
 * gravado em outro lugar — ele não entra na conta.
 */
const GRAVADO_ATE = [
  trechoX(0) + TRECHO_LARGURA,
  trechoX(0) + TRECHO_LARGURA,
  trechoX(1) + TRECHO_LARGURA,
  FAIXA_FIM,
] as const;

const VISTO_X = 424;

/* ─── O OUTRO LUGAR, QUE CHEGA DE CIMA ─────────────────────────────────────── */

/**
 * O outro lugar é uma FAIXA larga, e não uma caixinha em volta do ícone.
 *
 * A primeira versão punha o notebook sozinho numa moldura de 72 com o xis por
 * cima dele: o resultado era uma mancha vermelha dentro de um tracejado —
 * exatamente a jaula que o dono nomeou duas vezes, e sem ícone nenhum legível.
 * Agora o aparelho e o veredito dividem a faixa lado a lado, cada um com o seu
 * espaço: dá para VER que é um notebook, e o xis não precisa cobrir nada para
 * dizer que aquilo não serve.
 */
const OUTRO_LUGAR = { x: 206, y: 6, largura: 110, altura: 48 } as const;
const OUTRO_MEIO_Y = OUTRO_LUGAR.y + OUTRO_LUGAR.altura / 2;
const NOTEBOOK_X = OUTRO_LUGAR.x + 38;
const XIS_X = OUTRO_LUGAR.x + 86;

/** O notebook: tela e base, o ícone real de "outro aparelho". */
const NOTEBOOK = 'M -16 -12 h 32 v 20 h -32 z M -23 8 h 46';

/**
 * O lugar de sempre: o cômodo, o chão e o aparelho de pé nele.
 *
 * Ele é o único desenho que NÃO muda em fase nenhuma — a repetição é o assunto
 * da cena, e um lugar que pisca ou acende contaria o contrário do que a regra
 * pede.
 */
function Lugar() {
  return (
    <g>
      <Painel
        x={LUGAR.x}
        y={LUGAR.y}
        largura={LUGAR.largura}
        altura={LUGAR.altura}
        cor={TRACO_ACESO}
        vidro
        raio={14}
      />
      {/* O chão do cômodo: é ele que faz a moldura ler como LUGAR, e não como
          mais uma caixa em volta de um ícone. */}
      <rect x={30} y={CHAO_Y} width={64} height={1.6} rx={0.8} fill={TRACO} />
      {/* O aparelho é o branco da cena — hierarquia é peso de traço: o lugar
          segura, o aparelho é quem grava. */}
      <Painel
        x={APARELHO.x}
        y={APARELHO.y}
        largura={APARELHO.largura}
        altura={APARELHO.altura}
        cor={TINTA.branco}
        raio={6}
      />
      <rect x={APARELHO_MEIO_X - 7} y={APARELHO.y + 6} width={14} height={3} rx={1.5} fill={TRACO} />
      <PontoDeGravar x={APARELHO_MEIO_X} y={APARELHO.y + 44} aceso />
    </g>
  );
}

/**
 * O outro lugar, com o outro aparelho — tracejado porque é o que NÃO deve
 * existir, a mesma gramática do cartão vazio das cenas irmãs.
 *
 * Ele desce de fora do palco e volta para fora: o quadro final tem de ficar
 * limpo, porque é ele que quem passou os olhos leva embora. O `translate` do
 * glifo mora num grupo de DENTRO — framer escreve o atributo `transform` do
 * elemento que anima, e o notebook iria parar na origem do palco.
 */
function OutroLugar({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: visivel ? 1 : 0, y: visivel ? 0 : -20 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      <Painel
        x={OUTRO_LUGAR.x}
        y={OUTRO_LUGAR.y}
        largura={OUTRO_LUGAR.largura}
        altura={OUTRO_LUGAR.altura}
        cor={QUEBRA}
        tracejado
        raio={12}
      />
      <g transform={`translate(${NOTEBOOK_X} ${OUTRO_MEIO_Y})`}>
        {/* Traço fino e halo curto: num glifo deste tamanho um halo de quatro
            vezes a espessura FECHA o desenho, e o notebook vira mancha — a
            armadilha que o próprio `TracoDeLuz` documenta. */}
        <TracoDeLuz d={NOTEBOOK} cor={QUEBRA} largura={1.8} halo={2} parado={parado} />
      </g>
      {visivel && (
        <Marca
          tipo="errado"
          x={XIS_X}
          y={OUTRO_MEIO_Y}
          cor={QUEBRA}
          escala={0.95}
          parado={parado}
        />
      )}
    </motion.g>
  );
}

/**
 * A régua dos 60 minutos: o que falta em cinza, o que já vale em branco.
 *
 * Ela sai da borda do lugar de propósito — a faixa inteira nasce DALI, e é essa
 * a leitura que a régua acrescenta sem uma palavra.
 */
function FaixaDosMinutos({ fase, parado }: { fase: number; parado: boolean }) {
  const valendo = GRAVADO_ATE[fase] - FAIXA_X;
  return (
    <g>
      <rect x={FAIXA_X} y={FAIXA_Y} width={FAIXA_FIM - FAIXA_X} height={2} rx={1} fill={TRACO} />
      <motion.rect
        x={FAIXA_X}
        y={FAIXA_Y}
        height={2}
        rx={1}
        fill={TRACO_ACESO}
        // `initial` com o valor da vez: sem ele a régua nasce zerada e só cresce
        // depois que o framer monta, um piscar de faixa vazia a cada visita.
        initial={{ width: valendo }}
        animate={{ width: valendo }}
        transition={{ duration: tempo(parado, 0.7), ease: EASE }}
      />
    </g>
  );
}

/**
 * A tinta de um trecho.
 *
 * Cinza claro enquanto a cena ainda não provou nada; BRANCO a partir do quadro
 * em que as ondas batem — o branco é o "deu certo" da forma, e o verde fica só
 * no visto, que é quem julga.
 */
function corDoTrecho(errado: boolean, fase: number): string {
  if (errado) return QUEBRA;
  return fase >= CORRIGIDO ? TINTA.branco : TRACO_ACESO;
}

/**
 * Os trechos que já estão na faixa, e o clarão do que saiu errado.
 *
 * O clarão vermelho fica atrás da ONDA, e não do intruso lá em cima: o defeito
 * que a regra combate é o timbre que saiu diferente — o outro lugar é só a
 * causa dele.
 */
function Trechos({ fase, parado }: { fase: number; parado: boolean }) {
  const intruso = fase === INTRUSO;
  return (
    <g>
      <Brilho
        x={trechoX(1) + TRECHO_LARGURA / 2}
        y={EIXO}
        raio={66}
        tinta="luzQuebra"
        aceso={intruso}
        parado={parado}
        achatar={0.55}
      />
      {ENTRADA.map((entrada, indice) => {
        if (fase < entrada) return null;
        const errado = indice === 1 && intruso;
        return (
          <OndaDeFala
            key={indice}
            alturas={errado ? OUTRO_TIMBRE : TIMBRE}
            x={trechoX(indice) + RECUO_DA_ONDA}
            eixo={EIXO}
            passo={BARRA_PASSO}
            largura={BARRA_LARGURA}
            cor={corDoTrecho(errado, fase)}
            parado={parado}
          />
        );
      })}
    </g>
  );
}

/**
 * O veredito do fim: o visto, o clarão verde e o degradê que os sublinha.
 *
 * O degradê entra JUNTO com o visto, e só nele: enquanto houver um trecho com
 * outro desenho, não há o que comemorar.
 */
function Veredito({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho x={VISTO_X} y={EIXO} raio={46} tinta="luzCerta" aceso parado={parado} />
      <Marca tipo="certo" x={VISTO_X} y={EIXO} cor={TINTA.protege} escala={1.05} parado={parado} />
      <FechoDoArco x={VISTO_X} y={EIXO + 14} escala={0.9} parado={parado} />
    </g>
  );
}

export default function MesmoEquipamento() {
  const { fase, parado } = useRoteiro(FASES, FECHOU);

  return (
    <MiniPalco fase={fase}>
      {/* O clarão branco só abre quando os três trechos estão na faixa: é o
          conjunto que fecha, e é ele o quadro que fica na cabeça de quem passou
          os olhos. */}
      <Brilho
        x={(PRIMEIRO_TRECHO_X + FAIXA_FIM) / 2}
        y={EIXO}
        raio={200}
        tinta="luz"
        aceso={fase >= FECHOU}
        parado={parado}
        achatar={0.34}
      />
      <Brilho x={APARELHO_MEIO_X} y={EIXO} raio={62} tinta="luz" aceso parado={parado} />
      <Lugar />
      <Trechos fase={fase} parado={parado} />
      <FaixaDosMinutos fase={fase} parado={parado} />
      <OutroLugar visivel={fase === INTRUSO} parado={parado} />
      {fase >= FECHOU && <Veredito parado={parado} />}
    </MiniPalco>
  );
}
