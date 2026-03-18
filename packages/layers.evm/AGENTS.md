# AGENTS.md

Nuxt layer for building dAPPs (Ethereum-powered applications). Extends `@1001-digital/layers.base`.

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Prepare types: `pnpm dev:prepare`

## Dependencies

- `@wagmi/vue` (^0.5.0) - Wallet connection, contract reads/writes, account state
- `viem` - Type-safe Ethereum utilities, ABI encoding, transaction simulation
- `@tanstack/vue-query` - Caching and synchronization of blockchain data
- `@metamask/sdk` - MetaMask headless connector
- `@walletconnect/ethereum-provider` - WalletConnect provider
- `@base-org/account` - Base Account (Coinbase) connector
- `@safe-global/safe-apps-sdk` - Safe apps integration

## Wagmi Configuration

Uses modern wagmi 0.5.x patterns:

- `useConnection` (not deprecated `useAccount`)
- `useConnectionEffect` (not deprecated `useAccountEffect`)
- `useSwitchConnection` (not deprecated `useSwitchAccount`)

Configured chains: resolved dynamically from `app.config.ts` via `evm.chains` map (supports mainnet, sepolia, holesky, optimism, arbitrum, base, polygon, localhost out of the box)

Connectors: injected, safe, baseAccount, metaMask, walletConnect, inAppWallet

## Components

All components are client-only (set via Nuxt config hook, not file suffix).

- `EvmConnect` - Wallet connection UI with connector list, QR codes, in-app wallet
- `EvmConnectDialog` - Button that opens EvmConnect in a dialog
- `EvmConnectionStatus` - Renderless provider for connection state (`status`, `address`, `connector`)
- `EvmAccount` - Address display with ENS shortening
- `EvmAvatar` - ENS avatar with Opepicon fallback
- `EvmProfile` - Full profile dialog with ENS data, network switcher, disconnect
- `EvmSwitchNetwork` - Chain switching dialog (only renders if >1 chain configured)
- `EvmTransactionFlow` - Multi-step transaction execution with signing and receipt tracking
- `EvmConnectorQR` - Base QR code renderer
- `EvmWalletConnectQR` - WalletConnect QR wrapper
- `EvmMetaMaskQR` - MetaMask QR wrapper
- `EvmWalletConnectWallets` - Searchable wallet explorer for WalletConnect
- `EvmSiwe` - Sign-In with Ethereum (EIP-4361)
- `EvmSiweDialog` - SIWE dialog wrapper
- `EvmInAppWalletSetup` - Mnemonic-based browser wallet setup
- `EvmSeedPhraseInput` - 12-word seed phrase input with BIP39 validation

## Composables

- `useChainConfig(key?)` - Get `{ id, blockExplorer }` for a named chain (defaults to `defaultChain`)
- `useMainChainId()` - Get main chain ID from app config
- `useBlockExplorer(key?)` - Get block explorer URL for a named chain
- `useEnsureChainIdCheck()` - Validate/switch chain before transactions
- `useBaseURL()` - Get base URL with trailing slash
- `useEns(identifier)` - Resolve address or ENS name (cached, supports indexer/chain modes)
- `useEnsWithAvatar(identifier)` - ENS resolution including avatar
- `useEnsProfile(identifier)` - Full ENS profile (avatar, header, description, links)
- `useGasPrice()` - Live gas price tracking (`wei`, `gwei`, `eth`)
- `usePriceFeed()` - ETH/USD price from Chainlink oracle (hourly refresh)
- `useSiwe()` - SIWE session state (`isAuthenticated`, `session`, `signIn`, `signOut`)
- `useResolvedUrl(uri)` - Resolve IPFS/Arweave/HTTP URIs
- `useWalletExplorer()` - WalletConnect wallet discovery with search and pagination

## Utilities

- `shortAddress(address, length)` - Truncate address for display
- `formatETH(value, maxDecimals)` - Format ETH values
- `resolveChain(id)` - Resolve chain ID to viem Chain object
- `createCache(ttl, max)` - Generic cache with LRU eviction
- `createSiweMessage(params)` - Create EIP-4361 message string
- `formatPrice(num, digits)` - Format USD price

## Configuration

Static chain config lives in `app.config.ts` (safe to commit):

```ts
evm: {
  title: 'My dApp',
  defaultChain: 'mainnet',
  chains: {
    mainnet: { id: 1, blockExplorer: 'https://etherscan.io' },
  },
  ens: { mode: 'indexer' },
  inAppWallet: { enabled: false },
}
```

Sensitive RPC URLs live in `runtimeConfig.public.evm` (env-driven):

```bash
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=""
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPCS="url1 url2 url3"
NUXT_PUBLIC_EVM_ENS_INDEXERS="url1 url2"
```

## Key directories

Components, composables, and utilities live in `@1001-digital/components.evm` and are re-exported by this layer.

```
app/
├── composables/         # Re-exports from components.evm
├── plugins/             # Wagmi + price feed setup
└── utils/               # Re-exports from components.evm
```
