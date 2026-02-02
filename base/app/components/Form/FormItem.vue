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

<style>
@layer variables {
  :root {
    --form-item-height: calc(var(--size-4) + var(--ui-padding-block) * 2);
    --form-item-height-sm: calc(var(--size-4) + var(--ui-padding-block));
  }
}
</style>

<style scoped>
@layer components {
  .form-item {
    border: var(--border);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    background: var(--background);
    transition: background-color var(--speed), border-color var(--speed);
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

      .prefix,
      .suffix {
        background: var(--button-background-highlight);
        border-color: var(--button-border-color-highlight);
      }
    }

    .prefix,
    .suffix {
      padding: 0 var(--ui-padding-inline);
      color: var(--muted);
      background: var(--button-background);
      transition: background-color var(--speed), border-color var(--speed), color var(--speed);
      block-size: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .prefix {
      border-inline-end: var(--border);
    }

    .suffix {
      border-inline-start: var(--border);
    }
  }
}
</style>
