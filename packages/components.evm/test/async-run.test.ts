import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createAsyncRunGuard } from '../src/utils/async-run.ts'

describe('createAsyncRunGuard', () => {
  it('allows only one active action and unlocks after completion', () => {
    const busy: boolean[] = []
    const guard = createAsyncRunGuard((value) => busy.push(value))

    const first = guard.begin()

    assert.equal(typeof first, 'number')
    assert.equal(guard.begin(), null)
    assert.equal(guard.isActive(first!), true)
    assert.equal(guard.end(first!), true)
    assert.deepEqual(busy, [true, false])
    assert.equal(typeof guard.begin(), 'number')
  })

  it('invalidates UI writes without unlocking the execution', () => {
    const busy: boolean[] = []
    const guard = createAsyncRunGuard((value) => busy.push(value))
    const first = guard.begin()!

    guard.invalidate()

    assert.equal(guard.isActive(first), false)
    assert.equal(guard.begin(), null)
    assert.deepEqual(busy, [true])
    assert.equal(guard.end(first), true)
    assert.deepEqual(busy, [true, false])

    const retry = guard.begin()!
    assert.equal(guard.isActive(retry), true)
  })

  it('blocks retries until an invalidated action has actually settled', async () => {
    let busy = false
    let calls = 0
    let commits = 0
    let resolveFirst!: () => void
    let resolveRetry!: () => void
    const firstCompletion = new Promise<void>((resolve) => {
      resolveFirst = resolve
    })
    const retryCompletion = new Promise<void>((resolve) => {
      resolveRetry = resolve
    })
    const guard = createAsyncRunGuard((value) => {
      busy = value
    })

    const run = async (completion: Promise<void>) => {
      const token = guard.begin()
      if (token === null) return false

      calls += 1
      try {
        await completion
        if (!guard.isActive(token)) return false

        commits += 1
        return true
      } finally {
        guard.end(token)
      }
    }

    const first = run(firstCompletion)
    assert.equal(await run(Promise.resolve()), false)
    assert.equal(calls, 1)

    guard.invalidate()
    assert.equal(await run(retryCompletion), false)
    assert.equal(calls, 1)
    assert.equal(busy, true)

    resolveFirst()
    assert.equal(await first, false)
    assert.equal(busy, false)
    assert.equal(commits, 0)

    const retry = run(retryCompletion)
    assert.equal(calls, 2)
    assert.equal(busy, true)

    resolveRetry()
    assert.equal(await retry, true)
    assert.equal(busy, false)
    assert.equal(commits, 1)
  })

  it('can retry after a failed action releases its token', async () => {
    const guard = createAsyncRunGuard()
    let calls = 0

    const run = async () => {
      const token = guard.begin()
      if (token === null) return false

      try {
        calls += 1
        throw new Error('switch rejected')
      } catch {
        return false
      } finally {
        guard.end(token)
      }
    }

    assert.equal(await run(), false)
    assert.equal(await run(), false)
    assert.equal(calls, 2)
  })
})
