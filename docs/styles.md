# Design Tokens

`@1001-digital/styles` is the shared CSS framework. It is loaded automatically by `@1001-digital/layers.base` and therefore also by `@1001-digital/layers.evm`.

Use the package directly when you are not extending a Nuxt layer:

```ts
import '@1001-digital/styles'
```

## Cascade Layers

The stylesheet declares this layer order:

```css
@layer variables, reset, base, components, utilities;
```

| Layer        | Purpose                                          |
| ------------ | ------------------------------------------------ |
| `variables`  | CSS custom properties and token definitions.     |
| `reset`      | Modern normalize/reset behavior.                 |
| `base`       | Element defaults, forms, and scrolling behavior. |
| `components` | Reserved for Vue SFC component styles.           |
| `utilities`  | Single-purpose utility classes.                  |

This order lets component styles override base styles, while utilities can override component defaults when needed.

## Colors

Core color tokens:

```css
--black
--white
--background
--background-semi
--color
--color-semi
--primary
--muted
--error
--success
```

Gray scale tokens:

```css
--gray-50
--gray-100
--gray-200
--gray-300
--gray-400
--gray-500
--gray-600
--gray-700
--gray-800
--gray-900
--gray-950
```

Depth-aware gray tokens:

```css
--gray-z-0
--gray-z-1
--gray-z-2
--gray-z-3
--gray-z-4
--gray-z-5
--gray-z-6
--gray-z-7
--gray-z-8
--gray-z-9
--gray-z-10
```

The color system uses OKLCH values and `light-dark()` for scheme-aware colors. Use `.light` or `.dark` on a subtree to force a color scheme.

## Typography

```css
--font-family
--font-base
--font-xs
--font-sm
--font-lg
--font-xl
--font-2xl
--font-3xl
--font-weight-light
--font-weight
--font-weight-bold
--line-height
--line-height-sm
--line-height-md
--line-height-lg
```

UI-specific typography:

```css
--ui-font-family
--ui-font-size
--ui-font-weight
--ui-text-transform
--ui-letter-spacing
--ui-line-height
```

## Spacing and Layout

Size scale:

```css
--size-0
--size-1
--size-2
--size-3
--size-4
--size-5
--size-6
--size-7
--size-8
--size-9
--size-10
```

Semantic spacers:

```css
--spacer-xs
--spacer-sm
--spacer
--spacer-md
--spacer-lg
--spacer-xl
```

Layout widths:

```css
--dialog-width
--content-width-wide
--content-width
--content-width-sm
--form-width
```

## Borders, Effects, Timing, and Z-index

```css
--border-width
--border-radius-sm
--border-radius
--border-radius-lg
--border-color
--border
--border-shadow
--border-shadow-highlight
```

```css
--blur
--speed-fast
--speed
--speed-slow
```

```css
--z-index-n1
--z-index-0
--z-index-ui
--z-index-overlay
--z-index-dialog
--z-index-toast
```

## Utilities

| Class         | Purpose                                                               |
| ------------- | --------------------------------------------------------------------- |
| `.ui`         | Applies UI font family, size, weight, casing, line height, and color. |
| `.muted`      | Uses the muted text color.                                            |
| `.font-sm`    | Applies the small font token.                                         |
| `.visible-sm` | Hidden by default, visible from the small breakpoint.                 |
| `.visible-md` | Hidden by default, visible from the medium breakpoint.                |

## Token Usage

Prefer tokens over hard-coded values in package and consumer styles:

```css
.panel {
  display: grid;
  gap: var(--spacer);
  padding: var(--spacer);
  border: var(--border);
  border-radius: var(--border-radius);
  background: var(--background);
  color: var(--color);
}
```

Component styles should live in `@layer components` so they participate in the framework cascade.
