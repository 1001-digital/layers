<template>
  <Teleport to="body">
    <component ref="dialog" :is="tag" :class="classes" @cancel.stop.prevent="open = false">
      <button v-if="xClose" class="close unstyled" :title="`Close ${title || 'Dialog'}`" @touchdown="open = false"
        @click="open = false">
        <Icon type="close" />
      </button>

      <slot />
    </component>

    <div v-if="compat" class="overlay" @click="() => onClickOutside()"></div>
  </Teleport>
</template>

<script setup>
const dialog = ref(null)
const props = defineProps({
  title: String,
  class: String,
  xClose: Boolean,
  clickOutside: {
    type: Boolean,
    default: true,
  },
  compat: Boolean,
})
const emit = defineEmits(['closed'])
const open = defineModel('open', { required: true })
const debouncedOpen = ref(open.value)
const tag = computed(() => (props.compat ? 'article' : 'dialog'))
const classes = computed(() => {
  let obj = {
    dialog: true,
    compat: props.compat,
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

  // Apply open state class
  if (props.compat && debouncedOpen.value) {
    obj.open = true
  }

  return obj
})

const show = () => {
  if (props.compat) {
    debouncedOpen.value = true
  } else {
    dialog.value?.showModal()
  }
}

const hide = () => {
  if (props.compat) {
    debouncedOpen.value = false
  } else {
    dialog.value?.close()
  }
  emit('closed')
}

const onClickOutside = () => {
  if (props.clickOutside) {
    open.value = false
  }
}

// Keep track of the open/hide state
watchEffect(() => (open.value ? show() : hide()))
</script>

<style>
.dialog {
  padding: calc(var(--spacer) * 2);
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

  &::backdrop {
    background-color: var(--backdrop-background-color);
    transition:
      background-color var(--speed) ease,
      overlay var(--speed) ease allow-discrete,
      display var(--speed) ease allow-discrete;

    @starting-style {
      background-color: transparent;
    }
  }

  /* Exit animation */
  &:not([open]),
  &:not(:popover-open) {
    opacity: 0;
    transform: scale(0.95);
  }

  @media (--md) {
    max-block-size: calc(100dvh - var(--spacer) * 2);
  }

  &.modal {
    padding: var(--spacer-lg);
    display: grid;
    gap: var(--spacer);

    &:has(> h1:first-of-type) {
      padding: var(--spacer);
      padding-block-start: calc(var(--spacer) * 3);
      font-size: var(--ui-font-size);
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

  > .close {
    position: absolute;
    inset-block-start: var(--spacer);
    inset-inline-end: var(--spacer);
    inline-size: var(--spacer);
    block-size: var(--spacer);
    padding: 0;
    z-index: 10;

    &:is(:hover, :active, :focus, .active) {
      outline: none;
    }
  }

  &.modal > .close {
    inset-block-start: 0;
    inset-inline-end: 0;
    block-size: calc(var(--spacer) * 2);
    inline-size: calc(var(--spacer) * 2);
    border-inline-start: var(--border);
    border-block-end: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);
  }

  > h1 {
    padding-inline-end: var(--size-6);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    text-transform: var(--ui-text-transform);
    margin-block-end: var(--size-3);
  }

  &.modal > h1:first-of-type {
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
    font-size: var(--ui-font-size);
    background: var(--background);
  }

  > .actions {
    margin-block-start: var(--spacer);
    display: flex;
    gap: var(--spacer);
    justify-content: flex-end;
  }

  &.modal .modal-footer {
    margin: var(--spacer) calc(var(--spacer) * -1) calc(var(--spacer) * -1);
    padding: var(--spacer);
    justify-content: flex-end;
    border-block-start: var(--border);
  }
}

html:has(dialog[open]),
body:has(dialog[open]),
html:has(.dialog.open),
body:has(.dialog.open) {
  overflow: hidden;
}
</style>
