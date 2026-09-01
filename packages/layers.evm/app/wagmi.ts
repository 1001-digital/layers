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
  smartAccount?: {
    entryPoint?: `0x${string}`
    implementation?: `0x${string}`
    paymasterContext?: unknown
  }
}

interface CreateOptions {
  title: string
  appLogoUrl?: string
  defaultChain: string
  chains: Record<string, ChainEntry>
  runtimeChains: Record<string, { rpcs?: string; smartAccountRpc?: string }>
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
  const smartAccounts: NonNullable<EvmConfig['smartAccounts']> = {}

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
    const smartAccountRpc = runtimeChains[key]?.smartAccountRpc
    if (smartAccountRpc)
      smartAccounts[chain.id] = {
        ...entry.smartAccount,
        rpcUrl: smartAccountRpc,
        fetchOptions: { credentials: 'include' },
      }
  }

  // Connectors — browser only.
  //
  // Every connector wraps a wallet SDK that can only ever talk to a browser,
  // so instantiating them during SSR does no useful work: the connector list
  // is never server-rendered. It is also actively harmful. `metaMask()` boots
  // the MetaMask SDK, which parks a singleton on `globalThis`
  // (`__METAMASK_CONNECT_MULTICHAIN_SINGLETON__`) and registers per-instance
  // event handlers against it. Because the Nuxt plugin that calls this builds
  // a fresh config on every request, each SSR render used to strand another
  // connector set on that singleton — a permanent ~23KB/request heap leak that
  // grew until workers hit their heap ceiling.
  //
  // Keeping the whole list behind `isClient` means the server builds a config
  // with chains, transports and cookie storage only, which is all SSR and
  // hydration actually need.
  const connectors: CreateConnectorFn[] = []

  if (isClient) {
    connectors.push(
      injected(),
      safe({
        allowedDomains: [/app.safe.global$/],
      }),
      baseAccount({
        appName: title,
        appLogoUrl,
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
    )

    if (walletConnectProjectId)
      connectors.push(
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: false,
        }),
      )

    if (inAppWalletEnabled)
      connectors.push(
        inAppWallet({
          smartAccounts,
        }),
      )
  }

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
    smartAccounts,
    baseURL,
    walletConnectProjectId,
  }

  return { wagmiConfig, evmConfig }
}
