import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { clientOnlyComponents } from '@1001-digital/components.evm/client-only'

const require = createRequire(import.meta.url)

const componentsDir = fileURLToPath(
  new URL('../components.evm/src/components', import.meta.url),
)

// Force certain imports to resolve to a single copy.
// pnpm creates separate instances per dependency set — breaking
// Vue's provide/inject (wagmi, EvmConfigKey) and causing CJS/ESM
// interop failures when Vite serves the consuming app's copy raw.
const componentsEvm = dirname(
  require.resolve('@1001-digital/components.evm/package.json'),
)
const wagmiVue = dirname(require.resolve('@wagmi/vue/package.json'))
const eventemitter3 = dirname(require.resolve('eventemitter3/package.json'))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],

  modules: ['@wagmi/vue/nuxt'],

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
        '@1001-digital/components.evm': componentsEvm,
        '@wagmi/vue': wagmiVue,
        eventemitter3: eventemitter3,
      },
    },
    optimizeDeps: {
      include: [
        '@1001-digital/layers.evm > @metamask/sdk',
        '@1001-digital/layers.evm > eventemitter3',
        '@1001-digital/layers.evm > qrcode',
        '@1001-digital/layers.evm > @walletconnect/ethereum-provider',
        '@1001-digital/layers.evm > @safe-global/safe-apps-sdk',
        '@1001-digital/layers.evm > @safe-global/safe-apps-provider',
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
