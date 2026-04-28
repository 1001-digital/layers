# Environment Variables

Nuxt maps environment variables into `runtimeConfig` when the corresponding runtime config key exists. For EVM apps, declare the runtime config structure in `nuxt.config.ts`, then set the matching `NUXT_PUBLIC_*` variables in each environment.

## Common Variables

| Variable                                    | Runtime config key                  | Purpose                                         |
| ------------------------------------------- | ----------------------------------- | ----------------------------------------------- |
| `NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID` | `public.evm.walletConnectProjectId` | Enables WalletConnect.                          |
| `NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPCS`       | `public.evm.chains.mainnet.rpcs`    | Space-separated mainnet RPC URLs.               |
| `NUXT_PUBLIC_EVM_CHAINS_SEPOLIA_RPCS`       | `public.evm.chains.sepolia.rpcs`    | Space-separated sepolia RPC URLs when declared. |
| `NUXT_PUBLIC_EVM_ENS_INDEXERS`              | `public.evm.ens.indexers`           | Space-separated ENS indexer base URLs.          |
| `NUXT_SSR`                                  | `ssr`                               | Set to `false` to disable SSR in the EVM layer. |

## Example

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
          sepolia: {
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
NUXT_PUBLIC_EVM_WALLET_CONNECT_PROJECT_ID=abc123
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPCS="https://mainnet-1.example https://mainnet-2.example"
NUXT_PUBLIC_EVM_CHAINS_SEPOLIA_RPCS="https://sepolia.example"
NUXT_PUBLIC_EVM_ENS_INDEXERS="https://ens.example"
```

## RPC Parsing

RPC variables are whitespace-separated. Each URL becomes a wagmi transport:

```bash
NUXT_PUBLIC_EVM_CHAINS_MAINNET_RPCS="https://rpc1.example wss://rpc2.example"
```

URLs beginning with `wss://` use websocket transport. Other URLs use HTTP transport. The layer then appends injected connector transport and default HTTP as fallbacks.

## WalletConnect

WalletConnect is only added when both conditions are true:

- the app is running on the client
- `walletConnectProjectId` is configured

Without a project ID, other connectors can still be available.

## ENS Indexers

`NUXT_PUBLIC_EVM_ENS_INDEXERS` is used when `app.config.ts` sets:

```ts
export default defineAppConfig({
  evm: {
    ens: {
      mode: 'indexer',
    },
  },
})
```

Set `mode: 'chain'` to resolve ENS on-chain instead of using indexers.
