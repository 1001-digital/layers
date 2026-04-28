# Packages

## Published Packages

| Package                        | Entry            | Description                                                  |
| ------------------------------ | ---------------- | ------------------------------------------------------------ |
| `@1001-digital/layers.base`    | `nuxt.config.ts` | Base Nuxt layer with components, icons, and styles.          |
| `@1001-digital/layers.evm`     | `nuxt.config.ts` | EVM Nuxt layer that extends the base layer.                  |
| `@1001-digital/components`     | `src/index.ts`   | Framework-agnostic Vue base component library.               |
| `@1001-digital/components.evm` | `src/index.ts`   | Framework-agnostic Vue EVM component and composable library. |
| `@1001-digital/styles`         | `src/index.css`  | CSS framework and design tokens.                             |

## Recommended Entrypoints

Use a Nuxt layer when building a Nuxt app:

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
})
```

Use component packages directly when building a non-Nuxt Vue app or a lower-level package:

```ts
import { Button, Card } from '@1001-digital/components'
import { EvmAccount } from '@1001-digital/components.evm'
import '@1001-digital/styles'
```

## Dependency Direction

```txt
@1001-digital/layers.evm
  depends on @1001-digital/layers.base
  depends on @1001-digital/components
  depends on @1001-digital/components.evm

@1001-digital/layers.base
  depends on @1001-digital/components
  depends on @1001-digital/styles

@1001-digital/components.evm
  peers with @1001-digital/components
  peers with wagmi, viem, Vue, and optional artifact dependencies
```

The component packages are reusable Vue libraries. The layer packages are Nuxt integration packages.

## Package-local Development

Run layer playground commands from inside the relevant package:

```bash
cd packages/layers.base
pnpm dev
```

```bash
cd packages/layers.evm
pnpm dev
```

Run cross-package checks from the repository root:

```bash
pnpm typecheck
pnpm format:check
```
