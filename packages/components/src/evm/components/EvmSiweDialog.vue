<template>
  <Button
    v-if="!isAuthenticated"
    @click="open = true"
    :class="className"
  >
    <slot>Sign In</slot>
  </Button>
  <slot
    v-else
    name="authenticated"
    :address="session?.address"
    :sign-out="handleSignOut"
  >
    <Button
      @click="handleSignOut"
      :class="className"
    >Sign Out</Button>
  </slot>

  <Dialog
    v-if="!isAuthenticated"
    title="Sign In with Ethereum"
    v-model:open="open"
    @closed="onClosed"
  >
    <EvmSiwe
      ref="siweRef"
      :get-nonce="getNonce"
      :verify="verify"
      :domain="domain"
      :statement="statement"
      :uri="uri"
      :resources="resources"
      :request-id="requestId"
      :expiration-time="expirationTime"
      @authenticated="onAuthenticated"
      @error="(e) => emit('error', e)"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '../../base/components/Button.vue'
import Dialog from '../../base/components/Dialog.vue'
import EvmSiwe from './EvmSiwe.vue'
import { useSiwe } from '../composables/siwe'

const props = defineProps<{
  className?: string
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
  signedOut: []
  error: [error: string]
}>()

const { isAuthenticated, session, signOut } = useSiwe()

const open = ref(false)
const siweRef = ref<InstanceType<typeof EvmSiwe> | null>(null)

const onAuthenticated = (data: { address: `0x${string}`; chainId: number }) => {
  open.value = false
  emit('authenticated', data)
}

const onClosed = () => {
  siweRef.value?.reset()
}

const handleSignOut = () => {
  signOut()
  emit('signedOut')
}

watch(isAuthenticated, (authenticated) => {
  if (!authenticated) {
    open.value = false
    siweRef.value?.reset()
  }
})
</script>
