import { ref, computed, watch, onScopeDispose, type Ref } from 'vue'
import { formatEther, formatGwei } from 'viem'
import { getGasPrice } from '@wagmi/core'
import { useConfig, useBlockNumber } from '@wagmi/vue'

const price: Ref<bigint> = ref(0n)
let watcherCount = 0

export const useGasPrice = () => {
  const config = useConfig()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const updatePrice = async () => {
    price.value = await getGasPrice(config)
  }

  if (watcherCount === 0) updatePrice()
  watcherCount++

  const stopWatcher = watch(blockNumber, () => updatePrice())

  onScopeDispose(() => {
    stopWatcher()
    watcherCount--
  })

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
