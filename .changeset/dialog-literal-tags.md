---
'@1001-digital/components': patch
---

Fix `Dialog` rendering nothing when the component is globally auto-registered as `Dialog` (which Nuxt layers do). The template used `<component :is="tag">` with `tag` being `'dialog'` or `'article'`. Vue's `resolveAsset` is case-insensitive (it probes the registry with `name`, `camelize(name)`, and `capitalize(camelize(name))`), so `:is="'dialog'"` resolved to the registered `Dialog` component instead of the native `<dialog>` element — the inner instance had no `open` prop, fired `[Vue warn]: Missing required prop: "open"`, and rendered a comment node. Replaced the dynamic component with literal `<dialog>` / `<article>` blocks so the wrapper element bypasses the component registry entirely.
