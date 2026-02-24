export default defineAppConfig({
  evm: {
    title: 'EVM Layer Playground',
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
    },
    inAppWallet: {
      enabled: true,
    },
  },
})
