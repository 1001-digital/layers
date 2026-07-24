export type MediaKind = 'image' | 'video' | 'audio' | 'model' | 'embed'

export interface MediaInfo {
  kind: MediaKind | null
  mimeType: string | null
  extension: string | null
}

export interface InspectMediaUrlOptions {
  fetch?: typeof globalThis.fetch
  timeoutMs?: number
}

const EXTENSION_KINDS: Record<string, MediaKind> = {
  avif: 'image',
  gif: 'image',
  jpeg: 'image',
  jpg: 'image',
  png: 'image',
  svg: 'image',
  webp: 'image',
  m4v: 'video',
  mov: 'video',
  mp4: 'video',
  webm: 'video',
  flac: 'audio',
  mp3: 'audio',
  ogg: 'audio',
  wav: 'audio',
  glb: 'model',
  gltf: 'model',
  htm: 'embed',
  html: 'embed',
}

const MIME_EXTENSIONS: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-m4v': 'm4v',
  'audio/flac': 'flac',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'model/gltf-binary': 'glb',
  'model/gltf+json': 'gltf',
  'text/html': 'html',
}

function normalizeMimeType(mimeType: string): string | null {
  return mimeType.split(';', 1)[0]?.trim().toLowerCase() || null
}

function kindFromMimeType(mimeType: string): MediaKind | null {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType === 'model/gltf-binary' || mimeType === 'model/gltf+json') {
    return 'model'
  }
  if (mimeType === 'text/html') return 'embed'
  return null
}

function extensionFromUrl(url: string): string | null {
  const path = url.split(/[?#]/, 1)[0] ?? ''
  const filename = path.split('/').pop() ?? ''
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
    extension: MIME_EXTENSIONS[normalized] ?? null,
  }
}

export function detectMediaInfoFromUrl(url: string): MediaInfo {
  const dataMimeType = mimeTypeFromDataUrl(url)
  if (dataMimeType) return detectMediaInfoFromMime(dataMimeType)

  const extension = extensionFromUrl(url)
  return {
    kind: extension ? (EXTENSION_KINDS[extension] ?? null) : null,
    mimeType: null,
    extension,
  }
}

export async function inspectMediaUrl(
  url: string,
  options: InspectMediaUrlOptions = {},
): Promise<MediaInfo> {
  const fromUrl = detectMediaInfoFromUrl(url)
  if (fromUrl.kind) return fromUrl

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 5_000,
  )

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
      extension: fromUrl.extension ?? fromMime.extension,
    }
  } finally {
    clearTimeout(timeout)
  }
}
