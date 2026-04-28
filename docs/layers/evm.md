# EVM Layer

`@1001-digital/layers.evm` is the Nuxt layer for EVM applications. It extends `@1001-digital/layers.base`, then adds wallet connectors, wagmi setup, EVM components, EVM composables, transaction helpers, ENS resolution, and decentralized-web URL handling.

## Installation

```bash
pnpm add @1001-digital/layers.evm
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
})
```

You do not need to also extend the base layer. The EVM layer already does that.

## What the Layer Adds

| Area       | Behavior                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Components | Auto-registers components from `@1001-digital/components.evm`.                                        |
| Wallets    | Configures injected wallets, Safe, Base Account, MetaMask, WalletConnect, and optional in-app wallet. |
| Data       | Installs `@wagmi/vue` and TanStack Query through the layer plugin.                                    |
| Config     | Merges `app.config.ts` app behavior with `runtimeConfig.public.evm` endpoint values.                  |
| Utilities  | Re-exports EVM composables and utilities for Nuxt auto-imports.                                       |
| Safe Apps  | Serves a Safe app manifest at `/manifest.json`.                                                       |

## App Config

Use `app.config.ts` for app behavior that is safe to bundle:

```ts
export default defineAppConfig({
  evm: {
    title: 'My dApp',
    appLogoUrl: '/icon.png',
    defaultChain: 'sepolia',
    chains: {
      sepolia: {
        id: 11155111,
        blockExplorer: 'https://sepolia.etherscan.io',
      },
      base: {
        id: 8453,
        blockExplorer: 'https://basescan.org',
      },
    },
    ens: {
      mode: 'indexer',
    },
    ipfsGateway: 'https://ipfs.io/ipfs/',
    arweaveGateway: 'https://arweave.net/',
    inAppWallet: {
      enabled: false,
    },
    safe: {
      description: 'My dApp in Safe',
      iconPath: '/icon.png',
    },
  },
})
```

The `defaultChain` value must match a key in `chains`. The layer sorts that chain first because wagmi treats the first chain as the default.

## Runtime Config and Environment Variables

Use runtime config for endpoint values and IDs that should be set per environment:

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
  runtimeConfig: {
    public: {
      evm: {
        walletConnectProjectId: '',
        chains: {
          sepolia: {
            rpcs: '',
          },
          base: {
            rpcs: '',
          },
        },
        ens: {
          indexers: '',
        },
      },
    },
  },
})
```

```bash
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=...
NUXT_PUBLIC_EVM_CHAINS_SEPOLIA_RPCS="https://rpc1.example https://rpc2.example"
NUXT_PUBLIC_EVM_CHAINS_BASE_RPCS="https://base-rpc.example"
NUXT_PUBLIC_EVM_ENS_INDEXERS="https://ens-indexer.example"
```

RPC and ENS indexer values are parsed as whitespace-separated lists. For each configured chain, the EVM layer builds a wagmi fallback transport from custom RPCs, the injected connector, and default HTTP.

Nuxt environment overrides must correspond to declared runtime config keys. Declare a `public.evm.chains.<key>.rpcs` entry for every chain you expect to configure through env vars.

## Components

All EVM components are marked client-only by the layer. Use them normally:

```vue
<template>
  <EvmConnectDialog>
    <template #connected="{ address }">
      <EvmAccount :address="address" />
    </template>
  </EvmConnectDialog>
</template>
```

See [EVM Components](/components/evm) for practical usage references.

## SIWE

SIWE components expect the app to provide nonce and verification functions:

```vue
<template>
  <EvmSiweDialog
    :get-nonce="getNonce"
    :verify="verify"
    @authenticated="onAuthenticated"
  />
</template>
```

```ts
const getNonce = () => $fetch<string>('/api/siwe/nonce')

const verify = (message: string, signature: string) =>
  $fetch<boolean>('/api/siwe/verify', {
    method: 'POST',
    body: { message, signature },
  })
```

The layer provides UI and message helpers. Your app still owns session persistence, nonce storage, and server-side verification.

## SSR

SSR is enabled by default. Set `NUXT_SSR=false` to disable SSR for apps that need a fully client-rendered deployment.

Browser-dependent wallet and EVM components are still registered as client-only even when SSR is enabled.

## Vite Resolution

The layer aliases `@wagmi/vue` and `eventemitter3` to a single package instance. This prevents duplicated dependency instances in pnpm installs from breaking Vue provide/inject behavior or wallet connector interop.
