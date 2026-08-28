<template>
  <span :class="['tag', { small }]">
    <span>
      <slot />
    </span>
    <slot
      v-if="dismissable"
      name="dismiss"
    >
      <Button
        :class="{ small }"
        @click="emit('dismiss')"
      >
        <Icon name="close" />
      </Button>
    </slot>
  </span>
</template>

<script setup lang="ts">
import Button from './Button.vue'
import Icon from './Icon.vue'

defineProps<{
  dismissable?: boolean
  small?: boolean
}>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.tag {
  background: var(--tag-background);
  border-radius: var(--tag-border-radius);
  border: var(--border);
  transition: border-color var(--speed);
  font-family: var(--ui-font-family);
  font-size: var(--font-sm);
  font-weight: var(--ui-font-weight);
  text-transform: var(--ui-text-transform);
  letter-spacing: var(--ui-letter-spacing);
  line-height: var(--ui-line-height);
  color: var(--ui-color);
  display: flex;
  align-items: stretch;

  /* The dismiss button owns only the divider, so the tag lights up with it. */
  &:has(> button:is(:hover, :focus-visible)) {
    border-color: var(--border-color-highlight);
  }

  &:deep(> span) {
    min-width: 0;
    padding: var(--spacer-sm) var(--spacer);
    overflow-wrap: anywhere;
    /* Stretched to the dismiss button's height — keep the label centred. */
    display: flex;
    align-items: center;

    + button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      /* The tag draws the outer border — keep only the divider. */
      border-width: 0;
      border-inline-start-width: var(--border-width);
      padding: var(--spacer-sm);

      &:is(:hover, :active, :focus, .active) {
        background: var(--gray-z-1);
      }
    }
  }

  &.small {
    border-radius: var(--border-radius-sm);
    font-size: var(--font-xs);

    &:deep(> span) {
      padding: calc(var(--ui-padding-block) / 2) var(--spacer-sm);

      + button {
        border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
      }
    }
  }
}
</style>
