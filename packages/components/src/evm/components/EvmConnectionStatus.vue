<template>
  <slot
    v-if="status === 'connected'"
    name="connected"
    :address="address!"
    :connector="connector!"
  />
  <slot
    v-else-if="status === 'reconnecting'"
    name="reconnecting"
  />
  <slot
    v-else-if="status === 'connecting'"
    name="connecting"
  />
  <slot
    v-else
    name="disconnected"
  />
</template>

<script setup lang="ts">
import { useConnection } from '@wagmi/vue'

const { address, connector, status } = useConnection()
</script>
