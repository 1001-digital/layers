---
'@1001-digital/components': patch
---

Update reka-ui to ^2.9.8.

The notable fix for consumers is accessibility: toast title and description are now announced to screen readers as plain text instead of being JSON-serialized (reka-ui #2612). Also picks up reka-ui's Menu fixes that clear a stuck `data-highlighted` on pointer-leave and prevent a brief highlight flash on dropdown open (#2596/#2605, #2651), plus internal SSR/efficiency improvements. No API changes.
