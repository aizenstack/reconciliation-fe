import { ref } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: number
  variant: ToastVariant
  title: string
  message?: string
  duration: number
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function pushToast(
  variant: ToastVariant,
  title: string,
  message?: string,
  duration = 5000,
) {
  const id = ++nextId
  toasts.value = [...toasts.value, { id, variant, title, message, duration }]
  if (duration > 0) {
    window.setTimeout(() => removeToast(id), duration)
  }
  return id
}

export function useToast() {
  return {
    toasts,
    dismiss: removeToast,
    success: (title: string, message?: string) => pushToast('success', title, message),
    error: (title: string, message?: string) => pushToast('error', title, message, 7000),
    info: (title: string, message?: string) => pushToast('info', title, message),
    warning: (title: string, message?: string) => pushToast('warning', title, message, 6000),
  }
}
