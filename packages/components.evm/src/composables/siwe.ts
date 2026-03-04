import { ref, readonly } from 'vue'
import { signMessage } from '@wagmi/core'
import { useConfig, useConnection } from '@wagmi/vue'
import type { Config } from '@wagmi/vue'
import { createSiweMessage, type SiweMessageParams } from '../utils/siwe'

export interface SiweSession {
  address: `0x${string}`
  chainId: number
}

export interface UseSiweOptions {
  getNonce: () => Promise<string>
  verify: (message: string, signature: string) => Promise<boolean>
  domain?: string
  uri?: string
  statement?: string
  expirationTime?: string
  requestId?: string
  resources?: string[]
}

const _isAuthenticated = ref(false)
const _session = ref<SiweSession | null>(null)

export const useSiwe = () => {
  const config = useConfig()
  const { address, chainId } = useConnection()

  const setSession = (session: SiweSession) => {
    _isAuthenticated.value = true
    _session.value = session
  }

  const clearSession = () => {
    _isAuthenticated.value = false
    _session.value = null
  }

  const signIn = async (options: UseSiweOptions) => {
    const currentAddress = address.value
    const currentChainId = chainId.value

    if (!currentAddress || !currentChainId) {
      throw new Error('Wallet not connected')
    }

    const nonce = await options.getNonce()

    const messageParams: SiweMessageParams = {
      domain: options.domain || window.location.host,
      address: currentAddress,
      uri: options.uri || window.location.origin,
      chainId: currentChainId,
      nonce,
      statement: options.statement,
      expirationTime: options.expirationTime,
      requestId: options.requestId,
      resources: options.resources,
    }

    const message = createSiweMessage(messageParams)
    const signature = await signMessage(config as Config, { message })

    const verified = await options.verify(message, signature)

    if (!verified) {
      throw new Error('Signature verification failed')
    }

    setSession({
      address: currentAddress,
      chainId: currentChainId,
    })
  }

  const signOut = () => {
    clearSession()
  }

  return {
    isAuthenticated: readonly(_isAuthenticated),
    session: readonly(_session),
    signIn,
    signOut,
    setSession,
    clearSession,
  }
}
