# AGENTS.md

Nuxt layer for building dAPPs (Ethereum-powered applications). Extends `@1001-digital/layers.base`.

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

Configured chains: resolved dynamically from `app.config.ts` via `evm.chains` map (supports mainnet, sepolia, holesky, optimism, arbitrum, base, polygon, localhost out of the box)

Connectors: injected, coinbaseWallet, metaMask, walletConnect

## Components

- `EvmConnect.client.vue` - Wallet connection button with modal
- `EvmAccount.client.vue` - Address display
- `EvmTransactionFlow.vue` - Guided transaction execution flow
- `EvmConnectorQR.client.vue` - Base QR code renderer
- `EvmWalletConnectQR.client.vue` - WalletConnect QR wrapper
- `EvmMetaMaskQR.client.vue` - MetaMask QR wrapper

## Composables

- `useChainConfig(key?)` - Get `{ id, blockExplorer }` for a named chain (defaults to `defaultChain`)
- `useMainChainId()` - Get main chain ID from app config
- `useBlockExplorer(key?)` - Get block explorer URL for a named chain
- `useEnsureChainIdCheck()` - Validate/switch chain before transactions
- `useBaseURL()` - Get base URL with trailing slash

## Utilities

- `shortAddress(address, length)` - Truncate address for display
- `formatETH(value, maxDecimals)` - Format ETH values
- `resolveChain(id)` - Resolve chain ID to viem Chain object

## Configuration

Static chain config lives in `app.config.ts` (safe to commit):

```ts
evm: {
  title: 'My dApp',
  defaultChain: 'mainnet',
  chains: {
    mainnet: { id: 1, blockExplorer: 'https://etherscan.io' },
  },
}
```

Sensitive RPC URLs live in `runtimeConfig.public.evm` (env-driven):

```bash
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=""
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPC1=""
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPC2=""
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPC3=""
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
