const replacer = (_: string, value: unknown) => {
  if (typeof value === 'bigint') return value.toString() + 'n'
  return value
}

const reviver = (_: string, value: unknown) => {
  if (typeof value === 'string' && /^\d+n$/.test(value))
    return BigInt(value.slice(0, -1))
  return value
}

export const stringifyJSON = (obj: unknown): string =>
  JSON.stringify(obj, replacer)
export const parseJSON = (json: string): unknown => JSON.parse(json, reviver)

export const formatPrice = (num: number, digits: number = 2) =>
  num?.toLocaleString('en-US', { maximumFractionDigits: digits })
