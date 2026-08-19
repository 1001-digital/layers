import { createCache } from './cache'

export type MediaKind = 'image' | 'video' | 'audio' | 'model' | 'embed'

export interface MediaInfo {
  kind: MediaKind | null
  mimeType: string | null
  extension: string | null
}

export interface InspectMediaUrlOptions {
  fetch?: typeof globalThis.fetch
}

interface MediaFormat {
  kind: MediaKind
  mimeType: string
  // First entry is the canonical extension for the MIME type.
  extensions: string[]
  mimeAliases?: string[]
}

const MEDIA_FORMATS: MediaFormat[] = [
  { kind: 'image', mimeType: 'image/avif', extensions: ['avif'] },
  { kind: 'image', mimeType: 'image/gif', extensions: ['gif'] },
  { kind: 'image', mimeType: 'image/jpeg', extensions: ['jpg', 'jpeg'] },
  { kind: 'image', mimeType: 'image/png', extensions: ['png'] },
  { kind: 'image', mimeType: 'image/svg+xml', extensions: ['svg'] },
  { kind: 'image', mimeType: 'image/webp', extensions: ['webp'] },
  { kind: 'video', mimeType: 'video/mp4', extensions: ['mp4'] },
  { kind: 'video', mimeType: 'video/quicktime', extensions: ['mov'] },
  { kind: 'video', mimeType: 'video/webm', extensions: ['webm'] },
  { kind: 'video', mimeType: 'video/x-m4v', extensions: ['m4v'] },
  { kind: 'audio', mimeType: 'audio/flac', extensions: ['flac'] },
  { kind: 'audio', mimeType: 'audio/mpeg', extensions: ['mp3'] },
  { kind: 'audio', mimeType: 'audio/ogg', extensions: ['ogg'] },
  {
    kind: 'audio',
    mimeType: 'audio/wav',
    extensions: ['wav'],
    mimeAliases: ['audio/x-wav'],
  },
  { kind: 'model', mimeType: 'model/gltf-binary', extensions: ['glb'] },
  { kind: 'model', mimeType: 'model/gltf+json', extensions: ['gltf'] },
  { kind: 'embed', mimeType: 'text/html', extensions: ['html', 'htm'] },
]

const FORMATS_BY_EXTENSION = new Map<string, MediaFormat>()
const FORMATS_BY_MIME = new Map<string, MediaFormat>()
for (const format of MEDIA_FORMATS) {
  for (const extension of format.extensions) {
    FORMATS_BY_EXTENSION.set(extension, format)
  }
  FORMATS_BY_MIME.set(format.mimeType, format)
  for (const alias of format.mimeAliases ?? []) {
    FORMATS_BY_MIME.set(alias, format)
  }
}

function normalizeMimeType(mimeType: string): string | null {
  return mimeType.split(';', 1)[0]?.trim().toLowerCase() || null
}

function kindFromMimeType(mimeType: string): MediaKind | null {
  const format = FORMATS_BY_MIME.get(mimeType)
  if (format) return format.kind
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return null
}

function extensionFromUrl(url: string): string | null {
  const path = url.split(/[?#]/, 1)[0] ?? ''
  // Skip the scheme and authority so a bare hostname's TLD is not mistaken
  // for a file extension (https://example.com is not a .com file).
  const pathname = path.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '')
  const filename = pathname.split('/').pop() ?? ''
  return filename.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? null
}

function mimeTypeFromDataUrl(url: string): string | null {
  if (!url.startsWith('data:')) return null
  const metadata = url.slice(5).split(',', 1)[0] ?? ''
  const mimeType = metadata.split(';', 1)[0]
  return mimeType ? normalizeMimeType(mimeType) : null
}

export function detectMediaInfoFromMime(mimeType: string): MediaInfo {
  const normalized = normalizeMimeType(mimeType)
  if (!normalized) {
    return { kind: null, mimeType: null, extension: null }
  }

  return {
    kind: kindFromMimeType(normalized),
    mimeType: normalized,
    extension: FORMATS_BY_MIME.get(normalized)?.extensions[0] ?? null,
  }
}

export function detectMediaInfoFromUrl(url: string): MediaInfo {
  const dataMimeType = mimeTypeFromDataUrl(url)
  if (dataMimeType) return detectMediaInfoFromMime(dataMimeType)

  const extension = extensionFromUrl(url)
  const format = extension ? FORMATS_BY_EXTENSION.get(extension) : undefined
  return {
    kind: format?.kind ?? null,
    mimeType: format?.mimeType ?? null,
    extension,
  }
}

const PROBE_TIMEOUT = 10_000

export async function inspectMediaUrl(
  url: string,
  options: InspectMediaUrlOptions = {},
): Promise<MediaInfo> {
  const fromUrl = detectMediaInfoFromUrl(url)
  // A data: URL already carries its authoritative MIME type — probing it
  // would only re-read the payload.
  if (fromUrl.kind || url.startsWith('data:')) return fromUrl

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT)

  try {
    const response = await (options.fetch ?? globalThis.fetch)(url, {
      method: 'HEAD',
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`Media probe failed with status ${response.status}`)
    }

    const contentType = response.headers.get('Content-Type')
    if (!contentType) return fromUrl

    const fromMime = detectMediaInfoFromMime(contentType)
    return {
      ...fromMime,
      extension: fromMime.extension ?? fromUrl.extension,
    }
  } finally {
    clearTimeout(timeout)
  }
}

const mediaInfoCache = createCache<MediaInfo>(5 * 60 * 1000, 200)

export function getCachedMediaInfo(url: string): MediaInfo | undefined {
  return mediaInfoCache.get(url)
}

export async function fetchMediaInfo(
  url: string,
  options?: InspectMediaUrlOptions,
): Promise<MediaInfo> {
  // Data URLs resolve synchronously and would bloat the cache with
  // payload-sized keys.
  if (url.startsWith('data:')) return inspectMediaUrl(url, options)

  const info = await mediaInfoCache.fetch(url, () =>
    inspectMediaUrl(url, options),
  )
  // An unknown result may be transient (missing or generic Content-Type),
  // so concurrent lookups share one probe but the verdict isn't pinned.
  if (!info.kind) mediaInfoCache.evict(url)
  return info
}
