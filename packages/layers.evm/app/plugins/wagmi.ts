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
