<template>
  <EvmConnect
    v-if="!isConnected"
    ref="connectRef"
    @connecting="emit('connecting')"
    @connected="onConnected"
  />
  <EvmSiwe
    v-else-if="!isAuthenticated"
    ref="siweRef"
    auto-sign-in
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
  >
    <template #error-actions>
      <slot name="error-actions" />
    </template>
  </EvmSiwe>
  <slot
    v-else
    name="authenticated"
    :address="session?.address"
    :sign-out="handleSignOut"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConnection } from '@wagmi/vue'
import EvmConnect from './EvmConnect.vue'
import EvmSiwe from './EvmSiwe.vue'
import { useSiwe } from '../composables/siwe'
import type { EvmConnectAuthProps, EvmConnectAuthEmits } from '../types'

defineProps<EvmConnectAuthProps>()

const emit = defineEmits<EvmConnectAuthEmits>()

const { address, isConnected } = useConnection()
const { isAuthenticated, session, signOut } = useSiwe()

const connectRef = ref<InstanceType<typeof EvmConnect> | null>(null)
const siweRef = ref<InstanceType<typeof EvmSiwe> | null>(null)

const onConnected = () => {
  emit('connected', { address: address.value })
}

const onAuthenticated = (data: { address: `0x${string}`; chainId: number }) => {
  emit('authenticated', data)
}

const handleSignOut = () => {
  signOut()
  emit('signedOut')
}

const reset = () => {
  connectRef.value?.reset()
  siweRef.value?.reset()
}

defineExpose({ reset })
</script>
