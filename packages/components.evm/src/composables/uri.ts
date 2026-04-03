import { ref, watch, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { createDwebFetch, type DwebClient } from '@1001-digital/dweb-fetch'
import { useEvmConfig } from '../config'

function toBaseUrl(gateway: string): string {
  return gateway.replace(/\/(ipfs|ipns)\/?$/, '').replace(/\/+$/, '')
}

export function useDwebClient(): DwebClient {
  const config = useEvmConfig()

  return createDwebFetch({
    ipfs: config.ipfsGateway
      ? { gateways: [toBaseUrl(config.ipfsGateway)] }
      : undefined,
    arweave: config.arweaveGateway
      ? { gateways: [toBaseUrl(config.arweaveGateway)] }
      : undefined,
    eip155: config.rpcUrls && Object.keys(config.rpcUrls).length
      ? { rpcUrls: config.rpcUrls }
      : undefined,
  })
}

export function useResolvedUrl(
  uri: MaybeRefOrGetter<string | undefined>,
): Ref<string> {
  const dweb = useDwebClient()
  const resolved = ref('')

  watch(
    () => toValue(uri),
    async (val) => {
      if (!val) {
        resolved.value = ''
        return
      }
      try {
        resolved.value = await dweb.resolveUrl(val)
      } catch {
        resolved.value = ''
      }
    },
    { immediate: true },
  )

  return resolved
}
