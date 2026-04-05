<template>
  <slot
    :src="src"
    :ens="ens"
    :is-current="isCurrent"
  >
    <Avatar
      :src="src"
      :seed="address"
      :alt="ens || 'Avatar'"
      :large="large"
      class="evm-avatar"
    />
  </slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'
import { Avatar } from '@1001-digital/components'
import { useEnsWithAvatar } from '../composables/ens'
import { useResolvedUrl } from '../composables/uri'
import type { EvmAvatarProps } from '../types'

const props = defineProps<EvmAvatarProps>()
const address = computed(() => props.address)

const { address: currentAddress } = useConnection()

const isCurrent = computed<boolean>(
  () => currentAddress.value?.toLowerCase() === address.value?.toLowerCase(),
)

const { data: ensData } = useEnsWithAvatar(address)

const ens = computed(() => ensData.value?.ens || null)
const src = useResolvedUrl(() => ensData.value?.data?.avatar)
</script>
