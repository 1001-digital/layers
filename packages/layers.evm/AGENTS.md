# AGENTS.md

Nuxt layer for building Ethereum dAPPs. Extends `@1001-digital/layers.base`.

## What this layer provides

When a Nuxt app extends `@1001-digital/layers.evm`, it gets everything from `layers.base` plus:

- **20 auto-imported EVM components** (wallet connection, ENS, transaction flow, SIWE)
- **Auto-imported composables** for chain config, ENS, gas, price feeds, SIWE, dweb
- **Auto-imported utils** for addresses, chains, ETH formatting, caching, SIWE messages
- **Wagmi plugin** that configures wallet connectors, chains, transports, and TanStack Query
- **EvmConfig injection** providing chain/ENS/gateway config to all components

## Setup

```bash
pnpm install
pnpm dev           # Start playground dev server
pnpm dev:prepare   # Generate Nuxt types
```

### Environment variables

```bash
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=""
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPCS="url1 url2 url3"    # Space-separated
NUXT_PUBLIC_EVM_CHAINS_SEPOLIA_RPCS="url1 url2"
NUXT_PUBLIC_EVM_ENS_INDEXERS="url1 url2"                 # Space-separated
NUXT_SSR=false                                           # Optional: disable SSR
```

## Key dependencies

- `@wagmi/vue` (^0.5.0) + `@wagmi/vue/nuxt` module
- `viem` (~2.47.1) — type-safe Ethereum utilities
- `@tanstack/vue-query` — blockchain data caching
- Connectors: `@metamask/connect-evm`, `@walletconnect/ethereum-provider`, `@base-org/account`, `@safe-global/safe-apps-sdk`

## Wagmi 0.5.x API

Uses modern wagmi patterns — **do not use deprecated names**:

| Use                   | Not (deprecated)   |
| --------------------- | ------------------ |
| `useConnection`       | `useAccount`       |
| `useConnectionEffect` | `useAccountEffect` |
| `useSwitchConnection` | `useSwitchAccount` |

Configured connectors: `injected`, `safe`, `baseAccount`, `metaMask` (headless), `walletConnect` (if project ID set), `inAppWallet` (if enabled in config).

## Configuration

### Static config (`app.config.ts`)

```ts
evm: {
  title: 'My dApp',
  defaultChain: 'mainnet',            // Key into chains map; wagmi uses it as chains[0]
  chains: {
    mainnet: { id: 1, blockExplorer: 'https://evm.now' },
    sepolia: { id: 11155111, blockExplorer: 'https://sepolia.etherscan.io' },
  },
  ens: { mode: 'indexer' },           // 'indexer' (ponder-ens API) or 'chain' (on-chain)
  ipfsGateway: 'https://your-gateway.example/ipfs/', // required, no default
  arweaveGateway: 'https://arweave.net/',
  inAppWallet: { enabled: false },
}
```

Supported chain IDs: resolved via `resolveChain(id)` from viem — supports mainnet, sepolia, holesky, optimism, arbitrum, base, polygon, localhost, and any viem-supported chain.

### Runtime config (env-driven)

RPC URLs and sensitive values go in `runtimeConfig.public.evm`. Transports are built from space-separated RPC URLs with automatic fallback: custom RPCs → injected connector → default HTTP.

## Components (all client-only)

All EVM components are marked client-only via Nuxt config hook. Client-only list: `EvmAccount`, `EvmAddressInput`, `EvmConnect`, `EvmConnectAuth`, `EvmConnectAuthDialog`, `EvmConnectDialog`, `EvmConnectionStatus`, `EvmConnectorQR`, `EvmMetaMaskQR`, `EvmInAppWalletSetup`, `EvmTransactionFlow`, `EvmWalletConnectQR`, `EvmSiwe`, `EvmSiweDialog`, `EvmSidebarProfile`.

### Wallet connection

- `EvmConnect` — full wallet connection UI with connector list, QR codes, in-app wallet setup
- `EvmConnectDialog` — wraps EvmConnect in a dialog; emits `connected`, `disconnected`
- `EvmConnectAuth` — combined connect + SIWE flow (inline); auto-prompts signature once wallet connects
- `EvmConnectAuthDialog` — wraps EvmConnectAuth in a dialog; trigger button + authenticated slot
- `EvmConnectionStatus` — renderless provider exposing `status`, `address`, `connector` via slot props

### Profile & display

- `EvmAccount` — address display with optional ENS resolution
- `EvmAvatar` — ENS avatar with Opepicon fallback
- `EvmProfile` — full profile dialog (ENS data, network switcher, disconnect)
- `EvmSidebarProfile` — compact profile for sidebar layouts

### Network

- `EvmSwitchNetwork` — chain switching dialog (only renders if >1 chain configured)

### Transactions

- `EvmTransactionFlow` — multi-step flow: request → sign → confirm → receipt; props: `chain`, `text`, `request`, `delayAfter`, `skipConfirmation`, `autoCloseSuccess`, `dismissable`; emits `complete(receipt)`, `cancel`

### QR & wallet discovery

- `EvmConnectorQR` — base QR renderer
- `EvmMetaMaskQR` — MetaMask deep-link QR
- `EvmWalletConnectQR` — WalletConnect pairing QR
- `EvmWalletConnectWallets` — searchable wallet explorer

### Authentication

- `EvmSiwe` — Sign-In with Ethereum (EIP-4361); requires `getNonce` and `verify` callbacks; optional `autoSignIn` triggers signature prompt on mount
- `EvmSiweDialog` — wraps EvmSiwe in a dialog
- `EvmAddressInput` — address input with ENS resolution

### In-app wallet

- `EvmInAppWalletSetup` — mnemonic-based browser wallet creation
- `EvmSeedPhraseInput` — 12-word seed phrase input with BIP39 validation

## Composables

- `useEvmConfig()` — injected EVM configuration
- `useChainConfig(key?)` — `{ id, blockExplorer }` for a named chain
- `useMainChainId()` — main chain ID from config
- `useBlockExplorer(key?)` — block explorer URL
- `useEnsureChainIdCheck()` — validate/switch chain before transactions
- `useBaseURL()` — base URL with trailing slash
- `useEns(identifier)` — resolve address or ENS name (cached, indexer/chain modes)
- `useEnsWithAvatar(identifier)` — ENS + avatar
- `useEnsProfile(identifier)` — full ENS profile (avatar, header, description, links)
- `useGasPrice()` — live gas price (`wei`, `gwei`, `eth`)
- `usePriceFeed()` — ETH/USD from Chainlink oracle (hourly refresh)
- `useSiwe()` — SIWE session state (`isAuthenticated`, `session`, `signIn`, `signOut`)
- `useDwebClient()` — IPFS/Arweave fetch client
- `useResolvedUrl(uri)` — resolve IPFS/Arweave/HTTP URIs reactively
- `useWalletExplorer()` — WalletConnect wallet discovery with search/pagination

## Utilities

- `shortAddress(address, length)` — truncate address for display
- `formatETH(value, maxDecimals)` — format ETH values
- `resolveChain(id)` — chain ID to viem Chain object
- `createCache(ttl, max)` — LRU cache with TTL
- `createSiweMessage(params)` — create EIP-4361 message
- `formatPrice(num, digits)` — format USD price
- `getEvmConfig()` — get EvmConfig (non-composable, for utils)
- `inAppWallet()`, `prepareInAppWallet()` — in-app wallet connector factory

## Vite configuration

The `nuxt.config.ts` applies critical Vite aliases to prevent duplicate `@wagmi/vue` and `eventemitter3` instances (pnpm hoisting creates separate copies that break Vue provide/inject). It also pre-bundles heavy deps (`@metamask/connect-evm`, `@walletconnect/ethereum-provider`, `@safe-global/safe-apps-sdk`) for faster dev startup.

## Directory structure

```
app/
├── app.config.ts             # EVM defaults + AppConfigInput type augmentation
├── composables/              # Re-exports from @1001-digital/components.evm
├── plugins/
│   └── wagmi.ts              # Creates wagmiConfig, installs WagmiPlugin + VueQueryPlugin
└── utils/                    # Re-exports from @1001-digital/components.evm
nuxt.config.ts                # Extends layers.base, wagmi module, vite aliases
```
