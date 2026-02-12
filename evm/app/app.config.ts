export default defineAppConfig({
  evm: {
    title: 'EVM Layer',
    defaultChain: 'mainnet',
    chains: {
      mainnet: {
        id: 1,
        blockExplorer: 'https://etherscan.io',
      },
    },
  },
})

interface EvmChainConfig {
  id?: number
  blockExplorer?: string
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    evm?: {
      /** App title */
      title?: string
      /** Key into `chains` that serves as the app's primary chain */
      defaultChain?: string
      /** Named chain definitions */
      chains?: Record<string, EvmChainConfig>
    }
  }
}
