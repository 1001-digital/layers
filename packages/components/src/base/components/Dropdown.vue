<template>
  <DropdownMenuRoot
    v-model:open="open"
    :modal="modal"
    :dir="dir"
  >
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal v-bind="teleportTarget ? { to: teleportTarget } : {}">
      <DropdownMenuContent
        class="dropdown"
        :class="props.class"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :avoid-collisions="avoidCollisions"
        :collision-padding="collisionPadding"
        :loop="loop"
      >
        <div class="dropdown-items">
          <slot />
        </div>
        <DropdownMenuArrow
          v-if="arrow"
          class="dropdown-arrow"
        />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
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
    arrow?: boolean
    modal?: boolean
    loop?: boolean
    dir?: 'ltr' | 'rtl'
  }>(),
  {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    avoidCollisions: true,
    collisionPadding: 8,
    loop: true,
  },
)

const open = defineModel<boolean>('open', { required: true })
</script>

<style scoped>
@layer components {
  :deep() {
    .dropdown {
      background: var(--dropdown-background);
      color: var(--color);
      border: var(--dropdown-border);
      border-radius: var(--dropdown-border-radius);
      padding: 0;
      font-family: var(--font-family);
      font-size: var(--ui-font-size);
      z-index: var(--z-index-ui);
      min-inline-size: var(--reka-dropdown-menu-trigger-width);
      max-block-size: var(--reka-dropdown-menu-content-available-height);
      transform-origin: var(--reka-dropdown-menu-content-transform-origin);

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

      .dropdown-arrow {
        fill: var(--dropdown-arrow-fill);
        stroke: var(--border-color);
      }
    }

    .dropdown-items {
      padding: var(--dropdown-padding);
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .dropdown-item {
      padding: var(--size-2) var(--size-3);
      border-radius: calc(var(--dropdown-border-radius) / 2);
      display: flex;
      align-items: center;
      gap: var(--size-2);
      cursor: pointer;
      outline: none;
      user-select: none;

      &[data-highlighted] {
        background: var(--button-background-highlight);
      }

      &[data-disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .dropdown-label {
      padding: var(--size-2) var(--size-3);
      color: var(--muted);
      font-weight: 500;
      user-select: none;
    }

    .dropdown-separator {
      block-size: 1px;
      background: var(--border-color);
      margin-block: var(--size-1);
    }

    .dropdown-item-indicator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .dropdown-sub-trigger {
      justify-content: space-between;
    }

    .dropdown-sub-icon {
      color: var(--muted);
      margin-inline-start: auto;
    }
  }
}
</style>
