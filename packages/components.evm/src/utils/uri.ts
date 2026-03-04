export interface ResolveUriOptions {
  ipfsGateway?: string
  arweaveGateway?: string
}

const DEFAULT_IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
const DEFAULT_ARWEAVE_GATEWAY = 'https://arweave.net/'

export const resolveUri = (
  uri?: string,
  options?: ResolveUriOptions,
): string => {
  if (!uri) return ''

  const ipfs = options?.ipfsGateway || DEFAULT_IPFS_GATEWAY
  const ar = options?.arweaveGateway || DEFAULT_ARWEAVE_GATEWAY

  if (uri.startsWith('data:')) return uri
  if (uri.startsWith('ipfs://')) return ipfs + uri.replace('ipfs://', '')
  if (uri.startsWith('ar://')) return ar + uri.replace('ar://', '')
  if (uri.startsWith('Qm') || uri.startsWith('baf')) return ipfs + uri

  return uri
}
