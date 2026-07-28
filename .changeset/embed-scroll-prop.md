---
'@1001-digital/components': minor
'@1001-digital/components.evm': minor
---

Add a `scroll` prop to `Embed` and `EvmArtifact` to control iframe scrollbars. `EvmArtifact` now defaults to non-scrolling (`scrolling="no"`), so generative HTML artifacts that overflow their frame by a pixel no longer render stray browser scrollbars. Pass `:scroll="true"` to opt back in.
