import { VueQueryPlugin } from '@tanstack/vue-query'
import {
  http,
  webSocket,
  unstable_connector,
  cookieStorage,
  createConfig,
  createStorage,
  WagmiPlugin,
  fallback,
  type Config,
  type CreateConnectorFn,
} from '@wagmi/vue'
import {
  baseAccount,
  injected,
  metaMask,
  safe,
  walletConnect,
} from '@wagmi/vue/connectors'
import type { Chain, Transport } from 'viem'
import {
  EvmConfigKey,
  resolveChain,
  inAppWallet,
  type EvmConfig,
} from '@1001-digital/components.evm'

export default defineNuxtPlugin({
  name: 'wagmi',
  setup(nuxtApp) {
    const appConfig = useAppConfig()
    const runtimeConfig = nuxtApp.$config.public.evm as {
      walletConnectProjectId: string
      chains: Record<string, { rpcUrls?: string }>
      ens: { indexerUrls?: string }
    }

    const title = appConfig.evm?.title || 'EVM Layer'
    const chainEntries = appConfig.evm?.chains || {}

    // Build chains and transports from config
    // Ensure defaultChain is first — wagmi uses chains[0] as its default
    const defaultChain = appConfig.evm?.defaultChain || 'mainnet'
    const sortedEntries = Object.entries(chainEntries).sort(([a], [b]) =>
      a === defaultChain ? -1 : b === defaultChain ? 1 : 0,
    )

    const chains: Chain[] = []
    const transports: Record<number, Transport> = {}

    for (const [key, entry] of sortedEntries) {
      const chain = resolveChain(entry.id!)
      chains.push(chain)

      const rpcUrls = runtimeConfig.chains?.[key]?.rpcUrls?.split(/\s+/).filter(Boolean) || []
      const transportList: Transport[] = rpcUrls.map((url: string) =>
        url.startsWith('wss://') ? webSocket(url) : http(url),
      )
      transportList.push(unstable_connector(injected))
      transportList.push(http())

      transports[chain.id] = fallback(transportList)
    }

    // Connectors
    const connectors: CreateConnectorFn[] = [
      injected(),
      safe(),
      baseAccount({
        appName: title,
      }),
      metaMask({
        headless: true,
        dappMetadata: {
          name: title,
          iconUrl: '',
          url: '',
        },
      }),
    ]

    if (import.meta.client && runtimeConfig.walletConnectProjectId)
      connectors.push(
        walletConnect({
          projectId: runtimeConfig.walletConnectProjectId,
          showQrModal: false,
        }),
      )

    if (appConfig.evm?.inAppWallet?.enabled) connectors.push(inAppWallet())

    const wagmiConfig: Config = createConfig({
      chains: chains as [Chain, ...Chain[]],
      batch: {
        multicall: true,
      },
      connectors,
      storage: createStorage({
        storage: cookieStorage,
      }),
      ssr: true,
      transports,
    })

    // Build EvmConfig from Nuxt app/runtime config
    const indexerUrls = runtimeConfig.ens?.indexerUrls?.split(/\s+/).filter(Boolean) || []

    const evmConfig: EvmConfig = {
      title,
      defaultChain: appConfig.evm?.defaultChain || 'mainnet',
      chains: Object.fromEntries(
        Object.entries(chainEntries).map(([key, entry]) => [
          key,
          { id: entry.id!, blockExplorer: entry.blockExplorer },
        ]),
      ),
      ens: {
        mode: appConfig.evm?.ens?.mode || 'indexer',
        indexerUrls,
      },
      ipfsGateway: appConfig.evm?.ipfsGateway,
      arweaveGateway: appConfig.evm?.arweaveGateway,
      baseURL: nuxtApp.$config.app.baseURL,
      walletConnectProjectId: runtimeConfig.walletConnectProjectId || undefined,
    }

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
