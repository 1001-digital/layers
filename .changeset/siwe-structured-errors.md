---
'@1001-digital/components.evm': minor
---

SIWE: surface a structured, machine-readable error so consumers can identify the underlying failure.

- `useSiwe()` now exposes an `error` ref of shape `SiweError { code, message, rpcCode?, cause? }`. `code` is a stable `SiweErrorCode` (`not-connected`, `server-environment`, `nonce-request-failed`, `chain-switch-failed`, `user-rejected`, `sign-failed`, `verification-failed`) safe to branch on; `rpcCode` is the underlying EIP-1193 / JSON-RPC code from the wallet (e.g. `-32603`, `4001`); `cause` is the original error, also logged to the console.
- Wallet signing failures with JSON-RPC `-32603` ("internal error" — commonly a Ledger/hardware wallet with an outdated Ethereum app or blind signing disabled) now show an actionable hint instead of the opaque provider string.
- **Breaking (types):** the `error` event on `EvmSiwe`, `EvmSiweDialog`, `EvmConnectAuth`, and `EvmConnectAuthDialog` now emits a `SiweError` object instead of a `string`. Read `error.message` for the display string.
- New exports: `SiweError`, `SiweErrorCode` types, and the `getRpcErrorCode(e)` helper.
- Fix: `createSiweMessage` now emits EIP-4361-canonical output when no `statement` is provided (two blank lines before `URI:`), matching viem/`siwe`. The previous single blank line produced a non-canonical message that strict on-device parsers (e.g. Ledger clear-signing) can reject.
