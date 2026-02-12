import { fileURLToPath } from 'node:url'

const layerDir = fileURLToPath(new URL('..', import.meta.url))

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: layerDir,
    }
  },
  vite: {
    server: {
      watch: {
        ignored: [`!${layerDir}/**`],
      },
    },
  },
})
