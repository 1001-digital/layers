<template>
  <component
    :is="as"
    class="dialog"
  >
    <div class="dialog-content">
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
  }>(),
  {
    as: 'div',
  },
)
</script>

<style>
@layer components {
  .dialog-layer-root {
    position: fixed;
    inset: 0;
    z-index: var(--z-index-dialog);
    pointer-events: none;
  }

  .dialog-layer {
    position: fixed;
    inset: 0;
    z-index: var(--dialog-layer-order, 0);
    pointer-events: none;
  }

  .dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: auto;
    background-color: var(--backdrop-background);
    backdrop-filter: var(--blur);
  }

  .dialog-overlay[data-state='open'] {
    animation: dialog-overlay-enter var(--speed) ease;
  }

  .dialog-overlay[data-state='closed'] {
    animation: dialog-overlay-exit var(--speed) ease;
  }

  .dialog {
    /* Flex prevents Safari from expanding the inner grid's 1fr row. */
    position: fixed;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    z-index: 1;
    pointer-events: auto;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    block-size: fit-content;
    max-block-size: var(
      --dialog-max-block-size,
      calc(100dvh - 2 * var(--spacer))
    );
    max-inline-size: min(
      var(--dialog-width, 32rem),
      calc(100vw - var(--spacer) * 2)
    );
    inline-size: 100%;
    background: var(--background);
    color: var(--color);
    border: var(--border);
    border-radius: var(--dialog-border-radius);
    padding: 0;
    overflow: hidden;
    outline: none;

    &[data-state='open'] {
      animation: dialog-content-enter var(--speed) ease;
    }

    &[data-state='closed'] {
      animation: dialog-content-exit var(--speed) ease;
    }

    &.large {
      --dialog-width: min(90vw, 64rem);
    }

    > .dialog-content {
      display: grid;
      grid-template-rows: auto 1fr auto;
      inline-size: 100%;
      min-block-size: 0;
      max-block-size: inherit;

      > h1:first-child,
      > .close {
        display: flex;
        align-items: center;
        block-size: calc(var(--spacer) * 2);
        background: var(--dialog-header-background);
        box-shadow: var(--border-shadow);
        padding-inline-start: var(--spacer);
        font-family: var(--ui-font-family);
        font-size: var(--ui-font-size);
        text-transform: var(--ui-text-transform);
        margin: 0;
      }

      > h1:first-child {
        position: relative;
        z-index: 1;
        padding-right: calc(var(--spacer) * 3);
      }

      > .close {
        color: var(--dialog-close-color);
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        inline-size: calc(var(--spacer) * 2);
        justify-content: center;
        padding: 0;
        border-radius: 0;
        border-start-end-radius: var(--dialog-border-radius);

        &:is(:hover, :active, :focus, .active) {
          outline: none;
        }
      }

      > section {
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: var(--spacer);
        display: grid;
        gap: var(--spacer);

        > .dialog-description {
          margin: 0;
        }
      }

      > footer {
        display: flex;
        gap: var(--spacer);
        justify-content: safe flex-end;
        padding: var(--spacer);
        border-block-start: var(--border);
        overflow-x: auto;

        &:empty {
          display: none;
        }
      }
    }
  }

  .dialog-visually-hidden {
    position: absolute !important;
    inline-size: 1px !important;
    block-size: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  html:has(.dialog[data-state='open']) {
    overflow: hidden;
  }

  @keyframes dialog-content-enter {
    from {
      opacity: 0;
      scale: 0.95;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  @keyframes dialog-content-exit {
    from {
      opacity: 1;
      scale: 1;
    }
    to {
      opacity: 0;
      scale: 0.95;
    }
  }

  @keyframes dialog-overlay-enter {
    from {
      background-color: transparent;
      backdrop-filter: blur(0);
    }
  }

  @keyframes dialog-overlay-exit {
    to {
      background-color: transparent;
      backdrop-filter: blur(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dialog,
    .dialog-overlay {
      animation-duration: 1ms !important;
    }
  }
}
</style>
