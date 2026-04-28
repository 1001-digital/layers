# Getting Started

## Choose a Layer

Use `@1001-digital/layers.base` for general Nuxt applications:

```bash
pnpm add @1001-digital/layers.base
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

Use `@1001-digital/layers.evm` for Ethereum or EVM applications:

```bash
pnpm add @1001-digital/layers.evm
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
})
```

The EVM layer extends the base layer, so EVM apps also receive the base components, styles, and icon configuration.

## Use Components

Layer components are registered as Nuxt auto-imported components. In a page or component, use them directly:

```vue
<template>
  <Card>
    <h2>Create project</h2>
    <p class="muted">Configure the project before publishing it.</p>

    <Actions>
      <Button class="primary">
        <Icon name="check" />
        <span>Create</span>
      </Button>
    </Actions>
  </Card>
</template>
```

EVM components work the same way after extending `@1001-digital/layers.evm`:

```vue
<template>
  <EvmConnectDialog>
    <template #connected="{ address }">
      <EvmAccount :address="address" />
    </template>
  </EvmConnectDialog>
</template>
```

## Configure an EVM App

Use `app.config.ts` for public app behavior that can be bundled with the application:

```ts
// app.config.ts
export default defineAppConfig({
  evm: {
    title: 'My App',
    appLogoUrl: '/icon.png',
    defaultChain: 'sepolia',
    chains: {
      sepolia: {
        id: 11155111,
        blockExplorer: 'https://sepolia.etherscan.io',
      },
    },
    ens: {
      mode: 'indexer',
    },
    ipfsGateway: 'https://ipfs.io/ipfs/',
    arweaveGateway: 'https://arweave.net/',
  },
})
```

Use runtime config or environment variables for endpoint values:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
  runtimeConfig: {
    public: {
      evm: {
        chains: {
          sepolia: {
            rpcs: '',
          },
        },
      },
    },
  },
})
```

```bash
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=...
NUXT_PUBLIC_EVM_CHAINS_SEPOLIA_RPCS="https://rpc.example https://backup.example"
NUXT_PUBLIC_EVM_ENS_INDEXERS="https://ens.example"
```

Nuxt only applies environment overrides to runtime config keys that exist in `runtimeConfig`. Add a key such as `public.evm.chains.sepolia.rpcs` when you need an env var for a non-default chain.

## Direct Vue Usage

The component packages can be imported without Nuxt:

```ts
import { Button, Card, useToast } from '@1001-digital/components'
import { EvmAccount, shortAddress } from '@1001-digital/components.evm'
```

When you use the component packages directly, you are responsible for importing `@1001-digital/styles` and registering any app-level providers that the layer would normally provide.

## Development Workflow

This repository uses package-local Nuxt playgrounds for layer development:

```bash
cd packages/layers.base
pnpm dev
```

```bash
cd packages/layers.evm
pnpm dev
```

Use those playgrounds to verify component behavior while developing the packages. Use this docs site for installation, configuration, and reference material.
