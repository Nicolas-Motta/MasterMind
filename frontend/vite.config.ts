import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/MasterMind': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Ottimizzazione del chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Separare le dipendenze di React in un chunk dedicato
          'react-vendor': ['react', 'react-dom'],
          // Separare react-router in un altro chunk
          'router': ['react-router-dom']
          // I componenti menu ora sono inclusi nelle route principali
        }
      }
    },
    // Ottimizzazione delle dimensioni
    chunkSizeWarningLimit: 1000,
    // Minificazione avanzata
    minify: 'esbuild',
    // Source maps per debugging in produzione (opzionale)
    sourcemap: false
  },
  // Ottimizzazione delle dipendenze
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Pre-bundling per componenti frequentemente utilizzati
    entries: ['./src/main.tsx']
  }
})
