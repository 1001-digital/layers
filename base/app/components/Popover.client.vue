<template>
  <PopoverRoot v-model:open="open" :modal="modal">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverPortal>
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
      >
        <PopoverClose
          v-if="closable"
          :as="Button"
          class="popover-close small tertiary"
          aria-label="Close"
        >
          <Icon type="close" />
        </PopoverClose>

        <slot />

        <PopoverArrow v-if="arrow" class="popover-arrow" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { Button } from '#components'
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'

const props = withDefaults(
  defineProps<{
    class?: string | string[] | Record<string, boolean>
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alignOffset?: number
    avoidCollisions?: boolean
    collisionPadding?: number
    arrow?: boolean
    closable?: boolean
    modal?: boolean
  }>(),
  {
    side: 'bottom',
    align: 'center',
    sideOffset: 4,
    avoidCollisions: true,
    collisionPadding: 8,
  },
)

const open = defineModel<boolean>('open', { required: true })

// Focus the popover itself to prevent the close button from gaining focus
const onOpenAutoFocus = (e: Event) => {
  (e.target as HTMLElement)?.focus()
}
</script>

<style>
@layer variables {
  :root {
    --popover-background: var(--background);
    --popover-border: var(--border);
    --popover-border-radius: var(--border-radius);
    --popover-padding: var(--spacer);
    --popover-arrow-fill: var(--background);
  }
}
</style>

<style scoped>
@layer components {
  :deep(.popover) {
    background: var(--popover-background);
    color: var(--color);
    border: var(--popover-border);
    border-radius: var(--popover-border-radius);
    padding: var(--popover-padding);
    font-family: var(--font-family);
    font-size: var(--ui-font-size);
    z-index: var(--z-index-ui);
    min-inline-size: max(var(--popover-min-width, 12rem), var(--reka-popover-trigger-width));
    max-inline-size: min(
      var(--popover-width, 20rem),
      calc(100vw - var(--spacer) * 2)
    );
    max-block-size: var(--reka-popover-content-available-height);
    overflow-y: auto;
    overscroll-behavior: contain;
    container-type: inline-size;
    transform-origin: var(--reka-popover-content-transform-origin);

    display: grid;
    gap: var(--spacer);

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

    .popover-close {
      position: absolute !important;
      top: 0;
      right: 0;
    }

    .popover-arrow {
      fill: var(--popover-arrow-fill);
    }
  }
}
</style>
