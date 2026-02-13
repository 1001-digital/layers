<template>
  <slot
    :start="start"
    :step="step"
    :open="open"
    name="start"
  ></slot>

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

    <slot
      :name="step"
      :cancel="cancel"
    ></slot>

    <Button
      v-if="step === 'waiting'"
      :to="txLink"
      target="_blank"
      class="link muted small"
    >
      <Icon type="link" />
      <span>View on Block Explorer</span>
    </Button>

    <Actions v-if="step === 'chain'">
      <Button
        @click="cancel"
        class="secondary"
        >Cancel</Button
      >
    </Actions>

    <Actions v-if="step === 'confirm' || step === 'error'">
      <Button
        @click="cancel"
        class="secondary"
        >Cancel</Button
      >
      <Button @click="() => initializeRequest()">
        {{ text.action[step] || 'Execute' }}
      </Button>
    </Actions>
  </Dialog>
</template>

<script setup lang="ts">
import { waitForTransactionReceipt, watchChainId } from '@wagmi/core'
import type { Config } from '@wagmi/vue'
import type { TransactionReceipt, Hash } from 'viem'

interface TextConfig {
  title: Record<string, string>
  lead: Record<string, string>
  action: Record<string, string>
}

type Step =
  | 'idle'
  | 'confirm'
  | 'chain'
  | 'requesting'
  | 'waiting'
  | 'complete'
  | 'error'

const checkChain = useEnsureChainIdCheck()

const { $wagmi } = useNuxtApp()
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
    text: () => ({
      title: {
        confirm: 'Confirm Transaction',
      },
      lead: {
        confirm: 'Please review and confirm this transaction.',
      },
      action: {
        confirm: 'Execute',
      },
    }),
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

const step = ref<Step>('idle')

const open = computed({
  get: () => step.value !== 'idle',
  set: (v) => {
    if (!v) {
      step.value = 'idle'
      error.value = ''
    }
  },
})

watchChainId($wagmi as Config, {
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
const txLink = computed(() => `${blockExplorer}/tx/${tx.value}`)

const canDismiss = computed(
  () =>
    props.dismissable &&
    step.value !== 'requesting' &&
    step.value !== 'waiting',
)

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
    step.value = 'waiting'
    const receiptObject = await waitForTransactionReceipt($wagmi as Config, {
      hash: tx.value,
    })
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
  emit('cancel')
}

defineExpose({
  initializeRequest,
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

  .link.muted {
    justify-self: center;
  }
}
</style>
