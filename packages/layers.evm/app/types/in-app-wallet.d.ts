import type { EvmInAppWalletController } from '@1001-digital/components.evm'

declare module '#app' {
  interface NuxtApp {
    $evmInAppWallet: EvmInAppWalletController | null
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $evmInAppWallet: EvmInAppWalletController | null
  }
}

export {}
