---
'@1001-digital/components.evm': minor
---

Add `EvmArtifact` — a generic NFT artifact renderer that accepts a normalized `TokenMetadata` shape (e.g. from `@1001-digital/resolve-metadata`) or individual `image` / `animationUrl` / `name` / `backgroundColor` props. Auto-detects media type by file extension first, then by HEAD-request `Content-Type` (with `AbortController` so rapid URL changes can't let stale responses overwrite fresh detection), and renders the appropriate element: `<img>` for images, `<video autoplay muted loop>` for video, `<audio controls>` (over the static image as poster) for audio, `<Embed>` for HTML/iframe and unknown types, and a lazy-loaded `<model-viewer>` for `.glb` / `.gltf` 3D assets. URLs from `resolve-metadata` come back as protocol URIs (`ipfs://`, `ar://`) and are resolved through the existing `useResolvedUrl` composable against the configured gateways.

Provides `v-model:show-animation` for parent-controlled play/pause and four scoped slots: `#animation`, `#static`, `#overlay` (receives `showAnimation` and `hasAnimation`), and `#fallback` (receives `name` and the last `error`). Emits `error` with `{ kind: 'image' | 'animation' | 'model'; url }`. Optionally applies `background_color` from metadata as the container background (validated as 6-char hex). Aspect ratio defaults to `1` and is overridable via the `aspectRatio` prop or a `--evm-artifact-aspect-ratio` CSS custom property.

`@1001-digital/resolve-metadata` and `@google/model-viewer` are added as **optional** peer dependencies — the type import for `TokenMetadata` is type-only, and `model-viewer` is only fetched on demand when a 3D asset is detected, so neither is required for the common image/video case.
