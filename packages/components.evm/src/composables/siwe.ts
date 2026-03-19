import { ref, readonly, computed } from 'vue'
import { signMessage } from '@wagmi/core'
import { useConfig, useConnection } from '@wagmi/vue'
import type { Config } from '@wagmi/vue'
import { createSiweMessage, type SiweMessageParams } from '../utils/siwe'

export interface SiweSession {
  address: `0x${string}`
  chainId: number
}

export type SiweStep = 'idle' | 'signing' | 'verifying' | 'complete' | 'error'

export interface SiweSignInOptions {
  getNonce: () => Promise<string>
  verify: (message: string, signature: string) => Promise<boolean | void>
  domain?: string
  uri?: string
  statement?: string
  expirationTime?: string
  requestId?: string
  resources?: string[]
}

export interface SiweSignInResult {
  message: string
  signature: string
  address: `0x${string}`
  chainId: number
}

const _isAuthenticated = ref(false)
const _session = ref<SiweSession | null>(null)

function isUserRejection(e: unknown): boolean {
  const re = /reject|denied|cancel/i
  let current = e as Record<string, unknown> | undefined
  while (current) {
    if ((current as { code?: number }).code === 4001) return true
    if (re.test((current as { details?: string }).details || '')) return true
    if (re.test((current as { message?: string }).message || '')) return true
    current = current.cause as Record<string, unknown> | undefined
  }
  return false
}

export const useSiwe = () => {
  const config = useConfig()
  const { address, chainId, connector } = useConnection()

  const step = ref<SiweStep>('idle')
  const errorMessage = ref('')

  const statusText = computed(() => {
    switch (step.value) {
      case 'signing':
        return connector.value?.name
          ? `Requesting signature from ${connector.value.name}...`
          : 'Requesting signature...'
      case 'verifying':
        return 'Verifying signature...'
      default:
        return ''
    }
  })

  const setSession = (session: SiweSession) => {
    _isAuthenticated.value = true
    _session.value = session
  }

  const clearSession = () => {
    _isAuthenticated.value = false
    _session.value = null
  }

  const reset = () => {
    step.value = 'idle'
    errorMessage.value = ''
  }

  const signIn = async (
    options: SiweSignInOptions,
  ): Promise<SiweSignInResult | undefined> => {
    const currentAddress = address.value
    const currentChainId = chainId.value

    if (!currentAddress || !currentChainId) {
      errorMessage.value = 'Wallet not connected.'
      step.value = 'error'
      return
    }

    errorMessage.value = ''

    // Get nonce
    let nonce: string
    try {
      nonce = await options.getNonce()
    } catch {
      errorMessage.value = 'Failed to get authentication nonce.'
      step.value = 'error'
      return
    }

    if (typeof window === 'undefined') {
      errorMessage.value = 'SIWE sign-in requires a browser environment.'
      step.value = 'error'
      return
    }

    // Sign message
    step.value = 'signing'
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

    let signature: string
    try {
      signature = await signMessage(config as Config, { message })
    } catch (e: unknown) {
      if (isUserRejection(e)) {
        errorMessage.value = 'Signature rejected by user.'
      } else {
        const err = e as { shortMessage?: string; message?: string }
        errorMessage.value =
          err.shortMessage || err.message || 'Failed to sign message.'
      }
      step.value = 'error'
      return
    }

    // Verify with backend
    step.value = 'verifying'
    try {
      const verified = await options.verify(message, signature)

      if (verified === false) {
        throw new Error('Signature verification failed')
      }
    } catch (e: unknown) {
      const err = e as { message?: string }
      errorMessage.value = err.message || 'Verification failed.'
      step.value = 'error'
      return
    }

    step.value = 'complete'

    return {
      message,
      signature,
      address: currentAddress,
      chainId: currentChainId,
    }
  }

  const signOut = () => {
    clearSession()
    reset()
  }

  return {
    // State
    step: readonly(step),
    errorMessage: readonly(errorMessage),
    statusText,

    // Session
    isAuthenticated: readonly(_isAuthenticated),
    session: readonly(_session),
    setSession,
    clearSession,

    // Actions
    signIn,
    signOut,
    reset,
  }
}
