<template>
  <Loading
    v-if="step === 'signing'"
    spinner
    stacked
    :txt="connector?.name
      ? `Requesting signature from ${connector.name}...`
      : 'Requesting signature...'"
  />

  <Loading
    v-else-if="step === 'verifying'"
    spinner
    stacked
    txt="Verifying signature..."
  />

  <template v-else-if="step === 'complete'">
    <slot name="complete">
      <Alert type="info">
        <p>Successfully signed in.</p>
      </Alert>
    </slot>
  </template>

  <template v-else-if="step === 'error'">
    <Alert type="error">
      <p>{{ errorMessage }}</p>
    </Alert>
    <Button
      class="secondary"
      @click="signIn"
    >Try Again</Button>
  </template>

  <template v-else>
    <slot name="idle">
      <p v-if="props.statement">{{ props.statement }}</p>
    </slot>
    <Button @click="signIn">
      Sign In
    </Button>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signMessage } from '@wagmi/core'
import { useConfig, useConnection } from '@wagmi/vue'
import type { Config } from '@wagmi/vue'
import Button from '../../base/components/Button.vue'
import Alert from '../../base/components/Alert.vue'
import Loading from '../../base/components/Loading.vue'
import { createSiweMessage } from '../utils/siwe'
import { useSiwe } from '../composables/siwe'

type Step = 'idle' | 'signing' | 'verifying' | 'complete' | 'error'

const props = defineProps<{
  getNonce: () => Promise<string>
  verify: (message: string, signature: string) => Promise<boolean>
  domain?: string
  statement?: string
  uri?: string
  resources?: string[]
  requestId?: string
  expirationTime?: string
}>()

const emit = defineEmits<{
  authenticated: [{ address: `0x${string}`; chainId: number }]
  error: [error: string]
}>()

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

const config = useConfig()
const { address, chainId, connector } = useConnection()
const { setSession } = useSiwe()

const step = ref<Step>('idle')
const errorMessage = ref('')

const signIn = async () => {
  const currentAddress = address.value
  const currentChainId = chainId.value

  if (!currentAddress || !currentChainId) {
    errorMessage.value = 'Wallet not connected.'
    step.value = 'error'
    emit('error', errorMessage.value)
    return
  }

  errorMessage.value = ''

  // Get nonce
  let nonce: string
  try {
    nonce = await props.getNonce()
  } catch {
    errorMessage.value = 'Failed to get authentication nonce.'
    step.value = 'error'
    emit('error', errorMessage.value)
    return
  }

  // Sign message
  step.value = 'signing'
  const message = createSiweMessage({
    domain: props.domain || window.location.host,
    address: currentAddress,
    uri: props.uri || window.location.origin,
    chainId: currentChainId,
    nonce,
    statement: props.statement,
    expirationTime: props.expirationTime,
    requestId: props.requestId,
    resources: props.resources,
  })

  let signature: string
  try {
    signature = await signMessage(config as Config, { message })
  } catch (e: unknown) {
    if (isUserRejection(e)) {
      errorMessage.value = 'Signature rejected by user.'
    } else {
      const err = e as { shortMessage?: string; message?: string }
      errorMessage.value = err.shortMessage || err.message || 'Failed to sign message.'
    }
    step.value = 'error'
    emit('error', errorMessage.value)
    console.error('SIWE signing error:', e)
    return
  }

  // Verify with backend
  step.value = 'verifying'
  try {
    const verified = await props.verify(message, signature)

    if (!verified) {
      throw new Error('Signature verification failed')
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    errorMessage.value = err.message || 'Verification failed.'
    step.value = 'error'
    emit('error', errorMessage.value)
    console.error('SIWE verification error:', e)
    return
  }

  // Update shared authentication state
  setSession({
    address: currentAddress,
    chainId: currentChainId,
  })

  step.value = 'complete'
  emit('authenticated', {
    address: currentAddress,
    chainId: currentChainId,
  })
}

const reset = () => {
  step.value = 'idle'
  errorMessage.value = ''
}

defineExpose({ reset })
</script>

<style scoped>
.secondary {
  margin-top: var(--spacer-sm);
}
</style>
