import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tronious',
        short_name: 'Tronious',
        description: 'The official page for Tronious',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // SOURCE MAPS: Required for VS Code breakpoints in .vue files
  // Maps compiled browser code back to your original source files
  // Only enabled in development for security
  build: {
    sourcemap: process.env.NODE_ENV === 'development'
  },
  css: {
    devSourcemap: true // Only applies to dev server, not production
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})