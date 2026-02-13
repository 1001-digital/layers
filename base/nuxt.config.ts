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
      add: 'lucide:plus',
      check: 'lucide:check',
      'chevron-down': 'lucide:chevron-down',
      close: 'lucide:x',
      copy: 'lucide:copy',
      edit: 'lucide:pencil',
      help: 'lucide:circle-question-mark',
      home: 'lucide:house',
      link: 'lucide:link',
      loader: 'lucide:loader-2',
      wallet: 'lucide:wallet',
    }
  },

  css: [
    join(currentDir, './app/assets/styles/index.css'),
  ],

  compatibilityDate: '2026-01-28',
})
