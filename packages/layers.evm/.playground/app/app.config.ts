export default defineAppConfig({
  evm: {
    title: 'EVM Layer Playground',
    // Required — the layer ships no default. See docs/reference/configuration.
    ipfsGateway: 'https://ipfs.evm.now/ipfs/',
    defaultChain: 'sepolia',
    chains: {
      sepolia: {
        id: 11155111,
        blockExplorer: 'https://sepolia.etherscan.io',
      },
      optimism: {
        id: 10,
        blockExplorer: 'https://optimistic.etherscan.io',
      },
      localhost: {
        id: 31337,
        blockExplorer: 'https://etherscan.io',
      },
    },
    inAppWallet: {
      enabled: true,
    },
  },
})
