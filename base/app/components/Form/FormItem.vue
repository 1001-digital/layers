<template>
  <div class="form-item">
    <span v-if="$slots.prefix" class="prefix">
      <slot name="prefix" />
    </span>
    <slot />
    <span v-if="$slots.suffix" class="suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped>
.form-item {
  border: var(--border);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  background: var(--background);
  inline-size: 100%;
  max-inline-size: -webkit-fill-available;

  :deep(input),
  :deep(textarea),
  :deep(select) {
    border: none;
  }

  &:has(input:hover),
  &:has(input:focus) {
    background: var(--button-background-highlight);
    border-color: var(--button-border-color-highlight);
  }

  .prefix,
  .suffix {
    padding: 0 var(--ui-padding-inline);
    color: var(--muted);
    block-size: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .prefix {
    border-inline-end: var(--button-border);
  }

  .suffix {
    border-inline-start: var(--button-border);
  }
}
</style>
