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
    ens: {
      mode: 'indexer',
    },
    ipfsGateway: 'https://ipfs.io/ipfs/',
    arweaveGateway: 'https://arweave.net/',
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
      /** ENS resolution configuration */
      ens?: {
        /** Resolution strategy: 'indexer' queries a ponder-ens API, 'chain' resolves on-chain */
        mode?: 'indexer' | 'chain'
      }
      /** IPFS gateway URL (must end with /) */
      ipfsGateway?: string
      /** Arweave gateway URL (must end with /) */
      arweaveGateway?: string
    }
  }
}
