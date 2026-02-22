<template>
  <main class="page">
    <h1>Other Page</h1>
    <p>Navigate here after triggering a toast to verify it stays visible.</p>
    <NuxtLink to="/#toasts">
      Back to components
    </NuxtLink>
  </main>
</template>

<style scoped>
.page {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--spacer-lg);
  display: grid;
  gap: var(--spacer);
}
</style>
