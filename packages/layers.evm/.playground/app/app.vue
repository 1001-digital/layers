<template>
  <AppShell>
    <template #sidebar>
      <nav class="sidebar-nav">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/connect">Connect</NuxtLink>
        <NuxtLink to="/transaction-flow">Transactions</NuxtLink>
        <NuxtLink to="/siwe">SIWE</NuxtLink>
      </nav>
      <EvmSidebarProfile @disconnected="navigateTo('/')" />
    </template>
    <NuxtPage />
  </AppShell>
</template>

<style scoped>
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
  padding: var(--spacer-sm);
}
</style>
