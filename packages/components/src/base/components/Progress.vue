<template>
  <ProgressRoot
    v-model="model"
    class="progress"
    :max="max"
  >
    <ProgressIndicator
      class="progress-indicator"
      :style="model != null ? { width: `${percentage}%` } : undefined"
    />
  </ProgressRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

const model = defineModel<number | null>()

const props = withDefaults(
  defineProps<{
    max?: number
  }>(),
  {
    max: 100,
  },
)

const percentage = computed(() =>
  model.value != null ? (model.value / props.max) * 100 : 0,
)
</script>

<style scoped>
@layer components {
  .progress {
    position: relative;
    inline-size: 100%;
    block-size: var(--progress-height);
    background: var(--progress-track-background);
    border-radius: var(--progress-radius);
    overflow: hidden;
  }

  .progress-indicator {
    block-size: 100%;
    background: var(--progress-indicator-background);
    border-radius: var(--progress-radius);
    transition: width var(--speed);
  }

  [data-state='indeterminate'] > .progress-indicator {
    inline-size: 30%;
    animation: progress-indeterminate 1.5s ease-in-out infinite;
  }

  @keyframes progress-indeterminate {
    0% {
      translate: -100% 0;
    }
    100% {
      translate: 400% 0;
    }
  }
}
</style>
