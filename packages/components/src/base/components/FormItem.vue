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
        box-shadow: var(--border-shadow-highlight);
      }
    }

    .prefix,
    .suffix {
      padding: 0 var(--ui-padding-inline);
      color: var(--muted);
      background: var(--button-background);
      transition: all var(--speed);
      block-size: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--border-shadow);
      width: min-content;
    }

    .prefix {
      border-start-start-radius: var(--border-radius);
      border-end-start-radius: var(--border-radius);
    }

    .suffix {
      border-start-end-radius: var(--border-radius);
      border-end-end-radius: var(--border-radius);
    }
  }
}
</style>
