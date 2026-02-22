import { fileURLToPath } from 'node:url'

const componentsDir = fileURLToPath(
  new URL('../components/src/evm/components', import.meta.url),
)

const clientOnlyComponents = [
  'EvmAccount',
  'EvmConnect',
  'EvmConnectorQR',
  'EvmMetaMaskQR',
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
      dedupe: ['@wagmi/vue', '@wagmi/core', 'viem'],
    },
    optimizeDeps: {
      include: [
        '@1001-digital/layers.evm > @metamask/sdk',
        '@1001-digital/layers.evm > eventemitter3',
        '@1001-digital/layers.evm > qrcode',
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
