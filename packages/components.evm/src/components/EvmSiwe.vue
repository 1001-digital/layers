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
    </Alert>
    <Button
      class="secondary"
      @click="handleSignIn"
      >Try Again</Button
    >
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
import { Button, Alert, Loading } from '@1001-digital/components'
import { useSiwe } from '../composables/siwe'
import type { EvmSiweProps, EvmSiweEmits } from '../types'

const props = defineProps<EvmSiweProps>()

const emit = defineEmits<EvmSiweEmits>()

const { step, errorMessage, statusText, signIn, setSession, reset } = useSiwe()

const handleSignIn = async () => {
  const result = await signIn(props)

  if (!result) {
    emit('error', errorMessage.value)
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
.secondary {
  margin-top: var(--spacer-sm);
}
</style>
