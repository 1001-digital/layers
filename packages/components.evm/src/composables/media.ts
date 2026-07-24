import {
  computed,
  ref,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { useResolvedUrl } from './uri'
import { createCache } from '../utils/cache'
import {
  detectMediaInfoFromUrl,
  inspectMediaUrl,
  type MediaInfo,
  type MediaKind,
} from '../utils/media'

const mediaInfoCache = createCache<MediaInfo>(5 * 60 * 1000, 200)

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
  const info = ref<MediaInfo>(detectMediaInfoFromUrl(resolvedUrl.value))

  watch(
    resolvedUrl,
    async (url) => {
      const fromUrl = detectMediaInfoFromUrl(url)
      info.value = fromUrl

      if (!url || fromUrl.kind || typeof window === 'undefined') return

      try {
        const inspected = await mediaInfoCache.fetch(url, () =>
          inspectMediaUrl(url),
        )
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
