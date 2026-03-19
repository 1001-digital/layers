import type { Address, Hash, TransactionReceipt } from 'viem'

// EvmAccount
export interface EvmAccountProps {
  address?: Address
}

// EvmAvatar
export interface EvmAvatarProps {
  address?: Address
  large?: boolean
}

// EvmConnect
export interface EvmConnectEmits {
  connecting: []
  connected: []
}

// EvmConnectDialog
export interface EvmConnectDialogProps {
  className?: string
}

export interface EvmConnectDialogEmits {
  connected: [{ address: `0x${string}` | undefined }]
  disconnected: []
}

// EvmProfile
export interface EvmProfileProps {
  className?: string
}

export interface EvmProfileEmits {
  disconnected: []
}

// EvmSwitchNetwork
export interface EvmSwitchNetworkProps {
  className?: string
}

export interface EvmSwitchNetworkEmits {
  switched: [{ chainId: number; name: string }]
  error: [{ message: string }]
}

// EvmConnectorQR
export interface EvmConnectorQRProps {
  uri: string
}

// EvmMetaMaskQR
export interface EvmMetaMaskQRProps {
  uri: string
}

export interface EvmMetaMaskQREmits {
  back: []
}

// EvmWalletConnectQR
export interface EvmWalletConnectQRProps {
  uri: string
}

// EvmWalletConnectWallets
export interface EvmWalletConnectWalletsProps {
  uri: string
}

export interface EvmWalletConnectWalletsEmits {
  back: []
}

// EvmTransactionFlow
export interface TransactionFlowText {
  title?: Record<string, string>
  lead?: Record<string, string>
  action?: Record<string, string>
}

export interface EvmTransactionFlowProps {
  chain?: string
  text?: TransactionFlowText
  request?: () => Promise<Hash>
  delayAfter?: number
  delayAutoclose?: number
  skipConfirmation?: boolean
  autoCloseSuccess?: boolean
  dismissable?: boolean
}

export interface EvmTransactionFlowEmits {
  complete: [receipt: TransactionReceipt]
  cancel: []
}

// EvmSeedPhraseInput
export interface EvmSeedPhraseInputProps {
  modelValue?: string
  disabled?: boolean
}

export interface EvmSeedPhraseInputEmits {
  'update:modelValue': [value: string]
  valid: [isValid: boolean]
  submit: []
}

// EvmInAppWalletSetup
export interface EvmInAppWalletSetupProps {
  note?: string
}

export interface EvmInAppWalletSetupEmits {
  connected: []
  back: []
}

// EvmSiwe
export interface EvmSiweProps {
  getNonce: () => Promise<string>
  verify: (message: string, signature: string) => Promise<boolean | void>
  domain?: string
  statement?: string
  uri?: string
  resources?: string[]
  requestId?: string
  expirationTime?: string
}

export interface EvmSiweEmits {
  authenticated: [{ address: `0x${string}`; chainId: number }]
  error: [error: string]
}

// EvmSidebarProfile
export interface EvmSidebarProfileEmits {
  disconnected: []
}

// EvmSiweDialog
export interface EvmSiweDialogProps extends EvmSiweProps {
  className?: string
}

export interface EvmSiweDialogEmits {
  authenticated: [{ address: `0x${string}`; chainId: number }]
  signedOut: []
  error: [error: string]
}
