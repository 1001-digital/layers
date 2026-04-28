# Playgrounds

The repository already includes package-local Nuxt playgrounds:

```txt
packages/layers.base/.playground
packages/layers.evm/.playground
```

They are development harnesses for the layers. They are not documentation sites and should not be replaced by `/docs`.

## Base Playground

Run it from the base layer package:

```bash
cd packages/layers.base
pnpm dev
```

The base playground extends the local layer source with:

```ts
export default defineNuxtConfig({
  extends: ['..'],
})
```

It demonstrates design tokens, core components, form controls, overlays, toasts, layout components, and base routing examples.

## EVM Playground

Run it from the EVM layer package:

```bash
cd packages/layers.evm
pnpm dev
```

The EVM playground extends the local EVM layer and includes pages for wallet connection, transaction flow states, SIWE variants, artifact previews, and account display.

## When to Use Each Surface

| Surface            | Purpose                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `/docs`            | Public usage docs, installation, configuration, component references, and package reference.           |
| `.playground` apps | Local behavior verification while developing layers and components.                                    |
| Consumer fixture   | Optional future package-boundary test that installs the published package names like a downstream app. |

Use playgrounds when a component needs visual or interactive validation. Use docs when documenting how consumers install, configure, and compose the packages.
