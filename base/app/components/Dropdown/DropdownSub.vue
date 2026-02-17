<template>
  <DropdownMenuSub v-model:open="open">
    <DropdownMenuSubTrigger
      class="dropdown-item dropdown-sub-trigger"
      :disabled="disabled"
    >
      <slot name="trigger" />
      <Icon class="dropdown-sub-icon" type="chevron-right" />
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <DropdownMenuSubContent
        class="dropdown"
        :class="props.class"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :avoid-collisions="avoidCollisions"
        :collision-padding="collisionPadding"
        :loop="loop"
      >
        <slot />
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>

<script setup lang="ts">
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from 'reka-ui'

const props = withDefaults(
  defineProps<{
    class?: string | string[] | Record<string, boolean>
    disabled?: boolean
    sideOffset?: number
    alignOffset?: number
    avoidCollisions?: boolean
    collisionPadding?: number
    loop?: boolean
  }>(),
  {
    sideOffset: -4,
    avoidCollisions: true,
    collisionPadding: 8,
    loop: true,
  },
)

const open = defineModel<boolean>('open', { default: false })
</script>
