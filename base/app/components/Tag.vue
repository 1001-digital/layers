<template>
  <span class="tag">
    <span>
      <slot />
    </span>
    <Button v-if="dismissable" @click="emit('dismiss')">
      <Icon type="close" />
    </Button>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  dismissable?: boolean
}>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.tag {
  box-shadow: var(--border-shadow);
  font-family: var(--ui-font-family);
  font-size: var(--font-sm);
  font-weight: var(--ui-font-weight);
  text-transform: var(--ui-text-transform);
  letter-spacing: var(--ui-letter-spacing);
  line-height: var(--ui-line-height);
  color: var(--ui-color);
  display: flex;
  align-items: center;

  >span {
    padding: var(--spacer-sm) var(--spacer);

    +button {
      padding: var(--spacer-sm);

      &:is(:hover, :active, :focus, .active) {
        background: var(--gray-z-1);
      }
    }
  }
}
</style>
