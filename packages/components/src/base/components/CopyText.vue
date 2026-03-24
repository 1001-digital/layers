<template>
  <span
    class="copy-text"
    :title="value"
    role="button"
    @click="copy"
  >
    <slot :copied="copied">{{ copied ? 'Copied...' : text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

const props = defineProps<{
  value: string
  text?: string
}>()

const copied = ref(false)
const { start: resetCopied } = useTimeoutFn(
  () => { copied.value = false },
  2000,
  { immediate: false },
)

const copy = () => {
  if (props.value) {
    navigator.clipboard.writeText(props.value)
    copied.value = true
    resetCopied()
  }
}
</script>

<style>
@layer components {
  .copy-text {
    cursor: pointer;
    transition: color var(--speed);

    &:hover {
      color: var(--color);
    }
  }
}
</style>
