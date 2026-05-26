---
'@1001-digital/layers.base': patch
'@1001-digital/layers.evm': patch
---

Fix infinite render recursion in the component facade. The proxy was given the same `name` as the original component, but Vue's `resolveAsset` checks self-name before the global registry — so `resolveComponent(name)` returned the proxy itself, looping until hydration crashed with `Cannot destructure property 'type' of 'vnode' as it is null`. Dropping `name:` from the proxy lets the lookup fall through to the Nuxt-registered original (or a consumer override).
