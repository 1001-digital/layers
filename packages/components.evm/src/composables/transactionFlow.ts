import { ref, computed, watch, toValue, onBeforeUnmount } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { waitForTransactionReceipt, watchChainId } from '@wagmi/core'
import { useConfig, useConnection, type Config } from '@wagmi/vue'
import type { TransactionReceipt, Hash } from 'viem'
import { useToast, delay } from '@1001-digital/components'
import { useEnsureChainIdCheck, useBlockExplorer } from './chainId'
import { isUserRejection } from '../utils/errors'
import type { TransactionFlowText } from '../types'

export const TRANSACTION_FLOW_STEPS = [
  'idle',
  'confirm',
  'chain',
  'requesting',
  'waiting',
  'complete',
  'error',
] as const

export type TransactionFlowStep = (typeof TRANSACTION_FLOW_STEPS)[number]

export interface TransactionFlowOptions {
  chain?: MaybeRefOrGetter<string | number | undefined>
  text?: MaybeRefOrGetter<TransactionFlowText | undefined>
  request?: MaybeRefOrGetter<(() => Promise<Hash>) | undefined>
  delayAfter?: MaybeRefOrGetter<number | undefined>
  delayAutoclose?: MaybeRefOrGetter<number | undefined>
  skipConfirmation?: MaybeRefOrGetter<boolean | undefined>
  autoCloseSuccess?: MaybeRefOrGetter<boolean | undefined>
  dismissable?: MaybeRefOrGetter<boolean | undefined>
  keepOpen?: MaybeRefOrGetter<boolean | undefined>
}

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
    viewOnExplorer: 'View on Block Explorer',
  },
} satisfies TransactionFlowText

export const useTransactionFlow = (options: TransactionFlowOptions = {}) => {
  const checkChain = useEnsureChainIdCheck(toValue(options.chain))

  const wagmiConfig = useConfig()
  const { connector } = useConnection()
  const blockExplorer = useBlockExplorer(toValue(options.chain))
  const toast = useToast()

  const step = ref<TransactionFlowStep>('idle')
  const error = ref('')
  const tx = ref<Hash | null>(null)
  const receipt = ref<TransactionReceipt | null>(null)
  const txLink = computed(() => `${blockExplorer}/tx/${tx.value}`)

  const text = computed<Required<TransactionFlowText>>(() => ({
    title: { ...defaultText.title, ...toValue(options.text)?.title },
    lead: { ...defaultText.lead, ...toValue(options.text)?.lead },
    action: { ...defaultText.action, ...toValue(options.text)?.action },
  }))

  const canDismiss = computed(
    () =>
      (toValue(options.dismissable) ?? true) &&
      step.value !== 'requesting' &&
      !((toValue(options.keepOpen) ?? false) && step.value === 'waiting'),
  )

  let mounted = true
  let progressTimer: ReturnType<typeof setInterval> | undefined

  onBeforeUnmount(() => {
    mounted = false
    clearInterval(progressTimer)
  })

  const cachedRequest = ref(toValue(options.request))
  watch(
    () => toValue(options.request),
    (v) => {
      cachedRequest.value = v
    },
  )

  watchChainId(wagmiConfig as Config, {
    async onChange() {
      if (step.value !== 'chain') return

      if (await checkChain()) {
        initializeRequest()
      }
    },
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

    // Phase 1: Signing
    try {
      step.value = 'requesting'
      tx.value = await request!()
    } catch (e: unknown) {
      if (isUserRejection(e)) {
        error.value = 'Transaction rejected by user.'
      } else {
        const err = e as { shortMessage?: string }
        error.value =
          err.shortMessage || 'Error submitting transaction request.'
      }
      step.value = 'error'
      console.log(e)
      return
    }

    // Phase 2: Receipt
    const keepOpen = toValue(options.keepOpen) ?? false
    const delayAfter = toValue(options.delayAfter) ?? 2000
    const delayAutoclose = toValue(options.delayAutoclose) ?? 2000
    const autoCloseSuccess = toValue(options.autoCloseSuccess) ?? true

    if (keepOpen) {
      step.value = 'waiting'

      try {
        const receiptObject = await waitForTransactionReceipt(
          wagmiConfig as Config,
          { hash: tx.value },
        )
        await delay(delayAfter)
        receipt.value = receiptObject
        step.value = 'complete'

        if (autoCloseSuccess) {
          await delay(delayAutoclose)
          if (step.value === 'complete') {
            step.value = 'idle'
          }
        }
      } catch (e: unknown) {
        const err = e as { shortMessage?: string }
        error.value = err.shortMessage || 'Transaction failed.'
        step.value = 'error'
        console.log(e)
      }
    } else {
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
          label: text.value.action.viewOnExplorer,
          onClick: () => window.open(link, '_blank'),
          persistent: true,
        },
      })

      const startTime = Date.now()
      progressTimer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
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
        await delay(delayAfter)
        receipt.value = receiptObject

        toast.update(toastId, {
          variant: 'success',
          title: text.value.title.complete,
          description: text.value.lead.complete,
          progress: false,
          ...(autoCloseSuccess && { duration: delayAutoclose }),
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
    }

    return receipt.value
  }

  const start = () => {
    if ((toValue(options.skipConfirmation) ?? false) && step.value === 'idle') {
      initializeRequest()
      return
    }

    step.value = 'confirm'
  }

  const cancel = () => {
    step.value = 'idle'
    error.value = ''
  }

  const reset = () => {
    step.value = 'idle'
    error.value = ''
    tx.value = null
    receipt.value = null
  }

  return {
    step,
    error,
    tx,
    receipt,
    txLink,
    text,
    canDismiss,
    connector,
    initializeRequest,
    start,
    cancel,
    reset,
  }
}

export type TransactionFlow = ReturnType<typeof useTransactionFlow>
