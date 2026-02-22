<template>
  <slot :display="display" :is-current="isCurrent">
    <span>{{ display }}</span>
  </slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Address } from 'viem'
import { useConnection } from '@wagmi/vue'
import { useEns } from '../composables/ens'
import { shortAddress } from '../utils/addresses'

const props = defineProps<{
  address?: Address
  mode?: 'indexer' | 'chain'
}>()
const address = computed(() => props.address)

const { address: currentAddress } = useConnection()

const isCurrent = computed<boolean>(
  () => currentAddress.value?.toLowerCase() === address.value?.toLowerCase(),
)

const { data: profile } = useEns(address, { mode: computed(() => props.mode) })

const display = computed<string>(() => profile.value?.ens || shortAddress(address.value!))
</script>
