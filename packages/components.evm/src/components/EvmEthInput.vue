<template>
  <FormItem>
    <template
      v-if="$slots.prefix"
      #prefix
    >
      <slot name="prefix" />
    </template>
    <input
      v-model="amount"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      spellcheck="false"
      :placeholder="placeholder"
      v-bind="$attrs"
    />
    <template #suffix>
      <slot name="suffix">ETH</slot>
    </template>
  </FormItem>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { FormItem } from '@1001-digital/components'
import {
  normalizeEthAmountInput,
  useEthAmountInput,
} from '../composables/ethAmountInput'
import type { EvmEthInputProps } from '../types'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<EvmEthInputProps>(), {
  placeholder: '0.5',
})

const model = defineModel<string>({ default: '' })
const weiModel = defineModel<bigint | null>('wei', { default: null })

const { amount, wei } = useEthAmountInput(model.value)

watch(
  model,
  (value) => {
    const normalized = normalizeEthAmountInput(value)
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
  wei,
  (value) => {
    if (weiModel.value !== value) {
      weiModel.value = value
    }
  },
  { immediate: true },
)
</script>
