import type { Idioma } from '../../idioma';

/**
 * ─── AS BANDEIRAS DA LINHA DE IDIOMAS ────────────────────────────────────────
 *
 * Três SVG desenhados à mão, e não emoji.
 *
 * `🇧🇷` parece a escolha óbvia e é a errada: bandeira em emoji NÃO EXISTE no
 * Windows. A fonte do sistema não traz esses glifos, e o que o navegador
 * desenha no lugar são as duas letras do código do país numa caixinha — "BR",
 * "US", "ES". Metade dos visitantes veria uma sigla onde deveria haver uma
 * bandeira, e nada no código diria por quê. Fora isso, cada plataforma desenha
 * as suas com um traço próprio, então nem entre quem as tem o resultado é o
 * mesmo.
 *
 * Desenhadas, são idênticas em todo lugar e custam zero pedido de rede.
 *
 * SIMPLIFICADAS de propósito, para 20 × 14 pixels: as 27 estrelas do Brasil, a
 * legenda "ORDEM E PROGRESSO", as 50 dos Estados Unidos e o brasão da Espanha
 * viram sujeira nesse tamanho. Fica o que identifica cada uma à distância —
 * campo, forma central e proporção. As cores são as oficiais, e OPACAS: uma
 * bandeira desbotada não é uma bandeira discreta, é uma bandeira errada.
 */

/**
 * Inglês leva a bandeira dos ESTADOS UNIDOS, e a escolha não é neutra.
 *
 * Idioma não tem bandeira — inglês é a língua de dezenas de países, e escolher
 * uma é sempre escolher um mercado. Aqui o mercado é os Estados Unidos, que é
 * para onde este site olha quando fala inglês. Se um dia for o Reino Unido, é
 * este comentário que muda junto com o desenho.
 */
const DESENHOS: Readonly<Record<Idioma, { titulo: string; formas: JSX.Element }>> = {
  pt: {
    titulo: 'Brasil',
    formas: (
      <>
        <rect width="20" height="14" fill="#009B3A" />
        <path d="M10 1.6 18.4 7 10 12.4 1.6 7Z" fill="#FEDF00" />
        <circle cx="10" cy="7" r="3.1" fill="#002776" />
      </>
    ),
  },
  en: {
    titulo: 'Estados Unidos',
    formas: (
      <>
        <rect width="20" height="14" fill="#FFFFFF" />
        <g fill="#B22234">
          <rect width="20" height="2" />
          <rect y="4" width="20" height="2" />
          <rect y="8" width="20" height="2" />
          <rect y="12" width="20" height="2" />
        </g>
        <rect width="9" height="8" fill="#3C3B6E" />
      </>
    ),
  },
  es: {
    titulo: 'Espanha',
    formas: (
      <>
        <rect width="20" height="14" fill="#AA151B" />
        <rect y="3.5" width="20" height="7" fill="#F1BF00" />
      </>
    ),
  },
};

/**
 * A bandeira de um idioma, 20 × 14.
 *
 * `aria-hidden` porque o nome do idioma está escrito ao lado, na própria
 * língua: anunciar "Brasil" antes de "Português" faria o leitor de tela dizer a
 * mesma coisa duas vezes, e da segunda com o nome errado — a bandeira é do
 * país, o item é do idioma.
 */
export function Bandeira({ idioma }: { idioma: Idioma }) {
  return (
    <svg
      viewBox="0 0 20 14"
      className="h-3.5 w-5 shrink-0 rounded-[2px]"
      aria-hidden
      focusable="false"
    >
      {DESENHOS[idioma].formas}
    </svg>
  );
}
