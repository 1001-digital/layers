import { ref } from 'vue'

export const useClipboard = () => {
  const copied = ref(false)
  let timeout: ReturnType<typeof setTimeout> | null = null

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true

      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        copied.value = false
      }, 2000)

      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  return {
    copy,
    copied,
  }
}
