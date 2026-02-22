<template>
  <form class="form">
    <slot />
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--spacer);

  & :deep(> header),
  & :deep(> footer) {
    display: grid;
    gap: var(--spacer-sm);

    h1,
    p {
      text-align: start;
    }

    h1 {
      font-size: var(--font-xl);
    }
  }
}
</style>
