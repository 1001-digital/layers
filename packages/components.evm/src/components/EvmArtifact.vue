<template>
  <div
    class="evm-artifact"
    :style="rootStyle"
  >
    <slot
      v-if="isAnimationRenderer"
      name="animation"
      :src="resolvedAnimationUrl"
      :media-type="mediaType ?? undefined"
      :artifact-name="resolvedName ?? undefined"
      :poster="resolvedImage ?? undefined"
      :controls="controls"
      :muted="muted"
    >
      <img
        v-if="renderer === 'image'"
        :src="resolvedAnimationUrl"
        :alt="resolvedName ?? ''"
        @error="onAnimationError"
      />
      <video
        v-else-if="renderer === 'video'"
        :poster="resolvedImage ?? undefined"
        :controls="controls"
        :muted="muted"
        autoplay
        loop
        playsinline
        crossorigin="anonymous"
        @error="onAnimationError"
      >
        <source :src="resolvedAnimationUrl" />
      </video>
      <template v-else-if="renderer === 'audio'">
        <img
          v-if="resolvedImage"
          :src="resolvedImage"
          :alt="resolvedName ?? ''"
          class="audio-poster"
          @error="onImageError"
        />
        <audio
          controls
          autoplay
          class="audio-player"
          @error="onAnimationError"
        >
          <source :src="resolvedAnimationUrl" />
        </audio>
      </template>
      <EvmArtifactModel
        v-else-if="renderer === 'model'"
        :src="resolvedAnimationUrl"
        :alt="resolvedName ?? ''"
        :poster="resolvedImage ?? undefined"
        @error="onAnimationError"
        @import-error="onModelImportError"
      />
      <Embed
        v-else
        :src="resolvedAnimationUrl"
        :scroll="scroll"
        :width="width"
        :height="height"
      />
    </slot>
    <slot
      v-else-if="renderer === 'static'"
      name="static"
      :src="resolvedImage"
      :artifact-name="resolvedName ?? undefined"
    >
      <img
        :src="resolvedImage"
        :alt="resolvedName ?? ''"
        @error="onImageError"
      />
    </slot>
    <slot
      v-else
      name="fallback"
      :artifact-name="resolvedName ?? undefined"
      :error="lastError"
    >
      <div class="artifact-fallback">{{ resolvedName ?? 'Untitled' }}</div>
    </slot>
    <slot
      name="overlay"
      :show-animation="showAnimation"
      :has-animation="hasAnimation"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type CSSProperties } from 'vue'
import { Embed } from '@1001-digital/components'
import { useMediaInfo } from '../composables/media'
import { useResolvedUrl } from '../composables/uri'
import EvmArtifactModel from './EvmArtifactModel.vue'
import type { EvmArtifactProps, EvmArtifactEmits } from '../types'
import type { MediaKind } from '../utils/media'

type ArtifactError = { kind: 'image' | 'animation' | 'model'; url: string }

const props = withDefaults(defineProps<EvmArtifactProps>(), {
  useBackgroundColor: true,
  aspectRatio: 1,
  controls: false,
  // Muted by default so video autoplay isn't blocked by browser policy.
  muted: true,
  // Generative HTML artifacts routinely overflow their iframe by a pixel or
  // two; suppress the resulting scrollbars unless a consumer opts back in.
  scroll: false,
})
const emit = defineEmits<EvmArtifactEmits>()
const showAnimation = defineModel<boolean>('showAnimation', { default: false })

defineSlots<{
  animation?(props: {
    src: string
    mediaType: MediaKind | undefined
    artifactName: string | undefined
    poster: string | undefined
    controls: boolean
    muted: boolean
  }): unknown
  static?(props: { src: string; artifactName: string | undefined }): unknown
  overlay?(props: { showAnimation: boolean; hasAnimation: boolean }): unknown
  fallback?(props: {
    artifactName: string | undefined
    error: ArtifactError | null
  }): unknown
}>()

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const resolvedImageInput = computed(
  () => props.image ?? props.metadata?.image ?? null,
)
const resolvedAnimationInput = computed(
  () => props.animationUrl ?? props.metadata?.animation_url ?? null,
)
const resolvedName = computed(() => props.name ?? props.metadata?.name ?? null)
const resolvedBgColor = computed(
  () => props.backgroundColor ?? props.metadata?.background_color ?? null,
)

const resolvedImage = useResolvedUrl(
  () => resolvedImageInput.value ?? undefined,
)
const { resolvedUrl: resolvedAnimationUrl, kind: mediaType } = useMediaInfo(
  () => resolvedAnimationInput.value ?? undefined,
)

const hasAnimation = computed(() => !!resolvedAnimationUrl.value)

const renderer = computed<MediaKind | 'static' | 'fallback'>(() => {
  if (showAnimation.value && resolvedAnimationUrl.value) {
    const type = mediaType.value
    // SSR-safe renderers — render the same on server and client.
    if (type === 'image' || type === 'video' || type === 'audio') return type
    // Client-only renderers (model-viewer, Embed, unknown→Embed) defer to
    // a static/fallback render until after hydration so SSR matches.
    if (!isMounted.value) {
      return resolvedImage.value ? 'static' : 'fallback'
    }
    if (type === 'model') return 'model'
    return 'embed'
  }
  if (resolvedImage.value) return 'static'
  return 'fallback'
})

const isAnimationRenderer = computed(
  () => renderer.value !== 'static' && renderer.value !== 'fallback',
)

const lastError = ref<ArtifactError | null>(null)

function onImageError() {
  const url = resolvedImage.value
  if (!url) return
  const err: ArtifactError = { kind: 'image', url }
  lastError.value = err
  emit('error', err)
}

function onAnimationError() {
  const url = resolvedAnimationUrl.value
  if (!url) return
  const err: ArtifactError = { kind: 'animation', url }
  lastError.value = err
  emit('error', err)
}

function onModelImportError() {
  const url = resolvedAnimationUrl.value
  if (!url) return
  const err: ArtifactError = { kind: 'model', url }
  lastError.value = err
  emit('error', err)
}

const HEX_RE = /^#?[0-9a-fA-F]{6}$/

const rootStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    aspectRatio: String(props.aspectRatio),
  }
  if (
    props.useBackgroundColor &&
    resolvedBgColor.value &&
    HEX_RE.test(resolvedBgColor.value)
  ) {
    style.background = resolvedBgColor.value.startsWith('#')
      ? resolvedBgColor.value
      : `#${resolvedBgColor.value}`
  }
  return style
})
</script>

<style>
:root {
  --evm-artifact-shadow-inset: 10%;
  --evm-artifact-shadow-color: var(--gray-z-2);
  --evm-artifact-shadow-blur: 5rem;
  --evm-artifact-shadow-opacity: 0.25;
}
</style>

<style scoped>
.evm-artifact {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: size;

  img,
  video,
  :deep(.embed),
  :deep(model-viewer) {
    z-index: 1;
  }

  img,
  video {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: auto;
  }

  :deep(model-viewer) {
    width: 100%;
    height: 100%;
  }

  .audio-poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .audio-player {
    position: relative;
    z-index: 2;
    width: 90%;
  }

  .artifact-fallback {
    position: relative;
    z-index: 1;
    padding: var(--spacer);
    color: var(--gray-z-7);
    font-size: 0.875em;
    text-align: center;
  }

  &::before {
    content: '';
    position: absolute;
    inset: var(--evm-artifact-shadow-inset);
    background: var(--evm-artifact-shadow-color);
    filter: blur(var(--evm-artifact-shadow-blur));
    opacity: var(--evm-artifact-shadow-opacity);
    z-index: -1;
    height: 80%;
    top: 9%;
    border-radius: 20%;
  }
}
</style>
