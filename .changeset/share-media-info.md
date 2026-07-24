---
'@1001-digital/components': minor
'@1001-digital/components.evm': minor
'@1001-digital/layers.base': minor
'@1001-digital/layers.evm': minor
---

Add shared media detection to `@1001-digital/components`: `detectMediaInfoFromUrl`,
`detectMediaInfoFromMime`, `inspectMediaUrl`, and a cached `fetchMediaInfo` resolve
a media URL's kind, MIME type, and extension. `Embed` now reuses the shared
(cached) probe instead of its own HEAD request, and `createCache` moved to the
base library (still re-exported from `@1001-digital/components.evm`).

`@1001-digital/components.evm` gains a `useMediaInfo` composable that resolves
`ipfs://`/`ipns://`/Arweave URLs and exposes the detected media info reactively.
`EvmArtifact` uses the same inspection result, so artifact rendering and `Embed`
no longer issue duplicate HEAD probes.
