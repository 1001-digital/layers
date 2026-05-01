---
'@1001-digital/components.evm': patch
---

`EvmArtifact` now uses the static `image` as a poster for `<video>` and `<model-viewer>` while the heavy asset loads, so users see the artwork immediately instead of a blank container. The `#animation` slot also receives a `poster` prop for custom renderers.
