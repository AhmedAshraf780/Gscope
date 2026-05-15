import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AuthContext, type AuthContextValue } from './authContext'
import {
  clearPendingOtpSession,
  clearUserCache,
  getPendingOtpSession,
  getUserCache,
  setPendingOtpSession,
  setUserCache,
  type PendingOtpSession,
} from './authStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ gymId: number; name: string } | null>(() => {
    const cached = getUserCache()
    return cached ? { gymId: cached.gym_id, name: cached.name } : null
  })
  const [pendingOtpSession, setPendingOtpState] = useState<PendingOtpSession | null>(() =>
    getPendingOtpSession(),
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      gymId: user?.gymId ?? null,
      userName: user?.name ?? null,
      pendingOtpSession,
      login: (u) => {
        setUser({ gymId: u.gym_id, name: u.name })
        setUserCache({ gym_id: u.gym_id, name: u.name })
      },
      logout: () => {
        setUser(null)
        clearUserCache()
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
    [user, pendingOtpSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
