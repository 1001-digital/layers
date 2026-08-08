export function isUserRejection(e: unknown): boolean {
  const re = /reject|denied|cancel/i
  let current = e as Record<string, unknown> | undefined
  while (current) {
    if ((current as { code?: number }).code === 4001) return true
    if (re.test((current as { details?: string }).details || '')) return true
    if (re.test((current as { message?: string }).message || '')) return true
    current = current.cause as Record<string, unknown> | undefined
  }
  return false
}

/**
 * Walk an error's `cause` chain and return the first numeric `code` — the
 * underlying EIP-1193 / JSON-RPC error code (e.g. `4001` user-rejected,
 * `-32603` internal error, `-32000` invalid input). viem wraps provider
 * errors several layers deep, so the code we care about is rarely on the
 * top-level object.
 */
export function getRpcErrorCode(e: unknown): number | undefined {
  let current = e as Record<string, unknown> | undefined
  while (current) {
    const code = (current as { code?: unknown }).code
    if (typeof code === 'number' && Number.isFinite(code)) return code
    current = current.cause as Record<string, unknown> | undefined
  }
  return undefined
}
