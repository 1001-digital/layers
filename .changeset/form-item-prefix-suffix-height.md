---
'@1001-digital/components': patch
---

Set explicit `block-size: var(--form-item-height)` on `FormItem` prefix/suffix instead of relying on `block-size: 100%`, so they render at the correct height regardless of the parent's resolved block size.
