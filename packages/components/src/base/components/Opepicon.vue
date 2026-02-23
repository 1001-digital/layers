<template>
  <img
    v-if="dataUrl"
    :src="dataUrl"
    :alt="seed"
    class="opepicon"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { createIcon } from '@visualizevalue/opepicons'

const props = withDefaults(
  defineProps<{
    seed: string
    size?: number
  }>(),
  {
    size: 64,
  },
)

const dataUrl = ref<string | null>(null)
watchEffect(() => {
  if (!props.seed) {
    dataUrl.value = null
    return
  }

  const canvas = createIcon({ seed: props.seed, size: props.size })
  dataUrl.value = canvas.toDataURL()
})
</script>

<style scoped>
@layer components {
  .opepicon {
    width: var(--size-5);
    height: var(--size-5);
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
