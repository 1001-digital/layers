---
'@1001-digital/components': minor
'@1001-digital/components.evm': minor
---

`Embed` / `EvmArtifact`: control iframe artifact rendering.

- Add a `scroll` prop. `EvmArtifact` now defaults to non-scrolling (`scrolling="no"`), so generative HTML artifacts that overflow their frame by a pixel no longer render stray browser scrollbars. Pass `:scroll="true"` to opt back in.
- Add `width` / `height` props. When both are set the iframe renders at those exact native pixel dimensions and is scaled (pure CSS, container-query based) to fill the frame, so the piece renders at its intended resolution and the frame matches the poster's aspect ratio.
