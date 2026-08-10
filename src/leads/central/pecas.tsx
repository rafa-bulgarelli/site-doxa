/**
 * ─── AS PEÇAS DA CENTRAL ─────────────────────────────────────────────────────
 *
 * Os pedaços pequenos que aparecem em mais de um lugar. Ficam juntos porque
 * cada um tem quinze linhas e um arquivo por peça seria uma pasta de imports.
 *
 * ─── A COR, e por que ela existe aqui ────────────────────────────────────────
 *
 * O site é monocromático por regra (`tailwind.config`), e esta página quebra a
 * regra em dois lugares: o OURO do score e o VERDE do preenchido. É a exceção
 * certa e é a mesma da comparação — aqui a cor não decora, ela É o dado. Um
 * painel de trabalho lido cem vezes por dia precisa que "quatro estrelas" e
 * "sem WhatsApp" se leiam antes da palavra. E ela não vaza: nada disto é
 * importado pela landing.
 */
import { Check, Star } from 'lucide-react';
import { EIXOS, ROTULO, type Eixo } from '../score';

export const OURO = '#E8B93F';
export const VERDE = '#3FA06A';

/** As cinco estrelas do score. */
export function Estrelas({ quantas, tamanho = 14 }: { quantas: number; tamanho?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${quantas} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={tamanho}
          height={tamanho}
          className="shrink-0"
          style={{
            fill: i <= quantas ? OURO : 'transparent',
            color: i <= quantas ? OURO : 'rgba(255,255,255,0.18)',
          }}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

/** O cartão de número grande do topo. */
export function Contador({
  rotulo,
  valor,
  ativo = false,
}: {
  rotulo: string;
  valor: number;
  ativo?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors sm:p-6 ${
        ativo ? 'border-white/[0.18] bg-white/[0.05]' : 'border-white/[0.08] bg-white/[0.02]'
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">{rotulo}</p>
      {/* Tabular para os números não dançarem quando a lista atualiza. */}
      <p className="mt-2 font-serif text-[2.6rem] leading-none tabular-nums text-white">{valor}</p>
    </div>
  );
}

/** "Preenchido" / "—", a coluna de presença de dado. */
export function Presenca({ tem, rotulo }: { tem: boolean; rotulo: string }) {
  if (!tem) {
    return (
      <span className="text-[13px] text-white/25">
        —<span className="sr-only"> sem {rotulo}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: VERDE }}>
      <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
      Preenchido<span className="sr-only"> — {rotulo}</span>
    </span>
  );
}

/** A pílula de origem. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[12px] leading-none text-white/70">
      {children}
    </span>
  );
}

/** Uma barra de eixo do score, como na referência. */
export function Barra({ eixo, valor }: { eixo: Eixo; valor: number }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] uppercase tracking-[0.12em] text-white/45">
          {ROTULO[eixo]}
        </span>
        <span className="font-semibold tabular-nums text-white">{valor}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${valor * 10}%`, background: OURO }}
        />
      </div>
    </div>
  );
}

/**
 * O radar dos sete eixos, em SVG puro.
 *
 * Escrito à mão em vez de uma biblioteca de gráficos: são sete pontos numa
 * circunferência e dois polígonos. Qualquer pacote de charts custaria mais
 * quilobytes do que este arquivo inteiro para desenhar isto.
 */
export function Radar({ eixos, tamanho = 240 }: { eixos: Record<Eixo, number>; tamanho?: number }) {
  const centro = tamanho / 2;
  // O raio deixa margem para os rótulos, que são desenhados fora do polígono.
  const raio = centro - 34;
  const ponto = (i: number, escala: number) => {
    // Começa no topo (−90°) e anda no sentido horário, que é como se lê.
    const angulo = (Math.PI * 2 * i) / EIXOS.length - Math.PI / 2;
    return [centro + Math.cos(angulo) * raio * escala, centro + Math.sin(angulo) * raio * escala];
  };

  const contorno = EIXOS.map((e, i) => ponto(i, Math.max(eixos[e], 0.5) / 10).join(',')).join(' ');

  return (
    <svg
      /* A caixa é mais larga do que o desenho, e é o conserto de um corte real:
         os rótulos são desenhados FORA do polígono, e "AUTORIDADE" e "PRESENÇA"
         — os dois mais compridos — caem nos extremos horizontais. Com a caixa
         justa, os dois apareciam sem a primeira letra (a própria referência que
         o dono mandou tem esse defeito: lá se lê "ESENÇA"). O respiro é só na
         horizontal porque é lá que os rótulos são largos. */
      viewBox={`-42 -4 ${tamanho + 84} ${tamanho + 8}`}
      className="h-auto w-full max-w-[280px]"
      role="img"
      aria-label="Gráfico dos sete eixos do score"
    >
      {/* As teias de fundo: quatro anéis e os raios. */}
      {[0.25, 0.5, 0.75, 1].map((escala) => (
        <polygon
          key={escala}
          points={EIXOS.map((_, i) => ponto(i, escala).join(',')).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={1}
        />
      ))}
      {EIXOS.map((_, i) => {
        const [x, y] = ponto(i, 1);
        return (
          <line
            key={i}
            x1={centro}
            y1={centro}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        );
      })}

      <polygon points={contorno} fill={`${OURO}38`} stroke={OURO} strokeWidth={1.5} />

      {EIXOS.map((e, i) => {
        const [x, y] = ponto(i, 1.2);
        return (
          <text
            key={e}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/40 text-[9px] uppercase"
            style={{ letterSpacing: '0.08em' }}
          >
            {ROTULO[e]}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * Quanto tempo faz, em português curto.
 *
 * "há 39d 17h" é o formato da referência, e ele é melhor do que a data para o
 * que esta coluna responde: a pergunta do consultor é "esfriou?", não "que dia
 * foi?". A data completa fica no detalhe.
 */
export function quandoFoi(iso: string): string {
  const minutos = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h ${minutos % 60}min`;
  const dias = Math.floor(horas / 24);
  return `há ${dias}d ${horas % 24}h`;
}

/** A data por extenso, para o detalhe. */
export function dataCompleta(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
}
