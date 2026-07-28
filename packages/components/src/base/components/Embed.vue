<template>
  <div
    class="embed"
    :class="{ playable: isPlayable }"
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
  }>(),
  {
    scroll: true,
  },
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
</style>
