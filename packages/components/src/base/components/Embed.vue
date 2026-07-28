<template>
  <div
    class="embed"
    :class="{ playable: isPlayable, sized }"
    :style="sizeStyle"
    @touchmove.stop.prevent="() => null"
  >
    <video
      v-if="isPlayable"
      autoplay
      muted
      playsinline
      loop
      controls
      crossorigin="anonymous"
    >
      <source
        :src="src"
        :type="mediaType"
      />
      Your browser does not support the video tag.
    </video>
    <iframe
      v-else
      ref="frame"
      frameborder="0"
      :scrolling="scroll ? undefined : 'no'"
      :src="src"
      sandbox="allow-scripts"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { fetchMediaInfo } from '../utils/media'

const props = withDefaults(
  defineProps<{
    src: string
    // Whether the embedded document may show its own scrollbars. Set false for
    // content that overflows its frame by a hair (generative art, etc.).
    scroll?: boolean
    // Native pixel dimensions to render the iframe at. When both are set the
    // iframe renders at these exact dimensions and is scaled to fit the frame
    // (contain), so the document keeps its intended resolution and aspect ratio.
    width?: number
    height?: number
  }>(),
  {
    scroll: true,
  },
)

const sized = computed(() => !!props.width && !!props.height)
const sizeStyle = computed(() =>
  sized.value
    ? {
        '--embed-w': String(props.width),
        '--embed-h': String(props.height),
      }
    : undefined,
)

const src = ref(props.src)
const mediaType = ref<string>()
const isPlayable = computed(() => {
  if (!mediaType.value) return false
  return document.createElement('video').canPlayType(mediaType.value) !== ''
})

watchEffect(async () => {
  src.value = props.src
  try {
    mediaType.value = (await fetchMediaInfo(src.value)).mimeType ?? undefined
  } catch {
    // Unreachable or misbehaving resources render as an iframe.
    mediaType.value = undefined
  }
})

// Force reload on resize
const { width } = useWindowSize()
watch(width, () => {
  src.value = ''

  nextTick(() => {
    src.value = props.src
  })
})
</script>

<style scoped>
.embed {
  position: relative;
  touch-action: none;
  overflow: hidden;
  aspect-ratio: 1;
  width: 100cqw;

  &.playable {
    aspect-ratio: auto;
  }

  video {
    display: block;
    width: 100%;
    height: auto;
  }

  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    pointer-events: all;
  }
}

/* Render the iframe at its native pixel dimensions, then scale it to fit inside
   the frame — `object-fit: contain` semantics the iframe element can't express
   itself. `cqw`/`cqh` resolve against .embed (now a size container), so the
   scale tracks the frame responsively with no JS measurement, and the smaller
   axis wins so the document keeps its aspect ratio and stays centered. */
.embed.sized {
  container-type: size;

  iframe {
    inset: auto;
    left: 50%;
    top: 50%;
    width: calc(var(--embed-w) * 1px);
    height: calc(var(--embed-h) * 1px);
    transform: translate(-50%, -50%)
      scale(
        min(
          calc(100cqw / (var(--embed-w) * 1px)),
          calc(100cqh / (var(--embed-h) * 1px))
        )
      );
  }
}
</style>
