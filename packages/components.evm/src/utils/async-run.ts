export interface AsyncRunGuard {
  begin: () => number | null
  invalidate: () => void
  end: (token: number) => boolean
  isActive: (token: number) => boolean
}

/**
 * Small single-flight guard for async UI actions.
 *
 * Execution ownership and UI validity are deliberately separate. Invalidating
 * a run prevents late UI writes immediately, while its execution token stays
 * locked until non-abortable wallet or receipt work has settled.
 *
 * The callback keeps framework-specific state out of the guard so it can be
 * tested without mounting a component.
 */
export function createAsyncRunGuard(
  onBusyChange: (busy: boolean) => void = () => {},
): AsyncRunGuard {
  let revision = 0
  let executionToken: number | null = null
  let validToken: number | null = null

  const begin = () => {
    if (executionToken !== null) return null

    executionToken = ++revision
    validToken = executionToken
    onBusyChange(true)
    return executionToken
  }

  const isActive = (token: number) => validToken === token

  const end = (token: number) => {
    if (executionToken !== token) return false

    executionToken = null
    validToken = null
    onBusyChange(false)
    return true
  }

  const invalidate = () => {
    if (validToken === null) return
    validToken = null
  }

  return { begin, invalidate, end, isActive }
}
