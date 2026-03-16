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
    compat
  >
    <slot name="before" />

    <Loading
      v-if="step === 'requesting'"
      spinner
      stacked
      :txt="
        connector?.name
          ? `Requesting signature from ${connector.name}...`
          : text.lead[step] || ''
      "
    />

    <p v-if="step !== 'requesting' && step !== 'error' && text.lead[step]">
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
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { waitForTransactionReceipt, watchChainId } from '@wagmi/core'
import { useConfig, useConnection, type Config } from '@wagmi/vue'
import type { TransactionReceipt, Hash } from 'viem'
import {
  Dialog,
  Loading,
  Alert,
  Button,
  useToast,
  delay,
} from '@1001-digital/components'
import { useEnsureChainIdCheck, useBlockExplorer } from '../composables/chainId'
import type {
  TransactionFlowText,
  EvmTransactionFlowProps,
  EvmTransactionFlowEmits,
} from '../types'

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
} satisfies TransactionFlowText

const props = withDefaults(defineProps<EvmTransactionFlowProps>(), {
  delayAfter: 2000,
  delayAutoclose: 2000,
  skipConfirmation: false,
  autoCloseSuccess: true,
  dismissable: true,
})

function isUserRejection(e: unknown): boolean {
  const re = /reject|denied|cancel/i
  let current = e as Record<string, unknown> | undefined
  while (current) {
    if ((current as { code?: number }).code === 4001) return true
    if (re.test((current as { details?: string }).details || '')) return true
    current = current.cause as Record<string, unknown> | undefined
  }
  return false
}

const checkChain = useEnsureChainIdCheck(props.chain)

const wagmiConfig = useConfig()
const { connector } = useConnection()
const blockExplorer = useBlockExplorer(props.chain)
const toast = useToast()

const emit = defineEmits<EvmTransactionFlowEmits>()

const text = computed<Required<TransactionFlowText>>(() => ({
  title: { ...defaultText.title, ...props.text?.title },
  lead: { ...defaultText.lead, ...props.text?.lead },
  action: { ...defaultText.action, ...props.text?.action },
}))

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
const txLink = computed(() => `${blockExplorer}/tx/${tx.value}`)

let mounted = true
let progressTimer: ReturnType<typeof setInterval> | undefined

onBeforeUnmount(() => {
  mounted = false
  clearInterval(progressTimer)
})

const canDismiss = computed(
  () => props.dismissable && step.value !== 'requesting',
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

  // Phase 1: Signing (dialog)
  try {
    step.value = 'requesting'
    tx.value = await request!()
  } catch (e: unknown) {
    if (isUserRejection(e)) {
      error.value = 'Transaction rejected by user.'
    } else {
      const err = e as { shortMessage?: string }
      error.value = err.shortMessage || 'Error submitting transaction request.'
    }
    step.value = 'error'
    console.log(e)
    return
  }

  // Phase 2: Receipt (toast)
  step.value = 'idle'

  const link = `${blockExplorer}/tx/${tx.value}`
  const toastId = toast.add({
    variant: 'info',
    title: text.value.title.waiting,
    description: text.value.lead.waiting,
    duration: Infinity,
    loading: true,
    progress: 0,
    action: {
      label: 'View on Block Explorer',
      onClick: () => window.open(link, '_blank'),
      persistent: true,
    },
  })

  const start = Date.now()
  progressTimer = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000
    toast.update(toastId, {
      progress: Math.round(90 * (1 - Math.exp(-elapsed / 15))),
    })
  }, 500)

  try {
    const receiptObject = await waitForTransactionReceipt(
      wagmiConfig as Config,
      { hash: tx.value },
    )
    clearInterval(progressTimer)
    toast.update(toastId, { progress: 100, loading: false })
    await delay(props.delayAfter)
    receipt.value = receiptObject
    emit('complete', receiptObject)

    toast.update(toastId, {
      variant: 'success',
      title: text.value.title.complete,
      description: text.value.lead.complete,
      progress: false,
      ...(props.autoCloseSuccess && { duration: props.delayAutoclose }),
    })
  } catch (e: unknown) {
    clearInterval(progressTimer)
    const err = e as { shortMessage?: string }
    if (mounted) {
      toast.dismiss(toastId)
      error.value = err.shortMessage || 'Transaction failed.'
      step.value = 'error'
    } else {
      toast.update(toastId, {
        variant: 'error',
        title: text.value.title.error,
        description: err.shortMessage || 'Transaction failed.',
        loading: false,
        progress: false,
      })
    }
    console.log(e)
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

<style scoped>
.transaction-flow {
  &:deep(> section) {
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
}
</style>
