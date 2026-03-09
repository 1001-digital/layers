# AGENTS.md

Thin Nuxt layer for content-driven sites. Extends `@1001-digital/layers.base` and imports prose typography CSS.

All content lives in shared packages:
- `@1001-digital/styles/prose.css` - Typography and content styling
- `@1001-digital/components` - `Prose` component (wrapper with `centered` prop)

This layer only exists as a convenience — it extends base and imports the prose CSS. Apps can achieve the same by importing the CSS and component directly.
