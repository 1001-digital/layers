---
'@1001-digital/components.evm': major
'@1001-digital/layers.evm': major
---

SIWE: surface a structured, machine-readable error so consumers can identify the underlying failure.

- `useSiwe()` now exposes an `error` ref of shape `SiweError { code, message, rpcCode?, cause? }`. `code` is a stable `SiweErrorCode` (`not-connected`, `server-environment`, `nonce-request-failed`, `chain-switch-failed`, `user-rejected`, `sign-failed`, `verification-failed`) safe to branch on; `rpcCode` is the underlying EIP-1193 / JSON-RPC code from the wallet (e.g. `-32603`, `4001`); `cause` is the original error, also logged to the console.
- Wallet signing failures with JSON-RPC `-32603` now show safe, actionable troubleshooting guidance instead of the opaque provider string.
- **Breaking:** the `error` event on `EvmSiwe`, `EvmSiweDialog`, `EvmConnectAuth`, and `EvmConnectAuthDialog` now emits `SiweError` instead of a string. Read `error.message` for the display string.
- New exports: `SiweError`, `SiweErrorCode` types, and the `getRpcErrorCode(e)` helper.
- The EVM Nuxt layer now re-exports the SIWE types and auto-imports `getRpcErrorCode` for layer consumers.
- Fix: `createSiweMessage` now emits EIP-4361-canonical output when no `statement` is provided (two blank lines before `URI:`), matching viem/`siwe`. The previous single blank line produced a non-canonical message that strict on-device parsers (e.g. Ledger clear-signing) can reject.
