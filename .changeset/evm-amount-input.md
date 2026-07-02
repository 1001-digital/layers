---
'@1001-digital/components.evm': minor
'@1001-digital/layers.evm': minor
---

Add `EvmAmountInput` — a decimals-aware token amount input with an optional symbol suffix, balance-backed "max" button (default writes the full balance; a `max` listener takes over the behavior), and a parsed base-unit `units` model. `EvmEthInput` is now a thin wrapper over it and gains a `balance` prop. The underlying `useAmountInput`/`parseAmountInput`/`normalizeAmountInput` composables are exported and auto-imported through the layer.
