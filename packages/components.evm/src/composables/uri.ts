import { ref, watch, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { createDwebFetch, type DwebClient } from '@1001-digital/dweb-fetch'
import { useEvmConfig } from '../config'
import { createCache } from '../utils/cache'

const resolvedUrlCache = createCache<string>(5 * 60 * 1000, 200)

function toBaseUrl(gateway: string): string {
  return gateway.replace(/\/(ipfs|ipns)\/?$/, '').replace(/\/+$/, '')
}

export function useDwebClient(): DwebClient {
  const config = useEvmConfig()

  return createDwebFetch({
    ipfs: config.ipfsGateway
      ? { mode: 'gateway', gateways: [toBaseUrl(config.ipfsGateway)] }
      : undefined,
    arweave: config.arweaveGateway
      ? { gateways: [toBaseUrl(config.arweaveGateway)] }
      : undefined,
    eip155:
      config.rpcUrls && Object.keys(config.rpcUrls).length
        ? { rpcUrls: config.rpcUrls }
        : undefined,
  })
}

const PASSTHROUGH_RE = /^(https?:|data:|blob:)/

function syncResolve(val: string): string {
  if (PASSTHROUGH_RE.test(val)) return val
  return resolvedUrlCache.get(val) ?? ''
}

export function useResolvedUrl(
  uri: MaybeRefOrGetter<string | undefined>,
): Ref<string> {
  const dweb = useDwebClient()
  const initial = toValue(uri)
  const resolved = ref(initial ? syncResolve(initial) : '')

  watch(
    () => toValue(uri),
    async (val) => {
      if (!val) {
        resolved.value = ''
        return
      }
      if (PASSTHROUGH_RE.test(val)) {
        resolved.value = val
        return
      }
      const cached = resolvedUrlCache.get(val)
      if (cached) {
        resolved.value = cached
        return
      }
      try {
        resolved.value = await resolvedUrlCache.fetch(val, () =>
          dweb.resolveUrl(val),
        )
      } catch {
        resolved.value = ''
      }
    },
    { immediate: true },
  )

  return resolved
}
