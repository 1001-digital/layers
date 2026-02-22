import { isAddress, type PublicClient, type Address } from 'viem'
import { normalize } from 'viem/ens'
import { createCache } from './cache'

// --- Types ---

export interface EnsProfile {
  address: string
  ens: string | null
  data: {
    avatar: string
    header: string
    description: string
    links: {
      url: string
      email: string
      twitter: string
      github: string
    }
  } | null
}

// --- Text record keys ---

const ALL_KEYS = [
  'avatar',
  'header',
  'description',
  'url',
  'email',
  'com.twitter',
  'com.github',
] as const

export const ENS_KEYS_AVATAR = ['avatar'] as const
export const ENS_KEYS_PROFILE = [...ALL_KEYS]

// --- Cache ---

export const ensCache = createCache<EnsProfile>(5 * 60 * 1000, 500)

// --- Fetchers ---

export async function fetchEnsFromIndexer(
  identifier: string,
  urls: string[],
): Promise<EnsProfile> {
  let lastError: Error | undefined

  for (const url of urls) {
    try {
      return await $fetch<EnsProfile>(`${url}/${identifier}`)
    } catch (err) {
      lastError = err as Error
    }
  }

  throw lastError ?? new Error('No indexer URLs provided')
}

export async function fetchEnsFromChain(
  identifier: string,
  client: PublicClient,
  keys: string[] = [],
): Promise<EnsProfile> {
  const isAddr = isAddress(identifier)

  let address: string
  let ens: string | null

  if (isAddr) {
    address = identifier
    ens = (await client.getEnsName({ address: identifier as Address })) ?? null
  } else {
    ens = identifier
    const resolved = await client.getEnsAddress({ name: normalize(identifier) })
    if (!resolved) return { address: '', ens, data: null }
    address = resolved
  }

  if (!ens || !keys.length) return { address, ens: ens ?? null, data: null }

  const name = normalize(ens)
  const results = await Promise.all(
    keys.map((key) => client.getEnsText({ name, key }).catch(() => null)),
  )

  return {
    address,
    ens,
    data: toProfileData(
      keys,
      results.map((r) => r || ''),
    ),
  }
}

// --- Helpers ---

function toProfileData(keys: string[], results: string[]): EnsProfile['data'] {
  const get = (key: string) => results[keys.indexOf(key)] || ''

  return {
    avatar: get('avatar'),
    header: get('header'),
    description: get('description'),
    links: {
      url: get('url'),
      email: get('email'),
      twitter: get('com.twitter'),
      github: get('com.github'),
    },
  }
}
