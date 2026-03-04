import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createArweaveHandler } from '../../src/protocols/arweave'
import { DwebFetchError } from '../../src/errors'

const mockWayfinderRequest = vi.fn()
const mockCreateWayfinderClient = vi.fn()

vi.mock('@ar.io/wayfinder-core', () => ({
  createWayfinderClient: (...args: unknown[]) => {
    mockCreateWayfinderClient(...args)
    return { request: mockWayfinderRequest }
  },
}))

describe('createArweaveHandler', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    mockWayfinderRequest.mockReset()
    mockCreateWayfinderClient.mockReset()
    mockFetch.mockReset()
    vi.stubGlobal('fetch', mockFetch)
  })

  describe('with network discovery (default)', () => {
    it('uses wayfinder client for ar:// URLs', async () => {
      mockWayfinderRequest.mockResolvedValue(new Response('arweave content'))

      const handler = createArweaveHandler({})
      const response = await handler.fetch('ar://txId123')

      expect(await response.text()).toBe('arweave content')
      expect(mockWayfinderRequest).toHaveBeenCalledWith('ar://txId123')
    })

    it('lazily initializes wayfinder on first call', async () => {
      mockWayfinderRequest.mockResolvedValue(new Response('ok'))

      const handler = createArweaveHandler({})
      expect(mockCreateWayfinderClient).not.toHaveBeenCalled()

      await handler.fetch('ar://txId123')
      expect(mockCreateWayfinderClient).toHaveBeenCalledTimes(1)
    })

    it('reuses the same wayfinder instance', async () => {
      mockWayfinderRequest.mockResolvedValue(new Response('ok'))

      const handler = createArweaveHandler({})
      await handler.fetch('ar://txId1')
      await handler.fetch('ar://txId2')

      expect(mockCreateWayfinderClient).toHaveBeenCalledTimes(1)
    })
  })

  describe('with static gateways', () => {
    it('uses static gateways when gateways are provided', async () => {
      mockFetch.mockResolvedValue(new Response('gateway content', { status: 200 }))

      const handler = createArweaveHandler({
        arweave: { gateways: ['https://my-gateway.net'] },
      })
      const response = await handler.fetch('ar://txId123')

      expect(await response.text()).toBe('gateway content')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://my-gateway.net/txId123',
        expect.any(Object),
      )
      expect(mockCreateWayfinderClient).not.toHaveBeenCalled()
    })

    it('uses static gateways when useNetworkDiscovery is false', async () => {
      mockFetch.mockResolvedValue(new Response('ok', { status: 200 }))

      const handler = createArweaveHandler({
        arweave: { useNetworkDiscovery: false },
      })
      await handler.fetch('ar://txId123')

      expect(mockCreateWayfinderClient).not.toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalled()
    })

    it('tries gateways in order and returns first successful', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('gateway 1 down'))
        .mockResolvedValueOnce(new Response('from gateway 2', { status: 200 }))

      const handler = createArweaveHandler({
        arweave: {
          gateways: ['https://gateway1.net', 'https://gateway2.net'],
        },
      })
      const response = await handler.fetch('ar://txId123')

      expect(await response.text()).toBe('from gateway 2')
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('throws DwebFetchError when all gateways fail', async () => {
      mockFetch.mockRejectedValue(new Error('all down'))

      const handler = createArweaveHandler({
        arweave: { gateways: ['https://gw1.net', 'https://gw2.net'] },
      })

      await expect(handler.fetch('ar://txId123')).rejects.toThrow(
        DwebFetchError,
      )
      await expect(handler.fetch('ar://txId123')).rejects.toThrow(
        'All Arweave gateways failed',
      )
    })

    it('skips non-ok responses and tries next gateway', async () => {
      mockFetch
        .mockResolvedValueOnce(new Response('not found', { status: 404 }))
        .mockResolvedValueOnce(new Response('found', { status: 200 }))

      const handler = createArweaveHandler({
        arweave: {
          gateways: ['https://gw1.net', 'https://gw2.net'],
        },
      })
      const response = await handler.fetch('ar://txId123')

      expect(await response.text()).toBe('found')
    })
  })

  it('wraps errors in DwebFetchError', async () => {
    mockWayfinderRequest.mockRejectedValue(new Error('wayfinder error'))

    const handler = createArweaveHandler({})

    await expect(handler.fetch('ar://txId123')).rejects.toThrow(
      DwebFetchError,
    )
  })
})
