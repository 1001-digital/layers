import { fileURLToPath } from 'node:url'

const componentsDir = fileURLToPath(
  new URL('../components/src/base/components', import.meta.url),
)

const clientOnlyComponents = ['Dialog', 'Toast', 'Popover', 'Dropdown']

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  hooks: {
    'components:dirs': (dirs) => {
      dirs.push({
        path: componentsDir,
        pathPrefix: false,
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
      check: 'lucide:check',
      'chevron-down': 'lucide:chevron-down',
      'chevron-right': 'lucide:chevron-right',
      close: 'lucide:x',
      copy: 'lucide:copy',
      edit: 'lucide:pencil',
      help: 'lucide:circle-question-mark',
      home: 'lucide:house',
      link: 'lucide:link',
      loader: 'lucide:loader-2',
      wallet: 'lucide:wallet',
    },
  },

  css: ['@1001-digital/styles'],

  compatibilityDate: '2026-01-28',
})
