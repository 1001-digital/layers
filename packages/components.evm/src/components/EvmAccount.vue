<template>
  <slot
    :display="display"
    :ens="ens"
    :is-current="isCurrent"
  >
    <span>{{ display }}</span>
  </slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'
import { useEns } from '../composables/ens'
import { shortAddress } from '../utils/addresses'
import type { EvmAccountProps } from '../types'

const props = defineProps<EvmAccountProps>()
const address = computed(() => props.address)

const { address: currentAddress } = useConnection()

const isCurrent = computed<boolean>(
  () => currentAddress.value?.toLowerCase() === address.value?.toLowerCase(),
)

const ensIdentifier = computed(() => props.resolveEns ? props.address : undefined)
const { data: ensData } = useEns(ensIdentifier)
const ens = computed(() => ensData.value?.ens ?? undefined)

const display = computed<string>(() => ens.value || shortAddress(address.value!))
</script>
