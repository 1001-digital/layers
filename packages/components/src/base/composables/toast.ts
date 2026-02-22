import { ref } from 'vue'

export interface ToastAction {
  label: string
  onClick: () => void
}

export type ToastVariant = 'info' | 'success' | 'error'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  action?: ToastAction
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    toasts.value.push({ ...toast, id: crypto.randomUUID() })
  }

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, add, dismiss }
}
