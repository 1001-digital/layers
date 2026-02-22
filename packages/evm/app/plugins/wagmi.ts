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
import { coinbaseWallet, injected, metaMask, walletConnect } from '@wagmi/vue/connectors'
import type { Chain, Transport } from 'viem'

export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig()
  const runtimeConfig = nuxtApp.$config.public.evm as {
    walletConnectProjectId: string
    chains: Record<string, { rpc1?: string, rpc2?: string, rpc3?: string }>
  }

  const title = appConfig.evm?.title || 'EVM Layer'
  const chainEntries = appConfig.evm?.chains || {}

  // Build chains and transports from config
  const chains: [Chain, ...Chain[]] = [] as unknown as [Chain, ...Chain[]]
  const transports: Record<number, Transport> = {}

  for (const [key, entry] of Object.entries(chainEntries)) {
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
    coinbaseWallet({
      appName: title,
      appLogoUrl: '',
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

  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig }).use(VueQueryPlugin, {})

  return {
    provide: {
      wagmi: wagmiConfig,
    },
  }
})
