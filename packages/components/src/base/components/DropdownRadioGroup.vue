<template>
  <DropdownMenuRadioGroup :model-value="model" @update:model-value="(v) => (model = v)">
    <slot />
  </DropdownMenuRadioGroup>
</template>

<script setup lang="ts">
import { DropdownMenuRadioGroup } from 'reka-ui'
import type { AcceptableValue } from 'reka-ui'

const model = defineModel<AcceptableValue>()
</script>
