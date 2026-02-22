# AGENTS.md

Base Nuxt layer for building modern web applications with accessible components and CSS custom properties.

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`

## Code style

- TypeScript
- Single quotes, no semicolons

## Styling

- CSS custom properties (design tokens) in `app/assets/styles/variables/`
- CSS layers: `reset` → `base` → `components` → `utilities`
- oklch color space with `light-dark()` for theme support
- Component-specific variables in `variables/components/`

## Components

- Base components use [Reka UI](https://reka-ui.com/llms.txt) for accessibility, with our custom styling framework
- For tables and virtualization we use Tanstack (e.g. [Tanstack Table](https://tanstack.com/table/latest/docs/introduction.md) and [Tanstack Virtualization](https://tanstack.com/virtual/latest/docs/introduction.md)).
- Icon.vue maps semantic names (e.g. 'check', 'add') to Lucide/Simple Icons

## Component naming

Components in nested directories use auto-generated names based on path and filename, with duplicate segments removed.

Example: `components/base/foo/Button.vue` → `<BaseFooButton />`

For clarity, rename files to match the full component name:

- ✗ `components/base/foo/Button.vue`
- ✓ `components/base/foo/BaseFooButton.vue`

## Key directories

```
app/
├── components/          # Vue components
│   └── Form/            # Form components (Reka UI wrappers)
├── assets/styles/
│   ├── base/            # Element defaults, reset
│   ├── utilities/       # Helper classes, animations
│   └── variables/       # Design tokens (colors, spacing, etc.)
```
