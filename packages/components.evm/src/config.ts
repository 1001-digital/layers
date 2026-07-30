import { inject, type InjectionKey } from 'vue'
import type { SmartAccountChainParameters } from './connectors/inAppWallet'

export interface EvmChainConfig {
  id: number
  blockExplorer?: string
  smartAccount?: Omit<SmartAccountChainParameters, 'rpcUrl' | 'fetchOptions'>
}

export interface EvmConfig {
  title?: string
  appLogoUrl?: string
  defaultChain?: string
  chains: Record<string, EvmChainConfig>
  ens?: {
    mode?: 'indexer' | 'chain'
    indexers?: string[]
  }
  ipfsGateway?: string
  arweaveGateway?: string
  rpcUrls?: Record<number, string>
  smartAccounts?: Record<number, SmartAccountChainParameters>
  baseURL?: string
  walletConnectProjectId?: string
}

export const EvmConfigKey: InjectionKey<EvmConfig> = Symbol('EvmConfig')

export const defaultEvmConfig: EvmConfig = {
  title: 'EVM Layer',
  defaultChain: 'mainnet',
  chains: {
    mainnet: { id: 1, blockExplorer: 'https://evm.now' },
  },
  ens: { mode: 'indexer' },
}

export const useEvmConfig = (): EvmConfig => {
  return inject(EvmConfigKey, defaultEvmConfig)
}
