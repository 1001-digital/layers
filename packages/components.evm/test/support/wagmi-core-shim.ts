import type { TransactionReceipt } from 'viem'

type ConfigLike = {
  subscribe: (
    selector: (state: { chainId: number }) => number,
    listener: (chainId: number, previousChainId: number) => void,
  ) => () => void
}

type ReceiptWaiter = (parameters: {
  hash: `0x${string}`
}) => Promise<TransactionReceipt>

type CallsWaiter = (parameters: { id: string }) => Promise<unknown>

let receiptWaiter: ReceiptWaiter = async () => {
  throw new Error('No receipt waiter configured for this test.')
}

let callsWaiter: CallsWaiter = async () => {
  throw new Error('No calls waiter configured for this test.')
}

export const setReceiptWaiter = (waiter: ReceiptWaiter) => {
  receiptWaiter = waiter
}

export const setCallsWaiter = (waiter: CallsWaiter) => {
  callsWaiter = waiter
}

export const waitForTransactionReceipt = (
  _config: unknown,
  parameters: { hash: `0x${string}` },
) => receiptWaiter(parameters)

export const waitForCallsStatus = (
  _config: unknown,
  parameters: { id: string },
) => callsWaiter(parameters)

export const watchChainId = (
  config: ConfigLike,
  parameters: {
    onChange: (chainId: number, previousChainId: number) => void
  },
) => config.subscribe((state) => state.chainId, parameters.onChange)
