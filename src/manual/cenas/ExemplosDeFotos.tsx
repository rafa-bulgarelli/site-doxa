/**
 * ─── QUE FOTO SERVE, QUE FOTO NÃO SERVE ──────────────────────────────────────
 *
 * O quadro mais mastigado do manual, e o que economiza mais ida e volta: a
 * pergunta "essa serve?" chega TODA semana, e ela chega porque a instrução em
 * texto ("foto nítida, de frente, com boa luz") não descreve nenhuma foto que a
 * pessoa tenha na mão. Um retrato ao lado da palavra descreve.
 *
 * Três decisões que este arquivo carrega:
 *
 * 1. **O motivo é UMA palavra.** "Escura", "óculos", "filtro". Frase explicando
 *    por que a foto escura não serve é frase que ninguém lê num quadro de oito
 *    cartões — e a palavra basta para a pessoa olhar a própria foto e decidir.
 *
 * 2. **Aqui o texto NÃO é decorativo.** As cenas do manual são `aria-hidden`
 *    inteiras; este quadro não é uma cena. Os rótulos e os títulos dos dois
 *    grupos são a informação, então quem usa leitor de tela recebe "Serve:
 *    frontal, boa luz…" em palavras. Só os DESENHOS ficam escondidos.
 *
 * 3. **Os retratos são provisórios por desenho.** O dono vai mandar fotos de
 *    verdade; trocar é substituir `<Retrato>` por `<img>` dentro do mesmo
 *    quadrado — a moldura, o selo e o rótulo continuam onde estão.
 */
import { useId } from 'react';
import { CORES } from '../../components/faq/cores';

/** O que cada retrato ilustra — a feição é o argumento do cartão. */
type Feicao =
  | 'frontal'
  | 'luz'
  | 'sorriso'
  | 'fundo'
  | 'escura'
  | 'oculos'
  | 'filtro'
  | 'longe'
  | 'borrada';

interface Exemplo {
  readonly feicao: Feicao;
  /** O rótulo do cartão: uma palavra, ou duas quando a segunda é inevitável. */
  readonly rotulo: string;
}

const SERVE: readonly Exemplo[] = [
  { feicao: 'frontal', rotulo: 'De frente' },
  { feicao: 'luz', rotulo: 'Boa luz' },
  { feicao: 'sorriso', rotulo: 'Sorrindo' },
  { feicao: 'fundo', rotulo: 'Fundo limpo' },
];

const NAO_SERVE: readonly Exemplo[] = [
  { feicao: 'escura', rotulo: 'Escura' },
  { feicao: 'oculos', rotulo: 'Óculos' },
  { feicao: 'filtro', rotulo: 'Filtro' },
  { feicao: 'longe', rotulo: 'Longe' },
  { feicao: 'borrada', rotulo: 'Borrada' },
];

const VERDE = '#34D399';
const VERMELHO = '#F87171';

/* ─── O RETRATO ────────────────────────────────────────────────────────────── */

/** A boca: fechada, ou aberta com os dentes à mostra. */
function Boca({ sorrindo, cor }: { sorrindo: boolean; cor: string }) {
  if (!sorrindo) {
    return <path d="M 40 58 q 10 7 20 0" fill="none" stroke={cor} strokeWidth={2.4} strokeLinecap="round" />;
  }
  return (
    <g>
      <path d="M 38 56 q 12 16 24 0 z" fill="none" stroke={cor} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M 39.5 57.5 h 21" stroke={cor} strokeWidth={3.4} strokeLinecap="round" />
    </g>
  );
}

interface CabecaProps {
  readonly cor: string;
  readonly sorrindo: boolean;
  readonly oculos: boolean;
}

/** Cabeça, ombros, olhos — o mesmo desenho em todos os nove cartões. */
function Cabeca({ cor, sorrindo, oculos }: CabecaProps) {
  return (
    <g fill="none" stroke={cor} strokeWidth={2.6} strokeLinecap="round">
      <circle cx={50} cy={46} r={27} />
      <path d="M 14 116 a 36 32 0 0 1 72 0" />
      {oculos ? (
        <g>
          <rect x={31} y={36} width={17} height={13} rx={4} fill={cor} stroke="none" />
          <rect x={52} y={36} width={17} height={13} rx={4} fill={cor} stroke="none" />
          <path d="M 48 41 h 4" />
        </g>
      ) : (
        <g>
          <path d="M 40 41 v 3" />
          <path d="M 60 41 v 3" />
        </g>
      )}
      <Boca sorrindo={sorrindo} cor={cor} />
    </g>
  );
}

/** Quantas vezes o rosto é redesenhado, e com que desvio — o borrão sem filtro. */
const BORRAO = [
  { dx: -2.5, opacidade: 0.35 },
  { dx: 2.5, opacidade: 0.35 },
  { dx: 0, opacidade: 0.55 },
] as const;

/**
 * O retrato ilustrado de um exemplo.
 *
 * O borrão é feito com três cópias deslocadas, e não com `feGaussianBlur`: o
 * filtro custa uma passada de renderização por cartão, e são nove cartões numa
 * página que já carrega cena animada. Três traços dão a mesma leitura.
 */
function Retrato({ feicao }: { feicao: Feicao }) {
  const id = `filtro${useId().replace(/:/g, '')}`;
  const clara = feicao !== 'escura';
  const cor = clara ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.2)';
  const escala = feicao === 'longe' ? 'translate(28 34) scale(0.44)' : undefined;
  return (
    <svg aria-hidden viewBox="0 0 100 120" className="h-full w-full" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          {CORES.map((tom, indice) => (
            <stop key={tom} offset={`${(indice * 100) / (CORES.length - 1)}%`} stopColor={tom} />
          ))}
        </linearGradient>
      </defs>
      {/* A luz vem de cima; o fundo limpo é a parede sem nada atrás. Cada cartão
          do grupo "serve" precisa de UM sinal próprio, ou os quatro viram o
          mesmo rosto com quatro legendas. */}
      {feicao === 'luz' && <ellipse cx={50} cy={30} rx={54} ry={40} fill="rgba(255,255,255,0.12)" />}
      {feicao === 'fundo' && <rect width={100} height={120} fill="rgba(255,255,255,0.05)" />}
      <g transform={escala}>
        {feicao === 'borrada' ? (
          BORRAO.map(({ dx, opacidade }) => (
            <g key={dx} transform={`translate(${dx} 0)`} opacity={opacidade}>
              <Cabeca cor={cor} sorrindo={false} oculos={false} />
            </g>
          ))
        ) : (
          <Cabeca
            cor={cor}
            sorrindo={feicao === 'sorriso'}
            oculos={feicao === 'oculos'}
          />
        )}
      </g>
      {feicao === 'filtro' && <rect width={100} height={120} fill={`url(#${id})`} opacity={0.45} />}
    </svg>
  );
}

/* ─── O CARTÃO E OS DOIS GRUPOS ────────────────────────────────────────────── */

/** O selo do veredito: o visto verde ou o xis vermelho, sempre com a palavra. */
function Selo({ serve }: { serve: boolean }) {
  const cor = serve ? VERDE : VERMELHO;
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0" focusable="false">
      <circle cx={12} cy={12} r={11} fill="none" stroke={cor} strokeWidth={1.6} />
      <path
        d={serve ? 'M 7 12.5 l 3.4 3.4 L 17 8.6' : 'M 8 8 l 8 8 M 16 8 l -8 8'}
        fill="none"
        stroke={cor}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cartao({ exemplo, serve }: { exemplo: Exemplo; serve: boolean }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-doxa-line bg-doxa-surface">
      <div className="aspect-[4/5] w-full bg-doxa-raised">
        <Retrato feicao={exemplo.feicao} />
      </div>
      <div className="flex items-center gap-2 px-3 py-3">
        <Selo serve={serve} />
        <span className="text-[16px] leading-tight text-white/80">{exemplo.rotulo}</span>
      </div>
    </li>
  );
}

function Grupo({
  titulo,
  serve,
  exemplos,
}: {
  titulo: string;
  serve: boolean;
  exemplos: readonly Exemplo[];
}) {
  return (
    <section>
      <h4 className="flex items-center gap-2 text-[17px] font-medium text-white/85">
        <Selo serve={serve} />
        {titulo}
      </h4>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {exemplos.map((exemplo) => (
          <Cartao key={exemplo.feicao} exemplo={exemplo} serve={serve} />
        ))}
      </ul>
    </section>
  );
}

export default function ExemplosDeFotos() {
  return (
    <div className="space-y-8">
      <Grupo titulo="Assim serve" serve exemplos={SERVE} />
      <Grupo titulo="Assim não serve" serve={false} exemplos={NAO_SERVE} />
    </div>
  );
}
