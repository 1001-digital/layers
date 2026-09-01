<template>
  <div class="app-shell">
    <Sidebar
      v-if="$slots.sidebar"
      v-model:open="sidebarOpen"
      :side="sidebarSide"
      :swipeable="sidebarSwipeable"
    >
      <slot name="sidebar" />
    </Sidebar>

    <main class="app-shell-main">
      <slot />
    </main>

    <BottomNav v-if="$slots['bottom-nav']">
      <slot name="bottom-nav" />
    </BottomNav>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'

withDefaults(
  defineProps<{
    sidebarSide?: 'left' | 'right'
    sidebarSwipeable?: boolean
  }>(),
  {
    sidebarSide: 'left',
    sidebarSwipeable: true,
  },
)

const sidebarOpen = defineModel<boolean>('sidebarOpen', { default: false })
</script>

<style>
@layer components {
  .app-shell {
    display: flex;
    min-block-size: 100dvh;

    &:has(> nav.bottom-nav) > .sidebar {
      padding-block-end: var(--bottom-nav-height);
    }
  }

  html:has(.app-shell nav.bottom-nav) > body {
    border-inline-end: var(--border);

    .app-shell nav.bottom-nav {
      border-inline-end: var(--border);
    }
  }

  .app-shell-main {
    flex: 1;
    min-inline-size: 0;
    padding-block-start: env(safe-area-inset-top);

    &:has(+ nav.bottom-nav) {
      padding-block-end: var(--bottom-nav-height);
    }
  }
}
</style>
