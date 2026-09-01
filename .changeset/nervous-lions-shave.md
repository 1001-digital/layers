---
'@1001-digital/layers.evm': patch
---

Only instantiate wallet connectors in the browser

`createWagmiConfig` built the full connector list — `injected`, `safe`,
`baseAccount` and `metaMask` — on every call, including during SSR. The Nuxt
plugin that calls it is universal, so a server rendering one request per
visitor constructed a fresh connector set per request.

That is wasted work, since the connector list is never server-rendered, and it
leaks. `metaMask()` boots the MetaMask SDK, which parks a singleton on
`globalThis` (`__METAMASK_CONNECT_MULTICHAIN_SINGLETON__`) and registers
per-instance event handlers against it. Nothing ever unregisters them, so every
SSR render stranded another connector set on that process-global singleton —
roughly 23KB of permanently reachable heap per request, which accumulated until
Node workers approached their heap ceiling and had to be restarted.

All connectors now live behind the existing `isClient` flag, which previously
guarded only `walletConnect`. The server builds a config with chains,
transports and cookie storage, which is all SSR and hydration need.
