<template>
  <EvmAmountInput
    v-model="model"
    v-model:units="weiModel"
    :symbol="suffix"
    :placeholder="placeholder"
    :balance="balance"
  >
    <template
      v-if="$slots.prefix"
      #prefix
    >
      <slot name="prefix" />
    </template>
    <template
      v-if="$slots.suffix"
      #suffix
    >
      <slot name="suffix" />
    </template>
  </EvmAmountInput>
</template>

<script setup lang="ts">
import EvmAmountInput from './EvmAmountInput.vue'
import type { EvmEthInputProps } from '../types'

withDefaults(defineProps<EvmEthInputProps>(), {
  placeholder: '0.5',
  suffix: 'ETH',
})

const model = defineModel<string>({ default: '' })
const weiModel = defineModel<bigint | null>('wei', { default: null })
</script>
