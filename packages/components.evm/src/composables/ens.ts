import {
  ref,
  computed,
  watchEffect,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { getPublicClient } from '@wagmi/core'
import { useConfig, type Config } from '@wagmi/vue'
import { isAddress } from 'viem'
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
  indexers: string[],
  wagmi: Config,
  chainKeys: string[],
): Promise<EnsProfile> {
  for (const strategy of strategies) {
    try {
      if (strategy === 'indexer') {
        if (!indexers.length) continue
        return await fetchEnsFromIndexer(identifier, indexers)
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

  return isAddress(identifier)
    ? { address: identifier, ens: null, data: null }
    : { address: '', ens: identifier, data: null }
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
  const indexers = computed(() => evmConfig.ens?.indexers || [])
  const cacheKey = computed(() => `ens-${tier}-${toValue(identifier)}`)

  const data: Ref<EnsProfile | null | undefined> = ref(
    ensCache.get(cacheKey.value) ?? undefined,
  )
  const pending = ref(false)
  let run = 0

  watchEffect(async () => {
    const currentRun = ++run
    const id = toValue(identifier)
    if (!id) {
      data.value = null
      pending.value = false
      return
    }

    const key = cacheKey.value
    const cached = ensCache.get(key)
    if (cached) {
      data.value = cached
      pending.value = false
      return
    }

    const strategies: EnsMode[] =
      mode.value === 'indexer' ? ['indexer', 'chain'] : ['chain', 'indexer']

    pending.value = true
    try {
      const result = await ensCache.fetch(key, () =>
        resolve(id, strategies, indexers.value, config, chainKeys),
      )
      if (currentRun !== run) return
      data.value = result
    } catch {
      if (currentRun !== run) return
      data.value = null
    } finally {
      if (currentRun === run) pending.value = false
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

/**
 * Imperative, awaitable ENS resolution sharing the cache and strategy order
 * of `useEns`. Use it to force-resolve an identifier at the moment it is
 * acted on (e.g. form submit), instead of relying on a background resolution
 * having already landed in the cache.
 */
export function useEnsResolver(options: UseEnsOptions = {}) {
  const config = useConfig()
  const evmConfig = useEvmConfig()

  async function resolveProfile(
    identifier: string,
  ): Promise<EnsProfile | null> {
    const id = identifier.trim()
    if (!id) return null

    const key = `ens-resolve-${id}`
    const cached = ensCache.get(key)
    if (cached?.address) return cached
    // A cached failed resolution should not pin the name as unresolvable
    // for the whole TTL — evict it and try again.
    if (cached) ensCache.evict(key)

    const mode = toValue(options.mode) || evmConfig.ens?.mode || 'indexer'
    const strategies: EnsMode[] =
      mode === 'indexer' ? ['indexer', 'chain'] : ['chain', 'indexer']

    try {
      return await ensCache.fetch(key, () =>
        resolve(id, strategies, evmConfig.ens?.indexers || [], config, []),
      )
    } catch {
      return null
    }
  }

  /** Resolve an address or ENS name to an address, or `null` on failure. */
  async function resolveAddress(identifier: string): Promise<string | null> {
    const id = identifier.trim()
    if (isAddress(id)) return id

    const profile = await resolveProfile(id)
    return profile?.address && isAddress(profile.address)
      ? profile.address
      : null
  }

  return { resolveProfile, resolveAddress }
}
