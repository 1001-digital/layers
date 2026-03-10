<template>
  <Popover
    v-model:open="open"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    class="color-picker-popover"
  >
    <template #trigger>
      <button
        class="color-picker-trigger"
        type="button"
      >
        <ColorSwatch
          :color="hexColor"
          class="color-picker-swatch"
        />
        <span class="color-picker-value">{{ hexColor }}</span>
      </button>
    </template>

    <div class="color-picker">
      <!-- 2D Color Area (Saturation/Lightness) -->
      <ColorAreaRoot
        v-slot="{ style }"
        :model-value="colorObj"
        color-space="hsl"
        x-channel="saturation"
        y-channel="lightness"
        class="color-picker-area"
        @update:color="handleColorUpdate"
      >
        <ColorAreaArea
          class="color-picker-area-surface"
          :style="style"
        >
          <ColorAreaThumb class="color-picker-thumb" />
        </ColorAreaArea>
      </ColorAreaRoot>

      <!-- Hue Slider -->
      <ColorSliderRoot
        :model-value="colorObj"
        channel="hue"
        color-space="hsl"
        class="color-picker-slider"
        @update:color="handleColorUpdate"
      >
        <ColorSliderTrack class="color-picker-slider-track">
          <div class="color-picker-slider-track-fill" />
        </ColorSliderTrack>
        <ColorSliderThumb class="color-picker-thumb" />
      </ColorSliderRoot>

      <!-- Alpha Slider -->
      <ColorSliderRoot
        v-if="alpha"
        :model-value="colorObj"
        channel="alpha"
        color-space="hsl"
        class="color-picker-slider"
        @update:color="handleColorUpdate"
      >
        <ColorSliderTrack
          class="color-picker-slider-track color-picker-alpha-track"
        >
          <div class="color-picker-slider-track-fill" />
        </ColorSliderTrack>
        <ColorSliderThumb class="color-picker-thumb" />
      </ColorSliderRoot>

      <!-- Color Fields -->
      <FormInputGroup>
        <ColorFieldRoot
          :model-value="hexColor"
          as-child
          @update:model-value="handleHexUpdate"
        >
          <ColorFieldInput
            class="color-picker-input-hex"
            placeholder="#000000"
          />
        </ColorFieldRoot>
        <ColorFieldRoot
          :model-value="colorObj"
          channel="hue"
          color-space="hsl"
          as-child
          @update:color="handleColorUpdate"
        >
          <ColorFieldInput placeholder="H" />
        </ColorFieldRoot>
        <ColorFieldRoot
          :model-value="colorObj"
          channel="saturation"
          color-space="hsl"
          as-child
          @update:color="handleColorUpdate"
        >
          <ColorFieldInput placeholder="S" />
        </ColorFieldRoot>
        <ColorFieldRoot
          :model-value="colorObj"
          channel="lightness"
          color-space="hsl"
          as-child
          @update:color="handleColorUpdate"
        >
          <ColorFieldInput placeholder="L" />
        </ColorFieldRoot>
      </FormInputGroup>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Color } from 'reka-ui'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldInput,
  ColorFieldRoot,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatch,
  colorToString,
  normalizeColor,
} from 'reka-ui'
import FormInputGroup from './FormInputGroup.vue'
import Popover from './Popover.vue'

const props = withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alpha?: boolean
  }>(),
  {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
  },
)

const model = defineModel<string>({ default: '#56d799' })

const open = ref(false)
const colorObj = ref<Color>(normalizeColor(model.value))
const hexColor = computed(() => colorToString(colorObj.value, 'hex'))

watch(hexColor, (val) => {
  model.value = val
})

watch(
  () => model.value,
  (val) => {
    const normalized = normalizeColor(val)
    if (colorToString(normalized, 'hex') !== hexColor.value) {
      colorObj.value = normalized
    }
  },
)

function handleColorUpdate(newColor: Color) {
  colorObj.value = newColor
}

function handleHexUpdate(hex: string) {
  colorObj.value = normalizeColor(hex)
}
</script>

<style scoped>
@layer components {
  .color-picker-trigger {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--size-2);
    padding: var(--ui-padding-block) var(--ui-padding-inline);
    background: var(--button-background);
    border-radius: var(--button-border-radius);
    box-shadow: var(--border-shadow);
    font-family: var(--font-family);
    font-size: var(--ui-font-size);
    cursor: pointer;
    transition:
      box-shadow var(--speed),
      background var(--speed);
    max-width: var(--color-picker-trigger-max-width);

    &:is(:hover, :focus) {
      box-shadow: var(--border-shadow-highlight);
    }

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }

  .color-picker-swatch {
    inline-size: var(--size-4);
    block-size: var(--size-4);
    border-radius: var(--border-radius);
    background-color: var(--reka-color-swatch-color);
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.15);
    flex-shrink: 0;
  }

  .color-picker {
    display: grid;
    gap: var(--spacer);
  }

  .color-picker-area {
    position: relative;
  }

  .color-picker-area-surface {
    position: relative;
    inline-size: 100%;
    block-size: var(--color-picker-area-height);
    border-radius: var(--border-radius);
    overflow: hidden;

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }

  .color-picker-thumb {
    all: unset;
    display: block;
    inline-size: var(--color-picker-thumb-size);
    block-size: var(--color-picker-thumb-size);
    border-radius: 50%;
    background: var(--color-picker-thumb-background);
    box-shadow:
      0 0 0 2px var(--color-picker-thumb-background),
      0 1px 4px rgb(0 0 0 / 0.3);
    cursor: pointer;
    transition: transform var(--speed);

    &:is(:hover, :focus) {
      transform: scale(1.1);
    }

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }

  .color-picker-slider {
    position: relative;
    display: flex;
    align-items: center;
    inline-size: 100%;
    block-size: var(--color-picker-thumb-size);
  }

  .color-picker-slider-track {
    position: relative;
    flex-grow: 1;
    block-size: var(--color-picker-track-size);
    border-radius: var(--color-picker-track-radius);
    overflow: hidden;
  }

  .color-picker-slider-track-fill {
    position: absolute;
    inset: 0;
    border-radius: var(--color-picker-track-radius);
  }

  .color-picker-alpha-track {
    background-image:
      linear-gradient(
        45deg,
        var(--color-picker-checkerboard) 25%,
        transparent 25%
      ),
      linear-gradient(
        -45deg,
        var(--color-picker-checkerboard) 25%,
        transparent 25%
      ),
      linear-gradient(
        45deg,
        transparent 75%,
        var(--color-picker-checkerboard) 75%
      ),
      linear-gradient(
        -45deg,
        transparent 75%,
        var(--color-picker-checkerboard) 75%
      );
    background-size: 8px 8px;
    background-position:
      0 0,
      0 4px,
      4px -4px,
      -4px 0;
  }

  .color-picker :deep(input) {
    text-align: center;
    font-size: var(--font-xs);
  }
}
</style>
