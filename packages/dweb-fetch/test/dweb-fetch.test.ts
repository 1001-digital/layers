import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createDwebFetch, DwebUnsupportedProtocolError } from '../src/index'

const mockVerifiedFetch = vi.fn()
vi.mock('@helia/verified-fetch', () => ({
  createVerifiedFetch: vi.fn().mockResolvedValue(
    (...args: unknown[]) => mockVerifiedFetch(...args),
  ),
}))

const mockWayfinderRequest = vi.fn()
vi.mock('@ar.io/wayfinder-core', () => ({
  createWayfinderClient: vi.fn().mockReturnValue({
    request: (...args: unknown[]) => mockWayfinderRequest(...args),
  }),
}))

describe('createDwebFetch', () => {
  const mockGlobalFetch = vi.fn()

  beforeEach(() => {
    mockVerifiedFetch.mockReset()
    mockWayfinderRequest.mockReset()
    mockGlobalFetch.mockReset()
    vi.stubGlobal('fetch', mockGlobalFetch)
  })

  it('returns a function', () => {
    const dwebFetch = createDwebFetch()
    expect(typeof dwebFetch).toBe('function')
  })

  it('routes ipfs:// to IPFS handler', async () => {
    mockVerifiedFetch.mockResolvedValue(new Response('ipfs data'))

    const dwebFetch = createDwebFetch()
    const response = await dwebFetch('ipfs://bafyABC')

    expect(await response.text()).toBe('ipfs data')
  })

  it('routes ipns:// to IPFS handler', async () => {
    mockVerifiedFetch.mockResolvedValue(new Response('ipns data'))

    const dwebFetch = createDwebFetch()
    const response = await dwebFetch('ipns://example.eth')

    expect(await response.text()).toBe('ipns data')
  })

  it('routes ar:// to Arweave handler', async () => {
    mockWayfinderRequest.mockResolvedValue(new Response('arweave data'))

    const dwebFetch = createDwebFetch()
    const response = await dwebFetch('ar://txId123')

    expect(await response.text()).toBe('arweave data')
  })

  it('routes https:// to HTTPS handler', async () => {
    mockGlobalFetch.mockResolvedValue(new Response('https data'))

    const dwebFetch = createDwebFetch()
    const response = await dwebFetch('https://example.com')

    expect(await response.text()).toBe('https data')
  })

  it('routes http:// to HTTPS handler', async () => {
    mockGlobalFetch.mockResolvedValue(new Response('http data'))

    const dwebFetch = createDwebFetch()
    const response = await dwebFetch('http://example.com')

    expect(await response.text()).toBe('http data')
  })

  it('throws DwebUnsupportedProtocolError for unknown schemes', async () => {
    const dwebFetch = createDwebFetch()

    await expect(dwebFetch('ftp://example.com')).rejects.toThrow(
      DwebUnsupportedProtocolError,
    )
  })

  it('throws DwebUnsupportedProtocolError for schemeless URLs', async () => {
    const dwebFetch = createDwebFetch()

    await expect(dwebFetch('just-a-string')).rejects.toThrow(
      DwebUnsupportedProtocolError,
    )
  })

  it('includes the scheme in the error', async () => {
    const dwebFetch = createDwebFetch()

    try {
      await dwebFetch('ftp://example.com')
    } catch (error) {
      expect(error).toBeInstanceOf(DwebUnsupportedProtocolError)
      expect((error as DwebUnsupportedProtocolError).scheme).toBe('ftp')
    }
  })
})
