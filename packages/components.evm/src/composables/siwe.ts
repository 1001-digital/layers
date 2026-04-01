import { ref, readonly, computed } from 'vue'
import { signMessage } from '@wagmi/core'
import { useConfig, useConnection, useSwitchChain } from '@wagmi/vue'
import type { Config } from '@wagmi/vue'
import { createSiweMessage, type SiweMessageParams } from '../utils/siwe'
import { isUserRejection } from '../utils/errors'

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

/**
 * SIWE (Sign-In with Ethereum) composable.
 *
 * Session state (`isAuthenticated`, `session`) is shared globally (module-level singleton).
 * UI state (`step`, `errorMessage`, `statusText`) is local to each `useSiwe()` call,
 * so multiple components can drive their own sign-in UI independently.
 */
export const useSiwe = () => {
  const config = useConfig()
  const { address, chainId, connector } = useConnection()
  const { mutateAsync: switchChain } = useSwitchChain()

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

    if (import.meta.server) {
      errorMessage.value = 'SIWE sign-in requires a browser environment.'
      step.value = 'error'
      return
    }

    // Get nonce
    let nonce: string
    try {
      nonce = await options.getNonce()
    } catch {
      errorMessage.value = 'Failed to get authentication nonce.'
      step.value = 'error'
      return
    }

    // Ensure the connector is on the correct chain
    try {
      const connectorChainId = await connector.value?.getChainId()
      if (connectorChainId && connectorChainId !== currentChainId) {
        await switchChain({ chainId: currentChainId })
      }
    } catch {
      errorMessage.value = 'Failed to switch to the required network.'
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
