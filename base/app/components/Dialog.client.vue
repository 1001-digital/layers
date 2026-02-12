<template>
  <Teleport to="body">
    <Transition :css="false" @enter="onEnter" @leave="onLeave" @after-leave="() => emit('closed')">
      <component v-if="open" ref="dialog" :is="tag" :class="classes"
        @cancel.stop.prevent="open = false">
        <button v-if="xClose" class="close unstyled" :title="`Close ${title || 'Dialog'}`" @pointerdown="open = false"
          @click="open = false">
          <Icon type="close" />
        </button>

        <h1 v-if="title">{{ title }}</h1>

        <slot />
      </component>
    </Transition>

    <div v-if="compat && open" class="overlay" @click="() => onClickOutside()"></div>
  </Teleport>
</template>

<script setup lang="ts">
const dialog = ref<HTMLDialogElement | null>(null)
const props = withDefaults(defineProps<{
  title?: string
  class?: string | string[] | Record<string, boolean>
  xClose?: boolean
  clickOutside?: boolean
  compat?: boolean
  large?: boolean
}>(), {
  xClose: true,
  clickOutside: true,
})
const emit = defineEmits<{
  closed: []
}>()
const open = defineModel<boolean>('open', { required: true })
const tag = computed(() => (props.compat ? 'article' : 'dialog'))
const classes = computed(() => {
  let obj: Record<string, boolean> = {
    dialog: true,
    compat: !!props.compat,
    large: !!props.large,
  }

  // Apply passed classes
  if (typeof props.class === 'string') {
    obj[props.class] = true
  } else if (Array.isArray(props.class)) {
    props.class.forEach((c) => {
      obj[c] = true
    })
  } else if (typeof props.class === 'object') {
    obj = { ...obj, ...props.class }
  }

  if (props.compat && open.value) {
    obj.open = true
  }

  return obj
})

const onEnter = (el: Element, done: () => void) => {
  if (!props.compat) {
    (el as HTMLDialogElement).showModal()
  }
  done()
}

const onLeave = (el: Element, done: () => void) => {
  if (props.compat) {
    done()
    return
  }

  el.addEventListener('transitionend', (e) => {
    if ((e as TransitionEvent).propertyName === 'opacity') done()
  }, { once: true })

  ;(el as HTMLDialogElement).close()
}

const onClickOutside = () => {
  if (props.clickOutside) {
    open.value = false
  }
}
</script>

<style>
@layer variables {
  :root {
    --backdrop-background-color: transparent;
  }
}

@layer components {
  .dialog {
    padding: var(--spacer);
    padding-block-start: calc(var(--spacer) * 3);
    max-inline-size: min(var(--dialog-width, 32rem), calc(100vw - var(--spacer) * 2));
    inline-size: 100%;
    background: var(--background);
    color: var(--color);
    border: var(--border);
    border-radius: var(--border-radius);
    overscroll-behavior: contain;
    block-size: 0;
    min-block-size: min-content;
    max-block-size: 100dvh;
    container-type: inline-size;
    display: grid;
    gap: var(--spacer);

    /* Entry/exit animations */
    opacity: 1;
    transform: scale(1);
    transition:
      opacity var(--speed) ease,
      transform var(--speed) ease,
      overlay var(--speed) ease allow-discrete,
      display var(--speed) ease allow-discrete;

    @starting-style {
      opacity: 0;
      transform: scale(0.95);
    }

    /* Exit animation */
    &:not([open]):not(:popover-open) {
      opacity: 0;
      transform: scale(0.95);
    }

    &::backdrop {
      background-color: var(--backdrop-background-color);
      backdrop-filter: var(--blur);
      transition:
        background-color var(--speed) ease,
        backdrop-filter var(--speed) ease,
        overlay var(--speed) ease allow-discrete,
        display var(--speed) ease allow-discrete;

      @starting-style {
        background-color: transparent;
      }
    }

    @media (--md) {
      max-block-size: calc(100dvh - var(--spacer) * 2);
    }

    &.compat {
      position: fixed;
      transform: translate(-50%, -50%);

      &.open {
        inset-block-start: 50%;
        inset-inline-start: 50%;
        z-index: var(--z-index-dialog);

        +.overlay {
          position: fixed;
          inset: 0;
          z-index: var(--z-index-overlay);
          background: var(--backdrop-background-color);
        }
      }
    }

    &:focus {
      outline: none;
    }

    >.close {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      block-size: calc(var(--spacer) * 2);
      inline-size: calc(var(--spacer) * 2);
      border-inline-start: var(--border);
      border-block-end: var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      z-index: 10;
      background: var(--background);

      &:is(:hover, :active, :focus, .active) {
        outline: none;
      }
    }

    >h1:first-of-type {
      inline-size: 100%;
      border-block-end: var(--border);
      block-size: calc(var(--spacer) * 2);
      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;
      padding: 0 0 0 var(--spacer);
      display: flex;
      align-items: center;
      margin: 0;
      font-family: var(--font-family);
      font-size: var(--ui-font-size);
      text-transform: var(--ui-text-transform);
      background: var(--background);
    }

    >.actions {
      margin-block-start: var(--spacer);
      display: flex;
      gap: var(--spacer);
      justify-content: flex-end;
    }

    &.large {
      --dialog-width: min(90vw, 64rem);
    }
  }

  html:has(dialog[open]),
  body:has(dialog[open]),
  html:has(.dialog.open),
  body:has(.dialog.open) {
    overflow: hidden;
  }
}
</style>
