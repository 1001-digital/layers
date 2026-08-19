<template>
  <NuxtIcon
    v-if="iconName"
    :name="iconName"
    class="icon"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseIcon' })

const props = defineProps<{ name: string }>()

const iconName = computed(() => props.name)
</script>

<style scoped>
.icon {
  display: inline-flex;
  width: 1em;
  height: 1em;
  align-items: center;
  justify-content: center;
}
</style>
