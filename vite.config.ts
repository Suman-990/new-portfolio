import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // .glb isn't in Vite's default asset list — without this it tries to parse
  // the binary model as JS. Needed for Lanyard's card.glb import.
  assetsInclude: ['**/*.glb'],
})
