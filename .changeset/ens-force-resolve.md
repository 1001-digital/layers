---
'@1001-digital/components.evm': minor
'@1001-digital/layers.evm': minor
---

Add `useEnsResolver`, an imperative awaitable ENS resolver.

`useEnsResolver()` returns `resolveAddress(identifier)` and `resolveProfile(identifier)` functions that share the cache and strategy order of `useEns`, so consumers can force-resolve a name at the moment it is acted on (e.g. form submit) instead of relying on a background resolution having already landed in the cache. A cached failed resolution is evicted and retried rather than pinning the name as unresolvable for the whole cache TTL. Also adds `evict(key)` to `createCache`.
