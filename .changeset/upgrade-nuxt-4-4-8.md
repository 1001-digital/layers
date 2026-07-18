---
'@1001-digital/layers.base': patch
'@1001-digital/layers.evm': patch
---

Upgrade `nuxt` to 4.4.8 and align the toolchain around it:

- `vue` ^3.5.40 (matches nuxt's `^3.5.35` requirement — previously the exact pin at 3.5.30 produced a second Vue copy in the tree)
- `eslint` 10.7.0 and `@nuxt/eslint` 1.16.0
- `@nuxt/icon` 2.3.1
- `vue-tsc` added as a dev dependency since `nuxi typecheck` no longer installs a type checker on demand
- `compatibilityDate` set to 2026-07-18 in layers.base; layers.evm (previously stuck on 2024-11-01) now inherits it through `extends` instead of duplicating the date
