<template>
  <section
    v-if="controller?.keyring.document"
    class="wallet-manager"
  >
    <header>
      <h3>In-app wallet</h3>
      <EvmAccount
        v-if="snapshot.address"
        :address="snapshot.address"
      />
    </header>

    <Alert
      v-if="message"
      :type="messageType"
    >
      {{ message }}
    </Alert>

    <form
      v-if="snapshot.status !== 'unlocked'"
      class="manager-section"
      @submit.prevent="unlock"
    >
      <label>
        <span>Vault passphrase</span>
        <input
          v-model="currentPassphrase"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>
      <Button
        type="submit"
        :disabled="busy || !currentPassphrase"
      >
        Unlock wallet settings
      </Button>
      <Button
        v-for="passkey in snapshot.passkeys"
        :key="passkey.id"
        type="button"
        :disabled="busy"
        @click="unlockWithPasskey(passkey.id)"
      >
        Use {{ passkey.label || 'passkey' }}
      </Button>
    </form>

    <template v-else>
      <div class="manager-section">
        <h4>Recovery</h4>
        <p class="muted font-sm">
          Anyone with these words controls the wallet. Reveal them only in a
          private place.
        </p>
        <Button
          v-if="!recoveryPhrase"
          :disabled="busy"
          @click="revealRecoveryPhrase"
        >
          Reveal recovery phrase
        </Button>
        <div
          v-else
          class="recovery-phrase"
        >
          {{ recoveryPhrase }}
        </div>
      </div>

      <div class="manager-section">
        <h4>Passkeys</h4>
        <div
          v-for="passkey in snapshot.passkeys"
          :key="passkey.id"
          class="passkey-row"
        >
          <span>{{ passkey.label || 'Passkey' }}</span>
          <Button
            class="link danger small"
            :disabled="busy"
            @click="removePasskey(passkey.id)"
          >
            Remove
          </Button>
        </div>
        <Button
          :disabled="busy"
          @click="addPasskey"
        >
          Add passkey
        </Button>
      </div>

      <form
        class="manager-section"
        @submit.prevent="changePassphrase"
      >
        <h4>Change vault passphrase</h4>
        <label>
          <span>New passphrase</span>
          <input
            v-model="newPassphrase"
            type="password"
            autocomplete="new-password"
            minlength="12"
            required
          />
        </label>
        <label>
          <span>Confirm new passphrase</span>
          <input
            v-model="newPassphraseConfirmation"
            type="password"
            autocomplete="new-password"
            minlength="12"
            required
          />
        </label>
        <Button
          type="submit"
          :disabled="busy || !validNewPassphrase"
        >
          Change passphrase
        </Button>
      </form>

      <div class="manager-actions">
        <Button @click="lock">Lock wallet</Button>
        <Button
          v-if="legacyWalletPresent"
          class="link danger small"
          @click="removeLegacyWallet"
        >
          Remove legacy plaintext key from this device
        </Button>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Alert, Button } from '@1001-digital/components'
import EvmAccount from './EvmAccount.vue'
import { useOptionalEvmInAppWallet } from '../composables/inAppWallet'

const controller = useOptionalEvmInAppWallet()
const snapshot = computed(
  () =>
    controller?.snapshot.value ?? {
      status: 'empty' as const,
      address: null,
      revision: null,
      passkeys: [],
    },
)
const busy = ref(false)
const currentPassphrase = ref('')
const newPassphrase = ref('')
const newPassphraseConfirmation = ref('')
const recoveryPhrase = ref('')
const legacyWalletPresent = ref(false)
const message = ref('')
const messageType = ref<'info' | 'error'>('info')

const validNewPassphrase = computed(
  () =>
    newPassphrase.value.length >= 12 &&
    newPassphrase.value === newPassphraseConfirmation.value,
)

function notify(value: string, type: 'info' | 'error' = 'info') {
  message.value = value
  messageType.value = type
}

async function run(action: () => Promise<void>) {
  busy.value = true
  message.value = ''
  try {
    await action()
  } catch (error) {
    notify(
      error instanceof Error ? error.message : 'Wallet operation failed',
      'error',
    )
  } finally {
    busy.value = false
  }
}

async function unlock() {
  if (!controller) return
  await run(async () => {
    await controller.keyring.unlockWithPassphrase(currentPassphrase.value)
    currentPassphrase.value = ''
  })
}

async function unlockWithPasskey(slotId: string) {
  if (!controller) return
  await run(() => controller.keyring.unlockWithPasskey(slotId))
}

async function revealRecoveryPhrase() {
  if (!controller) return
  await run(async () => {
    recoveryPhrase.value = await controller.keyring.exportMnemonic()
  })
}

async function addPasskey() {
  if (!controller) return
  await run(async () => {
    await controller.addPasskey()
    notify('Passkey added')
  })
}

async function removePasskey(slotId: string) {
  if (!controller) return
  await run(async () => {
    await controller.keyring.removePasskey(slotId)
    notify('Passkey removed')
  })
}

async function changePassphrase() {
  if (!controller || !validNewPassphrase.value) return
  await run(async () => {
    await controller.keyring.changePassphrase(newPassphrase.value)
    newPassphrase.value = ''
    newPassphraseConfirmation.value = ''
    notify('Vault passphrase changed')
  })
}

function lock() {
  controller?.keyring.lock()
  recoveryPhrase.value = ''
  notify('Wallet locked')
}

function removeLegacyWallet() {
  localStorage.removeItem('evm:in-app-wallet-pk')
  legacyWalletPresent.value = false
  notify('Legacy plaintext key removed from this device')
}

onMounted(() => {
  legacyWalletPresent.value =
    localStorage.getItem('evm:in-app-wallet-pk') !== null
})
</script>

<style scoped>
.wallet-manager,
.manager-section,
label {
  display: grid;
  gap: var(--spacer);
}

.manager-section {
  padding-block: var(--spacer);
  border-top: var(--border);
}

label {
  gap: var(--spacer-xs);
}

.passkey-row,
.manager-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacer);
}

.manager-actions {
  align-items: flex-start;
  flex-direction: column;
}

.recovery-phrase {
  padding: var(--spacer);
  border: var(--border);
  border-radius: var(--border-radius);
  font-family: var(--font-mono, monospace);
  user-select: all;
}
</style>
