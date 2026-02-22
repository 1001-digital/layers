export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const nowInSeconds = (): number => Math.floor(Date.now() / 1000)
