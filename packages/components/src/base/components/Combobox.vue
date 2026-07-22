<template>
  <ComboboxRoot
    v-model="model"
    v-model:open="open"
    class="combobox-root"
    :multiple="multiple"
    :disabled="disabled"
    :name="name"
    :reset-search-term-on-blur="resetSearchTermOnBlur"
    :reset-search-term-on-select="resetSearchTermOnSelect"
  >
    <ComboboxAnchor class="combobox-anchor">
      <ComboboxInput
        class="combobox-input"
        :placeholder="placeholder"
        :display-value="resolveDisplayValue"
        :aria-label="ariaLabel"
        :disabled="disabled"
        @focus="open = true"
      />
      <ComboboxTrigger class="combobox-trigger">
        <Icon name="chevron-down" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="teleportTarget ? { to: teleportTarget } : {}">
      <ComboboxContent
        position="popper"
        :side-offset="4"
        class="combobox-content"
      >
        <ComboboxViewport class="combobox-viewport">
          <ComboboxEmpty class="combobox-empty">
            {{ emptyText }}
          </ComboboxEmpty>
          <ComboboxItem
            v-for="option in options"
            :key="option[valueKey]"
            :value="option[valueKey]"
            class="combobox-item"
          >
            {{ option[labelKey] }}
            <ComboboxItemIndicator class="combobox-indicator">
              <Icon name="check" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import Icon from './Icon.vue'

const teleportTarget = inject<HTMLElement | null>('teleport-target', null)

const model = defineModel<string | string[]>()
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    options?: Record<string, any>[]
    placeholder?: string
    multiple?: boolean
    disabled?: boolean
    valueKey?: string
    labelKey?: string
    name?: string
    emptyText?: string
    resetSearchTermOnBlur?: boolean
    resetSearchTermOnSelect?: boolean
    /** Accessible name for the input — placeholders alone are unreliable */
    ariaLabel?: string
  }>(),
  {
    options: () => [],
    placeholder: 'Search...',
    valueKey: 'value',
    labelKey: 'label',
    emptyText: 'No results found.',
    resetSearchTermOnBlur: true,
    resetSearchTermOnSelect: true,
  },
)

const resolveLabel = (v: any) => {
  if (v == null) return ''
  const option = props.options.find((o) => o[props.valueKey] === v)
  return option ? String(option[props.labelKey]) : String(v)
}

const resolveDisplayValue = (val: any) => {
  if (val == null) return ''
  if (Array.isArray(val) && val.length === 0) return ''
  if (Array.isArray(val)) return val.map(resolveLabel).join(', ')
  return resolveLabel(val)
}
</script>

<style scoped>
/* &:has(> .combobox-root) { */
/* } */

@layer components {
  :global(.form-item:has(> .combobox-root)) {
    inline-size: max-content !important;
    max-inline-size: none;
  }

  .combobox-root {
    inline-size: 100%;
  }
  .combobox-anchor {
    display: flex;
    align-items: center;
    gap: var(--size-1);
    background: var(--combobox-background);
    border-radius: var(--combobox-border-radius);
    box-shadow: var(--border-shadow);
    padding-inline-end: var(--size-2);
    transition: box-shadow var(--speed);

    &:focus-within {
      box-shadow: var(--border-shadow-highlight);
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .combobox-input {
    all: unset;
    flex: 1;
    height: 32px;
    padding-inline: var(--size-3);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    line-height: var(--ui-line-height);
    color: var(--color);
    min-inline-size: 0;

    &::placeholder {
      color: var(--muted);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .combobox-trigger {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    cursor: pointer;
    transition: transform var(--speed);

    [data-state='open'] > & {
      transform: rotate(180deg);
    }

    &[data-disabled] {
      cursor: not-allowed;
    }
  }

  :deep(.combobox-content) {
    background: var(--combobox-background);
    border: var(--combobox-border);
    border-radius: var(--combobox-border-radius);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-index-dropdown);
    min-inline-size: var(--reka-combobox-trigger-width);
    max-block-size: var(--reka-combobox-content-available-height);
    overflow: hidden;

    /* Entry/exit animations */
    opacity: 1;
    scale: 1;
    transition:
      opacity var(--speed) ease,
      scale var(--speed) ease;

    @starting-style {
      opacity: 0;
      scale: 0.95;
    }

    &[data-state='closed'] {
      opacity: 0;
      scale: 0.95;
    }

    &:focus {
      outline: none;
    }
  }

  :deep(.combobox-viewport) {
    padding: var(--combobox-padding);
  }

  :deep(.combobox-empty) {
    padding: var(--size-2) var(--size-3);
    color: var(--muted);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    user-select: none;
  }

  :deep(.combobox-item) {
    padding: var(--size-2) var(--size-3);
    border-radius: calc(var(--combobox-border-radius) / 2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2);
    cursor: pointer;
    outline: none;
    user-select: none;
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);

    &[data-highlighted] {
      background: var(
        --combobox-item-highlight,
        var(--button-background-highlight)
      );
    }

    &[data-state='checked'] {
      font-weight: 500;
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  :deep(.combobox-indicator) {
    color: var(--accent);
  }
}
</style>
