<template>
  <div class="wc-wallets">
    <EvmConnectorQR :uri="uri">
      <template #instruction> Scan with your wallet app </template>
    </EvmConnectorQR>

    <div class="separator">
      <span>Or choose a wallet</span>
    </div>

    <FormItem>
      <template #prefix>
        <Icon type="lucide:search" />
      </template>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search wallets"
        @input="onSearchInput"
      />
    </FormItem>

    <div
      v-if="displayedWallets.length > 0"
      class="wallet-grid"
    >
      <Button
        v-for="wallet in displayedWallets"
        :key="wallet.id"
        @click="openWallet(wallet)"
        class="wallet-card tertiary"
      >
        <img
          :src="explorer.imageUrl(wallet)"
          :alt="wallet.name"
          loading="lazy"
        />
        <span>{{ wallet.name }}</span>
      </Button>
    </div>

    <p
      v-if="
        searchQuery &&
        !explorer.searching.value &&
        displayedWallets.length === 0
      "
      class="empty-state"
    >
      No wallets found
    </p>

    <Loading
      v-if="explorer.loading.value || explorer.searching.value"
      spinner
      stacked
      txt=""
    />

    <Button
      class="link muted small"
      @click="$emit('back')"
    >
      <Icon type="chevron-left" />
      <span>Back</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Button, FormItem, Icon, Loading } from '@1001-digital/components'
import EvmConnectorQR from './EvmConnectorQR.vue'
import {
  useWalletExplorer,
  type ExplorerWallet,
} from '../composables/walletExplorer'

const props = defineProps<{
  uri: string
}>()

defineEmits<{
  back: []
}>()

const explorer = useWalletExplorer()
const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

const TOP_COUNT = 9

const displayedWallets = computed(() => {
  if (searchQuery.value) return explorer.searchResults.value

  const recents = explorer.recentWallets.value
  const recentIds = new Set(recents.map((w) => w.id))
  const rest = explorer.wallets.value
    .filter((w) => !recentIds.has(w.id))
    .slice(0, TOP_COUNT - recents.length)

  return [...recents, ...rest]
})

function openWallet(wallet: ExplorerWallet) {
  const href = explorer.walletHref(wallet, props.uri)
  if (href) {
    window.open(href, '_blank', 'noreferrer')
  }
  explorer.addRecent(wallet.id)
}

function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value) {
      explorer.search(searchQuery.value)
    }
  }, 300)
}

onBeforeUnmount(() => {
  clearTimeout(searchTimeout)
})

onMounted(() => {
  explorer.fetchNextPage()
})
</script>

<style scoped>
.wc-wallets {
  display: grid;
  gap: var(--spacer);
}

/* Separator */
.separator {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  @mixin ui-font;
  color: var(--muted);
  font-size: var(--font-sm);

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: var(--border);
  }
}

/* Wallet grid */
.wallet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: var(--spacer-sm);
}

.wallet-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-sm);
  block-size: auto;
  min-inline-size: 0;
  inline-size: 100%;

  img {
    width: var(--size-6);
    height: var(--size-6);
    border-radius: var(--border-radius);
    margin-top: var(--spacer-xs);
  }

  span {
    font-size: var(--font-xs);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}

.link.muted {
  justify-self: center;
}

/* Empty state */
.empty-state {
  text-align: center;
  @mixin ui-font;
  color: var(--muted);
}
</style>
