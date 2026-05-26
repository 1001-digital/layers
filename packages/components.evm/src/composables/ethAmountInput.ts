import { computed, ref } from 'vue'
import { parseEther } from 'viem'

export function normalizeEthAmountInput(input: unknown): string {
  const normalized = String(input ?? '').replaceAll(',', '.')
  let amount = ''
  let hasDecimal = false

  for (const char of normalized) {
    if (char >= '0' && char <= '9') {
      amount += char
      continue
    }

    if (char === '.' && !hasDecimal) {
      amount += char
      hasDecimal = true
    }
  }

  return amount
}

export function parseEthAmountInput(input: unknown): bigint | null {
  const normalized = normalizeEthAmountInput(input).trim()
  if (!normalized) return null

  try {
    const wei = parseEther(normalized)
    return wei > 0n ? wei : null
  } catch {
    return null
  }
}

export function useEthAmountInput(initialValue: unknown = '') {
  const input = ref(normalizeEthAmountInput(initialValue))

  const amount = computed<string>({
    get: () => input.value,
    set: (value) => {
      input.value = normalizeEthAmountInput(value)
    },
  })

  const wei = computed(() => parseEthAmountInput(input.value))

  return { amount, wei }
}
