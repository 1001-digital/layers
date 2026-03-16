<template>
  <IconifyIcon
    v-if="resolvedIcon"
    :icon="resolvedIcon"
    class="icon"
  />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { IconAliasesKey, defaultIconAliases } from '../icons'

const props = defineProps<{ name: string }>()

const aliases = inject(IconAliasesKey, defaultIconAliases)

const resolvedIcon = computed(() => aliases[props.name] || props.name)
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
