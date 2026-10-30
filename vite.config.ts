import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'serve-manifest-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const cleanUrl = req.url?.split('?')[0];
            if (cleanUrl === '/manifest.json' || cleanUrl === '/manifest.webmanifest') {
              const manifestPath = path.resolve(__dirname, 'public/manifest.json');
              if (fs.existsSync(manifestPath)) {
                res.setHeader('Content-Type', 'application/manifest+json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(fs.readFileSync(manifestPath));
                return;
              }
            }
            next();
          });
        },
      },
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: ['apple-touch-icon.png', 'icon.svg', 'manifest.json', 'manifest.webmanifest'],
        manifest: {
          id: '/',
          name: 'SynchroNSS - Ramnivas Ruia College',
          short_name: 'SynchroNSS',
          description: 'SynchroNSS - Official volunteer and activity management system for National Service Scheme (NSS), Ramnivas Ruia College.',
          theme_color: '#1565C0',
          background_color: '#F8FBFF',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          categories: ['education', 'social', 'productivity'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,webmanifest}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
