# @1001-digital/layers.evm

Nuxt layer for building Ethereum dAPPs. Extends the [base layer](../layers.base) with wallet connection, chain management, and Web3 utilities.

## Installation

```bash
pnpm add @1001-digital/layers.evm
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
})
```

## Features

- Wallet connection (MetaMask, Coinbase, WalletConnect, Safe, injected)
- Multiple RPC endpoints with fallback
- Chain switching (mainnet, sepolia, holesky, optimism, arbitrum, base, polygon, localhost)
- ENS resolution (via indexer or on-chain)
- ETH price feed with hourly refresh
- IPFS and Arweave gateway support

## Components

- **EvmAccount** - Account display
- **EvmAvatar** - ENS avatar with generative fallback
- **EvmConnect** - Wallet connection UI
- **EvmConnectorQR** / **EvmMetaMaskQR** / **EvmWalletConnectQR** - QR code connectors
- **EvmProfile** - ENS profile with avatar and header
- **EvmSwitchNetwork** - Network switching UI
- **EvmTransactionFlow** - Transaction status flow
- **EvmWalletConnectWallets** - WalletConnect wallet list

All components are client-only.

## Composables

- `useChainConfig(key?)` - Get chain configuration (id, block explorer)
- `useMainChainId()` - Get the main chain ID
- `useBlockExplorer(key?)` - Get block explorer URL
- `useEnsureChainIdCheck()` - Validate and switch chain before transactions
- `useEns()` / `useEnsWithAvatar()` / `useEnsProfile()` - ENS resolution
- `useGasPrice()` - Current gas prices
- `usePriceFeed()` - ETH price feed
- `useResolveUri()` - IPFS/Arweave/data URI resolution
- `useWalletExplorer()` - Wallet connection explorer with search
- `useBaseURL()` - Base URL helper

## Utilities

```ts
shortAddress('0x1234...abcd')           // '0x123...bcd'
formatETH(1000000000000000000n)          // '1'
resolveChain(1)                          // mainnet Chain object
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
})
```

```ts
// app.config.ts
export default defineAppConfig({
  evm: {
    title: 'My dApp',
    defaultChain: 'mainnet',
    chains: {
      mainnet: {
        id: 1,
        blockExplorer: 'https://etherscan.io',
      },
    },
    ens: { mode: 'indexer' },
    ipfsGateway: 'https://ipfs.io/ipfs/',
    arweaveGateway: 'https://arweave.net/',
  },
})
```

RPC and API endpoints are configured via environment variables:

```bash
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=...
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPC1=https://...
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPC2=https://...
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPC3=https://...
NUXT_PUBLIC_EVM_ENS_INDEXER1=https://...
```

## Dependencies

- [@1001-digital/layers.base](../layers.base) - Foundation layer
- [Wagmi](https://wagmi.sh) - Vue hooks for Ethereum
- [Viem](https://viem.sh) - Type-safe Ethereum utilities
- [TanStack Query](https://tanstack.com/query) - Data fetching and caching

## Development

```bash
pnpm dev        # Start playground dev server
pnpm build      # Build playground
pnpm typecheck  # Run type checks
pnpm lint       # Lint
```
