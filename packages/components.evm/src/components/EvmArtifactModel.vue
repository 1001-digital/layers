<template>
  <component
    v-if="comp"
    :is="comp"
    :src="src"
    :alt="alt"
    :poster="poster"
    @error="onRuntimeError"
  />
</template>

<script setup lang="ts">
import {
  defineComponent,
  h,
  onMounted,
  ref,
  shallowRef,
  type Component,
  type ShallowRef,
} from 'vue'

defineProps<{ src: string; alt?: string; poster?: string }>()
const emit = defineEmits<{
  error: [Event]
  'import-error': [unknown]
}>()

const comp: ShallowRef<Component | null> = shallowRef(null)
const importFailed = ref(false)

onMounted(async () => {
  if (comp.value || importFailed.value) return
  try {
    await import('@google/model-viewer')
    comp.value = defineComponent({
      name: 'ModelViewer',
      props: { src: String, alt: String, poster: String },
      emits: ['error'],
      setup(p, { emit: emitInner }) {
        return () =>
          h('model-viewer', {
            src: p.src,
            alt: p.alt,
            poster: p.poster,
            reveal: p.poster ? 'auto' : undefined,
            'auto-rotate': '',
            'camera-controls': '',
            onerror: (e: Event) => emitInner('error', e),
          })
      },
    })
  } catch (err) {
    importFailed.value = true
    emit('import-error', err)
  }
})

function onRuntimeError(e: Event) {
  emit('error', e)
}
</script>
