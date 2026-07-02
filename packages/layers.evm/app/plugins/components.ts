import {
  EvmAccount,
  EvmAddressInput,
  EvmAmountInput,
  EvmArtifact,
  EvmArtifactModel,
  EvmAvatar,
  EvmConnect,
  EvmConnectAuth,
  EvmConnectAuthDialog,
  EvmConnectDialog,
  EvmConnectionStatus,
  EvmConnectorQR,
  EvmEthInput,
  EvmInAppWalletSetup,
  EvmMetaMaskQR,
  EvmMultiTransactionFlow,
  EvmMultiTransactionFlowDialog,
  EvmProfile,
  EvmSeedPhraseInput,
  EvmSidebarProfile,
  EvmSiwe,
  EvmSiweDialog,
  EvmSwitchNetwork,
  EvmTransactionFlow,
  EvmTransactionFlowDialog,
  EvmWalletConnectQR,
  EvmWalletConnectWallets,
} from '#components'

// Components that the `app/shims/components.ts` facade proxies. Each proxy
// calls `resolveComponent(name)` at render time — for that to find the
// right component (consumer override or layer fallback), the name must be
// in the app's global component registry. Nuxt only auto-imports these as
// named imports, so we register them globally here. Whichever component
// Nuxt picked at scan time wins (consumer's `app/components/<Name>.vue`
// beats the layer's package-level file).
const shadowed = {
  EvmAccount,
  EvmAddressInput,
  EvmAmountInput,
  EvmArtifact,
  EvmArtifactModel,
  EvmAvatar,
  EvmConnect,
  EvmConnectAuth,
  EvmConnectAuthDialog,
  EvmConnectDialog,
  EvmConnectionStatus,
  EvmConnectorQR,
  EvmEthInput,
  EvmInAppWalletSetup,
  EvmMetaMaskQR,
  EvmMultiTransactionFlow,
  EvmMultiTransactionFlowDialog,
  EvmProfile,
  EvmSeedPhraseInput,
  EvmSidebarProfile,
  EvmSiwe,
  EvmSiweDialog,
  EvmSwitchNetwork,
  EvmTransactionFlow,
  EvmTransactionFlowDialog,
  EvmWalletConnectQR,
  EvmWalletConnectWallets,
}

export default defineNuxtPlugin((nuxtApp) => {
  for (const [name, component] of Object.entries(shadowed)) {
    if (component) {
      nuxtApp.vueApp.component(name, component as never)
    }
  }
})
