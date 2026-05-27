import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { clientOnlyComponents } from '@1001-digital/components/client-only'

const require = createRequire(import.meta.url)

const componentsDir = fileURLToPath(
  new URL('../components/src/base/components', import.meta.url),
)
const baseComponentsEntry = require.resolve('@1001-digital/components')
const componentsFacade = fileURLToPath(
  new URL('./app/shims/components.ts', import.meta.url),
)

type ViteAliasEntry = { find: string | RegExp; replacement: string }
type ViteAliases = Record<string, string> | ViteAliasEntry[]
type MutableViteConfig = { resolve?: { alias?: ViteAliases } }

const normalizeViteAliases = (
  aliases: ViteAliases | undefined,
): ViteAliasEntry[] => {
  if (!aliases) {
    return []
  }

  if (Array.isArray(aliases)) {
    return aliases
  }

  return Object.entries(aliases).map(([find, replacement]) => ({
    find,
    replacement,
  }))
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  alias: {
    '@1001-digital/components-original': baseComponentsEntry,
  },

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
    'vite:extendConfig': (config) => {
      const mutableConfig = config as MutableViteConfig
      mutableConfig.resolve ||= {}
      mutableConfig.resolve.alias = [
        // In Nuxt builds, package-level component imports should resolve
        // through Nuxt's component registry so app/layer overrides apply.
        {
          find: /^@1001-digital\/components$/,
          replacement: componentsFacade,
        },
        {
          find: /^@1001-digital\/components-original$/,
          replacement: baseComponentsEntry,
        },
        ...normalizeViteAliases(mutableConfig.resolve.alias),
      ]
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

  app: {
    head: {
      style: [
        {
          textContent: '@layer variables, reset, base, components, utilities;',
        },
      ],
    },
  },

  css: ['@1001-digital/styles'],

  vite: {
    resolve: {
      // Force a single instance of `@1001-digital/components` so injection
      // keys like `LinkComponentKey` and `IconAliasesKey` resolve to the
      // same `Symbol(...)` everywhere. Without this, Vite's dep optimizer
      // pre-bundles the bare-specifier import as a separate chunk from the
      // package's own relative-path imports — two module instances, two
      // symbols, and `inject` silently falls back to defaults.
      dedupe: ['@1001-digital/components'],
    },
    optimizeDeps: {
      // Pair with `resolve.dedupe` above — skip pre-bundling so the package
      // is consumed as source through both the bare-specifier and relative
      // import paths. Both names must be excluded: the facade re-exports
      // through the `-original` alias, and Vite's optimizer scans that as
      // a bare specifier too — pre-bundling either name creates a parallel
      // module instance with its own injection-key symbols.
      exclude: [
        '@1001-digital/components',
        '@1001-digital/components-original',
      ],
    },
  },

  compatibilityDate: '2026-01-28',
})
