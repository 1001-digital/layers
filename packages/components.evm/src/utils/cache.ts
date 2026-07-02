interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export function createCache<T>(ttl: number, max: number) {
  const entries = new Map<string, CacheEntry<T>>()
  const pending = new Map<string, Promise<T>>()

  function prune() {
    const now = Date.now()
    for (const [key, entry] of entries) {
      if (entry.expiresAt <= now) entries.delete(key)
    }

    if (entries.size > max) {
      const excess = entries.size - max
      const keys = entries.keys()
      for (let i = 0; i < excess; i++) {
        entries.delete(keys.next().value!)
      }
    }
  }

  function get(key: string): T | undefined {
    const entry = entries.get(key)
    if (!entry) return undefined
    if (entry.expiresAt <= Date.now()) {
      entries.delete(key)
      return undefined
    }
    // Move to end for LRU ordering
    entries.delete(key)
    entries.set(key, entry)
    return entry.data
  }

  function fetch(key: string, fn: () => Promise<T>): Promise<T> {
    const cached = get(key)
    if (cached) return Promise.resolve(cached)

    const inflight = pending.get(key)
    if (inflight) return inflight

    const promise = fn()
      .then((result) => {
        entries.set(key, { data: result, expiresAt: Date.now() + ttl })
        pending.delete(key)
        if (entries.size > max) prune()
        return result
      })
      .catch((err) => {
        pending.delete(key)
        throw err
      })

    pending.set(key, promise)
    return promise
  }

  function evict(key: string) {
    entries.delete(key)
  }

  return { get, fetch, evict }
}
