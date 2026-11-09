---
'@1001-digital/layers.evm': patch
---

Use configured RPC URLs in chain defaults as well as Wagmi transports. MetaMask
SDK reads and network switching now use the app's HTTP RPC instead of the chain's
built-in public endpoint. Keep each app's chain metadata isolated, preserve
WebSocket transport configuration, and retain built-in HTTP defaults when no HTTP
RPC is configured.
