---
'@1001-digital/layers.evm': patch
---

Fix Nuxt SSR crash from the `baseAccount` wagmi connector.

`@base-org/account`'s telemetry init runs eagerly inside `createBaseAccountSDK`, called by the connector's `getProvider()` during wagmi's SSR `reconnect()` step. On the server it has no `window`/`document` and throws `Telemetry is not supported in non-browser environments`, surfacing as an `unhandledRejection` in dev logs.

Pass `preference: { telemetry: false }` to `baseAccount(...)` so the SDK skips telemetry init entirely. The connector itself stays available; only the analytics call is suppressed.
