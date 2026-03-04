import { useEvmConfig } from '../config'
import { resolveUri } from '../utils/uri'

export const useResolveUri = () => {
  const evmConfig = useEvmConfig()

  return (uri?: string) =>
    resolveUri(uri, {
      ipfsGateway: evmConfig.ipfsGateway,
      arweaveGateway: evmConfig.arweaveGateway,
    })
}
