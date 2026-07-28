import { VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import {
  createLocalEncryptedVaultStore,
  EncryptedWalletKeyring,
  EvmConfigKey,
  EvmInAppWalletController,
  EvmInAppWalletControllerKey,
  getConfiguredEvmInAppWalletHost,
  type EvmInAppWalletHost,
} from '@1001-digital/components.evm'
import { createWagmiConfig } from '../wagmi'

export default defineNuxtPlugin({
  name: 'wagmi',
  async setup(nuxtApp) {
    const appConfig = useAppConfig()
    const runtimeConfig = nuxtApp.$config.public.evm as {
      walletConnectProjectId: string
      chains: Record<string, { rpcs?: string }>
      ens: { indexers?: string }
    }

    const indexers =
      runtimeConfig.ens?.indexers?.split(/\s+/).filter(Boolean) || []

    let walletController: EvmInAppWalletController | null = null
    if (import.meta.client && appConfig.evm?.inAppWallet?.enabled) {
      const configuredHost = getConfiguredEvmInAppWalletHost()
      const host: EvmInAppWalletHost = configuredHost ?? {
        store: createLocalEncryptedVaultStore(),
        scope: window.location.host,
        rpName: appConfig.evm?.title || 'EVM Layer',
      }
      const keyring = new EncryptedWalletKeyring({ store: host.store })
      walletController = new EvmInAppWalletController(keyring, host)
      await keyring.load()
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
      inAppWallet: walletController
        ? {
            keyring: walletController.keyring,
            requestUnlock: walletController.requestUnlock,
          }
        : undefined,
      isClient: import.meta.client,
    })

    nuxtApp.vueApp
      .use(WagmiPlugin, { config: wagmiConfig })
      .use(VueQueryPlugin, {})
      .provide(EvmConfigKey, evmConfig)

    if (walletController) {
      nuxtApp.vueApp.provide(EvmInAppWalletControllerKey, walletController)
    }

    return {
      provide: {
        wagmi: wagmiConfig,
        evmInAppWallet: walletController,
      },
    }
  },
})
