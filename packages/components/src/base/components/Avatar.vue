<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt || 'Avatar'"
    :class="['avatar', { large }]"
  />
  <Opepicon
    v-else-if="seed"
    :seed="seed"
    :size="large ? 256 : 64"
    :class="['avatar', { large }]"
  />
</template>

<script setup lang="ts">
import Opepicon from './Opepicon.vue'

defineProps<{
  src?: string
  seed?: string
  alt?: string
  large?: boolean
}>()
</script>

<style scoped>
@layer components {
  .avatar {
    width: var(--size-5);
    min-width: var(--size-5);
    height: var(--size-5);
    min-height: var(--size-5);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: var(--background);
    object-fit: cover;

    &.large {
      width: var(--size-9);
      min-width: var(--size-9);
      height: var(--size-9);
      min-height: var(--size-9);
    }
  }
}
</style>
