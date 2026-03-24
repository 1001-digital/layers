<template>
  <div class="evm-address-input">
    <FormItem>
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
      <input
        v-model="model"
        type="text"
        :placeholder="placeholder"
        v-bind="$attrs"
      />
      <template
        v-if="$slots.suffix || pending"
        #suffix
      >
        <slot name="suffix">
          <span
            v-if="pending"
            class="spinner"
          />
        </slot>
      </template>
    </FormItem>
    <small v-if="display">
      <CopyText
        :value="resolvedValue"
        :text="display"
      />
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { refDebounced } from '@vueuse/core'
import { isAddress, type Address } from 'viem'
import { CopyText, FormItem } from '@1001-digital/components'
import { useEns } from '../composables/ens'
import { shortAddress } from '../utils/addresses'
import type { EvmAddressInputProps } from '../types'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<EvmAddressInputProps>(), {
  placeholder: 'Address or ENS name',
})

const model = defineModel<string>({ default: '' })
const debounced = refDebounced(model, 400)

const isAddr = computed(() => isAddress(debounced.value?.trim() ?? ''))

const identifier = computed(() => {
  const val = debounced.value?.trim()
  if (!val) return undefined
  if (isAddr.value || val.includes('.')) return val
  return undefined
})

const { data: ensData, pending } = useEns(identifier)

const resolvedValue = computed(() => {
  if (!identifier.value || pending.value || !ensData.value) return ''
  if (isAddr.value) return ensData.value.ens || ''
  return ensData.value.address || ''
})

const display = computed(() => {
  const val = resolvedValue.value
  if (!val) return ''
  if (isAddress(val)) return val as Address
  return val
})
</script>

<style scoped>
@layer components {
  .evm-address-input {
    display: grid;
    gap: var(--size-1);

    > small {
      color: var(--muted);
      font-family: var(--ui-font-family);
      font-size: var(--small-font-size);
      padding-inline-start: var(--ui-padding-inline);
      text-transform: none;
    }

    .spinner {
      width: var(--size-3);
      height: var(--size-3);
      border: 2px solid var(--muted);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin var(--speed-slow, 1s) linear infinite;
    }
  }
}
</style>
