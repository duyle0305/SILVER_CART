import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    envPrefix: 'SC_',
    server: {
      port: parseInt(env.SC_APP_PORT, 10) || 5173,
    },
    preview: {
      port: parseInt(env.SC_APP_PORT, 10) || 4173,
      strictPort: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      esbuild: {
        drop: ['console', 'debugger'],
      },
    },
  }
})
