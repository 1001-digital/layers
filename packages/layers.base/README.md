# @1001-digital/layers.base

Foundation Nuxt layer for building modern web applications with accessible components and a CSS design token system.

## Installation

```bash
pnpm add @1001-digital/layers.base
```

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

## Components

### Core

- **Button** - Variants (`primary`, `danger`, `link`, `inline`) and sizes (`small`, `normal`)
- **Card** / **CardLink** - Article containers with padding, borders, and hover states
- **Alert** - Dismissable alerts (`info` / `error`)
- **Dialog** / **ConfirmDialog** - Native `<dialog>` wrappers with accessibility
- **Popover** - Floating content panels
- **Dropdown** - Menu with items, groups, labels, separators, checkbox/radio items, and submenus
- **Tooltip** - Contextual tooltips
- **Toasts** - Toast notification system
- **Tag** / **Tags** - Inline tag components
- **Icon** - Semantic icon mapper (Lucide / Simple Icons)
- **Opepicon** - Generative icon component
- **Loading** - Loading indicator
- **Progress** - Progress bar
- **Calendar** - Calendar widget
- **PinInput** - PIN / OTP code input
- **Combobox** - Autocomplete search input
- **Actions** - Action buttons container

### Form

- **Form** - Grid-based form wrapper
- **FormItem** / **FormGroup** - Field containers
- **FormLabel** - Semantic label
- **FormInputGroup** - Input with positioned icons
- **FormSelect** - Dropdown with multi-select (Reka UI)
- **FormCheckbox** - Checkbox with indeterminate state
- **FormRadioGroup** - Radio buttons (horizontal / vertical)
- **FormSwitch** - Toggle switch
- **FormSlider** - Range slider
- **FormTextarea** - Textarea input
- **FormDateField** / **FormDatePicker** - Date inputs

## Composables

- `useConfirm()` - Trigger confirmation dialogs programmatically
- `useToast()` - Show toast notifications
- `useSeconds()` / `useCountDown()` / `useTimeAgo()` / `useSecondsAgo()` - Time utilities

## Utilities

- `formatNumber()` / `roundAndFormatNumber()` / `asPercentageOf()` / `formatUSD()` - Number formatting
- `delay()` / `daysInSeconds()` / `nowInSeconds()` / `asUTCDate()` - Time helpers

## Design System

Built on CSS custom properties with layered architecture (`reset` > `base` > `components` > `utilities`).

**Colors** - OKLCH palette with automatic light/dark mode via `light-dark()`:

```css
--primary, --muted, --error, --success
--gray-50 through --gray-950
--background, --color
```

**Typography** - Fluid font scaling using `clamp()`:

```css
--font-xs through --font-3xl
--font-family
```

**Spacing & Layout**:

```css
--size-0 through --size-10
--spacer-xs, --spacer-sm, --spacer, --spacer-md, --spacer-lg, --spacer-xl
--content-width-wide: 90rem
--content-width: 60rem
--content-width-sm: 35rem
```

## Icons

The `Icon` component uses Nuxt Icon aliases. Override or extend aliases in your `nuxt.config`:

```ts
export default defineNuxtConfig({
  icon: {
    aliases: {
      check: 'custom:check-circle',
      add: 'heroicons:plus',
    },
  },
})
```

Built-in aliases: `add`, `calendar`, `check`, `chevron-down`, `chevron-left`, `chevron-right`, `close`, `copy`, `edit`, `help`, `home`, `link`, `loader`, `wallet`.

## Dependencies

- [Reka UI](https://reka-ui.com) - Accessible component primitives
- [Nuxt Icon](https://github.com/nuxt/icon) - Icon system
- [Lucide](https://lucide.dev) / [Simple Icons](https://simpleicons.org) - Icon sets

## Development

```bash
pnpm dev        # Start playground dev server
pnpm build      # Build playground
pnpm typecheck  # Run type checks
pnpm lint       # Lint
```
