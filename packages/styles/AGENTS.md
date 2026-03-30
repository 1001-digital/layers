# AGENTS.md

Shared CSS framework and design tokens (`@1001-digital/styles`). Pure CSS — no preprocessors, no JavaScript.

## Usage

Main entry: `src/index.css` (imported as `@1001-digital/styles`).
Optional: `@1001-digital/styles/prose.css` for typography styles.

## CSS layers

Cascade order (lowest → highest priority):

`variables` < `reset` < `base` < `components` < `utilities`

The `components` layer is declared for ordering but populated by Vue SFC `<style>` blocks (`@layer components { ... }`).

## Design tokens

All tokens are CSS custom properties (`--var-name`). Organized by concern:

| File          | Tokens                                          |
| ------------- | ----------------------------------------------- |
| `colors.css`  | oklch color palette, `light-dark()` theme-aware |
| `fonts.css`   | font families, sizes, weights, line heights     |
| `sizes.css`   | spacing/sizing scale                            |
| `borders.css` | border widths, radii, styles                    |
| `effects.css` | shadows, backdrop filters                       |
| `timing.css`  | transition durations, easing functions          |
| `ui.css`      | common UI tokens (focus rings, etc.)            |
| `layout.css`  | layout tokens (max-widths, gaps)                |
| `z-index.css` | z-index scale                                   |

### Component tokens

Component-specific variables in `variables/components/`: alert, bottom-nav, button, calendar, card, color-picker, combobox, date-field, date-picker, dialog, dropdown, form, pin-input, popover, progress, sidebar, slider, switch, tag, tags-input, toast, tooltip.

## Theming

- Colors use **oklch** color space for perceptual uniformity
- `light-dark()` CSS function for automatic light/dark theme support
- Respects `color-scheme` property — no JS required for theme switching
- Override tokens by redeclaring custom properties in a higher-specificity selector

## Directory structure

```
src/
├── index.css                 # Entry point — imports all, defines @layer order
├── prose.css                 # Optional prose/typography styles
├── base/
│   ├── reset.css             # CSS reset (modern-normalize)
│   ├── base.css              # Element defaults (body, headings, links)
│   ├── forms.css             # Form element defaults
│   └── scroll.css            # Scroll behavior
├── utilities/
│   ├── utilities.css         # Helper classes
│   └── animations.css        # Keyframe animations
└── variables/
    ├── colors.css
    ├── fonts.css
    ├── sizes.css
    ├── borders.css
    ├── effects.css
    ├── timing.css
    ├── ui.css
    ├── layout.css
    ├── z-index.css
    └── components/           # 23 component-specific token files
        └── index.css         # Imports all component tokens
```
