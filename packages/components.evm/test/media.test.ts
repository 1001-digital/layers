import assert from 'node:assert/strict'
import test from 'node:test'
import {
  detectMediaInfoFromMime,
  detectMediaInfoFromUrl,
  inspectMediaUrl,
} from '../src/utils/media.ts'

test('detects known media extensions with case, query, and fragment noise', () => {
  assert.deepEqual(
    detectMediaInfoFromUrl('ipfs://cid/path/ARTWORK.MP4?download=1#media'),
    {
      kind: 'video',
      mimeType: null,
      extension: 'mp4',
    },
  )
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

test('does not probe URLs with a known extension', async () => {
  const fetch = (() => {
    throw new Error('unexpected fetch')
  }) as typeof globalThis.fetch

  assert.deepEqual(
    await inspectMediaUrl('https://example.com/art.png', { fetch }),
    {
      kind: 'image',
      mimeType: null,
      extension: 'png',
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
