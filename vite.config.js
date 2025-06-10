import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'

export default defineConfig( {
  logLevel: 'info',
  base: './',
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      BASE_URL: process.env.BASE_URL
    }
  },
  plugins: [
    vue( {
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    } ),
    svgLoader( {
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                convertColors: {
                  currentColor: false
                }
              }
            }
          }
        ]
      }
    } ),
    VitePWA( {
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: [ '**/*.{js,css,html,ico,png,svg}' ],
        navigateFallback: null
      },
      devOptions: {
        enabled: false
      }
    } )
  ],
  resolve: {
    alias: {
      '@': resolve( __dirname, 'src' ),
      'components': resolve( __dirname, 'src/components' )
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/css/element-variables.scss" as *;`
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    manifest: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: {
        main: resolve( __dirname, 'index.html' )
      },
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
} )
