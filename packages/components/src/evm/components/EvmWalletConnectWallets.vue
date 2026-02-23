<template>
  <div class="wc-wallets">
    <div class="wallet-options">
      <Button
        v-for="wallet in WALLETS"
        :key="wallet.name"
        :to="walletHref(wallet)"
        target="_blank"
        class="wallet-item"
      >
        <img
          :src="`${base}icons/wallets/${wallet.icon}`"
          :alt="wallet.name"
        />
        <span>{{ wallet.name }}</span>
      </Button>
    </div>

    <EvmConnectorQR :uri="uri">
      <template #instruction>
        Or scan with any wallet app
      </template>
    </EvmConnectorQR>
  </div>
</template>

<script setup lang="ts">
import Button from '../../base/components/Button.vue'
import EvmConnectorQR from './EvmConnectorQR.vue'
import { useBaseURL } from '../composables/base'

const props = defineProps<{
  uri: string
}>()

const base = useBaseURL()

const WALLETS = [
  { name: 'Trust Wallet', icon: 'trust.svg', link: 'https://link.trustwallet.com/wc' },
  { name: 'Rainbow', icon: 'rainbow.svg', link: 'https://rnbwapp.com/wc' },
  { name: 'Zerion', icon: 'zerion.svg', link: 'https://app.zerion.io/wc' },
]

const walletHref = (wallet: typeof WALLETS[number]) =>
  `${wallet.link}?uri=${encodeURIComponent(props.uri)}`
</script>

<style scoped>
.wc-wallets {
  display: grid;
  gap: var(--spacer);
}

.wallet-options {
  display: grid;
  gap: var(--spacer);

  .wallet-item {
    width: 100%;
    inline-size: auto;
    justify-content: flex-start;

    img {
      margin: -1rem 0 -1rem -0.6rem;
      width: var(--size-5);
      height: var(--size-5);
      border-radius: var(--border-radius);
    }

    span:last-child {
      border-left: var(--border);
      padding-left: var(--spacer-sm);
    }
  }
}
</style>
