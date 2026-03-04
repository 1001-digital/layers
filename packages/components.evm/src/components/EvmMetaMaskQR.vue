<template>
  <EvmConnectorQR :uri="uri">
    <template #instruction>
      Scan the code in your MetaMask mobile app
    </template>
  </EvmConnectorQR>
  <Button
    class="link muted small"
    @click="$emit('back')"
  >
    <Icon type="chevron-left" />
    <span>Back</span>
  </Button>
</template>

<script setup lang="ts">
import EvmConnectorQR from './EvmConnectorQR.vue'
import { Button, Icon } from '@1001-digital/components'

defineProps<{
  uri: string
}>()

defineEmits<{
  back: []
}>()
</script>

<style scoped>
.link.muted {
  justify-self: center;
}
</style>
