---
'@1001-digital/layers.base': patch
'@1001-digital/layers.evm': patch
---

Route `@1001-digital/components` and `@1001-digital/components.evm` package imports through a Nuxt-layer facade so consumer/layer component overrides apply to package-level imports (e.g. `<Button>` inside `EvmConnectDialog` will pick up an app's override of `Button`).
