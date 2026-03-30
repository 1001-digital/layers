# AGENTS.md

Monorepo containing Nuxt layers, a shared component library, and a shared CSS framework.

## Packages

| Package          | npm                            | Purpose                                                                   |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `layers.base`    | `@1001-digital/layers.base`    | Base Nuxt layer — accessible components, design tokens, Nuxt auto-imports |
| `layers.evm`     | `@1001-digital/layers.evm`     | EVM Nuxt layer — wallet connection, ENS, SIWE, multi-chain (extends base) |
| `components`     | `@1001-digital/components`     | Vue component library — Reka UI wrappers, composables, utilities          |
| `components.evm` | `@1001-digital/components.evm` | EVM component library — wallet UI, ENS, transaction flow                  |
| `styles`         | `@1001-digital/styles`         | CSS framework — design tokens, layers, oklch colors                       |

## Architecture

```
Consumer Nuxt App
  └─ extends layers.evm (or layers.base)
       ├─ layers.base
       │    ├─ components (auto-imported)
       │    └─ styles (CSS loaded globally)
       └─ components.evm (auto-imported)
```

Layers re-export composables/utils from component packages so Nuxt auto-imports them. The component packages are framework-agnostic Vue libraries that can also be used outside Nuxt.

## Setup

- Package manager: **pnpm** (workspaces, `pnpm-workspace.yaml`)
- Install: `pnpm install`
- Dev server (per package): `cd packages/<name> && pnpm dev`
- Format: `pnpm format` (prettier — single quotes, no semicolons)
- Typecheck: `pnpm typecheck` (runs across all packages)

## Code style

- TypeScript, single quotes, no semicolons
- Vue 3 Composition API with `<script setup lang="ts">`
- Plain CSS (no preprocessors), CSS custom properties for tokens

## Component naming

Components in nested directories use auto-generated names based on path and filename, with duplicate segments removed.

Example: `components/base/foo/Button.vue` → `<BaseFooButton />`

For clarity, rename files to match the full component name:

- ✗ `components/base/foo/Button.vue`
- ✓ `components/base/foo/BaseFooButton.vue`

## Client-only components

Components requiring browser APIs are marked client-only via Nuxt config hooks (not `.client.vue` suffix). Each component package exports a `clientOnlyComponents` array from `client-only.ts`.

## Key patterns

- **Reka UI** for accessible primitives (ARIA, keyboard nav) — see [reka-ui.com/llms.txt](https://reka-ui.com/llms.txt)
- **Tanstack** for tables and virtualization
- **provide/inject** for config (`EvmConfigKey`, `LinkComponentKey`, `IconAliasesKey`)
- **Vite aliases** in layers.evm to deduplicate `@wagmi/vue` and `eventemitter3` (critical for provide/inject)
- **Re-export pattern**: layers re-export from component packages → Nuxt auto-import works seamlessly

## Releases

Uses **Changesets** for versioning and npm publishing:

1. `pnpm changeset` — create changeset
2. Push to `master` → GitHub Action opens "Version Packages" PR
3. Merge PR → packages published to npm

Config: `.changeset/config.json`, workflow: `.github/workflows/release.yml`
