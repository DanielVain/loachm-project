import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { FontaineTransform } from 'fontaine'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Metric-matched fallback fonts: the fallback occupies the same space as the
    // real web font, so when the font swaps in there's no reflow (removes the
    // font-driven CLS) while the brand fonts still load and apply.
    //
    // We only match the body text fonts (Manrope, Heebo). We SKIP:
    //  • JetBrains Mono — a proportional (Arial) fallback breaks monospace layout.
    //  • Archivo Black — the heavy display face's large size-adjust overlaps the
    //    big hero heading. These keep their generic fallback + font-display:swap.
    FontaineTransform.vite({
      fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
      skipFontFaceGeneration: (fallbackName) =>
        fallbackName === 'JetBrains Mono fallback' ||
        fallbackName === 'Archivo Black fallback',
    }),
  ],
})
