<template>
  <EvmConnectorQR :uri="uri">
    <template #instruction>
      Scan the code in your MetaMask mobile app
    </template>
  </EvmConnectorQR>
</template>

<script setup lang="ts">
defineProps<{
  uri: string
}>()
</script>
