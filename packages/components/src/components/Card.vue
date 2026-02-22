<template>
  <component
    :is="as"
    class="card"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
  }>(),
  {
    as: 'article',
  },
)
</script>

<style scoped>
@layer components {
  .card {
    display: grid;
    gap: var(--spacer);
    background-color: var(--card-background);
    block-size: 100%;
    padding: var(--spacer);
    transition:
      background var(--speed),
      border-color var(--speed);

    &:not(.borderless) {
      border: var(--card-border);
      border-radius: var(--card-border-radius);

      &:has(> .card-link) {
        &:has(> .card-link:hover),
        &:has(> .card-link:focus) {
          border-color: var(--card-border-color-highlight);
        }
      }
    }

    &.borderless {
      padding: 0;
    }

    &:has(> .card-link) {
      &:has(> .card-link:hover),
      &:has(> .card-link:focus) {
        background-color: var(--card-background-highlight);
      }
    }

    &.static {
      background-color: var(--card-background);
    }

    &.highlight {
      background-color: var(--card-background-highlight);
    }

    > * {
      inline-size: 100%;
      place-self: center;

      &:first-child {
        place-self: flex-start;
      }

      &:last-child {
        place-self: flex-end;
      }
    }
  }
}
</style>
