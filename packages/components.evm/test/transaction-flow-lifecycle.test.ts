import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'
import { createRenderer, defineComponent, h, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import { createConfig, http, WagmiPlugin } from '@wagmi/vue'
import type { TransactionReceipt } from 'viem'
import { mainnet } from 'viem/chains'
import { useMultiTransactionFlow } from '../src/composables/multiTransactionFlow.ts'
import type { MultiTransactionFlow } from '../src/composables/multiTransactionFlow.ts'
import { useTransactionFlow } from '../src/composables/transactionFlow.ts'
import type { TransactionFlow } from '../src/composables/transactionFlow.ts'
import type { MultiTransactionFlowStep } from '../src/types.ts'
import { setCallsWaiter, setReceiptWaiter } from './support/wagmi-core-shim.ts'

interface HostNode {
  children?: HostNode[]
  parent?: HostNode
  text?: string
  type?: string
}

const renderer = createRenderer<HostNode, HostNode>({
  patchProp() {},
  insert(child, parent) {
    parent.children ??= []
    parent.children.push(child)
    child.parent = parent
  },
  remove(child) {
    const index = child.parent?.children?.indexOf(child) ?? -1
    if (index >= 0) child.parent!.children!.splice(index, 1)
  },
  createElement(type) {
    return { type, children: [] }
  },
  createText(text) {
    return { text }
  },
  createComment(text) {
    return { text }
  },
  setText(node, text) {
    node.text = text
  },
  setElementText(node, text) {
    node.text = text
  },
  parentNode(node) {
    return node.parent ?? null
  },
  nextSibling() {
    return null
  },
  querySelector() {
    return null
  },
  setScopeId() {},
  cloneNode(node) {
    return { ...node }
  },
  insertStaticContent(content, parent) {
    const node = { text: content, parent }
    parent.children ??= []
    parent.children.push(node)
    return [node, node]
  },
})

const require = createRequire(import.meta.url)
const wagmiRequire = createRequire(require.resolve('@wagmi/vue/package.json'))
const { VueQueryPlugin } = wagmiRequire('@tanstack/vue-query')

const createTestConfig = () => {
  const config = createConfig({
    chains: [mainnet],
    transports: { [mainnet.id]: http() },
  })
  const connector = {
    id: 'test',
    name: 'Test Wallet',
    type: 'test',
    uid: 'test',
  }
  config.setState((state) => ({
    ...state,
    status: 'connected',
    current: 'test',
    connections: new Map([
      [
        'test',
        {
          accounts: ['0x0000000000000000000000000000000000000001'],
          chainId: mainnet.id,
          connector,
        },
      ],
    ]),
  }))

  const originalSubscribe = config.subscribe.bind(config)
  let chainDisposals = 0
  config.subscribe = ((selector, listener, options) => {
    const dispose = originalSubscribe(selector, listener, options)
    if (typeof selector(config.state) !== 'number') return dispose

    return () => {
      chainDisposals += 1
      dispose()
    }
  }) as typeof config.subscribe

  return {
    config,
    chainDisposals: () => chainDisposals,
  }
}

const mountFlow = () => {
  const { config, chainDisposals } = createTestConfig()
  let flow!: TransactionFlow
  const Root = defineComponent({
    setup() {
      flow = useTransactionFlow({
        keepOpen: true,
        delayAfter: 0,
        autoCloseSuccess: false,
      })
      return () => h('div')
    },
  })
  const app = renderer.createApp(Root)
  app.use(WagmiPlugin, { config })
  app.use(VueQueryPlugin)
  app.mount({ children: [] })

  return {
    flow,
    chainDisposals,
    unmount: () => app.unmount(),
  }
}

const mountMultiFlow = (steps: Ref<MultiTransactionFlowStep[]>) => {
  const { config, chainDisposals } = createTestConfig()
  let flow!: MultiTransactionFlow
  const Root = defineComponent({
    setup() {
      flow = useMultiTransactionFlow({
        steps,
        delayAfter: 0,
        autoCloseSuccess: false,
      })
      return () => h('div')
    },
  })
  const app = renderer.createApp(Root)
  app.use(WagmiPlugin, { config })
  app.use(VueQueryPlugin)
  app.mount({ children: [] })

  return {
    flow,
    chainDisposals,
    unmount: () => app.unmount(),
  }
}

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

const flushPromises = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

const receiptFor = (hash: `0x${string}`) =>
  ({ transactionHash: hash }) as TransactionReceipt

describe('useTransactionFlow lifecycle', () => {
  it('keeps a cancelled request locked through its late receipt', async () => {
    const mounted = mountFlow()
    const request = deferred<`0x${string}`>()
    const receipt = deferred<TransactionReceipt>()
    let calls = 0
    let receiptCalls = 0
    const execute = () => {
      calls += 1
      return request.promise
    }
    setReceiptWaiter(({ hash }) => {
      receiptCalls += 1
      return receipt.promise.then((value) => {
        assert.equal(value.transactionHash, hash)
        return value
      })
    })

    const first = mounted.flow.initializeRequest(execute)
    const duplicate = mounted.flow.initializeRequest(execute)
    await flushPromises()

    assert.equal(calls, 1)
    assert.equal(mounted.flow.isBusy.value, true)
    assert.equal(await duplicate, null)

    mounted.flow.cancel()
    assert.equal(mounted.flow.step.value, 'idle')
    assert.equal(mounted.flow.isBusy.value, true)
    assert.equal(await mounted.flow.initializeRequest(execute), null)
    assert.equal(calls, 1)

    const hash = `0x${'1'.repeat(64)}` as const
    request.resolve(hash)
    await flushPromises()
    assert.equal(receiptCalls, 1)
    assert.equal(mounted.flow.isBusy.value, true)
    assert.equal(await mounted.flow.initializeRequest(execute), null)
    assert.equal(calls, 1)

    receipt.resolve(receiptFor(hash))
    assert.equal(await first, null)
    assert.equal(mounted.flow.step.value, 'idle')
    assert.equal(mounted.flow.tx.value, null)
    assert.equal(mounted.flow.receipt.value, null)
    assert.equal(mounted.flow.isBusy.value, false)

    mounted.unmount()
    assert.equal(mounted.chainDisposals(), 1)
  })

  it('disposes its chain watcher and blocks state updates after unmount', async () => {
    const mounted = mountFlow()
    const request = deferred<`0x${string}`>()
    const receipt = deferred<TransactionReceipt>()
    setReceiptWaiter(() => receipt.promise)
    const running = mounted.flow.initializeRequest(() => request.promise)
    await flushPromises()
    assert.equal(mounted.flow.step.value, 'requesting')

    mounted.unmount()
    assert.equal(mounted.chainDisposals(), 1)
    const hash = `0x${'2'.repeat(64)}` as const
    request.resolve(hash)
    await flushPromises()
    receipt.resolve(receiptFor(hash))
    assert.equal(await running, null)
    assert.equal(mounted.flow.step.value, 'requesting')
    assert.equal(mounted.flow.tx.value, null)
    assert.equal(mounted.flow.receipt.value, null)
  })

  it('keeps a cancelled calls request locked through transaction polling', async () => {
    const mounted = mountFlow()
    const request = deferred<{ kind: 'calls'; id: string }>()
    const callsStatus = deferred<unknown>()
    const receipt = deferred<TransactionReceipt>()
    let callsPolls = 0
    let receiptPolls = 0
    setCallsWaiter(({ id }) => {
      callsPolls += 1
      assert.equal(id, 'calls-id')
      return callsStatus.promise
    })
    setReceiptWaiter(() => {
      receiptPolls += 1
      return receipt.promise
    })

    const running = mounted.flow.initializeRequest(() => request.promise)
    await flushPromises()
    mounted.flow.cancel()
    request.resolve({ kind: 'calls', id: 'calls-id' })
    await flushPromises()

    assert.equal(callsPolls, 1)
    assert.equal(mounted.flow.isBusy.value, true)
    assert.equal(mounted.flow.callsId.value, null)

    const hash = `0x${'6'.repeat(64)}` as const
    callsStatus.resolve({
      status: 'success',
      receipts: [{ transactionHash: hash }],
    })
    await flushPromises()

    assert.equal(receiptPolls, 1)
    assert.equal(mounted.flow.isBusy.value, true)
    assert.equal(mounted.flow.tx.value, null)

    receipt.resolve(receiptFor(hash))
    assert.equal(await running, null)
    assert.equal(mounted.flow.isBusy.value, false)
    assert.equal(mounted.flow.receipt.value, null)
    mounted.unmount()
  })

  it('clears stale transaction state when a new confirmation starts', () => {
    const mounted = mountFlow()
    const hash = `0x${'3'.repeat(64)}` as const

    mounted.flow.error.value = 'stale error'
    mounted.flow.tx.value = hash
    mounted.flow.callsId.value = 'stale-calls'
    mounted.flow.receipt.value = receiptFor(hash)
    mounted.flow.start()

    assert.equal(mounted.flow.step.value, 'confirm')
    assert.equal(mounted.flow.error.value, '')
    assert.equal(mounted.flow.tx.value, null)
    assert.equal(mounted.flow.callsId.value, null)
    assert.equal(mounted.flow.receipt.value, null)
    mounted.unmount()
  })

  it('preserves the chain phase while a chain retry is checking', async () => {
    const mounted = mountFlow()
    const request = deferred<`0x${string}`>()
    const receipt = deferred<TransactionReceipt>()
    setReceiptWaiter(() => receipt.promise)
    mounted.flow.step.value = 'chain'

    const running = mounted.flow.initializeRequest(() => request.promise)

    assert.equal(mounted.flow.step.value, 'chain')
    assert.equal(mounted.flow.isBusy.value, true)
    await flushPromises()
    assert.equal(mounted.flow.step.value, 'requesting')

    const hash = `0x${'4'.repeat(64)}` as const
    request.resolve(hash)
    await flushPromises()
    receipt.resolve(receiptFor(hash))
    assert.equal((await running)?.transactionHash, hash)
    mounted.unmount()
  })
})

describe('useMultiTransactionFlow lifecycle', () => {
  it('invalidates a busy preflight when step identity changes', async () => {
    const skip = deferred<boolean>()
    let requests = 0
    const createStep = (id: string): MultiTransactionFlowStep => ({
      id,
      request: async () => {
        requests += 1
        return `0x${'5'.repeat(64)}`
      },
    })
    const oldStep = createStep('old')
    oldStep.skip = () => skip.promise
    const steps = ref([oldStep])
    const mounted = mountMultiFlow(steps)

    const running = mounted.flow.start()
    await flushPromises()
    assert.equal(mounted.flow.isBusy.value, true)

    steps.value = [createStep('new')]
    await nextTick()

    assert.equal(mounted.flow.step.value, 'idle')
    assert.equal(mounted.flow.stepStates.value[0]?.id, 'new')
    assert.equal(mounted.flow.isBusy.value, true)
    await mounted.flow.start()
    assert.equal(requests, 0)

    skip.resolve(false)
    await running
    assert.equal(mounted.flow.step.value, 'idle')
    assert.equal(mounted.flow.isBusy.value, false)
    assert.equal(requests, 0)

    mounted.unmount()
    assert.equal(mounted.chainDisposals(), 1)
  })
})
