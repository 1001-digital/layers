<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-items">
      <slot />
    </div>
  </nav>
</template>

<style scoped>
@layer components {
  .bottom-nav {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: var(--bottom-nav-z-index);
    block-size: var(--bottom-nav-height);
    background: var(--bottom-nav-background);
    backdrop-filter: var(--blur);
    border-block-start: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block-end: env(safe-area-inset-bottom);
  }

  .bottom-nav-items {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    inline-size: 100%;
    max-inline-size: var(--bottom-nav-max-inline-size);

    > a,
    > button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--size-1);
      color: var(--muted);
      transition: color var(--speed);
      padding: var(--spacer-sm);

      &:is(:hover, :focus-visible, .router-link-active) {
        color: var(--color);
      }
    }
  }
}
</style>
