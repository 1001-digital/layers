# @1001-digital/layers.base

Base Nuxt layer for shared UI components, Nuxt Icon aliases, and global CSS design tokens.

## Documentation

Full docs live in the repository [`/docs`](https://github.com/1001-digital/layers/tree/master/docs).

- [Getting Started](https://github.com/1001-digital/layers/blob/master/docs/getting-started.md)
- [Base Layer](https://github.com/1001-digital/layers/blob/master/docs/layers/base.md)
- [Base Components](https://github.com/1001-digital/layers/blob/master/docs/components/base.md)
- [Design Tokens](https://github.com/1001-digital/layers/blob/master/docs/styles.md)

## Install

```bash
pnpm add @1001-digital/layers.base
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

## Development

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```
