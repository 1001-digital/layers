<template>
  <div class="seed-phrase-input">
    <div class="seed-phrase-grid">
      <div
        v-for="(_, i) in 12"
        :key="i"
        class="seed-word"
        :class="{ invalid: words[i] && !isValidWord(words[i]) }"
      >
        <label :for="`seed-word-${i}`">{{ i + 1 }}</label>
        <input
          :id="`seed-word-${i}`"
          :ref="(el) => { if (el) inputRefs[i] = el as HTMLInputElement }"
          v-model="words[i]"
          type="text"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          :disabled="disabled"
          @keydown="onKeydown($event, i)"
          @paste="onPaste($event, i)"
          @input="onInput(i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { english } from 'viem/accounts'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  valid: [isValid: boolean]
  submit: []
}>()

const wordSet = new Set(english)

const words = ref<string[]>(Array.from({ length: 12 }, () => ''))
const inputRefs = ref<HTMLInputElement[]>([])

function isValidWord(word: string): boolean {
  return wordSet.has(word.trim().toLowerCase())
}

const isValid = computed(() =>
  words.value.every((w) => w.trim() !== '' && isValidWord(w)),
)

const phrase = computed(() =>
  words.value
    .map((w) => w.trim().toLowerCase())
    .join(' '),
)

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    const incoming = val.trim().split(/\s+/)
    if (incoming.length === 12) {
      for (let i = 0; i < 12; i++) {
        words.value[i] = incoming[i]!
      }
    }
  },
  { immediate: true },
)

watch(phrase, (val) => {
  emit('update:modelValue', val)
})

watch(isValid, (val) => {
  emit('valid', val)
})

function focusInput(index: number) {
  const el = inputRefs.value[index]
  if (el) {
    el.focus()
    el.select()
  }
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (event.key === ' ' || (event.key === 'Enter' && index < 11)) {
    event.preventDefault()
    focusInput(index + 1)
  } else if (event.key === 'Enter' && index === 11 && isValid.value) {
    event.preventDefault()
    emit('submit')
  } else if (
    event.key === 'Backspace' &&
    words.value[index] === '' &&
    index > 0
  ) {
    event.preventDefault()
    focusInput(index - 1)
  } else if (event.key === 'Tab' && !event.shiftKey && index === 11) {
    // Allow natural tab out
  } else if (event.key === 'Tab' && event.shiftKey && index === 0) {
    // Allow natural tab out
  }
}

function onPaste(event: ClipboardEvent, index: number) {
  const text = event.clipboardData?.getData('text')
  if (!text) return

  const pasted = text.trim().split(/\s+/)
  if (pasted.length > 1) {
    event.preventDefault()
    for (let i = 0; i < pasted.length && index + i < 12; i++) {
      words.value[index + i] = pasted[i]!.toLowerCase()
    }
    const nextIndex = Math.min(index + pasted.length, 11)
    focusInput(nextIndex)
  }
}

function onInput(index: number) {
  // Auto-advance if the word contains a space (mobile autocomplete)
  const val = words.value[index]
  if (val?.includes(' ')) {
    const parts = val.trim().split(/\s+/)
    words.value[index] = parts[0]!
    if (parts.length > 1 && index < 11) {
      for (let i = 1; i < parts.length && index + i < 12; i++) {
        words.value[index + i] = parts[i]!
      }
      focusInput(Math.min(index + parts.length, 11))
    }
  }
}

onMounted(() => {
  if (!props.disabled) {
    focusInput(0)
  }
})
</script>

<style scoped>
.seed-phrase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacer-sm);
}

@media (min-width: 600px) {
  .seed-phrase-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.seed-word {
  display: flex;
  align-items: center;
  gap: var(--spacer-xs);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacer-xs) var(--spacer-sm);
  transition: border-color var(--speed);

  &:focus-within {
    border-color: var(--accent);
  }

  &.invalid {
    border-color: var(--error);
  }

  label {
    font-size: var(--font-xs);
    color: var(--muted);
    min-width: 1.5em;
    text-align: right;
    user-select: none;
  }

  input {
    all: unset;
    width: 100%;
    font-size: var(--font-sm);
    font-family: var(--font-mono, monospace);
  }
}
</style>
