---
'@1001-digital/layers.base': patch
'@1001-digital/layers.evm': patch
---

Fix the component override facade so consumer overrides actually apply.

Two bugs in 2.7.19 / 2.0.28:

1. **Infinite render recursion.** The proxy was given the same `name` as the original. Vue's `resolveAsset` checks self-name before the global registry, so `resolveComponent(name)` returned the proxy itself, looping until hydration crashed with `Cannot destructure property 'type' of 'vnode' as it is null`. Dropping `name:` from the proxy fixes the recursion.

2. **Overrides ignored.** After the recursion fix, `resolveComponent(name)` only finds *globally* registered components. Nuxt auto-imports `app/components/<Name>.vue` as a named import, not as a global, so the proxy fell through to the package default — the consumer's `app/components/Loading.vue` was never picked up. A new plugin (`app/plugins/components.ts` in each layer) registers each shadowed name on `nuxtApp.vueApp.component()` from `#components`, where the consumer's override has already taken precedence over the layer's package-level file. The proxy's `resolveComponent` now resolves through that global registration.
