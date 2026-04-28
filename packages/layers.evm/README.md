# @1001-digital/layers.evm

Nuxt layer for EVM applications. It extends `@1001-digital/layers.base` and adds wallet connection, SIWE, ENS, multi-chain config, EVM components, composables, and transaction flows.

## Documentation

Full docs live in the repository [`/docs`](https://github.com/1001-digital/layers/tree/master/docs).

- [Getting Started](https://github.com/1001-digital/layers/blob/master/docs/getting-started.md)
- [EVM Layer](https://github.com/1001-digital/layers/blob/master/docs/layers/evm.md)
- [EVM Components](https://github.com/1001-digital/layers/blob/master/docs/components/evm.md)
- [Configuration](https://github.com/1001-digital/layers/blob/master/docs/reference/configuration.md)
- [Environment Variables](https://github.com/1001-digital/layers/blob/master/docs/reference/environment.md)

## Install

```bash
pnpm add @1001-digital/layers.evm
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
})
```

## Development

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```
