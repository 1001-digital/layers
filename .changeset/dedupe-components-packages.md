---
'@1001-digital/layers.base': patch
'@1001-digital/layers.evm': patch
---

Force Vite to dedupe `@1001-digital/components` and `@1001-digital/components.evm` so injection keys (`EvmConfigKey`, `LinkComponentKey`, `IconAliasesKey`, …) resolve to a single `Symbol(...)` everywhere. Without this, Vite's dep optimizer pre-bundles the bare-specifier import as a separate chunk from the package's own relative-path imports — two module instances, two symbols, and `inject` silently falls back to defaults (in `EvmConfigKey`'s case: a mainnet-only config, which is why every write transaction prompted the wallet to switch to chain 1).

`exclude` must list both the bare name and its `-original` companion. The new facade re-exports through `@1001-digital/components.evm-original` (and `@1001-digital/components-original` in the base layer); Vite's optimizer scans those as bare specifiers too, and pre-bundling either name creates the same parallel module instance the bare name causes. The combined `resolve.dedupe` + `optimizeDeps.exclude` for both spellings picks the same physical file and keeps everything as source.
