import { VueQueryPlugin } from '@tanstack/vue-query'
import {
  http,
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
  seedWallet,
  type EvmConfig,
} from '@1001-digital/components'

export default defineNuxtPlugin({
  name: 'wagmi',
  setup(nuxtApp) {
    const appConfig = useAppConfig()
    const runtimeConfig = nuxtApp.$config.public.evm as {
      walletConnectProjectId: string
      chains: Record<string, { rpc1?: string; rpc2?: string; rpc3?: string }>
      ens: { indexer1?: string; indexer2?: string; indexer3?: string }
    }

    const title = appConfig.evm?.title || 'EVM Layer'
    const chainEntries = appConfig.evm?.chains || {}

    // Build chains and transports from config
    // Ensure defaultChain is first — wagmi uses chains[0] as its default
    const defaultChain = appConfig.evm?.defaultChain || 'mainnet'
    const sortedEntries = Object.entries(chainEntries).sort(([a], [b]) =>
      a === defaultChain ? -1 : b === defaultChain ? 1 : 0,
    )

    const chains: [Chain, ...Chain[]] = [] as unknown as [Chain, ...Chain[]]
    const transports: Record<number, Transport> = {}

    for (const [key, entry] of sortedEntries) {
      const chain = resolveChain(entry.id!)
      chains.push(chain)

      const rpcs = runtimeConfig.chains?.[key]
      const transportList = []
      if (rpcs?.rpc1) transportList.push(http(rpcs.rpc1))
      if (rpcs?.rpc2) transportList.push(http(rpcs.rpc2))
      if (rpcs?.rpc3) transportList.push(http(rpcs.rpc3))
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

    if (appConfig.evm?.seedWallet?.enabled) connectors.push(seedWallet())

    const wagmiConfig: Config = createConfig({
      chains,
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
    const indexerUrls = [
      runtimeConfig.ens?.indexer1,
      runtimeConfig.ens?.indexer2,
      runtimeConfig.ens?.indexer3,
    ].filter(Boolean) as string[]

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
