/**
 * ─── MINI-CENA DO PASSO: AS REDES (ON-0) ─────────────────────────────────────
 *
 * O passo: **cole os três links — Instagram, TikTok e YouTube — logo no começo,
 * conferidos letra por letra.**
 *
 * A história em uma frase: os três campos enchem, UM deles entra com um
 * caractere errado e acende a quebra, o caractere é trocado, e os três fecham
 * conferidos. A conferência é o assunto; o erro corrigido é o que faz a cena
 * ACONTECER — sem ele sobraria uma tela de formulário preenchendo sozinha, que
 * é exatamente a animação que já foi reprovada por "não fazer nada".
 *
 * ─── AS REGRAS QUE ESTA CENA HERDA DA CENA DO CLONE ──────────────────────────
 *
 * 1. **Monocromática na base.** Campo, moldura e "letras" são branco e grafite.
 *    Verde e vermelho só JULGAM: borda e carimbo do que passou, borda e xis do
 *    que quebrou. Cor que não julga nada é enfeite, e enfeite foi o que reprovou
 *    a primeira leva.
 * 2. **Um gesto por fase, lento.** Nada de varredura em loop por cima do campo:
 *    "fica escaneando e não faz nada" é o diagnóstico que não pode voltar.
 * 3. **O quadro final se sustenta parado.** É ele que quem pediu menos movimento
 *    recebe, e é ele que fica na cabeça de quem só passou os olhos.
 *
 * ─── POR QUE O TEXTO FOI REDESENHADO (revisão do dono) ───────────────────────
 *
 * O link continua sendo desenhado como BLOCOS, e não como letra: uma URL escrita
 * num palco de 480 por 150 vira fiapo de 4px no celular, e ainda precisaria de
 * tradução. Só que a primeira versão dava a cada bloco a MESMA altura, o mesmo
 * canto redondo e quase a mesma largura — e o dono leu o resultado pelo que ele
 * era: "parece código de barras".
 *
 * O que faz um borrão de texto parecer texto não é a variação de largura: é a
 * ESTRUTURA. Aqui ela está inteira, e é o que a versão nova acrescenta:
 *
 *   · **Palavras, não uma fileira.** As letras andam coladas (2,6 de vão) e as
 *     palavras se separam por um vão quase três vezes maior. Fileira de vão
 *     constante é código de barras; bloco de letra com respiro entre grupos é
 *     palavra.
 *   · **Linha de base, com quem sobe e quem desce.** Uma em cada quatro letras
 *     tem haste para cima e uma em cada sete desce abaixo da linha. É o
 *     serrilhado do miolo do texto que o olho reconhece de longe, mesmo sem ler.
 *   · **A gramática do endereço.** O `https` entra APAGADO — é a parte que
 *     ninguém digita —, e depois dele vêm as duas barras, o ponto do domínio e a
 *     barra do perfil, cada um no seu lugar. É isso que faz ler "link", e não
 *     "um monte de tracinhos".
 *   · **Canto quase reto.** Bloco com canto de 3 num corpo de 8 é uma pílula;
 *     em 1,5 ele volta a ser letra.
 *
 * E o selo de cada linha agora é o ÍCONE REAL da rede (`../redes`), sem o
 * círculo cinza em volta: o passo é sobre as três redes, e a forma genérica
 * enjaulada é o defeito que o dono nomeou duas vezes.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA, TracoDeLuz } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { IconeDaRede } from '../redes';
import type { RedeReal } from '../redes';
import { EASE, tempo, useRoteiro } from '../tempo';

/**
 * Os campos vazios · os links entram (e um quebra) · a correção · conferido.
 *
 * A última é mais que o dobro da primeira: é o quadro que ensina, e um quadro
 * que ensina precisa de tempo de sobra para ser lido antes de o loop recomeçar.
 */
const FASES = [1400, 1700, 1500, 3600] as const;
const DIGITADO = 1;
const CORRIGIDO = 2;
const CONFERIDO = 3;

/** A geometria da faixa: três linhas, num lugar só. */
const ICONE_X = 34;
const ICONE_TAMANHO = 26;
const CAMPO_X = 62;
const CAMPO_LARGURA = 320;
const CAMPO_ALTURA = 30;
const LETRA_X = 80;
const MARCA_X = 420;

/** O corpo da letra, e o quanto sobe uma haste e desce um rabo. */
const CORPO = 8;
const SOBE = 3.5;
const DESCE = 3;
/** Vão entre letras da mesma palavra, e vão entre palavras. */
const VAO_LETRA = 2.6;
const VAO_PALAVRA = 7;

/** As larguras, sortidas: da letra fina de uma haste à larga de duas pernas. */
const LARGURAS = [6, 4, 7, 5, 9, 3, 6, 8, 5, 7, 4, 6, 9, 5, 7, 3, 6, 5] as const;

/** Os pedaços de um endereço, na ordem em que ele se escreve. */
type TipoDePontuacao = 'ponto' | 'barra' | 'duasBarras';

interface Pedaco {
  readonly tipo: 'palavra' | TipoDePontuacao;
  /** Quantas letras, quando o pedaço é palavra. */
  readonly letras?: number;
  /** O `https` é apagado: é a parte do endereço que ninguém digita. */
  readonly apagada?: boolean;
}

/** O esqueleto comum: `https` apagado, as duas barras, e o resto por linha. */
const PREFIXO: readonly Pedaco[] = [
  { tipo: 'palavra', letras: 5, apagada: true },
  { tipo: 'duasBarras' },
];

/** Um endereço de perfil: domínio, ponto, `com`, barra e o nome do perfil. */
function endereco(dominio: number, perfil: number): readonly Pedaco[] {
  return [
    ...PREFIXO,
    { tipo: 'palavra', letras: dominio },
    { tipo: 'ponto' },
    { tipo: 'palavra', letras: 3 },
    { tipo: 'barra' },
    { tipo: 'palavra', letras: perfil },
  ];
}

interface LinhaDoLink {
  readonly rede: RedeReal;
  readonly centro: number;
  readonly pedacos: readonly Pedaco[];
  /** De onde a linha começa a ler `LARGURAS` — uma linha igual à outra denuncia. */
  readonly giro: number;
}

const LINHAS: readonly LinhaDoLink[] = [
  { rede: 'youtube', centro: 30, pedacos: endereco(7, 8), giro: 0 },
  { rede: 'tiktok', centro: 75, pedacos: endereco(6, 9), giro: 5 },
  { rede: 'instagram', centro: 120, pedacos: endereco(9, 6), giro: 11 },
];

/** Qual linha entra torta. O erro é UM, e no meio da tela. */
const LINHA_ERRADA = 1;

/** O que a linha é AGORA — a fase e o estado num lugar só, nunca acumulados. */
type Estado = 'vazio' | 'quebrado' | 'corrigindo' | 'conferido';

function estadoDaLinha(fase: number, errada: boolean): Estado {
  if (fase < DIGITADO) return 'vazio';
  if (!errada) return 'conferido';
  switch (fase) {
    case DIGITADO:
      return 'quebrado';
    case CORRIGIDO:
      return 'corrigindo';
    default:
      return 'conferido';
  }
}

/**
 * A borda do campo.
 *
 * Enquanto ninguém conferiu, ela é MUDA: campo verde na fase 0 já daria a
 * resposta que a cena leva três segundos para dar. E a linha em correção volta
 * ao branco — ela não é mais um erro, e ainda não é um acerto.
 */
function bordaDoCampo(estado: Estado): string {
  switch (estado) {
    case 'vazio':
      return TRACO;
    case 'quebrado':
      return QUEBRA;
    case 'corrigindo':
      return TRACO_ACESO;
    default:
      return TINTA.protege;
  }
}

interface Letra {
  readonly x: number;
  readonly largura: number;
  /** O topo da letra, medido do centro da linha: quem sobe começa mais alto. */
  readonly topo: number;
  readonly altura: number;
  readonly apagada: boolean;
}

interface Separador {
  readonly tipo: TipoDePontuacao;
  readonly x: number;
}

interface Escrita {
  readonly letras: readonly Letra[];
  readonly separadores: readonly Separador[];
}

/** A largura que cada sinal de pontuação ocupa antes do próximo pedaço. */
const LARGURA_DA_PONTUACAO: Record<TipoDePontuacao, number> = {
  ponto: 4,
  barra: 6,
  duasBarras: 12,
};

/** A letra número `ordem` da escrita: largura sorteada, haste e rabo por ritmo. */
function letraDe(x: number, ordem: number, apagada: boolean): Letra {
  const largura = LARGURAS[ordem % LARGURAS.length];
  // Uma em cada quatro sobe e uma em cada sete desce: é o serrilhado do miolo
  // do texto, e é ele que o olho reconhece como escrita antes de ler qualquer
  // coisa. Sem isso, blocos de mesma altura em fila são código de barras.
  const sobe = ordem % 4 === 1 ? SOBE : 0;
  const desce = ordem % 7 === 3 ? DESCE : 0;
  return { x, largura, topo: -CORPO / 2 - sobe, altura: CORPO + sobe + desce, apagada };
}

/** O endereço inteiro em coordenadas: onde cai cada letra e cada pontuação. */
function escrever(pedacos: readonly Pedaco[], giro: number): Escrita {
  const letras: Letra[] = [];
  const separadores: Separador[] = [];
  let x = LETRA_X;
  for (const pedaco of pedacos) {
    if (pedaco.tipo === 'palavra') {
      const quantas = pedaco.letras ?? 0;
      for (let indice = 0; indice < quantas; indice += 1) {
        const letra = letraDe(x, letras.length + giro, pedaco.apagada === true);
        letras.push(letra);
        x += letra.largura + VAO_LETRA;
      }
      x += VAO_PALAVRA - VAO_LETRA;
      continue;
    }
    separadores.push({ tipo: pedaco.tipo, x });
    x += LARGURA_DA_PONTUACAO[pedaco.tipo] + VAO_PALAVRA;
  }
  return { letras, separadores };
}

/**
 * Qual letra entra torta: a quinta contada do fim, dentro do nome do perfil.
 *
 * Contar do fim é o que mantém o erro no NOME — a parte que se digita — em
 * qualquer linha, sem depender de quantas letras o domínio tem.
 */
function indiceDaQuebra(total: number): number {
  return Math.max(0, total - 5);
}

interface LetraProps {
  readonly letra: Letra;
  readonly centro: number;
  readonly oculta: boolean;
  /** A letra que ENTROU no lugar da errada — nasce branca para ser vista. */
  readonly trocada: boolean;
  readonly atraso: number;
  readonly parado: boolean;
}

/** Uma "letra" do link. Entra por opacidade, uma atrás da outra. */
function LetraDoLink({ letra, centro, oculta, trocada, atraso, parado }: LetraProps) {
  if (oculta) return null;
  const cor = trocada ? TINTA.branco : letra.apagada ? TINTA.apagado : TRACO_ACESO;
  return (
    <motion.rect
      x={letra.x}
      y={centro + letra.topo}
      width={letra.largura}
      height={letra.altura}
      // Canto quase reto: em 3 o bloco vira pílula, e pílula em fila é o
      // código de barras que o dono viu na primeira versão.
      rx={1.5}
      fill={cor}
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.24), ease: EASE, delay: tempo(parado, atraso) }}
    />
  );
}

/** O ponto do domínio e as barras do endereço — a gramática que diz "link". */
function Pontuacao({ separador, centro }: { separador: Separador; centro: number }) {
  const base = centro + CORPO / 2;
  if (separador.tipo === 'ponto') {
    return <rect x={separador.x} y={base - 2.6} width={2.6} height={2.6} fill={TINTA.apagado} />;
  }
  const barras = separador.tipo === 'duasBarras' ? [0, 6] : [0];
  return (
    <g>
      {barras.map((deslocamento) => (
        <path
          key={deslocamento}
          d={`M ${separador.x + deslocamento} ${base + 1} l 5 ${-CORPO - 4}`}
          stroke={TINTA.apagado}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

interface TextoProps {
  readonly linha: LinhaDoLink;
  readonly estado: Estado;
  readonly errada: boolean;
  /** A ordem da linha na pilha: é ela que escalona a entrada das letras. */
  readonly ordem: number;
  readonly parado: boolean;
}

/**
 * O link escrito em blocos — e, na linha torta, a letra que não fecha.
 *
 * A letra corrigida nasce BRANCA enquanto as vizinhas ficam no cinza do texto:
 * é o jeito de apontar "foi esta aqui que mudou" sem uma seta, sem uma legenda
 * e sem gastar mais uma cor.
 */
function TextoDoLink({ linha, estado, errada, ordem, parado }: TextoProps) {
  if (estado === 'vazio') return null;
  const { letras, separadores } = escrever(linha.pedacos, linha.giro);
  const quebrada = indiceDaQuebra(letras.length);
  const atraso = ordem * 0.2;
  return (
    <g>
      {/* O clarão BRANCO no lugar exato onde estava o xis: é ele que faz a
          correção ser vista — sem o clarão, a letra nova entra no meio de trinta
          iguais e a fase inteira passa sem ninguém notar. */}
      {errada && estado === 'corrigindo' && (
        <Brilho
          x={letras[quebrada].x + 3}
          y={linha.centro}
          raio={40}
          tinta="luz"
          aceso
          parado={parado}
        />
      )}
      {separadores.map((separador) => (
        <Pontuacao
          key={`${separador.tipo}-${separador.x}`}
          separador={separador}
          centro={linha.centro}
        />
      ))}
      {letras.map((letra, indice) => (
        <LetraDoLink
          key={letra.x}
          letra={letra}
          centro={linha.centro}
          // A letra que quebrou não é desenhada: no lugar dela vai o xis.
          oculta={errada && estado === 'quebrado' && indice === quebrada}
          trocada={errada && indice === quebrada}
          atraso={atraso + indice * 0.028}
          parado={parado}
        />
      ))}
      {errada && estado === 'quebrado' && (
        <LetraTorta x={letras[quebrada].x + 3} y={linha.centro} parado={parado} />
      )}
    </g>
  );
}

/** A letra que não serve: um xis vermelho no lugar do bloco, e o clarão. */
function LetraTorta({ x, y, parado }: { x: number; y: number; parado: boolean }) {
  return (
    <g>
      <Brilho x={x} y={y} raio={38} tinta="luzQuebra" aceso parado={parado} />
      <g transform={`translate(${x} ${y})`}>
        <TracoDeLuz
          d="M -5 -7 L 5 7 M 5 -7 L -5 7"
          cor={QUEBRA}
          largura={2.2}
          halo={2.2}
          parado={parado}
          riscando
          duracao={0.45}
        />
      </g>
    </g>
  );
}

interface LinhaProps {
  readonly linha: LinhaDoLink;
  readonly ordem: number;
  readonly estado: Estado;
  readonly errada: boolean;
  readonly parado: boolean;
}

/** Uma rede: o ícone, o campo, o link em blocos e o veredito na ponta. */
function LinhaDeLink({ linha, ordem, estado, errada, parado }: LinhaProps) {
  const conferido = estado === 'conferido';
  const quebrado = estado === 'quebrado';
  return (
    <g>
      <IconeDaRede
        rede={linha.rede}
        x={ICONE_X}
        y={linha.centro}
        tamanho={ICONE_TAMANHO}
        cor={conferido ? TRACO_ACESO : TINTA.apagado}
      />
      <Painel
        x={CAMPO_X}
        y={linha.centro - CAMPO_ALTURA / 2}
        largura={CAMPO_LARGURA}
        altura={CAMPO_ALTURA}
        cor={bordaDoCampo(estado)}
        vidro={conferido}
        raio={9}
      />
      <TextoDoLink linha={linha} estado={estado} errada={errada} ordem={ordem} parado={parado} />
      {(conferido || quebrado) && (
        <Marca
          tipo={conferido ? 'certo' : 'errado'}
          x={MARCA_X}
          y={linha.centro}
          escala={0.82}
          cor={conferido ? TINTA.protege : QUEBRA}
          parado={parado}
        />
      )}
    </g>
  );
}

export default function Redes() {
  const { fase, parado } = useRoteiro(FASES, CONFERIDO);

  return (
    <MiniPalco fase={fase}>
      {/* O clarão do fim é BRANCO: aqui "acender" é luz, e o verde fica com a
          borda e o carimbo — que são quem de fato confere. */}
      <Brilho
        x={230}
        y={75}
        raio={250}
        tinta="luz"
        aceso={fase >= CONFERIDO}
        parado={parado}
        achatar={0.3}
      />
      {LINHAS.map((linha, ordem) => (
        <LinhaDeLink
          key={linha.rede}
          linha={linha}
          ordem={ordem}
          estado={estadoDaLinha(fase, ordem === LINHA_ERRADA)}
          errada={ordem === LINHA_ERRADA}
          parado={parado}
        />
      ))}
    </MiniPalco>
  );
}
