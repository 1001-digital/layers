# AGENTS.md

Base Nuxt layer for building modern web applications with accessible components and CSS design tokens.

## What this layer provides

When a Nuxt app extends `@1001-digital/layers.base`, it gets:

- **50+ auto-imported components** from `@1001-digital/components` (Reka UI-based, accessible)
- **Auto-imported composables**: `useConfirm()`, `useToast()`, `useSeconds()`, `useCountDown()`, `useTimeAgo()`, `useSecondsAgo()`
- **Auto-imported utils**: `formatNumber()`, `roundAndFormatNumber()`, `formatUSD()`, `asPercentageOf()`, `delay()`, `daysInSeconds()`, `nowInSeconds()`, `asUTCDate()`
- **Global CSS** from `@1001-digital/styles` (design tokens, reset, utilities)
- **Icon system** via `@nuxt/icon` with semantic aliases (e.g. `check` → `lucide:check`)
- **Globals plugin** that auto-mounts toast/confirm system on the client
- **LinkComponent injection** that provides `NuxtLink` to components

## Setup

```bash
pnpm install
pnpm dev           # Start playground dev server
pnpm dev:prepare   # Generate Nuxt types
pnpm typecheck     # Check types
```

## How it works

### Component loading

Components from `@1001-digital/components/src/base/components` are registered via `hooks['components:dirs']` in `nuxt.config.ts`. Components listed in `clientOnlyComponents` (`Combobox`, `ConfirmDialog`, `Dialog`, `Toasts`, `Popover`, `Dropdown`, `FormDatePicker`, `ColorPicker`) are set to `mode: 'client'` via the `components:extend` hook.

`Icon.vue` and `Globals.vue` are excluded from auto-import — `Icon.vue` is overridden locally (wraps `@nuxt/icon`), and `Globals.vue` is mounted via plugin.

### Plugins

- `components.ts` — provides `NuxtLink` as `LinkComponentKey` and icon aliases as `IconAliasesKey`
- `globals.client.ts` — mounts the `Globals` component (toast/confirm container) into the DOM

### Icon aliases

Defined in `nuxt.config.ts`. Available aliases: `add`, `calendar`, `check`, `chevron-down`, `chevron-left`, `chevron-right`, `close`, `copy`, `edit`, `help`, `home`, `link`, `loader`, `menu`, `wallet`. All map to Lucide icons. Consumer apps can extend these.

## Styling

- CSS custom properties (design tokens) from `@1001-digital/styles`
- CSS layers: `variables` < `reset` < `base` < `components` < `utilities`
- oklch color space with `light-dark()` for automatic theme support
- Component styles go in `@layer components { ... }` in Vue SFC `<style>` blocks

## Components reference

Built on [Reka UI](https://reka-ui.com/llms.txt) for accessibility:

- **Layout**: AppShell, Sidebar, BottomNav, Card, CardLink, Actions
- **Forms**: Form, FormGroup, FormItem, FormLabel, FormInputGroup, FormCheckbox, FormRadioGroup, FormSelect, FormSlider, FormSwitch, FormTextarea, FormDateField, FormDatePicker
- **Feedback**: Alert, Dialog, ConfirmDialog, Toasts, Loading, Progress
- **Overlays**: Popover, Dropdown (+Group, Item, Label, Sub, Separator, CheckboxItem, RadioGroup, RadioItem), Tooltip, Combobox
- **Content**: Button, Icon, Tag, Tags, TagsInput, Prose, CopyText, PinInput, Calendar, ColorPicker, Opepicon

For tables and virtualization: [Tanstack Table](https://tanstack.com/table/latest/docs/introduction.md) and [Tanstack Virtual](https://tanstack.com/virtual/latest/docs/introduction.md).

## Directory structure

```
app/
├── components/
│   └── Icon.vue              # Wraps @nuxt/icon with alias support
├── composables/              # Re-exports from @1001-digital/components
│   ├── confirm.ts
│   ├── toast.ts
│   └── time.ts
├── plugins/
│   ├── components.ts         # Provides LinkComponent + IconAliases
│   └── globals.client.ts     # Mounts toast/confirm container
└── utils/                    # Re-exports from @1001-digital/components
    ├── format-number.ts
    └── time.ts
nuxt.config.ts                # Layer config (component dirs, icon aliases, CSS)
```
