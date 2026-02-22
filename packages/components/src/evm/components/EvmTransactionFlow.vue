<template>
  <slot
    :start="start"
    :step="step"
    :open="open"
    :backgrounded="backgrounded"
    name="start"
  ></slot>

  <Teleport to="body">
    <div
      v-if="backgrounded && step !== 'idle'"
      class="transaction-flow-toast"
      :class="{ complete: step === 'complete' }"
      @click="backgrounded = false"
    >
      <div class="transaction-flow-toast-title">
        {{ text.title[step] }}
      </div>
      <section>
        <Loading
          v-if="step === 'waiting'"
          spinner
          :txt="text.lead[step] || ''"
        />
        <p v-else-if="text.lead[step]">{{ text.lead[step] }}</p>
        <Button
          v-if="tx"
          :to="txLink"
          target="_blank"
          class="link muted small"
          @click.stop
        >
          <Icon type="link" />
          <span>View on Block Explorer</span>
        </Button>
      </section>
    </div>
  </Teleport>

  <Dialog
    v-model:open="open"
    :closable="canDismiss"
    :click-outside="canDismiss"
    :title="text.title[step]"
    class="transaction-flow"
  >
    <slot name="before" />

    <Loading
      v-if="step === 'requesting' || step === 'waiting'"
      spinner
      stacked
      :txt="text.lead[step] || ''"
    />

    <p
      v-if="
        step !== 'requesting' &&
        step !== 'waiting' &&
        step !== 'error' &&
        text.lead[step]
      "
    >
      {{ text.lead[step] }}
    </p>

    <Alert
      v-if="error"
      type="error"
    >
      <p v-if="text.lead[step]">{{ text.lead[step] }}</p>
      <p>{{ error }}</p>
    </Alert>

    <Button
      v-if="step === 'waiting'"
      :to="txLink"
      target="_blank"
      class="link muted small centered"
    >
      <Icon type="link" />
      <span>View on Block Explorer</span>
    </Button>

    <slot
      :name="step"
      :cancel="cancel"
    ></slot>

    <template #footer>
      <template v-if="step === 'chain'">
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
      </template>

      <template v-if="step === 'confirm' || step === 'error'">
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
        <Button @click="() => initializeRequest()">
          {{ text.action[step] || 'Execute' }}
        </Button>
      </template>

      <slot
        name="actions"
        :step="step"
        :cancel="cancel"
        :execute="() => initializeRequest()"
        :tx-link="txLink"
        :backgrounded="backgrounded"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, useSlots, withDefaults } from 'vue'
import { waitForTransactionReceipt, watchChainId } from '@wagmi/core'
import { useConfig, type Config } from '@wagmi/vue'
import type { TransactionReceipt, Hash } from 'viem'
import Dialog from '../../base/components/Dialog.vue'
import Loading from '../../base/components/Loading.vue'
import Alert from '../../base/components/Alert.vue'
import Button from '../../base/components/Button.vue'
import Icon from '../../base/components/Icon.vue'
import { useEnsureChainIdCheck, useBlockExplorer } from '../composables/chainId'
import { delay } from '../../base/utils/time'

interface TextConfig {
  title?: Record<string, string>
  lead?: Record<string, string>
  action?: Record<string, string>
}

type Step =
  | 'idle'
  | 'confirm'
  | 'chain'
  | 'requesting'
  | 'waiting'
  | 'complete'
  | 'error'

const defaultText = {
  title: {
    confirm: 'Confirm Transaction',
    chain: 'Switch Network',
    requesting: 'Requesting',
    waiting: 'Processing',
    complete: 'Complete',
    error: 'Error',
  },
  lead: {
    confirm: 'Please review and confirm this transaction.',
    chain: 'Please switch to the correct network to continue.',
    requesting: 'Requesting transaction signature...',
    waiting: 'Waiting for transaction confirmation...',
    complete: 'Transaction confirmed successfully.',
  },
  action: {
    confirm: 'Execute',
    error: 'Try Again',
  },
} satisfies TextConfig

const slots = useSlots()
const checkChain = useEnsureChainIdCheck()

const wagmiConfig = useConfig()
const blockExplorer = useBlockExplorer()

const props = withDefaults(
  defineProps<{
    text?: TextConfig
    request?: () => Promise<Hash>
    delayAfter?: number
    delayAutoclose?: number
    skipConfirmation?: boolean
    autoCloseSuccess?: boolean
    dismissable?: boolean
  }>(),
  {
    delayAfter: 2000,
    delayAutoclose: 2000,
    skipConfirmation: false,
    autoCloseSuccess: true,
    dismissable: true,
  },
)

const emit = defineEmits<{
  complete: [receipt: TransactionReceipt]
  cancel: []
}>()

const text = computed<Required<TextConfig>>(() => ({
  title: { ...defaultText.title, ...props.text?.title },
  lead: { ...defaultText.lead, ...props.text?.lead },
  action: { ...defaultText.action, ...props.text?.action },
}))

const step = ref<Step>('idle')

const open = computed({
  get: () => step.value !== 'idle' && !backgrounded.value,
  set: (v) => {
    if (!v) {
      step.value = 'idle'
      error.value = ''
      backgrounded.value = false
    }
  },
})

watchChainId(wagmiConfig as Config, {
  async onChange() {
    if (step.value !== 'chain') return

    if (await checkChain()) {
      initializeRequest()
    }
  },
})

const cachedRequest = ref(props.request)
watch(
  () => props.request,
  (v) => {
    cachedRequest.value = v
  },
)

const error = ref('')
const tx = ref<Hash | null>(null)
const receipt = ref<TransactionReceipt | null>(null)
const backgrounded = ref(false)
const txLink = computed(() => `${blockExplorer}/tx/${tx.value}`)

const canDismiss = computed(
  () =>
    props.dismissable &&
    step.value !== 'requesting' &&
    step.value !== 'waiting',
)

watch(step, (v) => {
  if (backgrounded.value && v !== 'waiting' && v !== 'complete') {
    backgrounded.value = false
  }
})

const initializeRequest = async (request = cachedRequest.value) => {
  cachedRequest.value = request
  error.value = ''
  tx.value = null
  receipt.value = null
  step.value = 'confirm'

  if (!(await checkChain())) {
    step.value = 'chain'
    return
  }

  try {
    step.value = 'requesting'
    tx.value = await request!()
    backgrounded.value = true
    step.value = 'waiting'
    const receiptObject = await waitForTransactionReceipt(
      wagmiConfig as Config,
      {
        hash: tx.value,
      },
    )
    await delay(props.delayAfter)
    receipt.value = receiptObject
    emit('complete', receiptObject)
    step.value = 'complete'
  } catch (e: unknown) {
    const err = e as { cause?: { code?: number }; shortMessage?: string }
    if (err?.cause?.code === 4001) {
      error.value = 'Transaction rejected by user.'
      step.value = 'error'
    } else {
      error.value = err.shortMessage || 'Error submitting transaction request.'
      step.value = 'error'
    }
    console.log(e)
  }

  if (props.autoCloseSuccess && step.value === 'complete') {
    await delay(props.delayAutoclose)
    step.value = 'idle'
    await delay(300)
  }

  return receipt.value
}

const start = () => {
  if (props.skipConfirmation && step.value === 'idle') {
    initializeRequest()
    return
  }

  step.value = 'confirm'
}

const cancel = () => {
  step.value = 'idle'
  error.value = ''
  backgrounded.value = false
  emit('cancel')
}

defineExpose({
  initializeRequest,
  backgrounded,
})
</script>

<style>
.transaction-flow > section {
  display: grid;
  gap: var(--spacer);

  .text {
    width: 100%;
    height: min-content;
  }

  p {
    white-space: pre-wrap;
    width: 100%;

    a {
      text-decoration: underline;
    }
  }
}

.transaction-flow-toast {
  position: fixed;
  bottom: var(--spacer);
  right: var(--spacer);
  z-index: var(--z-index-toast);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  inline-size: var(--toast-width);
  max-inline-size: calc(100vw - var(--spacer) * 2);
  border: var(--border);
  border-radius: var(--border-radius);
  overflow: hidden;
  font-family: var(--font-family);
  font-size: var(--ui-font-size);
  cursor: pointer;
  color: var(--toast-info-color);
  background: var(--toast-info-background);
  border-color: var(--toast-info-border-color);

  opacity: 1;
  translate: 0;
  transition:
    opacity var(--speed) ease,
    translate var(--speed) ease;

  @starting-style {
    opacity: 0;
    translate: 100% 0;
  }

  &.complete {
    color: var(--toast-success-color);
    background: var(--toast-success-background);
    border-color: var(--toast-success-border-color);
  }

  .transaction-flow-toast-title {
    display: flex;
    align-items: center;
    block-size: calc(var(--spacer) * 2);
    box-shadow: var(--border-shadow);
    padding-inline: var(--ui-padding-inline);
    font-size: var(--ui-font-size);
    font-weight: normal;
    text-transform: var(--ui-text-transform);
    margin: 0;
  }

  > section {
    padding: var(--ui-padding-inline);
    display: grid;
    gap: var(--spacer);
  }
}
</style>
