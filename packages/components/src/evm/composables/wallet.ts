import { computed } from 'vue'
import { useConnection, useDisconnect } from '@wagmi/vue'
import { useSeedWallet } from './seedWallet'

export function useWallet() {
  const wagmi = useConnection()
  const { mutate: disconnectWagmi } = useDisconnect()
  const seed = useSeedWallet()

  const address = computed(() => wagmi.address.value ?? seed.address.value)
  const isConnected = computed(
    () => wagmi.isConnected.value || seed.isConnected.value,
  )

  function disconnect() {
    disconnectWagmi()
    seed.disconnect()
  }

  return {
    address,
    isConnected,
    disconnect,
  }
}
