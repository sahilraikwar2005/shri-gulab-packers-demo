import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: mode === 'production' ? '/shri-gulab-packers-demo/' : (env.VITE_BASE_PATH || '/'),
    plugins: [react()],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'motion',
                test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
                priority: 2,
              },
              {
                name: 'query',
                test: /node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
                priority: 2,
              },
            ],
          },
        },
      },
    },
  }
})
