<template>
  <div class="in-app-wallet-setup">
    <!-- Step: Choose -->
    <div
      v-if="step === 'choose'"
      class="setup-step"
    >
      <div class="setup-options">
        <Button @click="startGenerate">
          <Icon type="plus" />
          <span>Create New Wallet</span>
        </Button>
        <Button @click="step = 'restore'">
          <Icon type="key" />
          <span>I Have a Seed Phrase</span>
        </Button>
      </div>
      <Button
        class="link muted small"
        @click="$emit('back')"
      >
        <Icon type="arrow-left" />
        <span>Back</span>
      </Button>
    </div>

    <!-- Step: Generate -->
    <div
      v-else-if="step === 'generate'"
      class="setup-step"
    >
      <Alert type="info">
        Write down these 12 words in order. You will need them to restore your wallet. They will not be shown again.
      </Alert>

      <div class="generated-words">
        <div
          v-for="(word, i) in generatedWords"
          :key="i"
          class="generated-word"
        >
          <span class="word-number">{{ i + 1 }}</span>
          <span class="word-text">{{ word }}</span>
        </div>
      </div>

      <FormCheckbox v-model="backupConfirmed">
        I've saved my seed phrase
      </FormCheckbox>

      <Button
        :disabled="!backupConfirmed"
        @click="confirmGenerated"
      >
        Continue
      </Button>
      <Button
        class="link muted small"
        @click="step = 'choose'"
      >
        <Icon type="arrow-left" />
        <span>Back</span>
      </Button>
    </div>

    <!-- Step: Restore -->
    <div
      v-else-if="step === 'restore'"
      class="setup-step"
    >
      <p class="muted font-sm">Enter your 12-word seed phrase to restore your wallet.</p>

      <EvmSeedPhraseInput
        v-model="restorePhrase"
        @valid="restoreValid = $event"
        @submit="restoreWallet"
      />

      <Button
        :disabled="!restoreValid"
        @click="restoreWallet"
      >
        Restore Wallet
      </Button>
      <Button
        class="link muted small"
        @click="step = 'choose'"
      >
        <Icon type="arrow-left" />
        <span>Back</span>
      </Button>
    </div>

    <!-- Step: Connecting -->
    <div
      v-else-if="step === 'connecting'"
      class="setup-step"
    >
      <Loading
        txt="Connecting wallet..."
        spinner
        stacked
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConnect, useConnectors } from '@wagmi/vue'
import Button from '../../base/components/Button.vue'
import Icon from '../../base/components/Icon.vue'
import Alert from '../../base/components/Alert.vue'
import FormCheckbox from '../../base/components/FormCheckbox.vue'
import Loading from '../../base/components/Loading.vue'
import EvmSeedPhraseInput from './EvmSeedPhraseInput.vue'
import { prepareInAppWallet } from '../connectors/inAppWallet'

const emit = defineEmits<{
  connected: []
  back: []
}>()

const connectors = useConnectors()
const { mutateAsync: connectAsync } = useConnect()
const inAppConnector = computed(() =>
  connectors.value.find((c) => c.type === 'inAppWallet'),
)

type Step = 'choose' | 'generate' | 'restore' | 'connecting'
const step = ref<Step>('choose')

// Generate state
const generatedMnemonic = ref('')
const generatedWords = ref<string[]>([])
const backupConfirmed = ref(false)

// Restore state
const restorePhrase = ref('')
const restoreValid = ref(false)

async function startGenerate() {
  const { generateMnemonic, english } = await import('viem/accounts')
  generatedMnemonic.value = generateMnemonic(english)
  generatedWords.value = generatedMnemonic.value.split(' ')
  backupConfirmed.value = false
  step.value = 'generate'
}

async function connectWithMnemonic(mnemonic: string) {
  await prepareInAppWallet(mnemonic)
  await connectAsync({ connector: inAppConnector.value! })
}

async function confirmGenerated() {
  step.value = 'connecting'
  try {
    await connectWithMnemonic(generatedMnemonic.value)
    emit('connected')
  } catch (e) {
    console.error('Failed to connect in-app wallet:', e)
    step.value = 'generate'
  }
}

async function restoreWallet() {
  if (!restoreValid.value) return
  step.value = 'connecting'
  try {
    await connectWithMnemonic(restorePhrase.value)
    emit('connected')
  } catch (e) {
    console.error('Failed to restore in-app wallet:', e)
    step.value = 'restore'
  }
}
</script>

<style scoped>
.in-app-wallet-setup {
  display: grid;
  gap: var(--spacer);
}

.setup-step {
  display: grid;
  gap: var(--spacer);
}

.setup-options {
  display: grid;
  gap: var(--spacer);

  :deep(button),
  :deep(.button) {
    width: 100%;
  }
}

.generated-words {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacer-sm);
}

@media (min-width: 600px) {
  .generated-words {
    grid-template-columns: repeat(4, 1fr);
  }
}

.generated-word {
  display: flex;
  align-items: center;
  gap: var(--spacer-xs);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacer-xs) var(--spacer-sm);

  .word-number {
    font-size: var(--font-xs);
    color: var(--muted);
    min-width: 1.5em;
    text-align: right;
  }

  .word-text {
    font-size: var(--font-sm);
    font-family: var(--font-mono, monospace);
  }
}

.link.muted {
  justify-self: center;
  font-size: var(--font-xs);
}

</style>
