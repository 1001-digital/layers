<template>
  <DropdownMenuItem
    class="dropdown-item"
    :disabled="disabled"
    :text-value="textValue"
    @select="(e: Event) => emit('select', e)"
  >
    <slot />
  </DropdownMenuItem>
</template>

<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'

defineProps<{
  disabled?: boolean
  textValue?: string
}>()

const emit = defineEmits<{
  select: [event: Event]
}>()
</script>
