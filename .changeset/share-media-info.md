---
'@1001-digital/components.evm': patch
'@1001-digital/layers.evm': patch
---

Add a shared, cached `useMediaInfo` composable for resolving media URLs and
detecting their kind, MIME type, and extension. `EvmArtifact` now uses the same
inspection result exposed to layer consumers, avoiding duplicate HEAD probes.
