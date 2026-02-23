import { ref } from 'vue'

export interface ConfirmOptions {
  title: string
  description?: string
  okText?: string
  cancelText?: string
}

export interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

const state = ref<ConfirmState | null>(null)

export const useConfirm = () => {
  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      state.value = { ...options, resolve }
    })
  }

  const resolve = (value: boolean) => {
    state.value?.resolve(value)
    state.value = null
  }

  return { state, confirm, resolve }
}
