---
'@1001-digital/components.evm': patch
---

Make the `EvmEthInput` suffix customizable: new optional `suffix` prop (defaults to `'ETH'`); pass a different string to relabel it or `:suffix="false"` to hide it entirely. The existing `#suffix` slot still overrides both.
