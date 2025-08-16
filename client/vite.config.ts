import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    proxy: {
      '/register': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/dashboard': 'http://localhost:3000',
      '/:profile': 'http://localhost:3000',
      '/saved': 'http://localhost:3000'
    }
  }
})