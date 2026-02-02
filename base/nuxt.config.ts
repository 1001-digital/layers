import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  icon: {
    componentName: 'NuxtIcon',
    aliases: {
      check: 'lucide:check',
      'chevron-down': 'lucide:chevron-down',
      close: 'lucide:x',
      copy: 'lucide:copy',
      help: 'lucide:circle-question-mark',
      loader: 'lucide:loader-2',
    }
  },

  css: [
    join(currentDir, './app/assets/styles/index.css'),
  ],

  compatibilityDate: '2026-01-28',
})
