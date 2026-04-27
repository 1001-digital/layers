---
'@1001-digital/components.evm': minor
---

`EvmConnectAuthDialog` can now be driven externally. Adds `v-model:open` for controlled open state and a `noTrigger` prop that suppresses the built-in trigger button and authenticated slot, so the component renders the dialog only. Useful for flows that already have their own trigger (e.g. linking an additional wallet from a settings page) and need to programmatically open the connect + SIWE flow even while the user is already signed in.

Also drops the internal watcher that auto-closed the dialog when `isAuthenticated` flipped to `false`, which interfered with controlled flows that clear the SIWE session before prompting a new signature.
