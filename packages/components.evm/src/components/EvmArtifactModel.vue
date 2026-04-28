<template>
  <component
    v-if="comp"
    :is="comp"
    :src="src"
    :alt="alt"
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

defineProps<{ src: string; alt?: string }>()
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
      props: { src: String, alt: String },
      emits: ['error'],
      setup(p, { emit: emitInner }) {
        return () =>
          h('model-viewer', {
            src: p.src,
            alt: p.alt,
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
