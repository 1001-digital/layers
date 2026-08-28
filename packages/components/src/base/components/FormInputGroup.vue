<template>
  <div class="input-group">
    <slot />
  </div>
</template>

<style scoped>
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;

  & :deep(input + .icon) {
    position: absolute;
    inset-inline-end: var(--ui-padding-inline);
    inline-size: var(--size-4);
    color: var(--muted);
    z-index: 2;
  }

  & :deep(input:has(+ .icon)) {
    padding-inline-end: calc(var(--ui-padding-inline) + var(--spacer-sm));

    &:is(:hover, :active, :focus, .active) + .icon {
      color: var(--gray-z-6);
    }
  }

  & :deep(input),
  & :deep(button),
  & :deep(.button),
  & :deep(a) {
    z-index: 1;

    &:has(+ input),
    &:has(+ button),
    &:has(+ a) {
      border-start-end-radius: 0 !important;
      border-end-end-radius: 0 !important;
      border-inline-end-width: 0;
    }

    + input,
    + button,
    + a {
      border-start-start-radius: 0 !important;
      border-end-start-radius: 0 !important;
    }

    &:is(:hover, :active, :focus, .active) {
      z-index: 2;
    }
  }
}
</style>
