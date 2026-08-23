export default defineAppConfig({
  evm: {
    title: 'EVM Layer',
    appLogoUrl: '',
    defaultChain: 'mainnet',
    chains: {
      mainnet: {
        id: 1,
        blockExplorer: 'https://evm.now',
      },
    },
    ens: {
      mode: 'indexer',
    },
    arweaveGateway: 'https://arweave.net/',
    inAppWallet: {
      enabled: false,
    },
  },
})

interface EvmChainConfig {
  id?: number
  blockExplorer?: string
  smartAccount?: {
    entryPoint?: `0x${string}`
    implementation?: `0x${string}`
    paymasterContext?: unknown
  }
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    evm?: {
      /** App title */
      title?: string
      /** App logo URL shown during wallet connection */
      appLogoUrl?: string
      /** Key into `chains` that serves as the app's primary chain */
      defaultChain?: string
      /** Named chain definitions */
      chains?: Record<string, EvmChainConfig>
      /** ENS resolution configuration */
      ens?: {
        /** Resolution strategy: 'indexer' queries a ponder-ens API, 'chain' resolves on-chain */
        mode?: 'indexer' | 'chain'
      }
      /**
       * IPFS gateway URL (must end with /). Required for IPFS content —
       * there is deliberately no default.
       *
       * Every widely-used public gateway is now behind Cloudflare and
       * answers browser-shaped requests with a managed challenge whose
       * interstitial carries `X-Frame-Options: SAMEORIGIN`, so embeds fail
       * with "refused to connect" and uncached images never load. Shipping
       * any of them as a default would ship a broken app.
       *
       * Point this at a gateway you operate, or one you have an arrangement
       * with. A gateway that fetches server-side and re-serves the bytes is
       * not subject to the challenge.
       */
      ipfsGateway?: string
      /** Arweave gateway URL (must end with /) */
      arweaveGateway?: string
      /** In-app wallet configuration */
      inAppWallet?: {
        /** Enable the integrated in-app wallet option */
        enabled?: boolean
      }
      /** Safe App manifest overrides (served at /manifest.json) */
      safe?: {
        /** App description for Safe UI */
        description?: string
        /** Relative icon path (defaults to appLogoUrl) */
        iconPath?: string
      }
    }
  }
}
