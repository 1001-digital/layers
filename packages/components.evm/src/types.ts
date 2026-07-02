import type { Address, Hash, TransactionReceipt } from 'viem'

// Structurally compatible with @1001-digital/resolve-metadata's TokenMetadata
// (kept local so consumers don't need that optional peer dep installed to type-check).
interface TokenMetadata {
  name: string | null
  image: string | null
  animation_url: string | null
  background_color: string | null
}

// EvmAddressInput
export interface EvmAddressInputProps {
  placeholder?: string
}

// EvmAmountInput
export interface EvmAmountInputProps {
  decimals?: number
  symbol?: string | false
  balance?: bigint | null
  placeholder?: string
}

export interface EvmAmountInputEmits {
  max: [balance: bigint]
}

// EvmEthInput
export interface EvmEthInputProps {
  placeholder?: string
  suffix?: string | false
  balance?: bigint | null
}

// EvmAccount
export interface EvmAccountProps {
  address?: Address
  resolveEns?: boolean
}

// EvmArtifact
export interface EvmArtifactProps {
  metadata?: Partial<TokenMetadata>
  image?: string | null
  animationUrl?: string | null
  name?: string | null
  backgroundColor?: string | null
  useBackgroundColor?: boolean
  aspectRatio?: string | number
}

export interface EvmArtifactEmits {
  error: [{ kind: 'image' | 'animation' | 'model'; url: string }]
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
  chain?: string | number
  text?: TransactionFlowText
  request?: () => Promise<Hash>
  delayAfter?: number
  delayAutoclose?: number
  skipConfirmation?: boolean
  autoCloseSuccess?: boolean
  dismissable?: boolean
  keepOpen?: boolean
}

export interface EvmTransactionFlowEmits {
  complete: [receipt: TransactionReceipt]
  cancel: []
  'update:step': [step: string]
}

// EvmTransactionFlowDialog
export interface EvmTransactionFlowDialogProps extends EvmTransactionFlowProps {}

export interface EvmTransactionFlowDialogEmits {
  complete: [receipt: TransactionReceipt]
  cancel: []
}

// EvmMultiTransactionFlow
export type MultiTransactionFlowStepStatus =
  | 'idle'
  | 'confirm'
  | 'chain'
  | 'requesting'
  | 'waiting'
  | 'complete'
  | 'skipped'
  | 'error'

export interface MultiTransactionFlowStepContext {
  stepIndex: number
  hashes: Hash[]
  receipts: TransactionReceipt[]
  results: unknown[]
}

export interface MultiTransactionFlowStep {
  id: string
  title?: string
  lead?: string
  action?: string
  chain?: string | number
  request: (context: MultiTransactionFlowStepContext) => Promise<Hash>
  skip?: (
    context: MultiTransactionFlowStepContext,
  ) => boolean | Promise<boolean>
  result?: (
    receipt: TransactionReceipt,
    context: MultiTransactionFlowStepContext,
  ) => unknown | Promise<unknown>
}

export interface MultiTransactionFlowStepState {
  id: string
  status: MultiTransactionFlowStepStatus
  tx: Hash | null
  receipt: TransactionReceipt | null
  txLink: string
  error: string
}

export interface MultiTransactionFlowText {
  title?: Record<string, string>
  lead?: Record<string, string>
  action?: Record<string, string>
}

export interface EvmMultiTransactionFlowProps {
  steps: MultiTransactionFlowStep[]
  chain?: string | number
  text?: MultiTransactionFlowText
  delayAfter?: number
  delayAutoclose?: number
  skipConfirmation?: boolean
  autoCloseSuccess?: boolean
  dismissable?: boolean
}

export interface EvmMultiTransactionFlowEmits {
  complete: [receipts: TransactionReceipt[]]
  cancel: []
  error: [error: string, step: MultiTransactionFlowStep, stepIndex: number]
  'update:step': [step: string]
  'update:stepIndex': [stepIndex: number]
}

// EvmMultiTransactionFlowDialog
export interface EvmMultiTransactionFlowDialogProps extends EvmMultiTransactionFlowProps {
  title?: string
}

export interface EvmMultiTransactionFlowDialogEmits {
  complete: [receipts: TransactionReceipt[]]
  cancel: []
  error: [error: string, step: MultiTransactionFlowStep, stepIndex: number]
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
  autoSignIn?: boolean
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

// EvmConnectAuth
export type EvmConnectAuthProps = EvmSiweProps

export interface EvmConnectAuthEmits {
  connecting: []
  connected: [{ address: `0x${string}` | undefined }]
  authenticated: [{ address: `0x${string}`; chainId: number }]
  signedOut: []
  error: [error: string]
}

// EvmConnectAuthDialog
export interface EvmConnectAuthDialogProps extends EvmSiweProps {
  className?: string
  noTrigger?: boolean
}

export interface EvmConnectAuthDialogEmits {
  connected: [{ address: `0x${string}` | undefined }]
  disconnected: []
  authenticated: [{ address: `0x${string}`; chainId: number }]
  signedOut: []
  error: [error: string]
}
