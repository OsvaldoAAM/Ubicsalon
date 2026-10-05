import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0', // Permitir acceso desde la red Wi-Fi local y túneles
    port: 5173,
    allowedHosts: true // Desbloquea cabecera Host para localtunnel / ngrok
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Ubicsalon - FIME UANL',
        short_name: 'Ubicsalon',
        description: 'Localizador exprés de salones, edificios y auditorios de FIME UANL.',
        theme_color: '#070a12',
        background_color: '#070a12',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webp,jpg,jpeg,avif}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'salones-imagenes-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
