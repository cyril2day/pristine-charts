import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isPagesBuild = mode === 'pages'

  return {
    base: isPagesBuild ? './' : '/',
    plugins: [react()],
    build: isPagesBuild
      ? {
          outDir: 'site-dist',
          emptyOutDir: true,
        }
      : undefined,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
