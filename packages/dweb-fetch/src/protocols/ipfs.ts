import type { DwebFetchConfig, DwebFetchOptions, ProtocolHandler } from '../types'
import { DwebFetchError } from '../errors'

export function createIpfsHandler(config: DwebFetchConfig): ProtocolHandler {
  let verifiedFetchPromise: Promise<typeof fetch> | null = null

  async function getVerifiedFetch(): Promise<typeof fetch> {
    if (!verifiedFetchPromise) {
      verifiedFetchPromise = initVerifiedFetch(config)
    }
    return verifiedFetchPromise
  }

  return {
    async fetch(url: string, options?: DwebFetchOptions): Promise<Response> {
      try {
        const vFetch = await getVerifiedFetch()
        return await vFetch(url, {
          signal: options?.signal,
          headers: options?.headers
            ? new Headers(options.headers)
            : undefined,
        })
      } catch (error) {
        if (error instanceof DwebFetchError) throw error
        throw new DwebFetchError(`IPFS fetch failed for ${url}`, {
          cause: error,
        })
      }
    },

    async destroy() {
      verifiedFetchPromise = null
    },
  }
}

async function initVerifiedFetch(
  config: DwebFetchConfig,
): Promise<typeof fetch> {
  const { createVerifiedFetch } = await import('@helia/verified-fetch')

  const ipfsConfig = config.ipfs
  const gatewayOpts: Record<string, unknown> = {}

  if (ipfsConfig?.gateways?.length) {
    gatewayOpts.gateways = ipfsConfig.gateways
  }
  if (ipfsConfig?.routers?.length) {
    gatewayOpts.routers = ipfsConfig.routers
  }

  const hasCustomConfig = Object.keys(gatewayOpts).length > 0

  const verifiedFetch = hasCustomConfig
    ? await createVerifiedFetch(
        gatewayOpts as { gateways?: string[]; routers?: string[] },
      )
    : await createVerifiedFetch()

  return verifiedFetch as unknown as typeof fetch
}
