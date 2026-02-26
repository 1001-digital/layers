<template>
  <PopoverRoot
    v-model:open="open"
    :modal="modal"
  >
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverPortal :to="teleportTarget">
      <PopoverContent
        class="popover"
        :class="props.class"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :avoid-collisions="avoidCollisions"
        :collision-padding="collisionPadding"
        @open-auto-focus.prevent="onOpenAutoFocus"
        @interact-outside="onInteractOutside"
      >
        <h1 v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </h1>
        <PopoverClose
          v-if="closable"
          :as="Button"
          class="popover-close tertiary"
          aria-label="Close"
        >
          <Icon type="close" />
        </PopoverClose>

        <section>
          <slot />
        </section>

        <PopoverArrow
          v-if="arrow"
          class="popover-arrow"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Button from './Button.vue'
import Icon from './Icon.vue'
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'

const teleportTarget = inject<HTMLElement | null>('teleport-target', null)

const props = withDefaults(
  defineProps<{
    class?: string | string[] | Record<string, boolean>
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alignOffset?: number
    avoidCollisions?: boolean
    collisionPadding?: number
    title?: string
    arrow?: boolean
    closable?: boolean
    dismissable?: boolean
    modal?: boolean
  }>(),
  {
    side: 'bottom',
    align: 'center',
    sideOffset: 4,
    avoidCollisions: true,
    collisionPadding: 8,
    dismissable: true,
  },
)

const open = defineModel<boolean>('open', { required: true })

// Focus the popover itself to prevent the close button from gaining focus
const onOpenAutoFocus = (e: Event) => {
  ;(e.target as HTMLElement)?.focus()
}

const onInteractOutside = (e: Event) => {
  if (!props.dismissable) e.preventDefault()
}
</script>

<style scoped>
@layer components {
  :deep(.popover) {
    background: var(--popover-background);
    color: var(--color);
    border: var(--popover-border);
    border-radius: var(--popover-border-radius);
    padding: 0;
    font-family: var(--font-family);
    font-size: var(--ui-font-size);
    z-index: var(--z-index-ui);
    min-inline-size: max(
      var(--popover-min-width, 12rem),
      var(--reka-popover-trigger-width)
    );
    inline-size: min(
      var(--popover-width, 20rem),
      calc(100vw - var(--spacer) * 2)
    );
    max-block-size: var(--reka-popover-content-available-height);
    container-type: inline-size;
    transform-origin: var(--reka-popover-content-transform-origin);

    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;

    /* Entry/exit animations */
    opacity: 1;
    scale: 1;
    transition:
      opacity var(--speed) ease,
      scale var(--speed) ease;

    @starting-style {
      opacity: 0;
      scale: 0.95;
    }

    &[data-state='closed'] {
      opacity: 0;
      scale: 0.95;
    }

    &:focus {
      outline: none;
    }

    > h1:first-child {
      display: flex;
      align-items: center;
      block-size: calc(var(--spacer) * 2);
      border-start-start-radius: var(--popover-border-radius);
      border-start-end-radius: var(--popover-border-radius);
      box-shadow: var(--border-shadow);
      padding-inline-start: var(--popover-padding);
      padding-right: calc(var(--spacer) * 3);
      font-family: var(--font-family);
      font-size: var(--ui-font-size);
      text-transform: var(--ui-text-transform);
      margin: 0;
    }

    > section {
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: var(--popover-padding);
      display: grid;
      gap: var(--spacer);
    }

    .popover-close {
      position: absolute !important;
      top: 0;
      right: 0;
      box-shadow: var(--border-shadow) !important;
      border-radius: 0 !important;
      border-start-end-radius: var(--popover-border-radius) !important;
    }

    .popover-arrow {
      fill: var(--popover-arrow-fill);
      stroke: var(--border-color);
    }
  }
}
</style>
