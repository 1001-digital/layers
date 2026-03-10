// Config
export { EvmConfigKey, defaultEvmConfig, useEvmConfig } from './config'
export type { EvmConfig, EvmChainConfig } from './config'

// Component types
export type {
  EvmAccountProps,
  EvmAvatarProps,
  EvmConnectEmits,
  EvmConnectDialogProps,
  EvmConnectDialogEmits,
  EvmProfileProps,
  EvmProfileEmits,
  EvmSidebarProfileEmits,
  EvmSwitchNetworkProps,
  EvmSwitchNetworkEmits,
  EvmConnectorQRProps,
  EvmMetaMaskQRProps,
  EvmMetaMaskQREmits,
  EvmWalletConnectQRProps,
  EvmWalletConnectWalletsProps,
  EvmWalletConnectWalletsEmits,
  TransactionFlowText,
  EvmTransactionFlowProps,
  EvmTransactionFlowEmits,
  EvmSeedPhraseInputProps,
  EvmSeedPhraseInputEmits,
  EvmInAppWalletSetupProps,
  EvmInAppWalletSetupEmits,
  EvmSiweProps,
  EvmSiweEmits,
  EvmSiweDialogProps,
  EvmSiweDialogEmits,
} from './types'

// Utils
export { createCache } from './utils/cache'
export { shortAddress } from './utils/addresses'
export { resolveChain } from './utils/chains'
export { formatETH } from './utils/format-eth'
export {
  ensCache,
  fetchEnsFromIndexer,
  fetchEnsFromChain,
  ENS_KEYS_AVATAR,
  ENS_KEYS_PROFILE,
} from './utils/ens'
export type { EnsProfile } from './utils/ens'
export { stringifyJSON, parseJSON, formatPrice } from './utils/price'
export { createDwebFetch } from '@1001-digital/dweb-fetch'
export type { DwebClient, DwebFetchConfig } from '@1001-digital/dweb-fetch'
export { createSiweMessage } from './utils/siwe'
export type { SiweMessageParams } from './utils/siwe'

// Composables
export { useBaseURL } from './composables/base'
export {
  useChainConfig,
  useMainChainId,
  useBlockExplorer,
  useEnsureChainIdCheck,
} from './composables/chainId'
export { useEns, useEnsWithAvatar, useEnsProfile } from './composables/ens'
export { useDwebClient, useResolvedUrl } from './composables/uri'
export { useGasPrice } from './composables/gasPrice'
export { usePriceFeed } from './composables/priceFeed'
export { useWalletExplorer } from './composables/walletExplorer'
export type { ExplorerWallet } from './composables/walletExplorer'
export { useSiwe } from './composables/siwe'
export type { SiweSession, UseSiweOptions } from './composables/siwe'

// Connectors
export { inAppWallet, prepareInAppWallet } from './connectors/inAppWallet'

export { clientOnlyComponents } from './client-only'

// Components
export { default as EvmAccount } from './components/EvmAccount.vue'
export { default as EvmAvatar } from './components/EvmAvatar.vue'
export { default as EvmConnect } from './components/EvmConnect.vue'
export { default as EvmConnectDialog } from './components/EvmConnectDialog.vue'
export { default as EvmConnectionStatus } from './components/EvmConnectionStatus.vue'
export { default as EvmProfile } from './components/EvmProfile.vue'
export { default as EvmSidebarProfile } from './components/EvmSidebarProfile.vue'
export { default as EvmSwitchNetwork } from './components/EvmSwitchNetwork.vue'
export { default as EvmConnectorQR } from './components/EvmConnectorQR.vue'
export { default as EvmMetaMaskQR } from './components/EvmMetaMaskQR.vue'
export { default as EvmWalletConnectQR } from './components/EvmWalletConnectQR.vue'
export { default as EvmWalletConnectWallets } from './components/EvmWalletConnectWallets.vue'
export { default as EvmTransactionFlow } from './components/EvmTransactionFlow.vue'
export { default as EvmSeedPhraseInput } from './components/EvmSeedPhraseInput.vue'
export { default as EvmInAppWalletSetup } from './components/EvmInAppWalletSetup.vue'
export { default as EvmSiwe } from './components/EvmSiwe.vue'
export { default as EvmSiweDialog } from './components/EvmSiweDialog.vue'
