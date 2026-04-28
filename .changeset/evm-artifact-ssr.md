---
'@1001-digital/components.evm': minor
---

Make `EvmArtifact` SSR-friendly. Plain `<img>`, `<video>`, and `<audio>` renderers now render server-side (good for LCP and SEO). The pieces that still need a browser — the `@google/model-viewer` dynamic import, `<Embed>`, and the HEAD-request MIME probe — are deferred until after hydration so the initial server and client render match.

3D rendering is split into a new `EvmArtifactModel` component (client-only) that owns the `@google/model-viewer` dynamic import. It emits `error` for runtime `<model-viewer>` errors and `import-error` if the dynamic import fails; `EvmArtifact` translates these into the existing `error` payload (`kind: 'animation' | 'model'`).

`useResolvedUrl` now resolves `http(s):`, `data:`, and `blob:` URIs synchronously (and reads cached `ipfs://` / `ar://` resolutions synchronously too), so SSR can emit a real `src` attribute on first paint instead of an empty string.

`EvmArtifact` is removed from the client-only component list; `EvmArtifactModel` takes its place.
