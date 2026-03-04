import type { DwebFetch, DwebFetchConfig, DwebFetchOptions, ProtocolHandler } from './types'
import { DwebUnsupportedProtocolError } from './errors'
import { extractScheme } from './utils/parse-url'
import { createIpfsHandler } from './protocols/ipfs'
import { createArweaveHandler } from './protocols/arweave'
import { createHttpsHandler } from './protocols/https'

export function createDwebFetch(config: DwebFetchConfig = {}): DwebFetch {
  const ipfsHandler = createIpfsHandler(config)
  const arweaveHandler = createArweaveHandler(config)
  const httpsHandler = createHttpsHandler()

  const handlers: Record<string, ProtocolHandler> = {
    ipfs: ipfsHandler,
    ipns: ipfsHandler,
    ar: arweaveHandler,
    http: httpsHandler,
    https: httpsHandler,
  }

  const dwebFetch: DwebFetch = async (
    url: string,
    options?: DwebFetchOptions,
  ): Promise<Response> => {
    const scheme = extractScheme(url)
    if (!scheme) {
      throw new DwebUnsupportedProtocolError(url.split(':')[0] || 'unknown')
    }

    const handler = handlers[scheme]
    if (!handler) {
      throw new DwebUnsupportedProtocolError(scheme)
    }

    return handler.fetch(url, options)
  }

  return dwebFetch
}

export type {
  DwebFetch,
  DwebFetchConfig,
  DwebFetchOptions,
  DwebScheme,
  IpfsConfig,
  ArweaveConfig,
  ProtocolHandler,
  ProtocolHandlerFactory,
} from './types'

export { DwebFetchError, DwebUnsupportedProtocolError } from './errors'
export { extractScheme, parseDwebUrl } from './utils/parse-url'
export type { ParsedDwebUrl } from './utils/parse-url'
