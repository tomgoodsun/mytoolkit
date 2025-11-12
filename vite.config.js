import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8080,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      target: 'es2015', // または 'esnext'
      sourcemap: mode === 'development', // 開発時のみソースマップを生成
      minify: mode === 'production' ? 'esbuild' : false, // 本番時のみminify
      rollupOptions: {
        output: {
          // 本番環境でのファイル名パターン
          manualChunks: mode === 'production' ? {
            'vendor': ['vue', 'vue-router'],
            'bootstrap': ['bootstrap', 'bootstrap-vue-next']
          } : undefined
        }
      }
    },
    // サブディレクトリにデプロイする場合（例: https://example.com/mytoolkit/）
    // base: mode === 'production' ? '/mytoolkit/' : '/'
    base: './'
  }
})
