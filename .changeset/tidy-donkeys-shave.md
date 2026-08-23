---
'@1001-digital/layers.evm': major
---

Remove the default `evm.ipfsGateway`. It pointed at `https://ipfs.io/ipfs/`,
which no longer works in a browser: ipfs.io answers browser-shaped requests
with a Cloudflare managed challenge whose interstitial carries
`X-Frame-Options: SAMEORIGIN`, so IPFS embeds fail with "refused to connect"
and uncached images never load. Every widely-used public gateway behaves the
same way, so there is no default worth shipping.

Apps that resolve IPFS content must now set `evm.ipfsGateway` in their
`app.config`, pointing at a gateway they operate or have an arrangement with.
Left unset, resolution falls through to `dweb-fetch`'s own ipfs.io default and
will not load in a browser; the layer logs a warning in development.
