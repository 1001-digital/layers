<template>
  <AppShell v-model:sidebar-open="sidebarOpen">
    <template #sidebar>
      <div class="playground-sidebar">
        <header>
          <h1>Base Layer</h1>
          <p>Component Library</p>
        </header>

        <nav>
          <NuxtLink
            to="/"
            @click="closeMobile"
            >Components</NuxtLink
          >
          <NuxtLink
            to="/layout"
            @click="closeMobile"
            >Layout</NuxtLink
          >
          <NuxtLink
            to="/other"
            @click="closeMobile"
            >Other</NuxtLink
          >
        </nav>

        <footer>
          <FormSwitch v-model="isDark"> Dark mode </FormSwitch>
        </footer>
      </div>
    </template>

    <div class="playground-topbar">
      <Button
        class="small tertiary sidebar-toggle"
        @click="sidebarOpen = !sidebarOpen"
      >
        <Icon name="menu" />
      </Button>
    </div>

    <NuxtPage />

    <template #bottom-nav>
      <NuxtLink to="/">
        <Icon name="home" />
      </NuxtLink>
      <NuxtLink to="/layout">
        <Icon name="lucide:layout-dashboard" />
      </NuxtLink>
      <NuxtLink to="/other">
        <Icon name="lucide:file-text" />
      </NuxtLink>
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const sidebarOpen = useState('sidebar-open', () => false)
const colorMode = useCookie<'light' | 'dark'>('playground-color-mode', {
  default: () => 'light',
})
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => {
    colorMode.value = value ? 'dark' : 'light'
  },
})

useHead({
  htmlAttrs: {
    class: colorMode,
  },
})

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const closeMobile = () => {
  if (!isLargeScreen.value) sidebarOpen.value = false
}
</script>

<style>
.playground-sidebar {
  display: flex;
  flex-direction: column;
  block-size: 100%;

  > header {
    padding: var(--spacer-lg);
    border-block-end: var(--border);

    h1 {
      font-size: var(--font-lg);
    }

    p {
      font-size: var(--font-sm);
      color: var(--muted);
    }
  }

  > nav {
    display: flex;
    flex-direction: column;
    padding: var(--spacer);

    a {
      display: flex;
      align-items: center;
      gap: var(--spacer-sm);
      padding: var(--spacer-sm) var(--spacer);
      color: var(--muted);
      border-radius: var(--border-radius);
      transition:
        color var(--speed),
        background var(--speed);

      &:hover {
        color: var(--color);
        background: var(--gray-z-1);
      }

      &.router-link-exact-active {
        color: var(--color);
        background: var(--gray-z-2);
      }
    }
  }

  > footer {
    margin-block-start: auto;
    padding: var(--spacer-lg);
    border-block-start: var(--border);
  }
}

.playground-topbar {
  padding: var(--spacer-sm) var(--spacer);
  border-block-end: var(--border);

  @media (min-width: 1024px) {
    display: none;
  }
}

.sidebar-toggle {
  border: 0 !important;
}
</style>
