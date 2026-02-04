import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

export function createVitePlugins(isBuild: boolean): PluginOption[] {
  const vitePlugins: PluginOption[] = [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: path.resolve(process.cwd(), 'src/auto-imports.d.ts'),
      resolvers: [ElementPlusResolver({ importStyle: 'css', resolveIcons: true })],
      eslintrc: {
        enabled: false,
        filepath: path.resolve(process.cwd(), '.eslintrc-auto-import.json'),
        globalsPropValue: true
      }
    }),
    Components({
      dts: path.resolve(process.cwd(), 'src/components.d.ts'),
      resolvers: [ElementPlusResolver({ importStyle: 'css', resolveIcons: true })]
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ];
  vitePlugins.push(createPwaPlugin());
  return vitePlugins;
}

function createPwaPlugin(): PluginOption {
  const pwaOptions: Partial<VitePWAOptions> = {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Sub-Web',
      short_name: 'Sub-Web',
      description: 'Subscription Converter Web Interface',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      navigateFallback: '/',
      navigateFallbackDenylist: [/\/api\//],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30天
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 20 * 24 * 60 * 60 // 20天
            }
          }
        }
      ]
    }
  };
  return VitePWA(pwaOptions);
}