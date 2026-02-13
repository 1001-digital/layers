<template>
  <textarea
    ref="textarea"
    v-model="model"
    :rows="rows"
    v-bind="$attrs"
    @input="resize"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>()

const { rows = 4 } = defineProps<{
  rows?: number
}>()

const textarea = useTemplateRef('textarea')

function resize() {
  const el = textarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

onMounted(resize)
</script>

<style scoped>
textarea {
  resize: none;
  block-size: auto;
  overflow: hidden;
}
</style>
