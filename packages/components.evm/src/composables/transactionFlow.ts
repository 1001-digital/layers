import { ref, computed, watch, toValue, onBeforeUnmount } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import {
  waitForCallsStatus,
  waitForTransactionReceipt,
  watchChainId,
} from '@wagmi/core'
import { useConfig, useConnection, type Config } from '@wagmi/vue'
import type { TransactionReceipt, Hash } from 'viem'
import { useToast, delay } from '@1001-digital/components'
import { useEnsureChainIdCheck, useBlockExplorer } from './chainId'
import { createAsyncRunGuard } from '../utils/async-run'
import { isUserRejection } from '../utils/errors'
import type {
  TransactionFlowRequestResult,
  TransactionFlowText,
} from '../types'
import {
  getCallsTransactionHash,
  isCallsResult,
  transactionExplorerUrl,
} from '../utils/transaction-result'

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
  request?: MaybeRefOrGetter<
    (() => Promise<TransactionFlowRequestResult>) | undefined
  >
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

function errorMessage(e: unknown, fallback: string) {
  const err = e as { shortMessage?: string; message?: string }
  return err.shortMessage || err.message || fallback
}

export const useTransactionFlow = (options: TransactionFlowOptions = {}) => {
  const checkChain = useEnsureChainIdCheck(toValue(options.chain))

  const wagmiConfig = useConfig()
  const { connector } = useConnection()
  const blockExplorer = useBlockExplorer(toValue(options.chain))
  const toast = useToast()

  const step = ref<TransactionFlowStep>('idle')
  const isBusy = ref(false)
  const error = ref('')
  const tx = ref<Hash | null>(null)
  const callsId = ref<string | null>(null)
  const receipt = ref<TransactionReceipt | null>(null)
  const txLink = computed(
    () => transactionExplorerUrl(blockExplorer, tx.value) ?? '',
  )

  const text = computed<Required<TransactionFlowText>>(() => ({
    title: { ...defaultText.title, ...toValue(options.text)?.title },
    lead: { ...defaultText.lead, ...toValue(options.text)?.lead },
    action: { ...defaultText.action, ...toValue(options.text)?.action },
  }))

  const canDismiss = computed(
    () =>
      (toValue(options.dismissable) ?? true) &&
      !isBusy.value &&
      step.value !== 'requesting' &&
      !((toValue(options.keepOpen) ?? false) && step.value === 'waiting'),
  )

  let mounted = true
  const progressTimers = new Set<ReturnType<typeof setInterval>>()
  const clearProgressTimers = () => {
    for (const timer of progressTimers) clearInterval(timer)
    progressTimers.clear()
  }
  const runGuard = createAsyncRunGuard((busy) => {
    if (mounted) isBusy.value = busy
  })
  const isActiveRun = (token: number) => mounted && runGuard.isActive(token)

  const cachedRequest = ref(toValue(options.request))
  watch(
    () => toValue(options.request),
    (value) => {
      cachedRequest.value = value
    },
  )

  const initializeRequest = async (request = cachedRequest.value) => {
    const token = runGuard.begin()
    if (token === null) return null

    const isChainRetry = step.value === 'chain'
    cachedRequest.value = request
    error.value = ''
    tx.value = null
    callsId.value = null
    receipt.value = null
    if (!isChainRetry) step.value = 'confirm'

    try {
      if (!(await checkChain())) {
        if (isActiveRun(token)) step.value = 'chain'
        return null
      }
      if (!isActiveRun(token)) return null

      if (!request) {
        error.value = 'No transaction request configured.'
        step.value = 'error'
        return null
      }

      // Phase 1: request a signature. Keep local copies so reset/cancel cannot
      // corrupt receipt polling that has already moved to a background toast.
      let submittedTx: Hash | null = null
      let submittedCallsId: string | null = null
      const submittedConnector = connector.value

      try {
        step.value = 'requesting'
        const result = await request()

        if (isCallsResult(result)) {
          submittedCallsId = result.id
          if (isActiveRun(token)) callsId.value = result.id
        } else {
          submittedTx = result
          if (isActiveRun(token)) tx.value = result
        }
      } catch (e: unknown) {
        if (!isActiveRun(token)) return null

        error.value = isUserRejection(e)
          ? 'Transaction rejected by user.'
          : errorMessage(e, 'Error submitting transaction request.')
        step.value = 'error'
        console.log(e)
        return null
      }

      // Phase 2: wait for an onchain receipt.
      const keepOpen = toValue(options.keepOpen) ?? false
      const delayAfter = toValue(options.delayAfter) ?? 2000
      const delayAutoclose = toValue(options.delayAutoclose) ?? 2000
      const autoCloseSuccess = toValue(options.autoCloseSuccess) ?? true
      const waitForReceipt = async () => {
        if (!submittedCallsId)
          return waitForTransactionReceipt(wagmiConfig as Config, {
            hash: submittedTx!,
          })

        const status = await waitForCallsStatus(wagmiConfig as Config, {
          connector: submittedConnector,
          id: submittedCallsId,
          throwOnFailure: true,
          timeout: 120_000,
        })
        submittedTx = getCallsTransactionHash(status)
        if (isActiveRun(token)) tx.value = submittedTx
        return waitForTransactionReceipt(wagmiConfig as Config, {
          hash: submittedTx,
        })
      }

      if (keepOpen) {
        if (isActiveRun(token)) step.value = 'waiting'

        try {
          const receiptObject = await waitForReceipt()
          if (!isActiveRun(token)) return null

          await delay(delayAfter)
          if (!isActiveRun(token)) return null

          receipt.value = receiptObject
          step.value = 'complete'

          if (autoCloseSuccess) {
            await delay(delayAutoclose)
            if (isActiveRun(token) && step.value === 'complete') {
              step.value = 'idle'
            }
          }
        } catch (e: unknown) {
          if (!isActiveRun(token)) return null

          error.value = errorMessage(e, 'Transaction failed.')
          step.value = 'error'
          console.log(e)
        }
      } else {
        // Cancellation before the toast handoff suppresses all new UI while
        // still waiting for the submitted transaction to settle. This keeps
        // the wallet/receipt single-flight lock honest.
        if (!isActiveRun(token)) {
          try {
            await waitForReceipt()
          } catch (e: unknown) {
            console.log(e)
          }
          return null
        }

        // The dialog hands receipt waiting to a toast. The toast still reaches
        // a terminal state after unmount/cancel, but guarded component state
        // does not update and therefore cannot emit a late completion.
        step.value = 'idle'

        const submittedTxLink = transactionExplorerUrl(
          blockExplorer,
          submittedTx,
        )
        const toastId = toast.add({
          variant: 'info',
          title: text.value.title.waiting,
          description: text.value.lead.waiting,
          duration: Infinity,
          loading: true,
          progress: 0,
          ...(submittedTxLink && {
            action: {
              label: text.value.action.viewOnExplorer!,
              onClick: () => window.open(submittedTxLink, '_blank'),
              persistent: true,
            },
          }),
        })

        const startTime = Date.now()
        const progressTimer = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000
          toast.update(toastId, {
            progress: Math.round(90 * (1 - Math.exp(-elapsed / 15))),
          })
        }, 500)
        progressTimers.add(progressTimer)

        try {
          const receiptObject = await waitForReceipt()
          clearInterval(progressTimer)
          progressTimers.delete(progressTimer)
          toast.update(toastId, { progress: 100, loading: false })
          await delay(delayAfter)

          if (isActiveRun(token)) receipt.value = receiptObject

          const confirmedTxLink = transactionExplorerUrl(
            blockExplorer,
            receiptObject.transactionHash,
          )!
          toast.update(toastId, {
            variant: 'success',
            title: text.value.title.complete,
            description: text.value.lead.complete,
            progress: false,
            action: {
              label: text.value.action.viewOnExplorer!,
              onClick: () => window.open(confirmedTxLink, '_blank'),
              persistent: true,
            },
            ...(autoCloseSuccess && { duration: delayAutoclose }),
          })
        } catch (e: unknown) {
          const message = errorMessage(e, 'Transaction failed.')
          if (isActiveRun(token)) {
            toast.dismiss(toastId)
            error.value = message
            step.value = 'error'
          } else {
            toast.update(toastId, {
              variant: 'error',
              title: text.value.title.error,
              description: message,
              loading: false,
              progress: false,
            })
          }
          console.log(e)
        } finally {
          clearInterval(progressTimer)
          progressTimers.delete(progressTimer)
        }
      }

      return isActiveRun(token) ? receipt.value : null
    } finally {
      runGuard.end(token)
    }
  }

  const start = () => {
    if (isBusy.value) return

    if ((toValue(options.skipConfirmation) ?? false) && step.value === 'idle') {
      void initializeRequest()
      return
    }

    error.value = ''
    tx.value = null
    callsId.value = null
    receipt.value = null
    step.value = 'confirm'
  }

  const cancel = () => {
    runGuard.invalidate()
    step.value = 'idle'
    error.value = ''
  }

  const reset = () => {
    runGuard.invalidate()
    step.value = 'idle'
    error.value = ''
    tx.value = null
    callsId.value = null
    receipt.value = null
  }

  const stopWatchChainId = watchChainId(wagmiConfig as Config, {
    onChange() {
      if (step.value === 'chain') void initializeRequest()
    },
  })

  onBeforeUnmount(() => {
    mounted = false
    runGuard.invalidate()
    clearProgressTimers()
    stopWatchChainId?.()
  })

  return {
    step,
    isBusy,
    error,
    tx,
    callsId,
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
