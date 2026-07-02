import {
  normalizeAmountInput,
  parseAmountInput,
  useAmountInput,
} from './amountInput'

export const normalizeEthAmountInput = normalizeAmountInput

export function parseEthAmountInput(input: unknown): bigint | null {
  return parseAmountInput(input, 18)
}

export function useEthAmountInput(initialValue: unknown = '') {
  const { amount, units: wei } = useAmountInput(initialValue, 18)

  return { amount, wei }
}
