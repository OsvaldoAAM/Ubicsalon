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
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png', 'img/placeholder-salon.svg'],
      manifest: {
        name: 'Ubicsalon - FIME UANL',
        short_name: 'Ubicsalon',
        description: 'Localizador exprés de salones, edificios y auditorios de FIME UANL.',
        theme_color: '#070a12',
        background_color: '#070a12',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        lang: 'es',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,glb}'],
        // Las fotos de salones NO se precachean (pueden ser ~8 MB); se guardan al verlas
        globIgnores: ['img/salones/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/img/salones/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'salones-fotos',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 90
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          }
        ]
      }
    })
  ]
})
