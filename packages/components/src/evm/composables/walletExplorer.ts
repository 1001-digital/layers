import { ref, computed } from 'vue'
import { useEvmConfig } from '../config'

const EXPLORER_API = 'https://explorer-api.walletconnect.com/v3'
const RECENT_KEY = 'evm:recent-wallets'
const RECOMMENDED_COUNT = 8
const PAGE_SIZE = 40

export interface ExplorerWallet {
  id: string
  name: string
  image_id: string
  homepage: string
  mobile: { native: string; universal: string }
  desktop: { native: string; universal: string }
  injected: { namespace: string; injected_id: string }[] | null
}

export function useWalletExplorer() {
  const config = useEvmConfig()
  const projectId = computed(() => config.walletConnectProjectId || '')

  const recommended = ref<ExplorerWallet[]>([])
  const wallets = ref<ExplorerWallet[]>([])
  const searchResults = ref<ExplorerWallet[]>([])
  const totalCount = ref(0)
  const page = ref(0)
  const loading = ref(false)
  const searching = ref(false)
  const recentIds = ref<string[]>(loadRecent())

  const allKnown = computed(() => {
    const map = new Map<string, ExplorerWallet>()
    for (const w of [...recommended.value, ...wallets.value]) map.set(w.id, w)
    return map
  })

  const recentWallets = computed(() =>
    recentIds.value
      .map(id => allKnown.value.get(id))
      .filter((w): w is ExplorerWallet => !!w)
  )

  const hasMore = computed(() => wallets.value.length < totalCount.value)

  function imageUrl(wallet: ExplorerWallet) {
    return `${EXPLORER_API}/logo/md/${wallet.image_id}?projectId=${projectId.value}`
  }

  function walletHref(wallet: ExplorerWallet, uri: string) {
    const encoded = encodeURIComponent(uri)

    const universal = wallet.mobile?.universal
    if (universal) {
      const base = universal.endsWith('/') ? universal : universal + '/'
      return `${base}wc?uri=${encoded}`
    }

    const native = wallet.mobile?.native
    if (native) {
      return `${native}wc?uri=${encoded}`
    }

    return null
  }

  async function fetchRecommended() {
    if (!projectId.value) return
    loading.value = true
    try {
      const res = await fetch(
        `${EXPLORER_API}/wallets?projectId=${projectId.value}&entries=${RECOMMENDED_COUNT}&page=1&sdks=sign_v2`
      )
      const data = await res.json()
      recommended.value = Object.values(data.listings || {})
      totalCount.value = data.total || 0
    } catch (e) {
      console.error('Failed to fetch wallets:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchNextPage() {
    if (!projectId.value || loading.value) return
    loading.value = true
    const nextPage = page.value + 1
    try {
      const res = await fetch(
        `${EXPLORER_API}/wallets?projectId=${projectId.value}&entries=${PAGE_SIZE}&page=${nextPage}&sdks=sign_v2`
      )
      const data = await res.json()
      const fetched = Object.values(data.listings || {}) as ExplorerWallet[]
      wallets.value = nextPage === 1 ? fetched : [...wallets.value, ...fetched]
      totalCount.value = data.total || 0
      page.value = nextPage
    } catch (e) {
      console.error('Failed to fetch wallets:', e)
    } finally {
      loading.value = false
    }
  }

  async function search(query: string) {
    if (!projectId.value || !query || query.length < 2) {
      searchResults.value = []
      return
    }
    searching.value = true
    try {
      const res = await fetch(
        `${EXPLORER_API}/wallets?projectId=${projectId.value}&entries=${PAGE_SIZE}&page=1&search=${encodeURIComponent(query)}&sdks=sign_v2`
      )
      const data = await res.json()
      searchResults.value = Object.values(data.listings || {})
    } catch (e) {
      console.error('Failed to search wallets:', e)
    } finally {
      searching.value = false
    }
  }

  function loadRecent(): string[] {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    } catch {
      return []
    }
  }

  function addRecent(walletId: string) {
    const ids = recentIds.value.filter(id => id !== walletId)
    ids.unshift(walletId)
    recentIds.value = ids.slice(0, 3)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds.value))
    } catch {}
  }

  return {
    recommended,
    wallets,
    searchResults,
    totalCount,
    page,
    loading,
    searching,
    recentWallets,
    hasMore,
    imageUrl,
    walletHref,
    fetchRecommended,
    fetchNextPage,
    search,
    addRecent,
  }
}
