# Architecture

The repository is organized as a set of published packages that can be used together or individually.

```txt
Consumer Nuxt App
  extends @1001-digital/layers.evm
    extends @1001-digital/layers.base
      auto-imports @1001-digital/components
      loads @1001-digital/styles
    auto-imports @1001-digital/components.evm
```

## Package Roles

| Package                        | Role                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `@1001-digital/layers.base`    | Nuxt layer that registers base components, installs Nuxt Icon, provides icon/link injection keys, and loads global CSS. |
| `@1001-digital/layers.evm`     | Nuxt layer that extends the base layer and adds wagmi, wallet connectors, EVM components, composables, and utilities.   |
| `@1001-digital/components`     | Vue component library containing base components, composables, utilities, and injection keys.                           |
| `@1001-digital/components.evm` | Vue component library containing EVM components, EVM composables, wallet utilities, and config types.                   |
| `@1001-digital/styles`         | CSS framework with reset, base styles, utilities, and design tokens.                                                    |

## Nuxt Layer Behavior

The base layer registers component package files with `pathPrefix: false`, so components are used as `Button`, `Card`, `Dialog`, and similar names rather than package-prefixed names.

The EVM layer extends the base layer and registers EVM components the same way. It also installs the wagmi Nuxt module and a plugin that creates the wagmi config from `app.config.ts` and `runtimeConfig.public.evm`.

## Auto-import Re-exports

Layer `app/composables` and `app/utils` files re-export functions from the component packages. This makes package composables and utilities available through Nuxt auto-imports when a consumer extends a layer.

For example, a Nuxt app extending the EVM layer can call `useEnsProfile()`, `useTransactionFlow()`, `shortAddress()`, or `formatETH()` without explicit imports in most Nuxt contexts.

## Client-only Components

Browser-dependent components are marked client-only in Nuxt config hooks. The packages export `clientOnlyComponents` arrays so the layers can set Nuxt component mode without using `.client.vue` filenames.

This keeps published component filenames stable while still avoiding server rendering for components that depend on DOM APIs, wallet providers, QR rendering, or browser storage.

## Dependency Deduplication

The EVM layer applies Vite aliases for `@wagmi/vue` and `eventemitter3`. This is intentional: with pnpm, duplicate module instances can break Vue provide/inject behavior and can expose CJS/ESM interop issues during Vite development.

Do not remove those aliases unless the package resolution strategy changes and wallet connection is tested in a consumer Nuxt app.
