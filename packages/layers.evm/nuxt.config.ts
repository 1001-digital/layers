import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { clientOnlyComponents } from '@1001-digital/components.evm/client-only'

const require = createRequire(import.meta.url)

const componentsEvm = dirname(
  require.resolve('@1001-digital/components.evm/package.json'),
)
const componentsDir = join(componentsEvm, 'src', 'components')
const componentsEvmEntry = require.resolve('@1001-digital/components.evm')
const componentsFacade = fileURLToPath(
  new URL('./app/shims/components.ts', import.meta.url),
)

// Force certain imports to resolve to a single copy.
// pnpm creates separate instances per dependency set — breaking
// Vue's provide/inject (wagmi) and causing CJS/ESM interop failures
// when Vite serves the consuming app's copy raw.
const wagmiVue = dirname(require.resolve('@wagmi/vue/package.json'))
const eventemitter3 = dirname(require.resolve('eventemitter3/package.json'))

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
  extends: ['@1001-digital/layers.base'],

  modules: ['@wagmi/vue/nuxt'],

  alias: {
    '@1001-digital/components.evm-original': componentsEvmEntry,
  },

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
    'vite:extendConfig': (config) => {
      const mutableConfig = config as MutableViteConfig
      mutableConfig.resolve ||= {}
      mutableConfig.resolve.alias = [
        // In Nuxt builds, package-level component imports should resolve
        // through Nuxt's component registry so app/layer overrides apply.
        {
          find: /^@1001-digital\/components\.evm$/,
          replacement: componentsFacade,
        },
        {
          find: /^@1001-digital\/components\.evm-original$/,
          replacement: componentsEvmEntry,
        },
        ...normalizeViteAliases(mutableConfig.resolve.alias),
      ]
    },
  },

  ssr: process.env.NUXT_SSR !== 'false',

  runtimeConfig: {
    public: {
      evm: {
        walletConnectProjectId: '',
        chains: {
          mainnet: { rpcs: '' },
        },
        ens: {
          indexers: '',
        },
      },
    },
  },

  vite: {
    resolve: {
      alias: {
        '@wagmi/vue': wagmiVue,
        eventemitter3: eventemitter3,
      },
      // Force a single instance of `@1001-digital/components.evm` so the
      // wagmi plugin's `provide(EvmConfigKey, ...)` and the dialog's
      // `inject(EvmConfigKey)` resolve to the same `Symbol('EvmConfig')`.
      // Without this, Vite's dep optimizer pre-bundles the bare-specifier
      // import as a separate chunk from the package's own relative-path
      // imports — two module instances, two symbols, and `inject` silently
      // falls back to a mainnet-only default.
      dedupe: ['@1001-digital/components.evm'],
    },
    optimizeDeps: {
      include: [
        '@1001-digital/layers.evm > @metamask/connect-evm',
        '@1001-digital/layers.evm > eventemitter3',
        '@1001-digital/layers.evm > qrcode',
        '@1001-digital/layers.evm > @walletconnect/ethereum-provider',
        '@1001-digital/layers.evm > @safe-global/safe-apps-sdk',
        '@1001-digital/layers.evm > @safe-global/safe-apps-provider',
      ],
      // Pair with `resolve.dedupe` above — skip pre-bundling so the package
      // is consumed as source through both the bare-specifier and relative
      // import paths. Both names must be excluded: the facade re-exports
      // through the `-original` alias, and Vite's optimizer scans that as
      // a bare specifier too — pre-bundling either name creates a parallel
      // module instance with its own `Symbol('EvmConfig')`.
      exclude: [
        '@1001-digital/components.evm',
        '@1001-digital/components.evm-original',
      ],
    },
  },

  nitro: {
    preset: 'node-cluster',
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  compatibilityDate: '2024-11-01',
})
