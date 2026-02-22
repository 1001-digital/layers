import { ref, computed, watch, type Ref, type WatchStopHandle } from 'vue'
import { formatEther, formatGwei } from 'viem'
import { getGasPrice } from '@wagmi/core'
import { useConfig, useBlockNumber } from '@wagmi/vue'

let priceWatcher: WatchStopHandle | null = null
const price: Ref<bigint> = ref(0n)

export const useGasPrice = () => {
  const config = useConfig()
  const { data: blockNumber } = useBlockNumber()

  const updatePrice = async () => {
    price.value = await getGasPrice(config)
  }

  if (!priceWatcher) {
    updatePrice()
    priceWatcher = watch(blockNumber, () => updatePrice())
  }

  const unitPrice = computed(() => ({
    wei: price.value,
    gwei: formatGwei(price.value),
    eth: formatEther(price.value),

    formatted: {
      gwei:
        price.value > 2_000_000_000_000n
          ? Math.round(parseFloat(formatGwei(price.value)))
          : parseFloat(formatGwei(price.value)).toFixed(1),
      eth: formatEther(price.value),
    },
  }))

  return unitPrice
}
