# @1001-digital/layers

Monorepo containing composable Nuxt layers, shared Vue component packages, and a CSS design token framework.

## Documentation

Comprehensive docs live in [`/docs`](./docs):

```bash
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

Start with [`docs/getting-started.md`](./docs/getting-started.md) for installation and usage.

## Packages

| Package                                                     | Purpose                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@1001-digital/layers.base`](./packages/layers.base)       | Base Nuxt layer with components, icons, and styles.                      |
| [`@1001-digital/layers.evm`](./packages/layers.evm)         | EVM Nuxt layer with wallet connection, SIWE, ENS, and transaction flows. |
| [`@1001-digital/components`](./packages/components)         | Shared Vue component library.                                            |
| [`@1001-digital/components.evm`](./packages/components.evm) | EVM Vue components, composables, and utilities.                          |
| [`@1001-digital/styles`](./packages/styles)                 | CSS framework and design tokens.                                         |

## Quick Start

```bash
pnpm add @1001-digital/layers.base
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

For EVM apps:

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
pnpm install
pnpm format:check
pnpm typecheck
```

Each layer has a package-local playground:

```bash
cd packages/layers.base
pnpm dev
```

```bash
cd packages/layers.evm
pnpm dev
```

## Releases

This project uses Changesets for versioning and npm publishing:

```bash
pnpm changeset
```

Docs-only changes normally do not need a changeset.
