<template>
  <template v-if="showInAppSetup">
    <EvmInAppWalletSetup
      v-if="inAppConnector"
      :key="inAppSetupKey"
      :initial-step="inAppWalletInitialStep"
      @connected="onInAppConnected"
      @back="onInAppBack"
    />
    <template v-else>
      <Alert type="error">In-app wallet is unavailable.</Alert>
      <Button
        class="link muted small"
        @click="onInAppBack"
      >
        <Icon name="chevron-left" />
        <span>Back</span>
      </Button>
    </template>
  </template>
  <template v-else-if="errorMessage">
    <Alert type="error">
      {{ errorMessage }}
    </Alert>
    <Button
      class="link muted small"
      @click="resetConnection"
    >
      <Icon name="chevron-left" />
      <span>Back</span>
    </Button>
  </template>
  <EvmMetaMaskQR
    v-else-if="metaMaskUri"
    :uri="metaMaskUri"
    @back="resetConnection"
  />
  <EvmWalletConnectWallets
    v-else-if="walletConnectUri"
    :uri="walletConnectUri"
    @back="resetConnection"
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
      v-for="connector in showExternalWallets ? shownConnectors : []"
      :key="connector.uid"
      @click="() => login(connector)"
      class="block choose-connector"
    >
      <img
        v-if="ICONS[connector.name] || connector.icon"
        :src="ICONS[connector.name] || connector.icon"
        :alt="connector.name"
      />
      <div
        v-else
        class="default-wallet-icon"
      >
        <Icon name="wallet" />
      </div>
      <span>{{ connector.name }}</span>
    </Button>
    <Button
      v-if="showExternalWallets && wcConnector"
      @click="loginWithSafe"
      class="block choose-connector"
    >
      <img
        :src="safeIcon"
        alt="Safe"
      />
      <span>Safe</span>
    </Button>
    <Button
      v-if="showInAppWallet && inAppConnector"
      @click="
        () => {
          emit('connecting')
          showInAppSetup = true
        }
      "
      class="block choose-connector"
    >
      <img
        :src="inAppIcon"
        alt="Seed Phrase"
      />
      <span>In App</span>
    </Button>
    <Button
      v-if="showExternalWallets"
      to="https://ethereum.org/wallets/"
      target="_blank"
      class="link muted small"
    >
      <Icon name="help" />
      <span>New to wallets?</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Connector } from '@wagmi/vue'
import {
  useConnect,
  useConnectors,
  useChainId,
  ConnectorAlreadyConnectedError,
  ConnectorNotFoundError,
  ProviderNotFoundError,
} from '@wagmi/vue'
import { UserRejectedRequestError } from 'viem'
import { Button, Icon, Alert, Loading } from '@1001-digital/components'
import EvmMetaMaskQR from './EvmMetaMaskQR.vue'
import EvmWalletConnectWallets from './EvmWalletConnectWallets.vue'
import EvmInAppWalletSetup from './EvmInAppWalletSetup.vue'
import type { EvmConnectProps, EvmConnectEmits } from '../types'

import coinbaseIcon from '../assets/wallets/coinbase.svg'
import metamaskIcon from '../assets/wallets/metamask.svg'
import phantomIcon from '../assets/wallets/phantom.svg'
import rabbyIcon from '../assets/wallets/rabby.svg'
import rainbowIcon from '../assets/wallets/rainbow.svg'
import safeIcon from '../assets/wallets/safe.png'
import inAppIcon from '../assets/wallets/in-app.svg'
import walletconnectIcon from '../assets/wallets/walletconnect.svg'

const ICONS: Record<string, string> = {
  'Base Account': coinbaseIcon,
  MetaMask: metamaskIcon,
  Phantom: phantomIcon,
  'Rabby Wallet': rabbyIcon,
  Rainbow: rainbowIcon,
  Safe: safeIcon,
  'In App': inAppIcon,
  WalletConnect: walletconnectIcon,
}

const PRIORITY: Record<string, number> = {
  WalletConnect: 20,
  'Base Account': 10,
}

const props = withDefaults(defineProps<EvmConnectProps>(), {
  connectorFilter: 'all',
  inAppWalletInitialStep: 'choose',
})
const emit = defineEmits<EvmConnectEmits>()

const chainId = useChainId()
const connectors = useConnectors()
const { mutateAsync: connectAsync } = useConnect()

const inAppConnector = computed(() =>
  connectors.value.find((c) => c.type === 'inAppWallet'),
)
const showExternalWallets = computed(() => props.connectorFilter !== 'in-app')
const showInAppWallet = computed(() => props.connectorFilter !== 'external')
const showInAppSetup = ref(props.connectorFilter === 'in-app')
const inAppSetupKey = ref(0)

const shownConnectors = computed(() => {
  const unique = Array.from(
    new Map(
      connectors.value?.map((connector) => [connector.name, connector]),
    ).values(),
  )

  const filtered =
    unique.length > 1
      ? unique.filter(
          (c) =>
            c.id !== 'injected' && c.id !== 'safe' && c.type !== 'inAppWallet',
        )
      : unique.filter((c) => c.type !== 'inAppWallet')

  return filtered.sort((a, b) => {
    const priorityA = PRIORITY[a.name] ?? 5
    const priorityB = PRIORITY[b.name] ?? 5
    return priorityA - priorityB
  })
})

const wcConnector = computed(() =>
  connectors.value.find((c) => c.id === 'walletConnect'),
)

const errorMessage = ref('')
const isConnecting = ref(false)
const connectingWallet = ref('')
const metaMaskUri = ref('')
const walletConnectUri = ref('')
const safeDeepLink = ref(false)

const loginWithSafe = () => {
  if (!wcConnector.value) return
  safeDeepLink.value = true
  login(wcConnector.value)
}

const login = async (connector: Connector) => {
  emit('connecting')
  errorMessage.value = ''
  isConnecting.value = true
  connectingWallet.value = safeDeepLink.value ? 'Safe' : connector.name
  metaMaskUri.value = ''
  walletConnectUri.value = ''

  const handleMetaMaskMessage = (event: { type: string; data?: unknown }) => {
    if (event.type === 'display_uri' && typeof event.data === 'string') {
      metaMaskUri.value = event.data
    }
  }

  const handleWcMessage = (event: { type: string; data?: unknown }) => {
    if (event.type === 'display_uri' && typeof event.data === 'string') {
      if (safeDeepLink.value) {
        window.open(
          `https://app.safe.global/wc?uri=${encodeURIComponent(event.data)}`,
          '_blank',
          'noreferrer',
        )
      } else {
        walletConnectUri.value = event.data
      }
    }
  }

  if (connector.id === 'metaMaskSDK') {
    connector.emitter.on('message', handleMetaMaskMessage)
  } else if (connector.id === 'walletConnect') {
    connector.emitter.on('message', handleWcMessage)
  }

  try {
    await connectAsync({ connector, chainId: chainId.value })

    emit('connected')

    resetConnection()
  } catch (error: unknown) {
    if (error instanceof ConnectorAlreadyConnectedError) {
      emit('connected')
      resetConnection()
      return
    }

    isConnecting.value = false
    metaMaskUri.value = ''
    walletConnectUri.value = ''
    safeDeepLink.value = false

    if (error instanceof UserRejectedRequestError) {
      errorMessage.value = 'Connection cancelled. Please try again.'
    } else if (
      error instanceof ConnectorNotFoundError ||
      error instanceof ProviderNotFoundError
    ) {
      errorMessage.value = "Wallet not found. Please make sure it's installed."
    } else {
      errorMessage.value = 'Failed to connect. Please try again.'
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

const resetConnection = () => {
  errorMessage.value = ''
  isConnecting.value = false
  connectingWallet.value = ''
  metaMaskUri.value = ''
  walletConnectUri.value = ''
  safeDeepLink.value = false
}

const onInAppConnected = () => {
  showInAppSetup.value = false
  emit('connected')
}

const onInAppBack = () => {
  if (props.connectorFilter === 'in-app') {
    emit('back')
    return
  }
  showInAppSetup.value = false
}

const reset = () => {
  resetConnection()
  inAppSetupKey.value += 1
  showInAppSetup.value = props.connectorFilter === 'in-app'
}

watch(
  () => props.connectorFilter,
  (connectorFilter) => {
    resetConnection()
    inAppSetupKey.value += 1
    showInAppSetup.value = connectorFilter === 'in-app'
  },
)

defineExpose({ reset })
</script>

<style scoped>
.wallet-options {
  display: grid;
  gap: var(--spacer);

  button.choose-connector {
    justify-content: flex-start;
    padding-inline-start: var(--ui-padding-inline);

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
}
</style>
