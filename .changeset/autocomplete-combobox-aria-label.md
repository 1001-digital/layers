---
'@1001-digital/components': patch
---

Accessibility improvements for `Autocomplete` and `Combobox`:

- New `ariaLabel` prop forwarded to the inner input as `aria-label`, so consumers can give the combobox an accessible name (placeholders alone are an unreliable name source).
- `Autocomplete` no longer renders a group label element when the group's label is empty — screen readers previously announced these as nameless groups.
- Highlighted options honor new `--autocomplete-item-highlight` / `--combobox-item-highlight` tokens (falling back to `--button-background-highlight`), so apps whose button highlight is white can keep the keyboard cursor visible.
