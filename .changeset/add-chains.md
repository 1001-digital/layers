---
'@1001-digital/components.evm': patch
---

Expand the `resolveChain` known-chain list.

Adds Shape (360) and Shape Sepolia (11011), Zora (7777777) and Zora Sepolia
(999999999), Base Sepolia (84532), OP Sepolia (11155420), and Hardhat (31337).

Previously these fell through to the generic `defineChain` fallback, so they
rendered as "Chain <id>" in the `EvmSwitchNetwork` switcher and had no default
RPC. They now resolve to viem's chain definitions with proper names and RPC
URLs. The Zora pair matches the creator/NFT focus of Shape; the Base/OP testnets
complete the mainnet+testnet pairs already shipped; and Hardhat (31337) covers
the common local-dev chain id (viem's `localhost` is only 1337).
