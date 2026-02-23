import { resolveUri } from '../utils/uri'

export const useResolveUri = () => {
  const appConfig = useAppConfig()

  return (uri?: string) =>
    resolveUri(uri, {
      ipfsGateway: appConfig.evm?.ipfsGateway,
      arweaveGateway: appConfig.evm?.arweaveGateway,
    })
}
