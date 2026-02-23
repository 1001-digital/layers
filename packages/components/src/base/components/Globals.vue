<template>
  <Toasts>
    <ConfirmDialog />
    <slot />
  </Toasts>
</template>

<script setup lang="ts">
import Toasts from './Toasts.vue'
import ConfirmDialog from './ConfirmDialog.vue'
</script>
