# AGENTS.md

EVM component library (`@1001-digital/components.evm`) — Ethereum wallet components, composables, and utilities. Not a Nuxt layer — used by `layers.evm` which auto-imports everything.

## Peer dependencies

- `vue` (^3.5.0)
- `@1001-digital/components` (workspace)
- `@wagmi/vue` (>=0.5.0), `@wagmi/core` (>=3.0.0), `viem` (>=2.0.0)
- `@vueuse/core` (>=14.0.0)

## Key dependencies

- `@1001-digital/dweb-fetch` — IPFS/Arweave fetch
- `@1001-digital/wagmi-in-app-wallet` — browser-based wallet connector
- `qrcode` — QR code generation

## Exports

Entry point: `src/index.ts` (barrel export). Also exports:

- `./client-only` — array of client-only components
- `./package.json` — package metadata (used by layers.evm for path resolution)
- `./*` — direct access to source files

## Client-only components

Must be rendered client-side: `EvmAccount`, `EvmAddressInput`, `EvmConnect`, `EvmConnectAuth`, `EvmConnectAuthDialog`, `EvmConnectDialog`, `EvmConnectionStatus`, `EvmConnectorQR`, `EvmMetaMaskQR`, `EvmInAppWalletSetup`, `EvmTransactionFlow`, `EvmWalletConnectQR`, `EvmSiwe`, `EvmSiweDialog`, `EvmSidebarProfile`.

## Components (22)

- `EvmConnect` — wallet connection UI (connector list, QR, in-app wallet)
- `EvmConnectDialog` — EvmConnect in a dialog; emits `connected({ address })`, `disconnected`
- `EvmConnectAuth` — combined connect + SIWE flow (inline); auto-prompts signature once wallet connects
- `EvmConnectAuthDialog` — EvmConnectAuth in a dialog; trigger button + authenticated slot, mirrors EvmSiweDialog shape
- `EvmConnectionStatus` — renderless provider: `status`, `address`, `connector` via slot props
- `EvmAccount` — address display with optional ENS (`address?`, `resolveEns?`)
- `EvmAvatar` — ENS avatar with Opepicon fallback (`address?`, `large?`)
- `EvmArtifact` — generic NFT artifact renderer; accepts `metadata` (TokenMetadata-shaped) or individual `image`/`animationUrl`/`name`/`backgroundColor` props; auto-detects media type (image/video/audio/iframe/glb) by file extension first, with browser-only HEAD-request fallback; SSR-friendly for `<img>`/`<video>`/`<audio>` (model/embed renderers defer to a static or fallback render until after hydration); delegates 3D rendering to `EvmArtifactModel`; `v-model:show-animation` toggle; slots `#animation`, `#static`, `#overlay`, `#fallback`
- `EvmArtifactModel` — client-only `<model-viewer>` wrapper; lazy-loads `@google/model-viewer` in `onMounted`; emits `error` (runtime) and `import-error` (failed dynamic import)
- `EvmProfile` — profile dialog: ENS data, network switcher, disconnect
- `EvmSidebarProfile` — compact sidebar profile
- `EvmSwitchNetwork` — chain switcher (hidden if only 1 chain)
- `EvmTransactionFlow` — request → sign → confirm → receipt; emits `complete(receipt)`, `cancel`
- `EvmConnectorQR` — base QR renderer
- `EvmMetaMaskQR` — MetaMask deep-link QR
- `EvmWalletConnectQR` — WalletConnect pairing QR
- `EvmWalletConnectWallets` — searchable wallet explorer
- `EvmSiwe` — Sign-In with Ethereum; requires `getNonce()` and `verify()` callbacks; optional `autoSignIn` prop triggers signature prompt on mount
- `EvmSiweDialog` — SIWE dialog wrapper
- `EvmAddressInput` — address/ENS input field
- `EvmInAppWalletSetup` — mnemonic wallet creation flow
- `EvmSeedPhraseInput` — 12-word seed phrase input with BIP39 validation

All props/emits interfaces are typed in `src/types.ts`.

## Configuration

`EvmConfig` interface (injected via `EvmConfigKey`):

```ts
interface EvmConfig {
  title?: string
  defaultChain?: string
  chains: Record<string, { id: number; blockExplorer?: string }>
  ens?: { mode?: 'indexer' | 'chain'; indexers?: string[] }
  ipfsGateway?: string
  arweaveGateway?: string
  baseURL?: string
  walletConnectProjectId?: string
}
```

`useEvmConfig()` retrieves the injected config (falls back to `defaultEvmConfig`).

## Composables

- `useChainConfig(key?)` — `{ id, blockExplorer }` for named chain
- `useMainChainId()` — main chain ID
- `useBlockExplorer(key?)` — block explorer URL
- `useEnsureChainIdCheck()` — validate/switch chain
- `useBaseURL()` — base URL with trailing slash
- `useEns(identifier)` — resolve address ↔ ENS name (cached, dual-mode indexer/chain)
- `useEnsWithAvatar(identifier)` — ENS + avatar
- `useEnsProfile(identifier)` — full profile (avatar, header, description, links)
- `useGasPrice()` — live gas price (`wei`, `gwei`, `eth`)
- `usePriceFeed()` — ETH/USD from Chainlink (hourly)
- `useSiwe()` — SIWE session (`isAuthenticated`, `session`, `signIn`, `signOut`)
- `useDwebClient()` — IPFS/Arweave fetch client
- `useResolvedUrl(uri)` — reactive URI resolution
- `useWalletExplorer()` — WalletConnect wallet discovery

## Utilities

- `shortAddress(address, length)` — truncate address
- `formatETH(value, maxDecimals)` — format ETH
- `resolveChain(id)` — chain ID → viem Chain
- `createCache(ttl, max)` — LRU cache with TTL
- `createSiweMessage(params)` — EIP-4361 message
- `formatPrice(num, digits)` — format USD price
- `stringifyJSON`, `parseJSON` — safe JSON helpers
- `ensCache`, `fetchEnsFromIndexer`, `fetchEnsFromChain` — ENS resolution internals
- `createDwebFetch` — re-exported from `@1001-digital/dweb-fetch`

## Connectors

- `inAppWallet()` — wagmi connector for browser-based wallet
- `prepareInAppWallet()` — prepare wallet from mnemonic

## Directory structure

```
src/
├── index.ts                  # Barrel export
├── client-only.ts            # Client-only component list
├── config.ts                 # EvmConfig interface, injection key, useEvmConfig
├── types.ts                  # All component Props/Emits interfaces
├── components/               # 18 Vue SFC components
├── composables/              # 8 composable files
├── utils/                    # 8 utility files
├── connectors/
│   └── inAppWallet.ts        # Browser wallet connector
└── assets/wallets/           # SVG icons for wallet connectors
```
