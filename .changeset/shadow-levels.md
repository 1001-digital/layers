---
'@1001-digital/styles': minor
---

Add `--shadow-sm`, `--shadow-md`, `--shadow-lg`, and a `--shadow` default. Shadow colors adapt to the active color scheme via `light-dark()`, using heavier alpha in dark mode so elevation reads against dark backgrounds.

This also lights up drop shadows on `Combobox`, `FormSelect`, and `Autocomplete` popover surfaces, which already referenced `--shadow-lg` before the token existed.
