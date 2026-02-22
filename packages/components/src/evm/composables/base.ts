import { useEvmConfig } from '../config'

export const useBaseURL = () => {
  const config = useEvmConfig()
  const base = config.baseURL || '/'
  return base.endsWith('/') ? base : base + '/'
}
