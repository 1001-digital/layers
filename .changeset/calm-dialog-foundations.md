---
'@1001-digital/components': minor
'@1001-digital/layers.base': patch
---

Move dialogs and confirmations onto Reka UI primitives for reliable modal,
focus, dismissal, and nested-layer accessibility while preserving the existing
wrapper APIs and transition-complete `closed` event.

The non-compat surface is no longer a native `<dialog>` with a `::backdrop`.
Style integrations should target `.dialog[data-state='open']` and
`.dialog-overlay` instead of `dialog[open]` and `dialog::backdrop`. In compat
mode, the overlay now precedes the `<article>` inside `.dialog-layer` rather
than following it as an adjacent sibling.
