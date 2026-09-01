<template>
  <SliderRoot
    v-model="model"
    class="form-slider"
    :disabled="disabled"
    :min="min"
    :max="max"
    :step="step"
    :orientation="orientation"
    :inverted="inverted"
    :min-steps-between-thumbs="minStepsBetweenThumbs"
    :name="name"
    :required="required"
    :dir="dir"
    @value-commit="$emit('valueCommit', $event)"
  >
    <SliderTrack class="form-slider-track">
      <SliderRange class="form-slider-range" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in thumbCount"
      :key="i"
      class="form-slider-thumb"
    />
  </SliderRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

const model = defineModel<number[]>()

withDefaults(
  defineProps<{
    disabled?: boolean
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    inverted?: boolean
    minStepsBetweenThumbs?: number
    name?: string
    required?: boolean
    dir?: 'ltr' | 'rtl'
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    minStepsBetweenThumbs: 0,
  },
)

defineEmits<{
  valueCommit: [value: number[]]
}>()

const thumbCount = computed(() => model.value?.length || 1)
</script>

<style scoped>
@layer components {
  .form-slider {
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;

    &[data-orientation='horizontal'] {
      inline-size: 100%;
      block-size: var(--slider-thumb-size);
    }

    &[data-orientation='vertical'] {
      flex-direction: column;
      inline-size: var(--slider-thumb-size);
      block-size: 100%;
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .form-slider-track {
    position: relative;
    flex-grow: 1;
    background: var(--slider-track-background);
    border-radius: var(--slider-track-radius);

    &[data-orientation='horizontal'] {
      block-size: var(--slider-track-size);
      inline-size: 100%;
    }

    &[data-orientation='vertical'] {
      inline-size: var(--slider-track-size);
      block-size: 100%;
    }
  }

  .form-slider-range {
    position: absolute;
    background: var(--slider-range-background);
    border-radius: var(--slider-track-radius);

    &[data-orientation='horizontal'] {
      block-size: 100%;
    }

    &[data-orientation='vertical'] {
      inline-size: 100%;
    }
  }

  .form-slider-thumb {
    all: unset;
    display: block;
    inline-size: var(--slider-thumb-size);
    block-size: var(--slider-thumb-size);
    border-radius: var(--slider-thumb-radius);
    background: var(--slider-thumb-background);
    box-shadow: var(--border-shadow);
    transition:
      box-shadow var(--speed),
      background var(--speed);

    &:is(:hover, :focus) {
      box-shadow: var(--border-shadow-highlight);
    }

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }
}
</style>
