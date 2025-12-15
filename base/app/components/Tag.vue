<template>
  <span class="tag">
    <span><slot /></span>
    <button v-if="dismissable" class="unstyled" @click="emit('dismiss')">
      <Icon type="close" />
    </button>
  </span>
</template>

<script setup>
defineProps({
  dismissable: Boolean,
})

const emit = defineEmits(['dismiss'])
</script>

<style scoped>
.tag {
  border: var(--border);
  font-family: var(--ui-font-family);
  font-size: var(--font-sm);
  font-weight: var(--ui-font-weight);
  text-transform: var(--ui-text-transform);
  letter-spacing: var(--ui-letter-spacing);
  line-height: var(--ui-line-height);
  color: var(--ui-color);
  display: flex;
  align-items: center;

  > span {
    padding: var(--spacer-xs) var(--spacer-sm);

    + button {
      margin-inline-start: calc(-1 * var(--spacer-xs));
      padding: var(--spacer-xs);
      display: flex;
      align-items: center;
      justify-content: center;

      &:is(:hover, :active, :focus, .active) {
        background: var(--gray-z-1);
      }
    }
  }
}
</style>
