<template>
  <Teleport to="body">
    <Transition
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
      @after-leave="() => emit('closed')"
    >
      <component
        v-if="open"
        ref="dialog"
        :is="tag"
        :class="classes"
        tabindex="-1"
        @cancel.stop.prevent="open = false"
        @click="onDialogClick"
      >
        <h1 v-if="title">{{ title }}</h1>
        <button
          class="close"
          :title="`Close ${title || 'Dialog'}`"
          @pointerdown="open = false"
          @click="open = false"
        >
          <Icon type="close" />
        </button>

        <section>
          <slot />
        </section>

        <footer v-if="$slots.footer">
          <slot name="footer" />
        </footer>
      </component>
    </Transition>

    <div
      v-if="compat && open"
      class="overlay"
      @click="onClickOutside"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
const dialog = ref<HTMLDialogElement | null>(null)
const props = withDefaults(
  defineProps<{
    title?: string
    class?: string | string[] | Record<string, boolean>
    clickOutside?: boolean
    compat?: boolean
    large?: boolean
  }>(),
  {
    clickOutside: true,
  },
)
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
    ;(el as HTMLDialogElement).showModal()
  }
  // Focus the dialog itself to prevent the close button from gaining focus
  ;(el as HTMLElement).focus()
  done()
}

const onLeave = (el: Element, done: () => void) => {
  if (props.compat) {
    done()
    return
  }

  el.addEventListener(
    'transitionend',
    (e) => {
      if ((e as TransitionEvent).propertyName === 'opacity') done()
    },
    { once: true },
  )
  ;(el as HTMLDialogElement).close()
}

const onDialogClick = (e: MouseEvent) => {
  if (props.compat || e.target !== dialog.value) return
  onClickOutside()
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
    max-inline-size: min(
      var(--dialog-width, 32rem),
      calc(100vw - var(--spacer) * 2)
    );
    inline-size: 100%;
    background: var(--background);
    color: var(--color);
    border: var(--border);
    border-radius: var(--border-radius);
    padding: 0;
    max-block-size: 80dvh;
    container-type: inline-size;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;

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

    &.compat {
      position: fixed;
      transform: translate(-50%, -50%);

      &.open {
        inset-block-start: 50%;
        inset-inline-start: 50%;
        z-index: var(--z-index-dialog);

        + .overlay {
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

    > h1:first-child,
    > .close {
      display: flex;
      align-items: center;
      block-size: calc(var(--spacer) * 2);
      box-shadow: var(--border-shadow);
      padding-inline-start: var(--spacer);
      font-family: var(--font-family);
      font-size: var(--ui-font-size);
      text-transform: var(--ui-text-transform);
      margin: 0;
    }

    > h1:first-child {
      padding-right: calc(var(--spacer) * 3);
    }

    > .close {
      position: absolute;
      top: 0;
      right: 0;
      inline-size: calc(var(--spacer) * 2);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &:is(:hover, :active, :focus, .active) {
        outline: none;
      }
    }

    > section {
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: var(--spacer);
    }

    > footer {
      display: flex;
      gap: var(--spacer);
      justify-content: flex-end;
      padding: var(--spacer);
      border-block-start: var(--border);
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
