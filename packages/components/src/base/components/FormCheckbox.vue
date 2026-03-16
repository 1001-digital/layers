<template>
  <label class="form-checkbox">
    <CheckboxRoot
      v-model="model"
      :disabled="disabled"
      :name="name"
      :value="value"
      class="form-checkbox-button"
    >
      <CheckboxIndicator class="form-checkbox-indicator">
        <Icon name="check" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="$slots.default"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import Icon from './Icon.vue'

const model = defineModel<boolean | 'indeterminate'>()

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
})
</script>

<style scoped>
.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  cursor: pointer;
  user-select: none;

  &:hover .form-checkbox-button {
    border-color: var(--primary);
  }
}

.form-checkbox-button {
  all: unset;
  inline-size: var(--size-4);
  block-size: var(--size-4);
  border-radius: calc(var(--border-radius) / 2);
  border: 2px solid var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--speed);
  flex-shrink: 0;

  &[data-state='checked'],
  &[data-state='indeterminate'] {
    border-color: var(--primary);
    background: var(--primary);
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

.form-checkbox-indicator {
  color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: var(--font-xs);
  }
}
</style>
