---
'@1001-digital/components': patch
---

Fix `Dialog` scroll-lock breaking `position: sticky` layout.

The open-dialog scroll lock applied `overflow: hidden` to both `html` and
`body`. Clipping `body` turns it into a scroll container, which breaks
`position: sticky` descendants — sticky headers and pinned panels drop to their
in-flow position and jump out of view while the page is scrolled behind the
dialog.

The lock now clips only `html`, the root scroller. `html` already carries
`scrollbar-gutter: stable` (styles reset), so the gutter stays reserved and
nothing shifts horizontally, while sticky descendants keep their positioning.
