# BASE LAYER

Nuxt layer for web application development with semi opinionated styling setup and components using [Reka UI](https://reka-ui.com).

## Setup

```bash
pnpm install
```

## Development

Running `pnpm dev` will prepare and boot `.playground` directory, which imports the layer itself.

## Icons

The base `Icon` component includes a default semantic icon map. Extending layers or apps can override or add entries via `app.config`:

```ts
export default defineAppConfig({
  icons: {
    map: {
      check: 'custom:check-circle',
      add: 'heroicons:plus'
    }
  }
})
```
