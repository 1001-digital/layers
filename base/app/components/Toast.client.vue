<template>
  <ToastProvider
    :duration="duration"
    :swipe-direction="swipeDirection"
  >
    <ToastRoot
      v-for="toast in toasts"
      :key="toast.id"
      :duration="toast.duration"
      class="toast"
      :class="[toast.variant || 'info']"
      @update:open="(open) => !open && dismiss(toast.id)"
    >
      <ToastTitle
        v-if="toast.title"
        class="toast-title"
      >
        {{ toast.title }}
      </ToastTitle>
      <ToastDescription
        v-if="toast.description"
        class="toast-description"
      >
        {{ toast.description }}
      </ToastDescription>
      <ToastAction
        v-if="toast.action"
        :alt-text="toast.action.label"
        :as="Actions"
        class="left"
      >
        <Button
          class="small"
          @click="toast.action!.onClick()"
        >
          {{ toast.action.label }}
        </Button>
      </ToastAction>
      <ToastClose
        class="toast-close small tertiary"
        :as="Button"
        aria-label="Close"
      >
        <Icon type="close" />
      </ToastClose>
    </ToastRoot>

    <ToastViewport
      class="toast-viewport"
      :class="[position]"
    />
  </ToastProvider>
</template>

<script setup lang="ts">
import { Actions, Button } from '#components'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'

withDefaults(
  defineProps<{
    duration?: number
    swipeDirection?: 'right' | 'left' | 'up' | 'down'
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  }>(),
  {
    duration: 5_000,
    swipeDirection: 'right',
    position: 'bottom-right',
  },
)

const { toasts, dismiss } = useToast()
</script>

<style>
@layer variables {
  :root {
    --toast-width: 22rem;
    --toast-padding: var(--spacer-sm);
    --toast-gap: var(--spacer-xs);

    --toast-info-color: var(--color);
    --toast-info-background: var(--card-background);
    --toast-info-border-color: var(--border-color);

    --toast-success-color: var(--color);
    --toast-success-background: var(--card-background);
    --toast-success-border-color: var(--success);

    --toast-error-color: var(--color);
    --toast-error-background: var(--card-background);
    --toast-error-border-color: var(--error);
  }
}
</style>

<style scoped>
@layer components {
  :deep(.toast-viewport) {
    position: fixed;
    z-index: var(--z-index-toast);
    display: flex;
    flex-direction: column;
    gap: var(--toast-gap);
    padding: var(--spacer);
    margin: 0;
    list-style: none;
    max-width: 100vw;
    outline: none;

    &.bottom-right {
      bottom: 0;
      right: 0;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
    }

    &.top-right {
      top: 0;
      right: 0;
    }

    &.top-left {
      top: 0;
      left: 0;
    }
  }

  :deep(.toast) {
    position: relative;
    display: grid;
    inline-size: var(--toast-width);
    max-inline-size: calc(100vw - var(--spacer) * 2);
    padding: var(--toast-padding);
    border: var(--border);
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: var(--ui-font-size);
    text-transform: var(--ui-text-transform);

    /* Entry animation */
    opacity: 1;
    translate: 0;
    transition:
      opacity var(--speed) ease,
      translate var(--speed) ease;

    @starting-style {
      opacity: 0;
      translate: 100% 0;
    }

    /* Exit animation */
    &[data-state='closed'] {
      opacity: 0;
      translate: 100% 0;
    }

    /* Swipe */
    &[data-swipe='move'] {
      translate: var(--reka-toast-swipe-move-x) 0;
    }

    &[data-swipe='cancel'] {
      translate: 0;
      transition: translate var(--speed) ease;
    }

    &[data-swipe='end'] {
      translate: var(--reka-toast-swipe-end-x) 0;
    }

    /* Variants */
    &.info {
      color: var(--toast-info-color);
      background: var(--toast-info-background);
      border-color: var(--toast-info-border-color);

      .toast-close {
        --button-tertiary-border-color: var(--toast-info-border-color);
        --button-color-highlight: var(--toast-info-border-color);
      }
    }

    &.success {
      color: var(--toast-success-color);
      background: var(--toast-success-background);
      border-color: var(--toast-success-border-color);

      .toast-close {
        --button-tertiary-border-color: var(--toast-success-border-color);
        --button-color-highlight: var(--toast-success-border-color);
      }
    }

    &.error {
      color: var(--toast-error-color);
      background: var(--toast-error-background);
      border-color: var(--toast-error-border-color);

      .toast-close {
        --button-tertiary-border-color: var(--toast-error-border-color);
        --button-color-highlight: var(--toast-error-border-color);
      }
    }

    .toast-title {
      font-weight: bold;
      padding-inline-end: calc(var(--spacer) * 1.5) toast;
    }

    .toast-description {
      color: var(--muted);
    }

    .toast-close {
      position: absolute !important;
      top: 0;
      right: 0;
    }

    .actions {
      margin-top: var(--spacer) !important;
      width: min-content;
    }
  }
}
</style>
