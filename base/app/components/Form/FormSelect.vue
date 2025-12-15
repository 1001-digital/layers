<template>
  <SelectRoot v-model="model" :multiple="multiple" :disabled="disabled" :name="name">
    <SelectTrigger class="form-select-trigger">
      <SelectValue :placeholder="placeholder" />
      <SelectIcon class="form-select-icon">
        <Icon type="chevron-down" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent position="popper" :side-offset="4" class="form-select-content">
        <SelectViewport class="form-select-viewport">
          <SelectItem
            v-for="option in options"
            :key="option[valueKey]"
            :value="option[valueKey]"
            class="form-select-item"
          >
            <SelectItemText>{{ option[labelKey] }}</SelectItemText>
            <SelectItemIndicator class="form-select-indicator">
              <Icon type="check" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

const model = defineModel<string | string[]>()

defineProps({
  options: {
    type: Array as () => Record<string, any>[],
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select...',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
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
.form-select-trigger {
  border: none;
  background: transparent;
  padding: var(--ui-padding-block) var(--ui-padding-inline);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  color: var(--color);
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2);
  cursor: pointer;

  &[data-placeholder] {
    color: var(--muted);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.form-select-icon {
  color: var(--muted);
  transition: transform var(--speed);

  [data-state='open'] > & {
    transform: rotate(180deg);
  }
}

:global(.form-select-content) {
  background: var(--background);
  border: var(--border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-index-dropdown);
  min-width: var(--reka-select-trigger-width);
  max-height: var(--reka-select-content-available-height);
  overflow: hidden;
}

:global(.form-select-viewport) {
  padding: var(--size-1);
}

:global(.form-select-item) {
  padding: var(--size-2) var(--size-3);
  border-radius: calc(var(--border-radius) / 2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2);
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-highlighted] {
    background: var(--button-background-highlight);
  }

  &[data-state='checked'] {
    font-weight: 500;
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

:global(.form-select-indicator) {
  color: var(--accent);
}
</style>
