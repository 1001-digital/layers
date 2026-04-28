# Base Layer

`@1001-digital/layers.base` is the foundation Nuxt layer. It provides the shared CSS framework, Nuxt Icon configuration, base component auto-imports, and Nuxt-friendly providers for link and icon behavior.

## Installation

```bash
pnpm add @1001-digital/layers.base
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

## What the Layer Adds

| Area                 | Behavior                                                                        |
| -------------------- | ------------------------------------------------------------------------------- |
| Components           | Auto-registers base components from `@1001-digital/components`.                 |
| Styles               | Loads `@1001-digital/styles` globally.                                          |
| Icons                | Installs `@nuxt/icon` and configures semantic aliases.                          |
| Providers            | Provides the Nuxt link component and icon aliases to package components.        |
| Client-only handling | Marks browser-dependent components as client-only through Nuxt component hooks. |

## Component Names

Base components are auto-imported without a path prefix:

```vue
<template>
  <Card>
    <h2>Profile</h2>
    <p class="muted">Update account settings.</p>

    <Actions>
      <Button class="primary">
        <Icon name="check" />
        <span>Save</span>
      </Button>
    </Actions>
  </Card>
</template>
```

Use full generated component names for nested component files when adding new components in the source package. This keeps Nuxt auto-generated names predictable.

## Icons

The layer configures `@nuxt/icon` with `NuxtIcon` as the underlying component and exposes a small semantic alias set through the `Icon` component:

```vue
<Icon name="add" />
<Icon name="wallet" />
<Icon name="chevron-down" />
```

Built-in aliases:

`add`, `calendar`, `check`, `chevron-down`, `chevron-left`, `chevron-right`, `close`, `copy`, `edit`, `help`, `home`, `link`, `loader`, `menu`, `wallet`.

Override or extend aliases in Nuxt config:

```ts
export default defineNuxtConfig({
  icon: {
    aliases: {
      add: 'lucide:plus',
      external: 'lucide:external-link',
    },
  },
})
```

## Styles

The base layer loads `@1001-digital/styles`, including:

- CSS cascade layer declaration: `variables`, `reset`, `base`, `components`, `utilities`
- CSS variables for color, spacing, typography, borders, layout, timing, and z-index
- base element styling and form defaults
- utility classes such as `ui`, `muted`, `font-sm`, `visible-sm`, and `visible-md`

See [Design Tokens](/styles) for the token reference.

## Client-only Components

These base components are marked client-only by the layer because they depend on browser APIs, DOM state, or interactive primitives:

`Combobox`, `ConfirmDialog`, `Dialog`, `Toasts`, `Popover`, `Dropdown`, `FormDatePicker`, `ColorPicker`, `Embed`.

Use them normally in templates. The Nuxt layer handles component mode for you.

## Direct Package Usage

Outside Nuxt, import from the Vue package directly:

```ts
import { Button, Card, useToast } from '@1001-digital/components'
import '@1001-digital/styles'
```

When bypassing the layer, provide any app-level dependencies yourself, such as a router link component for link-aware components.
