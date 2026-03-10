<template>
  <Popover
    v-model:open="open"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
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
        <ColorSliderTrack class="color-picker-slider-track color-picker-alpha-track">
          <div class="color-picker-slider-track-fill" />
        </ColorSliderTrack>
        <ColorSliderThumb class="color-picker-thumb" />
      </ColorSliderRoot>

      <!-- Color Fields -->
      <div class="color-picker-fields">
        <ColorFieldRoot
          :model-value="hexColor"
          class="color-picker-field color-picker-field-hex"
          @update:model-value="handleHexUpdate"
        >
          <ColorFieldInput
            class="color-picker-input"
            placeholder="#000000"
          />
        </ColorFieldRoot>
        <ColorFieldRoot
          :model-value="colorObj"
          channel="hue"
          color-space="hsl"
          class="color-picker-field"
          @update:color="handleColorUpdate"
        >
          <ColorFieldInput
            class="color-picker-input"
            placeholder="H"
          />
        </ColorFieldRoot>
        <ColorFieldRoot
          :model-value="colorObj"
          channel="saturation"
          color-space="hsl"
          class="color-picker-field"
          @update:color="handleColorUpdate"
        >
          <ColorFieldInput
            class="color-picker-input"
            placeholder="S"
          />
        </ColorFieldRoot>
        <ColorFieldRoot
          :model-value="colorObj"
          channel="lightness"
          color-space="hsl"
          class="color-picker-field"
          @update:color="handleColorUpdate"
        >
          <ColorFieldInput
            class="color-picker-input"
            placeholder="L"
          />
        </ColorFieldRoot>
      </div>
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

watch(() => model.value, (val) => {
  const normalized = normalizeColor(val)
  if (colorToString(normalized, 'hex') !== hexColor.value) {
    colorObj.value = normalized
  }
})

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
    background: var(--input-background);
    border-radius: var(--input-border-radius);
    box-shadow: var(--border-shadow);
    font-family: var(--font-family-mono, monospace);
    font-size: var(--ui-font-size);
    cursor: pointer;
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

  .color-picker-swatch {
    inline-size: var(--size-4);
    block-size: var(--size-4);
    border-radius: var(--border-radius-sm, 4px);
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
    block-size: 10rem;
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
    inline-size: var(--slider-thumb-size);
    block-size: var(--slider-thumb-size);
    border-radius: 50%;
    background: white;
    box-shadow:
      0 0 0 2px white,
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
    block-size: var(--slider-thumb-size);
  }

  .color-picker-slider-track {
    position: relative;
    flex-grow: 1;
    block-size: var(--slider-track-size);
    border-radius: var(--slider-track-radius);
    overflow: hidden;
  }

  .color-picker-slider-track-fill {
    position: absolute;
    inset: 0;
    border-radius: var(--slider-track-radius);
  }

  .color-picker-alpha-track {
    background-image:
      linear-gradient(45deg, var(--gray-3) 25%, transparent 25%),
      linear-gradient(-45deg, var(--gray-3) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--gray-3) 75%),
      linear-gradient(-45deg, transparent 75%, var(--gray-3) 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  .color-picker-fields {
    display: flex;
    gap: var(--size-1);
  }

  .color-picker-field {
    flex: 1;
  }

  .color-picker-field-hex {
    flex: 2;
  }

  .color-picker-input {
    all: unset;
    display: block;
    box-sizing: border-box;
    inline-size: 100%;
    padding: var(--ui-padding-block) var(--size-1);
    background: var(--input-background);
    border-radius: var(--input-border-radius);
    box-shadow: var(--border-shadow);
    font-family: var(--font-family-mono, monospace);
    font-size: var(--font-xs);
    text-align: center;
    transition:
      box-shadow var(--speed),
      background var(--speed);

    &::placeholder {
      color: var(--color-muted);
    }

    &:is(:hover, :focus) {
      box-shadow: var(--border-shadow-highlight);
    }

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: -2px;
    }
  }
}
</style>
