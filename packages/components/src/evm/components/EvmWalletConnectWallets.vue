<template>
  <div class="wc-wallets">
    <!-- All Wallets View -->
    <template v-if="view === 'all'">
      <Button @click="view = 'main'" class="link small back-btn">
        <Icon type="lucide:arrow-left" />
        <span>Back</span>
      </Button>

      <div class="search-bar">
        <Icon type="lucide:search" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search wallets"
          @input="onSearchInput"
        />
      </div>

      <div v-if="gridWallets.length > 0" class="wallet-grid">
        <button
          v-for="wallet in gridWallets"
          :key="wallet.id"
          @click="openWallet(wallet)"
          class="wallet-card"
        >
          <img
            :src="explorer.imageUrl(wallet)"
            :alt="wallet.name"
            loading="lazy"
          />
          <span>{{ wallet.name }}</span>
        </button>
      </div>

      <p
        v-if="searchQuery && !explorer.searching.value && gridWallets.length === 0"
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

      <div
        v-if="!searchQuery && explorer.hasMore.value"
        :ref="observeSentinel"
        class="sentinel"
      />
    </template>

    <!-- Main View -->
    <template v-else>
      <EvmConnectorQR :uri="uri">
        <template #instruction>
          Scan with your wallet app
        </template>
      </EvmConnectorQR>

      <div class="separator">
        <span>Or choose a wallet</span>
      </div>

      <!-- Recent Wallets -->
      <template v-if="explorer.recentWallets.value.length > 0">
        <p class="section-label">Recent</p>
        <div class="wallet-list">
          <button
            v-for="wallet in explorer.recentWallets.value"
            :key="wallet.id"
            @click="openWallet(wallet)"
            class="wallet-item"
          >
            <img
              :src="explorer.imageUrl(wallet)"
              :alt="wallet.name"
            />
            <span>{{ wallet.name }}</span>
          </button>
        </div>
      </template>

      <!-- Recommended Wallets -->
      <div v-if="filteredRecommended.length > 0" class="wallet-list">
        <button
          v-for="wallet in filteredRecommended"
          :key="wallet.id"
          @click="openWallet(wallet)"
          class="wallet-item"
        >
          <img
            :src="explorer.imageUrl(wallet)"
            :alt="wallet.name"
          />
          <span>{{ wallet.name }}</span>
        </button>
      </div>

      <Loading
        v-if="explorer.loading.value && explorer.recommended.value.length === 0"
        spinner
        stacked
        txt=""
      />

      <!-- All Wallets Button -->
      <Button
        v-if="explorer.totalCount.value > explorer.recommended.value.length"
        @click="openAllWallets"
        class="all-wallets-btn"
      >
        <Icon type="lucide:search" />
        <span>All wallets</span>
        <span class="wallet-count">{{ walletCountLabel }}</span>
      </Button>

      <Button
        to="https://ethereum.org/wallets/"
        target="_blank"
        class="link muted small help-link"
      >
        <Icon type="help" />
        <span>New to wallets?</span>
      </Button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Button from '../../base/components/Button.vue'
import Icon from '../../base/components/Icon.vue'
import Loading from '../../base/components/Loading.vue'
import EvmConnectorQR from './EvmConnectorQR.vue'
import {
  useWalletExplorer,
  type ExplorerWallet,
} from '../composables/walletExplorer'

const props = defineProps<{
  uri: string
}>()

const explorer = useWalletExplorer()
const view = ref<'main' | 'all'>('main')
const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

const filteredRecommended = computed(() =>
  explorer.recommended.value.filter(
    w => !explorer.recentWallets.value.some(r => r.id === w.id)
  )
)

const gridWallets = computed(() =>
  searchQuery.value ? explorer.searchResults.value : explorer.wallets.value
)

const walletCountLabel = computed(() => {
  const count = explorer.totalCount.value
  if (count < 10) return `${count}`
  return `${Math.floor(count / 10) * 10}+`
})

function openWallet(wallet: ExplorerWallet) {
  const href = explorer.walletHref(wallet, props.uri)
  if (href) {
    window.open(href, '_blank', 'noreferrer')
  }
  explorer.addRecent(wallet.id)
}

function openAllWallets() {
  view.value = 'all'
  if (explorer.wallets.value.length === 0) {
    explorer.fetchNextPage()
  }
}

function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    explorer.search(searchQuery.value)
  }, 300)
}

// Infinite scroll
let observer: IntersectionObserver | null = null

function observeSentinel(el: HTMLElement | null) {
  observer?.disconnect()
  if (!el) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !explorer.loading.value && explorer.hasMore.value) {
        explorer.fetchNextPage()
      }
    },
    { threshold: 0.1 }
  )
  observer.observe(el)
}

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(searchTimeout)
})

onMounted(() => {
  explorer.fetchRecommended()
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

/* Section label */
.section-label {
  @mixin ui-font;
  color: var(--muted);
  font-size: var(--font-xs);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Wallet list (main view) */
.wallet-list {
  display: grid;
  gap: var(--spacer);
}

.wallet-item {
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--button-background);
  color: var(--button-color);
  border: none;
  border-radius: var(--button-border-radius);
  box-shadow: var(--border-shadow);
  padding: var(--ui-padding-block) var(--ui-padding-inline);
  cursor: pointer;
  transition:
    background var(--speed),
    box-shadow var(--speed);

  &:hover {
    background: var(--button-background-highlight);
    box-shadow: var(--border-shadow-highlight);
  }

  img {
    margin: -1rem 0 -1rem -0.6rem;
    width: var(--size-5);
    height: var(--size-5);
    border-radius: var(--border-radius);
  }

  span {
    border-left: var(--border);
    padding-left: var(--spacer-sm);
    @mixin ui-font;
  }
}

/* All wallets button */
.all-wallets-btn {
  width: 100%;
  justify-content: center;

  .wallet-count {
    @mixin ui-font;
    font-size: var(--font-xs);
    background: var(--gray-z-2);
    padding: 0.1em 0.5em;
    border-radius: var(--border-radius);
  }
}

/* Help link */
.help-link {
  justify-self: center;
  font-size: var(--font-xs);
}

/* Back button */
.back-btn {
  justify-self: start;
}

/* Search bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  background: var(--button-background);
  border-radius: var(--button-border-radius);
  box-shadow: var(--border-shadow);
  padding: var(--ui-padding-block) var(--ui-padding-inline);

  .search-icon {
    color: var(--muted);
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--color);
    font-size: inherit;
    outline: none;
    @mixin ui-font;

    &::placeholder {
      color: var(--muted);
    }
  }
}

/* Wallet grid (all wallets view) */
.wallet-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacer-sm);

  @container (max-width: 20rem) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.wallet-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-xs);
  padding: var(--spacer-sm);
  background: var(--button-background);
  color: var(--button-color);
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--border-shadow);
  cursor: pointer;
  transition:
    background var(--speed),
    box-shadow var(--speed);

  &:hover {
    background: var(--button-background-highlight);
    box-shadow: var(--border-shadow-highlight);
  }

  img {
    width: var(--size-6);
    height: var(--size-6);
    border-radius: var(--border-radius);
  }

  span {
    @mixin ui-font;
    font-size: var(--font-xs);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}

/* Sentinel for infinite scroll */
.sentinel {
  height: 1px;
}

/* Empty state */
.empty-state {
  text-align: center;
  @mixin ui-font;
  color: var(--muted);
}
</style>
