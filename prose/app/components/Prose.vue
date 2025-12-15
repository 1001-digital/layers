<template>
  <div class="prose" :class="{ centered }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  centered?: boolean
}>()
</script>
