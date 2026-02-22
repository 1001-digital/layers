import { reactive, computed } from 'vue'
import { readContract } from '@wagmi/core'
import { useConfig } from '@wagmi/vue'
import { parseJSON, stringifyJSON, formatPrice } from '../utils/price'
import { nowInSeconds } from './helpers'

const CHAINLINK_ETH_USD_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const CHAINLINK_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
const STORAGE_KEY = 'evm:price-feed'
const CACHE_TTL = 3_600 // 1 hour in seconds

interface PriceFeedState {
  ethUSDRaw: bigint | null
  lastUpdated: number
}

const state = reactive<PriceFeedState>({
  ethUSDRaw: null,
  lastUpdated: 0,
})

function loadFromStorage() {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    const parsed = parseJSON(stored) as PriceFeedState
    if (parsed.ethUSDRaw) state.ethUSDRaw = parsed.ethUSDRaw
    if (parsed.lastUpdated) state.lastUpdated = parsed.lastUpdated
  } catch {
    // Ignore corrupted storage
  }
}

function saveToStorage() {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, stringifyJSON({
      ethUSDRaw: state.ethUSDRaw,
      lastUpdated: state.lastUpdated,
    }))
  } catch {
    // Ignore storage errors
  }
}

export const usePriceFeed = () => {
  const config = useConfig()

  // Load cached data on first use
  if (!state.lastUpdated) loadFromStorage()

  const ethUSD = computed(() => state.ethUSDRaw ? state.ethUSDRaw / BigInt(1e8) : 0n)
  const ethUSC = computed(() => state.ethUSDRaw ? state.ethUSDRaw / BigInt(1e6) : 0n)
  const ethUSDFormatted = computed(() => formatPrice(Number(ethUSC.value) / 100, 2))

  const weiToUSD = (wei: bigint) => {
    const cents = (wei * (state.ethUSDRaw || 0n)) / (10n ** 18n) / (10n ** 6n)
    return formatPrice(Number(cents) / 100, 2)
  }

  async function fetchPrice() {
    if (nowInSeconds() - state.lastUpdated < CACHE_TTL) return

    try {
      const [, answer] = await readContract(config, {
        address: CHAINLINK_ETH_USD,
        abi: CHAINLINK_ETH_USD_ABI,
        functionName: 'latestRoundData',
        chainId: 1,
      })

      state.ethUSDRaw = answer
      state.lastUpdated = nowInSeconds()
      saveToStorage()
    } catch (error) {
      console.warn('Error fetching ETH/USD price:', error)
    }
  }

  return {
    ethUSDRaw: computed(() => state.ethUSDRaw),
    ethUSD,
    ethUSC,
    ethUSDFormatted,
    weiToUSD,
    fetchPrice,
  }
}
