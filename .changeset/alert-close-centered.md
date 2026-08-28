---
'@1001-digital/components': patch
---

Centre the alert dismiss button and its icon

The button was pinned at `--spacer-sm` from the top of the alert, so its box sat
half the difference between the icon size and the line height above the heading
next to it. It now inherits the alert's line box and centres on the first line.

Its 1em icon also sat inside a fixed `--size-4` box, leaving 1.5px a side. On
fractional DPR screens that straddles a device pixel — the browser snapped one
side to 1px and the other to 2px, painting the X up and to the left of centre.
The box is now exactly one icon, so there is no leftover space to split.
