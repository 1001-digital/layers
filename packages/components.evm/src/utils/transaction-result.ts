import type { Hash } from 'viem'
import type { GetCallsStatusReturnType } from 'viem/actions'
import type { TransactionFlowRequestResult } from '../types'

export function isCallsResult(
  result: TransactionFlowRequestResult,
): result is { kind: 'calls'; id: string } {
  return typeof result !== 'string' && result.kind === 'calls'
}

export function getCallsTransactionHash(
  status: GetCallsStatusReturnType,
): Hash {
  if (status.status !== 'success')
    throw new Error('Sponsored transaction failed.')
  const receipt = status.receipts?.[0]
  if (!receipt)
    throw new Error('Sponsored transaction confirmed without a receipt.')
  return receipt.transactionHash
}
