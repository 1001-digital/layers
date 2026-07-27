# EVM Components

EVM components come from `@1001-digital/components.evm`. Nuxt apps usually receive them through `@1001-digital/layers.evm`; direct Vue consumers can import them from the package.

Components that require wallet or browser APIs are marked client-only by the Nuxt layer.

## Wallet Connection

| Component                 | Purpose                             | Key API                                              |
| ------------------------- | ----------------------------------- | ---------------------------------------------------- |
| `EvmConnect`              | Inline wallet connection UI.        | Emits `connecting`, `connected`.                     |
| `EvmConnectDialog`        | Dialog-based wallet connection.     | Prop `className`; emits `connected`, `disconnected`. |
| `EvmConnectionStatus`     | Displays current connection status. | Uses wagmi connection state.                         |
| `EvmConnectorQR`          | Generic QR connector UI.            | Prop `uri`.                                          |
| `EvmMetaMaskQR`           | MetaMask QR flow.                   | Prop `uri`; emits `back`.                            |
| `EvmWalletConnectQR`      | WalletConnect QR flow.              | Prop `uri`.                                          |
| `EvmWalletConnectWallets` | WalletConnect wallet list.          | Prop `uri`; emits `back`.                            |
| `EvmInAppWalletSetup`     | In-app wallet setup UI.             | Prop `note`; emits `connected`, `back`.              |
| `EvmSeedPhraseInput`      | Seed phrase input.                  | `v-model`, `disabled`; emits `valid`, `submit`.      |

```vue
<template>
  <EvmConnectDialog
    @connected="onConnected"
    @disconnected="onDisconnected"
  >
    <template #connected="{ address }">
      <p>
        Connected as
        <EvmAccount :address="address" />
      </p>
    </template>
  </EvmConnectDialog>
</template>
```

## Accounts, Inputs, and Profiles

| Component           | Purpose                                               | Key API                                                                         |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `EvmAccount`        | Short account display with optional ENS resolution.   | Props `address`, `resolveEns`.                                                  |
| `EvmAddressInput`   | Address or ENS input.                                 | Prop `placeholder`; uses `v-model`.                                             |
| `EvmAmountInput`    | Token amount input with symbol suffix and max button. | `v-model`, `v-model:units`, props `decimals`, `symbol`, `balance`; emits `max`. |
| `EvmEthInput`       | ETH amount input with parsed wei output.              | `v-model`, `v-model:wei`, `placeholder`, `balance`.                             |
| `EvmAvatar`         | ENS avatar or generated fallback.                     | Props `address`, `large`.                                                       |
| `EvmProfile`        | Wallet profile display.                               | Prop `className`; emits `disconnected`.                                         |
| `EvmSidebarProfile` | Sidebar profile variant.                              | Emits `disconnected`.                                                           |
| `EvmSwitchNetwork`  | Network switching UI.                                 | Prop `className`; emits `switched`, `error`.                                    |

```vue
<template>
  <FormLabel label="Recipient">
    <EvmAddressInput v-model="recipient" />
  </FormLabel>

  <FormLabel label="Amount">
    <EvmEthInput
      v-model="eth"
      v-model:wei="wei"
    />
  </FormLabel>

  <FormLabel label="USDC">
    <EvmAmountInput
      v-model="usdc"
      v-model:units="usdcUnits"
      :decimals="6"
      symbol="USDC"
      :balance="usdcBalance"
    />
  </FormLabel>

  <EvmAccount
    v-if="recipient"
    :address="recipient"
    resolve-ens
  />
</template>
```

## Transaction Flow

| Component                  | Purpose                                     | Key API                                                                                    |
| -------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `EvmTransactionFlow`       | Inline transaction state machine UI.        | Props `chain`, `request`, `text`, timing flags; emits `complete`, `cancel`, `update:step`. |
| `EvmTransactionFlowDialog` | Dialog wrapper around the transaction flow. | Same flow props; emits `complete`, `cancel`.                                               |

```vue
<template>
  <EvmTransactionFlowDialog
    chain="sepolia"
    :request="mint"
    @complete="onComplete"
  >
    <template #start="{ start }">
      <Button
        class="primary"
        @click="start"
      >
        Mint
      </Button>
    </template>
  </EvmTransactionFlowDialog>
</template>

<script setup lang="ts">
import type { Hash } from 'viem'

const mint = async (): Promise<Hash> => {
  // Return the transaction hash after requesting the wallet signature.
  return '0x...' as Hash
}
</script>
```

The transaction flow checks chain selection, requests a transaction, waits for a receipt, and either keeps UI open or moves waiting state into a toast depending on its options.

## SIWE and Auth

| Component              | Purpose                               | Key API                                                                   |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| `EvmSiwe`              | Inline Sign-In with Ethereum flow.    | Requires `getNonce` and `verify`; emits `authenticated`, `error`.         |
| `EvmSiweDialog`        | Dialog-based SIWE flow.               | SIWE props plus `className`; emits `authenticated`, `signedOut`, `error`. |
| `EvmConnectAuth`       | Wallet connect plus SIWE auth flow.   | SIWE props; emits connection and auth events.                             |
| `EvmConnectAuthDialog` | Dialog wrapper for connect plus SIWE. | SIWE props plus `className`, `noTrigger`.                                 |

```vue
<template>
  <EvmConnectAuthDialog
    :get-nonce="getNonce"
    :verify="verify"
    statement="Sign in to continue."
    @authenticated="onAuthenticated"
  />
</template>
```

Your application owns nonce generation, session storage, and server-side verification. These components own the client interaction flow.

## Artifacts

| Component     | Purpose                                                              | Key API                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EvmArtifact` | NFT/media artifact preview with image, animation, and model support. | Props `metadata`, `image`, `animationUrl`, `name`, `backgroundColor`, `useBackgroundColor`, `aspectRatio`, `controls`, `muted`; emits `error`. Videos autoplay muted by default — set `controls` so viewers can unmute audio. |

```vue
<template>
  <EvmArtifact
    :metadata="metadata"
    aspect-ratio="1 / 1"
    use-background-color
    @error="onMediaError"
  />
</template>
```

`EvmArtifact` can use optional peer dependencies such as `@1001-digital/resolve-metadata` and `@google/model-viewer` when your app needs richer metadata or 3D model previews.

## Direct Imports

```ts
import {
  EvmAccount,
  EvmEthInput,
  EvmConnectDialog,
  EvmTransactionFlowDialog,
  shortAddress,
} from '@1001-digital/components.evm'
```

When bypassing the Nuxt layer, install and configure the required peers yourself, including Vue, wagmi, viem, and any optional artifact dependencies you use.
