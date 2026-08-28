<template>
  <div class="form-item">
    <span
      v-if="$slots.prefix"
      class="prefix"
    >
      <slot name="prefix" />
    </span>
    <slot />
    <span
      v-if="$slots.suffix"
      class="suffix"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped>
@layer components {
  .form-item {
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    background: var(--background);
    transition:
      background-color var(--speed),
      border-color var(--speed);
    inline-size: 100%;
    max-inline-size: -webkit-fill-available;

    &:has(input:hover),
    &:has(input:focus) {
      background: var(--button-background-highlight);
      border-color: var(--button-border-color-highlight);

      .prefix,
      .suffix {
        background: var(--button-background-highlight);
        border-color: var(--border-color-highlight);
      }
    }

    .prefix,
    .suffix {
      padding: 0 var(--ui-padding-inline);
      color: var(--muted);
      background: var(--button-background);
      transition: all var(--speed);
      block-size: var(--form-item-height);
      display: flex;
      align-items: center;
      justify-content: center;
      border: var(--border);
      width: min-content;
    }

    .prefix {
      border-start-start-radius: var(--border-radius);
      border-end-start-radius: var(--border-radius);
      border-inline-end-width: 0;
    }

    .suffix {
      border-start-end-radius: var(--border-radius);
      border-end-end-radius: var(--border-radius);
      border-inline-start-width: 0;
    }

    &:has(> .prefix) :deep(> :last-child) {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }

    &:has(> .suffix) :deep(> :first-child) {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }
  }
}
</style>
