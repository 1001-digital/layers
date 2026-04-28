# Configuration

## Base Layer

The base layer needs no app config to work:

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

You can customize Nuxt Icon aliases in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
  icon: {
    aliases: {
      add: 'lucide:plus',
      external: 'lucide:external-link',
    },
  },
})
```

## EVM Layer Nuxt Config

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
  runtimeConfig: {
    public: {
      evm: {
        walletConnectProjectId: '',
        chains: {
          mainnet: {
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

Runtime config is the right place for per-environment endpoint values. The layer reads it in the wagmi plugin and merges it with `app.config.ts`.

## EVM App Config

```ts
export default defineAppConfig({
  evm: {
    title: 'EVM Layer',
    appLogoUrl: '',
    defaultChain: 'mainnet',
    chains: {
      mainnet: {
        id: 1,
        blockExplorer: 'https://evm.now',
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
      description: 'Ethereum app',
      iconPath: '/icon.png',
    },
  },
})
```

| Key                   | Type                                                      | Purpose                                                 |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `title`               | `string`                                                  | App name used by wallet connectors and UI.              |
| `appLogoUrl`          | `string`                                                  | App logo used by connectors and Safe manifest defaults. |
| `defaultChain`        | `string`                                                  | Key in `chains` used as the primary chain.              |
| `chains`              | `Record<string, { id?: number; blockExplorer?: string }>` | Named chain definitions.                                |
| `ens.mode`            | `'indexer' \| 'chain'`                                    | ENS resolution strategy.                                |
| `ipfsGateway`         | `string`                                                  | Gateway used to resolve IPFS URLs.                      |
| `arweaveGateway`      | `string`                                                  | Gateway used to resolve Arweave URLs.                   |
| `inAppWallet.enabled` | `boolean`                                                 | Enables the integrated in-app wallet connector.         |
| `safe.description`    | `string`                                                  | Description in `/manifest.json` for Safe.               |
| `safe.iconPath`       | `string`                                                  | Safe manifest icon path.                                |

## Chain Configuration

Each configured chain needs a viem-supported chain ID:

```ts
chains: {
  mainnet: {
    id: 1,
    blockExplorer: 'https://etherscan.io',
  },
  sepolia: {
    id: 11155111,
    blockExplorer: 'https://sepolia.etherscan.io',
  },
}
```

Runtime RPC URLs are keyed by the same chain names:

```ts
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
}
```

The first RPC URL is exposed on `EvmConfig.rpcUrls[chainId]`. Wagmi receives all configured RPC URLs as a fallback transport list.

## Safe Manifest

The EVM layer serves `/manifest.json` for Safe apps. The manifest uses:

- `evm.title` for the name
- `evm.safe.description`, falling back to `evm.title`
- `evm.safe.iconPath`, falling back to `evm.appLogoUrl`, then `/icon.png`

Configure these values in `app.config.ts` when your app is intended to run inside Safe.
