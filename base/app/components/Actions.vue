<template>
  <menu class="actions">
    <slot />
  </menu>
</template>

<style scoped>
.actions {
  margin: 0;
  padding: 0;
  border: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacer-sm);

  &:not(.left) {
    justify-content: flex-end;
  }

  &:empty {
    display: none !important;
  }

  :deep(> a),
  :deep(> button),
  :deep(> .input-group),
  :deep(> .input-group > *) {
    block-size: var(--form-item-height);

    &.small {
      block-size: var(--form-item-height-sm);
    }
  }

  :deep(> label) {
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    font-weight: var(--ui-font-weight);
    text-transform: var(--ui-text-transform);
    letter-spacing: var(--ui-letter-spacing);
    line-height: var(--ui-line-height);
    display: flex;
    align-items: center;
    gap: var(--spacer-sm);
    white-space: nowrap;
  }

  :deep(.button) {
    inline-size: auto;
  }

  :deep(select) {
    inline-size: auto;
  }
}
</style>
