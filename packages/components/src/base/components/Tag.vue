<template>
  <span class="tag">
    <span>
      <slot />
    </span>
    <Button
      v-if="dismissable"
      @click="emit('dismiss')"
    >
      <Icon name="close" />
    </Button>
  </span>
</template>

<script setup lang="ts">
import Button from './Button.vue'
import Icon from './Icon.vue'

defineProps<{
  dismissable?: boolean
}>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.tag {
  border-radius: var(--tag-border-radius);
  box-shadow: var(--border-shadow);
  font-family: var(--font-family);
  font-size: var(--font-sm);
  font-weight: var(--ui-font-weight);
  text-transform: var(--ui-text-transform);
  letter-spacing: var(--ui-letter-spacing);
  line-height: var(--ui-line-height);
  color: var(--ui-color);
  display: flex;
  align-items: center;

  > span {
    padding: var(--spacer-sm) var(--spacer);

    + button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding: var(--spacer-sm);

      &:is(:hover, :active, :focus, .active) {
        background: var(--gray-z-1);
      }
    }
  }
}
</style>
