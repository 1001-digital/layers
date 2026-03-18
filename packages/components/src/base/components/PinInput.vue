<template>
  <PinInputRoot
    v-model="model"
    class="pin-input"
    :disabled="disabled"
    :placeholder="placeholder"
    :mask="mask"
    :otp="otp"
    :type="type"
    :name="name"
    :required="required"
    :dir="dir"
    @complete="$emit('complete', $event)"
  >
    <PinInputInput
      v-for="(_, i) in length"
      :key="i"
      :index="i"
      :disabled="disabled"
      class="pin-input-field"
    />
  </PinInputRoot>
</template>

<script setup lang="ts">
import { PinInputInput, PinInputRoot } from 'reka-ui'

const model = defineModel<string[]>()

withDefaults(
  defineProps<{
    length?: number
    disabled?: boolean
    placeholder?: string
    mask?: boolean
    otp?: boolean
    type?: 'text' | 'number'
    name?: string
    required?: boolean
    dir?: 'ltr' | 'rtl'
  }>(),
  {
    length: 4,
    placeholder: '',
    type: 'text',
  },
)

defineEmits<{
  complete: [value: string[]]
}>()
</script>

<style scoped>
@layer components {
  .pin-input {
    display: flex;
    gap: var(--pin-input-gap);
  }

  .pin-input-field {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    inline-size: var(--pin-input-size);
    block-size: var(--pin-input-size);
    border-radius: var(--pin-input-border-radius);
    box-shadow: var(--border-shadow);
    background: var(--pin-input-background);
    color: var(--pin-input-color);
    font-family: var(--ui-font-family);
    font-size: var(--pin-input-font-size);
    font-weight: var(--pin-input-font-weight);
    text-transform: var(--ui-text-transform);
    letter-spacing: var(--ui-letter-spacing);
    transition:
      box-shadow var(--speed),
      background var(--speed);

    &:is(:hover, :focus) {
      box-shadow: var(--border-shadow-highlight);
    }

    &:focus {
      background: var(--pin-input-background-focus);
      outline: none;
    }

    &::placeholder {
      color: var(--ui-placeholder-color);
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &[data-complete] {
      box-shadow: 0 0 0 var(--border-width) var(--pin-input-complete-border-color);
    }
  }
}
</style>
