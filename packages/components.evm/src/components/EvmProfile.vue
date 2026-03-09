<template>
  <Button
    @click="dialogOpen = true"
    :class="className"
  >
    <slot
      :address="address"
      :display="display"
      :ens-name="ensName"
      :ens-avatar="ensAvatar"
    >
      {{ display }}
    </slot>
  </Button>

  <Dialog
    v-model:open="dialogOpen"
    class="evm-profile"
    title="Account"
    compat
  >
    <div class="profile-header">
      <div
        class="banner"
        :style="
          ensHeader ? { backgroundImage: `url(${ensHeader})` } : undefined
        "
      />
      <div class="avatar-wrapper">
        <EvmAvatar
          :address="address"
          large
        />
      </div>
    </div>

    <div class="profile-identity">
      <strong v-if="ensName">{{ ensName }}</strong>
      <Button
        class="link muted small"
        @click="copyAddress"
      >
        <span>{{ shortAddr }}</span>
        <Icon :type="copied ? 'check' : 'copy'" />
      </Button>
    </div>

    <div class="profile-actions">
      <slot name="actions" />

      <EvmSwitchNetwork class-name="block">
        <template #default="{ currentChain }">
          <Icon type="wallet" />
          <span>Switch Network ({{ currentChain?.name || 'Unknown' }})</span>
        </template>
      </EvmSwitchNetwork>

      <Button
        v-if="ensName"
        class="block"
        :to="`https://app.ens.domains/${ensName}`"
        target="_blank"
      >
        <Icon type="link" />
        <span>Manage ENS</span>
      </Button>

      <Button
        class="block danger"
        @click="disconnect"
      >
        <span>Disconnect</span>
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useConnection, useDisconnect } from '@wagmi/vue'
import { useClipboard } from '@vueuse/core'
import { useConfirm, Button, Dialog, Icon } from '@1001-digital/components'
import { useEnsProfile } from '../composables/ens'
import { useResolvedUrl } from '../composables/uri'
import { shortAddress } from '../utils/addresses'
import EvmAvatar from './EvmAvatar.vue'
import EvmSwitchNetwork from './EvmSwitchNetwork.vue'
import type { EvmProfileProps, EvmProfileEmits } from '../types'

defineProps<EvmProfileProps>()

const emit = defineEmits<EvmProfileEmits>()

const { address } = useConnection()
const { mutate: disconnectWallet } = useDisconnect()
const { confirm } = useConfirm()
const { data: ensData } = useEnsProfile(address)

const { copy, copied } = useClipboard()

const ensName = computed(() => ensData.value?.ens || null)
const ensAvatar = useResolvedUrl(() => ensData.value?.data?.avatar)
const ensHeader = useResolvedUrl(() => ensData.value?.data?.header)

const shortAddr = computed(() =>
  address.value ? shortAddress(address.value) : '',
)

const display = computed(() => ensName.value || shortAddr.value)

const dialogOpen = ref(false)

const copyAddress = () => {
  if (address.value) copy(address.value)
}

const disconnect = async () => {
  const confirmed = await confirm({
    title: 'Disconnect Wallet',
    description: 'Are you sure you want to disconnect your wallet?',
    okText: 'Disconnect',
  })

  if (!confirmed) return

  dialogOpen.value = false
  await nextTick()
  disconnectWallet()
  emit('disconnected')
}
</script>

<style scoped>
.profile-header {
  position: relative;
  margin: calc(var(--spacer) * -3) calc(var(--spacer) * -1) 0;
  margin-bottom: 0;
  z-index: -1;

  .banner {
    aspect-ratio: 3 / 1;
    width: 100%;
    height: auto;
    background-color: var(--gray-z-1);
    background-size: cover;
    background-position: center;
    border-bottom: var(--border);
  }

  .avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-top: -10%;
    position: relative;
    z-index: 1;
  }

  :deep(.evm-avatar) {
    border: 3px solid var(--background);
  }
}

.profile-identity {
  display: grid;
  justify-items: center;
  gap: var(--spacer-sm);

  > strong {
    font-size: var(--font-lg);
  }
}

.profile-actions {
  display: grid;
  gap: var(--spacer);
  padding-block-start: var(--spacer);

}
</style>
