import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { parseUnits } from 'viem'

export function normalizeAmountInput(input: unknown): string {
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

export function parseAmountInput(
  input: unknown,
  decimals: number = 18,
): bigint | null {
  const normalized = normalizeAmountInput(input).trim()
  if (!normalized) return null

  try {
    const units = parseUnits(normalized, decimals)
    return units > 0n ? units : null
  } catch {
    return null
  }
}

export function useAmountInput(
  initialValue: unknown = '',
  decimals: MaybeRefOrGetter<number> = 18,
) {
  const input = ref(normalizeAmountInput(initialValue))

  const amount = computed<string>({
    get: () => input.value,
    set: (value) => {
      input.value = normalizeAmountInput(value)
    },
  })

  const units = computed(() => parseAmountInput(input.value, toValue(decimals)))

  return { amount, units }
}
