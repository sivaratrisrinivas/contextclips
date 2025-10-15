import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ 
      manifest,
      contentScripts: { injectCss: false }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        sidepanel: 'src/sidepanel/index.html',
        overlay: 'src/overlay/index.html'
      }
    }
  }
})
