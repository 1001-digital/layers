import {
  computed,
  ref,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import {
  detectMediaInfoFromUrl,
  fetchMediaInfo,
  getCachedMediaInfo,
  type MediaInfo,
  type MediaKind,
} from '@1001-digital/components'
import { useResolvedUrl } from './uri'

export interface UseMediaInfoResult {
  resolvedUrl: Ref<string>
  kind: ComputedRef<MediaKind | null>
  mimeType: ComputedRef<string | null>
  extension: ComputedRef<string | null>
}

export function useMediaInfo(
  uri: MaybeRefOrGetter<string | undefined>,
): UseMediaInfoResult {
  const resolvedUrl = useResolvedUrl(uri)
  const info = ref<MediaInfo>({ kind: null, mimeType: null, extension: null })

  watch(
    resolvedUrl,
    async (url) => {
      const fromUrl = detectMediaInfoFromUrl(url)
      info.value = fromUrl

      // Data URLs are fully described by detection; probing is browser-only.
      if (!url || fromUrl.kind || url.startsWith('data:')) return
      if (typeof window === 'undefined') return

      const cached = getCachedMediaInfo(url)
      if (cached) {
        info.value = cached
        return
      }

      try {
        const inspected = await fetchMediaInfo(url)
        if (resolvedUrl.value === url) info.value = inspected
      } catch {
        // Best effort: CORS, timeouts, and unavailable resources retain the
        // extension-derived result so consumers can choose their own fallback.
      }
    },
    { immediate: true },
  )

  return {
    resolvedUrl,
    kind: computed(() => info.value.kind),
    mimeType: computed(() => info.value.mimeType),
    extension: computed(() => info.value.extension),
  }
}
