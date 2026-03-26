<template>
  <span
    v-if="svg"
    class="opepicon"
    v-html="svg"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { renderSVG } from '@visualizevalue/opepicons'

const props = withDefaults(
  defineProps<{
    seed: string
    size?: number
  }>(),
  {
    size: 64,
  },
)

const svg = ref<string | null>(null)
watchEffect(() => {
  if (!props.seed) {
    svg.value = null
    return
  }

  svg.value = renderSVG({ seed: props.seed, size: props.size })
})
</script>

<style scoped>
@layer components {
  .opepicon {
    width: var(--size-5);
    height: var(--size-5);
    border-radius: 50%;
    overflow: hidden;
    display: inline-flex;
  }

  .opepicon :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
