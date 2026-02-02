# BASE LAYER

Nuxt layer for web application development with semi opinionated styling setup and components using [Reka UI](https://reka-ui.com).

## Setup

```bash
pnpm install
```

## Development

Running `pnpm dev` will prepare and boot `.playground` directory, which imports the layer itself.

## Icons

The base `Icon` component relies on Nuxt Icon aliases. Defaults are limited to icons used outside `.playground`. Extend or override aliases via `nuxt.config`:

```ts
export default defineNuxtConfig({
  icon: {
    aliases: {
      check: 'custom:check-circle',
      add: 'heroicons:plus'
    }
  }
})
```
