import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createSiweMessage } from '../src/utils/siwe.ts'
import { getRpcErrorCode, isUserRejection } from '../src/utils/errors.ts'

const base = {
  domain: 'networked.art',
  address: '0x1234567890AbcdEF1234567890aBcdef12345678',
  uri: 'https://networked.art',
  chainId: 1,
  nonce: 'abcdef123456',
  issuedAt: '2026-08-08T00:00:00.000Z',
}

describe('createSiweMessage', () => {
  it('is EIP-4361 canonical with a statement', () => {
    const msg = createSiweMessage({
      ...base,
      statement: 'Sign in to networked.art',
    })
    // address LF, LF, statement LF, LF, "URI:"
    assert.equal(
      msg,
      [
        'networked.art wants you to sign in with your Ethereum account:',
        '0x1234567890AbcdEF1234567890aBcdef12345678',
        '',
        'Sign in to networked.art',
        '',
        'URI: https://networked.art',
        'Version: 1',
        'Chain ID: 1',
        'Nonce: abcdef123456',
        'Issued At: 2026-08-08T00:00:00.000Z',
      ].join('\n'),
    )
  })

  it('keeps the empty statement block when no statement (two blank lines before URI)', () => {
    const msg = createSiweMessage(base)
    const between = msg.split(base.address)[1].split('URI')[0]
    // Canonical form: address LF, LF, (no statement), LF, "URI:" => "\n\n\n"
    assert.equal(between, '\n\n\n')
  })
})

describe('getRpcErrorCode', () => {
  it('extracts a nested EIP-1193 / JSON-RPC code from the cause chain', () => {
    const err = {
      message: 'wrapper',
      cause: { message: 'inner', code: -32603 },
    }
    assert.equal(getRpcErrorCode(err), -32603)
  })

  it('returns undefined when no numeric code is present', () => {
    assert.equal(getRpcErrorCode(new Error('boom')), undefined)
  })
})

describe('isUserRejection', () => {
  it('detects 4001 anywhere in the cause chain', () => {
    assert.equal(isUserRejection({ cause: { code: 4001 } }), true)
    assert.equal(isUserRejection({ message: 'User denied the request' }), true)
    assert.equal(isUserRejection({ code: -32603 }), false)
  })
})
