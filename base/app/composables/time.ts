import { DateTime } from 'luxon'
import type { Ref } from 'vue'

let nowInterval: NodeJS.Timeout | undefined

export const useSeconds = () => {
  const now = useState<number>('now', () => nowInSeconds())

  if (import.meta.client && !nowInterval) {
    nowInterval = setInterval(() => {
      now.value = nowInSeconds()
    }, 1000)
  }

  return now
}

export const useCountDown = (s: Ref<number | bigint>, showSecondsWithin: number = 60) => {
  const duration = computed(() => Math.abs(Number(s.value)))

  const seconds = computed(() => duration.value % 60)
  const minutes = computed(() => Math.floor(duration.value / 60) % 60)
  const hours = computed(() => Math.floor(duration.value / 60 / 60) % 24)
  const days = computed(() => Math.floor(duration.value / 60 / 60 / 24))

  const str = computed(() =>
    [
      days.value ? `${days.value}d` : null,
      hours.value ? `${hours.value}h` : null,
      minutes.value ? `${minutes.value}m` : null,
      duration.value < showSecondsWithin && seconds.value ? `${seconds.value}s` : null,
    ]
      .filter((s) => !!s)
      .join(' '),
  )

  return {
    seconds,
    minutes,
    hours,
    days,
    str,
  }
}

export const useTimeAgo = (time: Ref<string | undefined>) => {
  const ago = ref<string>()
  const now = useSeconds()

  watch(
    now,
    () => {
      if (time.value) {
        ago.value = DateTime.fromISO(time.value).toRelative({ style: 'short', locale: 'en' }) ?? undefined
      }
    },
    {
      immediate: true,
    },
  )

  return ago
}

/** @deprecated Use `useTimeAgo` instead. */
export const useSecondsAgo = (...args: Parameters<typeof useTimeAgo>) => {
  console.warn('[deprecated] useSecondsAgo is deprecated, use useTimeAgo instead.')
  return useTimeAgo(...args)
}
