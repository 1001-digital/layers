import {
  http,
  webSocket,
  unstable_connector,
  cookieStorage,
  createConfig,
  createStorage,
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
  resolveChain,
  inAppWallet,
  type EvmConfig,
} from '@1001-digital/components.evm'

interface ChainEntry {
  id: number
  blockExplorer?: string
}

interface CreateOptions {
  title: string
  appLogoUrl?: string
  defaultChain: string
  chains: Record<string, ChainEntry>
  runtimeChains: Record<string, { rpcs?: string }>
  walletConnectProjectId?: string
  ensMode?: 'indexer' | 'chain'
  ensIndexers?: string[]
  ipfsGateway?: string
  arweaveGateway?: string
  baseURL?: string
  inAppWalletEnabled?: boolean
  isClient?: boolean
}

export function createWagmiConfig(options: CreateOptions): {
  wagmiConfig: Config
  evmConfig: EvmConfig
} {
  const {
    title,
    appLogoUrl,
    defaultChain,
    chains: chainEntries,
    runtimeChains,
    walletConnectProjectId,
    ensMode,
    ensIndexers,
    ipfsGateway,
    arweaveGateway,
    baseURL,
    inAppWalletEnabled,
    isClient,
  } = options

  // Build chains and transports from config
  // Ensure defaultChain is first — wagmi uses chains[0] as its default
  const sortedEntries = Object.entries(chainEntries).sort(([a], [b]) =>
    a === defaultChain ? -1 : b === defaultChain ? 1 : 0,
  )

  const chains: Chain[] = []
  const transports: Record<number, Transport> = {}
  const rpcUrls: Record<number, string> = {}

  for (const [key, entry] of sortedEntries) {
    const chain = resolveChain(entry.id)
    chains.push(chain)

    const rpcs = runtimeChains[key]?.rpcs?.split(/\s+/).filter(Boolean) || []
    const transportList: Transport[] = rpcs.map((url: string) =>
      url.startsWith('wss://') ? webSocket(url) : http(url),
    )
    transportList.push(unstable_connector(injected))
    transportList.push(http())

    transports[chain.id] = fallback(transportList)
    if (rpcs[0]) rpcUrls[chain.id] = rpcs[0]
  }

  // Connectors
  const connectors: CreateConnectorFn[] = [
    injected(),
    safe({
      allowedDomains: [/app.safe.global$/],
    }),
    baseAccount({
      appName: title,
      appLogoUrl,
      // Disable telemetry — its init runs eagerly during wagmi's SSR
      // reconnect and throws `Telemetry is not supported in non-browser
      // environments` because it touches `window`/`document`.
      preference: { telemetry: false },
    }),
    metaMask({
      headless: true,
      dapp: {
        name: title,
        iconUrl: appLogoUrl || '',
        url: baseURL || '',
      },
    }),
  ]

  if (isClient && walletConnectProjectId)
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
        showQrModal: false,
      }),
    )

  if (inAppWalletEnabled) connectors.push(inAppWallet())

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

  const evmConfig: EvmConfig = {
    title,
    appLogoUrl,
    defaultChain,
    chains: Object.fromEntries(
      Object.entries(chainEntries).map(([key, entry]) => [
        key,
        { id: entry.id, blockExplorer: entry.blockExplorer },
      ]),
    ),
    ens: {
      mode: ensMode || 'indexer',
      indexers: ensIndexers,
    },
    ipfsGateway,
    arweaveGateway,
    rpcUrls,
    baseURL,
    walletConnectProjectId,
  }

  return { wagmiConfig, evmConfig }
}
