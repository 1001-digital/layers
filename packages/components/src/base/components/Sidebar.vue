<template>
  <aside
    ref="el"
    class="sidebar"
    :class="[
      `sidebar-${side}`,
      {
        'is-open': open,
        'is-swiping': swiping.active,
      },
    ]"
    :style="sidebarStyle"
  >
    <slot />
  </aside>
  <div
    class="sidebar-overlay"
    :class="{
      'is-visible': open && !isLargeScreen,
      'is-swiping': swiping.active,
    }"
    :style="overlayStyle"
    @click="open = false"
  />
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { useMediaQuery, useScrollLock, useElementSize } from '@vueuse/core'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    side?: 'left' | 'right'
    swipeable?: boolean
  }>(),
  {
    side: 'left',
    swipeable: true,
  },
)

const el = ref<HTMLElement>()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const { width: sidebarWidth } = useElementSize(el)

const swiping = reactive({
  active: false,
  translateX: 0,
})

// Scroll lock on mobile when open
if (typeof document !== 'undefined') {
  const scrollLocked = useScrollLock(document.body)
  watchEffect(() => {
    scrollLocked.value = (open.value || swiping.active) && !isLargeScreen.value
  })
}

// Auto open/close on breakpoint change
watch(isLargeScreen, (lg) => {
  open.value = lg
})

// Swipe gesture handling
const EDGE_WIDTH = 30
const SNAP_THRESHOLD = 0.3

let cleanupSwipe: (() => void) | undefined

onMounted(() => {
  if (!props.swipeable) return

  let startX = 0
  let startY = 0
  let tracking = false
  let directionLocked = false
  let isHorizontal = false

  const onTouchStart = (e: TouchEvent) => {
    if (isLargeScreen.value) return

    const touch = e.touches[0]
    if (!touch) return
    startX = touch.clientX
    startY = touch.clientY
    tracking = false
    directionLocked = false
    isHorizontal = false

    if (props.side === 'left') {
      if (!open.value && startX > EDGE_WIDTH) return
      if (open.value && startX > sidebarWidth.value) return
    } else {
      if (!open.value && startX < window.innerWidth - EDGE_WIDTH) return
      if (open.value && startX < window.innerWidth - sidebarWidth.value) return
    }

    tracking = true
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!tracking || isLargeScreen.value) return

    const touch = e.touches[0]
    if (!touch) return
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY

    if (!directionLocked) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      directionLocked = true
      isHorizontal = Math.abs(dx) > Math.abs(dy)

      if (!isHorizontal) {
        tracking = false
        return
      }
    }

    const w = sidebarWidth.value
    if (!w) return

    swiping.active = true

    if (props.side === 'left') {
      if (open.value) {
        swiping.translateX = Math.max(-w, Math.min(0, dx))
      } else {
        swiping.translateX = Math.max(-w, Math.min(0, -w + dx))
      }
    } else {
      if (open.value) {
        swiping.translateX = Math.min(w, Math.max(0, dx))
      } else {
        swiping.translateX = Math.min(w, Math.max(0, w + dx))
      }
    }
  }

  const onTouchEnd = () => {
    if (!swiping.active) {
      tracking = false
      return
    }

    const w = sidebarWidth.value
    const threshold = w * SNAP_THRESHOLD

    if (props.side === 'left') {
      open.value = swiping.translateX > -w + threshold
    } else {
      open.value = swiping.translateX < threshold
    }

    swiping.active = false
    swiping.translateX = 0
    tracking = false
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchmove', onTouchMove, { passive: true })
  document.addEventListener('touchend', onTouchEnd)

  cleanupSwipe = () => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
  }
})

onBeforeUnmount(() => {
  cleanupSwipe?.()
})

const sidebarStyle = computed(() => {
  if (isLargeScreen.value || !swiping.active) return {}

  return {
    transform: `translateX(${swiping.translateX}px)`,
  }
})

const overlayStyle = computed(() => {
  if (isLargeScreen.value || !swiping.active || !sidebarWidth.value) return {}

  const progress = 1 - Math.abs(swiping.translateX) / sidebarWidth.value

  return {
    opacity: String(progress * 0.6),
    pointerEvents: progress > 0 ? ('all' as const) : ('none' as const),
  }
})

defineExpose({
  open: () => {
    open.value = true
  },
  close: () => {
    open.value = false
  },
  toggle: () => {
    open.value = !open.value
  },
})
</script>

<style scoped>
@layer components {
  .sidebar {
    position: fixed;
    inset-block: 0;
    z-index: var(--sidebar-z-index);
    inline-size: var(--sidebar-width);
    background-color: var(--sidebar-background);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overscroll-behavior: contain;
    transition: transform var(--speed);

    &.sidebar-left {
      inset-inline-start: 0;
      border-inline-end: var(--sidebar-border);
      transform: translateX(-100%);

      &.is-open {
        transform: translateX(0);
      }
    }

    &.sidebar-right {
      inset-inline-end: 0;
      border-inline-start: var(--sidebar-border);
      transform: translateX(100%);

      &.is-open {
        transform: translateX(0);
      }
    }

    &.is-swiping {
      transition: none;
    }

    @media (min-width: 1024px) {
      position: sticky;
      inset-block-start: 0;
      block-size: var(--100vh);
      z-index: auto;
      flex-shrink: 0;

      &.sidebar-left,
      &.sidebar-right {
        transform: none;
      }
    }
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: calc(var(--sidebar-z-index) - 1);
    background-color: var(--sidebar-overlay-background);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--speed);

    &.is-visible {
      opacity: 0.6;
      pointer-events: all;
    }

    &.is-swiping {
      transition: none;
    }

    @media (min-width: 1024px) {
      display: none;
    }
  }
}
</style>
