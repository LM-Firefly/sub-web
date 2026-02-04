import path from 'path';
import { defineConfig } from 'vite';
import { createVitePlugins } from './src/plugins/vite-plugins';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  return {
    plugins: createVitePlugins(isBuild),
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
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
