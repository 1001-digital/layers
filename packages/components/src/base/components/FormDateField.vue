<template>
  <DateFieldRoot
    v-model="model"
    v-model:placeholder="placeholderValue"
    v-slot="{ segments }"
    :disabled="disabled"
    :readonly="readonly"
    :granularity="granularity"
    :locale="locale"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :hour-cycle="hourCycle"
    :name="name"
    :required="required"
    class="form-date-field"
  >
    <template
      v-for="segment in segments"
      :key="segment.part"
    >
      <DateFieldInput
        v-if="segment.part === 'literal'"
        :part="segment.part"
        class="form-date-field-literal"
      >
        {{ segment.value }}
      </DateFieldInput>
      <DateFieldInput
        v-else
        :part="segment.part"
        class="form-date-field-segment"
      >
        {{ segment.value }}
      </DateFieldInput>
    </template>
  </DateFieldRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    readonly?: boolean
    granularity?: 'day' | 'hour' | 'minute' | 'second'
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    isDateUnavailable?: (date: DateValue) => boolean
    hourCycle?: 12 | 24
    name?: string
    required?: boolean
    placeholder?: DateValue
  }>(),
  {
    locale: 'en',
    granularity: 'day',
  },
)

const model = defineModel<DateValue | undefined>()
const placeholderValue = ref(props.placeholder) as ReturnType<
  typeof ref<DateValue | undefined>
>
</script>

<style scoped>
@layer components {
  .form-date-field {
    display: inline-flex;
    align-items: center;
    background: var(--date-field-background);
    block-size: var(--form-item-height);
    padding-inline: var(--ui-padding-inline);
    border: var(--border);
    border-radius: var(--border-radius);
    font-size: var(--font-sm);

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .form-date-field-literal {
    color: var(--muted);
    padding: 0 1px;
  }

  .form-date-field-segment {
    padding: var(--date-field-segment-padding);
    border-radius: var(--date-field-segment-border-radius);
    outline: none;
    color: var(--color);

    &[data-placeholder] {
      color: var(--muted);
    }

    &:focus {
      background: var(--date-field-segment-focus-background);
      color: var(--date-field-segment-focus-color);
    }
  }
}
</style>
