<template>
  <div class="tags">
    <slot />
  </div>
</template>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
}
</style>
