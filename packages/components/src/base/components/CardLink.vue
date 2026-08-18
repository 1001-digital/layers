<template>
  <component
    :is="linkComponent"
    v-bind="linkProps"
    class="card-link"
  >
    <span>{{ title }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { LinkComponentKey } from '../link'

const props = withDefaults(
  defineProps<{
    to: string | Record<string, unknown>
    title?: string
  }>(),
  {
    title: 'View',
  },
)

const linkComponent = inject(LinkComponentKey, 'a')

const linkProps = computed(() => {
  if (typeof linkComponent === 'string') {
    return { href: props.to }
  }
  return { to: props.to }
})
</script>

<style scoped>
a {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  border: 0;

  span {
    opacity: 0;
    pointer-events: none;
  }
}
</style>

<style>
*:has(> .card-link) {
  position: relative;
}
</style>
