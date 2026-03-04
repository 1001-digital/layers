import { ref, computed, watchEffect, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { getPublicClient } from '@wagmi/core'
import { useConfig, type Config } from '@wagmi/vue'
import { useEvmConfig } from '../config'
import {
  ensCache,
  fetchEnsFromIndexer,
  fetchEnsFromChain,
  ENS_KEYS_AVATAR,
  ENS_KEYS_PROFILE,
} from '../utils/ens'
import type { EnsProfile } from '../utils/ens'

type EnsMode = 'indexer' | 'chain'

interface UseEnsOptions {
  mode?: MaybeRefOrGetter<EnsMode | undefined>
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
  const config = useConfig()
  const evmConfig = useEvmConfig()

  const mode = computed<EnsMode>(
    () => toValue(options.mode) || evmConfig.ens?.mode || 'indexer',
  )
  const indexerUrls = computed(() => evmConfig.ens?.indexerUrls || [])
  const cacheKey = computed(() => `ens-${tier}-${toValue(identifier)}`)

  const data: Ref<EnsProfile | null | undefined> = ref(
    ensCache.get(cacheKey.value) ?? undefined,
  )
  const pending = ref(false)

  watchEffect(async () => {
    const id = toValue(identifier)
    if (!id) {
      data.value = null
      pending.value = false
      return
    }

    const cached = ensCache.get(cacheKey.value)
    if (cached) {
      data.value = cached
      pending.value = false
      return
    }

    const strategies: EnsMode[] =
      mode.value === 'indexer' ? ['indexer', 'chain'] : ['chain', 'indexer']

    pending.value = true
    try {
      data.value = await ensCache.fetch(cacheKey.value, () =>
        resolve(id, strategies, indexerUrls.value, config, chainKeys),
      )
    } catch {
      data.value = null
    } finally {
      pending.value = false
    }
  })

  return { data, pending }
}

export const useEns = (
  identifier: MaybeRefOrGetter<string | undefined>,
  options?: UseEnsOptions,
) => useEnsBase('resolve', identifier, [], options)

export const useEnsWithAvatar = (
  identifier: MaybeRefOrGetter<string | undefined>,
  options?: UseEnsOptions,
) => useEnsBase('avatar', identifier, [...ENS_KEYS_AVATAR], options)

export const useEnsProfile = (
  identifier: MaybeRefOrGetter<string | undefined>,
  options?: UseEnsOptions,
) => useEnsBase('profile', identifier, [...ENS_KEYS_PROFILE], options)
