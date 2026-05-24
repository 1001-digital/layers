import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { waitForTransactionReceipt, watchChainId } from '@wagmi/core'
import {
  useConfig,
  useConnection,
  useSwitchChain,
  type Config,
} from '@wagmi/vue'
import type { Hash, TransactionReceipt } from 'viem'
import { delay } from '@1001-digital/components'
import { useEvmConfig } from '../config'
import { isUserRejection } from '../utils/errors'
import type {
  MultiTransactionFlowStep,
  MultiTransactionFlowStepContext,
  MultiTransactionFlowStepState,
  MultiTransactionFlowText,
} from '../types'

export const MULTI_TRANSACTION_FLOW_STEPS = [
  'idle',
  'confirm',
  'chain',
  'requesting',
  'waiting',
  'complete',
  'error',
] as const

export type MultiTransactionFlowPhase =
  (typeof MULTI_TRANSACTION_FLOW_STEPS)[number]

export interface MultiTransactionFlowOptions {
  steps?: MaybeRefOrGetter<MultiTransactionFlowStep[] | undefined>
  chain?: MaybeRefOrGetter<string | number | undefined>
  text?: MaybeRefOrGetter<MultiTransactionFlowText | undefined>
  delayAfter?: MaybeRefOrGetter<number | undefined>
  delayAutoclose?: MaybeRefOrGetter<number | undefined>
  skipConfirmation?: MaybeRefOrGetter<boolean | undefined>
  autoCloseSuccess?: MaybeRefOrGetter<boolean | undefined>
  dismissable?: MaybeRefOrGetter<boolean | undefined>
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
    complete: 'All transactions confirmed successfully.',
  },
  action: {
    confirm: 'Execute',
    error: 'Try Again',
    viewOnExplorer: 'View on Block Explorer',
  },
} satisfies MultiTransactionFlowText

export const useMultiTransactionFlow = (
  options: MultiTransactionFlowOptions = {},
) => {
  const evmConfig = useEvmConfig()
  const wagmiConfig = useConfig()
  const { connector, chainId: currentChainId } = useConnection()
  const { mutateAsync: switchChain } = useSwitchChain()

  const step = ref<MultiTransactionFlowPhase>('idle')
  const stepIndex = ref(0)
  const error = ref('')
  const stepStates = ref<MultiTransactionFlowStepState[]>([])
  const results = ref<unknown[]>([])

  const steps = computed(() => toValue(options.steps) ?? [])
  const currentStep = computed(() => steps.value[stepIndex.value])
  const currentStepState = computed(() => stepStates.value[stepIndex.value])
  const tx = computed(() => currentStepState.value?.tx ?? null)
  const receipt = computed(() => currentStepState.value?.receipt ?? null)
  const txLink = computed(() => currentStepState.value?.txLink ?? '')
  const hashes = computed(() =>
    stepStates.value
      .map((state) => state.tx)
      .filter((hash): hash is Hash => Boolean(hash)),
  )
  const receipts = computed(() =>
    stepStates.value
      .map((state) => state.receipt)
      .filter((receipt): receipt is TransactionReceipt => Boolean(receipt)),
  )

  const text = computed<Required<MultiTransactionFlowText>>(() => ({
    title: { ...defaultText.title, ...toValue(options.text)?.title },
    lead: { ...defaultText.lead, ...toValue(options.text)?.lead },
    action: { ...defaultText.action, ...toValue(options.text)?.action },
  }))

  const currentTitle = computed(() => {
    if (step.value === 'complete' || !currentStep.value) {
      return text.value.title[step.value] || ''
    }

    return currentStep.value.title || text.value.title[step.value] || ''
  })

  const currentLead = computed(() => {
    if (step.value === 'complete' || !currentStep.value) {
      return text.value.lead[step.value] || ''
    }

    return currentStep.value.lead || text.value.lead[step.value] || ''
  })

  const currentAction = computed(() => {
    if (!currentStep.value) {
      return text.value.action[step.value] || text.value.action.confirm || ''
    }

    return (
      currentStep.value.action ||
      text.value.action[step.value] ||
      text.value.action.confirm ||
      ''
    )
  })

  const canDismiss = computed(
    () =>
      (toValue(options.dismissable) ?? true) &&
      step.value !== 'requesting' &&
      step.value !== 'waiting',
  )

  let mounted = true
  let runId = 0

  const resolveChainConfig = (key?: string | number) => {
    if (typeof key === 'number') {
      return {
        id: key,
        blockExplorer: 'https://evm.now',
      }
    }

    const resolvedKey = key || evmConfig.defaultChain || 'mainnet'
    const chain = evmConfig.chains[resolvedKey]

    return {
      id: chain?.id ?? 1,
      blockExplorer: chain?.blockExplorer ?? 'https://evm.now',
    }
  }

  const getStepChain = (transactionStep: MultiTransactionFlowStep) =>
    transactionStep.chain ?? toValue(options.chain)

  const getTxLink = (transactionStep: MultiTransactionFlowStep, hash: Hash) => {
    const chainConfig = resolveChainConfig(getStepChain(transactionStep))

    return `${chainConfig.blockExplorer}/tx/${hash}`
  }

  const createStepState = (
    transactionStep: MultiTransactionFlowStep,
  ): MultiTransactionFlowStepState => ({
    id: transactionStep.id,
    status: 'idle',
    tx: null,
    receipt: null,
    txLink: '',
    error: '',
  })

  const resetStepStates = () => {
    stepStates.value = steps.value.map(createStepState)
    results.value = []
    stepIndex.value = 0
  }

  const isActiveRun = (id: number) => mounted && id === runId

  const beginRun = () => {
    runId += 1
    resetStepStates()
    error.value = ''

    return runId
  }

  const updateStepState = (
    index: number,
    patch: Partial<MultiTransactionFlowStepState>,
  ) => {
    const current = stepStates.value[index]
    if (!current) return

    stepStates.value = stepStates.value.map((state, stateIndex) =>
      stateIndex === index ? { ...state, ...patch } : state,
    )
  }

  const createContext = (): MultiTransactionFlowStepContext => ({
    stepIndex: stepIndex.value,
    hashes: hashes.value,
    receipts: receipts.value,
    results: results.value.slice(),
  })

  const getErrorMessage = (e: unknown, fallback: string) => {
    const err = e as { shortMessage?: string; message?: string }

    return err.shortMessage || err.message || fallback
  }

  const setStepError = (index: number, message: string) => {
    error.value = message
    updateStepState(index, {
      status: 'error',
      error: message,
    })
    step.value = 'error'
  }

  const ensureChain = async (transactionStep: MultiTransactionFlowStep) => {
    const chainConfig = resolveChainConfig(getStepChain(transactionStep))

    if (chainConfig.id === currentChainId.value) {
      return true
    }

    try {
      await switchChain({ chainId: chainConfig.id })
      return true
    } catch {
      return false
    }
  }

  const completeFlow = async (id: number) => {
    if (!isActiveRun(id)) return

    error.value = ''
    step.value = 'complete'

    if (toValue(options.autoCloseSuccess) ?? true) {
      await delay(toValue(options.delayAutoclose) ?? 2000)
      if (isActiveRun(id) && step.value === 'complete') {
        step.value = 'idle'
      }
    }
  }

  const moveToNextExecutableStep = async (fromIndex: number, id: number) => {
    for (let index = fromIndex; index < steps.value.length; index += 1) {
      if (!isActiveRun(id)) return false

      const transactionStep = steps.value[index]
      if (!transactionStep) continue

      stepIndex.value = index

      try {
        if (await transactionStep.skip?.(createContext())) {
          updateStepState(index, {
            status: 'skipped',
            error: '',
          })
          continue
        }
      } catch (e: unknown) {
        setStepError(
          index,
          getErrorMessage(e, 'Error preparing transaction step.'),
        )
        console.log(e)
        return false
      }

      updateStepState(index, {
        status: 'confirm',
        error: '',
      })

      return true
    }

    await completeFlow(id)
    return false
  }

  const initializeRequest = async () => {
    if (!steps.value.length) {
      error.value = 'No transaction steps configured.'
      step.value = 'error'
      return null
    }

    let id = runId
    if (step.value === 'idle' || step.value === 'complete' || !id) {
      id = beginRun()
      const hasStep = await moveToNextExecutableStep(0, id)
      if (!hasStep) return null
    }

    const transactionStep = currentStep.value
    const index = stepIndex.value
    if (!transactionStep) {
      await completeFlow(id)
      return null
    }

    error.value = ''
    updateStepState(index, {
      status: 'confirm',
      tx: null,
      receipt: null,
      txLink: '',
      error: '',
    })

    if (!(await ensureChain(transactionStep))) {
      if (!isActiveRun(id)) return null

      step.value = 'chain'
      updateStepState(index, { status: 'chain' })
      return null
    }

    if (!isActiveRun(id)) return null

    try {
      step.value = 'requesting'
      updateStepState(index, { status: 'requesting' })

      const hash = await transactionStep.request(createContext())

      if (!isActiveRun(id)) return null

      updateStepState(index, {
        tx: hash,
        txLink: getTxLink(transactionStep, hash),
      })

      step.value = 'waiting'
      updateStepState(index, { status: 'waiting' })

      const receiptObject = await waitForTransactionReceipt(
        wagmiConfig as Config,
        { hash },
      )

      await delay(toValue(options.delayAfter) ?? 2000)
      if (!isActiveRun(id)) return null

      updateStepState(index, {
        status: 'complete',
        receipt: receiptObject,
        error: '',
      })

      if (transactionStep.result) {
        results.value[index] = await transactionStep.result(
          receiptObject,
          createContext(),
        )
      }
    } catch (e: unknown) {
      if (!isActiveRun(id)) return null

      if (isUserRejection(e)) {
        setStepError(index, 'Transaction rejected by user.')
      } else if (step.value === 'requesting') {
        setStepError(
          index,
          getErrorMessage(e, 'Error submitting transaction request.'),
        )
      } else {
        setStepError(index, getErrorMessage(e, 'Transaction failed.'))
      }

      console.log(e)
      return null
    }

    const hasNextStep = await moveToNextExecutableStep(index + 1, id)
    if (!hasNextStep) return receipts.value

    if (toValue(options.skipConfirmation) ?? false) {
      return initializeRequest()
    }

    if (isActiveRun(id)) {
      step.value = 'confirm'
    }

    return receipts.value
  }

  const start = async () => {
    const id = beginRun()
    const hasStep = await moveToNextExecutableStep(0, id)
    if (!hasStep) return

    if (toValue(options.skipConfirmation) ?? false) {
      await initializeRequest()
      return
    }

    if (isActiveRun(id)) {
      step.value = 'confirm'
    }
  }

  const cancel = () => {
    runId += 1
    step.value = 'idle'
    error.value = ''
    resetStepStates()
  }

  const reset = () => {
    runId += 1
    step.value = 'idle'
    error.value = ''
    resetStepStates()
  }

  const stopWatchChainId = watchChainId(wagmiConfig as Config, {
    async onChange() {
      if (step.value !== 'chain') return

      await initializeRequest()
    },
  })

  watch(
    () => steps.value.map((transactionStep) => transactionStep.id),
    () => {
      if (step.value === 'idle') {
        resetStepStates()
      } else {
        reset()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    mounted = false
    runId += 1
    stopWatchChainId?.()
  })

  return {
    step,
    stepIndex,
    steps,
    stepStates,
    currentStep,
    currentStepState,
    currentTitle,
    currentLead,
    currentAction,
    error,
    tx,
    receipt,
    txLink,
    hashes,
    receipts,
    results,
    text,
    canDismiss,
    connector,
    initializeRequest,
    start,
    cancel,
    reset,
  }
}

export type MultiTransactionFlow = ReturnType<typeof useMultiTransactionFlow>
