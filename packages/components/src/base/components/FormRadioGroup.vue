<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="disabled"
    :name="name"
    :orientation="orientation"
    class="form-radio-group"
  >
    <label
      v-for="option in options"
      :key="option[valueKey]"
      class="form-radio-item"
    >
      <RadioGroupItem
        :value="option[valueKey]"
        class="form-radio-button"
      >
        <RadioGroupIndicator class="form-radio-indicator" />
      </RadioGroupItem>
      <span>{{ option[labelKey] }}</span>
    </label>
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

const model = defineModel<string>()

defineProps({
  options: {
    type: Array as () => Record<string, any>[],
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  orientation: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'horizontal',
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  name: {
    type: String,
    default: undefined,
  },
})
</script>

<style scoped>
.form-radio-group {
  display: flex;
  gap: var(--spacer);

  &[data-orientation='vertical'] {
    flex-direction: column;
    gap: var(--spacer-sm);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.form-radio-item {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  cursor: pointer;
  user-select: none;

  &:hover .form-radio-button {
    border-color: var(--primary);
  }
}

.form-radio-button {
  all: unset;
  inline-size: var(--size-4);
  block-size: var(--size-4);
  border-radius: 50%;
  border: 2px solid var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--speed);
  flex-shrink: 0;

  &[data-state='checked'] {
    border-color: var(--primary);
  }

  &[data-disabled] {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}

.form-radio-indicator {
  inline-size: var(--size-2);
  block-size: var(--size-2);
  border-radius: 50%;
  background: var(--primary);
}
</style>
