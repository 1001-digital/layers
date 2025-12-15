# AGENTS.md

Nuxt layer for building dAPPs (Ethereum-powered applications). Extends `@1001.digital/layers.base`.

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Prepare types: `pnpm dev:prepare`

## Dependencies

- `@wagmi/vue` (0.4.x) - Wallet connection, contract reads/writes, account state
- `viem` - Type-safe Ethereum utilities, ABI encoding, transaction simulation
- `@tanstack/vue-query` - Caching and synchronization of blockchain data
- `qrcode` - QR code generation for wallet connect URIs

## Wagmi Configuration

Uses modern wagmi 0.4.x patterns:
- `useConnection` (not deprecated `useAccount`)
- `useConnectionEffect` (not deprecated `useAccountEffect`)
- `useSwitchConnection` (not deprecated `useSwitchAccount`)

Configured chains: mainnet, sepolia, holesky, localhost

Connectors: injected, coinbaseWallet, metaMask, walletConnect

## Components

- `EvmConnect.client.vue` - Wallet connection button with modal
- `EvmAccount.client.vue` - Address display with ENS resolution
- `EvmTransactionFlow.vue` - Guided transaction execution flow
- `EvmConnectorQR.client.vue` - Base QR code renderer
- `EvmWalletConnectQR.client.vue` - WalletConnect QR wrapper
- `EvmMetaMaskQR.client.vue` - MetaMask QR wrapper

## Composables

- `useMainChainId()` - Get configured chain ID from runtime config
- `useEnsureChainIdCheck()` - Validate/switch chain before transactions
- `useBaseURL()` - Get base URL with trailing slash
- `useClipboard()` - Copy text to clipboard with copied state

## Utilities

- `shortAddress(address, length)` - Truncate address for display
- `formatETH(value, maxDecimals)` - Format ETH values

## Environment Variables

```bash
NUXT_PUBLIC_TITLE="App Name"
NUXT_PUBLIC_CHAIN_ID=1
NUXT_PUBLIC_BLOCK_EXPLORER="https://etherscan.io"
NUXT_PUBLIC_RPC1=""
NUXT_PUBLIC_RPC2=""
NUXT_PUBLIC_RPC3=""
NUXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=""
```

## Key directories

```
app/
├── components/          # Vue components (Evm* prefixed)
├── composables/         # Composables (chainId, helpers)
├── plugins/             # Wagmi plugin configuration
└── utils/               # Utility functions
public/
└── icons/wallets/       # Wallet connector icons
```
