<template>
  <EvmConnectorQR :uri="uri">
    <template #instruction>
      Scan the code in your MetaMask mobile app
    </template>
  </EvmConnectorQR>
  <Button
    class="link muted small back-link"
    @click="$emit('back')"
  >
    <Icon type="arrow-left" />
    <span>Back</span>
  </Button>
</template>

<script setup lang="ts">
import EvmConnectorQR from './EvmConnectorQR.vue'
import Button from '../../base/components/Button.vue'
import Icon from '../../base/components/Icon.vue'

defineProps<{
  uri: string
}>()

defineEmits<{
  back: []
}>()
</script>

<style scoped>
.back-link {
  justify-self: center;
  font-size: var(--font-xs);
}
</style>
