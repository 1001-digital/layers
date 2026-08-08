<template>
  <Loading
    v-if="step === 'signing' || step === 'verifying'"
    spinner
    stacked
    :txt="statusText"
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
      <p
        v-if="error"
        class="siwe-error-code"
      >
        <small
          >{{ error.code
          }}<template v-if="error.rpcCode !== undefined">
            · {{ error.rpcCode }}</template
          ></small
        >
      </p>
    </Alert>
    <Actions class="left siwe-error-actions">
      <Button
        type="button"
        @click="handleSignIn"
      >
        Try again
      </Button>
      <slot name="error-actions" />
    </Actions>
  </template>

  <template v-else>
    <slot name="idle">
      <p v-if="props.statement">{{ props.statement }}</p>
    </slot>
    <Button @click="handleSignIn"> Sign In </Button>
  </template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Actions, Alert, Button, Loading } from '@1001-digital/components'
import { useSiwe } from '../composables/siwe'
import type { EvmSiweProps, EvmSiweEmits } from '../types'

const props = defineProps<EvmSiweProps>()

const emit = defineEmits<EvmSiweEmits>()

const { step, error, errorMessage, statusText, signIn, setSession, reset } =
  useSiwe()

const handleSignIn = async () => {
  const result = await signIn(props)

  if (!result) {
    if (error.value) emit('error', error.value)
    return
  }

  setSession({
    address: result.address,
    chainId: result.chainId,
  })

  emit('authenticated', {
    address: result.address,
    chainId: result.chainId,
  })
}

onMounted(() => {
  if (props.autoSignIn && step.value === 'idle') {
    handleSignIn()
  }
})

defineExpose({ reset })
</script>

<style scoped>
.siwe-error-actions {
  margin-top: var(--spacer-sm);
}

.siwe-error-code {
  margin-top: var(--spacer-xs);
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
</style>
