<template>
  <TooltipProvider :delay-duration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot name="trigger" />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          class="tooltip"
          :class="props.class"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
          :align-offset="alignOffset"
          :avoid-collisions="avoidCollisions"
          :collision-padding="collisionPadding"
        >
          <slot />
          <TooltipArrow
            v-if="arrow"
            class="tooltip-arrow"
          />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
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
    delayDuration?: number
  }>(),
  {
    side: 'top',
    align: 'center',
    sideOffset: 4,
    avoidCollisions: true,
    collisionPadding: 8,
    arrow: true,
    delayDuration: 300,
  },
)
</script>

<style>
@layer components {
  .tooltip {
    background: var(--tooltip-background);
    color: var(--color);
    border: var(--tooltip-border);
    border-radius: var(--tooltip-border-radius);
    padding: var(--tooltip-padding);
    font-family: var(--font-family);
    font-size: var(--ui-font-size);
    z-index: var(--z-index-ui);
    transform-origin: var(--reka-tooltip-content-transform-origin);

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

    .tooltip-arrow {
      fill: var(--tooltip-arrow-fill);
      stroke: var(--border-color);
    }
  }
}
</style>
