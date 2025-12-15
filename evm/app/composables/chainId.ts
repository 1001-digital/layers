import { useConnection, useSwitchChain } from '@wagmi/vue'

export const useMainChainId = () => {
  const config = useRuntimeConfig()

  return config.public.chainId as 1 | 11155111 | 17000 | 1337 | 31337
}

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
