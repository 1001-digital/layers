// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],

  modules: ['@wagmi/vue/nuxt'],

  ssr: process.env.NUXT_SSR !== 'false',

  runtimeConfig: {
    public: {
      title: 'EVM Layer',
      blockExplorer: 'https://etherscan.io',
      chainId: 1,
      rpc1: '',
      rpc2: '',
      rpc3: '',
      walletConnectProjectId: '',
    },
  },

  vite: {
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
