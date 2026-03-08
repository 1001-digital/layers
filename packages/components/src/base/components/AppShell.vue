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
    block-size: var(--100vh);
    overflow: hidden;
  }

  .app-shell-main {
    flex: 1;
    min-inline-size: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding-block-start: env(safe-area-inset-top);
  }

  .app-shell:has(.bottom-nav) .app-shell-main {
    padding-block-end: var(--bottom-nav-height);

    @media (min-width: 1024px) {
      padding-block-end: 0;
    }
  }
}
</style>
