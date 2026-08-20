import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { FontaineTransform } from 'fontaine'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Generate metric-matched fallback fonts for every web font, so the text
    // occupies the same space before the real font loads. The web fonts still
    // load and apply (font-display: swap), but the swap no longer reflows the
    // layout — which removes the font-driven CLS while keeping the brand fonts.
    FontaineTransform.vite({
      fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
    }),
  ],
})
