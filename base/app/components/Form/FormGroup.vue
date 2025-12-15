<template>
  <div class="form-group" :class="{ radio }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  radio?: boolean
}>()
</script>

<style scoped>
.form-group {
  display: grid;
  gap: var(--spacer-sm);

  &.radio {
    display: flex;
    gap: var(--spacer-sm);

    :deep(input) {
      inline-size: min-content;

      &:not(:first-of-type) {
        margin-inline-start: var(--spacer-sm);
      }
    }

    :deep(label),
    :deep(input) {
      display: inline;
    }
  }
}
</style>
