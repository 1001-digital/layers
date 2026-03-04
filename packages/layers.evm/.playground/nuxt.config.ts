import { fileURLToPath } from 'node:url'

const layerDir = fileURLToPath(new URL('..', import.meta.url))
const componentsDir = fileURLToPath(
  new URL('../../components/src', import.meta.url),
)

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: layerDir,
    },
  },
  hooks: {
    'vite:serverCreated': (server) => {
      server.watcher.add(layerDir)
      server.watcher.add(componentsDir)
    },
  },
})
