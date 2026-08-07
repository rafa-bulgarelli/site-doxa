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
          // The value took three rounds to settle, and only one of them was
          // about taste: the first two never reached the screen at all, because
          // editing this file with the dev server running silently drops the
          // token (see CLAUDE.md — the config has no hot reload). #242424 was
          // the first one the owner actually saw, and he asked for one step
          // darker. #1E1E1E is that step: still unmistakably grey against the
          // #000 page sliding off it, and far enough from #141414 that the
          // mosaic tiles keep reading as objects on a surface.
          stage: '#1E1E1E',
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
