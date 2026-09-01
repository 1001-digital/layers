<template>
  <TagsInputRoot
    v-model="model"
    :disabled="disabled"
    :name="name"
    :required="required"
    :delimiter="delimiter"
    :duplicate="duplicate"
    :max="max"
    :add-on-blur="addOnBlur"
    :add-on-paste="addOnPaste"
    :add-on-tab="addOnTab"
    :class="['tags-input', { small }]"
  >
    <TagsInputItem
      v-for="item in model"
      :key="item"
      :value="item"
      as-child
    >
      <Tag
        dismissable
        :small="small"
      >
        <TagsInputItemText />
        <template #dismiss>
          <TagsInputItemDelete as-child>
            <Button :class="{ small }">
              <Icon name="close" />
            </Button>
          </TagsInputItemDelete>
        </template>
      </Tag>
    </TagsInputItem>
    <TagsInputInput :placeholder="placeholder" />
  </TagsInputRoot>
</template>

<script setup lang="ts">
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import Button from './Button.vue'
import Icon from './Icon.vue'
import Tag from './Tag.vue'

const model = defineModel<string[]>({ default: () => [] })

withDefaults(
  defineProps<{
    disabled?: boolean
    name?: string
    required?: boolean
    placeholder?: string
    delimiter?: string
    duplicate?: boolean
    max?: number
    addOnBlur?: boolean
    addOnPaste?: boolean
    addOnTab?: boolean
    small?: boolean
  }>(),
  {
    delimiter: ',',
    max: 0,
    addOnBlur: true,
    duplicate: true,
  },
)
</script>

<style scoped>
@layer components {
  .tags-input {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--tags-input-gap);
    padding: var(--ui-padding-block);
    min-height: calc(var(--form-item-height) + 2 * var(--ui-padding-block));
    border-radius: var(--border-radius);
    background: var(--input-background);
    box-shadow: var(--border-shadow);
    transition: box-shadow var(--speed);

    &:focus-within {
      box-shadow: var(--border-shadow-highlight);
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    > span {
      min-width: 0;
      max-width: 100%;
    }

    > input {
      all: unset;
      flex: 1;
      height: var(--form-item-height);
      min-inline-size: 5rem;
      padding: 0 var(--ui-padding-inline);
      font-family: var(--ui-font-family);
      font-size: var(--ui-font-size);
      color: var(--color);

      &::placeholder {
        color: var(--muted);
      }
    }

    &.small {
      gap: calc(var(--tags-input-gap) / 2);
      padding: calc(var(--ui-padding-block) / 2);
      min-height: calc(var(--form-item-height-sm) + var(--ui-padding-block));

      > input {
        height: var(--form-item-height-sm);
        font-size: var(--font-xs);
      }
    }
  }
}
</style>
