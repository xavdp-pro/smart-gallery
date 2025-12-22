import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Écouter sur toutes les interfaces (nécessaire pour Nginx)
    port: 9999,
    strictPort: true, // Échouer si le port est déjà utilisé
    allowedHosts: [
      'photo-v1.c9.ooo.ovh', // Domaine autorisé
      'smart-gallery.xavdp.pro', // Cloudflare Tunnel
      'localhost',
      '127.0.0.1',
    ],
    hmr: {
      clientPort: 443, // Port HTTPS pour HMR via Nginx
      protocol: 'wss', // WebSocket sécurisé
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        ws: true, // Support WebSocket
      }
    }
  }
})
