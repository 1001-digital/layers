<template>
  <DatePickerRoot
    v-model="model"
    v-model:open="open"
    v-model:placeholder="placeholderValue"
    :disabled="disabled"
    :readonly="readonly"
    :granularity="granularity"
    :locale="locale"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :number-of-months="numberOfMonths"
    :fixed-weeks="fixedWeeks"
    :week-starts-on="weekStartsOn"
    :hour-cycle="hourCycle"
    :name="name"
    :required="required"
    :close-on-date-select="closeOnSelect"
  >
    <DatePickerAnchor class="form-date-picker-anchor">
      <DatePickerField
        v-slot="{ segments }"
        class="form-date-picker-field"
      >
        <template
          v-for="segment in segments"
          :key="segment.part"
        >
          <DatePickerInput
            v-if="segment.part === 'literal'"
            :part="segment.part"
            class="form-date-picker-literal"
          >
            {{ segment.value }}
          </DatePickerInput>
          <DatePickerInput
            v-else
            :part="segment.part"
            class="form-date-picker-segment"
          >
            {{ segment.value }}
          </DatePickerInput>
        </template>
      </DatePickerField>

      <DatePickerTrigger class="form-date-picker-trigger">
        <Icon name="calendar" />
      </DatePickerTrigger>
    </DatePickerAnchor>

    <DatePickerContent
      class="form-date-picker-content"
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :collision-padding="collisionPadding"
    >
      <DatePickerCalendar
        v-slot="{ grid, weekDays }"
        class="form-date-picker-calendar"
      >
        <DatePickerHeader class="form-date-picker-header">
          <DatePickerPrev class="form-date-picker-nav">
            <Icon name="chevron-left" />
          </DatePickerPrev>
          <DatePickerHeading class="form-date-picker-heading" />
          <DatePickerNext class="form-date-picker-nav">
            <Icon name="chevron-right" />
          </DatePickerNext>
        </DatePickerHeader>

        <div class="form-date-picker-grids">
          <DatePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            :value="month"
            class="form-date-picker-grid"
          >
            <DatePickerGridHead>
              <DatePickerGridRow class="form-date-picker-grid-row">
                <DatePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="form-date-picker-head-cell"
                >
                  {{ day }}
                </DatePickerHeadCell>
              </DatePickerGridRow>
            </DatePickerGridHead>

            <DatePickerGridBody>
              <DatePickerGridRow
                v-for="(row, i) in month.rows"
                :key="i"
                class="form-date-picker-grid-row"
              >
                <DatePickerCell
                  v-for="date in row"
                  :key="date.toString()"
                  :date="date"
                  class="form-date-picker-cell"
                >
                  <DatePickerCellTrigger
                    :day="date"
                    :month="month.value"
                    class="form-date-picker-cell-trigger"
                  />
                </DatePickerCell>
              </DatePickerGridRow>
            </DatePickerGridBody>
          </DatePickerGrid>
        </div>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import {
  DatePickerAnchor,
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
} from 'reka-ui'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    readonly?: boolean
    granularity?: 'day' | 'hour' | 'minute' | 'second'
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    isDateDisabled?: (date: DateValue) => boolean
    isDateUnavailable?: (date: DateValue) => boolean
    numberOfMonths?: number
    fixedWeeks?: boolean
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    hourCycle?: 12 | 24
    name?: string
    required?: boolean
    placeholder?: DateValue
    closeOnSelect?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alignOffset?: number
    avoidCollisions?: boolean
    collisionPadding?: number
  }>(),
  {
    locale: 'en',
    granularity: 'day',
    numberOfMonths: 1,
    closeOnSelect: true,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    avoidCollisions: true,
    collisionPadding: 8,
  },
)

const model = defineModel<DateValue | undefined>()
const open = defineModel<boolean>('open')
const placeholderValue = ref(props.placeholder) as ReturnType<typeof ref<DateValue | undefined>>
</script>

<style scoped>
@layer components {
  .form-date-picker-anchor {
    display: inline-flex;
    align-items: center;
    background: var(--date-field-background);
    block-size: var(--form-item-height);
    box-shadow: var(--border-shadow);
    border-radius: var(--border-radius);

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .form-date-picker-field {
    display: inline-flex;
    align-items: center;
    padding-inline-start: var(--ui-padding-inline);
    font-size: var(--font-sm);
  }

  .form-date-picker-literal {
    color: var(--muted);
    padding: 0 1px;
  }

  .form-date-picker-segment {
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

  .form-date-picker-trigger {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--ui-padding-inline);
    block-size: 100%;
    cursor: pointer;
    color: var(--date-picker-trigger-icon-color);

    &:hover {
      color: var(--color);
    }
  }

  .form-date-picker-content {
    background: var(--date-picker-content-background);
    border: var(--date-picker-content-border);
    border-radius: var(--date-picker-content-border-radius);
    padding: var(--spacer);
    z-index: var(--z-index-ui);
    transform-origin: var(--reka-popper-transform-origin);

    opacity: 1;
    scale: 1;
    transition:
      opacity var(--speed) ease,
      scale var(--speed) ease;

    @starting-style {
      opacity: 0;
      scale: 0.95;
    }

    &[data-state='closed'] {
      opacity: 0;
      scale: 0.95;
    }
  }

  .form-date-picker-calendar {
    display: grid;
    gap: var(--spacer-sm);
  }

  .form-date-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacer-sm);
  }

  .form-date-picker-heading {
    font-family: var(--font-family);
    font-size: var(--ui-font-size);
    text-transform: var(--ui-text-transform);
    font-weight: 500;
  }

  .form-date-picker-nav {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    block-size: var(--calendar-nav-size);
    inline-size: var(--calendar-nav-size);
    border-radius: var(--calendar-cell-border-radius);

    &:hover {
      background: var(--calendar-hover-background);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .form-date-picker-grids {
    display: flex;
    gap: var(--spacer);
  }

  .form-date-picker-grid {
    border-collapse: collapse;
  }

  .form-date-picker-grid-row {
    display: flex;
  }

  .form-date-picker-head-cell {
    font-family: var(--font-family);
    font-size: var(--font-xs);
    text-transform: var(--ui-text-transform);
    color: var(--muted);
    inline-size: var(--calendar-cell-size);
    block-size: var(--calendar-cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-date-picker-cell {
    padding: 1px;
  }

  .form-date-picker-cell-trigger {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--calendar-cell-size);
    block-size: var(--calendar-cell-size);
    border-radius: var(--calendar-cell-border-radius);
    font-size: var(--font-sm);
    cursor: pointer;

    &:hover {
      background: var(--calendar-hover-background);
    }

    &[data-selected] {
      background: var(--calendar-selected-background);
      color: var(--calendar-selected-color);
    }

    &[data-today]:not([data-selected]) {
      border: var(--calendar-today-border);
    }

    &[data-outside-month] {
      opacity: 0.3;
    }

    &[data-unavailable] {
      opacity: 0.3;
      text-decoration: line-through;
      cursor: not-allowed;
    }

    &[data-disabled] {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>
