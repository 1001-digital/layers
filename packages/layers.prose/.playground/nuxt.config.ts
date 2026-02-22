import { fileURLToPath } from 'node:url'

const layerDir = fileURLToPath(new URL('..', import.meta.url))

export default defineNuxtConfig({
  // Extends the prose layer (which in turn extends @base/)
  extends: ['..'],

  modules: ['@nuxt/eslint'],

  eslint: {
    config: {
      rootDir: layerDir,
    },
  },
  vite: {
    server: {
      watch: {
        ignored: [`!${layerDir}/**`],
      },
    },
  },
})
