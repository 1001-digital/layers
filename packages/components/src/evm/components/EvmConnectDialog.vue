<template>
  <Button
    v-if="showConnect"
    @click="open = true"
    :class="className"
  >
    <slot>Connect Wallet</slot>
  </Button>
  <slot
    v-else-if="isConnected"
    name="connected"
    :address="address"
  >
    <EvmAccount :address="address" />
  </slot>

  <Dialog
    v-if="showConnect"
    title="Connect Wallet"
    v-model:open="open"
    @closed="onClosed"
  >
    <EvmConnect
      ref="connectRef"
      @connected="onConnected"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useConnection } from '@wagmi/vue'
import Button from '../../base/components/Button.vue'
import Dialog from '../../base/components/Dialog.vue'
import EvmAccount from './EvmAccount.vue'
import EvmConnect from './EvmConnect.vue'

defineProps<{
  className?: string
}>()

const emit = defineEmits<{
  connected: [{ address: `0x${string}` | undefined }]
  disconnected: []
}>()

const { address, isConnected } = useConnection()

const showConnect = computed(() => !isConnected.value)
const open = ref(false)
const connectRef = ref<InstanceType<typeof EvmConnect> | null>(null)

const onConnected = () => {
  open.value = false
}

const onClosed = () => {
  connectRef.value?.reset()
}

const check = () =>
  isConnected.value
    ? emit('connected', { address: address.value })
    : emit('disconnected')

watch(isConnected, () => {
  check()
  if (!isConnected.value) {
    open.value = false
    connectRef.value?.reset()
  }
})

onMounted(() => check())
</script>
