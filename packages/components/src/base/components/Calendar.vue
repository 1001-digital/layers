<template>
  <CalendarRoot
    v-model="model"
    v-model:placeholder="placeholderValue"
    v-slot="{ grid, weekDays }"
    :disabled="disabled"
    :readonly="readonly"
    :multiple="multiple"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :number-of-months="numberOfMonths"
    :fixed-weeks="fixedWeeks"
    class="calendar"
  >
    <CalendarHeader class="calendar-header">
      <CalendarPrev class="calendar-nav">
        <Icon name="chevron-left" />
      </CalendarPrev>
      <CalendarHeading class="calendar-heading" />
      <CalendarNext class="calendar-nav">
        <Icon name="chevron-right" />
      </CalendarNext>
    </CalendarHeader>

    <div class="calendar-grids">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :value="month"
        class="calendar-grid"
      >
        <CalendarGridHead>
          <CalendarGridRow class="calendar-grid-row">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="calendar-head-cell"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>

        <CalendarGridBody>
          <CalendarGridRow
            v-for="(row, i) in month.rows"
            :key="i"
            class="calendar-grid-row"
          >
            <CalendarCell
              v-for="date in row"
              :key="date.toString()"
              :date="date"
              class="calendar-cell"
            >
              <CalendarCellTrigger
                :day="date"
                :month="month.value"
                class="calendar-cell-trigger"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    readonly?: boolean
    multiple?: boolean
    locale?: string
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    minValue?: DateValue
    maxValue?: DateValue
    isDateDisabled?: (date: DateValue) => boolean
    isDateUnavailable?: (date: DateValue) => boolean
    numberOfMonths?: number
    fixedWeeks?: boolean
    placeholder?: DateValue
  }>(),
  {
    locale: 'en',
    numberOfMonths: 1,
  },
)

const model = defineModel<DateValue | DateValue[] | undefined>()
const placeholderValue = ref(props.placeholder) as ReturnType<
  typeof ref<DateValue | undefined>
>
</script>

<style scoped>
@layer components {
  .calendar {
    display: grid;
    gap: var(--spacer-sm);
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacer-sm);
  }

  .calendar-heading {
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    text-transform: var(--ui-text-transform);
    font-weight: 500;
  }

  .calendar-nav {
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

  .calendar-grids {
    display: flex;
    gap: var(--spacer);
  }

  .calendar-grid {
    border-collapse: collapse;
  }

  .calendar-grid-row {
    display: flex;
  }

  .calendar-head-cell {
    font-family: var(--ui-font-family);
    font-size: var(--font-xs);
    text-transform: var(--ui-text-transform);
    color: var(--muted);
    inline-size: var(--calendar-cell-size);
    block-size: var(--calendar-cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calendar-cell {
    padding: 1px;
  }

  .calendar-cell-trigger {
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
