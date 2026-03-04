# AGENTS.md

EVM component library (`@1001-digital/components.evm`) — Ethereum wallet components and composables.

Peer-depends on `@1001-digital/components` for base UI components.

## Code style

- TypeScript
- Single quotes, no semicolons

## Structure

- `src/` — Components, composables, utils, and connectors
- `src/index.ts` — Main entry point (barrel exports)

## Components

Ethereum wallet components (require `@wagmi/vue` and `viem`):

- EvmConnect, EvmConnectDialog, EvmAccount, EvmConnectionStatus
- EvmProfile, EvmAvatar, EvmSiwe, EvmSiweDialog
- EvmTransactionFlow, EvmSwitchNetwork
- EvmConnectorQR, EvmWalletConnectQR, EvmWalletConnectWallets, EvmMetaMaskQR
- EvmInAppWalletSetup, EvmSeedPhraseInput

## Composables

- `useEvmConfig()` — EVM configuration
- `useChainConfig()`, `useMainChainId()`, `useBlockExplorer()` — Chain utilities
- `useEns()`, `useEnsWithAvatar()`, `useEnsProfile()` — ENS resolution
- `useGasPrice()`, `usePriceFeed()` — Price feeds
- `useDwebClient()` — Decentralized web fetch client (IPFS, IPNS, Arweave)
- `useResolvedUrl()` — Reactive URI resolution
- `useSiwe()` — Sign-In with Ethereum
- `useWalletExplorer()` — Wallet explorer
- `useBaseURL()` — Base URL helper

## Utilities

- `shortAddress()` — Truncate address for display
- `formatETH()` — Format ETH values
- `resolveChain()` — Resolve chain ID to viem Chain object
- `createCache()` — Cache factory
- ENS utilities, SIWE message creation, price formatting
