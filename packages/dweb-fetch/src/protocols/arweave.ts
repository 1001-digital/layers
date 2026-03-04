import type { DwebFetchConfig, DwebFetchOptions, ProtocolHandler } from '../types'
import { DwebFetchError } from '../errors'

const DEFAULT_ARWEAVE_GATEWAYS = [
  'https://arweave.net',
  'https://ar-io.dev',
  'https://permagate.io',
]

interface ArweaveClient {
  request: (url: string, options?: DwebFetchOptions) => Promise<Response>
}

export function createArweaveHandler(
  config: DwebFetchConfig,
): ProtocolHandler {
  let wayfinderPromise: Promise<ArweaveClient> | null = null

  async function getWayfinder(): Promise<ArweaveClient> {
    if (!wayfinderPromise) {
      wayfinderPromise = initWayfinder(config)
    }
    return wayfinderPromise
  }

  return {
    async fetch(url: string, options?: DwebFetchOptions): Promise<Response> {
      try {
        const client = await getWayfinder()
        return await client.request(url, options)
      } catch (error) {
        if (error instanceof DwebFetchError) throw error
        throw new DwebFetchError(`Arweave fetch failed for ${url}`, {
          cause: error,
        })
      }
    },

    async destroy() {
      wayfinderPromise = null
    },
  }
}

async function initWayfinder(
  config: DwebFetchConfig,
): Promise<ArweaveClient> {
  const arConfig = config.arweave
  const useStatic =
    arConfig?.gateways?.length || arConfig?.useNetworkDiscovery === false

  if (useStatic) {
    const gateways = arConfig?.gateways?.length
      ? arConfig.gateways
      : DEFAULT_ARWEAVE_GATEWAYS
    return createStaticArweaveClient(gateways)
  }

  try {
    const { createWayfinderClient } = await import('@ar.io/wayfinder-core')
    const wayfinder = createWayfinderClient()

    return {
      async request(
        url: string,
        _options?: DwebFetchOptions,
      ): Promise<Response> {
        return wayfinder.request(url)
      },
    }
  } catch {
    return createStaticArweaveClient(DEFAULT_ARWEAVE_GATEWAYS)
  }
}

function createStaticArweaveClient(gateways: string[]): ArweaveClient {
  return {
    async request(
      url: string,
      options?: DwebFetchOptions,
    ): Promise<Response> {
      const path = url.replace(/^ar:\/\//, '')
      let lastError: unknown

      for (const gateway of gateways) {
        try {
          const gatewayUrl = gateway.endsWith('/')
            ? `${gateway}${path}`
            : `${gateway}/${path}`
          const response = await globalThis.fetch(gatewayUrl, {
            signal: options?.signal,
            headers: options?.headers
              ? new Headers(options.headers)
              : undefined,
          })
          if (response.ok) return response
          lastError = new Error(
            `Gateway ${gateway} returned ${response.status}`,
          )
        } catch (error) {
          lastError = error
        }
      }

      throw new DwebFetchError(`All Arweave gateways failed for ${url}`, {
        cause: lastError as Error,
      })
    },
  }
}
