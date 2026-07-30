import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { GetCallsStatusReturnType } from 'viem/actions'
import {
  getCallsTransactionHash,
  isCallsResult,
} from '../src/utils/transaction-result.ts'

describe('transaction results', () => {
  it('distinguishes calls IDs from transaction hashes', () => {
    assert.equal(isCallsResult('0x01'), false)
    assert.equal(isCallsResult({ kind: 'calls', id: '0x02' }), true)
  })

  it('requires a successful calls receipt', () => {
    const receipt = { transactionHash: '0x03' }
    assert.equal(
      getCallsTransactionHash({
        status: 'success',
        receipts: [receipt],
      } as GetCallsStatusReturnType),
      '0x03',
    )
    assert.throws(
      () =>
        getCallsTransactionHash({
          status: 'failure',
          receipts: [],
        } as unknown as GetCallsStatusReturnType),
      /failed/,
    )
  })
})
