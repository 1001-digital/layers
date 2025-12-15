<template>
  <NuxtLink v-if="to" :to="to" :exact="exact" :target="target" class="button">
    <slot />
  </NuxtLink>
  <button v-else>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  to: [String, Object],
  target: {
    type: String,
    default: '_self',
  },
  exact: Boolean,
})
</script>

<style scoped>
button,
a.button {
  position: relative;
  min-inline-size: fit-content;
  inline-size: fit-content;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacer-sm);

  &:not(.unstyled) {
    background: var(--button-background);
    color: var(--button-color);
    padding: var(--ui-padding-block) var(--ui-padding-inline);
    border: none;
    border-radius: var(--button-border-radius);
    box-shadow: var(--border-shadow);
    transition:
      background var(--speed),
      box-shadow var(--speed),
      color var(--speed);
  }

  >span {
    display: flex;
    gap: var(--ui-padding-inline);
    line-height: var(--ui-line-height);
    justify-content: center;
    text-align: center;
    align-items: center;
    inline-size: 100%;
    block-size: 100%;
  }

  >.icon {
    color: var(--button-icon-color);
    transition: color var(--speed);
  }

  &:has(> .icon:first-child) {
    padding-inline-start: calc(var(--ui-padding-inline) - var(--size-1));

    &.small {
      padding-inline-start: calc(var(--ui-padding-inline) / 2);
    }
  }

  &:has(> .icon:first-child:last-child) {
    padding: var(--ui-padding-block);
    aspect-ratio: 1;

    &.small {
      padding: calc(var(--ui-padding-block) / 2);
    }
  }

  &.non-interactive,
  &[disabled]:not([disabled='false']) {
    pointer-events: none;
  }

  &[disabled]:not([disabled='false']) {
    color: var(--muted);
    opacity: 0.5;
  }

  &.small {
    padding: calc(var(--ui-padding-block) / 2) calc(var(--ui-padding-inline) / 2);
    min-block-size: 0;

    >.icon {
      inline-size: var(--size-3);
      block-size: var(--size-3);
    }
  }

  &.link {
    box-shadow: none;
    background: transparent;
    line-height: inherit;
    color: var(--color);
    padding: 0;

    >.icon {
      align-self: center;
      block-size: 1em;
      inline-size: 1em;
    }

    &.muted {
      color: var(--muted);

      >.icon {
        color: var(--muted);
      }
    }
  }

  &.inline {
    display: inline-flex;
    align-self: baseline;
    align-items: baseline;
    block-size: inherit;
    margin: 0 !important;
    padding: 0 var(--size-1) !important;
    gap: 0.2em;
    inline-size: min-content;
  }

  &.invisible {
    position: absolute;
    inset-inline-start: -200vw;
    opacity: 0;
  }

  &.danger {
    box-shadow: 0 0 0 var(--border-width) var(--error);
    color: var(--error) !important;

    >.icon {
      color: var(--error);
    }
  }

  /* Primary variant */
  &.primary {
    background: var(--button-primary-background);
    box-shadow: 0 0 0 var(--border-width) var(--button-primary-border-color);
    color: var(--button-primary-color);

    >.icon {
      color: var(--button-primary-color);
    }

    &:is(:hover, :active, :focus, .active) {
      background: var(--button-primary-background-highlight);
      box-shadow: 0 0 0 var(--border-width) var(--button-primary-border-color-highlight);
      color: var(--button-primary-color-highlight);

      >.icon {
        color: var(--button-primary-color-highlight);
      }
    }
  }

  &:is(:hover, :active, :focus, .active) {
    background: var(--button-background-highlight);
    box-shadow: var(--border-shadow-highlight);
    color: var(--button-color-highlight);

    >.icon {
      color: var(--button-icon-color-highlight);
    }

    &.link {
      background: transparent !important;
      box-shadow: none;
      color: var(--color);

      >.icon {
        color: var(--gray-z-7);
      }

      &.muted {
        color: var(--color);

        >.icon {
          color: var(--gray-z-7);
        }
      }
    }
  }
}
</style>
