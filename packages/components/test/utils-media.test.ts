import assert from 'node:assert/strict'
import { test } from 'vitest'
import {
  detectMediaInfoFromMime,
  detectMediaInfoFromUrl,
  fetchMediaInfo,
  inspectMediaUrl,
} from '../src/base/utils/media'

test('detects known media extensions with case, query, and fragment noise', () => {
  assert.deepEqual(
    detectMediaInfoFromUrl('ipfs://cid/path/ARTWORK.MP4?download=1#media'),
    {
      kind: 'video',
      mimeType: 'video/mp4',
      extension: 'mp4',
    },
  )
})

test('does not mistake a bare hostname TLD for a file extension', () => {
  assert.deepEqual(detectMediaInfoFromUrl('https://example.com'), {
    kind: null,
    mimeType: null,
    extension: null,
  })
})

test('detects and normalizes MIME types', () => {
  assert.deepEqual(
    detectMediaInfoFromMime(' Video/QuickTime; charset=binary '),
    {
      kind: 'video',
      mimeType: 'video/quicktime',
      extension: 'mov',
    },
  )
  assert.deepEqual(detectMediaInfoFromMime('model/gltf-binary'), {
    kind: 'model',
    mimeType: 'model/gltf-binary',
    extension: 'glb',
  })
})

test('detects media information synchronously from data URLs', () => {
  assert.deepEqual(
    detectMediaInfoFromUrl('data:image/svg+xml;base64,PHN2Zy8+'),
    {
      kind: 'image',
      mimeType: 'image/svg+xml',
      extension: 'svg',
    },
  )
})

test('inspects extensionless resources with one HEAD request', async () => {
  let requests = 0
  const fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    requests++
    assert.equal(init?.method, 'HEAD')
    return new Response(null, {
      status: 200,
      headers: { 'Content-Type': 'video/quicktime' },
    })
  }) as typeof globalThis.fetch

  assert.deepEqual(
    await inspectMediaUrl('https://gateway.example/ipfs/cid', { fetch }),
    {
      kind: 'video',
      mimeType: 'video/quicktime',
      extension: 'mov',
    },
  )
  assert.equal(requests, 1)
})

test('prefers the Content-Type extension over an unrecognized URL extension', async () => {
  const fetch = (async () =>
    new Response(null, {
      status: 200,
      headers: { 'Content-Type': 'video/mp4' },
    })) as typeof globalThis.fetch

  assert.deepEqual(
    await inspectMediaUrl('https://gateway.example/artwork.bin', { fetch }),
    {
      kind: 'video',
      mimeType: 'video/mp4',
      extension: 'mp4',
    },
  )
})

test('does not probe URLs with a known extension', async () => {
  const fetch = (() => {
    throw new Error('unexpected fetch')
  }) as typeof globalThis.fetch

  assert.deepEqual(
    await inspectMediaUrl('https://example.com/art.png', { fetch }),
    {
      kind: 'image',
      mimeType: 'image/png',
      extension: 'png',
    },
  )
})

test('does not probe data URLs even when the MIME type is unclassifiable', async () => {
  const fetch = (() => {
    throw new Error('unexpected fetch')
  }) as typeof globalThis.fetch

  assert.deepEqual(
    await inspectMediaUrl('data:application/pdf;base64,JVBERi0=', { fetch }),
    {
      kind: null,
      mimeType: 'application/pdf',
      extension: null,
    },
  )
})

test('rejects unsuccessful probes so callers can retry later', async () => {
  const fetch = (async () =>
    new Response(null, { status: 503 })) as typeof globalThis.fetch

  await assert.rejects(
    inspectMediaUrl('https://gateway.example/ipfs/cid', { fetch }),
    /status 503/,
  )
})

test('caches successful probe results', async () => {
  let requests = 0
  const fetch = (async () => {
    requests++
    return new Response(null, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  }) as typeof globalThis.fetch

  const url = 'https://gateway.example/ipfs/cached-cid'
  assert.equal((await fetchMediaInfo(url, { fetch })).kind, 'audio')
  assert.equal((await fetchMediaInfo(url, { fetch })).kind, 'audio')
  assert.equal(requests, 1)
})

test('does not pin unknown probe results, so later lookups retry', async () => {
  let requests = 0
  const fetch = (async () => {
    requests++
    return new Response(null, {
      status: 200,
      headers: {
        'Content-Type':
          requests === 1 ? 'application/octet-stream' : 'video/mp4',
      },
    })
  }) as typeof globalThis.fetch

  const url = 'https://gateway.example/ipfs/transient-cid'
  assert.equal((await fetchMediaInfo(url, { fetch })).kind, null)
  assert.equal((await fetchMediaInfo(url, { fetch })).kind, 'video')
  assert.equal(requests, 2)
})
