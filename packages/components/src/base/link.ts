import type { Component, InjectionKey } from 'vue'

// `Symbol.for` so the key is identical across module instances. Vite's
// dev server can serve the same source file at two URLs (with vs without
// the `?v=<hash>` optimizer suffix) depending on the importer's location —
// each URL evaluates the module anew, producing a fresh `Symbol(...)` and
// breaking provide/inject. `Symbol.for` sidesteps that by interning on
// the global registry.
export const LinkComponentKey: InjectionKey<Component | string> = Symbol.for(
  '@1001-digital/components/LinkComponent',
)
