<template>
  <FormItem>
    <template
      v-if="$slots.prefix"
      #prefix
    >
      <slot name="prefix" />
    </template>
    <input
      :value="amount"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      spellcheck="false"
      :placeholder="placeholder"
      v-bind="$attrs"
      @input="onInput"
    />
    <template
      v-if="$slots.suffix || symbol || balance != null"
      #suffix
    >
      <slot name="suffix">
        <button
          v-if="balance != null"
          type="button"
          class="unstyled max"
          @click="onMax"
        >
          max
        </button>
        <span v-if="symbol">{{ symbol }}</span>
      </slot>
    </template>
  </FormItem>
</template>

<script setup lang="ts">
import { getCurrentInstance, watch } from 'vue'
import { formatUnits } from 'viem'
import { FormItem } from '@1001-digital/components'
import {
  normalizeAmountInput,
  useAmountInput,
} from '../composables/amountInput'
import type { EvmAmountInputProps, EvmAmountInputEmits } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EvmAmountInputProps>(), {
  decimals: 18,
  placeholder: '0.0',
})

const emit = defineEmits<EvmAmountInputEmits>()

const model = defineModel<string>({ default: '' })
const unitsModel = defineModel<bigint | null>('units', { default: null })

const { amount, units } = useAmountInput(model.value, () => props.decimals)

watch(
  model,
  (value) => {
    const normalized = normalizeAmountInput(value)
    if (amount.value !== normalized) {
      amount.value = normalized
    }
  },
  { immediate: true },
)

watch(
  amount,
  (value) => {
    if (model.value !== value) {
      model.value = value
    }
  },
  { immediate: true },
)

watch(
  units,
  (value) => {
    if (unitsModel.value !== value) {
      unitsModel.value = value
    }
  },
  { immediate: true },
)

// Normalization can collapse keystrokes into the same stored value (e.g.
// stripping a letter), which leaves the DOM input out of sync since the
// computed never changes — write the normalized value back explicitly.
function onInput(event: Event) {
  const element = event.target as HTMLInputElement
  amount.value = element.value
  if (element.value !== amount.value) {
    element.value = amount.value
  }
}

// A `max` listener owns the behavior (e.g. leaving gas headroom on native
// tokens); without one, default to writing the full balance into the input.
const instance = getCurrentInstance()

function onMax() {
  if (props.balance == null) return
  emit('max', props.balance)
  if (!instance?.vnode.props?.onMax) {
    amount.value = formatUnits(props.balance, props.decimals)
  }
}
</script>

<style scoped>
@layer components {
  .max {
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    font-size: var(--small-font-size);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    transition: color var(--speed);

    &:hover,
    &:focus-visible {
      color: var(--color);
    }

    &:not(:last-child) {
      margin-inline-end: var(--size-2);
    }
  }
}
</style>
