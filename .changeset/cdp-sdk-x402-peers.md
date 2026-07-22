---
'@1001-digital/layers.evm': patch
---

Declare `@x402/*` as dependencies so consumer builds keep working with `@coinbase/cdp-sdk` >= 1.53:

- `@base-org/account` (pulled in for the Base connector) depends on `@coinbase/cdp-sdk`, and since 1.53.0 the SDK does static named imports from its _optional_ peer deps `@x402/core|evm|extensions|svm`. When they're absent, Vite substitutes an empty shim and consumer Nuxt builds fail with `"toClientEvmSigner" is not exported by "__vite-optional-peer-dep:@x402/evm..."`.
- Adding the four packages as regular dependencies of the layer puts them in every consumer's resolution graph, so pnpm links them as the SDK's peers and the imports resolve.
- Remove again once the SDK guards these imports (lazy import or hard dependency).
