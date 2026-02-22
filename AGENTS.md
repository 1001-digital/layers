# AGENTS.md

Monorepo containing Nuxt layers.

- `base` the base layer for creating modern web applications.
- `prose` the layer to extend when building content driven sites.
- `evm` the layer to extend when building dAPPs (Ethereum powered applications).

## Code style

- TypeScript
- Single quotes, no semicolons

## Component naming

Components in nested directories use auto-generated names based on path and filename, with duplicate segments removed.

Example: `components/base/foo/Button.vue` → `<BaseFooButton />`

For clarity, rename files to match the full component name:

- ✗ `components/base/foo/Button.vue`
- ✓ `components/base/foo/BaseFooButton.vue`
