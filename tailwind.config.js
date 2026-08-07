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
          // Walked down one step at a time with the owner at the screen:
          // #242424 → #1E1E1E → #181818, each one his call after seeing the
          // one before. (The two tries before #242424 never reached the screen
          // at all — editing this file with the dev server running silently
          // drops the token. See CLAUDE.md; the config has no hot reload.)
          //
          // #181818 sits four levels from the #141414 of the tiles, so the
          // empty grid no longer frames each video as an object resting on a
          // lighter surface. That is fine while every tile carries an image,
          // and it is the floor: one step further and the stage is the page's
          // own black, which is the thing the owner asked to get away from.
          stage: '#181818',
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
