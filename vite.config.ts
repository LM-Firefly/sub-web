import path from 'path';
import { defineConfig } from 'vite';
import { createVitePlugins } from './src/plugins/vite-plugins';

export default defineConfig(({ command, mode }) => {
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
          manualChunks: {
            // 将 Vue 相关库打包成一个 chunk
            vue: ['vue', 'vue-router'],
            // 将网络请求库打包成一个 chunk
            axios: ['axios']
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
