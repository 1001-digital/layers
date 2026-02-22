<template>
  <DropdownMenuCheckboxItem
    class="dropdown-item"
    v-model="model"
    :disabled="disabled"
    :text-value="textValue"
    @select="(e: Event) => emit('select', e)"
  >
    <DropdownMenuItemIndicator class="dropdown-item-indicator">
      <Icon type="check" />
    </DropdownMenuItemIndicator>
    <slot />
  </DropdownMenuCheckboxItem>
</template>

<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from 'reka-ui'
import Icon from './Icon.vue'

defineProps<{
  disabled?: boolean
  textValue?: string
}>()

const model = defineModel<boolean | 'indeterminate'>({ default: false })

const emit = defineEmits<{
  select: [event: Event]
}>()
</script>
