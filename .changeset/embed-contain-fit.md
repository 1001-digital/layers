---
'@1001-digital/components': patch
---

`Embed`: when `width`/`height` are set, scale the iframe to fit the frame with `contain` semantics (centered, smaller axis wins) instead of filling the width. This keeps the artifact's aspect ratio and matches the poster's footprint even when the frame is a different shape (e.g. portrait art in a square mat).
