<template>
  <AutocompleteRoot
    v-model="model"
    v-model:open="open"
    class="autocomplete-root"
    :disabled="disabled"
    :name="name"
    :reset-search-term-on-blur="resetSearchTermOnBlur"
    :ignore-filter="ignoreFilter"
    open-on-focus
  >
    <AutocompleteAnchor class="autocomplete-anchor">
      <AutocompleteInput
        class="autocomplete-input"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :disabled="disabled"
      />
      <AutocompleteTrigger class="autocomplete-trigger">
        <Icon name="chevron-down" />
      </AutocompleteTrigger>
    </AutocompleteAnchor>

    <AutocompletePortal v-bind="teleportTarget ? { to: teleportTarget } : {}">
      <AutocompleteContent
        position="popper"
        :side-offset="4"
        :hide-when-empty="hideWhenEmpty"
        class="autocomplete-content"
      >
        <AutocompleteViewport class="autocomplete-viewport">
          <AutocompleteEmpty class="autocomplete-empty">
            {{ emptyText }}
          </AutocompleteEmpty>

          <template
            v-for="(entry, i) in normalizedOptions"
            :key="`${i}-${entry.label}`"
          >
            <AutocompleteGroup
              v-if="entry.isGroup"
              class="autocomplete-group"
            >
              <AutocompleteLabel
                v-if="entry.label"
                class="autocomplete-label"
              >
                {{ entry.label }}
              </AutocompleteLabel>
              <AutocompleteItem
                v-for="opt in entry.options"
                :key="opt.label"
                :value="opt.value ?? opt.label"
                :text-value="opt.textValue ?? opt.label"
                :disabled="opt.disabled"
                class="autocomplete-item"
              >
                {{ opt.label }}
              </AutocompleteItem>
            </AutocompleteGroup>

            <AutocompleteItem
              v-else
              :value="entry.value ?? entry.label"
              :text-value="entry.textValue ?? entry.label"
              :disabled="entry.disabled"
              class="autocomplete-item"
            >
              {{ entry.label }}
            </AutocompleteItem>
          </template>
        </AutocompleteViewport>
      </AutocompleteContent>
    </AutocompletePortal>
  </AutocompleteRoot>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  AutocompleteAnchor,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompletePortal,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteViewport,
} from 'reka-ui'
import Icon from './Icon.vue'

export type AutocompleteOption =
  | string
  | {
      label: string
      value?: string
      textValue?: string
      disabled?: boolean
    }

export type AutocompleteOptionGroup = {
  label: string
  options: AutocompleteOption[]
}

type NormalizedItem = {
  isGroup: false
  label: string
  value?: string
  textValue?: string
  disabled?: boolean
}

type NormalizedGroup = {
  isGroup: true
  label: string
  options: {
    label: string
    value?: string
    textValue?: string
    disabled?: boolean
  }[]
}

const teleportTarget = inject<HTMLElement | null>('teleport-target', null)

const model = defineModel<string>()
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    options?: (AutocompleteOption | AutocompleteOptionGroup)[]
    placeholder?: string
    disabled?: boolean
    name?: string
    emptyText?: string
    hideWhenEmpty?: boolean
    resetSearchTermOnBlur?: boolean
    ignoreFilter?: boolean
    /** Accessible name for the input — placeholders alone are unreliable */
    ariaLabel?: string
  }>(),
  {
    options: () => [],
    placeholder: 'Search...',
    emptyText: 'No results found.',
    hideWhenEmpty: false,
    resetSearchTermOnBlur: false,
    ignoreFilter: false,
  },
)

const normalizeItem = (opt: AutocompleteOption) =>
  typeof opt === 'string' ? { label: opt } : opt

const normalizedOptions = computed<(NormalizedItem | NormalizedGroup)[]>(() =>
  props.options.map((entry) => {
    if (
      typeof entry === 'object' &&
      entry !== null &&
      'options' in entry &&
      Array.isArray((entry as AutocompleteOptionGroup).options)
    ) {
      const group = entry as AutocompleteOptionGroup
      return {
        isGroup: true,
        label: group.label,
        options: group.options.map(normalizeItem),
      } as NormalizedGroup
    }
    return {
      isGroup: false,
      ...normalizeItem(entry as AutocompleteOption),
    } as NormalizedItem
  }),
)
</script>

<style scoped>
@layer components {
  :global(.form-item:has(> .autocomplete-root)) {
    inline-size: max-content !important;
    max-inline-size: none;
  }

  .autocomplete-root {
    inline-size: 100%;
  }
  .autocomplete-anchor {
    display: flex;
    align-items: center;
    gap: var(--size-1);
    background: var(--autocomplete-background);
    border-radius: var(--autocomplete-border-radius);
    border: var(--border);
    block-size: var(--form-item-height);
    padding-inline-end: var(--size-2);
    transition: border-color var(--speed);

    &:focus-within {
      border-color: var(--border-color-highlight);
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .autocomplete-input {
    all: unset;
    flex: 1;
    block-size: 100%;
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

  .autocomplete-trigger {
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

  :deep(.autocomplete-content) {
    background: var(--autocomplete-background);
    border: var(--autocomplete-border);
    border-radius: var(--autocomplete-border-radius);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-index-dropdown);
    inline-size: var(--reka-popper-anchor-width);
    max-block-size: var(--reka-popper-available-height);
    overflow: hidden;

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

  :deep(.autocomplete-viewport) {
    padding: var(--autocomplete-padding);
  }

  :deep(.autocomplete-empty) {
    padding: var(--size-2) var(--size-3);
    color: var(--muted);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    user-select: none;
  }

  :deep(.autocomplete-group) {
    display: flex;
    flex-direction: column;

    & + & {
      margin-block-start: var(--size-1);
    }
  }

  :deep(.autocomplete-label) {
    padding: var(--size-2) var(--size-3);
    color: var(--muted);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size-sm, var(--ui-font-size));
    user-select: none;
  }

  :deep(.autocomplete-item) {
    padding: var(--size-2) var(--size-3);
    border-radius: calc(var(--autocomplete-border-radius) / 2);
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
        --autocomplete-item-highlight,
        var(--button-background-highlight)
      );
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
