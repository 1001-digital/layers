import { getPublicClient } from '@wagmi/core'
import type { Config } from '@wagmi/vue'
import { ensCache, fetchEnsFromIndexer, fetchEnsFromChain, ENS_KEYS_AVATAR, ENS_KEYS_PROFILE } from '../utils/ens'
import type { EnsProfile } from '../utils/ens'

type EnsMode = 'indexer' | 'chain'

interface UseEnsOptions {
  mode?: MaybeRefOrGetter<EnsMode | undefined>
}

interface EnsRuntimeConfig {
  ens?: { indexer1?: string, indexer2?: string, indexer3?: string }
}

function getIndexerUrls(config: EnsRuntimeConfig): string[] {
  if (!config.ens) return []
  return [config.ens.indexer1, config.ens.indexer2, config.ens.indexer3].filter(Boolean) as string[]
}

async function resolve(
  identifier: string,
  strategies: EnsMode[],
  indexerUrls: string[],
  wagmi: Config,
  chainKeys: string[],
): Promise<EnsProfile> {
  for (const strategy of strategies) {
    try {
      if (strategy === 'indexer') {
        if (!indexerUrls.length) continue
        return await fetchEnsFromIndexer(identifier, indexerUrls)
      }

      if (strategy === 'chain') {
        const client = getPublicClient(wagmi, { chainId: 1 })
        if (!client) continue
        return await fetchEnsFromChain(identifier, client, chainKeys)
      }
    } catch {
      continue
    }
  }

  return { address: identifier, ens: null, data: null }
}

function useEnsBase(
  tier: string,
  identifier: MaybeRefOrGetter<string | undefined>,
  chainKeys: string[],
  options: UseEnsOptions = {},
) {
  const { $wagmi } = useNuxtApp()
  const appConfig = useAppConfig()
  const runtimeConfig = useRuntimeConfig()

  const mode = computed<EnsMode>(() => toValue(options.mode) || appConfig.evm?.ens?.mode || 'indexer')
  const indexerUrls = computed(() => getIndexerUrls(runtimeConfig.public.evm as EnsRuntimeConfig))
  const cacheKey = computed(() => `ens-${tier}-${toValue(identifier)}`)

  return useAsyncData(
    cacheKey.value,
    async () => {
      const id = toValue(identifier)
      if (!id) return null

      const strategies: EnsMode[] = mode.value === 'indexer'
        ? ['indexer', 'chain']
        : ['chain', 'indexer']

      return ensCache.fetch(cacheKey.value, () =>
        resolve(id, strategies, indexerUrls.value, $wagmi as Config, chainKeys),
      )
    },
    {
      watch: [() => toValue(identifier)],
      getCachedData: () => ensCache.get(cacheKey.value) ?? undefined,
    },
  )
}

export const useEns = (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) =>
  useEnsBase('resolve', identifier, [], options)

export const useEnsWithAvatar = (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) =>
  useEnsBase('avatar', identifier, [...ENS_KEYS_AVATAR], options)

export const useEnsProfile = (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) =>
  useEnsBase('profile', identifier, [...ENS_KEYS_PROFILE], options)
