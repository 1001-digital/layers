---
'@1001-digital/components': patch
---

Use `Symbol.for` for `LinkComponentKey` and `IconAliasesKey` so provide/inject identity survives Vite serving the same source file at two URLs. The previous fix (deduping `@1001-digital/components` and importing keys from deep subpaths) wasn't enough — Vite's dev server still appends `?v=<hash>` to imports of `src/base/link.ts` and `src/base/icons.ts` when the importer is inside the components package, but not when imported from a layer plugin. Two URLs evaluate the module twice and produce two `Symbol(...)` values, so `inject` silently falls back to defaults — `<Button to="…">` rendered as a plain `<a>` (full reload on click), and `<Icon>` aliases configured in the consumer were ignored.

`Symbol.for` interns the symbol on the global registry, so all module instances resolve to the same key.

Also drops the unused `exact` prop on `Button`. Vue Router 4 / Nuxt 3 no longer support an `exact` prop on `<RouterLink>`/`<NuxtLink>` — it was leaking onto the rendered `<a>` as `exact="false"`.
