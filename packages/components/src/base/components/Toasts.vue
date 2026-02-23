<template>
  <ToastProvider
    :duration="duration"
    :swipe-direction="swipeDirection"
  >
    <ToastRoot
      v-for="toast in toasts"
      :key="toast.id"
      :duration="toast.duration"
      force-mount
      class="toast"
      :class="[toast.variant || 'info']"
      @update:open="(open) => !open && onClose(toast.id)"
    >
      <ToastTitle class="toast-title">
        <span
          v-if="toast.loading"
          class="toast-spinner"
          aria-hidden="true"
        />
        {{ toast.title }}
      </ToastTitle>
      <ToastClose
        class="toast-close tertiary"
        :as="Button"
        aria-label="Close"
      >
        <Icon type="close" />
      </ToastClose>

      <section v-if="toast.description || toast.action || toast.progress">
        <ToastDescription
          v-if="toast.description"
          class="toast-description"
        >
          {{ toast.description }}
        </ToastDescription>
        <Progress
          v-if="toast.progress"
          :model-value="toast.progress === true ? null : toast.progress"
        />
        <ToastAction
          v-if="toast.action"
          :alt-text="toast.action.label"
          :as="Actions"
          class="left"
        >
          <Button
            class="small tertiary"
            @click="toast.action!.onClick()"
          >
            {{ toast.action.label }}
          </Button>
        </ToastAction>
      </section>
    </ToastRoot>

    <ToastViewport
      class="toast-viewport"
      :class="[position]"
    />
  </ToastProvider>
</template>

<script setup lang="ts">
import Actions from './Actions.vue'
import Button from './Button.vue'
import Icon from './Icon.vue'
import Progress from './Progress.vue'
import { useToast } from '../composables/toast'
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

const onClose = (id: string) => {
  setTimeout(() => dismiss(id), 300)
}
</script>

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
    grid-template-rows: auto minmax(0, 1fr);
    inline-size: var(--toast-width);
    max-inline-size: calc(100vw - var(--spacer) * 2);
    padding: 0;
    border: var(--border);
    border-radius: var(--border-radius);
    overflow: hidden;
    font-family: var(--font-family);
    font-size: var(--ui-font-size);

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
      translate: 25% 0;
      transition:
        opacity var(--speed-fast) ease,
        translate var(--speed) ease;
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
      --border-color: var(--toast-info-border-color);
      color: var(--toast-info-color);
      background: var(--toast-info-background);
      border-color: var(--toast-info-border-color);

      .toast-close {
        --button-tertiary-border-color: var(--toast-info-border-color);
        --button-color-highlight: var(--toast-info-border-color);
      }
    }

    &.success {
      --border-color: var(--toast-success-border-color);
      color: var(--toast-success-color);
      background: var(--toast-success-background);
      border-color: var(--toast-success-border-color);

      .toast-close {
        --button-tertiary-border-color: var(--toast-success-border-color);
        --button-color-highlight: var(--toast-success-border-color);
      }
    }

    &.error {
      --border-color: var(--toast-error-border-color);
      color: var(--toast-error-color);
      background: var(--toast-error-background);
      border-color: var(--toast-error-border-color);

      .toast-close {
        --button-tertiary-border-color: var(--toast-error-border-color);
        --button-color-highlight: var(--toast-error-border-color);
      }
    }

    .toast-title {
      display: flex;
      align-items: center;
      gap: var(--spacer-sm);
      block-size: calc(var(--spacer) * 2);
      box-shadow: var(--border-shadow);
      padding-inline-start: var(--ui-padding-inline);
      padding-right: calc(var(--spacer) * 3);
      font-family: var(--font-family);
      font-size: var(--ui-font-size);
      font-weight: normal;
      text-transform: var(--ui-text-transform);
      margin: 0;
    }

    .toast-spinner {
      width: var(--ui-font-size);
      height: var(--ui-font-size);
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin var(--speed-slow, 1s) linear infinite;
      flex-shrink: 0;
    }

    > section {
      padding: var(--ui-padding-inline);
      display: grid;
      gap: var(--spacer);
    }

    .toast-description {
      color: var(--muted);
      font-size: var(--font-sm);
    }

    .toast-close {
      position: absolute !important;
      top: 0;
      right: 0;
      box-shadow: var(--border-shadow) !important;
      border-radius: 0 !important;
      border-start-end-radius: var(--border-radius) !important;
    }

    .actions {
      width: min-content;

      > * {
        white-space: nowrap;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
