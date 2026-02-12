export default defineAppConfig({
  evm: {
    title: 'EVM Layer Playground',
    defaultChain: 'mainnet',
    chains: {
      mainnet: {
        id: 1,
        blockExplorer: 'https://etherscan.io',
      },
    },
  },
})
