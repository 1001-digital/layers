import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base', '..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  }
})
