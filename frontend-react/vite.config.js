import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
  },
  css: {
    devSourcemap: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
