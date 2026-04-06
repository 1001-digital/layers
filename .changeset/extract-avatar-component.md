---
'@1001-digital/components': minor
'@1001-digital/components.evm': minor
---

Extract generic Avatar component from EvmAvatar

Add a reusable `Avatar` component to `@1001-digital/components` that renders an image or an Opepicon fallback. `EvmAvatar` now delegates to this component instead of inlining the logic.

- Remove `avatarUrl` prop from `EvmAvatarProps` (avatar URL is now resolved internally)
- Cache resolved dweb URLs to avoid duplicate resolution
