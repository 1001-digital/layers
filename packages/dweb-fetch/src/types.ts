export interface DwebFetchConfig {
  ipfs?: IpfsConfig
  arweave?: ArweaveConfig
}

export interface IpfsConfig {
  gateways?: string[]
  routers?: string[]
}

export interface ArweaveConfig {
  gateways?: string[]
  useNetworkDiscovery?: boolean
}

export interface DwebFetchOptions {
  signal?: AbortSignal
  headers?: HeadersInit
  method?: string
  body?: BodyInit | null
}

export type DwebFetch = (
  url: string,
  options?: DwebFetchOptions,
) => Promise<Response>

export interface ProtocolHandler {
  fetch: (url: string, options?: DwebFetchOptions) => Promise<Response>
  destroy?: () => Promise<void>
}

export type ProtocolHandlerFactory = (
  config: DwebFetchConfig,
) => ProtocolHandler

export type DwebScheme = 'ipfs' | 'ipns' | 'ar' | 'http' | 'https'
