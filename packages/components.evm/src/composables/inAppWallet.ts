import {
  computed,
  inject,
  readonly,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import {
  EncryptedWalletKeyring,
  WalletLockedError,
  type PasskeyRegistrationOptions,
  type UnlockReason,
  type WalletKeyringSnapshot,
  type WalletVaultStore,
} from '../connectors/inAppWallet'

export type EvmInAppWalletHost = {
  store: WalletVaultStore
  scope: string
  rpName: string
  rpId?: string
  userName?: string
}

let configuredHost: EvmInAppWalletHost | null = null

export function configureEvmInAppWalletHost(
  host: EvmInAppWalletHost | null,
): void {
  configuredHost = host
}

export function getConfiguredEvmInAppWalletHost(): EvmInAppWalletHost | null {
  return configuredHost
}

export class EvmInAppWalletController {
  readonly keyring: EncryptedWalletKeyring
  readonly host: EvmInAppWalletHost
  readonly snapshot: Ref<WalletKeyringSnapshot>
  readonly unlockReason: Readonly<Ref<UnlockReason | null>>
  readonly unlockRequested: ComputedRef<boolean>

  readonly #pendingReason = shallowRef<UnlockReason | null>(null)
  #resolveUnlock: (() => void) | null = null
  #rejectUnlock: ((error: unknown) => void) | null = null
  readonly #unsubscribe: () => void

  constructor(keyring: EncryptedWalletKeyring, host: EvmInAppWalletHost) {
    this.keyring = keyring
    this.host = host
    this.snapshot = shallowRef(keyring.snapshot())
    this.unlockReason = readonly(this.#pendingReason)
    this.unlockRequested = computed(() => this.#pendingReason.value !== null)
    this.#unsubscribe = keyring.subscribe((snapshot) => {
      this.snapshot.value = snapshot
    })
  }

  requestUnlock = (reason: UnlockReason): Promise<void> => {
    if (this.keyring.isUnlocked) return Promise.resolve()
    this.cancelUnlock()
    this.#pendingReason.value = reason
    return new Promise<void>((resolve, reject) => {
      this.#resolveUnlock = resolve
      this.#rejectUnlock = reject
    })
  }

  async unlockWithPassphrase(passphrase: string): Promise<void> {
    await this.keyring.unlockWithPassphrase(passphrase)
    this.completeUnlock()
  }

  async unlockWithPasskey(slotId?: string): Promise<void> {
    await this.keyring.unlockWithPasskey(slotId)
    this.completeUnlock()
  }

  async addPasskey(label?: string): Promise<void> {
    const options: PasskeyRegistrationOptions = {
      rpName: this.host.rpName,
      rpId: this.host.rpId,
      userName: this.host.userName,
      label,
    }
    await this.keyring.addPasskey(options)
  }

  completeUnlock(): void {
    if (!this.keyring.isUnlocked) throw new WalletLockedError()
    this.#resolveUnlock?.()
    this.#clearUnlock()
  }

  cancelUnlock(): void {
    this.#rejectUnlock?.(new WalletLockedError('Wallet unlock cancelled'))
    this.#clearUnlock()
  }

  destroy(): void {
    this.cancelUnlock()
    this.#unsubscribe()
    this.keyring.destroy()
  }

  #clearUnlock(): void {
    this.#pendingReason.value = null
    this.#resolveUnlock = null
    this.#rejectUnlock = null
  }
}

export const EvmInAppWalletControllerKey: InjectionKey<EvmInAppWalletController> =
  Symbol('EvmInAppWalletController')

export function useEvmInAppWallet(): EvmInAppWalletController {
  const controller = inject(EvmInAppWalletControllerKey)
  if (!controller) {
    throw new Error(
      'The in-app wallet is not enabled or its controller was not provided',
    )
  }
  return controller
}

export function useOptionalEvmInAppWallet(): EvmInAppWalletController | null {
  return inject(EvmInAppWalletControllerKey, null)
}
