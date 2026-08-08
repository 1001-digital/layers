import { ref, readonly, computed } from 'vue'
import { signMessage } from '@wagmi/core'
import { useConfig, useConnection, useSwitchChain } from '@wagmi/vue'
import type { Config } from '@wagmi/vue'
import { createSiweMessage, type SiweMessageParams } from '../utils/siwe'
import { getRpcErrorCode, isUserRejection } from '../utils/errors'

export interface SiweSession {
  address: `0x${string}`
  chainId: number
}

export type SiweStep = 'idle' | 'signing' | 'verifying' | 'complete' | 'error'

/**
 * Stable, machine-readable identifier for each failure point in the SIWE
 * flow. Prefer switching on this over matching the human-readable
 * `SiweError.message`, which is not part of the contract and may change.
 */
export type SiweErrorCode =
  | 'not-connected'
  | 'server-environment'
  | 'nonce-request-failed'
  | 'chain-switch-failed'
  | 'user-rejected'
  | 'sign-failed'
  | 'verification-failed'

export interface SiweError {
  /** Stable identifier for the failure point — safe to branch on. */
  code: SiweErrorCode
  /** Human-readable message, suitable for display. */
  message: string
  /**
   * Underlying EIP-1193 / JSON-RPC error code from the wallet, when the
   * failure originated there (e.g. `-32603` internal error, `4001`
   * user-rejected). Undefined for failures that never reached the wallet.
   */
  rpcCode?: number
  /** The original thrown error, retained for logging/telemetry. */
  cause?: unknown
}

/**
 * Turn a wallet signing failure into a user-facing message. `-32603` is a
 * generic provider error, but hardware wallets can surface it when their
 * on-device app cannot process the request. Offer safe troubleshooting while
 * retaining the original error for support and telemetry.
 */
function describeSignError(
  rpcCode: number | undefined,
  fallback: string | undefined,
): string {
  if (rpcCode === -32603) {
    return "Your wallet returned an internal error. Reconnect it and try again. If you're using a hardware wallet, update its Ethereum app. If the problem continues, follow your wallet's troubleshooting guidance."
  }
  return fallback || 'Failed to sign message.'
}

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
  const error = ref<SiweError | null>(null)
  // Kept as a convenience/back-compat view over `error` for templates that
  // only need the display string.
  const errorMessage = computed(() => error.value?.message ?? '')

  /**
   * Record a failure: set the structured error, flip to the error step, and
   * log the underlying cause so the real provider error is recoverable from
   * the console/telemetry even though the UI only shows `message`.
   */
  const fail = (
    code: SiweErrorCode,
    message: string,
    cause?: unknown,
    rpcCode?: number,
  ): undefined => {
    error.value = { code, message, rpcCode, cause }
    step.value = 'error'
    if (cause !== undefined) {
      console.error(
        `[siwe] ${code}${rpcCode !== undefined ? ` (${rpcCode})` : ''}`,
        cause,
      )
    }
    return undefined
  }

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
    error.value = null
  }

  const signIn = async (
    options: SiweSignInOptions,
  ): Promise<SiweSignInResult | undefined> => {
    const currentAddress = address.value
    const currentChainId = chainId.value

    if (!currentAddress || !currentChainId) {
      return fail('not-connected', 'Wallet not connected.')
    }

    error.value = null

    if (import.meta.server) {
      return fail(
        'server-environment',
        'SIWE sign-in requires a browser environment.',
      )
    }

    // Get nonce
    let nonce: string
    try {
      nonce = await options.getNonce()
    } catch (e) {
      return fail(
        'nonce-request-failed',
        'Failed to get authentication nonce.',
        e,
      )
    }

    // Ensure the connector is on the correct chain
    try {
      const connectorChainId = await connector.value?.getChainId()
      if (connectorChainId && connectorChainId !== currentChainId) {
        await switchChain({ chainId: currentChainId })
      }
    } catch (e) {
      const rpcCode = getRpcErrorCode(e)
      return fail(
        'chain-switch-failed',
        'Failed to switch to the required network.',
        e,
        rpcCode,
      )
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
        return fail(
          'user-rejected',
          'Signature rejected by user.',
          e,
          getRpcErrorCode(e),
        )
      }
      const err = e as { shortMessage?: string; message?: string }
      const rpcCode = getRpcErrorCode(e)
      return fail(
        'sign-failed',
        describeSignError(rpcCode, err.shortMessage || err.message),
        e,
        rpcCode,
      )
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
      return fail(
        'verification-failed',
        err.message || 'Verification failed.',
        e,
      )
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
    error: readonly(error),
    errorMessage,
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
