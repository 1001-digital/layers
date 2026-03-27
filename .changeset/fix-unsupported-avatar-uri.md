---
'@1001-digital/components.evm': patch
---

Fix uncaught error when ENS avatar uses an unsupported URI scheme (e.g. eip155://) by catching the resolution failure and falling back to the identicon
