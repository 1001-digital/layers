<template>
  <Button
    v-if="!noTrigger && !isAuthenticated"
    @click="open = true"
    :class="className"
  >
    <slot>Connect & Sign In</slot>
  </Button>
  <slot
    v-else-if="!noTrigger"
    name="authenticated"
    :address="session?.address"
    :sign-out="handleSignOut"
  >
    <Button
      @click="handleSignOut"
      :class="className"
      >Sign Out</Button
    >
  </slot>

  <Dialog
    :title="dialogTitle"
    v-model:open="open"
    @closed="onClosed"
  >
    <EvmConnectAuth
      ref="authRef"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useConnection } from '@wagmi/vue'
import { Button, Dialog } from '@1001-digital/components'
import EvmConnectAuth from './EvmConnectAuth.vue'
import { useSiwe } from '../composables/siwe'
import type {
  EvmConnectAuthDialogProps,
  EvmConnectAuthDialogEmits,
} from '../types'

defineProps<EvmConnectAuthDialogProps>()

const emit = defineEmits<EvmConnectAuthDialogEmits>()

const { address, isConnected } = useConnection()
const { isAuthenticated, session, signOut } = useSiwe()

const open = defineModel<boolean>('open', { default: false })
const authRef = ref<InstanceType<typeof EvmConnectAuth> | null>(null)

const dialogTitle = computed(() =>
  isConnected.value ? 'Sign In with Ethereum' : 'Connect Wallet',
)

const onAuthenticated = (data: { address: `0x${string}`; chainId: number }) => {
  open.value = false
  emit('authenticated', data)
}

const onClosed = () => {
  authRef.value?.reset()
}

const handleSignOut = () => {
  signOut()
  emit('signedOut')
}

const emitConnectionState = () =>
  isConnected.value
    ? emit('connected', { address: address.value })
    : emit('disconnected')

watch(isConnected, () => {
  emitConnectionState()
})

onMounted(() => emitConnectionState())
</script>
