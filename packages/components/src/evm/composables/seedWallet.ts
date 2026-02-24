import { ref, computed } from 'vue'
import type { Address, PrivateKeyAccount } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const STORAGE_KEY = 'evm:seed-wallet-pk'

// Module-level singleton state
const privateKey = ref<`0x${string}` | null>(null)
const account = ref<PrivateKeyAccount | null>(null)

function loadFromStorage() {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored.startsWith('0x')) {
      const pk = stored as `0x${string}`
      account.value = privateKeyToAccount(pk)
      privateKey.value = pk
    }
  } catch {}
}

// Auto-load on first client-side import
loadFromStorage()

export function useSeedWallet() {
  const address = computed<Address | null>(() => account.value?.address ?? null)
  const isConnected = computed(() => account.value !== null)

  async function connectWithMnemonic(mnemonic: string) {
    const { mnemonicToAccount } = await import('viem/accounts')
    const { bytesToHex } = await import('viem')

    const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ')
    const hdAccount = mnemonicToAccount(normalized)
    const hdKey = hdAccount.getHdKey()
    const pk = bytesToHex(hdKey.privateKey!) as `0x${string}`

    account.value = privateKeyToAccount(pk)
    privateKey.value = pk

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, pk)
    }
  }

  function disconnect() {
    account.value = null
    privateKey.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    address,
    isConnected,
    account: computed(() => account.value),
    connectWithMnemonic,
    disconnect,
  }
}
