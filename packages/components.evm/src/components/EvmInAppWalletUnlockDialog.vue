<template>
  <Dialog
    v-if="controller"
    v-model:open="open"
    title="Unlock in-app wallet"
  >
    <form
      class="unlock-wallet"
      @submit.prevent="unlock"
    >
      <p class="muted font-sm">
        Unlock the encrypted wallet for this tab to continue the signing
        request.
      </p>
      <Alert
        v-if="errorMessage"
        type="error"
      >
        {{ errorMessage }}
      </Alert>
      <label>
        <span>Vault passphrase</span>
        <input
          v-model="passphrase"
          type="password"
          autocomplete="current-password"
          required
          autofocus
        />
      </label>
      <Button
        class="block"
        type="submit"
        :disabled="busy || !passphrase"
      >
        {{ busy ? 'Unlocking…' : 'Unlock and continue' }}
      </Button>
      <Button
        v-for="passkey in controller.snapshot.value.passkeys"
        :key="passkey.id"
        class="block"
        type="button"
        :disabled="busy"
        @click="unlockWithPasskey(passkey.id)"
      >
        <Icon name="key" />
        <span>Use {{ passkey.label || 'passkey' }}</span>
      </Button>
      <Button
        class="link muted small"
        type="button"
        @click="cancel"
      >
        Cancel
      </Button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Alert, Button, Dialog, Icon } from '@1001-digital/components'
import { useOptionalEvmInAppWallet } from '../composables/inAppWallet'
import type { EvmInAppWalletUnlockDialogEmits } from '../types'

const emit = defineEmits<EvmInAppWalletUnlockDialogEmits>()
const controller = useOptionalEvmInAppWallet()
const passphrase = ref('')
const errorMessage = ref('')
const busy = ref(false)

const open = computed({
  get: () => controller?.unlockRequested.value ?? false,
  set: (value: boolean) => {
    if (!value && controller?.unlockRequested.value) cancel()
  },
})

function setError(error: unknown) {
  errorMessage.value =
    error instanceof Error ? error.message : 'Wallet unlock failed'
}

async function unlock() {
  if (!controller || !passphrase.value) return
  busy.value = true
  errorMessage.value = ''
  try {
    await controller.unlockWithPassphrase(passphrase.value)
    passphrase.value = ''
    emit('unlocked')
  } catch (error) {
    setError(error)
  } finally {
    busy.value = false
  }
}

async function unlockWithPasskey(slotId: string) {
  if (!controller) return
  busy.value = true
  errorMessage.value = ''
  try {
    await controller.unlockWithPasskey(slotId)
    emit('unlocked')
  } catch (error) {
    setError(error)
  } finally {
    busy.value = false
  }
}

function cancel() {
  controller?.cancelUnlock()
  passphrase.value = ''
  errorMessage.value = ''
  emit('cancelled')
}
</script>

<style scoped>
.unlock-wallet,
label {
  display: grid;
  gap: var(--spacer);
}

label {
  gap: var(--spacer-xs);
}

.link.muted {
  justify-self: center;
}
</style>
