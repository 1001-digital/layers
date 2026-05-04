---
'@1001-digital/components': patch
'@1001-digital/components.evm': patch
---

Fix type-check failures for external consumers:

- `Autocomplete`: simplify `NormalizedGroup.options` type — the previous conditional resolved to `never[]`, so iterating grouped options in the template surfaced `'label' does not exist on type 'never'` errors.
- `EvmArtifact`: inline a local `TokenMetadata` type instead of importing from `@1001-digital/resolve-metadata` so consumers without that optional peer dep can still type-check.
- `EvmArtifactModel`: silence the dynamic `import('@google/model-viewer')` for consumers without that optional peer dep.
