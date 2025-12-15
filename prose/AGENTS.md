# AGENTS.md

Nuxt layer for content-driven sites with typography and prose styling. Extends `@1001.digital/layers.base`.

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`

## Styling

- Typography styles in `app/assets/styles/layers/prose.css`
- Uses CSS layer `@layer(components)` for cascade control
- Inherits CSS variables from base layer

## Components

- `Prose.vue` - Main wrapper for prose content, applies typography and spacing
  - Props: `centered` (boolean) for center-aligned text
- Styled elements within `.prose`: headings, links, blockquotes, lists, code blocks, tables, footnotes

## Key directories

```
app/
├── components/
│   └── Prose.vue            # Main prose container
├── assets/styles/
│   └── layers/
│       └── prose.css        # Typography & content styles
```
