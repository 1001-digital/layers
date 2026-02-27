<template>
  <slot
    :status="status"
    :address="address"
    :connector="connector"
  />
</template>

<script setup lang="ts">
import { useConnection } from '@wagmi/vue'

const { address, connector, status } = useConnection()
</script>
