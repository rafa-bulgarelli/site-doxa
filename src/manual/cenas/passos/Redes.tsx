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
 * O texto do link é desenhado como BLOCOS, não como letra: uma URL escrita num
 * palco de 480 por 150 vira fiapo de 4px no celular, e ainda precisaria de
 * tradução. Bloco a bloco também é o que deixa o caractere errado ser UM ponto
 * na linha — que é a leitura "letra por letra" que o passo pede.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, QUEBRA, TracoDeLuz } from '../luz';
import { MiniPalco, Sinal } from '../itens/comuns';
import type { Rede } from '../itens/comuns';
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
const SINAL_X = 36;
const CAMPO_X = 64;
const CAMPO_LARGURA = 318;
const CAMPO_ALTURA = 30;
const LETRA_X = 82;
const LETRA_ALTURA = 9;
const VAO = 4;
const MARCA_X = 418;

/** As larguras dos blocos de texto — sortidas, para não virar código de barras. */
const LARGURAS = [7, 5, 9, 6, 4, 8, 5, 7, 6, 9, 5, 6, 8, 4, 7] as const;

/** Depois do quarto bloco entra a barra do endereço: é o que faz ler "link". */
const SEPARADOR = 3;

interface LinhaDoLink {
  readonly rede: Rede;
  readonly centro: number;
  readonly blocos: number;
  /** De onde a linha começa a ler `LARGURAS` — uma linha igual à outra denuncia. */
  readonly giro: number;
}

const LINHAS = [
  { rede: 'quadrado', centro: 30, blocos: 17, giro: 0 },
  { rede: 'anel', centro: 75, blocos: 20, giro: 4 },
  { rede: 'play', centro: 120, blocos: 15, giro: 9 },
] as const satisfies readonly LinhaDoLink[];

/** Qual linha entra torta, e em qual bloco. O erro é UM, e no meio da tela. */
const LINHA_ERRADA = 1;
const BLOCO_ERRADO = 9;

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

interface Bloco {
  readonly x: number;
  readonly largura: number;
}

/** Onde cada bloco cai, com o vão maior no lugar da barra do endereço. */
function blocosDaLinha(quantidade: number, giro: number): readonly Bloco[] {
  const saida: Bloco[] = [];
  let x = LETRA_X;
  for (let indice = 0; indice < quantidade; indice += 1) {
    const largura = LARGURAS[(indice + giro) % LARGURAS.length];
    saida.push({ x, largura });
    x += largura + VAO + (indice === SEPARADOR ? 9 : 0);
  }
  return saida;
}

interface BlocoDeTextoProps {
  readonly bloco: Bloco;
  readonly centro: number;
  readonly oculto: boolean;
  /** O bloco que ENTROU no lugar do errado — nasce branco para ser visto. */
  readonly trocado: boolean;
  readonly atraso: number;
  readonly parado: boolean;
}

/** Um "caractere" do link. Entra por opacidade, um atrás do outro. */
function BlocoDeTexto({ bloco, centro, oculto, trocado, atraso, parado }: BlocoDeTextoProps) {
  if (oculto) return null;
  return (
    <motion.rect
      x={bloco.x}
      y={centro - LETRA_ALTURA / 2}
      width={bloco.largura}
      height={LETRA_ALTURA}
      rx={3}
      fill={trocado ? TINTA.branco : TRACO_ACESO}
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.28), ease: EASE, delay: tempo(parado, atraso) }}
    />
  );
}

interface TextoProps {
  readonly linha: LinhaDoLink;
  readonly estado: Estado;
  readonly errada: boolean;
  /** A ordem da linha na pilha: é ela que escalona a entrada dos blocos. */
  readonly ordem: number;
  readonly parado: boolean;
}

/**
 * O link escrito em blocos — e, na linha torta, o caractere que não fecha.
 *
 * O bloco corrigido nasce BRANCO enquanto os vizinhos ficam no cinza do texto:
 * é o jeito de apontar "foi este aqui que mudou" sem uma seta, sem uma legenda
 * e sem gastar mais uma cor.
 */
function TextoDoLink({ linha, estado, errada, ordem, parado }: TextoProps) {
  if (estado === 'vazio') return null;
  const blocos = blocosDaLinha(linha.blocos, linha.giro);
  const atraso = ordem * 0.22;
  const trocando = errada && estado === 'corrigindo';
  return (
    <g>
      {/* O clarão BRANCO no lugar exato onde estava o xis: é ele que faz a
          correção ser vista: sem o clarão, o bloco novo entra no meio de
          dezenove iguais e a fase inteira passa sem ninguém notar. */}
      {trocando && (
        <Brilho
          x={blocos[BLOCO_ERRADO].x + 3}
          y={linha.centro}
          raio={40}
          tinta="luz"
          aceso
          parado={parado}
        />
      )}
      {blocos.map((bloco, indice) => (
        <BlocoDeTexto
          key={bloco.x}
          bloco={bloco}
          centro={linha.centro}
          // O bloco que quebrou não é desenhado: no lugar dele vai o xis.
          oculto={errada && estado === 'quebrado' && indice === BLOCO_ERRADO}
          trocado={errada && indice === BLOCO_ERRADO}
          atraso={atraso + indice * 0.04}
          parado={parado}
        />
      ))}
      <path
        d={`M ${blocos[SEPARADOR + 1].x - 6} ${linha.centro + 6} l 5 -12`}
        stroke={TINTA.apagado}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {errada && estado === 'quebrado' && (
        <CaractereTorto x={blocos[BLOCO_ERRADO].x + 3} y={linha.centro} parado={parado} />
      )}
    </g>
  );
}

/** O caractere que não serve: um xis vermelho no lugar do bloco, e o clarão. */
function CaractereTorto({ x, y, parado }: { x: number; y: number; parado: boolean }) {
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

/** Uma rede: o selo, o campo, o link em blocos e o veredito na ponta. */
function LinhaDeLink({ linha, ordem, estado, errada, parado }: LinhaProps) {
  const conferido = estado === 'conferido';
  const quebrado = estado === 'quebrado';
  return (
    <g>
      <Sinal
        rede={linha.rede}
        cx={SINAL_X}
        cy={linha.centro}
        cor={conferido ? TRACO_ACESO : TINTA.apagado}
        raio={13}
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
      <TextoDoLink
        linha={linha}
        estado={estado}
        errada={errada}
        ordem={ordem}
        parado={parado}
      />
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
