# AGENTS.md

Shared CSS framework and design tokens (`@1001-digital/styles`).

## Code style

- Plain CSS (no preprocessors)
- CSS custom properties for all design tokens
- oklch color space with `light-dark()` for theme support

## Structure

```
src/
├── index.css              # Main entry point
├── base/                  # Element defaults
│   ├── reset.css          # CSS reset (modern-normalize)
│   ├── base.css           # Base element styles
│   ├── forms.css          # Form element defaults
│   └── scroll.css         # Scroll behavior
├── utilities/             # Helper classes
│   ├── utilities.css      # Utility classes
│   └── animations.css     # Keyframe animations
└── variables/             # Design tokens
    ├── colors.css         # Color palette
    ├── fonts.css          # Typography
    ├── sizes.css          # Spacing & sizing
    ├── borders.css        # Border styles
    ├── effects.css        # Shadows & effects
    ├── layout.css         # Layout tokens
    ├── timing.css         # Transition timing
    ├── ui.css             # UI tokens
    ├── z-index.css        # Z-index scale
    └── components/        # Component-specific tokens
```

## CSS layers

`reset` → `base` → `components` → `utilities`
