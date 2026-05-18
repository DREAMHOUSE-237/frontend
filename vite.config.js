import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.16.171.142.15.nip.io',
        changeOrigin: true,
        timeout: 120000, // 2 minutes (au lieu de 60s)
        proxyTimeout: 120000,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})