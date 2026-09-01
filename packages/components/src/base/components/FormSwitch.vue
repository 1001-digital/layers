<template>
  <label class="form-switch">
    <SwitchRoot
      v-model="model"
      :disabled="disabled"
      :name="name"
      :value="value"
      :required="required"
      class="form-switch-button"
    >
      <SwitchThumb class="form-switch-thumb" />
    </SwitchRoot>
    <span v-if="$slots.default"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const model = defineModel<boolean>()

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: undefined,
  },
  value: {
    type: String,
    default: 'on',
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
@layer components {
  .form-switch {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    cursor: pointer;
    user-select: none;

    &:hover .form-switch-button {
      box-shadow: 0 0 0 var(--border-width) var(--border-color-highlight);
    }
  }

  .form-switch-button {
    all: unset;
    position: relative;
    inline-size: var(--switch-width);
    block-size: var(--switch-height);
    border-radius: var(--switch-border-radius);
    background: var(--switch-background);
    box-shadow: var(--border-shadow);
    transition:
      background var(--speed),
      box-shadow var(--speed);
    flex-shrink: 0;

    &[data-state='checked'] {
      background: var(--switch-background-checked);
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }

  .form-switch-thumb {
    display: block;
    inline-size: var(--switch-thumb-size);
    block-size: var(--switch-thumb-size);
    border-radius: var(--switch-border-radius);
    background: var(--switch-thumb-background);
    transition: transform var(--speed);
    transform: translateX(var(--switch-thumb-offset));

    &[data-state='checked'] {
      transform: translateX(
        calc(
          var(--switch-width) - var(--switch-thumb-size) -
            var(--switch-thumb-offset)
        )
      );
    }
  }
}
</style>
