import { createContext } from 'react'
import type { PendingOtpSession, StoredAuth } from './authStorage'

export type AuthContextValue = {
  auth: StoredAuth | null
  pendingOtpSession: PendingOtpSession | null
  isAuthenticated: boolean
  setAuthenticatedFromResponse: (payload: unknown) => void
  logout: () => void
  savePendingOtpSession: (payload: PendingOtpSession) => void
  clearOtpSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
