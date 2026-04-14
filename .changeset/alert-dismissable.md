---
'@1001-digital/components': minor
---

Support non-persistent dismissal on `Alert`. Adds a `dismissable` boolean prop for in-memory dismissal and renames the persistence prop from `dismiss` to `dismiss-key` for clarity. Providing `dismiss-key` still implies `dismissable`.
