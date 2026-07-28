<template>
  <div class="in-app-wallet-setup">
    <Alert
      v-if="errorMessage"
      type="error"
    >
      {{ errorMessage }}
    </Alert>

    <div
      v-if="step === 'loading' || step === 'connecting'"
      class="setup-step"
    >
      <Loading
        :txt="
          step === 'loading'
            ? 'Loading encrypted wallet…'
            : 'Connecting wallet…'
        "
        spinner
        stacked
      />
    </div>

    <div
      v-else-if="step === 'choose'"
      class="setup-step"
    >
      <p class="muted font-sm">{{ note }}</p>
      <div class="setup-options">
        <Button
          class="block"
          @click="step = 'create'"
        >
          <Icon name="plus" />
          <span>Create New Wallet</span>
        </Button>
        <Button
          class="block"
          @click="step = 'restore'"
        >
          <Icon name="key" />
          <span>Restore Recovery Phrase</span>
        </Button>
      </div>
      <p
        v-if="legacyWalletPresent"
        class="muted font-xs"
      >
        A legacy local wallet was found. It is not read or migrated
        automatically. Restore it with the recovery phrase you saved when it was
        created.
      </p>
      <Button
        class="link muted small"
        @click="$emit('back')"
      >
        <Icon name="chevron-left" />
        <span>Back</span>
      </Button>
    </div>

    <form
      v-else-if="step === 'create'"
      class="setup-step"
      @submit.prevent="createWallet"
    >
      <div>
        <h3>Create an encrypted wallet</h3>
        <p class="muted font-sm">
          This separate vault passphrase encrypts your recovery phrase before it
          is synchronized. Networked cannot recover it for you.
        </p>
      </div>
      <label>
        <span>Vault passphrase</span>
        <input
          v-model="passphrase"
          type="password"
          autocomplete="new-password"
          minlength="12"
          required
        />
      </label>
      <label>
        <span>Confirm passphrase</span>
        <input
          v-model="passphraseConfirmation"
          type="password"
          autocomplete="new-password"
          minlength="12"
          required
        />
      </label>
      <Button
        class="block"
        type="submit"
        :disabled="!validPassphrase"
      >
        Create Wallet
      </Button>
      <Button
        class="link muted small"
        type="button"
        @click="resetToChoose"
      >
        <Icon name="chevron-left" />
        <span>Back</span>
      </Button>
    </form>

    <div
      v-else-if="step === 'backup'"
      class="setup-step"
    >
      <div>
        <h3>Save these 12 words</h3>
        <p class="muted font-sm">
          This recovery phrase is your independent exit if this app or your
          passkey provider becomes unavailable. It will only be shown again
          after unlocking the vault.
        </p>
      </div>
      <div class="generated-words">
        <div
          v-for="(word, index) in generatedWords"
          :key="`${index}-${word}`"
          class="generated-word"
        >
          <span class="word-number">{{ index + 1 }}</span>
          <span class="word-text">{{ word }}</span>
        </div>
      </div>
      <FormCheckbox v-model="backupConfirmed">
        I saved my recovery phrase somewhere safe
      </FormCheckbox>
      <Button
        class="block"
        :disabled="!backupConfirmed"
        @click="connectWallet"
      >
        Continue
      </Button>
      <Button
        class="link muted small"
        @click="addPasskey"
      >
        Add a passkey first (optional)
      </Button>
    </div>

    <form
      v-else-if="step === 'restore'"
      class="setup-step"
      @submit.prevent="restoreWallet"
    >
      <div>
        <h3>Restore wallet</h3>
        <p class="muted font-sm">
          Enter the original 12-word phrase and choose a new vault passphrase
          for synchronized unlock.
        </p>
      </div>
      <EvmSeedPhraseInput
        v-model="restorePhrase"
        @valid="restoreValid = $event"
        @submit="restoreWallet"
      />
      <label>
        <span>New vault passphrase</span>
        <input
          v-model="passphrase"
          type="password"
          autocomplete="new-password"
          minlength="12"
          required
        />
      </label>
      <label>
        <span>Confirm passphrase</span>
        <input
          v-model="passphraseConfirmation"
          type="password"
          autocomplete="new-password"
          minlength="12"
          required
        />
      </label>
      <Button
        class="block"
        type="submit"
        :disabled="!restoreValid || !validPassphrase"
      >
        Restore Wallet
      </Button>
      <Button
        class="link muted small"
        type="button"
        @click="resetToChoose"
      >
        <Icon name="chevron-left" />
        <span>Back</span>
      </Button>
    </form>

    <form
      v-else-if="step === 'unlock'"
      class="setup-step"
      @submit.prevent="unlockWallet"
    >
      <div>
        <h3>Unlock in-app wallet</h3>
        <p class="muted font-sm">
          The encrypted vault is synchronized. Unlocking happens only in this
          browser tab.
        </p>
      </div>
      <label>
        <span>Vault passphrase</span>
        <input
          v-model="passphrase"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>
      <Button
        class="block"
        type="submit"
        :disabled="!passphrase"
      >
        Unlock
      </Button>
      <Button
        v-for="passkey in snapshot.passkeys"
        :key="passkey.id"
        class="block"
        type="button"
        @click="unlockWithPasskey(passkey.id)"
      >
        <Icon name="key" />
        <span>Use {{ passkey.label || 'passkey' }}</span>
      </Button>
      <Button
        class="link muted small"
        type="button"
        @click="$emit('back')"
      >
        <Icon name="chevron-left" />
        <span>Back</span>
      </Button>
    </form>

    <div
      v-else-if="step === 'ready'"
      class="setup-step"
    >
      <p class="muted font-sm">
        Encrypted wallet
        {{ snapshot.address ? shortAddress(snapshot.address) : '' }} is unlocked
        for this tab.
      </p>
      <Button
        class="block"
        @click="connectWallet"
      >
        Continue with In App
      </Button>
      <Button
        class="link muted small"
        @click="addPasskey"
      >
        Add another passkey
      </Button>
      <Button
        class="link muted small"
        @click="$emit('back')"
      >
        <Icon name="chevron-left" />
        <span>Back</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConnect, useConnectors } from '@wagmi/vue'
import {
  Alert,
  Button,
  FormCheckbox,
  Icon,
  Loading,
} from '@1001-digital/components'
import EvmSeedPhraseInput from './EvmSeedPhraseInput.vue'
import { useEvmInAppWallet } from '../composables/inAppWallet'
import { shortAddress } from '../utils/addresses'
import type {
  EvmInAppWalletSetupEmits,
  EvmInAppWalletSetupProps,
} from '../types'

const props = withDefaults(defineProps<EvmInAppWalletSetupProps>(), {
  note: 'Create or restore a wallet whose recovery phrase is encrypted in this browser before synchronization.',
})
const emit = defineEmits<EvmInAppWalletSetupEmits>()

const controller = useEvmInAppWallet()
const snapshot = computed(() => controller.snapshot.value)
const connectors = useConnectors()
const { mutateAsync: connectAsync } = useConnect()
const inAppConnector = computed(() =>
  connectors.value.find((connector) => connector.type === 'inAppWallet'),
)

type Step =
  | 'loading'
  | 'choose'
  | 'create'
  | 'backup'
  | 'restore'
  | 'unlock'
  | 'ready'
  | 'connecting'

const step = ref<Step>('loading')
const errorMessage = ref('')
const passphrase = ref('')
const passphraseConfirmation = ref('')
const restorePhrase = ref('')
const restoreValid = ref(false)
const generatedWords = ref<string[]>([])
const backupConfirmed = ref(false)
const legacyWalletPresent = ref(false)

const validPassphrase = computed(
  () =>
    passphrase.value.length >= 12 &&
    passphrase.value === passphraseConfirmation.value,
)

function resetToChoose() {
  errorMessage.value = ''
  passphrase.value = ''
  passphraseConfirmation.value = ''
  step.value = 'choose'
}

function setError(error: unknown) {
  errorMessage.value =
    error instanceof Error ? error.message : 'Wallet operation failed'
}

async function createWallet() {
  if (!validPassphrase.value) return
  errorMessage.value = ''
  try {
    const result = await controller.keyring.create({
      passphrase: passphrase.value,
      scope: controller.host.scope,
    })
    generatedWords.value = result.mnemonic.split(' ')
    passphrase.value = ''
    passphraseConfirmation.value = ''
    step.value = 'backup'
  } catch (error) {
    setError(error)
  }
}

async function restoreWallet() {
  if (!restoreValid.value || !validPassphrase.value) return
  errorMessage.value = ''
  try {
    await controller.keyring.restore({
      mnemonic: restorePhrase.value,
      passphrase: passphrase.value,
      scope: controller.host.scope,
    })
    restorePhrase.value = ''
    passphrase.value = ''
    passphraseConfirmation.value = ''
    step.value = 'ready'
  } catch (error) {
    setError(error)
  }
}

async function unlockWallet() {
  errorMessage.value = ''
  try {
    await controller.keyring.unlockWithPassphrase(passphrase.value)
    passphrase.value = ''
    step.value = 'ready'
  } catch (error) {
    setError(error)
  }
}

async function unlockWithPasskey(slotId: string) {
  errorMessage.value = ''
  try {
    await controller.keyring.unlockWithPasskey(slotId)
    step.value = 'ready'
  } catch (error) {
    setError(error)
  }
}

async function addPasskey() {
  errorMessage.value = ''
  try {
    await controller.addPasskey()
  } catch (error) {
    setError(error)
  }
}

async function connectWallet() {
  if (!inAppConnector.value) {
    errorMessage.value = 'In-app wallet connector is unavailable'
    return
  }
  step.value = 'connecting'
  try {
    await connectAsync({ connector: inAppConnector.value })
    emit('connected')
  } catch (error) {
    setError(error)
    step.value = controller.keyring.isUnlocked ? 'ready' : 'unlock'
  }
}

onMounted(async () => {
  legacyWalletPresent.value =
    localStorage.getItem('evm:in-app-wallet-pk') !== null
  try {
    if (!controller.keyring.document) await controller.keyring.load()
    step.value = !controller.keyring.document
      ? 'choose'
      : controller.keyring.isUnlocked
        ? 'ready'
        : 'unlock'
  } catch (error) {
    setError(error)
    step.value = 'choose'
  }
})
</script>

<style scoped>
.in-app-wallet-setup,
.setup-step {
  display: grid;
  gap: var(--spacer);
}

.setup-options {
  display: grid;
  gap: var(--spacer);
}

label {
  display: grid;
  gap: var(--spacer-xs);
}

.generated-words {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacer-sm);
}

.generated-word {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacer-sm);
}

.word-number {
  min-width: 1.5em;
  color: var(--muted);
  font-size: var(--font-xs);
  text-align: right;
  user-select: none;
}

.word-text {
  font-family: var(--font-mono, monospace);
  font-size: var(--font-sm);
}

.link.muted {
  justify-self: center;
}
</style>
