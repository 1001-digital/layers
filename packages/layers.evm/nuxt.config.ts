import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

const require = createRequire(import.meta.url)

const componentsDir = fileURLToPath(
  new URL('../components/src/evm/components', import.meta.url),
)

// Force all @wagmi/vue imports to resolve to a single copy.
// pnpm creates separate instances per dependency set, each with its own
// Symbol-based configKey — breaking Vue's provide/inject across packages.
const wagmiVue = dirname(require.resolve('@wagmi/vue/package.json'))

const clientOnlyComponents = [
  'EvmAccount',
  'EvmConnect',
  'EvmConnectorQR',
  'EvmMetaMaskQR',
  'EvmTransactionFlow',
  'EvmWalletConnectQR',
]

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
          mainnet: { rpc1: '', rpc2: '', rpc3: '' },
        },
        ens: {
          indexer1: '',
          indexer2: '',
          indexer3: '',
        },
      },
    },
  },

  vite: {
    resolve: {
      alias: {
        '@wagmi/vue': wagmiVue,
      },
    },
    optimizeDeps: {
      include: [
        '@1001-digital/layers.evm > @metamask/sdk',
        '@1001-digital/layers.evm > eventemitter3',
        '@1001-digital/layers.evm > qrcode',
        '@1001-digital/layers.evm > @walletconnect/ethereum-provider',
        '@1001-digital/layers.evm > @reown/appkit/core',
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
