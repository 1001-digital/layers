<template>
  <Transition name="fade">
    <aside
      v-if="!dismissed"
      class="alert"
      :class="[type]"
    >
      <button
        v-if="dismissable"
        @click="dismiss"
        class="close"
      >
        <Icon name="close" />
      </button>
      <slot />
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import Icon from './Icon.vue'

const props = defineProps<{
  type?: 'info' | 'error'
  dismissable?: boolean
  dismissKey?: string
}>()

const storageKey = computed(() => `alert:${props.dismissKey}`)

const dismissed = props.dismissKey
  ? useLocalStorage(storageKey, false)
  : ref(false)
const dismissable = computed(() => !!props.dismissable || !!props.dismissKey)

const dismiss = () => {
  dismissed.value = true
}
</script>

<style scoped>
@layer components {
  .alert {
    position: relative;
    display: grid;
    padding: var(--spacer-sm);
    gap: var(--spacer-sm);
    border: var(--border);
    border-color: var(--alert-border-color);
    border-radius: var(--alert-border-radius);
    background-color: var(--alert-background);
    color: var(--alert-color);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    text-transform: var(--ui-text-transform);

    &.info {
      border-color: var(--alert-info-border-color);
      background-color: var(--alert-info-background-color);
      color: var(--alert-info-color);
    }

    &.error {
      border-color: var(--alert-error-border-color);
      background-color: var(--alert-error-background-color);
      color: var(--alert-error-color);
    }

    &:has(> .close) {
      padding-inline-end: calc(var(--size-4) + var(--spacer-sm) * 2);
    }

    & :deep(> h1) {
      text-transform: uppercase;
      font-weight: bold;
    }

    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      /*
       * The box is exactly one icon. A 1em glyph centred inside a fixed
       * `--size-4` button left 1.5px a side, which straddles device pixels on
       * fractional DPR screens: the browser snapped one side to 1px and the
       * other to 2px, painting the X up and to the left of centre.
       */
      box-sizing: content-box;
      inline-size: 1em;
      block-size: 1em;
      font-size: var(--size-4);
      padding: 0;
      /*
       * Inherit the alert's line box so `1lh` centres the button on the first
       * line. The border sits outside the icon box, so discount it.
       */
      line-height: inherit;
      inset-block-start: calc(
        var(--spacer-sm) + (1lh - var(--size-4)) / 2 - var(--border-width)
      );
      inset-inline-end: var(--spacer-sm);
      background: none;

      &:is(:hover, :active, :focus, .active) {
        background: none;
      }
    }
  }
}
</style>
