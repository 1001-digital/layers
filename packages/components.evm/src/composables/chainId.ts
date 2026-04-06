import { useConnection, useSwitchChain } from '@wagmi/vue'
import { useEvmConfig } from '../config'

interface ChainConfig {
  id: number
  blockExplorer: string
}

export const useChainConfig = (key?: string | number): ChainConfig => {
  if (typeof key === 'number') {
    return {
      id: key,
      blockExplorer: 'https://evm.now',
    }
  }

  const evmConfig = useEvmConfig()
  const resolvedKey = key || evmConfig.defaultChain || 'mainnet'
  const chain = evmConfig.chains[resolvedKey]

  return {
    id: chain?.id ?? 1,
    blockExplorer: chain?.blockExplorer ?? 'https://evm.now',
  }
}

export const useMainChainId = () => useChainConfig().id

export const useBlockExplorer = (key?: string | number) =>
  useChainConfig(key).blockExplorer

export const useEnsureChainIdCheck = (key?: string | number) => {
  const chainId = useChainConfig(key).id
  const { mutateAsync: switchChain } = useSwitchChain()
  const { chainId: currentChainId } = useConnection()

  return async () => {
    if (chainId === currentChainId.value) {
      return true
    }

    try {
      await switchChain({ chainId })
      return true
    } catch {
      return false
    }
  }
}
