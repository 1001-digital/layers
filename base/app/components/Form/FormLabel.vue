<template>
  <label class="form-label">
    <span v-if="label">{{ label }}</span>
    <slot />
  </label>
</template>

<script setup>
defineProps({
  label: String,
})
</script>

<style scoped>
.form-label {
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  font-weight: var(--ui-font-weight);
  text-transform: var(--ui-text-transform);
  letter-spacing: var(--ui-letter-spacing);
  line-height: var(--ui-line-height);
  color: var(--ui-color);
  transition: all var(--speed);
  display: grid;
  gap: var(--size-2);

  &:hover {
    color: var(--color);
  }

  :deep(a) {
    text-decoration: underline;
  }

  > span:first-child {
    display: block;
  }
}
</style>
