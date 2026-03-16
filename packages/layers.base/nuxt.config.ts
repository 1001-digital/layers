import { fileURLToPath } from 'node:url'
import { clientOnlyComponents } from '@1001-digital/components/client-only.ts'

const componentsDir = fileURLToPath(
  new URL('../components/src/base/components', import.meta.url),
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  hooks: {
    'components:dirs': (dirs) => {
      dirs.push({
        path: componentsDir,
        pathPrefix: false,
        ignore: ['Icon.vue', 'Globals.vue'],
      })
    },
    'components:extend': (components) => {
      for (const c of components) {
        if (clientOnlyComponents.includes(c.pascalName)) {
          c.mode = 'client'
        }
      }
    },
  },

  icon: {
    componentName: 'NuxtIcon',
    aliases: {
      add: 'lucide:plus',
      calendar: 'lucide:calendar',
      check: 'lucide:check',
      'chevron-down': 'lucide:chevron-down',
      'chevron-left': 'lucide:chevron-left',
      'chevron-right': 'lucide:chevron-right',
      close: 'lucide:x',
      copy: 'lucide:copy',
      edit: 'lucide:pencil',
      help: 'lucide:circle-help',
      home: 'lucide:house',
      link: 'lucide:link',
      loader: 'lucide:loader-2',
      menu: 'lucide:menu',
      wallet: 'lucide:wallet',
    },
  },

  css: ['@1001-digital/styles'],

  compatibilityDate: '2026-01-28',
})
