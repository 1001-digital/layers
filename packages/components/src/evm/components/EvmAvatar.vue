<template>
  <slot
    :src="src"
    :opepicon="opepicon"
    :ens="ens"
    :is-current="isCurrent"
  >
    <img
      v-if="src"
      :src="src"
      :alt="ens || 'Avatar'"
      class="evm-avatar"
    />
    <img
      v-else-if="opepicon"
      :src="opepicon"
      :alt="ens || 'Avatar'"
      class="evm-avatar"
    />
  </slot>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { Address } from 'viem'
import { useConnection } from '@wagmi/vue'
import { createIcon } from '@visualizevalue/opepicons'
import { useEnsWithAvatar } from '../composables/ens'
import { useResolveUri } from '../composables/uri'

const props = defineProps<{
  address?: Address
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

const opepicon = ref<string | null>(null)
watchEffect(() => {
  if (src.value || !address.value) {
    opepicon.value = null
    return
  }

  const canvas = createIcon({ seed: address.value, size: 64 })
  opepicon.value = canvas.toDataURL()
})
</script>

<style scoped>
.evm-avatar {
  width: var(--size-5);
  height: var(--size-5);
  border-radius: 50%;
  background-color: var(--background);
  object-fit: cover;
}
</style>
