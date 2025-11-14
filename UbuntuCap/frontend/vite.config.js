import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: true, // Important for Codespaces
    proxy: {
      '/api': {
        target: 'http://localhost:8001', 
        changeOrigin: true,
      },
    },
  },
})