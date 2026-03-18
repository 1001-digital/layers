import { DateTime } from 'luxon'

export type UTCDateTime = DateTime<true>

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const daysInSeconds = (days: number): number => days * 60 * 60 * 24

export const nowInSeconds = (): number => Math.floor(Date.now() / 1000)

export const asUTCDate = (date: Date | null): UTCDateTime | null =>
  date
    ? DateTime.utc(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ) as UTCDateTime
    : null
