---
'@1001-digital/components': patch
'@1001-digital/layers.base': patch
---

Fix provide/inject module identity by importing LinkComponentKey and IconAliasesKey from deep subpaths, and add explicit package exports for `./base/icons` and `./base/link` so TypeScript resolves them correctly
