import { useConnection, useSwitchChain } from '@wagmi/vue'
import { useEvmConfig } from '../config'

interface ChainConfig {
  id: number
  blockExplorer: string
}

export const useChainConfig = (key?: string): ChainConfig => {
  const evmConfig = useEvmConfig()
  const resolvedKey = key || evmConfig.defaultChain || 'mainnet'
  const chain = evmConfig.chains[resolvedKey]

  return {
    id: chain?.id ?? 1,
    blockExplorer: chain?.blockExplorer ?? 'https://etherscan.io',
  }
}

export const useMainChainId = () => useChainConfig().id

export const useBlockExplorer = (key?: string) => useChainConfig(key).blockExplorer

export const useEnsureChainIdCheck = () => {
  const chainId = useMainChainId()
  const { mutate: switchChain } = useSwitchChain()
  const { chainId: currentChainId } = useConnection()

  return async () => {
    if (chainId !== currentChainId.value) {
      switchChain({ chainId })
    }

    if (chainId === currentChainId.value) {
      return true
    }

    return false
  }
}
