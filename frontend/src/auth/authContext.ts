import { createContext } from 'react'
import type { PendingOtpSession } from './authStorage'

export type AuthContextValue = {
  isAuthenticated: boolean
  gymId: number | null
  userName: string | null
  pendingOtpSession: PendingOtpSession | null
  login: (user: { gym_id: number; name: string }) => void
  logout: () => void
  savePendingOtpSession: (payload: PendingOtpSession) => void
  clearOtpSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
