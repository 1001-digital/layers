import { getPublicClient } from '@wagmi/core'
import type { Config } from '@wagmi/vue'

interface UseEnsOptions {
  mode?: MaybeRefOrGetter<'indexer' | 'chain' | undefined>
}

function useEnsBase(
  key: string,
  identifier: MaybeRefOrGetter<string | undefined>,
  chainKeys: string[],
  options: UseEnsOptions = {},
) {
  const { $wagmi } = useNuxtApp()
  const appConfig = useAppConfig()
  const runtimeConfig = useRuntimeConfig()

  const mode = computed(() => toValue(options.mode) || appConfig.evm?.ens?.mode || 'indexer')

  const indexerUrls = computed(() => {
    const ens = (runtimeConfig.public.evm as { ens?: { indexer1?: string, indexer2?: string, indexer3?: string } }).ens
    if (!ens) return []
    return [ens.indexer1, ens.indexer2, ens.indexer3].filter(Boolean) as string[]
  })

  const strategies = computed(() => {
    const primary = mode.value
    const fallback = primary === 'indexer' ? 'chain' : 'indexer'
    return [primary, fallback] as const
  })

  return useAsyncData(
    `ens-${key}-${toValue(identifier)}`,
    async () => {
      const id = toValue(identifier)
      if (!id) return null

      for (const strategy of strategies.value) {
        try {
          if (strategy === 'indexer') {
            if (!indexerUrls.value.length) continue
            return await fetchEnsFromIndexer(id, indexerUrls.value)
          }

          if (strategy === 'chain') {
            const client = getPublicClient($wagmi as Config, { chainId: 1 })
            if (!client) continue
            return await fetchEnsFromChain(id, client, chainKeys)
          }
        } catch {
          continue
        }
      }

      return null
    },
    { watch: [() => toValue(identifier)] },
  )
}

export const useEns = (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) =>
  useEnsBase('resolve', identifier, [], options)

export const useEnsAvatar = (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) =>
  useEnsBase('avatar', identifier, [...ENS_KEYS_AVATAR], options)

export const useEnsProfile = (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) =>
  useEnsBase('profile', identifier, [...ENS_KEYS_PROFILE], options)
