<template>
  <slot
    :display="display"
    :is-current="isCurrent"
  >
    <span>{{ display }}</span>
  </slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'
import { shortAddress } from '../utils/addresses'
import type { EvmAccountProps } from '../types'

const props = defineProps<EvmAccountProps>()
const address = computed(() => props.address)

const { address: currentAddress } = useConnection()

const isCurrent = computed<boolean>(
  () => currentAddress.value?.toLowerCase() === address.value?.toLowerCase(),
)

const display = computed<string>(() => shortAddress(address.value!))
</script>
