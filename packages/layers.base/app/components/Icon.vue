<template>
  <NuxtIcon v-if="iconName" :name="iconName" class="icon" />
</template>

<script setup lang="ts">
const props = defineProps<{ type: string }>()

const iconName = computed(() => props.type)
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
