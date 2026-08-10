/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DEDBC8',
        // Doxa is strictly monochrome: every value here has R=G=B, so no hue
        // can leak into the UI. Colour is only allowed to come from assets.
        doxa: {
          bg: '#000000',
          surface: '#0D0D0D',
          raised: '#141414',
          line: '#1F1F1F',
          muted: '#6B6B6B',
          // The footer's stage, asked for by the owner: the last screen is a
          // dark GREY, not the black of the page above it. It reads as a
          // different surface — which is exactly what the footer is, since the
          // page slides off it rather than ending into it.
          //
          // Walked down six levels at a time with the owner at the screen:
          // #242424 → #1E1E1E → #181818 → #121212 → #0E0E0E, each one his call
          // after seeing the one before. This is the floor: two more steps and
          // it is the page's own #000, which is the thing he asked to get away
          // from in the first place. (The two tries before #242424 never reached
          // the screen at all — editing this file with the dev server running
          // silently drops the token. See CLAUDE.md; the config has no hot
          // reload.)
          //
          // #181818 was once called the floor here, on the grounds that the
          // stage must stay lighter than the #141414 behind each tile. That
          // argument died when the black that dims the mosaic moved INTO the
          // tile: the tiles carry an image under their own black now, so they
          // sit far below any stage value, and #141414 is only what shows in
          // the instant before an image decodes.
          //
          // The stage and that per-tile black are two dials on the same
          // picture, and they move together: this step down to #0E0E0E came
          // with the tile black going from 60% back to 50%, because a darker
          // floor under the same veil was dimming each video twice.
          stage: '#0E0E0E',

          // ─── A ÚNICA EXCEÇÃO À REGRA ACIMA ────────────────────────────────
          //
          // Todo valor deste objeto tem R=G=B. Este não tem, e é o único do
          // site que não tem: um ponto de 6 px na pílula do menu do topo, antes
          // de "Viralize agora".
          //
          // A exceção foi pedida pelo dono e ela se paga porque verde ali não é
          // decoração, é VOCABULÁRIO — a bolinha verde diz "no ar, agora" numa
          // linguagem que ninguém precisa aprender, e o site inteiro não tem
          // outra forma de dizer isso sem gastar uma frase. Foi considerada a
          // alternativa monocromática (bolinha branca pulsando) e ela perde por
          // um motivo simples: branco já é a cor de tudo neste menu, então o
          // ponto não se destacaria de nada.
          //
          // O escopo é o ponto e nada mais. Isto NÃO é um token de acento à
          // disposição: se aparecer uma segunda peça verde, a regra monocromática
          // deixou de existir na prática e a conversa é outra — é com o dono.
          sinal: '#4ADE80',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        /*
         * The native-app stack, for the mock of a published post.
         *
         * Instagram's own face is Instagram Sans, which is proprietary and not
         * ours to ship — this is the stack their web client falls back to, so a
         * post rendered in it reads as a phone screenshot rather than as our
         * own type. Only for depicting someone else's UI; our copy stays on
         * Almarai.
         */
        ui: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
