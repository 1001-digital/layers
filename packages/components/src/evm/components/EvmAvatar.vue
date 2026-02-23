<template>
  <slot
    :src="src"
    :ens="ens"
    :is-current="isCurrent"
  >
    <img
      v-if="src"
      :src="src"
      :alt="ens || 'Avatar'"
      :class="['evm-avatar', { large }]"
    />
    <Opepicon
      v-else-if="address"
      :seed="address"
      :size="large ? 256 : 64"
      :class="['evm-avatar', { large }]"
    />
  </slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Address } from 'viem'
import { useConnection } from '@wagmi/vue'
import { useEnsWithAvatar } from '../composables/ens'
import { useResolveUri } from '../composables/uri'
import Opepicon from '../../base/components/Opepicon.vue'

const props = defineProps<{
  address?: Address
  large?: boolean
}>()
const address = computed(() => props.address)

const { address: currentAddress } = useConnection()

const isCurrent = computed<boolean>(
  () => currentAddress.value?.toLowerCase() === address.value?.toLowerCase(),
)

const { data: ensData } = useEnsWithAvatar(address)
const resolve = useResolveUri()

const ens = computed(() => ensData.value?.ens || null)
const src = computed(() => resolve(ensData.value?.data?.avatar))
</script>

<style scoped>
.evm-avatar {
  width: var(--size-5);
  height: var(--size-5);
  border-radius: 50%;
  background-color: var(--background);
  object-fit: cover;

  &.large {
    width: var(--size-9);
    height: var(--size-9);
  }
}
</style>
