import path from 'path';
import { defineConfig } from 'vite';
import { createVitePlugins } from './src/plugins/vite-plugins.ts';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  // 默认 '/' 适配 subconverter 根目录托管；GitHub Pages 构建时注入 VITE_BASE='/sub-web/'
  const base = process.env.VITE_BASE || '/';
  return {
    base,
    plugins: createVitePlugins(isBuild, base),
    build: {
      outDir: 'dist',
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        input: path.resolve(import.meta.dirname, 'index.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/vue/') || id.includes('/vue-router/')) {
                return 'vue';
              }
              if (id.includes('/axios/')) {
                return 'axios';
              }
            }
          }
        }
      }
    },
    esbuild: {
      legalComments: 'none',
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      }
    },
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
    },
    server: {
      // 可根据需要配置代理
    }
  };
});
