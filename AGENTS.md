# AGENTS.md

Monorepo containing Nuxt layers, a shared component library, and a shared CSS framework.

## Packages

- `layers.base` — Base Nuxt layer for modern web applications
- `layers.prose` — Nuxt layer for content-driven sites (extends base)
- `layers.evm` — Nuxt layer for Ethereum dAPPs (extends base)
- `components` — Shared Vue component library (`@1001-digital/components`)
- `components.evm` — EVM/wallet components and composables (`@1001-digital/components.evm`)
- `styles` — Shared CSS framework and design tokens (`@1001-digital/styles`)

## Setup

- Package manager: pnpm (workspaces)
- Install deps: `pnpm install`

## Code style

- TypeScript
- Single quotes, no semicolons

## Component naming

Components in nested directories use auto-generated names based on path and filename, with duplicate segments removed.

Example: `components/base/foo/Button.vue` → `<BaseFooButton />`

For clarity, rename files to match the full component name:

- ✗ `components/base/foo/Button.vue`
- ✓ `components/base/foo/BaseFooButton.vue`
