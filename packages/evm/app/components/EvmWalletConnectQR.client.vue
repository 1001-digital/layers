<template>
  <EvmConnectorQR :uri="uri">
    <template #instruction>
      Scan the code in your wallet application
    </template>
  </EvmConnectorQR>
</template>

<script setup lang="ts">
defineProps<{
  uri: string
}>()
</script>
