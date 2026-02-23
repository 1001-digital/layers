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
  >
    <div class="profile-header">
      <div
        class="banner"
        :style="ensHeader ? { backgroundImage: `url(${ensHeader})` } : undefined"
      />
      <div class="avatar-wrapper">
        <img
          v-if="ensAvatar"
          :src="ensAvatar"
          :alt="display"
          class="avatar"
        />
        <div
          v-else
          class="avatar placeholder"
        >
          <Icon type="wallet" />
        </div>
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

    <div class="profile-network">
      <span class="label">Network</span>
      <EvmSwitchNetwork class-name="small">
        <template #default="{ currentChain }">
          <span>{{ currentChain?.name || 'Unknown' }}</span>
          <Icon type="chevron-down" />
        </template>
      </EvmSwitchNetwork>
    </div>

    <template #footer>
      <Button
        class="danger"
        @click="disconnect"
      >
        <span>Disconnect</span>
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConnection, useDisconnect } from '@wagmi/vue'
import { useClipboard } from '@vueuse/core'
import { useConfirm } from '../../base/composables/confirm'
import { useEnsProfile } from '../composables/ens'
import { useResolveUri } from '../composables/uri'
import { shortAddress } from '../utils/addresses'
import Button from '../../base/components/Button.vue'
import Dialog from '../../base/components/Dialog.vue'
import Icon from '../../base/components/Icon.vue'
import EvmSwitchNetwork from './EvmSwitchNetwork.vue'

defineProps<{
  className?: string
}>()

const emit = defineEmits<{
  disconnected: []
}>()

const { address } = useConnection()
const { mutate: disconnectWallet } = useDisconnect()
const { confirm } = useConfirm()
const { data: ensData } = useEnsProfile(address)

const { copy, copied } = useClipboard()
const resolve = useResolveUri()

const ensName = computed(() => ensData.value?.ens || null)
const ensAvatar = computed(() => resolve(ensData.value?.data?.avatar))
const ensHeader = computed(() => resolve(ensData.value?.data?.header))

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

  disconnectWallet()
  dialogOpen.value = false
  emit('disconnected')
}
</script>

<style scoped>
.profile-header {
  position: relative;
  margin: calc(var(--spacer) * -1);
  margin-bottom: 0;

  .banner {
    height: var(--size-7);
    background: var(--gray-z-2);
    background-size: cover;
    background-position: center;
  }

  .avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-top: calc(var(--size-6) * -0.5);
    position: relative;
    z-index: 1;
  }

  .avatar {
    width: var(--size-6);
    height: var(--size-6);
    border-radius: 50%;
    border: 3px solid var(--background);
    object-fit: cover;

    &.placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-z-3);
      font-size: var(--size-4);
    }
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

.profile-network {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacer-sm) 0;
  border-top: var(--border);

  .label {
    font-size: var(--ui-font-size);
    text-transform: var(--ui-text-transform);
    color: var(--muted);
  }
}
</style>
