import { createContext } from 'react'

export type ToastKind = 'success' | 'error' | 'info'

export type ToastInput = {
  title: string
  description?: string
  kind?: ToastKind
}

export type ToastRecord = ToastInput & {
  id: string
}

export type ToastContextValue = {
  toast: (input: ToastInput) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
