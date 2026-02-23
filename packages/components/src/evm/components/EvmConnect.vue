<template>
  <Button
    v-if="showConnect"
    @click="chooseModalOpen = true"
    :class="className"
  >
    <slot>Connect Wallet</slot>
  </Button>
  <slot
    v-else
    name="connected"
    :address="address"
  >
    <EvmAccount :address="address" />
  </slot>

  <Dialog
    v-if="showConnect"
    title="Connect Wallet"
    v-model:open="chooseModalOpen"
    @closed="onModalClosed"
  >
    <Alert
      v-if="errorMessage"
      type="error"
    >
      {{ errorMessage }}
    </Alert>
    <EvmMetaMaskQR
      v-else-if="metaMaskUri"
      :uri="metaMaskUri"
    />
    <EvmWalletConnectWallets
      v-else-if="walletConnectUri"
      :uri="walletConnectUri"
    />
    <template v-else-if="isConnecting">
      <Loading
        :txt="`Waiting for ${connectingWallet} confirmation...`"
        spinner
        stacked
      />
    </template>
    <div
      v-else
      class="wallet-options"
    >
      <Button
        v-for="connector in shownConnectors"
        :key="connector.uid"
        @click="() => login(connector)"
        class="choose-connector"
      >
        <img
          v-if="ICONS[connector.name]"
          :src="
            connector.icon || `${base}icons/wallets/${ICONS[connector.name]}`
          "
          :alt="connector.name"
        />
        <div
          v-else
          class="default-wallet-icon"
        >
          <Icon type="wallet" />
        </div>
        <span>{{ connector.name }}</span>
      </Button>
      <Button
        to="https://ethereum.org/wallets/"
        target="_blank"
        class="link muted small"
      >
        <Icon type="help" />
        <span>New to wallets?</span>
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Connector } from '@wagmi/vue'
import {
  useConnection,
  useConnect,
  useConnectors,
  useChainId,
} from '@wagmi/vue'
import Button from '../../base/components/Button.vue'
import Dialog from '../../base/components/Dialog.vue'
import Icon from '../../base/components/Icon.vue'
import Alert from '../../base/components/Alert.vue'
import Loading from '../../base/components/Loading.vue'
import EvmAccount from './EvmAccount.vue'
import EvmMetaMaskQR from './EvmMetaMaskQR.vue'
import EvmWalletConnectWallets from './EvmWalletConnectWallets.vue'
import { useBaseURL } from '../composables/base'

const ICONS: Record<string, string> = {
  'Base Account': 'coinbase.svg',
  MetaMask: 'metamask.svg',
  Phantom: 'phantom.svg',
  'Rabby Wallet': 'rabby.svg',
  Rainbow: 'rainbow.svg',
  WalletConnect: 'walletconnect.svg',
}

const PRIORITY: Record<string, number> = {
  WalletConnect: 20,
  'Base Account': 10,
}

defineProps<{
  className?: string
}>()
const emit = defineEmits<{
  connected: [{ address: `0x${string}` | undefined }]
  disconnected: []
}>()
const base = useBaseURL()

const chainId = useChainId()
const connectors = useConnectors()
const { mutateAsync: connectAsync } = useConnect()
const { address, isConnected } = useConnection()

const showConnect = computed(() => !isConnected.value)
const shownConnectors = computed(() => {
  const unique = Array.from(
    new Map(
      connectors.value?.map((connector) => [connector.name, connector]),
    ).values(),
  )

  const filtered =
    unique.length > 1 ? unique.filter((c) => c.id !== 'injected') : unique

  return filtered.sort((a, b) => {
    const priorityA = PRIORITY[a.name] ?? 5
    const priorityB = PRIORITY[b.name] ?? 5
    return priorityA - priorityB
  })
})

const chooseModalOpen = ref(false)
const errorMessage = ref('')
const isConnecting = ref(false)
const connectingWallet = ref('')
const metaMaskUri = ref('')
const walletConnectUri = ref('')

const login = async (connector: Connector) => {
  errorMessage.value = ''
  isConnecting.value = true
  connectingWallet.value = connector.name
  metaMaskUri.value = ''
  walletConnectUri.value = ''

  const handleMetaMaskMessage = (event: { type: string; data?: unknown }) => {
    if (event.type === 'display_uri' && typeof event.data === 'string') {
      metaMaskUri.value = event.data
    }
  }

  const handleWcMessage = (event: { type: string; data?: unknown }) => {
    if (event.type === 'display_uri' && typeof event.data === 'string') {
      walletConnectUri.value = event.data
    }
  }

  if (connector.id === 'metaMaskSDK') {
    connector.emitter.on('message', handleMetaMaskMessage)
  } else if (connector.id === 'walletConnect') {
    connector.emitter.on('message', handleWcMessage)
  }

  try {
    await connectAsync({ connector, chainId: chainId.value })

    setTimeout(() => {
      chooseModalOpen.value = false
      isConnecting.value = false
      metaMaskUri.value = ''
      walletConnectUri.value = ''
    }, 100)
  } catch (error: unknown) {
    isConnecting.value = false
    metaMaskUri.value = ''
    walletConnectUri.value = ''

    // Only show errors if our dialog is still open
    if (chooseModalOpen.value) {
      const errorMsg = error instanceof Error ? error.message : ''
      if (
        errorMsg.includes('User rejected') ||
        errorMsg.includes('rejected') ||
        errorMsg.includes('denied')
      ) {
        errorMessage.value = 'Connection cancelled. Please try again.'
      } else {
        errorMessage.value = 'Failed to connect. Please try again.'
      }
    }
    console.error('Wallet connection error:', error)
  } finally {
    if (connector.id === 'metaMaskSDK') {
      connector.emitter.off('message', handleMetaMaskMessage)
    } else if (connector.id === 'walletConnect') {
      connector.emitter.off('message', handleWcMessage)
    }
  }
}

const onModalClosed = () => {
  errorMessage.value = ''
  isConnecting.value = false
  connectingWallet.value = ''
  metaMaskUri.value = ''
  walletConnectUri.value = ''
}

const check = () =>
  isConnected.value
    ? emit('connected', { address: address.value })
    : emit('disconnected')
watch(isConnected, () => check())
onMounted(() => check())
</script>

<style scoped>
.wallet-options {
  display: grid;
  gap: var(--spacer);

  button.choose-connector {
    width: 100%;
    inline-size: auto;
    justify-content: flex-start;

    img,
    .default-wallet-icon {
      margin: -1rem 0 -1rem -0.6rem;
      width: var(--size-5);
      height: var(--size-5);
    }

    .default-wallet-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-z-2);
    }

    span:last-child {
      border-left: var(--border);
      padding-left: var(--spacer-sm);
    }
  }
}

.link.muted {
  justify-self: center;
  font-size: var(--font-xs);
}
</style>
