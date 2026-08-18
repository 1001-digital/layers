<template>
  <SelectRoot
    v-model="model"
    :multiple="multiple"
    :disabled="disabled"
    :name="name"
  >
    <SelectTrigger class="form-select-trigger">
      <SelectValue :placeholder="placeholder" />
      <SelectIcon class="form-select-icon">
        <Icon name="chevron-down" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal v-bind="teleportTarget ? { to: teleportTarget } : {}">
      <SelectContent
        position="popper"
        :side-offset="4"
        class="form-select-content"
      >
        <SelectViewport class="form-select-viewport">
          <SelectItem
            v-for="option in options"
            :key="getOptionValue(option)"
            :value="getOptionValue(option)"
            class="form-select-item"
          >
            <SelectItemText>{{ getOptionLabel(option) }}</SelectItemText>
            <SelectItemIndicator class="form-select-indicator">
              <Icon name="check" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import { inject } from 'vue'
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
import Icon from './Icon.vue'

const teleportTarget = inject<HTMLElement | null>('teleport-target', null)

const model = defineModel<string | string[]>()
type Option = Record<string, unknown>

const props = withDefaults(
  defineProps<{
    options?: Option[]
    placeholder?: string
    multiple?: boolean
    disabled?: boolean
    valueKey?: string
    labelKey?: string
    name?: string
  }>(),
  {
    options: () => [],
    placeholder: 'Select...',
    valueKey: 'value',
    labelKey: 'label',
  },
)

const getOptionValue = (option: Option) => option[props.valueKey] as string
const getOptionLabel = (option: Option) => String(option[props.labelKey] ?? '')
</script>

<style scoped>
.form-select-trigger {
  background: var(--background);
  color: var(--color);
  inline-size: 100%;
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
