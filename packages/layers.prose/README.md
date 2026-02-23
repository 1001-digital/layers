# @1001-digital/layers.prose

Nuxt layer for content-driven sites. Extends the [base layer](../layers.base) with typography and prose styling.

## Installation

```bash
pnpm add @1001-digital/layers.prose
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.prose'],
})
```

## Components

- **Prose** - Content wrapper with typography styles
  - `centered` prop for center-aligned text

## Styled Elements

Wrap content in `<Prose>` to apply styles for:

- Headings (h1-h6)
- Links with hover transitions
- Tables with borders and padding
- Ordered and unordered lists (with nesting)
- Blockquotes with accent borders and citation support
- Images with borders and figure captions
- Code blocks with syntax styling and horizontal scroll
- Horizontal rules
- Footnotes

## Dependencies

- [@1001-digital/layers.base](../layers.base) - Foundation layer (components, design tokens, utilities)

## Development

```bash
pnpm dev        # Start playground dev server
pnpm build      # Build playground
pnpm typecheck  # Run type checks
pnpm lint       # Lint
```
