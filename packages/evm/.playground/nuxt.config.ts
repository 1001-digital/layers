import { fileURLToPath } from 'node:url'

const layerDir = fileURLToPath(new URL('..', import.meta.url))

export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base', '..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: layerDir,
    }
  },
  hooks: {
    'vite:serverCreated': (server) => {
      server.watcher.add(layerDir)
    },
  },
})
