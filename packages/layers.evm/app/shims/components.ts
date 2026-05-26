// Pass through config, composables, utils, types, and constants unchanged.
// The component exports below intentionally shadow the originals so that
// `import { EvmConnect } from '@1001-digital/components.evm'` resolves
// through Nuxt's component registry — letting consumer apps or layers
// override any component via their own `app/components/EvmConnect.vue`.
export * from '@1001-digital/components.evm-original'

import { defineComponent, h, resolveComponent, type Component } from 'vue'
import * as Originals from '@1001-digital/components.evm-original'

// No `name:` on the proxy — Vue's `resolveAsset` does a self-name check
// before consulting the global registry, so a same-named proxy would
// resolve back to itself and recurse infinitely. With no name, the lookup
// falls through to the Nuxt-registered original (or a consumer override).
const proxy = <T extends Component>(name: string, fallback: T): T =>
  defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        const resolved = resolveComponent(name, false)
        const target = typeof resolved === 'string' ? fallback : resolved
        return h(target as Component, attrs, slots)
      }
    },
  }) as unknown as T

export const EvmAccount = proxy('EvmAccount', Originals.EvmAccount)
export const EvmAddressInput = proxy(
  'EvmAddressInput',
  Originals.EvmAddressInput,
)
export const EvmArtifact = proxy('EvmArtifact', Originals.EvmArtifact)
export const EvmArtifactModel = proxy(
  'EvmArtifactModel',
  Originals.EvmArtifactModel,
)
export const EvmAvatar = proxy('EvmAvatar', Originals.EvmAvatar)
export const EvmConnect = proxy('EvmConnect', Originals.EvmConnect)
export const EvmConnectAuth = proxy('EvmConnectAuth', Originals.EvmConnectAuth)
export const EvmConnectAuthDialog = proxy(
  'EvmConnectAuthDialog',
  Originals.EvmConnectAuthDialog,
)
export const EvmConnectDialog = proxy(
  'EvmConnectDialog',
  Originals.EvmConnectDialog,
)
export const EvmConnectionStatus = proxy(
  'EvmConnectionStatus',
  Originals.EvmConnectionStatus,
)
export const EvmConnectorQR = proxy('EvmConnectorQR', Originals.EvmConnectorQR)
export const EvmEthInput = proxy('EvmEthInput', Originals.EvmEthInput)
export const EvmInAppWalletSetup = proxy(
  'EvmInAppWalletSetup',
  Originals.EvmInAppWalletSetup,
)
export const EvmMetaMaskQR = proxy('EvmMetaMaskQR', Originals.EvmMetaMaskQR)
export const EvmMultiTransactionFlow = proxy(
  'EvmMultiTransactionFlow',
  Originals.EvmMultiTransactionFlow,
)
export const EvmMultiTransactionFlowDialog = proxy(
  'EvmMultiTransactionFlowDialog',
  Originals.EvmMultiTransactionFlowDialog,
)
export const EvmProfile = proxy('EvmProfile', Originals.EvmProfile)
export const EvmSeedPhraseInput = proxy(
  'EvmSeedPhraseInput',
  Originals.EvmSeedPhraseInput,
)
export const EvmSidebarProfile = proxy(
  'EvmSidebarProfile',
  Originals.EvmSidebarProfile,
)
export const EvmSiwe = proxy('EvmSiwe', Originals.EvmSiwe)
export const EvmSiweDialog = proxy('EvmSiweDialog', Originals.EvmSiweDialog)
export const EvmSwitchNetwork = proxy(
  'EvmSwitchNetwork',
  Originals.EvmSwitchNetwork,
)
export const EvmTransactionFlow = proxy(
  'EvmTransactionFlow',
  Originals.EvmTransactionFlow,
)
export const EvmTransactionFlowDialog = proxy(
  'EvmTransactionFlowDialog',
  Originals.EvmTransactionFlowDialog,
)
export const EvmWalletConnectQR = proxy(
  'EvmWalletConnectQR',
  Originals.EvmWalletConnectQR,
)
export const EvmWalletConnectWallets = proxy(
  'EvmWalletConnectWallets',
  Originals.EvmWalletConnectWallets,
)
