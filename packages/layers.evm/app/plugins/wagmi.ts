import { VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { EvmConfigKey } from '@1001-digital/components.evm'
import { createWagmiConfig } from '../wagmi'

export default defineNuxtPlugin({
  name: 'wagmi',
  setup(nuxtApp) {
    const appConfig = useAppConfig()
    const runtimeConfig = nuxtApp.$config.public.evm as {
      walletConnectProjectId: string
      chains: Record<string, { rpcs?: string; smartAccountRpc?: string }>
      ens: { indexers?: string }
    }

    const indexers =
      runtimeConfig.ens?.indexers?.split(/\s+/).filter(Boolean) || []

    // Unset, resolution falls through to dweb-fetch's own ipfs.io default,
    // which a browser cannot load: Cloudflare answers browser-shaped requests
    // with a challenge whose interstitial refuses to be framed. Silent in
    // production, loud in development, where it can still be fixed.
    if (import.meta.dev && !appConfig.evm?.ipfsGateway) {
      console.warn(
        '[layers.evm] No `evm.ipfsGateway` configured in app.config. ' +
          'IPFS images and embeds will fail to load in the browser. ' +
          'Set it to a gateway you operate.',
      )
    }

    const { wagmiConfig, evmConfig } = createWagmiConfig({
      title: appConfig.evm?.title || 'EVM Layer',
      appLogoUrl: appConfig.evm?.appLogoUrl,
      defaultChain: appConfig.evm?.defaultChain || 'mainnet',
      chains: appConfig.evm?.chains || {},
      runtimeChains: runtimeConfig.chains || {},
      walletConnectProjectId: runtimeConfig.walletConnectProjectId || undefined,
      ensMode: appConfig.evm?.ens?.mode || 'indexer',
      ensIndexers: indexers,
      ipfsGateway: appConfig.evm?.ipfsGateway,
      arweaveGateway: appConfig.evm?.arweaveGateway,
      baseURL: nuxtApp.$config.app.baseURL,
      inAppWalletEnabled: appConfig.evm?.inAppWallet?.enabled,
      isClient: import.meta.client,
    })

    nuxtApp.vueApp
      .use(WagmiPlugin, { config: wagmiConfig })
      .use(VueQueryPlugin, {})
      .provide(EvmConfigKey, evmConfig)

    return {
      provide: {
        wagmi: wagmiConfig,
      },
    }
  },
})
