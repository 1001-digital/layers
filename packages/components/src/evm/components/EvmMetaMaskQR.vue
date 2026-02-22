<template>
  <EvmConnectorQR :uri="uri">
    <template #instruction>
      Scan the code in your MetaMask mobile app
    </template>
  </EvmConnectorQR>
</template>

<script setup lang="ts">
import EvmConnectorQR from './EvmConnectorQR.vue'

defineProps<{
  uri: string
}>()
</script>
