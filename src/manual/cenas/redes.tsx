/**
 * ─── OS ÍCONES REAIS DAS REDES ───────────────────────────────────────────────
 *
 * O dono olhou três animações diferentes e nomeou o MESMO defeito duas vezes: o
 * sinal de rede era uma forma genérica presa dentro de um círculo cinza, e o
 * ícone ficava "afogado", "enforcado". O círculo era a jaula. Aqui ele não
 * existe: cada rede é o seu glifo de verdade — o retângulo do YouTube, a nota
 * do TikTok, a moldura com a lente do Instagram —, desenhado solto, com o
 * respiro que ele mesmo já tem.
 *
 * ─── QUATRO DECISÕES QUE AS TRÊS CENAS HERDAM ────────────────────────────────
 *
 * 1. **Uma peça só.** Três cenas importam DAQUI. Ícone torto num arquivo é um
 *    conserto; o mesmo ícone copiado em três cenas é três consertos e duas
 *    versões esquecidas.
 *
 * 2. **Tudo é `<path>`.** Nenhum `<circle>`, nenhum `<rect>`, nenhum `<text>` —
 *    inclusive as formas que seriam naturais como círculo (a lente, a cabeça da
 *    nota). O motivo é o defeito: enquanto não houver um `<circle>` no markup
 *    deste arquivo, o círculo-jaula não volta por descuido, e o teste consegue
 *    cobrar isso numa linha em vez de medir raio.
 *
 * 3. **Sem `<defs>`, sem gradiente, sem filtro.** `id` de gradiente é global no
 *    documento e o mesmo ícone aparece três vezes na mesma página — dois deles
 *    pintariam com a paleta do primeiro, ou com nada. Cor CHAPADA resolve, e o
 *    halo, quando a cena quiser, vem do `Brilho` de `luz.tsx` por trás.
 *
 * 4. **Mono agora, marca depois — em UMA linha.** O que vai ao ar é
 *    monocromático: o ícone recebe a tinta do ESTADO que a cena manda (apagado
 *    `TINTA.linha`, aceso `TRACO_ACESO`), do mesmo jeito que qualquer outro
 *    traço do palco. A variante colorida existe pronta em `COR_DA_MARCA`, e
 *    ligá-la é virar `USAR_COR_DA_MARCA` para `true` AQUI — nenhuma cena muda.
 *    Colorido sem função não é elegante; a decisão é do dono, olhando.
 */

/** As três redes onde a regra do manual fala. */
export type RedeReal = 'youtube' | 'tiktok' | 'instagram';

/**
 * A cor de cada marca, CHAPADA.
 *
 * O Instagram de verdade é um degradê de quatro paradas, e é exatamente ele que
 * fica de fora: gradiente de marca dentro de uma cena preta lê como festa, e
 * festa reprova. Fica o rosa do fim do arco, que é o que as pessoas reconhecem.
 */
export const COR_DA_MARCA: Record<RedeReal, string> = {
  youtube: '#FF0033',
  tiktok: '#25F4EE',
  instagram: '#E1306C',
};

/**
 * O interruptor mono × cor-da-marca — a linha única do item 4 do cabeçalho.
 *
 * Em `true`, um ícone ACESO pinta com `COR_DA_MARCA`; o apagado continua mono,
 * porque rede apagada colorida seria cor sem significado nenhum.
 */
export const USAR_COR_DA_MARCA = false;

/**
 * A caixa em que os três glifos são desenhados, centrada na origem: de -12 a 12
 * nos dois eixos.
 *
 * Os três ocupam a MESMA caixa, e não a mesma altura: o glifo do YouTube é
 * largo e baixo, o da nota é estreito e alto. Igualar a altura dos três faria o
 * YouTube ficar quase 50% mais largo que o Instagram e roubar a linha — a caixa
 * comum é o que dá a eles o mesmo peso no olho.
 */
const CAIXA = 24;

/** A espessura do contorno, em unidades da caixa — escala junto com o ícone. */
const TRACO_DO_GLIFO = 2;

interface Glifo {
  /** Os caminhos de contorno: desenhados com traço, sem preenchimento. */
  readonly contorno: readonly string[];
  /** Os caminhos cheios: o play, a cabeça da nota, o ponto da lente. */
  readonly cheio: readonly string[];
}

/**
 * O desenho de cada rede, na origem.
 *
 * Contorno para o corpo e cheio para o miolo é o mesmo par que o resto do palco
 * usa (o microfone de `CenaVoz`, a nota de `Ruido`): é isso que faz o ícone
 * "ornar" com os traços em volta em vez de parecer um adesivo colado na cena.
 */
const GLIFOS: Record<RedeReal, Glifo> = {
  // A tela larga de cantos muito arredondados (24 × 16,8) e o play no meio. O
  // triângulo vai um fio à direita do centro geométrico: ponta para a direita
  // parece descentrada quando é centrada na régua.
  youtube: {
    contorno: [
      'M -6.4 -8.4 H 6.4 A 5.6 5.6 0 0 1 12 -2.8 V 2.8 A 5.6 5.6 0 0 1 6.4 8.4' +
        ' H -6.4 A 5.6 5.6 0 0 1 -12 2.8 V -2.8 A 5.6 5.6 0 0 1 -6.4 -8.4 Z',
    ],
    cheio: ['M -4 -5 L 4.8 0 L -4 5 Z'],
  },
  // A colcheia: a haste sobe e vira o gancho num quarto de volta; a cabeça é o
  // disco embaixo, à esquerda, encostando na haste pela borda direita — os dois
  // juntos são o "d" que a marca desenha.
  tiktok: {
    contorno: ['M 1.2 5.2 V -10.4 A 6.5 6.5 0 0 1 7.7 -3.9'],
    cheio: ['M -9 5.2 A 5.7 5.7 0 1 0 2.4 5.2 A 5.7 5.7 0 1 0 -9 5.2 Z'],
  },
  // A moldura quadrada (22 × 22), a lente no centro e o ponto no alto à
  // direita. O ponto fica a 0,7 de folga da lente: encostado, ele viraria uma
  // borra só nos 34 pixels em que a cena desenha isto no celular.
  instagram: {
    contorno: [
      'M -4.5 -11 H 4.5 A 6.5 6.5 0 0 1 11 -4.5 V 4.5 A 6.5 6.5 0 0 1 4.5 11' +
        ' H -4.5 A 6.5 6.5 0 0 1 -11 4.5 V -4.5 A 6.5 6.5 0 0 1 -4.5 -11 Z',
      'M -5.6 0 A 5.6 5.6 0 1 0 5.6 0 A 5.6 5.6 0 1 0 -5.6 0 Z',
    ],
    cheio: ['M 6.3 -7.8 A 1.5 1.5 0 1 0 6.3 -4.8 A 1.5 1.5 0 1 0 6.3 -7.8 Z'],
  },
};

interface IconeDaRedeProps {
  readonly rede: RedeReal;
  /** O centro do ícone no palco — o glifo é desenhado em volta deste ponto. */
  readonly x: number;
  readonly y: number;
  /** O lado da caixa que inscreve o glifo, nas unidades do `viewBox` da cena. */
  readonly tamanho?: number;
  /** A tinta do estado, escolhida pela cena: apagado, aceso, certo, quebra. */
  readonly cor: string;
  /** Aceso é a rede que tem a vez. Só ela ganha a cor da marca, e só no modo. */
  readonly acesa?: boolean;
  /**
   * A saída de emergência do interruptor de módulo.
   *
   * Existe para a folha de comparação que o dono olha no gate e para o teste
   * cobrar as duas variantes sem reescrever `USAR_COR_DA_MARCA` — mexer numa
   * constante de módulo dentro de um teste é o tipo de coisa que vaza para o
   * teste seguinte. Nenhuma CENA passa esta prop: a decisão é de uma linha só,
   * e ela mora aqui em cima.
   */
  readonly usarCorDaMarca?: boolean;
}

/**
 * O ícone de uma rede, centrado em (x, y).
 *
 * Sem moldura, sem anel, sem fundo: o que entra na cena é o glifo e mais nada.
 * Quem quiser luz atrás põe um `Brilho` de `luz.tsx` no mesmo ponto.
 */
export function IconeDaRede({
  rede,
  x,
  y,
  tamanho = 34,
  cor,
  acesa = true,
  usarCorDaMarca = USAR_COR_DA_MARCA,
}: IconeDaRedeProps) {
  const glifo = GLIFOS[rede];
  const tinta = usarCorDaMarca && acesa ? COR_DA_MARCA[rede] : cor;
  // O deslocamento e a escala moram no grupo de FORA, e o desenho fica na
  // origem: é a mesma regra do `Selo` e da `Marca` — quando a cena animar este
  // ícone, o framer escreve `transform` no nó que anima e apagaria um translate
  // que estivesse ali.
  return (
    <g transform={`translate(${x} ${y}) scale(${tamanho / CAIXA})`}>
      {glifo.contorno.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={tinta}
          strokeWidth={TRACO_DO_GLIFO}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {glifo.cheio.map((d) => (
        <path key={d} d={d} fill={tinta} />
      ))}
    </g>
  );
}

/** As três, na ordem em que a regra do manual as nomeia. */
export const REDES_REAIS: readonly RedeReal[] = ['youtube', 'tiktok', 'instagram'];
