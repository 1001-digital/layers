import { useConnection, useSwitchChain } from '@wagmi/vue'

interface ChainConfig {
  id?: number
  blockExplorer?: string
}

const getDefaultChainKey = () => useAppConfig().evm?.defaultChain || 'mainnet'

export const useChainConfig = (key?: string) => {
  const appConfig = useAppConfig()
  const resolvedKey = key || getDefaultChainKey()
  const chains = appConfig.evm?.chains as Record<string, ChainConfig> | undefined
  const chain = chains?.[resolvedKey]

  return {
    id: chain?.id ?? 1,
    blockExplorer: chain?.blockExplorer ?? 'https://etherscan.io',
  }
}

export const useMainChainId = () => useChainConfig().id

export const useBlockExplorer = (key?: string) => useChainConfig(key).blockExplorer

export const useEnsureChainIdCheck = () => {
  const chainId = useMainChainId()
  const { switchChain } = useSwitchChain()
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
