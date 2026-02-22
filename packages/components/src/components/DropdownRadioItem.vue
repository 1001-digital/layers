<template>
  <DropdownMenuRadioItem
    class="dropdown-item"
    :value="value"
    :disabled="disabled"
    :text-value="textValue"
    @select="(e: Event) => emit('select', e)"
  >
    <DropdownMenuItemIndicator class="dropdown-item-indicator">
      <Icon type="check" />
    </DropdownMenuItemIndicator>
    <slot />
  </DropdownMenuRadioItem>
</template>

<script setup lang="ts">
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
} from 'reka-ui'
import Icon from './Icon.vue'

defineProps<{
  value: string
  disabled?: boolean
  textValue?: string
}>()

const emit = defineEmits<{
  select: [event: Event]
}>()
</script>
