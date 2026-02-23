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
  loading?: boolean
  progress?: number | boolean
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    toasts.value.push({ ...toast, id })
    return id
  }

  const update = (id: string, partial: Partial<Omit<Toast, 'id'>>) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value[index] = { ...toasts.value[index], ...partial, id }
    }
  }

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, add, update, dismiss }
}
