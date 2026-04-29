import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AuthContext, type AuthContextValue } from './authContext'
import {
  clearPendingOtpSession,
  clearStoredAuth,
  getPendingOtpSession,
  getResponseToken,
  getResponseUser,
  getStoredAuth,
  setPendingOtpSession,
  setStoredAuth,
  type PendingOtpSession,
  type StoredAuth,
} from './authStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth())
  const [pendingOtpSession, setPendingOtpState] = useState<PendingOtpSession | null>(() =>
    getPendingOtpSession(),
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      pendingOtpSession,
      isAuthenticated: Boolean(auth?.isAuthenticated),
      setAuthenticatedFromResponse: (payload) => {
        const nextAuth: StoredAuth = {
          isAuthenticated: true,
          token: getResponseToken(payload),
          user: getResponseUser(payload),
          raw: payload,
        }

        setAuth(nextAuth)
        setStoredAuth(nextAuth)
      },
      logout: () => {
        setAuth(null)
        clearStoredAuth()
      },
      savePendingOtpSession: (payload) => {
        setPendingOtpState(payload)
        setPendingOtpSession(payload)
      },
      clearOtpSession: () => {
        setPendingOtpState(null)
        clearPendingOtpSession()
      },
    }),
    [auth, pendingOtpSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
