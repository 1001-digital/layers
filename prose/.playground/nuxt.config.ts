import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  // Extends the prose layer (which in turn extends @base/)
  extends: ['..'],

  modules: ['@nuxt/eslint'],

  eslint: {
    config: {
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
})
